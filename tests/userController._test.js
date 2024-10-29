const request = require('supertest');
const app = require('../src/app');

describe('testing For User controller', () => {
    describe('GET /api/v1/users', () => {
        test("should get all user - 200", () => {
            return request(app).get('/api/v1/users')
                .then((res) => {
                    expect(res.statusCode).toBe(200)
                    expect(res.body).toHaveProperty('message')
                    expect(res.body).toHaveProperty('data')
                    expect(res.body.status).toBe(true)
                    expect(res.body.message).toEqual('Berhasil Menampilkan Data User')
                    // done()
                })
        })

        // test("should get all user - 404", () => {
        //     return request(app).get('/api/v1/users')
        //         .then((res) => {
        //             expect(res.statusCode).toBe(404)
        //             expect(res.body).toHaveProperty('message')
        //             expect(res.body.message).toEqual('User not found')
        //         })
        // })

    });

    describe('GET /api/v1/users/:userId', () => {
        test("should get user by id", async () => {
            const response = await request(app).get('/api/v1/users/1');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('data');
            expect(response.body.status).toBe(true);
            expect(response.body.message).toEqual('Berhasil Menampilkan Data User');
        });
    });

    describe('POST /api/v1/users', () => {
        test("should create new user", async () => {
            const createUser = await request(app).post('/api/v1/users').send({
                email: 'test@mail.com',
                name: 'test',
                password: 'test',
                identity_type: 'KTP',
                identity_number: '8945645231',
                address: 'test'
            });

            expect(createUser.statusCode).toBe(201);
            expect(createUser.body).toHaveProperty('message');
            expect(createUser.body).toHaveProperty('user');
            expect(createUser.body.status).toBe(true);
            expect(createUser.body.message).toEqual('User created successfully');
            expect(createUser.body.user).toHaveProperty('id');
            expect(createUser.body.user).toHaveProperty('profile');
        });
    });

})