pragma solidity ^0.5;


import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Storefront {
    using SafeMath for uint256;

    address public storeowner;
    bytes32 public storeName;
    bool public stopped = false;

    struct Product {
        uint256 id;
        bytes32 name;
        uint256 price;
        uint256 quantity;
    }

    Product[] public products;
    mapping(uint256 => Product) public idToProduct;
    
    uint256[] public productsIds;

    /* modifiers */
    modifier onlyStoreowner {
        require(storeowner == msg.sender, "This is a storeowner-only function!");
        _;
    }

    modifier notStopped {
        require(stopped == false, "This contract is stopped!");
        _;
    }

    constructor(bytes32 _storeName, address _storeowner) public {
        storeowner = _storeowner;
        storeName = _storeName;
    }

    /* storeowners functionalities */
    function addProduct(
        bytes32 _prName, 
        uint256 _prPrice, 
        uint256 _prQuantity) 
        public  onlyStoreowner returns (uint256 prId) 
    {
        prId = getNewProductId();
        Product memory product = Product(prId, _prName, _prPrice, _prQuantity);

        /* add product */
        products.push(product);
        idToProduct[prId] = product;
        productsIds.push(prId);

        return prId;
    }

    function removeProduct(uint256 _prId) public onlyStoreowner {

        /* remove product */
        delete products[_prId.sub(1)];
        delete idToProduct[_prId];
        delete productsIds[_prId.sub(1)];
    }

    function editProductPrice(uint256 _prId, uint256 _newPrice) public onlyStoreowner {

        /* update prices */
        products[_prId.sub(1)].price = _newPrice;
        idToProduct[_prId].price = _newPrice;
    }

    function withdrawFunds() public onlyStoreowner {
        msg.sender.transfer(address(this).balance);
    }

    /* shoppers functionalities */
    function buyProduct(uint256 _prId, uint256 _quantity) public notStopped payable {
        require(idToProduct[_prId].price.mul(_quantity) == msg.value, "Sent Ethers is not enough!");
        require(idToProduct[_prId].quantity >= _quantity, "Not enough pieces are available!");

        /* update product */
        products[_prId.sub(1)].quantity = products[_prId.sub(1)].quantity.sub(_quantity);
        idToProduct[_prId].quantity = idToProduct[_prId].quantity.sub(_quantity);
    }

    /* destroy the contract and reclaim the leftover funds */
    function kill(address payable _txOrigin) public {
        require(storeowner == _txOrigin, "Only storeowners can remove their storefronts!");
        selfdestruct(_txOrigin);
    }

    function stopContract() public onlyStoreowner {
        stopped = true;
    }

    /* helpers */
    function getNewProductId() private view returns (uint256) {
        /* Ids starts from 1 */
        return products.length.add(1);
    }

    function getProductsIds() public view returns (uint256[] memory) {
        return productsIds;
    }

    function getProductDetails(uint256 _prId) public view returns (uint256, bytes32, uint256, uint256) {
        Product memory product = idToProduct[_prId];
        return (product.id, product.name, product.price, product.quantity);
    }
}