
const initialState = {
    matic: 0,
    wmatic: 0,
    loading: false
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_CONVERT_LOADER':
            return {
                ...state,
                loading: action.loading
            }
        case 'SET_MATIC_BALANCE':
            return {
                ...state,
                matic: action.bal.matic,
                wmatic: action.bal.wmatic
            }
        default:
            return state
    }
}