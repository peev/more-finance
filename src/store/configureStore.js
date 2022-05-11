import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import reducers from './rootReducer'

export default function configureStore() {
    const middlewareEnhancer = applyMiddleware(thunk)
    const composedEnhancers = compose(middlewareEnhancer)
    const store = createStore(reducers, {}, composedEnhancers)
    return store
}