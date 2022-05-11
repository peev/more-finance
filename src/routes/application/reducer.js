import { CONNECTION } from "../../utils/Constants"

const initialState = {
    address: null,
    wallet: null,
    onboard: null,
    networkId: null,
    connection: CONNECTION.NOT_CONNECTED
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_ADDRESS':
            return {
                ...state,
                address: action.address
            }
        case 'SET_WALLET':
            return {
                ...state,
                wallet: action.wallet
            }
        case 'SET_ONBOARD':
            return {
                ...state,
                onboard: action.onboard
            }
        case 'UPDATE_NETWORK_ID':
            return {
                ...state,
                networkId: action.networkId
            }
        case 'UPDATE_CONNECTION':
            return {
                ...state,
                connection: action.connection
            }
        default:
            return state
    }
}