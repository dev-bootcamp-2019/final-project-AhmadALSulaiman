import React, { Component } from 'react';
import MyWeb3 from '../MyWeb3';
import Header from './Header';
import marketplace from '../marketplace';


class Manager extends Component {
    constructor() {
        super();

        this.state = {
            account: null,
            newAdminAddress: '',
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
                    </div>
                </div>
                </div>
            </div>
            
        );
    }
};


export default Manager;
