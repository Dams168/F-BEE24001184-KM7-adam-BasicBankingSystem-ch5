const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSON = require('./docs/swagger.json');


const app = express();
const PORT = 3000;

const userRoutes = require('./routes/userRoutes');
const bankAccountRoutes = require('./routes/bankAccountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');


app.use(express.json());
app.use('/api/v1', userRoutes);
app.use('/api/v1', bankAccountRoutes);
app.use('/api/v1', transactionRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSON));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

