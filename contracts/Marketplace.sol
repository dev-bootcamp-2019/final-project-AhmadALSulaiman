pragma solidity ^0.5;


contract Marketplace {

    struct Product {
        bytes32 storeName;
        uint256 id;
        bytes32 name;
        uint256 price;
        uint256 amount;
    }

    address public manager;

    mapping(address => bool) public isAdmin;
    mapping(address => bool) public isStoreOwner;

    /* maps a store to its owner */
    mapping(bytes32 => address payable) public storeToOwner;

    /* maps stores and products */
    mapping(bytes32 => mapping(uint256 => Product)) public storeToProducts;

    /* events */
    event storeCreated(bytes32 indexed storeName, uint256 indexed storeId);

    /* helpers */
    mapping(bytes32 => uint256[]) public storeToProductsIds;
    mapping(uint256 => Product) public idToProduct;
    bytes32[] public storeFronts;


    constructor() public {
        manager = msg.sender;
    }

    /* managers functionalities */
    function addAdmin(address _newAdmin) public {
        require(msg.sender == manager, "Only manager can add new admins!");
        isAdmin[_newAdmin] = true;
    }

    function removeAdmin(address _currAdmin) public {
        require(msg.sender == manager, "Only manager can remove admins!");
        isAdmin[_currAdmin] = false;
    }

    /* admins functionalities */
    function addStoreOwner(address _newStoreOwner) public {
        require(isAdmin[msg.sender], "Only admins can add new store owners!");
        isStoreOwner[_newStoreOwner] = true;
    }

    function removeStoreOwner(address _currStoreOwner) public {
        require(isAdmin[msg.sender], "Only admins can remove store owners!");
        isStoreOwner[_currStoreOwner] = false;
    }

    /* storeowners functionalities */
    function createStoreFront(bytes32 _storeName) public {
        require(isStoreOwner[msg.sender], "Only registered store owners can create new store fronts!");
        
        storeToOwner[_storeName] = msg.sender;
        storeFronts.push(_storeName);

        emit storeCreated(_storeName, getNewStoreId());
    }

    function removeStoreFront(bytes32 _storeName) public {
        require(isStoreOwner[msg.sender], "Only store owners can remove their store fronts!");
        delete storeToOwner[_storeName];
    }

    function addProduct(
        bytes32 _storeName, 
        bytes32 _prName, 
        uint256 _prPrice, 
        uint256 _prAmount) 
        public returns (uint256 prId) 
    {
        require(storeToOwner[_storeName] == msg.sender, "Only store owners can add new products!");

        prId = getNewProductId(_storeName);

        Product memory product = Product(_storeName, prId, _prName, _prPrice, _prAmount);

        /* add product to store */
        storeToProducts[_storeName][prId] = product;

        /* update helpers */
        idToProduct[prId] = product;
        storeToProductsIds[_storeName].push(prId);

        return prId;
    }

    function removeProduct(bytes32 _storeName, uint256 _prId) public {
        require(storeToOwner[_storeName] == msg.sender, "Only store owners can add new products!");

        delete storeToProducts[_storeName][_prId];
        
        /* update helpers */
        delete idToProduct[_prId];
        delete storeToProductsIds[_storeName][_prId-1];
    }

    function buyProduct(bytes32 _storeName, uint256 _prId) public payable {
        require(storeToOwner[_storeName] != address(0), "Store does not exist!");
        require(msg.value == storeToProducts[_storeName][_prId].price, "Sent Ethers is not enough!");
        /* @@@ improve on this @@@ */
        require(_storeName == storeToProducts[_storeName][_prId].storeName, "Required product is not in this store!");
        require(storeToProducts[_storeName][_prId].amount > 0, "No more products available!");

        storeToOwner[_storeName].transfer(msg.value);
        storeToProducts[_storeName][_prId].amount--;
        idToProduct[_prId].amount--;
    }

    /* helpers */
    function getNewProductId(bytes32 _storeName) private view returns (uint256) {
        /* IDs starts from 1 */
        return storeToProductsIds[_storeName].length + 1;
    }

    function getNewStoreId() public view returns (uint256) {
        /* IDs starts from 1 */
        return storeFronts.length + 1;
    }

    function getStoreFronts() public view returns (bytes32[] memory) {
        return storeFronts;
    }

    function getProductsIdsInStore(bytes32 _storeName) public view returns (uint256[] memory) {
        return storeToProductsIds[_storeName];
    }

    function getProductDetails(uint256 _prId) public view returns (bytes32, uint256, bytes32, uint256, uint256) {
        Product memory product = idToProduct[_prId];
        return (product.storeName, product.id, product.name, product.price, product.amount);
    }
}