import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createStore } from 'redux';

interface MyState {
    counter: number;
}

export const INCREMENT = 'INCREMENT';

interface IncrementAction {
}

// This could be a sum type
type MyActionTypes = IncrementAction;

// Don't modify the state

// The type of the state should be T | undefined.
// In the case of the tutorial, they use a too-clever-by-half thing to infer
// the type correctly.
function myReducer(state: MyState | undefined, action: MyActionTypes): MyState {
    if (state === undefined) {
        return { counter: 0 };
    }

    return state;
}




// the root reducer must be treated specially...
const store = createStore(myReducer);


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
