const Blockchain = require('../src/Blockchain');

describe('Blockchain', () => {
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    test('should create a new block', () => {
        const newBlock = blockchain.createNewBlock(100, '0', '0');
        expect(newBlock).toHaveProperty('index', 1);
        expect(newBlock).toHaveProperty('nonce', 100);
        expect(newBlock).toHaveProperty('previousBlockHash', '0');
    });

    test('should create a new transaction', () => {
        const transactionIndex = blockchain.createNewTransaction(100, 'ALEX000012127676', 'TIMPJADUENPIW989');
        expect(transactionIndex).toBe(2);
        expect(blockchain.pendingTransactions).toHaveLength(1);
    });

    test('should hash a block correctly', () => {
        const previousBlockHash = 'OINAISDFN09N09ASDNF90N90ASNDF';
        const currentBlockData = [{
            amount: 10,
            sender: 'N90ANS90N90ANSDFNA',
            recipient: '90NA90SNDF90ANSDF09N'
        }];
        const nonce = 89405;
        const hash = blockchain.hashBlock(previousBlockHash, currentBlockData, nonce);
        expect(hash).toBeDefined(); // Check if hash is generated
    });

    test('should return the last block', () => {
        blockchain.createNewBlock(100, '0', '0');
        const lastBlock = blockchain.getLastBlock();
        expect(lastBlock).toHaveProperty('index', 1);
    });

    test('should perform proof of work', () => {
        blockchain.createNewBlock(100, '0', '0');
        const previousBlockHash = blockchain.getLastBlock().hash;
        const currentBlockData = blockchain.pendingTransactions;
        const nonce = blockchain.proofOfWork(previousBlockHash, currentBlockData);
        expect(nonce).toBeGreaterThanOrEqual(0); // Ensure nonce is a valid number
    });

    test('should handle invalid transaction input', () => {
        expect(() => {
            blockchain.createNewTransaction(-100, 'INVALID_SENDER', 'INVALID_RECIPIENT');
        }).toThrow(); // Expect an error to be thrown for invalid transaction
    });
}); 