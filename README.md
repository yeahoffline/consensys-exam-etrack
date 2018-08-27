# README
Etrack is a energy tracking prototype for power plants. Energy data is written into virtual power meters. Next versions will include oracles to write data.

Created for: "ConsenSys Academy’s 2018 Developer Program Final Project"


## Get started
Project requires local running ganache-cli:
```sh
$ ganache-cli
```
Project requires to install [own3d ETHPM package](https://www.ethpm.com/registry/packages/54) ([Github](https://github.com/yeahoffline/ethpm-own3d)) via
```sh
$ cd consensys-exam-etrack
$ npm install
$ truffle install
```

## Run tests
Test cover every function like: initial setup of powerplants, writing to meters and returning the correct data.
```sh
$ cd consensys-exam-etrack
$ truffle test
```

## Start local dev server
```sh
$ cd consensys-exam-etrack
$ truffle compile
$ truffle migrate
$ npm run dev
```

Import your ganache-cli seed into metmask to start transacting
