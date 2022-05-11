import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './vaults.css';
import CardInfo from '../../common/CardInfo';
import CardLogo from '../../common/CardLogo';
import HealthFactor from '../../common/HealthFactor';
import Input from '../../common/Input';
import { getLogo, toFixed } from '../../utils/helper';
import { getTokenBalance } from './Actions';

const Fields = ({ addCollateral, borrowAUSD, repayAUSD, removeCollateral, borrowLeftParsed, userBorrowPart, symbol, balance, tokenPrice, maxWithdraw }) => {
    return (
        <div className="Fields">
            <div style={{ flex: 1 }} />
            <div style={{ flex: 3, flexDirection: 'column', display: 'flex' }}>
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                    <Input
                        id={1}
                        btnTitle={'ADD'}
                        onBtnPress={addCollateral}
                        symbol={symbol}
                        ofType={'open'}
                        balance={balance}
                        tokenPrice={tokenPrice}
                    />
                    <div style={{ flex: 1 }} />
                    <Input
                        id={2}
                        userBorrowPart={userBorrowPart}
                        btnTitle={'REPAY'}
                        onBtnPress={repayAUSD}
                        symbol={'AUSD'}
                        ofType={'open'}
                    />
                </div>
                <div style={{ height: 12 }} />
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                    <Input
                        id={3}
                        btnTitle={'BORROW'}
                        borrowLeftParsed={borrowLeftParsed}
                        onBtnPress={borrowAUSD}
                        symbol={'AUSD'}
                        ofType={'open'}
                    />
                    <div style={{ flex: 1 }} />
                    <Input
                        id={4}
                        btnTitle={'WITHDRAW'}
                        onBtnPress={removeCollateral}
                        symbol={symbol}
                        ofType={'open'}
                        maxWithdraw={maxWithdraw}
                    />
                </div>
            </div>
        </div>
    )
}

const OpenVaultCard = ({ id, name, interest, tvl, liquidationPrice, userCollateralShare, tokenInUsd, getTokenBalance, balance, tokenPrice,
    userBorrowPart, addCollateral, borrowAUSD, repayAUSD, removeCollateral, token, ltv, borrowLeftParsed, availableAUSDInPool, maxWithdraw }) => {
    const [expand, toggleExpand] = useState(false)
    const wrapperStyle = expand ? "Full-Open" : "Small-Open"

    useEffect(() => {
        getTokenBalance(id)
    }, [])

    function onClick() {
        toggleExpand(!expand)
    }

    const cltv = parseInt((userBorrowPart / tokenInUsd) * 100)

    return (
        <div
            className={`Vault-Card ${wrapperStyle}`}>
            <div
                onClick={onClick}
                style={{ display: 'flex', flexDirection: 'row' }}>
                <CardLogo img={getLogo(name)} title={name} />
                <CardInfo title={`${toFixed(userCollateralShare, token.toFixed)} ${token.name}`} subtitle={`~$${toFixed(tokenInUsd, 3)}`} />
                <CardInfo title={`${toFixed(userBorrowPart, 3)} ${'AUSD'}`} subtitle={'DEBT'} />
                <CardInfo title={`${toFixed(borrowLeftParsed, token.toFixed)} AUSD`} subtitle={'MAX AUSD YOU CAN BORROW'} />
            </div>
            <div
                onClick={onClick}
                style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1 }} />
                <CardInfo title={`${cltv}%`} subtitle={`LTV (MAX ${ltv}%)`} />
                <CardInfo title={`$${toFixed(tvl, 3)}`} subtitle={'TVL'} />
                <CardInfo title={`${toFixed(availableAUSDInPool, token.toFixed)} AUSD`} subtitle={'TOTAL AUSD AVAILABLE IN POOL'} />
            </div>
            {expand && <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1 }} />
                <CardInfo title={'0.3%'} subtitle={'BORROW FEE'} />
                <CardInfo title={`${interest}%`} subtitle={'ANNUAL INTEREST'} />
                <CardInfo title={`$${toFixed(liquidationPrice, 3)}`} subtitle={'LIQUIDATION PRICE'} />
            </div>}
            {expand && <HealthFactor cltv={cltv} ltv={ltv} />}
            {expand && <Fields
                balance={balance}
                tokenPrice={tokenPrice}
                symbol={token?.name}
                userBorrowPart={userBorrowPart}
                borrowLeftParsed={borrowLeftParsed}
                addCollateral={addCollateral.bind(null, id)}
                borrowAUSD={borrowAUSD.bind(null, id)}
                repayAUSD={repayAUSD.bind(null, id)}
                removeCollateral={removeCollateral.bind(null, id)}
                maxWithdraw={maxWithdraw}
            />}
        </div>
    )
}

const mapStateToProps = ({ balance }, props) => {
    return {
        balance: balance[props.id]
    }
}

export default connect(mapStateToProps, { getTokenBalance })(OpenVaultCard);
