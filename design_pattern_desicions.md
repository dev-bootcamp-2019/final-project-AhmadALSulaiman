# Access Restriction

All administrative functionalities in both contracts (adding admins, storeowners, 
storefronts, etc) are restricted to the appropriate addresses through modifiers.


# Emeregency Stop

In the `Storefront.sol` contract, the Storeowner is able to stop payable 
functions from receiving Ethers in case of emeregencies. See `stopContract()`


# Measures Taken to Avoid Common Attacks

**1.** Both contracts use `openzeppelin-solidity` library for math operations. 

**2.** Ether withdrawal is done through calling a withdrawal function that has 
only one task which is to transfer all Ethers in the contract's balance without having 
to change the state. This keeps the contract safe from re-entrancy attacks.
