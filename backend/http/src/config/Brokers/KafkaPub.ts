import { config } from '../config';
import { Kafka, Producer } from 'kafkajs';
import { hostname } from 'os';

class KafkaSingleton {
    private static producer: Producer;
    private static connected: boolean = false;

    private static async init(): Promise<void> {
        if (!KafkaSingleton.producer) {
            const kafka = new Kafka({
                clientId: `${hostname()}-http-instance`,
                brokers: [config.kafka.url1, config.kafka.url2],
            });

            KafkaSingleton.producer = kafka.producer();
        }
    }

    // Connect producer if not connected, retry logic if connection fails
    public static async connectProducer(): Promise<void> {
        if (!KafkaSingleton.connected) {
            try {
                await KafkaSingleton.init();  // Initialize Kafka and producer
                await KafkaSingleton.producer.connect();
                KafkaSingleton.connected = true;
                console.log('Kafka producer connected.');
            } catch (error) {
                console.error('Failed to connect Kafka producer:', error);
                // Retry after 5 seconds
                setTimeout(() => KafkaSingleton.connectProducer(), 5000);
            }
        }
    }

    private static async ensureConnected(): Promise<void> {
        if (!KafkaSingleton.connected) {
            await KafkaSingleton.connectProducer();
        }
    }

    private static async sendMessage(topic: string, message: string, partition: number): Promise<void> {
        try {
            await KafkaSingleton.ensureConnected();

            await KafkaSingleton.producer.send({
                topic,
                messages: [{ value: message, partition }],
            });

            console.log(`Message sent to ${topic}, partition ${partition}: ${message}`);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

    public static async addUser(userInfo: string): Promise<void> {
        await KafkaSingleton.sendMessage('user', userInfo, 1);
    }

    public static async updateUser(userInfo: string): Promise<void> {
        await KafkaSingleton.sendMessage('user', userInfo, 2);
    }

    public static async addSpace(spaceInfo: string): Promise<void> {
        await KafkaSingleton.sendMessage('space', spaceInfo, 1);
    }

    public static async deleteSpace(spaceInfo: string): Promise<void> {
        await KafkaSingleton.sendMessage('space', spaceInfo, 2);
    }

    public static async addElementAdmin(spaceInfo: string): Promise<void> {
        await KafkaSingleton.sendMessage('element', spaceInfo, 1);
    }
    public static async updateElementAdmin(spaceInfo: string): Promise<void> {
        await KafkaSingleton.sendMessage('element', spaceInfo, 2);
    }
    public static async addAvatar(spaceInfo: string): Promise<void> {
        await KafkaSingleton.sendMessage('element', spaceInfo, 3);
    }
    public static async addMap(spaceInfo: string): Promise<void> {
        await KafkaSingleton.sendMessage('element', spaceInfo, 4);
    }
}

export { KafkaSingleton };
