import React, { Component } from 'react';
import MyWeb3 from '../MyWeb3';
import Header from '../components/Header';
import Product from '../components/Product';
import Storefront from '../storefront';
import marketplace from '../marketplace';
import { Redirect } from 'react-router-dom';


class Store extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: null,
            storefront: null,
            newProductName: '',
            newProductPrice: '',
            newProductQuantity: '',
            productsDetails: [],
            redirect: false,
        };
    }

    async componentDidMount() {

        try {
            const accounts = await MyWeb3.eth.getAccounts();
            const storefront = Storefront(this.props.match.params.storeAddress);
            const productsIds = await storefront.methods.getProductsIds().call();
            let productsDetails = [];

            for (let i=0; i<productsIds.length; i++) {
                if (productsIds[i] != 0) {
                    productsDetails.push(await storefront.methods.getProductDetails(productsIds[i]).call());
                }
            }

            this.setState({ account: accounts[0], storefront, productsDetails });

        } catch (error) {
            console.log(error);
        }
    }

    addProduct = async (event) => {
        event.preventDefault();

        try {
            let productNameBytes = MyWeb3.utils.utf8ToHex(this.state.newProductName);
            await this.state.storefront.methods.addProduct(productNameBytes, this.state.newProductPrice, 
                this.state.newProductQuantity).send({from: this.state.account});

            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    withdrawFunds = async (event) => {
        event.preventDefault();

        try {
            await this.state.storefront.methods.withdrawFunds().send({from: this.state.account});
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    removeStorefront = async (event) => {
        event.preventDefault();

        try {
            await marketplace.methods.removeStorefront(this.props.match.params.storeAddress).send({from: this.state.account});
            this.setState({redirect: true});
        } catch (error) {
            console.log(error);     
        }
    };

    renderProducts() {
        const products = this.state.productsDetails.map(details => {
            return (
                <Product details={details} storefrontAddress={this.props.match.params.storeAddress} />
            );
        });

        if (products.length > 0) {
            return (
                <div className="row">
                    {products}
                </div>
            );
        } else {
            return (
                <h1 style={{"textAlign":"left"}}>This store has no products.</h1>
            );
        }
    }
    
    render() {
        
        if (this.state.redirect) {
            return <Redirect to='/stores' />;
        }
        
        return (
            <div>
                <Header />
                <div className="row">
                    <div className="col-3">
                        <div className="col-10">
                            <form onSubmit={this.addProduct}>
                                <h4>Add New Product</h4>
                                <input 
                                    value={this.state.newProductName} 
                                    onChange={event => this.setState({newProductName: event.target.value})} 
                                    className="form-control" 
                                    type="text" 
                                    placeholder="Name" 
                                    style={{"marginTop":"3px"}}
                                />
                                <input 
                                    value={this.state.newProductPrice} 
                                    onChange={event => this.setState({newProductPrice: event.target.value})}
                                    className="form-control" 
                                    type="text" 
                                    placeholder="Price (wei)" 
                                    style={{"marginTop":"3px"}}
                                />
                                <input 
                                    value={this.state.newProductQuantity} 
                                    onChange={event => this.setState({newProductQuantity: event.target.value})}
                                    className="form-control" 
                                    type="text" 
                                    placeholder="Quantity" 
                                    style={{"marginTop":"3px"}}
                                />
                                <button className="btn btn-secondary" style={{'marginTop':'7px', 'marginLeft':'50px'}}>Add Product</button>
                            </form>

                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>

                            <div className="col">
                                <form onSubmit={this.withdrawFunds}>
                                    <button style={{"marginLeft":"9px"}} className="btn btn-success"> 
                                        Withdraw Funds
                                    </button>
                                </form>

                                <form onSubmit={this.removeStorefront}>
                                    <button style={{"marginTop":"10px"}} className="btn btn-danger"> 
                                        Remove Storefront
                                    </button>
                                </form>
                            </div>
                        </div>
                        
                    </div>

                    <div className="col-8">
                        {this.renderProducts()}
                    </div>
                </div>
            </div>
        );
    }
};


export default Store;
