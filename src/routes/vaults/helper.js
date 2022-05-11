import { ethers } from "ethers";
import { ADDRESSES } from "../../utils/Constants";
import oracleContractsInfo from '../../utils/contracts/oracle'
import masterContractInfo from '../../utils/contracts/master'
import { bigToDecimal } from "../../utils/helper";

const oracle = '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada'
const gasLimitConst = 1000

export async function createPool(pool, masterContract, signer, account) {
    try {
        const poolContract = new ethers.Contract(
            pool.contract.address,
            JSON.stringify(pool.contract.abi),
            signer
        );

        const tokenContract = new ethers.Contract(
            pool.token.address,
            JSON.stringify(pool.token.abi),
            signer
        );

        const pairTokenContract = new ethers.Contract(
            pool.pairToken.address,
            JSON.stringify(pool.token.abi),
            signer
        );

        const swapContract = new ethers.Contract(
            pool.swapContractInfo.address,
            JSON.stringify(pool.swapContractInfo.abi),
            signer
        );

        const oracleExchangeRate = await getOracleExchangeRate(
            pool.token.oracleId,
            signer
        );

        let tokenPairRate = oracleExchangeRate
        let askUpdatePrice = false;

        const userBorrowPart = await getUserBorrowPart(poolContract, account);
        const userCollateralShare = await getUserCollateralShare(
            poolContract,
            pool.token.decimals,
            account
        );

        let totalCollateralShare;
        try {
            totalCollateralShare = await poolContract.totalCollateralShare();
        } catch (e) {
            console.log("totalCollateralShare Err:", e);
        }

        let totalBorrow;
        try {
            const totalBorrowResp = await poolContract.totalBorrow();
            totalBorrow = totalBorrowResp.base;
        } catch (e) {
            console.log("totalBorrow Err:", e);
        }

        const dynamicBorrowAmount = await getMaxBorrow(
            masterContract,
            pool.contract.address,
            pool.pairToken.address,
            pool?.token?.decimals
        );

        let userBalance;
        try {
            userBalance = await tokenContract.balanceOf(account, {
                gasLimit: 600000,
            });
        } catch (e) {
            console.log("userBalance tokenContract Err:", e);
        }

        let userPairBalance;
        try {
            userPairBalance = await pairTokenContract.balanceOf(account, {
                gasLimit: 600000,
            });
        } catch (e) {
            console.log("userBalance pairTokenContract Err:", e);
        }

        const tokenPairPrice = 1;

        const tokenPrice = Number(
            ethers.utils.formatUnits(tokenPairRate, pool.token.decimals)
        );

        const tokenInUsd = userCollateralShare / tokenPrice;

        const maxMimBorrow = (tokenInUsd / 100) * (pool.ltv - 1);

        const borrowLeft = parseFloat(maxMimBorrow - userBorrowPart).toFixed(20);
        let re = new RegExp(
            // eslint-disable-next-line no-useless-escape
            `^-?\\d+(?:\.\\d{0,` + (4 || -1) + `})?`
        );
        const borrowLeftParsed = borrowLeft.toString().match(re)[0];
        console.log('borrow calculated', borrowLeftParsed)
        const collateralDeposited = userCollateralShare.toString().match(re)[0];

        const liquidationMultiplier = (200 - pool.ltv) / 100;

        const liquidationPrice =
            ((userBorrowPart * tokenPrice) / userCollateralShare) *
            (1 / tokenPrice) *
            liquidationMultiplier || 0;

        const totalCollateral = ethers.utils.formatUnits(totalCollateralShare, pool.token.decimals)

        const tvl = totalCollateral / tokenPrice

        const availableAUSDInPool = bigToDecimal(await masterContract.balanceOf(pool.pairToken.address, pool.contract.address), pool.token.decimals)

        const maxWithdraw = userCollateralShare - (userBorrowPart * tokenPrice)

        return {
            name: pool.name,
            id: pool.id,
            userBorrowPart,
            userCollateralShare,
            tokenInUsd,
            contractInstance: poolContract,
            masterContractInstance: masterContract,
            totalCollateralShare,
            totalCollateral,
            tvl,
            totalBorrow,
            stabilityFee: pool.stabilityFee,
            interest: pool.interest,
            userBalance,
            userPairBalance,
            ltv: pool.ltv,
            askUpdatePrice,
            initialMax: pool.initialMax,
            pairToken: pool.pairToken,
            pairTokenContract,
            tokenPairPrice,
            tokenPrice,
            dynamicBorrowAmount,
            borrowLeftParsed,
            collateralDeposited,
            liquidationPrice,
            availableAUSDInPool,
            maxWithdraw,
            token: {
                contract: tokenContract,
                name: pool.token.name,
                toFixed: pool.token.toFixed,
                address: pool.token.address,
                decimals: pool.token.decimals,
                oracleExchangeRate: tokenPairRate,
            },
            swapContract: swapContract,
        };
    } catch (e) {
        console.log('Unable to create pool')
        // throw new Error('Unable to create pool')
    }
}

