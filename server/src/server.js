const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const connectDB = require('../config/db');
const schema = require('./schema');
require('dotenv').config();

// Importa o GraphQL Playground corretamente
const graphqlPlayground = require('graphql-playground-middleware-express').default;

const app = express();

// Conexão com o banco de dados
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Configura o endpoint do GraphQL
app.use(
    '/graphql',
    graphqlHTTP((req) => {
        // Obtém o token JWT fixo do .env se não houver header na requisição
        const defaultToken = process.env.TEST_JWT_TOKEN;
        const authHeader = req.headers.authorization || `Bearer ${defaultToken}`;

        return {
            schema: schema,
            graphiql: false,
            context: {
                req: { headers: { authorization: authHeader } } // Força o token no contexto
            }
        };
    })
);

// Adiciona o Playground na rota '/playground'
app.get('/playground', graphqlPlayground({ endpoint: '/graphql' }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL Playground available at http://localhost:${PORT}/playground`);
});
