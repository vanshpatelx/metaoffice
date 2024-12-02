import Redis from "ioredis";
import { config } from "../config";

class RedisClient{
    private static instance : Redis | null = null;

    private constructor(){}

    public static getInstance() : Redis{
        if(!RedisClient.instance){
            RedisClient.instance = new Redis({
                host: config.redis.host,
                port: config.redis.port,
                password: config.redis.password,
                db: config.redis.db,
            });
            RedisClient.instance.on('connect', () => {
                console.log(`Connected to Redis at ${config.redis.host}:${config.redis.port}`);
            });

            RedisClient.instance.on('error', () => {
                console.error('Redis error:',);
            });
        }
        return RedisClient.instance;
    }
}

const redisClient = RedisClient.getInstance();
export { redisClient };