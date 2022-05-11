import './styles.css'

const CardInfo = ({ title, subtitle }) => {
    return (
        <div className="Vault-Col">
            <div className="Vault-Main">{title}</div>
            <div className="Vault-Sub">{subtitle}</div>
        </div>
    )
}

export default CardInfo;