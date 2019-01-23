import React, { Component } from 'react';
import MyWeb3 from '../MyWeb3';
import marketplace from '../marketplace';
import Header from './Header';


class Admin extends Component {
    constructor() {
        super();

        this.state = {
            account: null,
            newAdminAddress: '',
            newStoreOwnerAddress: '',
        }
    }

    async componentDidMount() {
        const account = MyWeb3.currentProvider.selectedAddress;
        this.setState({ account });
    }

    addAdmin = async (event) => {
        event.preventDefault();

        await marketplace.methods.addAdmin(this.state.newAdminAddress).send({from: this.state.account});
        let isAdmin = await marketplace.methods.isAdmin(this.state.newAdminAddress).call();

        console.log(this.state.newAdminAddress, ' is admin?', isAdmin);
    };

    addStoreOwner = async (event) => {
        event.preventDefault();

        await marketplace.methods.addStoreOwner(this.state.newStoreOwnerAddress).send({from: this.state.account});
        let isStoreOwner = await marketplace.methods.isStoreOwner(this.state.newStoreOwnerAddress).call();

        console.log(this.state.newStoreOwnerAddress, ' is store owner?', isStoreOwner);
    }

    render() {
        return (
            <div>
                <Header />
                <div className="container">
                <div className="col-lg-8">
                    <div className="row">
                        <div className="col-md-6 form-group">
                        <form onSubmit={this.addAdmin}>
                            <label>Adding Admins</label>
                            <input 
                                value={this.state.newAdminAddress}
                                onChange={event => this.setState({newAdminAddress: event.target.value})} 
                                className="form-control" 
                                type="text" 
                                placeholder="New Admin" 
                            />
                            <button className="btn btn-secondary" style={{'marginTop':'10px'}}>Add Admin</button>
                        </form>
                        </div>    
                        <div className="col-md-6 form-group">
                        <form onSubmit={this.addStoreOwner}>
                            <label>Adding Store Owners</label>
                            <input 
                                value={this.state.newStoreOwnerAddress}
                                onChange={event => this.setState({newStoreOwnerAddress: event.target.value})}
                                className="form-control"
                                type="text"
                                placeholder="New Store Owner"
                            />
                            <button className="btn btn-secondary" style={{'marginTop':'10px'}}>Add StoreOwner</button>
                        </form>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
};


export default Admin;
