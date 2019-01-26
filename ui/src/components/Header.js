import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyWeb3 from '../MyWeb3';


class Header extends Component {
    constructor() {
        super();

        this.state = {
            account: null,
        }
    }

    async componentDidMount() {

        try {
            const accounts = await MyWeb3.eth.getAccounts();
            this.setState({ account: accounts[0] });
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{'marginBottom': '10px'}}>
                <a className="navbar-brand" href="/">Marketplace</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
    
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/managers">Managers</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/admins">Admins</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/storeowners">StoreOwners</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/stores">Stores</Link>
                        </li>
                    </ul>

                    <a style={{'color':'white'}} className="nav-link"> 
                        { this.state.account ? `Welcome ${this.state.account}` : 'Could not read selected address!' }
                    </a>
                </div>
            </nav>
        );
    }
};


export default Header;
