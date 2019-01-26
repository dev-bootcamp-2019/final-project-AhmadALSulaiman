# eth-bootcamp-final-project
ConsenSys Academy’s 2018-2019 Developer Program Final Project

# Darketplace

Darketplace is an Ethereum-based marketplace which has the letter D as the first character. 

*Note: the D stands for "Dude"*

## Installations

Start by cloning this repo with the following command.

```bash
git clone https://github.com/AhmadALSulaiman/eth-bootcamp-final-project.git && cd eth-bootcamp-final-project
```

Use the package manager [npm](https://www.npmjs.com/) to install required packages for running both the contracts and the interface


```bash
npm install && cd ui && npm install
```

## Deployment to Ganache
Using Truffle, migrate the contracts to ganache-cli with the following command (in the project's root dir)

```bash
truffle migrate --reset
```
Then, copy the Marketplace contract's address from the terminal and paste it inside of ```ui/src/marketplace.js```

## The Interface
From inside the ```ui``` directory, run the following command
```bash
npm start
```

You can now see the interface running on ```localhost:3000```