export async function getOracleExchangeRate(
    oracleId,
    signer
) {
    const oracleContractInfo = oracleContractsInfo.find(
        (item) => item.id === oracleId
    );

    console.log('oracleContractInfo', oracleContractInfo)

    const oracleContract = new ethers.Contract(
        oracleContractInfo.address,
        JSON.stringify(oracleContractInfo.abi),
        signer
    );

    try {
        const bytesData = oracleContractInfo.oracleData;
        console.log('bytes data', bytesData)
        const result = await oracleContract.callStatic.get(bytesData);
        console.log('Result is: ', result);
        return result[1];
    } catch (e) {
        console.log("getOracleExchangeRate err:", e);
    }
}

export async function getContractExchangeRate(contract) {
    try {
        const rate = await contract.exchangeRate({
            gasLimit: 300000,
        });

        return rate;
    } catch (e) {
        console.log("getContractExchangeRate err:", e);
    }
}

export async function getUserCollateralShare(poolContract, decimals, account) {
    try {
        const userCollateralShare = await poolContract.userCollateralShare(
            account
        );

        const parsedCollateral = ethers.utils.formatUnits(
            userCollateralShare.toString(),
            decimals
        );

        return parsedCollateral;
    } catch (e) {
        console.log("getUserCollateralShare err:", e);
    }
}

export async function getUserBorrowPart(poolContract, account) {
    try {
        const userBorrowPart = await poolContract.userBorrowPart(account);

        const parsedBorrowed = ethers.utils.formatUnits(
            userBorrowPart.toString()
        );
        return parsedBorrowed;
    } catch (e) {
        console.log("getuserBorrowPartNonce err:", e);
    }
}

export function createCollateralInfo(userCollateralShare, userBorrowPart, tokenPrice, ltv) {
    const tokenInUsd = userCollateralShare / tokenPrice;

    const maxMimBorrow = (tokenInUsd / 100) * (ltv - 1);

    const borrowLeft = parseFloat(maxMimBorrow - userBorrowPart).toFixed(20);
    let re = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (4 || -1) + `})?`
    );
    const borrowLeftParsed = borrowLeft.toString().match(re)[0];
    const collateralDeposited = userCollateralShare.toString().match(re)[0];

    const liquidationMultiplier = (200 - ltv) / 100;

    const liquidationPrice =
        ((userBorrowPart * tokenPrice) / userCollateralShare) *
        (1 / tokenPrice) *
        liquidationMultiplier || 0;

    return [
        {
            title: "Collateral deposited",
            value: collateralDeposited,
            additional: "",
        },
        {
            title: "Collateral value",
            value: `$${parseFloat(tokenInUsd).toFixed(4)}`,
            additional: "",
        },
        {
            title: "MIM borrowed",
            value: `$${parseFloat(userBorrowPart).toFixed(4)}`,
            additional: "",
        },
        {
            title: "Liquidation price",
            value: `$${parseFloat(liquidationPrice).toFixed(4)}`,
            additional: "",
        },
        {
            title: "MIM left to borrow",
            value: `${borrowLeftParsed}`,
            additional: "",
        },
    ];
}

export async function getMaxBorrow(bentoContract, poolAddr, tokenAddr, decimals) {
    try {
        const poolBalance = await bentoContract.balanceOf(tokenAddr, poolAddr, {
            gasLimit: 1000000,
        });
        console.log("poolBalance:", poolBalance);

        const toAmount = await bentoContract.toAmount(
            tokenAddr,
            poolBalance,
            false
        );

        const parsedAmount = ethers.utils.formatUnits(toAmount, decimals);

        console.log("to amount", parsedAmount);
        return parsedAmount;
    } catch (e) {
        console.log("getMaxBorrow err:", e);
        return false;
    }
}

export function getMainInfo(ltv, stabilityFee, interest) {
    return [
        {
            title: "Maximum collateral ratio",
            value: `${ltv}%`,
            additional: `Maximum collateral ratio (MCR) - MCR represents the maximum amount of debt a user can borrow with a selected collateral token.`,
        },
        {
            title: "Liquidation fee",
            value: `${stabilityFee}%`,
            additional:
                "This is the discount a liquidator gets when buying collateral flagged for liquidation.",
        },
        {
            title: "Borrow fee",
            value: `0.05%`,
            additional:
                "This fee is added to your debt every time you borrow MIM. As an example, if you borrow 1000 MIM your debt will immediately increase by 0.50MIM and  become 1000.50MIM",
        },
        {
            title: "Interest",
            value: `${interest}%`,
            additional:
                "This is the annualized percent that your debt will increase each year.",
        },
    ];
}

async function getMasterContract(pool) {
    try {
        const masterContract = await pool.contractInstance.masterContract();
        return masterContract;
    } catch (e) {
        console.log("getMasterContract err:", e);
        throw e
    }
}

