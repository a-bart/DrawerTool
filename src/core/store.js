import { createStore, compose } from 'redux'
import rootReducer from './reducers/rootReducer'

const initialState = {};
const enhancers = [];

if (process.env.NODE_ENV === 'development') {
	const devToolsExtension = window.devToolsExtension;

	if (typeof devToolsExtension === 'function') {
		enhancers.push(devToolsExtension())
	}
}

const composedEnhancers = compose(...enhancers);

export default createStore(
	rootReducer,
	initialState,
	composedEnhancers
)
