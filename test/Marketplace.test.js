var Marketplace = artifacts.require('Marketplace.sol');


contract('Marketplace', (accounts) => {
    manager = accounts[0];
    
    it('should deploy contract and assign correct manager', async() => {
        var instance = await Marketplace.deployed();
        var registeredManager = await instance.manager();

        assert.equal(registeredManager, manager, "Manager has an unexpected value!");
    });

    it('should add admins', async() => {
        var instance = await Marketplace.deployed();
        await instance.addAdmin(accounts[2], {from: manager});

        var isAdmin = await instance.isAdmin(accounts[2]);

        assert.equal(isAdmin, true, "isAdmin has an unexpected value!");
    });

    it('should enable admins to add store owners', async() => {
        var instance = await Marketplace.deployed();

        await instance.addAdmin(accounts[2], {from: manager});
        var isAdmin = await instance.isAdmin(accounts[2]);
        assert.equal(isAdmin, true, "isAdmin has an unexpected value!");

        await instance.addStoreOwner(accounts[3], {from: accounts[2]});
        var isStoreOwner = await instance.isStoreOwner(accounts[3]);
        assert.equal(isStoreOwner, true, "isStoreOwner has an unexpected value!");
    });

    it('should enable store owners to create store fronts', async() => {
        var instance = await Marketplace.deployed();

        await instance.addAdmin(accounts[2], {from: manager});
        await instance.addStoreOwner(accounts[3], {from: accounts[2]});


        var storeName = web3.utils.utf8ToHex('Al-Saadah Store');

        await instance.createStoreFront(storeName, {from: accounts[3]});
        var registeredOwner = await instance.storeToOwner(storeName);

        assert.equal(registeredOwner, accounts[3], "registeredOwner has an unexpected value!");
    });

    it('should enable store owners to add products', async() => {
        var instance = await Marketplace.deployed();

        await instance.addAdmin(accounts[2], {from: manager});
        await instance.addStoreOwner(accounts[3], {from: accounts[2]});
        
        var storeName = web3.utils.utf8ToHex('Al-Saadah Store');
        await instance.createStoreFront(storeName, {from: accounts[3]});


        var product = [web3.utils.utf8ToHex('Salsah'), 1000000000, 50];
        var anotherProduct = [web3.utils.utf8ToHex('Tunah'), 25000000000, 40];

        await instance.addProduct(storeName, product[0], product[1], product[2], {from: accounts[3]});
        await instance.addProduct(storeName, anotherProduct[0], anotherProduct[1], anotherProduct[2], {from: accounts[3]});
        
        /* get added product */
        var registeredProduct = await instance.storeToProducts(storeName, 1);
        var anotherRegisteredProduct = await instance.storeToProducts(storeName, 2);


        assert.equal(web3.utils.hexToUtf8(registeredProduct.name), 'Salsah', "registeredProduct has an unexpected name!");
        assert.equal(web3.utils.hexToUtf8(anotherRegisteredProduct.name), 'Tunah', "anotherRegisteredProduct has an unexpected name!");
    });

    it('should enable shoppers to buy products', async() => {
        var instance = await Marketplace.deployed();

        await instance.addAdmin(accounts[2], {from: manager});
        await instance.addStoreOwner(accounts[3], {from: accounts[2]});
        
        var storeName = web3.utils.utf8ToHex('Al-Saadah Store');
        await instance.createStoreFront(storeName, {from: accounts[3]});

        var product = [web3.utils.utf8ToHex('Salsah'), 1000000000, 50];
        var anotherProduct = [web3.utils.utf8ToHex('Tunah'), 25000000000, 40];        
        await instance.addProduct(storeName, product[0], product[1], product[2], {from: accounts[3]});
        await instance.addProduct(storeName, anotherProduct[0], anotherProduct[1], anotherProduct[2], {from: accounts[3]});

        await instance.buyProduct(storeName, 1, {from: accounts[4], value: product[1]});
        await instance.buyProduct(storeName, 2, {from: accounts[4], value: anotherProduct[1]});

        var soldProduct = await instance.storeToProducts(storeName, 1);

        assert.equal(soldProduct.amount, product[2]-1, "soldProduct has an unexpected amount!");
    });

    it('should enable store owners to remove products', async() => {
        var instance = await Marketplace.deployed();

        await instance.addAdmin(accounts[2], {from: manager});
        await instance.addStoreOwner(accounts[3], {from: accounts[2]});
        
        var storeName = web3.utils.utf8ToHex('Al-Saadah Store');
        await instance.createStoreFront(storeName, {from: accounts[3]});

        var product = [web3.utils.utf8ToHex('Salsah'), 1000000000, 50];
        await instance.addProduct(storeName, product[0], product[1], product[2], {from: accounts[3]});
        
        /* product slot before removing it */
        var productSlot = await instance.storeToProducts(storeName, 1);

        /* remove product */
        await instance.removeProduct(storeName, 1, {from: accounts[3]});

        /* product slot after removing it */
        productSlot = await instance.storeToProducts(storeName, 1);

        assert.equal(productSlot.price, 0, "productSlot has an unexpected value! (AFTER REMOVING THE PRODUCT)");
    });

    it('should get store fronts name', async() => {
        var instance = await Marketplace.deployed();

        await instance.addAdmin(accounts[2], {from: manager});
        await instance.addStoreOwner(accounts[3], {from: accounts[2]});
        
        var firstStoreName = web3.utils.utf8ToHex('Al-Saadah Store');
        var secondStoreName = web3.utils.utf8ToHex('Al-Wanasah Store');
        await instance.createStoreFront(firstStoreName, {from: accounts[3]});
        await instance.createStoreFront(secondStoreName, {from: accounts[3]});

        var storeFronts = await instance.getStoreFronts();
        storeFronts.forEach((storeName) => {
            console.log(web3.utils.hexToUtf8(storeName));
        });
    });
});