import '../vaults/vaults.css';
import CardLogo from '../../common/CardLogo';
import { getLogo } from '../../utils/helper';

const Fields = () => {
    return (
        <div style={{ flex: 1, flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', marginTop: 20 }}>
            <div style={{ flexDirection: 'row', display: 'flex' }}>
                <div
                    onClick={null}
                    className="Farm-Btn">
                    {'Stake / Unstake'}
                </div>
            </div>
        </div>
    )
}

const FarmLpsCard = ({ name, apy, tvl, stake, subtitle }) => {
    
    return (
        <div
            className={`Vault-Card Small`}>
            <div
                style={{ display: 'flex', flexDirection: 'row' }}>
                <CardLogo img={getLogo(name)} title={name} isPair={true} subtitle={subtitle} />
                <Fields />
            </div>
        </div>
    )
}

export default FarmLpsCard;