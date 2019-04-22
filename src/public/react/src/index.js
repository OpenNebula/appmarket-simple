import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { INDEX_PATH } from './constants';
import rootReducer from './reducers';
import Routes from './routes';
import '../../css/styles.css';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancer(applyMiddleware(thunk)));
render(
  <Provider store={store}>
    <Router basename={`${INDEX_PATH}`}>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('app')
);
if (module.hot) {
  module.hot.accept();
}
