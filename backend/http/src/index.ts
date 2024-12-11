import express, { Request, Response, Express } from 'express';
import adminRoutes from './routes/admin.routes';
import arenaRoutes from './routes/arena.routes';
import authRoutes from './routes/auth.routes';
import spaceRoutes from './routes/space.routes';
import { redisClient } from './config/cache/RedisClient';
import { RabbitMQClient } from './config/Brokers/RabbitMQPub';
import { configDotenv } from 'dotenv';

const app: Express = express();
const PORT = process.env.PORT || 3003;

// Middleware for parsing requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
configDotenv();

// Route Handlers
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/arena', arenaRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/space', spaceRoutes);

// Health Check Endpoint
app.get('/check', (req: Request, res: Response) => {
    res.json('Server is running');
});

Promise.all([
    redisClient.ping(),
    // KafkaSingleton.connectProducer(),
    RabbitMQClient.getConnection()
])
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error initializing services:", err);
    });
