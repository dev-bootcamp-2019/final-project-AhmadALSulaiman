import React, { Component } from 'react';
import Layout from './components/Layout';


class App extends Component {
    render() {
        return (
            <Layout>
                <div className="container">
                    <h1 style={{'textAlign': 'center'}}>
                        Welcome to Marketplace
                    </h1>
                </div>
            </ Layout>
        );
    }
}


export default App;
