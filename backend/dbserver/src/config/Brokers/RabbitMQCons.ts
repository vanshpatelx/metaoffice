import amqp from 'amqplib';
import { config } from '../config';
import { queryManager } from "../DB/queryManager";

class RabbitMQConsumer {
    private static connection: amqp.Connection | null = null;
    private static channel: amqp.Channel | null = null;
    private static connected: boolean = false;

    private constructor() { }

    public static async connect(): Promise<void> {
        if (!RabbitMQConsumer.connected) {
            try {
                const connection = await RabbitMQConsumer.getConnection();
                RabbitMQConsumer.channel = await connection.createChannel();
                
                await RabbitMQConsumer.channel.assertQueue(config.rabbitmq.signupQueue, { durable: true });
                await RabbitMQConsumer.channel.assertQueue(config.rabbitmq.signinQueue, { durable: true });
                console.log('RabbitMQ consumer connected.');
                
                RabbitMQConsumer.startConsuming();
                RabbitMQConsumer.connected = true;
            } catch (error) {
                console.error('Failed to connect RabbitMQ consumer:', error);
                setTimeout(() => RabbitMQConsumer.connect(), 5000); // retry connection
            }
        }
    }

    private static async getConnection(): Promise<amqp.Connection> {
        if (!RabbitMQConsumer.connection) {
            try {
                RabbitMQConsumer.connection = await amqp.connect(config.rabbitmq.url);
                console.log('RabbitMQ consumer connected.');
            } catch (err) {
                console.error('Failed to connect to RabbitMQ:', err);
                process.exit(1);
            }
        }
        return RabbitMQConsumer.connection;
    }

    private static async startConsuming(): Promise<void> {
        RabbitMQConsumer.channel?.consume(config.rabbitmq.signupQueue, async (msg) => {
            if (msg) {
                const messageContent = msg.content.toString();
                console.log(messageContent);
                await queryManager.userSignupMessage(messageContent);
                RabbitMQConsumer.channel?.ack(msg); // Ack
            }
        }, { noAck: false });
    }
}

export { RabbitMQConsumer };
