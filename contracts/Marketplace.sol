pragma solidity ^0.5;


import "./Storefront.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Marketplace {
    using SafeMath for uint256;

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

    /* modifiers */
    modifier onlyManager {
        require(msg.sender == manager, "This is a manager-only function!");
        _;
    }

    modifier onlyAdmin {
        require(adminToId[msg.sender] != 0, "This is an admin-only function!");
        _;
    }

    modifier onlyStoreowner {
        require(storeownerToId[msg.sender] != 0, "This is a storeowner-only function!");
        _;
    }


    constructor() public {
        manager = msg.sender;
    }

    /* manager functionalities */
    function addAdmin(address _newAdmin) public onlyManager {
        require(adminToId[_newAdmin] == 0, "This admin is already registered!");

        adminToId[_newAdmin] = getNewAdminId();
        admins.push(_newAdmin);
    }

    function removeAdmin(address _currAdmin) public onlyManager {

        delete admins[adminToId[_currAdmin].sub(1)];
        delete adminToId[_currAdmin];
    }

    /* admins functionalities */
    function addStoreowner(address _newStoreowner) public onlyAdmin {
        require(storeownerToId[_newStoreowner] == 0, "This admin is already registered!");

        storeownerToId[_newStoreowner] = getNewStoreownerId();
        storeowners.push(_newStoreowner);
    }

    function removeStoreowner(address _currStoreowner) public onlyAdmin {

        delete storeowners[storeownerToId[_currStoreowner].sub(1)];
        delete storeownerToId[_currStoreowner];
    }

    /* storeowners functionalities */
    function createStorefront(bytes32 _storeName) public onlyStoreowner {

        Storefront newStorefront = new Storefront(_storeName, msg.sender);

        storeAddressToId[address(newStorefront)] = getNewStorefrontId();
        deployedStorefronts.push(address(newStorefront));

        storeAddressToStoreowner[address(newStorefront)] = msg.sender;
        storeownerToStorefronts[msg.sender].push(address(newStorefront));

        emit storefrontCreated(newStorefront);
    }

    function removeStorefront(address _storeAddress) public onlyStoreowner {

        Storefront toBeDestructed = Storefront(_storeAddress);
        
        toBeDestructed.kill(msg.sender);
        
        delete deployedStorefronts[storeAddressToId[_storeAddress].sub(1)];
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
        return admins.length.add(1);
    }

    function getNewStoreownerId() public view returns (uint256) {
        /* Ids starts from 1 */
        return storeowners.length.add(1);
    }

    function getNewStorefrontId() public view returns (uint256) {
        /* Ids starts from 1 */
        return deployedStorefronts.length.add(1);
    }

    function getOwnerStorefronts(address _storeowner) public view returns (address[] memory) {
        return storeownerToStorefronts[_storeowner];
    }
}