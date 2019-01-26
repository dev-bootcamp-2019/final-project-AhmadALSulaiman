import React, { Component } from 'react';
import MyWeb3 from '../MyWeb3';
import Header from './Header';
import marketplace from '../marketplace';
import { Redirect, Link } from 'react-router-dom';


class Storeowner extends Component {
    constructor() {
        super();

        this.state = {
            account: null,
            storefrontName: '',
            createdStoreAddress: '',
            ownersStorefronts: [],
            storefrontsAddresses: [],
            numOfStorefronts: 0,
            storefrontAddress: '',
            redirect: false,
        };
    }

    async componentDidMount() {

        try {
            const accounts = await MyWeb3.eth.getAccounts();
            const ownersStorefronts = await marketplace.methods.getOwnerStorefronts(accounts[0]).call();
            const storefrontsAddresses = await marketplace.methods.getDeployedStorefronts().call();

            this.setState({ account: accounts[0], ownersStorefronts, storefrontsAddresses });
        } catch (error) {
            console.log(error);
        }
    }

    createStorefront = async (event) => {
        event.preventDefault();

        try {

            let storeNameBytes = MyWeb3.utils.utf8ToHex(this.state.storefrontName);
            let newStore = await marketplace.methods.createStorefront(storeNameBytes).send({from: this.state.account});
            
            const txEvents = await newStore['events'];
            this.setState({createdStoreAddress: txEvents.storefrontCreated.returnValues.newStorefront});

            this.setState({redirect: true});

        } catch (error) {
            console.log(error);
        }
    }

    removeStorefront = async (event) => {
        event.preventDefault();

        try {
            await marketplace.methods.removeStorefront(this.state.storefrontAddress).send({from: this.state.account});
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    renderOwnersStorefronts() {
        let ownersStorefronts = this.state.ownersStorefronts.map((storefront) => {
            if (this.state.storefrontsAddresses.includes(storefront)) {

                this.state.numOfStorefronts++;

                return (
                    <p>
                        <Link to={`/store/${storefront}`}>{storefront}</Link>
                    </p>
                );
            }
        });

        if (this.state.numOfStorefronts > 0) {
            return (
                <div>
                    <h4>Registered Storefronts</h4>
                    
                    {ownersStorefronts}
                    <form onSubmit={this.removeStorefront} className="form-group">
                        <input 
                            value={this.state.storefrontAddress} 
                            onChange={(event) => this.setState({storefrontAddress: event.target.value})}
                            className="form-control"
                            type="text"
                            placeholder="Paste In Storefront Address to Remove"
                        />
                        <button className="btn btn-danger" style={{"marginTop":"10px"}}>Remove Storefront</button>
                    </form>
                </div>
            );
        } else {
            return <h4 style={{"textAlign":"center"}}>You don't have registered storefronts.</h4>
        }
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to={`/store/${this.state.createdStoreAddress}`} />;
        }

        return (
            <div>
                <Header />
                <div className="container">
                <div className="row">
                    <div className="col-6">
                        <form onSubmit={this.createStorefront}>
                            <h4>Add New Storefront</h4>
                            <input 
                                value={this.state.storefrontName}
                                onChange={event => this.setState({storefrontName: event.target.value})}
                                className="form-control" 
                                type="text" 
                                placeholder="Storefront Name" 
                            />
                            <button className="btn btn-secondary" style={{'marginTop':'10px'}}>Create Storefront</button>
                        </form>
                    </div>

                    <div className="col-6">
                        {this.renderOwnersStorefronts()}
                    </div>
                </div>
                </div>
            </div>
        );
    }
};


export default Storeowner;
