var Marketplace = artifacts.require('Marketplace.sol');
var Storefront = artifacts.require('Storefront.sol');


contract('Marketplace', (accounts) => {
    manager = accounts[0];
    
    it('should deploy the marketplace contract and assign correct manager', async() => {
        var instance = await Marketplace.deployed();
        var registeredManager = await instance.manager();

        assert.equal(registeredManager, manager, "Manager has an unexpected value!");
    });

    it('should add admins', async() => {
        var instance = await Marketplace.deployed();
        await instance.addAdmin(accounts[2], {from: manager});

        var newAdminId = await instance.adminToId(accounts[2]);

        assert.equal(newAdminId, 1, "newAdminId has an unexpected value!");
    });

    it('should enable admins to add storeowners', async() => {
        var instance = await Marketplace.deployed();
        await instance.addStoreowner(accounts[3], {from: accounts[2]});
        
        var newStoreownerId = await instance.storeownerToId(accounts[3]);

        assert.equal(newStoreownerId, 1, "newStoreownerId has an unexpected value!");
    });

    it('should enable storeowners to create storefronts', async() => {
        var instance = await Marketplace.deployed();

        var storeName = web3.utils.utf8ToHex('Saadah Store');
        var createdStorefront = await instance.createStorefront(storeName, {from: accounts[3]});

        var registeredOwner = await instance.storeAddressToStoreowner(createdStorefront.logs[0].args[0]);

        assert.equal(registeredOwner, accounts[3], "registeredOwner has an unexpected value!");
    });

    it('should enable storeowners to add products', async() => {
        var instance = await Marketplace.deployed();
        
        var deployedStorefrontAddress = await instance.deployedStorefronts(0);
        var storefrontInstance = await Storefront.at(deployedStorefrontAddress);

        var product = [web3.utils.utf8ToHex('Salsah'), 1000000000, 50];
        var anotherProduct = [web3.utils.utf8ToHex('Tunah'), 25000000000, 40];

        await storefrontInstance.addProduct(product[0], product[1], product[2], {from: accounts[3]});
        await storefrontInstance.addProduct(anotherProduct[0], anotherProduct[1], anotherProduct[2], {from: accounts[3]});

        var registeredProduct = await storefrontInstance.idToProduct(1);

        assert.equal(web3.utils.hexToUtf8(registeredProduct.name), 'Salsah', "registeredProduct has an unexpected name!");
    });

    it('should enable shoppers to buy products', async() => {
        var instance = await Marketplace.deployed();

        var deployedStorefrontAddress = await instance.deployedStorefronts(0);
        var storefrontInstance = await Storefront.at(deployedStorefrontAddress);

        await storefrontInstance.buyProduct(1, 3, {from: accounts[4], value: 1000000000 * 3});

        var soldProduct = await storefrontInstance.idToProduct(1);

        assert.equal(soldProduct.quantity, 47, "soldProduct has an unexpected quantity!");
    });

    it('should enable storeowners to remove products', async() => {
        var instance = await Marketplace.deployed();

        var deployedStorefrontAddress = await instance.deployedStorefronts(0);
        var storefrontInstance = await Storefront.at(deployedStorefrontAddress);

        /* remove product */
        await storefrontInstance.removeProduct(1, {from: accounts[3]});

        /* product slot after removing it */
        productSlot = await storefrontInstance.idToProduct(1);

        assert.equal(productSlot.name, 0, "productSlot has an unexpected value! (AFTER REMOVING THE PRODUCT)");
    });

    it('should enable storeowners to kill storefronts contracts', async() => {
        var instance = await Marketplace.deployed();

        var deployedStorefrontAddress = await instance.deployedStorefronts(0);
        var deployedStorefrontId = await instance.storeAddressToId(deployedStorefrontAddress);

        await instance.removeStorefront(deployedStorefrontAddress, {from: accounts[3]});

        var removedStorefrontId = await instance.storeAddressToId(deployedStorefrontAddress);

        assert.equal(deployedStorefrontId, 1, "deployedStorefrontId has an unexpected value!");
        assert.equal(removedStorefrontId, 0, "removedStorefrontId has an unexpected value!");
    });
});
