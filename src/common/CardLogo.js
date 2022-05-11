import './styles.css'

const CardLogo = ({ img, title, isPair, subtitle }) => {
    return (
        <div className="Vault-Col" style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            {img && <img src={img} alt={title} className={isPair ? "Stake-Img-Pair" : "Vault-Img"} />}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="Vault-Main">{title}</div>
                {!!subtitle && <div className="Vault-Sub">{subtitle}</div>}
            </div>
        </div>
    )
}

export default CardLogo;