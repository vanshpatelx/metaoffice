import amqp from 'amqplib';
import { config } from '../config';

class RabbitMQClient {
    private static connection: amqp.Connection | null = null;
    private static channel: amqp.Channel | null = null;

    private constructor() { }

    public static async getConnection(): Promise<amqp.Connection> {
        if (!RabbitMQClient.connection) {
            try {
                RabbitMQClient.connection = await amqp.connect(config.rabbitmq.url);
                console.log('RabbitMQ producer connected.');
            } catch (err) {
                console.error('Failed to connect to RabbitMQ:', err);
                process.exit(1);
            }
        }
        return RabbitMQClient.connection;
    }

    public static async getChannel(): Promise<amqp.Channel> {
        if (!RabbitMQClient.channel) {
            try {
                const connection = await RabbitMQClient.getConnection();
                RabbitMQClient.channel = await connection.createChannel();
                
                await RabbitMQClient.channel.assertQueue(config.rabbitmq.signupQueue, { durable: true });
                await RabbitMQClient.channel.assertQueue(config.rabbitmq.addElementQueue, { durable: true });

                console.log(`RabbitMQ channel created`);
            } catch (err) {
                console.error('Failed to create RabbitMQ channel:', err);
                process.exit(1);
            }
        }
        return RabbitMQClient.channel;
    }

    public static async sendSignUpDataToQueue(message: any): Promise<void> {
        try {
            const channel = await RabbitMQClient.getChannel();
            channel.sendToQueue(config.rabbitmq.signupQueue, Buffer.from(message), { persistent: true });
            console.log('User signup data sent to queue:', message);
        } catch (err) {
            console.error('Failed to send signup message to RabbitMQ:', err);
        }
    } 
    public static async addElement(message: string): Promise<void> {
        try {
            const channel = await RabbitMQClient.getChannel();
            channel.sendToQueue(config.rabbitmq.addElementQueue, Buffer.from(message), { persistent: true });
            console.log('Element add sent to queue:', message);
        } catch (err) {
            console.error('Failed to send Element add message to RabbitMQ:', err);
        }
    }
    public static async updateElement(message: string): Promise<void> {
        try {
            const channel = await RabbitMQClient.getChannel();
            channel.sendToQueue(config.rabbitmq.updateElementQueue, Buffer.from(message), { persistent: true });
            console.log('Element update sent to queue:', message);
        } catch (err) {
            console.error('Failed to send Element update message to RabbitMQ:', err);
        }
    }
    public static async addAvatar(message: string): Promise<void> {
        try {
            const channel = await RabbitMQClient.getChannel();
            channel.sendToQueue(config.rabbitmq.addAvatarQueue, Buffer.from(message), { persistent: true });
            console.log('Avatar add sent to queue:', message);
        } catch (err) {
            console.error('Failed to send Avatar add message to RabbitMQ:', err);
        }
    }
    public static async addMap(message: string): Promise<void> {
        try {
            const channel = await RabbitMQClient.getChannel();
            channel.sendToQueue(config.rabbitmq.addMapQueue, Buffer.from(message), { persistent: true });
            console.log('Map add sent to queue:', message);
        } catch (err) {
            console.error('Failed to send Map add message to RabbitMQ:', err);
        }
    }

}


export { RabbitMQClient};