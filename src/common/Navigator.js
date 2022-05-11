import { Link } from 'react-router-dom'
import './styles.css'
import logo from '../assets/logo.svg'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Social from './Social'
import { updateConnection } from '../routes/application/Actions'
import { CONNECTION } from '../utils/Constants'
import { openUrlInTab, toFixed } from '../utils/helper'
import { getAUSDBalance } from '../routes/vaults/Actions'

const NavButtons = (props) => {

    const { onboard, connection, address } = props

    async function onClick() {
        await onboard.walletSelect()
        await onboard.walletCheck()
    }

    function getConnectionStatus() {
        if (connection === CONNECTION.CONNECTED) {
            return { color: '#92a668', status: CONNECTION.CONNECTED }
        }
        if (connection === CONNECTION.WRONG_NETWORK) {
            return { color: '#ef3e25', status: CONNECTION.WRONG_NETWORK }
        }
        if (connection === CONNECTION.NOT_CONNECTED) {
            return { color: '#fbd48e', status: CONNECTION.NOT_CONNECTED }
        }
    }

    const { color, status } = getConnectionStatus()
    return (
        <div className="Nav-Address">
            {address ? <div className="Nav-Info">
                {`${address.substring(0, 6)}..${address.slice(-4)}`}
            </div> : null}
            <div style={{ height: 16 }} />
            <div
                onClick={onClick}
                style={{ backgroundColor: color, cursor: 'pointer' }}
                className="Nav-Info">
                {status}
            </div>
        </div>
    )
}

const Navigator = (props) => {
    const [index, setIndex] = useState(0)
    const { wallet, networkId, address, showModal, connection, ausd } = props

    useEffect(() => {
        props.updateConnection(wallet?.provider, address, networkId)
        props.getAUSDBalance()
    }, [wallet, networkId, address])

    const onClickBtn = (index) => () => {
        setIndex(index)
    }

    return (
        <div className="Nav">
            <div className="Nav-Logo">
                <img src={logo} alt={'artha'} className="Logo" />
            </div>
            <NavButtons {...props} />
            <div
                className="Nav-Text">
                {'YOUR BALANCE'}
            </div>
            <div style={{ height: 6 }} />
            <div
                className="Nav-Text">
                {`${toFixed(ausd, 2)} AUSD`}
            </div>
            <div style={{ height: 30 }} />
            <div>
                <Link to={'/home'}>
                    <div
                        onClick={onClickBtn(0)}
                        className={`Nav-Btn ${index === 0 ? "Selected" : "Unselected"}`}>
                        {'VAULTS'}
                    </div>
                </Link>
                <Link to={'/stake'}>
                    <div
                        onClick={onClickBtn(1)}
                        className={`Nav-Btn ${index === 1 ? "Selected" : "Unselected"}`}>
                        {'STAKE'}
                    </div>
                </Link>
                <div
                    onClick={() => openUrlInTab('https://exchange.dfyn.network/#/swap')}
                    className={`Nav-Btn ${index === 2 ? "Selected" : "Unselected"}`}>
                    {'TRADE'}
                </div>
                {/* <div
                    onClick={onClickBtn(3)}
                    className={`Nav-Btn ${index === 3 ? "Selected" : "Unselected"}`}>
                    {'ANALYTICS'}
                </div> */}
                {connection === CONNECTION.CONNECTED && <div
                    onClick={showModal}
                    className={`Nav-Btn Unselected`}>
                    {'CONVERT'}
                </div>}
            </div>
            <div className="Navigator-Divider" />
            <Social />
        </div>
    )
}

const mapStateToProps = ({ session, balance }) => {
    return {
        onboard: session.onboard,
        wallet: session.wallet,
        address: session.address,
        networkId: session.networkId,
        connection: session.connection,
        ausd: balance.ausd
    }
}

export default connect(mapStateToProps, { updateConnection, getAUSDBalance })(Navigator);