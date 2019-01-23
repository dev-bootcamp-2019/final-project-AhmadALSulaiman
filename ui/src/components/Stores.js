import React, { Component } from 'react';
import MyWeb3 from '../MyWeb3';
import Header from './Header';
import marketplace from '../marketplace';
import { Link } from 'react-router-dom';


class Stores extends Component {
    constructor() {
        super();

        this.state = {
            account: null,
            storesNames: [],
        };
    }

    async componentDidMount() {
        const account = MyWeb3.currentProvider.selectedAddress;
        const storesInHex = await marketplace.methods.getStoreFronts().call();
        let storesNames = [];

        storesInHex.forEach((storeInHex) => {
            storesNames.push(MyWeb3.utils.hexToUtf8(storeInHex));
        });

        this.setState({ account, storesNames });
    }

    renderStores() {
        const stores = this.state.storesNames.map(storeName => {
            return (
                <div className="col-3">
                    <div className="card" style={{'width':'16rem'}}>
                    <img className="card-img-top" src="https://gusandruby.com/wp-content/uploads/2015/03/img-storefront-gallery-1.jpg" alt="Card image cap" />
                    <div className="card-body">
                        <p className="card-title">{storeName}</p>
                        {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                        <Link to={'/stores/' + storeName} className="btn btn-secondary">Open Store</Link>
                    </div>
                    </div>
                </div>
            );
        });

        return (
            <div className="row">
                {stores}
            </div>
        );
    }

    render() {
        return (
            <div>
                <Header />
                <div className="container">
                    {this.renderStores()}
                </div>
            </div>
        );
    }
};


export default Stores;
