import MyWeb3 from './MyWeb3';
import Marketplace from './contracts/Marketplace.json';


const instance = new MyWeb3.eth.Contract(
    Marketplace.abi,
    '0x048fA73e8DC04B04C084C2e78fA324a17Ac1D8F5'
);


export default instance;
