const initialState = {
    pools: null,
    loading: false
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case 'INIT_FETCH_POOLS':
            return {
                ...state,
                loading: true
            }
        case 'UPDATE_POOLS':
            return {
                ...state,
                pools: action.pools,
                loading: false
            }
        case 'FETCH_POOLS_FAILED':
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }
}