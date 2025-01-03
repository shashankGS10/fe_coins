const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../src/Blockchain');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const nodeAddress = uuidv4().split('-').join('');
const fecoin = new Blockchain();

app.get('/blockchain', (req, res) => {
    res.send(fecoin);
});

app.get('/mine', (req, res) => {
    // ... existing mine logic ...
});

app.post('/transaction', (req, res) => {
    // ... existing transaction logic ...
});

describe('API Endpoints', () => {
    jest.setTimeout(10000);

    test('GET /blockchain should return the blockchain', async () => {
        const response = await request(app).get('/blockchain');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('chain');
    });

    test('POST /transaction should create a new transaction', async () => {
        const response = await request(app)
            .post('/transaction')
            .send({
                amount: 10,
                sender: 'ALEX000012127676',
                recipient: 'TIMPJADUENPIW989'
            });
        expect(response.status).toBe(200);
        expect(response.body.note).toMatch(/Transaction will be added in block:/);
    });

    test('POST /transaction should return an error for invalid transaction amount', async () => {
        const response = await request(app)
            .post('/transaction')
            .send({
                amount: -10,
                sender: 'ALEX000012127676',
                recipient: 'TIMPJADUENPIW989'
            });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Transaction amount must be greater than zero.');
    });

    test('POST /transaction should return an error for missing fields', async () => {
        const response = await request(app)
            .post('/transaction')
            .send({
                amount: 10,
                sender: '',
                recipient: 'TIMPJADUENPIW989'
            });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Transaction must include a sender and a recipient.');
    });

    // Additional tests can be added here for other endpoints
}); 