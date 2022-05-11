import './vaults.css';
import CardInfo from '../../common/CardInfo';

const NotConnectedCard = () => {
    return (
        <div className={`Vault-Card Small`}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <CardInfo title={'Connect to a Wallet'} subtitle={'Click on `Not Connected` Button to select a Wallet'} />
            </div>
        </div>
    )
}

export default NotConnectedCard;
