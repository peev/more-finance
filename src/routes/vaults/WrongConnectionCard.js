import './vaults.css';
import CardInfo from '../../common/CardInfo';

const WrongConnectionCard = () => {
    return (
        <div className={`Vault-Card Small`}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <CardInfo title={'You are connected to a Wrong Network'} subtitle={'Please connect to Polygon Network.'} />
            </div>
        </div>
    )
}

export default WrongConnectionCard;