export async function isTokenApprowed(tokenContract, spenderAddress, account) {
    try {
        const addressApprowed = await tokenContract.allowance(
            account,
            spenderAddress,
            {
                gasLimit: 1000000,
            }
        );
        console.log(
            "TOKEN APPROVE:",
            addressApprowed,
            parseFloat(addressApprowed.toString()) > 0
        );
        return parseFloat(addressApprowed.toString()) > 0;
    } catch (e) {
        console.log("isApprowed err:", e);
        throw e
    }
}

export async function isApprovedFn(pool, account) {
    try {
        const masterContract = await getMasterContract(pool);
        console.log('log masterContract', masterContract)
        const addressApprowed = await pool.masterContractInstance.masterContractApproved(
            masterContract,
            account
        );
        console.log('addressApproved', addressApprowed)
        return addressApprowed;
    } catch (e) {
        console.log("isApprowed err:", e);
    }
}

export async function approveToken(tokenContract, spenderAddress) {
    console.log('spe', spenderAddress)
    try {
        const estimateGas = await tokenContract.estimateGas.approve(
            spenderAddress,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
        const gasLimit = gasLimitConst + +estimateGas.toString();
        console.log("gasLimit:", gasLimit);
        console.log('tokenContract: ', tokenContract)
        const tx = await tokenContract.approve(
            spenderAddress,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            {
                gasLimit
            }
        );
        console.log('trans: ', tx)
        const receipt = await tx.wait();
        console.log("APPROVE RESP:", receipt);
        return true;
    } catch (e) {
        console.log("isApprowed err:", e);
        return false;
    }
}

function getDepositEncode(amount, pool, account) {
    return ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pool.token.address, account, amount, "0"]
    );
}

function getBorrowEncode(borrow, account) {
    return ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [borrow, account]
    );
}

function getAddCollateralEncode(account) {
    return ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-2", account, false]
    );
}

async function getGasPrice(signer) {
    try {
        const gasPrice = await signer.getGasPrice();
        return gasPrice;
    } catch (e) {
        console.log("getGasPrice err:", e);
    }
}

function getUpdateRateEncode() {
    return ethers.utils.defaultAbiCoder.encode(
        ["bool", "uint256", "uint256"],
        [true, "0x00", "0x00"]
    );
}

async function getVerifyingContract(pool) {
    try {
        const verifyingContract = await pool.contractInstance.bentoBox();
        return verifyingContract;
    } catch (e) {
        console.log("getVerifyingContract err:", e);
    }
}

async function getNonce(pool, account) {
    try {
        const nonces = await pool.masterContractInstance.nonces(
            account
        );
        console.log("NONCE:", nonces.toString());
        return nonces.toString();
    } catch (e) {
        console.log("getNonce err:", e);
    }
}

function parseSignature(signature) {
    const parsedSignature = signature.substring(2);
    var r = parsedSignature.substring(0, 64);
    var s = parsedSignature.substring(64, 128);
    var v = parsedSignature.substring(128, 130);
    return {
        r: "0x" + r,
        s: "0x" + s,
        v: parseInt(v, 16),
    };
}

async function getApprovalEncode(pool, account, signer) {
    console.log('1')
    const verifyingContract = await getVerifyingContract(pool);
    console.log('2', verifyingContract)
    const masterContract = await getMasterContract(pool);
    console.log('3', masterContract)
    const nonce = await getNonce(pool, account);
    console.log('4')
    // ToDo : This has to be changed
    const chainId = '0x89'
    // const chainId = this.$store.getters.getActiveChain.code;
    const domain = {
        name: "BentoBox V1",
        chainId,
        verifyingContract,
    };
    // The named list of all type definitions
    const types = {
        SetMasterContractApproval: [
            { name: "warning", type: "string" },
            { name: "user", type: "address" },
            { name: "masterContract", type: "address" },
            { name: "approved", type: "bool" },
            { name: "nonce", type: "uint256" },
        ],
    };
    // The data to sign
    const value = {
        warning: "Give FULL access to funds in (and approved to) BentoBox?",
        user: account,
        masterContract,
        approved: true,
        nonce,
    };
    console.log(chainId);
    let signature;
    try {
        signature = await signer._signTypedData(domain, types, value);
    } catch (e) {
        console.log("SIG ERR:", e.code);
        if (e.code === -32603) {
            return "ledger";
        }
        return false;
    }
    console.log('signature', signature)
    const parsedSignature = parseSignature(signature);
    return ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "bool", "uint8", "bytes32", "bytes32"],
        [
            account,
            masterContract,
            true,
            parsedSignature.v,
            parsedSignature.r,
            parsedSignature.s,
        ]
    )
}

function getBentoWithdrawEncode(amount, pool, account) {
    const pairToken = pool.pairToken.address;
    return ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, account, amount, "0x0"]
    );
}

