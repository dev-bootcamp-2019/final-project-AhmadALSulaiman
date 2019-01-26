var Marketplace = artifacts.require('Marketplace.sol');
var Storefront = artifacts.require('Storefront.sol');


contract('Marketplace', (accounts) => {
    manager = accounts[0];
    
    it('should deploy the marketplace contract and assign correct manager', async() => {
        /* grap an instance of the Marketplace contract */
        var instance = await Marketplace.deployed();
        
        /* get the contract's manager address */
        var registeredManager = await instance.manager();

        /* check if the contract's manager is same as the deployer */
        assert.equal(registeredManager, manager, "Manager has an unexpected value!");
    });

    it('should add admins', async() => {
        /* grap an instance of the Marketplace contract */
        var instance = await Marketplace.deployed();

        /* add new admin */
        await instance.addAdmin(accounts[2], {from: manager});

        /* get new admin's id */
        var newAdminId = await instance.adminToId(accounts[2]);

        /* check if new admin has the expected id number */
        assert.equal(newAdminId, 1, "newAdminId has an unexpected value!");
    });

    it('should enable admins to add storeowners', async() => {
        /* grap an instance of the Marketplace contract */
        var instance = await Marketplace.deployed();

        /* add new storeowner */
        await instance.addStoreowner(accounts[3], {from: accounts[2]});

        /* get new storeowner's id */
        var newStoreownerId = await instance.storeownerToId(accounts[3]);

        /* check if new storeowner has the expected id number */
        assert.equal(newStoreownerId, 1, "newStoreownerId has an unexpected value!");
    });

    it('should enable storeowners to create storefronts', async() => {
        /* grap an instance of the Marketplace contract */
        var instance = await Marketplace.deployed();

        /* convert the new storefront's name to hex */
        var storeName = web3.utils.utf8ToHex('Saadah Store'); // Sa'adah (Arabic) == Happiness
        
        /* create new storefront with the converted name */
        var createdStorefront = await instance.createStorefront(storeName, {from: accounts[3]});

        /* get new storefront owner's address */
        var registeredOwner = await instance.storeAddressToStoreowner(createdStorefront.logs[0].args[0]);

        /* check if new storefront has the expected owner */
        assert.equal(registeredOwner, accounts[3], "registeredOwner has an unexpected value!");
    });

    it('should enable storeowners to add products', async() => {
        /* grap an instance of the Marketplace contract */
        var instance = await Marketplace.deployed();

        /* grap the storefront address */
        var deployedStorefrontAddress = await instance.deployedStorefronts(0);
        
        /* create an instance of the storefront contract */
        var storefrontInstance = await Storefront.at(deployedStorefrontAddress);

        /* new products */
        var product = [web3.utils.utf8ToHex('Salsah'), 1000000000, 50];
        var anotherProduct = [web3.utils.utf8ToHex('Tunah'), 25000000000, 40];

        /* add products to storefront */
        await storefrontInstance.addProduct(product[0], product[1], product[2], {from: accounts[3]});
        await storefrontInstance.addProduct(anotherProduct[0], anotherProduct[1], anotherProduct[2], {from: accounts[3]});

        /* get the first product in store (Ids starts from 1) */
        var registeredProduct = await storefrontInstance.idToProduct(1);

        /* check if the product has the expected name */
        assert.equal(web3.utils.hexToUtf8(registeredProduct.name), 'Salsah', "registeredProduct has an unexpected name!");
    });

    it('should enable shoppers to buy products', async() => {
        /* grap an instance of the Marketplace contract */
        var instance = await Marketplace.deployed();

        /* grap the storefront address */
        var deployedStorefrontAddress = await instance.deployedStorefronts(0);

        /* create an instance of the storefront contract */
        var storefrontInstance = await Storefront.at(deployedStorefrontAddress);

        /* buy a product */
        await storefrontInstance.buyProduct(1, 3, {from: accounts[4], value: 1000000000 * 3});

        /* grap the sold product's details */
        var soldProduct = await storefrontInstance.idToProduct(1);

        /* check if the sold product details is updated */
        assert.equal(soldProduct.quantity, 47, "soldProduct has an unexpected quantity!");
    });

    it('should enable storeowners to remove products', async() => {
        /* grap an instance of the Marketplace contract */
        var instance = await Marketplace.deployed();

        /* grap the storefront address */
        var deployedStorefrontAddress = await instance.deployedStorefronts(0);

        /* create an instance of the storefront contract */
        var storefrontInstance = await Storefront.at(deployedStorefrontAddress);

        /* remove product */
        await storefrontInstance.removeProduct(1, {from: accounts[3]});

        /* product slot after removing it */
        productSlot = await storefrontInstance.idToProduct(1);

        /* check if removed product's slot is zero-ed */
        assert.equal(productSlot.name, 0, "productSlot has an unexpected value! (AFTER REMOVING THE PRODUCT)");
    });

    it('should enable storeowners to kill storefronts contracts', async() => {
        /* grap an instance of the Marketplace contract */
        var instance = await Marketplace.deployed();

        /* grap the storefront address */
        var deployedStorefrontAddress = await instance.deployedStorefronts(0);

        /* get deployed storefront's id  */
        var deployedStorefrontId = await instance.storeAddressToId(deployedStorefrontAddress);

        /* remove storefront (selfdestruct()) */
        await instance.removeStorefront(deployedStorefrontAddress, {from: accounts[3]});

        /* get removed storefront's id  */
        var removedStorefrontId = await instance.storeAddressToId(deployedStorefrontAddress);

        /* check if the deletion of the storefront contract has the expected effect */
        assert.equal(deployedStorefrontId, 1, "deployedStorefrontId has an unexpected value!");
        assert.equal(removedStorefrontId, 0, "removedStorefrontId has an unexpected value!");
    });
});
