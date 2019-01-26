pragma solidity ^0.5;


import "./Storefront.sol";


contract Marketplace {

    address public manager;

    mapping(address => uint256) public adminToId;
    mapping(address => uint256) public storeownerToId;

    /* events */
    event storefrontCreated(Storefront indexed newStorefront);
    
    /* list of deployed storefronts contracts */
    address[] public deployedStorefronts;

    /* helpers */
    mapping(address => address) public storeAddressToStoreowner;
    mapping(address => uint256) public storeAddressToId;
    mapping(address => address[]) public storeownerToStorefronts;
    address[] public admins;
    address[] public storeowners;


    constructor() public {
        manager = msg.sender;
    }

    /* manager functionalities */
    function addAdmin(address _newAdmin) public {
        require(msg.sender == manager, "Only manager can add new admins!");
        require(adminToId[_newAdmin] == 0, "This admin is already registered!");

        adminToId[_newAdmin] = getNewAdminId();
        admins.push(_newAdmin);
    }

    function removeAdmin(address _currAdmin) public {
        require(msg.sender == manager, "Only manager can remove admins!");

        delete admins[adminToId[_currAdmin]-1];
        delete adminToId[_currAdmin];
    }

    /* admins functionalities */
    function addStoreowner(address _newStoreowner) public {
        require(adminToId[msg.sender] != 0, "Only admins can add new storeowners!");
        require(storeownerToId[_newStoreowner] == 0, "This admin is already registered!");

        storeownerToId[_newStoreowner] = getNewStoreownerId();
        storeowners.push(_newStoreowner);
    }

    function removeStoreowner(address _currStoreowner) public {
        require(adminToId[msg.sender] != 0, "Only admins can remove storeowners!");

        delete storeowners[storeownerToId[_currStoreowner]-1];
        delete storeownerToId[_currStoreowner];
    }

    /* storeowners functionalities */
    function createStorefront(bytes32 _storeName) public {
        require(storeownerToId[msg.sender] != 0, "Only registered storeowners can create new storefronts!");

        Storefront newStorefront = new Storefront(_storeName, msg.sender);

        storeAddressToId[address(newStorefront)] = getNewStorefrontId();
        deployedStorefronts.push(address(newStorefront));

        storeAddressToStoreowner[address(newStorefront)] = msg.sender;
        storeownerToStorefronts[msg.sender].push(address(newStorefront));

        emit storefrontCreated(newStorefront);
    }

    function removeStorefront(address _storeAddress) public {
        require(storeAddressToStoreowner[_storeAddress] == msg.sender, "Only storeowners can remove their storefronts!");

        Storefront toBeDestructed = Storefront(_storeAddress);
        
        toBeDestructed.kill(msg.sender);
        
        delete deployedStorefronts[storeAddressToId[_storeAddress]-1];
        delete storeAddressToId[_storeAddress];
        delete storeAddressToStoreowner[_storeAddress];
    }

    /* helpers */
    function getDeployedStorefronts() public view returns (address[] memory) {
        return deployedStorefronts;
    }

    function getAdmins() public view returns (address[] memory) {
        return admins;
    }

    function getStoreowners() public view returns (address[] memory) {
        return storeowners;
    }

    function getNewAdminId() public view returns (uint256) {
        /* Ids starts from 1 */
        return admins.length + 1;
    }

    function getNewStoreownerId() public view returns (uint256) {
        /* Ids starts from 1 */
        return storeowners.length + 1;
    }

    function getNewStorefrontId() public view returns (uint256) {
        /* Ids starts from 1 */
        return deployedStorefronts.length + 1;
    }

    function getOwnerStorefronts(address _storeowner) public view returns (address[] memory) {
        return storeownerToStorefronts[_storeowner];
    }
}