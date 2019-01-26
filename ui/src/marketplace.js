import MyWeb3 from './MyWeb3';
import Marketplace from './contracts/Marketplace.json';


const instance = new MyWeb3.eth.Contract(
    Marketplace.abi,
    '0x0AAd08E6215E7924b261Dfd4A014f9830A118715'
);


export default instance;
