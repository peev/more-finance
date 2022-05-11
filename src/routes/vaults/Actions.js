import { updateConvertLoader, updateMaticBalance } from "../../common/Convert/Actions"
import { hideLoader, showLoader } from "../../common/Loader/Actions"
import { updateError } from "../../common/Notification/Actions"
import { ConvertRef } from "../../utils/AllRefs"
import { ERRORS } from "../../utils/Constants"
import {
    addCollateralService, borrowAUSDService, createPoolsService,
    getAUSDBalanceService,
    getMaticBalanceService,
    getTokenBalanceService,
    getUpdatedPoolsList, removeCollateralService, repayAUSDService, unWrapMaticService, wrapMaticService
} from "./services"

export function createPools() {
    return async (dispatch, getState) => {
        const { session: { wallet, address } } = getState()
        if (wallet?.provider && address) {
            dispatch({ type: 'INIT_FETCH_POOLS' })
            const poolsList = await createPoolsService(wallet.provider)
            if (poolsList?.length) {
                dispatch(updatePools(poolsList))
            } else {
                dispatch({ type: 'FETCH_POOLS_FAILED' })
            }
        } else {
            console.log('No Provider Found')
        }
    }
}

function updatePools(pools) {
    return {
        type: 'UPDATE_POOLS',
        pools
    }
}

export function addCollateral(poolId, amount, inputId) {
    return async (dispatch, getState) => {
        if (parseFloat(amount)) {
            const { vaults: { pools }, session: { wallet }, convert: { wmatic } } = getState()
            const p = pools?.find(p => p.id === poolId)
            if (p.token.name === 'MATIC' && parseFloat(amount) > parseFloat(wmatic)) {
                ConvertRef.current.showModal('Insufficient funds, Add Wmatic')
                return
            }
            if (wallet?.provider) {
                dispatch(showLoader(inputId))
                try {
                    await addCollateralService(amount, poolId, pools, wallet.provider)
                    const updatedPoolsList = await getUpdatedPoolsList(poolId, pools, wallet.provider)
                    updatedPoolsList?.length && dispatch(updatePools(updatedPoolsList))
                    dispatch(hideLoader())
                    dispatch(getTokenBalance(poolId))
                    dispatch(getAUSDBalance())
                } catch (e) {
                    if (e?.code === 4001) {
                        dispatch(updateError(ERRORS.USER_DENIED_TRANSACTION))
                        dispatch(hideLoader())
                        return
                    }
                    dispatch(updateError(ERRORS.DEFAULT_ERROR))
                    console.log('Add collateral err', e)
                    dispatch(hideLoader())
                }
            } else {
                console.log('Unable to add collateral')
            }
        } else {
            dispatch(updateError(ERRORS.ZERO_AMOUNT_ENTERED))
        }
    }
}

export function borrowAUSD(poolId, amount, inputId) {
    return async (dispatch, getState) => {
        if (parseFloat(amount)) {
            const { vaults: { pools }, session: { wallet } } = getState()
            const pool = pools.find(pool => pool.id === poolId)
            if (!pool) {
                dispatch(updateError(ERRORS.DEFAULT_ERROR))
                return
            }
            if (parseFloat(amount) > parseFloat(pool.borrowLeftParsed)) {
                dispatch(updateError(ERRORS.MAX_BORROW_ERROR))
                return
            }
            if (pools?.length && wallet?.provider) {
                dispatch(showLoader(inputId))
                try {
                    await borrowAUSDService(amount, poolId, pools, wallet.provider)
                    const updatedPoolsList = await getUpdatedPoolsList(poolId, pools, wallet.provider)
                    console.log('updated', updatedPoolsList)
                    updatedPoolsList?.length && dispatch(updatePools(updatedPoolsList))
                    dispatch(hideLoader())
                    dispatch(getAUSDBalance())
                } catch (e) {
                    if (e?.code === 4001) {
                        dispatch(updateError(ERRORS.USER_DENIED_TRANSACTION))
                        dispatch(hideLoader())
                        return
                    }
                    dispatch(updateError(ERRORS.DEFAULT_ERROR))
                    console.log('Borrow AUSD error', e)
                    dispatch(hideLoader())
                }
            } else {
                dispatch(updateError('Unable to borrow AUSD'))
            }
        } else {
            dispatch(updateError(ERRORS.ZERO_AMOUNT_ENTERED))
        }
    }
}

