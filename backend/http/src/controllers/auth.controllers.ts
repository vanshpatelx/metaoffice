import { Request, Response, RequestHandler } from 'express';
import { signInParams,  signUpParams } from '@repo/common';
import { errorHandler } from '../error/error';
import { redisClient } from '../config/cache/RedisClient';
import { generateUniqueId } from '../utils/ID';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { RabbitMQClient } from '../config/Brokers/RabbitMQPub';
import { queryManager } from '../config/DB/queryManager';
import { query } from '../config/DB/query';
// import { NUMBER } from '@repo/common/index';
// console.log(NUMBER);

const signUpScripts = `
    if redis.call("GET", KEYS[1]) then
        return "EXISTS"
    else
        redis.call("SET", KEYS[1], ARGV[1], "EX", ARGV[2])
        return "OK"
    end
`;


const signup: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try{
        const {username, password, type} = signUpParams.parse(req.body);

        // cache key
        const cacheKey = `user:${username}`;
        const value = JSON.stringify({ password, type });

        // Evaluate the Lua script in Redis to check user existence
        const result = await redisClient.eval(signUpScripts, 1, cacheKey, value, 3600000);

        if (result === 'EXISTS') {
            return errorHandler(res, 'User already exists.', 409);
        }

        const resultDB = await queryManager.fetchData(query.readQuery.readUser, [username]);
        if(resultDB != false){
            return errorHandler(res, 'User already exists', 409);
        }

        const newId = generateUniqueId();
        
        // send to broker
        RabbitMQClient.sendSignUpDataToQueue(JSON.stringify({id:BigInt(newId).toString(), username, password, type}));

        // Token
        const payload = {
            userId: BigInt(newId).toString(),
            username: username,
            type: type
        }
        const token = jwt.sign(payload, config.JWT_SECRET.secret as string, { expiresIn: '7d' });

        return res.status(201).json({ message: 'Signup successful' , token});
    }catch (error) {
        return errorHandler(res, error.message || 'SignUp Failed');
    }
    
};
const signin: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try{
        const {username, password} = signInParams.parse(req.body);
        
        // Cache key to retrieve user data
        const cacheKey = `user:${username}`;
        const cachedUser = await redisClient.get(cacheKey);

        if (cachedUser) {
            const user = JSON.parse(cachedUser);

            if (user.password === password) {
                const token = jwt.sign({ username, type: user.type }, config.JWT_SECRET.secret as string, { expiresIn: '7d' });
                return res.status(200).json({ message: 'SignIn successful', token });
            }
            return errorHandler(res, 'Invalid credentials', 401);
        }
        
        // check in DB
        const result = await queryManager.fetchData(query.readQuery.readUser, [username]);
        if(result === false){
            return errorHandler(res, 'SignIn Failed Invalid User', 401);
        }
        const user = result.rows[0];

        if(password != user.password){
            return errorHandler(res, 'Invalid credentials', 401);
        }

        // Generate token
        const payload = {
            userId: BigInt(user.id).toString(),
            username: user.username,
            type: user.type
        }
        const token = jwt.sign(payload, config.JWT_SECRET.secret as string, { expiresIn: '7d' });
        return res.status(201).json({ message: 'SignIn successful' , token});
    }catch(error){
        return errorHandler(res, error.message || 'SignIn Failed');
    }
};

export { signin, signup };
