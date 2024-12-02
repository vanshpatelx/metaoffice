import { Request, Response, RequestHandler } from 'express';

const signup: RequestHandler = async (req: Request, res: Response): Promise<any> => {};
const signin: RequestHandler = async (req: Request, res: Response): Promise<any> => {};

export { signin, signup };
