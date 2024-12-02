import { Request, Response, RequestHandler } from 'express';

const getAllSpace: RequestHandler = async (req: Request, res: Response): Promise<any> => {};
const deleteSpace: RequestHandler = async (req: Request, res: Response): Promise<any> => {};
const createSpace: RequestHandler = async (req: Request, res: Response): Promise<any> => {};

export { getAllSpace, deleteSpace, createSpace };
