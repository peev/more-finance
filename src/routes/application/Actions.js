import { bindActionCreators } from 'redux'
import { CONNECTION, SUPPORTED_NETWORK_ID } from '../../utils/Constants'
import { initializeOnboard } from "./Helper"

export function init() {
    return (dispatch) => {
        const actions = bindActionCreators({ setAddress, setWallet, updateNetworkId, setOnboard }, dispatch)
        const onboard = initializeOnboard(actions)
        const prevSelectedWallet = window.localStorage.getItem('selectedWallet')
        if (prevSelectedWallet && onboard) onboard.walletSelect(prevSelectedWallet)
    }
}


export function setAddress(address) {
    return {
        type: 'SET_ADDRESS',
        address
    }
}

export function setWallet(wallet) {
    return {
        type: 'SET_WALLET',
        wallet
    }
}

export function setOnboard(onboard) {
    return {
        type: 'SET_ONBOARD',
        onboard
    }
}

export function updateNetworkId(networkId) {
    return {
        type: 'UPDATE_NETWORK_ID',
        networkId
    }
}

export function updateConnection(provider, address, networkId) {
    let connection = CONNECTION.NOT_CONNECTED
    if (provider && address && networkId && networkId === SUPPORTED_NETWORK_ID) {
        connection = CONNECTION.CONNECTED
    } if (provider && address && networkId && networkId !== SUPPORTED_NETWORK_ID) {
        console.log('Wrong Network');
        connection = CONNECTION.WRONG_NETWORK
    }
    console.log('connection is updated', provider, address, networkId)
    return {
        type: 'UPDATE_CONNECTION',
        connection
    }
}