async function approveMasterContract(pool, account) {
    try {
        const masterContract = await getMasterContract(pool);
        console.log(
            "approveMasterContract",
            account,
            masterContract,
            true,
            ethers.utils.formatBytes32String(""),
            ethers.utils.formatBytes32String(""),
            ethers.utils.formatBytes32String("")
        );
        const tx = await pool.masterContractInstance.setMasterContractApproval(
            account,
            masterContract,
            true,
            ethers.utils.formatBytes32String(""),
            ethers.utils.formatBytes32String(""),
            ethers.utils.formatBytes32String("")
        );
        const receipt = await tx.wait();
        return receipt;
    } catch (e) {
        console.log("approveMasterContract err:", e);
        return false;
    }
}

export async function cookAddCollateral({ amount, updatePrice }, isApprowed, pool, account, signer) {
    try {
        const depositEncode = getDepositEncode(amount, pool, account);
        const colateralEncode = getAddCollateralEncode(account);
        const gasPrice = await getGasPrice(signer);
        console.log("GAS PRICE:", gasPrice);
        if (isApprowed) {
            console.log("APPROWED");
            if (updatePrice) {
                const updateEncode = getUpdateRateEncode();
                const estimateGas = await pool.contractInstance.estimateGas.cook(
                    [11, 20, 10],
                    [0, 0, 0],
                    [updateEncode, depositEncode, colateralEncode],
                    {
                        value: 0,
                        // gasPrice,
                        // gasLimit: 1000000,
                    }
                );
                const gasLimit = gasLimitConst + +estimateGas.toString();
                console.log("gasLimit:", gasLimit);

                const result = await pool.contractInstance.cook(
                    [11, 20, 10],
                    [0, 0, 0],
                    [updateEncode, depositEncode, colateralEncode],
                    {
                        value: 0,
                        // gasPrice,
                        gasLimit,
                    }
                );
                await result.wait()
                return result;
            }
            const estimateGas = await pool.contractInstance.estimateGas.cook(
                [20, 10],
                [0, 0],
                [depositEncode, colateralEncode],
                {
                    value: 0,
                    // gasPrice,
                    // gasLimit: 1000000,
                }
            );
            const gasLimit = gasLimitConst + +estimateGas.toString();
            console.log("gasLimitt:", gasLimit);

            const result = await pool.contractInstance.cook(
                [20, 10],
                [0, 0],
                [depositEncode, colateralEncode],
                {
                    value: 0,
                    // gasPrice,
                    gasLimit,
                }
            );
            await result.wait()
            return result;
        }
        console.log("NOT APPROWED");
        const approvalEncode = await getApprovalEncode(pool, account, signer);
        console.log("approvalEncode result:", approvalEncode);
        if (approvalEncode === "ledger") {
            const approvalMaster = await approveMasterContract(pool, account);
            console.log("approveMasterContract resp: ", approvalMaster);
            if (!approvalMaster) {
                throw new Error('Approval Master Failed')
            }
            if (updatePrice) {
                const updateEncode = getUpdateRateEncode();
                const estimateGas = await pool.contractInstance.estimateGas.cook(
                    [11, 20, 10],
                    [0, 0, 0],
                    [updateEncode, depositEncode, colateralEncode],
                    {
                        value: 0,
                        // gasPrice,
                        // gasLimit: 1000000,
                    }
                );
                const gasLimit = gasLimitConst + +estimateGas.toString();
                console.log("gasLimit:", gasLimit);

                const result = await pool.contractInstance.cook(
                    [11, 20, 10],
                    [0, 0, 0],
                    [updateEncode, depositEncode, colateralEncode],
                    {
                        value: 0,
                        // gasPrice,
                        gasLimit,
                    }
                );
                await result.wait()
                return result;
            }
            const estimateGas = await pool.contractInstance.estimateGas.cook(
                [20, 10],
                [0, 0],
                [depositEncode, colateralEncode],
                {
                    value: 0,
                    // gasPrice,
                    // gasLimit: 1000000,
                }
            );
            const gasLimit = gasLimitConst + +estimateGas.toString();
            console.log("gasLimit:", gasLimit);

            const result = await pool.contractInstance.cook(
                [20, 10],
                [0, 0],
                [depositEncode, colateralEncode],
                {
                    value: 0,
                    // gasPrice,
                    gasLimit,
                }
            );
            await result.wait()
            return result;
        }
        if (updatePrice) {
            const updateEncode = getUpdateRateEncode();
            const estimateGas = await pool.contractInstance.estimateGas.cook(
                [24, 11, 20, 10],
                [0, 0, 0, 0],
                [approvalEncode, updateEncode, depositEncode, colateralEncode],
                {
                    value: 0,
                    // gasPrice,
                    // gasLimit: 1000000,
                }
            );
            const gasLimit = gasLimitConst + +estimateGas.toString();
            console.log("gasLimit:", gasLimit);

            const result = await pool.contractInstance.cook(
                [24, 11, 20, 10],
                [0, 0, 0, 0],
                [approvalEncode, updateEncode, depositEncode, colateralEncode],
                {
                    value: 0,
                    // gasPrice,
                    gasLimit,
                }
            );
            await result.wait()
            return result;
        }

        const estimateGas = await pool.contractInstance.estimateGas.cook(
            [24, 20, 10],
            [0, 0, 0],
            [approvalEncode, depositEncode, colateralEncode],
            {
                value: 0,
                // gasPrice,
                // gasLimit: 1000000,
            }
        );
        const gasLimit = gasLimitConst + +estimateGas.toString();
        console.log("gasLimit:", gasLimit);

        const result = await pool.contractInstance.cook(
            [24, 20, 10],
            [0, 0, 0],
            [approvalEncode, depositEncode, colateralEncode],
            {
                value: 0,
                // gasPrice,
                gasLimit,
            }
        );
        await result.wait()
        return result
    } catch (e) {
        throw e
    }
}

