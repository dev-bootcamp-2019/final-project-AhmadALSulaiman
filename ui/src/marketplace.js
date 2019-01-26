import MyWeb3 from './MyWeb3';
import Marketplace from './contracts/Marketplace.json';


const instance = new MyWeb3.eth.Contract(
    Marketplace.abi,
    '0xb113d904f84950c7b1C8663fAB9baa1d8095b1e2'
);


export default instance;
