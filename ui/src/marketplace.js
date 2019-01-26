import MyWeb3 from './MyWeb3';
import Marketplace from './contracts/Marketplace.json';


const instance = new MyWeb3.eth.Contract(
    Marketplace.abi,
    '0xB9bdBAEc07751F6d54d19A6B9995708873F3DE18'
);


export default instance;
