const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            error: 'Token tidak ditemukan',
            status: 401,
            message: 'Unauthorized'
        });
    } else {
        jwt.verify(authorization, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    error: 'Token tidak valid',
                    status: 401,
                    message: 'Unauthorized'
                });
            } else {
                req.user = decoded;
                next();
            }
        })
    }
};