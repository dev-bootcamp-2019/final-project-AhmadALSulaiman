import MyWeb3 from './MyWeb3';
import Marketplace from './contracts/Marketplace.json';


const instance = new MyWeb3.eth.Contract(
    Marketplace.abi,
    '0xc34175A79ACca40392bECD22ff10fAeBFE780Ae7'
);


export default instance;
