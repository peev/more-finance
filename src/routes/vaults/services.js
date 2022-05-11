import masterContractInfo from '../../utils/contracts/master'
import poolsInfo from '../../utils/contracts/pools'
import { ethers } from 'ethers';
import { approveToken, cookAddCollateral, cookBorrow, cookRemoveCollateral, cookRepay, createPool, depositMatic, getAUSDBalanceFn, getMaticBalanceFn, getTokenBalanceFn, isApprovedFn, isTokenApprowed, withdrawMatic } from './helper';

export async function createPoolsService(provider) {
  const chainId = await provider.request({ method: "eth_chainId" });
  console.log('chain id', chainId)
  const accounts = await provider.request({ method: "eth_accounts" });
  const signer = new ethers.providers.Web3Provider(provider).getSigner()
  const account = accounts[0]

  const chainMasterContract = masterContractInfo.find(
    (contract) => contract.contractChain === chainId
  );

  if (!chainMasterContract) {
    console.log("No master Contract");
    return false;
  }

  const masterContract = new ethers.Contract(
    chainMasterContract.address,
    JSON.stringify(chainMasterContract.abi),
    signer
  );

  const chainPools = poolsInfo.filter(
    (pool) => pool.contractChain === chainId
  );

  const pools = await Promise.all(
    chainPools.map((pool) => createPool(pool, masterContract, signer, account))
  );

  console.log("STAND CREATED POOLS:", pools);
  return pools
}

export async function createPoolById(provider, poolId) {
  const chainId = await provider.request({ method: "eth_chainId" });
  console.log('chain id', chainId)
  const accounts = await provider.request({ method: "eth_accounts" });
  const signer = new ethers.providers.Web3Provider(provider).getSigner()
  const account = accounts[0]

  const chainMasterContract = masterContractInfo.find(
    (contract) => contract.contractChain === chainId
  );

  if (!chainMasterContract) {
    console.log("No master Contract");
    return false;
  }

  const masterContract = new ethers.Contract(
    chainMasterContract.address,
    JSON.stringify(chainMasterContract.abi),
    signer
  );

  const chainPools = poolsInfo.filter(
    (pool) => pool.contractChain === chainId
  );

  const pool = chainPools.find(pool => pool.id === poolId)

  return await createPool(pool, masterContract, signer, account)
}

export async function getUpdatedPoolsList(poolId, pools, provider) {
  const updatedPool = await createPoolById(provider, poolId)
  if (!updatedPool) return []
  return pools.map(p => {
    if (p.id === updatedPool.id) return updatedPool
    return p
  })
}

export async function addCollateralService(amount, poolId, pools, provider) {
  try {
    // Fix Todos.
    const accounts = await provider.request({ method: "eth_accounts" });
    const signer = new ethers.providers.Web3Provider(provider).getSigner()
    const account = accounts[0]

    const pool = pools.find(pool => pool.id === poolId)

    const data = {
      amount: ethers.utils.parseUnits(amount, pool?.token?.decimals),
      updatePrice: false,
    };

    const isTokenApprove = await isTokenApprowed(
      pool.token.contract,
      pool.masterContractInstance.address,
      account
    );
    const isApproved = await isApprovedFn(pool, account);
    if (isTokenApprove) {
      return await cookAddCollateral(data, isApproved, pool, account, signer);
    }
    const approveResult = await approveToken(
      pool.token.contract,
      pool.masterContractInstance.address
    );
    if (approveResult) {
      return await cookAddCollateral(data, isApproved, pool, account, signer);
    }
  } catch (e) {
    throw e
  }
}

export async function borrowAUSDService(amount, poolId, pools, provider) {
  try {
    
    const accounts = await provider.request({ method: "eth_accounts" });
    const signer = new ethers.providers.Web3Provider(provider).getSigner()
    const account = accounts[0]

    const pool = pools.find(pool => pool.id === poolId)

    const data = {
      amount: ethers.utils.parseUnits(amount, pool?.token?.decimals),
      updatePrice: false,
    };

    const isTokenApprove = await isTokenApprowed(
      pool.token.contract,
      pool.masterContractInstance.address,
      account
    );
    const isApprowed = await isApprovedFn(pool, account);
    if (isTokenApprove) {
      return await cookBorrow(data, isApprowed, pool, account, signer);
    }
    const approveResult = await approveToken(
      pool.token.contract,
      pool.masterContractInstance.address
    );
    if (approveResult) {
      return await cookBorrow(data, isApprowed, pool, account, signer);
    }
  } catch (e) {
    throw e
  }
}

