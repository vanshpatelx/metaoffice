import {RabbitMQConsumer} from './config/Brokers/RabbitMQCons';
import { configDotenv } from 'dotenv';

configDotenv();
RabbitMQConsumer.connect();