import React, { Component } from 'react';
import MyWeb3 from '../MyWeb3';
import marketplace from '../marketplace';
import Header from './Header';


class Admin extends Component {
    constructor() {
        super();

        this.state = {
            account: null,
            storeownersAddresses: [],
            numOfStoreowners: 0,
            newStoreownerAddress: '',
            currStoreownerAddress: '',
        }
    }

    async componentDidMount() {

        try {
            const accounts = await MyWeb3.eth.getAccounts();
            const storeownersAddresses = await marketplace.methods.getStoreowners().call();

            this.setState({ account: accounts[0], storeownersAddresses });
        } catch (error) {
            console.log(error);
        }
    }

    addStoreowner = async (event) => {
        event.preventDefault();

        try {
            await marketplace.methods.addStoreowner(this.state.newStoreownerAddress).send({from: this.state.account});
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    removeStoreowner = async (event) => {
        event.preventDefault();

        try {
            await marketplace.methods.removeStoreowner(this.state.currStoreownerAddress).send({from: this.state.account});
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    renderStoreowenrs() {
        let storeowners = this.state.storeownersAddresses.map((address) => {
            if (address != 0) {

                this.state.numOfStoreowners++;

                return (
                    <p>
                        {address}
                    </p>
                );
            }
        });

        if (this.state.numOfStoreowners > 0) {
            return (
                <div>
                    <h4>Registered Storeowners</h4>
    
                    {storeowners}
                    <form onSubmit={this.removeStoreowner} className="form-group">
                        <input 
                            value={this.state.currStoreownerAddress} 
                            onChange={(event) => this.setState({currStoreownerAddress: event.target.value})}
                            className="form-control"
                            type="text"
                            placeholder="Paste In Storeowner Address to Remove"
                        />
                        <button className="btn btn-danger" style={{"marginTop":"10px"}}>Remove Storeowner</button>
                    </form>
                </div>
            );
        } else {
            return (
                <h4 style={{"textAlign":"center"}}>No registered storeowners.</h4>
            );
        }
    }

    render() {
        return (
            <div>
                <Header />
                <div className="container">
                <div className="row">
                    <div className="col-6">
                        <form onSubmit={this.addStoreowner}>
                            <h4>Add New Storeowner</h4>
                            <input 
                                value={this.state.newStoreownerAddress}
                                onChange={event => this.setState({newStoreownerAddress: event.target.value})}
                                className="form-control"
                                type="text"
                                placeholder="New Store Owner"
                            />
                            <button className="btn btn-secondary" style={{'marginTop':'10px'}}>Add Storeowner</button>
                        </form>
                    </div>

                    <div className="col-6">
                        {this.renderStoreowenrs()}
                    </div>
                </div>
                </div>
            </div>
        );
    }
};


export default Admin;
