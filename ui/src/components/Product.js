import React, { Component } from 'react';
import MyWeb3 from '../MyWeb3';
import marketplace from '../marketplace';


class Product extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: null,
            newPrice: '',
        };
    }

    async componentDidMount() {
        const account = MyWeb3.currentProvider.selectedAddress;
        this.setState({ account });
    }

    buyProduct = async (event) => {
        event.preventDefault();
        await marketplace.methods.buyProduct(this.props.details[0], this.props.details[1])
                                 .send({from: this.state.account, value: this.props.details[3]});
    };

    removeProduct = async (event) => {
        event.preventDefault();
        await marketplace.methods.removeProduct(this.props.details[0], this.props.details[1]).send({from: this.state.account});
    }

    editProductPrice = async (event) => {
        event.preventDefault();
        let result = await marketplace.methods.editProductPrice(this.props.details[0], this.props.details[1], this.state.newPrice).send({from: this.state.account});
        console.log('>>>', result);
    }

    render() {
        return (
            <div className="container">
                <div className="col-3">
                <form onSubmit={this.buyProduct}>
                    <div className="card" style={{'width':'16rem'}}>
                    <img className="card-img-top" src="https://gusandruby.com/wp-content/uploads/2015/03/img-storefront-gallery-1.jpg" alt="Card image cap" />
                    <div className="card-body">
                        <p className="card-title">{ MyWeb3.utils.hexToUtf8(this.props.details[2]) }</p>
                        <p className="card-title">{ this.props.details[3] } wei/piece</p>
                        <p className="card-title">{ this.props.details[4] } Pieces left</p>
                        <button className="btn btn-secondary">
                            Buy Product
                        </button>
                    </div>
                    </div>
                </form>
                </div>
                <button onClick={this.removeProduct} className="btn btn-secondary">
                    Remove Product
                </button>
                <form onSubmit={this.editProductPrice}>
                    <label>Edit Product Price</label>
                    <input
                        value={this.state.newPrice}
                        onChange={event => this.setState({newPrice: event.target.value})}
                        className="form-control"
                        type="text"
                        placeholder="New Price"
                    />
                    <button className="btn btn-secondary">
                        Edit Product
                    </button>
                </form>
            </div>
        );
    }
};


export default Product;
