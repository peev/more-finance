/* eslint-disable react/jsx-no-target-blank */
import './styles.css'

const Header = () => {
    return (
        <div className="Header">
            <div className="shell">
                <div className="Header-Container Fixed-Container">
                    <div className="Header-Info">
                        {/* <a href={'https://www.google.com'} target={'_blank'}>{'AUSD: $0.99'}</a>
                        {' | '}
                        <a href={'https://www.google.com'} target={'_blank'}>{'ARTHA: 5.94$'}</a>
                        {' | '}
                        <a href={'https://www.google.com'} target={'_blank'}>{'Protocol Collateral Ratio: 300% '}</a> */}
                    </div>

                    <div style={{ flex: 1 }} />

                    <div className="Header-Info">
                        <a href={'https://wallet.polygon.technology'} target={'_blank'} > {'ETH-POLYGON BRIDGE'}</a>

                        <div style={{ width: 10 }} />

                        <div style={{ width: 13, height: 13, borderRadius: 20, backgroundColor: '#fbd48e', color: '#4d526c', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 5 }}>
                            {'+'}
                        </div>
                        <a href={'https://exchange.dfyn.network/#/swap'} target={'_blank'} > {'AUSD'}</a>

                        {/* <div style={{ width: 10 }} />
                        <div className="Header-Info">{'+ ARTHA'}</div> */}
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default Header;