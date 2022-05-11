

export function showLoader(loading) {
    return {
        type: 'SHOW_LOADER',
        loading
    }
}

export function hideLoader() {
    return {
        type: 'HIDE_LOADER'
    }
}