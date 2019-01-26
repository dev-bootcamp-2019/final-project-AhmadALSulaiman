import React, { Component } from 'react';
import Header from './Header';
import marketplace from '../marketplace';
import { Link } from 'react-router-dom';


class Stores extends Component {
    constructor() {
        super();

        this.state = {
            storefrontsAddresses: [],
            numberOfStores: 0,
        };
    }

    async componentDidMount() {

        try {
            const storefrontsAddresses = await marketplace.methods.getDeployedStorefronts().call();
            
            this.setState({ storefrontsAddresses });
        } catch (error) {
            console.log(error);
        }
    }

    renderStores() {
        let stores = this.state.storefrontsAddresses.map(storeAddress => {
            if (storeAddress != 0) {

                this.state.numberOfStores++;

                return (
                    <div>
                        <div className="card" style={{'width':'16rem', 'padding':'2px', 'margin':'5px'}}>
                            <img className="card-img-top" src="https://gusandruby.com/wp-content/uploads/2015/03/img-storefront-gallery-1.jpg" alt="Card image cap" />
                            <div className="card-body">
                                <p className="card-title">{storeAddress}</p>
                                {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                                <Link to={'/store/' + storeAddress} className="btn btn-primary">Open Store</Link>
                            </div>
                        </div>
                    </div>
                );
            }
        });
            
        if (this.state.numberOfStores > 0) {
            return (
                <div className="row">
                    {stores}
                </div>
            );
        } else {
            return (
                <h1 style={{"textAlign":"center"}}>No available stores.</h1>
            );
        }
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
