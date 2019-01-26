pragma solidity ^0.5;


import "./Storefront.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


/** @title Marketplace Contract */
contract Marketplace {

    /* using openzeppelin for uint operations */
    using SafeMath for uint256;

    /* the marketplace manager address */
    address public manager;

    /* mapping admins and storeowners to their ids */
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

    /** @dev initializes the manager address 
      */
    constructor() public {
        manager = msg.sender;
    }


    /* manager functionalities */

    /** @dev adds new admins 
      * @param _newAdmin new admin's address
      */
    function addAdmin(address _newAdmin) public onlyManager {
        require(adminToId[_newAdmin] == 0, "This admin is already registered!");

        adminToId[_newAdmin] = getNewAdminId();
        admins.push(_newAdmin);
    }

    /** @dev removes admins 
      * @param _currAdmin admin's address
      */
    function removeAdmin(address _currAdmin) public onlyManager {

        delete admins[adminToId[_currAdmin].sub(1)];
        delete adminToId[_currAdmin];
    }


    /* admins functionalities */

    /** @dev adds new storeowners
      * @param _newStoreowner new storeowner's address
      */
    function addStoreowner(address _newStoreowner) public onlyAdmin {
        require(storeownerToId[_newStoreowner] == 0, "This admin is already registered!");

        storeownerToId[_newStoreowner] = getNewStoreownerId();
        storeowners.push(_newStoreowner);
    }

    /** @dev removes storeowners
      * @param _currStoreowner storeowner's address
      */
    function removeStoreowner(address _currStoreowner) public onlyAdmin {

        delete storeowners[storeownerToId[_currStoreowner].sub(1)];
        delete storeownerToId[_currStoreowner];
    }


    /* storeowners functionalities */

    /** @dev creates new storefronts
      * @param _storeName new storefront name
      */
    function createStorefront(bytes32 _storeName) public onlyStoreowner {

        Storefront newStorefront = new Storefront(_storeName, msg.sender);

        storeAddressToId[address(newStorefront)] = getNewStorefrontId();
        deployedStorefronts.push(address(newStorefront));

        storeAddressToStoreowner[address(newStorefront)] = msg.sender;
        storeownerToStorefronts[msg.sender].push(address(newStorefront));

        emit storefrontCreated(newStorefront);
    }

    /** @dev removs storefronts
      * @param _storeAddress storefront contract address
      */
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
