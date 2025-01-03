const express = require("express");
const bodyParser = require('body-parser');
const Blockchain = require('./src/Blockchain');
const {v4 : uuidv4} = require('uuid')
const nodeAddress = uuidv4().split('-').join('');
const fecoin = new Blockchain();
const port = process.argv[2]; // we are point to scripts.start[2] --> where we have defined PORT in package.json

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.get('/blockchain', function(req,res){
    res.send(fecoin);
});

app.get('/mine', function(req,res){
    const lastBlock = fecoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData ={
        transactions:fecoin.pendingTransactions,
        index: lastBlock['hash']+1
    }
    
    const nonce = fecoin.proofOfWork(previousBlockHash,currentBlockData); //for this we need to do proofOfWork
    const blockhash = fecoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    fecoin.createNewTransaction(10,'-Reward-💰-',nodeAddress) // 10 coin, Reward for mining FOR THE CURRENT NODE --> 

    const newBlock = fecoin.createNewBlock(nonce, previousBlockHash,blockhash);
    res.json({
        note:"New block mined Successfully [🤑]",
        block: newBlock
    })
});

app.post('/transaction', function(req,res){
    const fecoinIndex = fecoin.createNewTransaction(req.body.amount,req.body.sender, req.body.recipient)
     res.json({note: `Transaction will be added in block: ${fecoinIndex} [👻]`})
});

app.listen(port,()=>{
    console.log(`Listing to Port ${port}...`)
})