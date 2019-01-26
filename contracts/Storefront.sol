pragma solidity ^0.5;


import "openzeppelin-solidity/contracts/math/SafeMath.sol";


/** @title Storefront Contract */
contract Storefront {

    /* using openzeppelin for uint operations */
    using SafeMath for uint256;

    /* storefront's owner and  storefront' name */
    address public storeowner;
    bytes32 public storeName;

    /* flag for emeregency stop */
    bool public stopped = false;

    /* Products details */
    struct Product {
        uint256 id;
        bytes32 name;
        uint256 price;
        uint256 quantity;
    }

    /* list of products in store and mapping from their ids */
    Product[] public products;
    mapping(uint256 => Product) public idToProduct;
    
    /* helpers */
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

    /** @dev initializes the storefront's owner and name 
      */
    constructor(bytes32 _storeName, address _storeowner) public {
        storeName = _storeName;
        storeowner = _storeowner;
    }


    /* storeowners functionalities */

    /** @dev adds new products
      * @param _prName new product's name
      * @param _prPrice new product's price
      * @param _prQuantity new product's quantity
      * @return new product's id
      */
    function addProduct(
        bytes32 _prName, 
        uint256 _prPrice, 
        uint256 _prQuantity) 
        public onlyStoreowner returns (uint256 prId) 
    {
        prId = getNewProductId();
        Product memory product = Product(prId, _prName, _prPrice, _prQuantity);

        /* add product */
        products.push(product);
        idToProduct[prId] = product;
        productsIds.push(prId);

        return prId;
    }

    /** @dev removes products
      * @param _prId product's id
      */
    function removeProduct(uint256 _prId) public onlyStoreowner {

        /* remove product */
        delete products[_prId.sub(1)];
        delete idToProduct[_prId];
        delete productsIds[_prId.sub(1)];
    }

    /** @dev edits products' prices
      * @param _prId product's id
      * @param _newPrice product's new price
      */
    function editProductPrice(uint256 _prId, uint256 _newPrice) public onlyStoreowner {

        /* update prices */
        products[_prId.sub(1)].price = _newPrice;
        idToProduct[_prId].price = _newPrice;
    }

    /** @dev transfers this contract's balance to the owner
      */
    function withdrawFunds() public onlyStoreowner {
        msg.sender.transfer(address(this).balance);
    }

    /** @dev destroys the contract and reclaims the leftover funds 
      * @param _txOrigin owner's address
      */
    function kill(address payable _txOrigin) public {
        require(storeowner == _txOrigin, "Only storeowners can remove their storefronts!");
        selfdestruct(_txOrigin);
    }

    /** @dev stops the contract from receving Ethers 
      */
    function stopContract() public onlyStoreowner {
        stopped = true;
    }


    /* shoppers functionalities */

    /** @dev receives Ethers for sold products and update the store's state accordingly 
      * @param _prId product's id
      * @param _quantity quantity to purchase
      */
    function buyProduct(uint256 _prId, uint256 _quantity) public notStopped payable {
        require(idToProduct[_prId].price.mul(_quantity) == msg.value, "Sent Ethers is not enough!");
        require(idToProduct[_prId].quantity >= _quantity, "Not enough pieces are available!");

        /* update product */
        products[_prId.sub(1)].quantity = products[_prId.sub(1)].quantity.sub(_quantity);
        idToProduct[_prId].quantity = idToProduct[_prId].quantity.sub(_quantity);
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