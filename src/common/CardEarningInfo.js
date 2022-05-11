import './styles.css'

const CardEarningInfo = ({ title, subtitle }) => {
    return (
        <div className="Vault-Col">
            <div className="Vault-Main">{title}</div>
            <div className="Earnings-Box">
                <div className="Earning-Text">
                    {'EARNINGS     ss.'}
                </div>
                <div style={{ width: 1, backgroundColor: '#242424' }} />
                <div className="Earning-Text">
                    {'CLAIM'}
                </div>
            </div>
        </div>
    )
}

export default CardEarningInfo;