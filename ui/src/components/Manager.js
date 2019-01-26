import React, { Component } from 'react';
import MyWeb3 from '../MyWeb3';
import Header from './Header';
import marketplace from '../marketplace';


class Manager extends Component {
    constructor() {
        super();

        this.state = {
            account: null,
            adminsAddresses: [],
            numOfAdmins: 0,
            newAdminAddress: '',
            currAdminAddress: '',
        }
    }

    async componentDidMount() {

        try {
            const accounts = await MyWeb3.eth.getAccounts();
            const adminsAddresses = await marketplace.methods.getAdmins().call();

            this.setState({ account: accounts[0], adminsAddresses });
        } catch (error) {
            console.log(error);
        }
    }

    addAdmin = async (event) => {
        event.preventDefault();

        try {
            await marketplace.methods.addAdmin(this.state.newAdminAddress).send({from: this.state.account});
            window.location.reload();
        } catch (error) {
            console.log(error);            
        }
    };

    removeAdmin = async (event) => {
        event.preventDefault();

        try {
            await marketplace.methods.removeAdmin(this.state.currAdminAddress).send({from: this.state.account});
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    renderAdmins() {
        let admins = this.state.adminsAddresses.map((address) => {
            if (address != 0) {

                this.state.numOfAdmins++;
                
                return (
                    <p>
                        {address}
                    </p>
                );
            }
        });

        if (this.state.numOfAdmins > 0) {
            return (
                <div>
                    <h4>Registered Admins</h4>
    
                    {admins}
                    <form onSubmit={this.removeAdmin} className="form-group">
                        <input 
                            value={this.state.currAdminAddress} 
                            onChange={(event) => this.setState({currAdminAddress: event.target.value})}
                            className="form-control"
                            type="text"
                            placeholder="Paste In Admin Address to Remove"
                        />
                        <button className="btn btn-danger" style={{"marginTop":"10px"}}>Remove Admin</button>
                    </form>
                </div>
            );
        } else {
            return <h4 style={{"textAlign":"center"}}>No admins are registered.</h4>
        }
    }

    render() {
        return (
            <div>
                <Header />
                <div className="container">
                <div className="row">
                    <div className="col-6">
                        <form onSubmit={this.addAdmin} className="form-group">
                            <h4>Add New Admin</h4>
                            <input 
                                value={this.state.newAdminAddress}
                                onChange={event => this.setState({newAdminAddress: event.target.value})} 
                                className="form-control" 
                                type="text" 
                                placeholder="Admin Address" 
                            />
                            <button className="btn btn-secondary" style={{'marginTop':'10px'}}>Add Admin</button>
                        </form>
                    </div>

                    <div className="col-6">
                        {this.renderAdmins()}
                    </div>
                </div>
                </div>
            </div>
            
        );
    }
};


export default Manager;
