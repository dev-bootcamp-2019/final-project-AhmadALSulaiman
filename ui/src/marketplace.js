import MyWeb3 from './MyWeb3';
import Marketplace from './contracts/Marketplace.json';


const instance = new MyWeb3.eth.Contract(
    Marketplace.abi,
    '0x1b88Bdb8269A1aB1372459F5a4eC3663D6f5cCc4'
);


export default instance;