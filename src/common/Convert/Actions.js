
export function updateMaticBalance(bal) {
    return {
        type: 'SET_MATIC_BALANCE',
        bal
    }
}

export function updateConvertLoader(loading) {
    return {
        type: 'UPDATE_CONVERT_LOADER',
        loading
    }
}