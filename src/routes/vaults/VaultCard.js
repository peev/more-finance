import './vaults.css';
import { useEffect, useState } from 'react';
import CardInfo from '../../common/CardInfo';
import CardLogo from '../../common/CardLogo';
import HealthFactor from '../../common/HealthFactor';
import Input from '../../common/Input';
import { getLogo, toFixed } from '../../utils/helper';
import { connect } from 'react-redux';
import { getTokenBalance } from './Actions';

const Fields = ({ addCollateral, symbol, balance, tokenPrice }) => {
    return (
        <div className="Fields">
            <div style={{ flex: 1 }} />
            <div style={{ flex: 3, flexDirection: 'column', display: 'flex' }}>
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                    <Input
                        id={1}
                        btnTitle={'ADD'}
                        symbol={symbol}
                        onBtnPress={addCollateral}
                        balance={balance}
                        tokenPrice={tokenPrice}
                    />
                </div>
            </div>
        </div>
    )
}

const VaultCard = ({ id, name, ltv, interest, stabilityFee, availableAUSDInPool, tvl, liquidationPrice, addCollateral, token, getTokenBalance, balance, tokenPrice }) => {
    const [expand, toggleExpand] = useState(false)
    const wrapperStyle = expand ? "Full" : "Small"

    useEffect(() => {
        getTokenBalance(id)
    }, [])

    function onClick() {
        toggleExpand(!expand)
    }

    return (
        <div
            className={`Vault-Card ${wrapperStyle}`}>
            <div
                onClick={onClick}
                style={{ display: 'flex', flexDirection: 'row' }}>
                <CardLogo img={getLogo(name)} title={name} />
                <CardInfo title={`${ltv}%`} subtitle={'MIN COL RATIO'} />
                <CardInfo title={`${interest}%`} subtitle={'ANNUAL INTEREST'} />
                <CardInfo title={`${toFixed(availableAUSDInPool, token.toFixed)} AUSD`} subtitle={'TOTAL AUSD AVAILABLE IN POOL'} />
            </div>
            {expand && <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1 }} />
                <CardInfo title={liquidationPrice} subtitle={'LIQUIDATION PRICE'} />
                <CardInfo title={'0.5%'} subtitle={'BORROW FEE'} />
                <CardInfo title={`$${toFixed(tvl, 3)}`} subtitle={'TVL'} />
            </div>}
            {expand && <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1 }} />
                <CardInfo title={'-%'} subtitle={'CDR'} />
                <CardInfo title={`${stabilityFee}%`} subtitle={'LIQUIDATION PENALTY'} />
                <div style={{ flex: 1 }} />
            </div>}
            {expand && <HealthFactor />}
            {expand && <Fields
                addCollateral={addCollateral.bind(null, id)}
                symbol={token?.name}
                balance={balance}
                tokenPrice={tokenPrice}
            />}
        </div>
    )
}

const mapStateToProps = ({ balance }, props) => {
    return {
        balance: balance[props.id]
    }
}

export default connect(mapStateToProps, { getTokenBalance })(VaultCard);