export async function cookBorrow({ amount, updatePrice }, isApprowed, pool, account, signer) {
    try {
        const borrowEncode = getBorrowEncode(amount, account);
        const bentoWithdrawEncode = getBentoWithdrawEncode(amount, pool, account);
        const gasPrice = await getGasPrice(signer);
        console.log("GAS PRICE:", gasPrice);
        if (isApprowed) {
            console.log("APPROWED");
            if (updatePrice) {
                const updateEncode = getUpdateRateEncode();
                const estimateGas = await pool.contractInstance.estimateGas.cook(
                    [11, 5, 21],
                    [0, 0, 0],
                    [updateEncode, borrowEncode, bentoWithdrawEncode],
                    {
                        value: 0,
                        // gasPrice,
                        // gasLimit: 1000000,
                    }
                );
                const gasLimit = gasLimitConst + +estimateGas.toString();
                console.log("gasLimit:", gasLimit);
                const result = await pool.contractInstance.cook(
                    [11, 5, 21],
                    [0, 0, 0],
                    [updateEncode, borrowEncode, bentoWithdrawEncode],
                    {
                        value: 0,
                        // gasPrice,
                        gasLimit,
                    }
                );
                await result.wait()
                console.log(result);
                return result;
            }
            const estimateGas = await pool.contractInstance.estimateGas.cook(
                [5, 21],
                [0, 0],
                [borrowEncode, bentoWithdrawEncode],
                {
                    value: 0,
                    // gasPrice,
                    // gasLimit: 1000000,
                }
            );
            const gasLimit = gasLimitConst + +estimateGas.toString();
            console.log("gasLimit:", gasLimit);
            const result = await pool.contractInstance.cook(
                [5, 21],
                [0, 0],
                [borrowEncode, bentoWithdrawEncode],
                {
                    value: 0,
                    // gasPrice,
                    gasLimit,
                }
            );
            await result.wait()
            console.log(result);
            return result;
        }
        console.log("NOT APPROWED");
        const approvalEncode = await getApprovalEncode(pool, account, signer);
        if (approvalEncode === "ledger") {
            const approvalMaster = await approveMasterContract(pool, account);
            console.log("approveMasterContract resp: ", approvalMaster);
            if (!approvalMaster) {
                throw new Error('Approval Master Failed')
            }
            if (updatePrice) {
                const updateEncode = getUpdateRateEncode();
                const estimateGas = await pool.contractInstance.estimateGas.cook(
                    [11, 5, 21],
                    [0, 0, 0],
                    [updateEncode, borrowEncode, bentoWithdrawEncode],
                    {
                        value: 0,
                        // gasPrice,
                        // gasLimit: 1000000,
                    }
                );
                const gasLimit = gasLimitConst + +estimateGas.toString();
                console.log("gasLimit:", gasLimit);
                const result = await pool.contractInstance.cook(
                    [11, 5, 21],
                    [0, 0, 0],
                    [updateEncode, borrowEncode, bentoWithdrawEncode],
                    {
                        value: 0,
                        // gasPrice,
                        gasLimit,
                    }
                );
                await result.wait()
                console.log(result);
                return result;
            }
            const estimateGas = await this.pool.contractInstance.estimateGas.cook(
                [5, 21],
                [0, 0],
                [borrowEncode, bentoWithdrawEncode],
                {
                    value: 0,
                    // gasPrice,
                    // gasLimit: 1000000,
                }
            );
            const gasLimit = this.gasLimitConst + +estimateGas.toString();
            console.log("gasLimit:", gasLimit);
            const result = await this.pool.contractInstance.cook(
                [5, 21],
                [0, 0],
                [borrowEncode, bentoWithdrawEncode],
                {
                    value: 0,
                    // gasPrice,
                    gasLimit,
                }
            );
            await result.wait()
            console.log(result);
            return result;
        }
        if (updatePrice) {
            const updateEncode = getUpdateRateEncode();
            const estimateGas = await pool.contractInstance.estimateGas.cook(
                [24, 11, 5, 21],
                [0, 0, 0, 0],
                [approvalEncode, updateEncode, borrowEncode, bentoWithdrawEncode],
                {
                    value: 0,
                    // gasPrice,
                    // gasLimit: 1000000,
                }
            );
            const gasLimit = gasLimitConst + +estimateGas.toString();
            console.log("gasLimit:", gasLimit);
            const result = await pool.contractInstance.cook(
                [24, 11, 5, 21],
                [0, 0, 0, 0],
                [approvalEncode, updateEncode, borrowEncode, bentoWithdrawEncode],
                {
                    value: 0,
                    // gasPrice,
                    gasLimit,
                }
            );
            await result.wait()
            console.log(result);
            return result;
        }
        const estimateGas = await pool.contractInstance.estimateGas.cook(
            [24, 5, 21],
            [0, 0, 0],
            [approvalEncode, borrowEncode, bentoWithdrawEncode],
            {
                value: 0,
                // gasPrice,
                // gasLimit: 1000000,
            }
        );
        const gasLimit = gasLimitConst + +estimateGas.toString();
        console.log("gasLimit:", gasLimit);
        const result = await pool.contractInstance.cook(
            [24, 5, 21],
            [0, 0, 0],
            [approvalEncode, borrowEncode, bentoWithdrawEncode],
            {
                value: 0,
                // gasPrice,
                gasLimit,
            }
        );
        await result.wait()
        console.log(result);
        return result
    } catch (e) {
        throw e
    }
}

