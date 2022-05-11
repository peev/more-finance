import Loader1 from '../../common/DataLoader/DataLoader';
import './vaults.css';

const LoadingCard = () => {
    return (
        <div style={{ justifyContent: 'center', alignItems: 'center', height: 150 }} className={`Vault-Card Small`}>
            <Loader1 />
        </div>
    )
}

export default LoadingCard;
