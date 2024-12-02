import { Router } from 'express';
import { getAllElements, deleteElement, addElement, getSpecificSpace } from '../controllers/arena.controllers';

const router = Router();

router.get('/space', getSpecificSpace);
router.post('/element', addElement);
router.delete('/element', deleteElement);
router.get('/elements', getAllElements);

export default router;