export async function cookRepay({ amount, updatePrice }, isApprowed, pool, account, signer) {
    try {
        const pairToken = pool.pairToken.address;
        const depositEncode = ethers.utils.defaultAbiCoder.encode(
            ["address", "address", "int256", "int256"],
            [pairToken, account, amount, "0x0"]
        );
        const getRepayPartEncode = ethers.utils.defaultAbiCoder.encode(
            ["int256"],
            ["-0x01"]
        );
        const repayEncode = ethers.utils.defaultAbiCoder.encode(
            ["int256", "address", "bool"],
            ["-0x01", account, false]
        );
        const gasPrice = await getGasPrice(signer);
        console.log("GAS PRICE:", gasPrice);
        if (isApprowed) {
            console.log("APPROWED");
            if (updatePrice) {
                const updateEncode = getUpdateRateEncode();
                const estimateGas = await pool.contractInstance.estimateGas.cook(
                    [11, 20, 7, 2],
                    [0, 0, 0, 0],
                    [updateEncode, depositEncode, getRepayPartEncode, repayEncode],
                    {
                        value: "0",
                    }
                );
                const gasLimit = gasLimitConst + +estimateGas.toString();
                console.log("gasLimit:", gasLimit);
                const result = await pool.contractInstance.cook(
                    [11, 20, 7, 2],
                    [0, 0, 0, 0],
                    [updateEncode, depositEncode, getRepayPartEncode, repayEncode],
                    {
                        value: "0",
                        gasLimit,
                    }
                );
                await result.wait()
                console.log(result);
                return result;
            }
            const estimateGas = await pool.contractInstance.estimateGas.cook(
                [20, 7, 2],
                [0, 0, 0],
                [depositEncode, getRepayPartEncode, repayEncode],
                {
                    value: "0",
                    // gasPrice,
                    // gasLimit: 1000000,
                }
            );
            const gasLimit = gasLimitConst + +estimateGas.toString();
            console.log("gasLimit:", gasLimit);
            const result = await pool.contractInstance.cook(
                [20, 7, 2],
                [0, 0, 0],
                [depositEncode, getRepayPartEncode, repayEncode],
                {
                    value: "0",
                    // gasPrice,
                    gasLimit,
                }
            );
            await result.wait()
            console.log(result);
            return result
        } else {
            console.log("NOT APPROWED");
            const approvalEncode = await getApprovalEncode(pool, account, signer);
            console.log("approvalEncode result:", approvalEncode);
            if (approvalEncode === "ledger") {
                const approvalMaster = await approveMasterContract(pool, account);
                console.log("approveMasterContract resp: ", approvalMaster);
                if (!approvalMaster) {
                    throw new Error('Approval Master Failed')
                }
                if (updatePrice) {
                    const updateEncode = getUpdateRateEncode();
                    const estimateGas = await pool.contractInstance.estimateGas.cook(
                        [11, 20, 7, 2],
                        [0, 0, 0, 0],
                        [updateEncode, depositEncode, getRepayPartEncode, repayEncode],
                        {
                            value: "0",
                            // gasPrice,
                            // gasLimit: 1000000,
                        }
                    );
                    const gasLimit = gasLimitConst + +estimateGas.toString();
                    console.log("gasLimit:", gasLimit);
                    const result = await pool.contractInstance.cook(
                        [11, 20, 7, 2],
                        [0, 0, 0, 0],
                        [updateEncode, depositEncode, getRepayPartEncode, repayEncode],
                        {
                            value: "0",
                            // gasPrice,
                            gasLimit,
                        }
                    );
                    await result.wait()
                    console.log(result);
                    return result;
                }
                const estimateGas = await pool.contractInstance.estimateGas.cook(
                    [20, 7, 2],
                    [0, 0, 0],
                    [depositEncode, getRepayPartEncode, repayEncode],
                    {
                        value: "0",
                        // gasPrice,
                        // gasLimit: 1000000,
                    }
                );
                const gasLimit = gasLimitConst + +estimateGas.toString();
                console.log("gasLimit:", gasLimit);
                const result = await pool.contractInstance.cook(
                    [20, 7, 2],
                    [0, 0, 0],
                    [depositEncode, getRepayPartEncode, repayEncode],
                    {
                        value: "0",
                        // gasPrice,
                        gasLimit,
                    }
                );
                await result.wait()
                console.log(result);
                return result;
            }
            if (updatePrice) {
                const updateEncode = getUpdateRateEncode();
                const estimateGas = await pool.contractInstance.estimateGas.cook(
                    [24, 11, 20, 7, 2],
                    [0, 0, 0, 0, 0],
                    [
                        approvalEncode,
                        updateEncode,
                        depositEncode,
                        getRepayPartEncode,
                        repayEncode,
                    ],
                    {
                        value: "0",
                        // gasPrice,
                        // gasLimit: 1000000,
                    }
                );
                const gasLimit = gasLimitConst + +estimateGas.toString();
                console.log("gasLimit:", gasLimit);
                const result = await pool.contractInstance.cook(
                    [24, 11, 20, 7, 2],
                    [0, 0, 0, 0, 0],
                    [
                        approvalEncode,
                        updateEncode,
                        depositEncode,
                        getRepayPartEncode,
                        repayEncode,
                    ],
                    {
                        value: "0",
                        // gasPrice,
                        gasLimit,
                    }
                );
                await result.wait()
                console.log(result);
                return result;
            }
            const estimateGas = await pool.contractInstance.estimateGas.cook(
                [24, 20, 7, 2],
                [0, 0, 0, 0],
                [approvalEncode, depositEncode, getRepayPartEncode, repayEncode],
                {
                    value: "0",
                    // gasPrice,
                    // gasLimit: 1000000,
                }
            );
            const gasLimit = gasLimitConst + +estimateGas.toString();
            console.log("gasLimit:", gasLimit);
            const result = await pool.contractInstance.cook(
                [24, 20, 7, 2],
                [0, 0, 0, 0],
                [approvalEncode, depositEncode, getRepayPartEncode, repayEncode],
                {
                    value: "0",
                    // gasPrice,
                    gasLimit,
                }
            );
            await result.wait()
            console.log(result);
            return result
        }
    } catch (e) {
        throw e
    }
}

