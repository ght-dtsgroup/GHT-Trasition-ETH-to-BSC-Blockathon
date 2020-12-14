#!/usr/bin/env node

const Web3 = require("web3");
const fs = require("fs");

const INFURA_ID = process.env.INFURA_ID;
const web3 = new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${INFURA_ID}`));
//const solc = require('solc');

function createAccount(id) {
    const rand = web3.utils.randomHex(7);

    const privateKey = web3.utils.sha3(id + rand);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const publicKey = account.address;

    console.log("publicKey", publicKey);
    console.log("privateKey", privateKey);

    let path = "privatekey_"  + publicKey + ".txt";
     fs.writeFileSync(path, publicKey + "\n" + privateKey, function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

createAccount("@123456");

