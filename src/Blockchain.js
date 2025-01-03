const sha256 = require('sha256');
const currentNodeUrl = process.argv[3]; //for creating network - with different port urls

function Blockchain(){
    // This is my basic block-chain
    this.chain=[];
    this.pendingTransactions =[];
    this.networkNodes = [] ;
    this.createNewBlock(100,'0','0'); // we need to change this static to dynamioc ** - eq 1
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
    // Default value set to nonce = 100, previousBlockHash = '0', hash='0' ** - eq 2
    const newBlock ={
        index: this.chain.length+1,
        timestamp: Date.now(),
        transactions:this.pendingTransactions,
        nonce: nonce,
        hash:hash,
        previousBlockHash:previousBlockHash,
    } //created block info

    this.pendingTransactions=[]; //pending transactions are those which arn't mined yet, to mine hit GET: /mine
    this.currentNodeUrl=currentNodeUrl;
    this.chain.push(newBlock);
     return newBlock;
}

Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    if (amount <= 0) {
        throw new Error('Transaction amount must be greater than zero.');
    }
    if (!sender || !recipient) {
        throw new Error('Transaction must include a sender and a recipient.');
    }

    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient
    };
    this.pendingTransactions.push(newTransaction);
    return this.getLastBlock()["index"] + 1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
     const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
     const hash =sha256(dataAsString);
     return hash;
}

Blockchain.prototype.proofOfWork= function(previousBlockHash,currentBlockData){
    
// => repeatedly hash block until it finds correct hash => '00000IANSDFUI08N9N09ASND
// => uses currnet block data for the hash, but also the previousBlockHash
// => continuously changes nonce value until it finds the correct hash
// => returns to us the nonce value that creates the correct hash
    let nonce =0;
    let hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);
    while(hash.substring(0,4) !== '0000'){
        nonce++;
        hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);
        // console.log(hash) //check all the hash numbers which doesn't start with '00' --> nonce is the number of iterations took reach there
    }
    return nonce;
}

module.exports = Blockchain;