export async function cookRemoveCollateral({ amount, updatePrice }, isApprowed, pool, account, signer) {
    try {
        const removeCollateral = ethers.utils.defaultAbiCoder.encode(
            ["int256", "address"],
            [amount, account]
        );
        const bentoWithdrawEncode = ethers.utils.defaultAbiCoder.encode(
            ["address", "address", "int256", "int256"],
            [pool.token.address, account, "0x00", amount]
        );
        const gasPrice = await getGasPrice(signer);
        console.log("GAS PRICE:", gasPrice);
        if (isApprowed) {
            console.log("APPROWED");
            if (updatePrice) {
                const updateEncode = getUpdateRateEncode();
                const estimateGas = await pool.contractInstance.estimateGas.cook(
                    [11, 4, 21],
                    [0, 0, 0],
                    [updateEncode, removeCollateral, bentoWithdrawEncode],
                    {
                        value: "0",
                        // gasPrice,
                        // gasLimit: 1000000,
                    }
                );
                const gasLimit = gasLimitConst + +estimateGas.toString();
                console.log("gasLimit:", gasLimit);
                const result = await pool.contractInstance.cook(
                    [11, 4, 21],
                    [0, 0, 0],
                    [updateEncode, removeCollateral, bentoWithdrawEncode],
                    {
                        value: "0",
                        // gasPrice,
                        gasLimit,
                    }
                );
                await result.wait()
                console.log(result);
                return result;
            }
            const estimateGas = await pool.contractInstance.estimateGas.cook(
                [4, 21],
                [0, 0],
                [removeCollateral, bentoWithdrawEncode],
                {
                    value: "0",
                    // gasPrice,
                    // gasLimit: 1000000,
                }
            );
            const gasLimit = gasLimitConst + +estimateGas.toString();
            console.log("gasLimit:", gasLimit);

            const result = await pool.contractInstance.cook(
                [4, 21],
                [0, 0],
                [removeCollateral, bentoWithdrawEncode],
                {
                    value: "0",
                    // gasPrice,
                    gasLimit,
                }
            );
            await result.wait()
            console.log(result);
            return result
        } else {
            console.log("NOT APPROWED");
            const approvalEncode = await getApprovalEncode(pool, account, signer);
            console.log("approvalEncode result:", approvalEncode);
            if (approvalEncode === "ledger") {
                const approvalMaster = await approveMasterContract(pool, account);
                console.log("approveMasterContract resp: ", approvalMaster);
                if (!approvalMaster) {
                    throw new Error('Approval Master Failed')
                }
                if (updatePrice) {
                    const updateEncode = getUpdateRateEncode();
                    const estimateGas = await pool.contractInstance.estimateGas.cook(
                        [11, 4, 21],
                        [0, 0, 0],
                        [updateEncode, removeCollateral, bentoWithdrawEncode],
                        {
                            value: "0",
                            // gasPrice,
                            // gasLimit: 1000000,
                        }
                    );
                    const gasLimit = gasLimitConst + +estimateGas.toString();
                    console.log("gasLimit:", gasLimit);
                    const result = await pool.contractInstance.cook(
                        [11, 4, 21],
                        [0, 0, 0],
                        [updateEncode, removeCollateral, bentoWithdrawEncode],
                        {
                            value: "0",
                            // gasPrice,
                            gasLimit,
                        }
                    );
                    await result.wait()
                    console.log(result);
                    return result;
                }
                const estimateGas = await pool.contractInstance.estimateGas.cook(
                    [4, 21],
                    [0, 0],
                    [removeCollateral, bentoWithdrawEncode],
                    {
                        value: "0",
                        // gasPrice,
                        // gasLimit: 1000000,
                    }
                );
                const gasLimit = gasLimitConst + +estimateGas.toString();
                console.log("gasLimit:", gasLimit);
                const result = await pool.contractInstance.cook(
                    [4, 21],
                    [0, 0],
                    [removeCollateral, bentoWithdrawEncode],
                    {
                        value: "0",
                        // gasPrice,
                        gasLimit,
                    }
                );
                await result.wait()
                console.log(result);
                return result;
            }
            if (updatePrice) {
                const updateEncode = getUpdateRateEncode();
                const estimateGas = await pool.contractInstance.estimateGas.cook(
                    [24, 11, 4, 21],
                    [0, 0, 0, 0],
                    [
                        approvalEncode,
                        updateEncode,
                        removeCollateral,
                        bentoWithdrawEncode,
                    ],
                    {
                        value: "0",
                        // gasPrice,
                        // gasLimit: 1000000,
                    }
                );
                const gasLimit = gasLimitConst + +estimateGas.toString();
                console.log("gasLimit:", gasLimit);
                const result = await pool.contractInstance.cook(
                    [24, 11, 4, 21],
                    [0, 0, 0, 0],
                    [
                        approvalEncode,
                        updateEncode,
                        removeCollateral,
                        bentoWithdrawEncode,
                    ],
                    {
                        value: "0",
                        // gasPrice,
                        gasLimit,
                    }
                );
                await result.wait()
                console.log(result);
                return result;
            }
            const estimateGas = await pool.contractInstance.estimateGas.cook(
                [24, 4, 21],
                [0, 0, 0],
                [approvalEncode, removeCollateral, bentoWithdrawEncode],
                {
                    value: "0",
                    // gasPrice,
                    // gasLimit: 1000000,
                }
            );
            const gasLimit = gasLimitConst + +estimateGas.toString();
            console.log("gasLimit:", gasLimit);
            const result = await pool.contractInstance.cook(
                [24, 4, 21],
                [0, 0, 0],
                [approvalEncode, removeCollateral, bentoWithdrawEncode],
                {
                    value: "0",
                    // gasPrice,
                    gasLimit,
                }
            );
            await result.wait()
            console.log(result);
            return result
        }
    } catch (e) {
        throw e
    }
}

