import './styles.css'

const HealthFactor = ({ cltv, ltv }) => {
    if (ltv) {
        let red1 = ltv / 10
        let red2 = 0
        let pink1 = 2 * (ltv / 10)
        let pink2 = 0
        let green1 = 7 * (ltv / 10)
        let green2 = 0
        let markerPosition = 3

        if ((ltv - cltv) < (0.1 * ltv)) {
            red1 = ((ltv - cltv) / (0.1 * ltv)) * (ltv / 10)
            red2 = (ltv / 10) - red1
            pink1 = 0
            pink2 = 2 * (ltv / 10)
            green1 = 0
            green2 = 7 * (ltv / 10)
            markerPosition = 1
        } else if ((ltv - cltv - (0.1 * ltv)) < (0.2 * ltv)) {
            red1 = ltv / 10
            red2 = 0
            pink1 = ((ltv - cltv - (0.1 * ltv)) / (0.2 * ltv)) * (2 * (ltv / 10))
            pink2 = (2 * (ltv / 10)) - pink1
            green1 = 0
            green2 = 7 * (ltv / 10)
            markerPosition = 2
        } else {
            red1 = ltv / 10
            red2 = 0
            pink1 = 2 * (ltv / 10)
            pink2 = 0
            green1 = ((ltv - cltv - (0.3 * ltv)) / (0.7 * ltv)) * (7 * (ltv / 10))
            green2 = (7 * (ltv / 10)) - green1
            markerPosition = 3
        }

        return (
            <div className="Health-Factor">
                <div style={{ flex: 1, display: 'flex' }} />
                <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                        <div style={{ flex: red1, height: 16, backgroundColor: '#ef3e25', display: 'flex', justifyContent: 'flex-end' }}>
                            {markerPosition === 1 && <div style={{ display: 'flex', marginTop: 20, color: '#ef3e25', fontFamily: 'Menlo', width: 50, marginRight: -48 }}>
                                <div style={{ height: 20, width: 2, backgroundColor: '#ef3e25', marginRight: 5, marginTop: -4 }} />
                                {`${cltv}%`}
                            </div>}

                        </div>
                        <div style={{ flex: red2, height: 16, backgroundColor: '#ef3e25', opacity: 0.5 }} />
                        <div style={{ flex: pink1, height: 16, backgroundColor: '#ff9f9d', display: 'flex', justifyContent: 'flex-end' }}>
                            {markerPosition === 2 && <div style={{ display: 'flex', marginTop: 20, color: '#ff9f9d', fontFamily: 'Menlo', width: 50, marginRight: -48 }}>
                                <div style={{ height: 20, width: 2, backgroundColor: '#ff9f9d', marginRight: 5, marginTop: -4 }} />
                                {`${cltv}%`}
                            </div>}
                        </div>
                        <div style={{ flex: pink2, height: 16, backgroundColor: '#ff9f9d', opacity: 0.5 }} />
                        <div style={{ flex: green1, height: 16, backgroundColor: '#92a668', display: 'flex', justifyContent: 'flex-end' }}>
                            {markerPosition === 3 && <div style={{ display: 'flex', marginTop: 20, color: '#92a668', fontFamily: 'Menlo', width: 50, marginRight: -48 }}>
                                <div style={{ height: 20, width: 2, backgroundColor: '#92a668', marginRight: 5, marginTop: -4 }} />
                                {`${cltv}%`}
                            </div>}
                        </div>
                        <div style={{ flex: green2, height: 16, backgroundColor: '#92a668', opacity: 0.5 }} />
                    </div>
                    <div className="Vault-Sub Health-Text">
                        {'HEALTH FACTOR'}
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="Health-Factor">
            <div style={{ flex: 1, display: 'flex' }} />
            <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: 1, height: 16, backgroundColor: '#ef3e25', opacity: 0.5 }} />
                    <div style={{ flex: 2, height: 16, backgroundColor: '#ff9f9d', opacity: 0.5 }} />
                    <div style={{ flex: 3, height: 16, backgroundColor: '#92a668', opacity: 0.5 }} />
                </div>
                <div className="Vault-Sub">{'HEALTH FACTOR'}</div>
            </div>
        </div>
    )
}

export default HealthFactor;