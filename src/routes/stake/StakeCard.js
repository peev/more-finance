import '../vaults/vaults.css';
import CardInfo from '../../common/CardInfo';
import CardLogo from '../../common/CardLogo';
import { getLogo } from '../../utils/helper';

const StakeCard = ({ name, apy, tvl, stake, isPair, subtitle }) => {

    return (
        <div
            className={`Vault-Card Small`}>
            <div
                style={{ display: 'flex', flexDirection: 'row' }}>
                <CardLogo img={getLogo(name)} title={name} isPair={isPair} subtitle={subtitle} />
                <div style={{ display: 'flex', flex: 1, marginTop: 10 }}>
                    <CardInfo title={`Coming Soon...`} />
                </div>
            </div>
        </div>
    )
}

export default StakeCard;