export async function getMaticBalanceFn(pool, signer, account) {
    const tokenContract = new ethers.Contract(
        ADDRESSES.MATIC,
        JSON.stringify(pool.token.abi),
        signer
    );
    const bal = await tokenContract.balanceOf(account)
    return bigToDecimal(bal, pool.token.decimals)
}

export async function getTokenBalanceFn(pool, signer, account) {
    const tokenContract = new ethers.Contract(
        pool.token.address,
        JSON.stringify(pool.token.abi),
        signer
    );
    const bal = await tokenContract.balanceOf(account)
    return bigToDecimal(bal, pool.token.decimals)
}

export async function depositMatic(pool, signer, amount) {
    try {
        const result = await signer.sendTransaction({ to: pool.token.address, value: amount })
        await result.wait()
        console.log('deposit result', result.toString())
    } catch (e) {
        throw e
    }
}

export async function withdrawMatic(pool, signer, amount) {
    try {
        const tokenContract = new ethers.Contract(
            pool.token.address,
            JSON.stringify(pool.token.abi),
            signer
        );
        console.log('withdrawing...', tokenContract)
        const result = await tokenContract.withdraw(amount)
        await result.wait()
        console.log('withdraw result', result)
    } catch (e) {
        throw e
    }
}

export async function getAUSDBalanceFn(pool, signer, account) {
    console.log('Pool:', pool)
    const tokenContract = new ethers.Contract(
        pool.pairToken.address,
        JSON.stringify(pool.pairToken.abi),
        signer
    );
    const bal = await tokenContract.balanceOf(account)
    return bigToDecimal(bal)
}

