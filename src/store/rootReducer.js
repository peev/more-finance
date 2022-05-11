import { combineReducers } from 'redux'
import session from '../routes/application/reducer'
import vaults from '../routes/vaults/reducer'
import notification from '../common/Notification/reducer'
import loader from '../common/Loader/reducer'
import convert from '../common/Convert/reducer'
import balance from '../reducer/balance'

export default combineReducers({ session, vaults, notification, loader, convert, balance })