const initialState = {
    ausd: 0
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_TOKEN_BALANCE':
            return {
                ...state,
                [action.id]: action.balance
            }
        case 'UPDATE_AUSD_BALANCE':
            return {
                ...state,
                ausd: action.balance
            }
        default:
            return state
    }
}