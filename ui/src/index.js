import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route } from 'react-router-dom';
import Manager from './components/Manager';
import StoreOwner from './components/StoreOwner';
import Stores from './components/Stores';
import Admin from './components/Admin';
import Store from './components/Store';


ReactDOM.render (
        <BrowserRouter>
            <div>
                <Route exact path='/' component={App} />
                <Route exact path='/managers' component={Manager} />
                <Route exact path='/admins' component={Admin} />
                <Route exact path='/storeowners' component={StoreOwner} />
                <Route exact path='/stores' component={Stores} />
                <Route path='/stores/:storeName' component={Store} />
            </div>
        </BrowserRouter>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
