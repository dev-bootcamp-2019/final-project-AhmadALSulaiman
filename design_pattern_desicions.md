# Access Restriction

All administrative functionalities in both contracts (adding admins, storeowners, 
storefronts, etc) are restricted to the appropriate addresses through modifiers.


# Emeregency Stop

In the `Storefront.sol` contract, the Storeowner is able to stop payable 
functions from receiving Ethers in case of emeregencies. See `stopContract()`
