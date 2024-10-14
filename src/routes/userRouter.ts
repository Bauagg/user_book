import { Router } from 'express';
import { login, profileUser, register } from '../controller/userController';
import authMiddleware from "../midleware/authorization"

const router = Router();

// Endpoint untuk registrasi pengguna
router.post('/register', register);
router.post('/login', login)
router.get('/profile', authMiddleware, profileUser)

export default router;
