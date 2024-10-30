const request = require('supertest');
const app = require('../src/app');

describe('testing For Transaction controller', () => {
    describe('GET /api/v1/transactions', () => {
        test("should get all transactions - 200", () => {
            return request(app).get('/api/v1/transactions')
                .then((res) => {
                    expect(res.statusCode).toBe(200)
                    expect(res.body).toHaveProperty('message')
                    expect(res.body).toHaveProperty('data')
                    expect(res.body.status).toBe(true);
                    expect(res.body.message).toEqual('Berhasil menampilkan data transaksi')
                }
                )
        })
    });


    describe('POST /api/v1/transactions', () => {
        test("should create new transaction", async () => {
            const createTransaction = await request(app).post('/api/v1/transactions').send({
                source_account_id: 1,
                destination_account_id: 2,
                amount: 1000
            });

            expect(createTransaction.statusCode).toBe(201);
            expect(createTransaction.body).toHaveProperty('message');
            expect(createTransaction.body).toHaveProperty('data');
            expect(createTransaction.body.status).toBe(true);
            expect(createTransaction.body.message).toEqual('Transaksi berhasil');
        });

        test("should return 400 if source account not found", async () => {
            const createTransaction = await request(app).post('/api/v1/transactions').send({
                source_account_id: 100,
                destination_account_id: 2,
                amount: 1000
            });
            expect(createTransaction.statusCode).toBe(404);
            expect(createTransaction.body).toHaveProperty('message');
            expect(createTransaction.body.message).toEqual('Account not found');
        });

        test("should return 400 if destination account not found", async () => {
            const createTransaction = await request(app).post('/api/v1/transactions').send({
                source_account_id: 1,
                destination_account_id: 100,
                amount: 1000
            });
            expect(createTransaction.statusCode).toBe(404);
            expect(createTransaction.body).toHaveProperty('message');
            expect(createTransaction.body.message).toEqual('Account not found');
        });

        test("should return 400 if balance not enough", async () => {
            const createTransaction = await request(app).post('/api/v1/transactions').send({
                source_account_id: 1,
                destination_account_id: 2,
                amount: 100000000
            });
            expect(createTransaction.statusCode).toBe(400);
            expect(createTransaction.body).toHaveProperty('message');
            expect(createTransaction.body.message).toEqual('Balance not enough');
        });
    });

    describe('GET /api/v1/transactions/:transactionId', () => {
        test("should get transaction by id", async () => {
            const response = await request(app).get('/api/v1/transactions/1');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('data');
            expect(response.body.status).toBe(true);
            expect(response.body.message).toEqual('Berhasil menampilkan detail transaksi');
        });

        test("should return 404 if transaction not found", async () => {
            const response = await request(app).get('/api/v1/transactions/100');
            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toEqual('Transaction not found');
        });
    });

});