export async function repayAUSDService(amount, poolId, pools, provider) {
  try {
    const accounts = await provider.request({ method: "eth_accounts" });
    const signer = new ethers.providers.Web3Provider(provider).getSigner()
    const account = accounts[0]

    const pool = pools.find(pool => pool.id === poolId)

    const data = {
      amount: ethers.utils.parseUnits(amount, pool?.token?.decimals),
      updatePrice: false,
    };

    const isTokenApprove = await isTokenApprowed(
      pool.pairTokenContract,
      pool.masterContractInstance.address,
      account
    );
    const isApprowed = await isApprovedFn(pool, account);
    if (isTokenApprove) {
      return await cookRepay(data, isApprowed, pool, account, signer);
    }
    const approveResult = await approveToken(
      pool.pairTokenContract,
      pool.masterContractInstance.address
    );
    if (approveResult) {
      return await cookRepay(data, isApprowed, pool, account, signer);
    }
  } catch (e) {
    throw e
  }
}

export async function removeCollateralService(amount, poolId, pools, provider, hideLoader) {
  try {

    const accounts = await provider.request({ method: "eth_accounts" });
    const signer = new ethers.providers.Web3Provider(provider).getSigner()
    const account = accounts[0]

    const pool = pools.find(pool => pool.id === poolId)

    const data = {
      amount: ethers.utils.parseUnits(amount, pool?.token?.decimals),
      updatePrice: false,
    };

    const isApprowed = await isApprovedFn(pool, account);
    return await cookRemoveCollateral(data, isApprowed, pool, account, signer, hideLoader);
  } catch (e) {
    throw e
  }
}

export async function getMaticBalanceService(provider) {
  const chainId = await provider.request({ method: "eth_chainId" });
  const accounts = await provider.request({ method: "eth_accounts" });
  const signer = new ethers.providers.Web3Provider(provider).getSigner()
  const account = accounts[0]

  const chainPools = poolsInfo.filter(
    (pool) => pool.contractChain === chainId
  );

  const pool = chainPools.find((pool) => pool.id === 1)

  const matic = await getMaticBalanceFn(pool, signer, account)
  const wmatic = await getTokenBalanceFn(pool, signer, account)
  return { matic, wmatic }
}

export async function wrapMaticService(provider, amount) {
  try {
    const chainId = await provider.request({ method: "eth_chainId" });
    const signer = new ethers.providers.Web3Provider(provider).getSigner()

    const chainPools = poolsInfo.filter(
      (pool) => pool.contractChain === chainId
    );

    const pool = chainPools.find((pool) => pool.name === 'POLYGON')
    await depositMatic(pool, signer, ethers.utils.parseUnits(amount, pool?.token?.decimals))
  } catch (e) {
    throw e
  }
}

export async function unWrapMaticService(provider, amount) {
  try {
    const chainId = await provider.request({ method: "eth_chainId" });
    const signer = new ethers.providers.Web3Provider(provider).getSigner()

    const chainPools = poolsInfo.filter(
      (pool) => pool.contractChain === chainId
    );

    const pool = chainPools.find((pool) => pool.id === 1)
    await withdrawMatic(pool, signer, ethers.utils.parseUnits(amount, pool?.token?.decimals))
  } catch (e) {
    throw e
  }

}

export async function getTokenBalanceService(provider, poolId){
  const chainId = await provider.request({ method: "eth_chainId" });
  const accounts = await provider.request({ method: "eth_accounts" });
  const signer = new ethers.providers.Web3Provider(provider).getSigner()
  const account = accounts[0]

  const chainPools = poolsInfo.filter((pool) => pool.contractChain === chainId);
  const pool = chainPools.find((pool) => pool.id === poolId)

  return await getTokenBalanceFn(pool, signer, account)
}

export async function getAUSDBalanceService(provider){
  const chainId = await provider.request({ method: "eth_chainId" });
  const accounts = await provider.request({ method: "eth_accounts" });
  const signer = new ethers.providers.Web3Provider(provider).getSigner()
  const account = accounts[0]
  console.log(chainId);
  const chainPools = poolsInfo.filter((pool) => pool.contractChain === chainId);
  const pool = chainPools.find((pool) => pool.id === 1)

  return await getAUSDBalanceFn(pool, signer, account)
}