export function repayAUSD(poolId, amount, inputId) {
    return async (dispatch, getState) => {
        if (parseFloat(amount)) {
            const { vaults: { pools }, session: { wallet } } = getState()
            const pool = pools.find(pool => pool.id === poolId)
            if (!pool) {
                dispatch(updateError(ERRORS.DEFAULT_ERROR))
                return
            }
            if (parseFloat(amount) > parseFloat(pool.userBorrowPart)) {
                dispatch(updateError(ERRORS.MAX_REPAY_ERROR))
                return
            }
            if (pools?.length && wallet?.provider) {
                dispatch(showLoader(inputId))
                try {
                    await repayAUSDService(amount, poolId, pools, wallet.provider)
                    const updatedPoolsList = await getUpdatedPoolsList(poolId, pools, wallet.provider)
                    updatedPoolsList?.length && dispatch(updatePools(updatedPoolsList))
                    dispatch(hideLoader())
                    dispatch(getAUSDBalance())
                } catch (e) {
                    if (e?.code === 4001) {
                        dispatch(updateError(ERRORS.USER_DENIED_TRANSACTION))
                        dispatch(hideLoader())
                        return
                    }
                    dispatch(updateError(ERRORS.DEFAULT_ERROR))
                    console.log('Repay AUSD error', e)
                    dispatch(hideLoader())
                }
            } else {
                console.log('Unable to repay AUSD')
            }
        } else {
            dispatch(updateError(ERRORS.ZERO_AMOUNT_ENTERED))
        }
    }
}

export function removeCollateral(poolId, amount, inputId) {
    return async (dispatch, getState) => {
        if (parseFloat(amount)) {
            const { vaults: { pools }, session: { wallet } } = getState()
            const pool = pools.find(pool => pool.id === poolId)
            if (!pool) {
                dispatch(updateError(ERRORS.DEFAULT_ERROR))
                return
            }
            if (parseFloat(amount) > parseFloat(pool.userCollateralShare)) {
                dispatch(updateError(ERRORS.MAX_WITHDRAW_ERROR))
                return
            }
            if (pools?.length && wallet?.provider) {
                dispatch(showLoader(inputId))
                try {
                    await removeCollateralService(amount, poolId, pools, wallet.provider)
                    const updatedPoolsList = await getUpdatedPoolsList(poolId, pools, wallet.provider)
                    updatedPoolsList?.length && dispatch(updatePools(updatedPoolsList))
                    dispatch(hideLoader())
                    dispatch(getTokenBalance(poolId))
                    dispatch(getAUSDBalance())
                } catch (e) {
                    if (e?.code === 4001) {
                        dispatch(updateError(ERRORS.USER_DENIED_TRANSACTION))
                        dispatch(hideLoader())
                        return
                    }
                    dispatch(updateError(ERRORS.DEFAULT_ERROR))
                    console.log('Remove Collateral error', e)
                    dispatch(hideLoader())
                }
            } else {
                console.log('Unable to remove Collateral')
            }
        } else {
            dispatch(updateError(ERRORS.ZERO_AMOUNT_ENTERED))
        }
    }
}

export function getMaticBalance() {
    return async (dispatch, getState) => {
        const { session: { wallet, address } } = getState()
        if (wallet?.provider && address) {
            const result = await getMaticBalanceService(wallet?.provider)
            dispatch(updateMaticBalance(result))
        }
    }
}

export function wrapMatic(amount) {
    return async (dispatch, getState) => {
        const { session: { wallet, address } } = getState()
        if (wallet?.provider && address && parseFloat(amount)) {
            dispatch(updateConvertLoader(true))
            try {
                await wrapMaticService(wallet?.provider, amount)
                dispatch(updateConvertLoader(false))
                dispatch(getMaticBalance())
            } catch (e) {
                dispatch(updateConvertLoader(false))
            }
        }
    }
}

export function unWrapMatic(amount) {
    return async (dispatch, getState) => {
        const { session: { wallet, address } } = getState()
        if (wallet?.provider && address && parseFloat(amount)) {
            dispatch(updateConvertLoader(true))
            try {
                await unWrapMaticService(wallet?.provider, amount)
                dispatch(updateConvertLoader(false))
                dispatch(getMaticBalance())
            } catch (e) {
                dispatch(updateConvertLoader(false))
            }

        }
    }
}

export function getTokenBalance(poolId) {
    return async (dispatch, getState) => {
        const { session: { wallet, address } } = getState()
        if (wallet?.provider && address) {
            const balance = await getTokenBalanceService(wallet?.provider, poolId)
            dispatch(updateTokenBalance(poolId, balance))
        }
    }
}

export function updateTokenBalance(id, balance) {
    return {
        type: 'UPDATE_TOKEN_BALANCE',
        id,
        balance
    }
}

export function updateAUSDBalance(balance) {
    return {
        type: 'UPDATE_AUSD_BALANCE',
        balance
    }
}

export function getAUSDBalance() {
    return async (dispatch, getState) => {
        const { session: { wallet, address } } = getState()
        if (wallet?.provider && address) {
            const balance = await getAUSDBalanceService(wallet?.provider)
            dispatch(updateAUSDBalance(balance))
        }
    }
}