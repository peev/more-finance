const initialState = {
    error: null
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_ERROR':
            return {
                ...state,
                error: action.error
            }
        default:
            return state
    }
}