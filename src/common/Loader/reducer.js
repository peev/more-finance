const initialState = {
    loading: null
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case 'SHOW_LOADER':
            return {
                ...state,
                loading: action.loading
            }
        case 'HIDE_LOADER':
            return {
                ...state,
                loading: null
            }
        default:
            return state
    }
}