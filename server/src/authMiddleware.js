const jwt = require('jsonwebtoken');

const authMiddleware = (req) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new Error('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>"

    try {
        // Verifica o token usando a chave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; // Retorna os dados decodificados
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
};

module.exports = authMiddleware;
