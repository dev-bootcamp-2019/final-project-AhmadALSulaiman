import React, { Component } from 'react';
import MyWeb3 from '../MyWeb3';
import Header from '../components/Header';
import Product from '../components/Product';
import marketplace from '../marketplace';


class Store extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: null,
            storeName: '',
            storeNameBytes: '',
            productsDetails: [],
            selectedProduct: '',
        };
    }

    async componentDidMount() {
        const account = MyWeb3.currentProvider.selectedAddress;
        const storeName = this.props.match.params.storeName;
        const storeNameBytes = MyWeb3.utils.utf8ToHex(storeName);
        const productsIds = await marketplace.methods.getProductsIdsInStore(storeNameBytes).call();
        
        let productsDetails = [];

        for (let i=0; i<productsIds.length; i++) {
            if (productsIds[i] != 0) {
                productsDetails.push(await marketplace.methods.getProductDetails(productsIds[i]).call());
            }
        }

        this.setState({ account, storeName, storeNameBytes, productsDetails });
    }

    renderProducts() {
        const products = this.state.productsDetails.map(details => {
            return (
                <Product details={details} />
            );
        });

        return (
            <div className="row">
                {products}
            </div>
        );
    }

    removeStoreFront = async (event) => {
        event.preventDefault();
        await marketplace.methods.removeStoreFront(this.state.storeNameBytes).send({from: this.state.account});
    };

    render() {
        return (
            <div>
                <Header />
                <h1 style={{'textAlign':'center'}}>
                    {this.state.storeName} 
                </h1>
                {this.renderProducts()}

                <button onClick={this.removeStoreFront} className="btn btn-secondary">
                    Remove StoreFront
                </button>
            </div>
        );
    }
};


export default Store;
