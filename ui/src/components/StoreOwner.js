import React, { Component } from 'react';
import MyWeb3 from '../MyWeb3';
import Header from './Header';
import marketplace from '../marketplace';


class StoreOwner extends Component {
    constructor() {
        super();

        this.state = {
            account: null,
            
            storeFrontName: '',

            newProductName: '',
            newProductPrice: '',
            newProductAmount: '',
        };
    }

    async componentDidMount() {
        const account = MyWeb3.currentProvider.selectedAddress;
        this.setState({ account });
    }

    createStoreFront = async (event) => {
        event.preventDefault();
        
        let storeNameBytes = MyWeb3.utils.utf8ToHex(this.state.storeFrontName);
        
        let newStore = await marketplace.methods.createStoreFront(storeNameBytes).send({from: this.state.account});
        let storeOwner = await marketplace.methods.storeToOwner(storeNameBytes).call();

        /* get emitted events from the marketplace contract (event for creating new stores) */
        const txEvents = await newStore['events'];
        const createdStoreName = txEvents.storeCreated.returnValues.storeName;
        const createdStoreId = txEvents.storeCreated.returnValues.storeId;
        
        console.log(storeOwner, 'is the owner of', MyWeb3.utils.hexToUtf8(createdStoreName), 'with id of', createdStoreId);
    }

    addProduct = async (event) => {
        event.preventDefault();

        let storeNameBytes = MyWeb3.utils.utf8ToHex(this.state.storeFrontName);
        let productNameBytes = MyWeb3.utils.utf8ToHex(this.state.newProductName);

        let newProductId = await marketplace.methods.addProduct(
            storeNameBytes, productNameBytes, this.state.newProductPrice, 
            this.state.newProductAmount).send({from: this.state.account});

        console.log('Newly added product has id of', newProductId);
    }
    
    render() {
        return (
            <div>
                <Header />
                <div className="container">
                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-md-3 form-group">
                            <form onSubmit={this.createStoreFront}>
                                <label>Adding StoreFronts</label>
                                <input 
                                    value={this.state.storeFrontName}
                                    onChange={event => this.setState({storeFrontName: event.target.value})}
                                    className="form-control" 
                                    type="text" 
                                    placeholder="New Store Front" 
                                />
                                <button className="btn btn-secondary" style={{'marginTop':'10px'}}>Create StoreFront</button>
                            </form>
                        </div>
                    
                        <div className="col-md-3 form-group">
                            <form onSubmit={this.addProduct}>
                                <label>Adding Products</label>
                                <input 
                                    value={this.state.storeFrontName} 
                                    onChange={event => this.setState({storeFrontName: event.target.value})} 
                                    className="form-control" 
                                    type="text" 
                                    placeholder="Product Store" 
                                />
                                <input 
                                    value={this.state.newProductName} 
                                    onChange={event => this.setState({newProductName: event.target.value})} 
                                    className="form-control" 
                                    type="text" 
                                    placeholder="Product Name" 
                                />
                                <input 
                                    value={this.state.newProductPrice} 
                                    onChange={event => this.setState({newProductPrice: event.target.value})}
                                    className="form-control" 
                                    type="text" 
                                    placeholder="Product Price" 
                                />
                                <input 
                                    value={this.state.newProductAmount} 
                                    onChange={event => this.setState({newProductAmount: event.target.value})}
                                    className="form-control" 
                                    type="text" 
                                    placeholder="Product Amount" 
                                />
                                <button className="btn btn-secondary" style={{'marginTop':'10px'}}>Add Product</button>
                            </form>
                        </div>
                    
                        {/* <div className="col-md-3 form-group">
                            <label>Removing Products</label>
                            <input className="form-control" id="productStoreFrontName" type="text" placeholder="Add New Product's Store" />
                            <input className="form-control" id="productId" type="text" placeholder="Add New Product's Id" />
                            <button id="removeProduct" className="btn btn-primary" style={{'marginTop':'10px'}}>Remove Product</button>
                        </div> */}
                    </div>
                </div>
                </div>
            </div>
    
        );
    }
};


export default StoreOwner;
