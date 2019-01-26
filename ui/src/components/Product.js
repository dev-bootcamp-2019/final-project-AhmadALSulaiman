import React, { Component } from 'react';
import MyWeb3 from '../MyWeb3';
import Storefront from '../storefront';
import { Redirect } from 'react-router-dom';


class Product extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: null,
            newPrice: '',
            storefront: null,
            quantity: 1,
            redirect: false,
        };
    }

    async componentDidMount() {

        try {
            const accounts = await MyWeb3.eth.getAccounts();
            const storefront = Storefront(this.props.storefrontAddress);

            this.setState({ account: accounts[0], storefront });
        } catch (error) {
            console.log(error);
        }
    }

    buyProduct = async (event) => {
        event.preventDefault();

        try {
            await this.state.storefront.methods.buyProduct(this.props.details[0], this.state.quantity)
                                 .send({from: this.state.account, value: this.props.details[2] * this.state.quantity});
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    removeProduct = async (event) => {
        event.preventDefault();

        try {
            await this.state.storefront.methods.removeProduct(this.props.details[0]).send({from: this.state.account});
            this.setState({redirect: true});
        } catch (error) {
            console.log(error);
        }
    }

    editProductPrice = async (event) => {
        event.preventDefault();

        try {
            await this.state.storefront.methods.editProductPrice(this.props.details[0], this.state.newPrice).send({from: this.state.account});
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to={`/store/${this.props.storefrontAddress}`} />;
        }

        return (
            <div className="col-4">
                <div className="card" style={{'width':'15rem'}}>
                    <img className="card-img-top" src="https://gusandruby.com/wp-content/uploads/2015/03/img-storefront-gallery-1.jpg" alt="Card image cap" />
                    <div className="row">
                        <div className="col-12">
                                <input
                                    value={this.state.quantity}
                                    onChange={(event) => this.setState({quantity: event.target.value})}
                                    className="form-control"
                                    type="number"
                                    placeholder="Quantity"
                                /> 
                        </div>
                    </div>
                    
                    <div className="card-body">
                        <p><strong className="card-title">{ MyWeb3.utils.hexToUtf8(this.props.details[1]) }</strong></p>

                        <p className="card-title">{ this.props.details[2] } <strong>wei/piece</strong> </p>
                        <p className="card-title"><strong>{ this.props.details[3] }</strong> Pieces left</p>

                        <hr></hr>

                        <div className="row">
                            <div className="col-6">
                                <button onClick={this.buyProduct} className="btn btn-primary btn-sm">
                                    Buy Product
                                </button>
                            </div>
                            <div className="col-6">
                                <button onClick={this.removeProduct} className="btn btn-danger btn-sm">
                                    Remove Product
                                </button>
                            </div>
                        </div>
                    </div>

                        <hr></hr>

                    <div>
                        <form onSubmit={this.editProductPrice}>
                            <h6 style={{"textAlign":"center"}}>Edit Product Price</h6>
                            <input
                                value={this.state.newPrice}
                                onChange={(event) => this.setState({newPrice: event.target.value})}
                                className="form-control"
                                type="text"
                                placeholder="New Price"
                            />
                            <button className="btn btn-secondary btn-sm" style={{"marginLeft":"65px", "marginTop":"10px", "marginBottom":"5px"}}>
                                Edit Price
                            </button>
                        </form>
                    </div>
                </div>
                <br />
            </div>
        );
    }
};


export default Product;
