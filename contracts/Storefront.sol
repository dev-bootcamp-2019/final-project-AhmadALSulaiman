pragma solidity ^0.5;


contract Storefront {

    address public storeowner;
    bytes32 public storeName;

    struct Product {
        uint256 id;
        bytes32 name;
        uint256 price;
        uint256 quantity;
    }

    Product[] public products;
    mapping(uint256 => Product) public idToProduct;
    
    uint256[] public productsIds;

    /* storeowners functionalities */
    constructor(bytes32 _storeName, address _storeowner) public {
        storeowner = _storeowner;
        storeName = _storeName;
    }

    function addProduct(
        bytes32 _prName, 
        uint256 _prPrice, 
        uint256 _prQuantity) 
        public returns (uint256 prId) 
    {
        require(storeowner == msg.sender, "Only storeowners can add new products!");

        prId = getNewProductId();
        Product memory product = Product(prId, _prName, _prPrice, _prQuantity);

        /* add product */
        products.push(product);
        idToProduct[prId] = product;
        productsIds.push(prId);

        return prId;
    }

    function removeProduct(uint256 _prId) public {
        require(storeowner == msg.sender, "Only storeowners can remove products!");

        /* remove product */
        delete products[_prId-1];
        delete idToProduct[_prId];
        delete productsIds[_prId-1];
    }

    function editProductPrice(uint256 _prId, uint256 _newPrice) public {
        require(storeowner == msg.sender, "Only storeowners can edit products!");

        /* update prices */
        products[_prId-1].price = _newPrice;
        idToProduct[_prId].price = _newPrice;
    }

    function buyProduct(uint256 _prId, uint256 _quantity) public payable {
        require(idToProduct[_prId].price * _quantity == msg.value, "Sent Ethers is not enough!");
        require(idToProduct[_prId].quantity >= _quantity, "Not enough pieces are available!");

        /* update product */
        products[_prId-1].quantity = products[_prId-1].quantity - _quantity;
        idToProduct[_prId].quantity = idToProduct[_prId].quantity - _quantity;
    }

    function withdrawFunds() public {
        require(storeowner == msg.sender, "Only storeowner can withdraw funds!");

        msg.sender.transfer(address(this).balance);
    }

    /* destroy the contract and reclaim the leftover funds */
    function kill(address payable _txOrigin) public {
        require(storeowner == _txOrigin, "Only storeowners can remove their storefronts!");
        selfdestruct(_txOrigin);
    }

    /* helpers */
    function getNewProductId() private view returns (uint256) {
        /* IDs starts from 1 */
        return products.length + 1;
    }

    function getProductsIds() public view returns (uint256[] memory) {
        return productsIds;
    }

    function getProductDetails(uint256 _prId) public view returns (uint256, bytes32, uint256, uint256) {
        Product memory product = idToProduct[_prId];
        return (product.id, product.name, product.price, product.quantity);
    }
}