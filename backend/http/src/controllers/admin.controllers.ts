import { Request, Response, RequestHandler } from 'express';

const addElement: RequestHandler = async (req: Request, res: Response): Promise<any> => {};
const updateElement: RequestHandler = async (req: Request, res: Response): Promise<any> => {};
const addAvatar: RequestHandler = async (req: Request, res: Response): Promise<any> => {};
const addMap: RequestHandler = async (req: Request, res: Response): Promise<any> => {};

export { addAvatar, addElement, updateElement, addMap };
