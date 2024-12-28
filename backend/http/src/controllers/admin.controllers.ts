import { Request, Response, RequestHandler } from 'express';
import { errorHandler } from '../error/error';
import { addElementParams, updateElementParams, addMapParams, addAvatarParams } from '@repo/common';
import { generateUniqueId } from '../utils/ID';
import { uploadImage } from '../config/Cloud/Storage';
import { redisClient } from '../config/cache/RedisClient';
import { RabbitMQClient } from '../config/Brokers/RabbitMQPub';

const addElement: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, height, width, staticImg } = addElementParams.parse(req.body);
        
        // ID Generate
        const newId = generateUniqueId();
        
        // Image Link
        const imgUrl = uploadImage('A', 'B');
        const dimensions = `${width}X${height}`;
        
        // Caching
        const cacheKey = `Element:${newId}`;
        const value = JSON.stringify({
            name,
            imgUrl,
            dimensions,
            staticImg,
        });
        await redisClient.set(cacheKey, value, 'PX', 3600000);
        
        // Send Data to Pub-Sub for Save
        RabbitMQClient.addElement(JSON.stringify({id:BigInt(newId).toString(), name, imgUrl, dimensions, staticImg}));
        return res.status(200).json({ message: 'Element added successfully', data: value, newId });
    } catch (error) {
        return errorHandler(res, error.message || 'Not added element');
    }
};
const updateElement: RequestHandler = async (req: Request, res: Response): Promise<any> => { 
    try {
        const { name, height, width, staticImg, Id } = updateElementParams.parse(req.body);

        let newElement;
        const dimensions = `${width}X${height}`;
        const imgUrl = uploadImage('A', 'B');

        // check in cache
        const cacheKey = `Element:${Id}`;
        const cachedElement = await redisClient.get(cacheKey);

        if (!cachedElement) {
            // check in DB
            // if not then return this ID dont exists
        }

        newElement = {
            name,
            imgUrl,
            dimensions,
            staticImg
        }
        
        const value = JSON.stringify(newElement);
        await redisClient.set(cacheKey, value, 'PX', 3600000);
        
        
        // Send Data to Pub-Sub for Save
        RabbitMQClient.updateElement(JSON.stringify({id:BigInt(Id).toString(), name, imgUrl, dimensions, staticImg}));
        return res.status(200).json({ message: 'Element updated successfully', data: newElement });

    } catch (error) {
        return errorHandler(res, error.message || 'Not updated element');
    }
};
const addAvatar: RequestHandler = async (req: Request, res: Response): Promise<any> => { 
    try {
        const { name } = addAvatarParams.parse(req.body);
        
        // ID Generate
        const newId = generateUniqueId();
        
        // Image Link
        const imgUrl = uploadImage('A', 'B');
        
        // Caching
        const cacheKey = `Avatar:${newId}`;
        const value = JSON.stringify({
            name,
            imgUrl,
        });
        await redisClient.set(cacheKey, value, 'PX', 3600000);
        
        // Send Data to Pub-Sub for Save
        RabbitMQClient.addAvatar(JSON.stringify({id:BigInt(newId).toString(), name, imgUrl}));
        return res.status(200).json({ message: 'Avatar added successfully', data: value, newId });
    } catch (error) {
        return errorHandler(res, error.message || 'Not added Avatar');
    }
};
const addMap: RequestHandler = async (req: Request, res: Response): Promise<any> => { 
    try {
        const { name, height, width, elements } = addMapParams.parse(req.body);
        
        const dimensions = `${width}X${height}`;
        

        // check all elements are avalible or not
        elements.map(async (element: bigint)  => {
            const cacheKey = `Element:${element}`;
            const cachedElement = await redisClient.get(cacheKey);
            if(!cacheKey){
                // check in DB
                // if not add in non avalible elements
            }
        });

        // remove non avalible elements from elements

        // ID Generate
        const newId = generateUniqueId();

        // Image Link
        const imgUrl = uploadImage('A', 'B');
        
        // Caching
        const cacheKey = `Map:${newId}`;
        const value = JSON.stringify({
            name,
            dimensions,
            elements
        });
        await redisClient.set(cacheKey, value, 'PX', 3600000);
        
        // Send Data to Pub-Sub for Save
        RabbitMQClient.addMap(JSON.stringify({id:BigInt(newId).toString(), name, dimensions, imgUrl, elements}));
        return res.status(200).json({ message: 'Map added successfully', data: value, newId });
    } catch (error) {
        return errorHandler(res, error.message || 'Not added Map');
    }
};

export { addAvatar, addElement, updateElement, addMap };
