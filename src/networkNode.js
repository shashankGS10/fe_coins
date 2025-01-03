const express = require("express");
const bodyParser = require('body-parser');
const Blockchain = require('./Blockchain');
const { v4: uuidv4 } = require('uuid')
const nodeAddress = uuidv4().split('-').join('');
const fecoin = new Blockchain();
const port = process.argv[2]; // we are point to scripts.start[2] --> where we have defined PORT in package.json
const axios = require('axios');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/blockchain', function (req, res) {
    res.send(fecoin);
});

app.get('/mine', function (req, res) {
    const lastBlock = fecoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: fecoin.pendingTransactions,
        index: lastBlock['hash'] + 1
    }

    const nonce = fecoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockhash = fecoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    fecoin.createNewTransaction(10, '-Reward-💰-', nodeAddress) // 10 coin, Reward for mining FOR THE CURRENT NODE --> 

    const newBlock = fecoin.createNewBlock(nonce, previousBlockHash, blockhash);
    res.json({
        note: "New block mined Successfully [🤑]",
        block: newBlock
    })
});

app.post('/transaction', function (req, res) {
    const fecoinIndex = fecoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
    res.json({ note: `Transaction will be added in block: ${fecoinIndex} [👻]` })
});

app.post('/register-and-broadcast-node', async function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;

    if (!newNodeUrl) {
        return res.status(400).json({ note: 'Invalid newNodeUrl provided.' });
    }

    if (fecoin.networkNodes.indexOf(newNodeUrl) === -1) {
        fecoin.networkNodes.push(newNodeUrl); // Prevent duplicate nodes
    }

    const regNodesPromises = [];
    fecoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            url: `${networkNodeUrl}/register-node`,
            method: 'POST',
            data: { newNodeUrl: newNodeUrl },
        };
        regNodesPromises.push(axios(requestOptions)); // Push axios promises
    });

    Promise.all(regNodesPromises).then(data => {
        const bulkRegisterOptions = {
            url: `${newNodeUrl}/register-nodes-bulk`,
            method: 'POST',
            data: {
                allNetworkNodes: [...fecoin.networkNodes, fecoin.currentNodeUrl],
            },
        };

        return await axios(bulkRegisterOptions);
    }).then(data => {
        res.json({ note: 'New node registered with network successfully 🙆‍♂️' });
    })

});



app.post('/register-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (fecoin.networkNodes.indexOf(newNodeUrl) === -1 && newNodeUrl !== fecoin.currentNodeUrl) { // ++updated++ validation added
        fecoin.networkNodes.push(newNodeUrl);
    }
    res.json({ note: 'New node registered successfully.' });
});

app.post('/register-node-bulk', function (req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(newNodeUrl => {
        if (fecoin.networkNodes.indexOf(newNodeUrl) === -1 && newNodeUrl !== fecoin.currentNodeUrl) {
            fecoin.networkNodes.push(newNodeUrl)
        }
    });
    res.json({ note: 'Bulk registration successfully.' });
})

app.listen(port, () => {
    console.log(`Listing to Port ${port}...`)
})