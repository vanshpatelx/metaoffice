import { Request, Response, RequestHandler } from 'express';

const getAllElements: RequestHandler = async (req: Request, res: Response): Promise<any> => {};
const deleteElement: RequestHandler = async (req: Request, res: Response): Promise<any> => {};
const addElement: RequestHandler = async (req: Request, res: Response): Promise<any> => {};
const getSpecificSpace: RequestHandler = async (req: Request, res: Response): Promise<any> => {};

export { getAllElements, addElement, deleteElement, getSpecificSpace };
