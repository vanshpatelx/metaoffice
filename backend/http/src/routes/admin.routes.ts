import { Router } from 'express';
import { addElement, updateElement, addAvatar, addMap } from '../controllers/admin.controllers';
const router = Router();

router.post('/element', addElement);
router.patch('/element', updateElement);
router.post('/avatar', addAvatar);
router.post('/map', addMap);

export default router;