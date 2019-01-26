import MyWeb3 from './MyWeb3';
import Storefront from './contracts/Storefront.json';


export default (address) => {
    return new MyWeb3.eth.Contract(Storefront.abi, address);
};
