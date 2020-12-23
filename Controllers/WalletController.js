const Web3 = require("web3");
const fs = require("fs");
const Tx = require('ethereumjs-tx').Transaction;

const INFURA_ID = process.env.INFURA_ID;
const web3 = new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${INFURA_ID}`));
//let web3 = require("../Utils/web3RopstenProvider");
//const web3 = new Web3.providers.websocket.WebsocketProvider("ws://localhost:8546", websocket_timeout=60);

let contractAddress = process.env.ROPSTEN_SERVICE_ADDRESS;
let contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "decreaseGHTAmount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "pauser",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_ght",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "DecreaseGHTAmount",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "depositGHT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "DepositGHT",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Paused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousPauser",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newPauser",
				"type": "address"
			}
		],
		"name": "PauserTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newPauser",
				"type": "address"
			}
		],
		"name": "setNewPauser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "flag",
				"type": "bool"
			}
		],
		"name": "setWhiteListAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "flag",
				"type": "bool"
			}
		],
		"name": "SetWhiteListAddress",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Unpaused",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "withdrawGHT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "WithdrawGHT",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "getGHTAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "getWhiteListAddress",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isPauser",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pauser",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
let contract = new web3.eth.Contract(contractABI, contractAddress)
let owner = process.env.PUBLICKEY;
let key = process.env.PRIVATEKEY;
let privateKey = new Buffer.from(key, 'hex')

console.log(privateKey);

module.exports = {
    create: (req, res) => {

        let id = req.params.userId;

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
        let result = {publicKey, privateKey};
        res.json(result);
    },

    set: async (req, res) => {
        let userAddress = req.params.userAddress;
        let flag = req.params.flag;
        let data = contract.methods.setWhiteListAddress(userAddress, flag).encodeABI();


        console.log(userAddress, flag);

        let nonce = await web3.eth.getTransactionCount(owner);

        let accountNonce = web3.utils.toHex(nonce);
        console.log(nonce);

        let gasPrice = web3.utils.toHex(web3.utils.toWei('0.000000003244581983', 'ether'));
        //console.log(accountNonce);
        let rawTx = {
            nonce: accountNonce,
            gasPrice: gasPrice,//'0x4999999999',
            gasLimit: '0x050455',
            to: contractAddress,
            value: '0x00',
            data: data,
            chainId: '0x03'
          }

        let tx = new Tx(rawTx,{'chain':'ropsten'});
        tx.sign(privateKey);
        
        let serializedTx = tx.serialize();

        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
.on('receipt', function(receipt) {
    console.log(receipt);
    res.json(receipt);
});
    }
}