import { Router } from 'express';
import { register } from '../controller/userController';

const router = Router();

// Endpoint untuk registrasi pengguna
router.post('/register', register);

export default router;
