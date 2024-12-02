import { Router } from 'express';
import {getAllSpace, deleteSpace, createSpace} from '../controllers/space.controllers';
const router = Router();

router.post('/space', createSpace);
router.delete('/space', deleteSpace);
router.get('/spaces', getAllSpace);

export default router;