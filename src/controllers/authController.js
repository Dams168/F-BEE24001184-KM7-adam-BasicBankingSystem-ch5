const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT);

class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            console.log(req.body);
            const uniqueEmail = await prisma.users.findUnique({
                where: {
                    email: email
                }
            });
            if (uniqueEmail) {
                res.status(400).json({
                    error: 'Email sudah terdaftar',
                    status: 400,
                    message: 'Bad Request'
                });
            } else {
                const hashedPassword = await bcrypt.hashSync(password, BCRYPT_SALT);
                let createUser = await prisma.users.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword
                    }
                })
                res.status(201).json({
                    error: null,
                    message: 'User berhasil dibuat',
                    status: 201,
                    data: createUser
                });
            }
        } catch (error) {
            console.error("Error during user registration:", error);
            res.status(500).json(error);
        }
    }
    static async login(req, res) {
        try {
            let { email, password } = req.body;
            let user = await prisma.users.findUnique({
                where: {
                    email: email
                }
            });
            if (!user) {
                res.status(404).json({
                    error: 'Email atau password salah',
                    status: 400,
                    message: 'Not Found'
                });
            } else {
                let isPassword = await bcrypt.compareSync(password, user.password);
                if (!isPassword) {
                    res.status(400).json({
                        error: 'Email atau password salah',
                        status: 400,
                        message: 'Bad Request'
                    });
                } else {
                    const accessToken = jwt.sign({
                        name: user.name,
                        id: user.id,
                    }, JWT_SECRET, {
                        expiresIn: '3h'
                    });

                    res.status(200).json({
                        error: null,
                        message: 'Login berhasil',
                        status: 200,
                        accessToken
                    });
                }
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = AuthController;