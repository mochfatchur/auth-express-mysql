import express from 'express';
import {
    login,
    logout,
    getMe
} from '../controller/auth.js';

const router = express.Router();

router.get('/me', getMe);
router.post('/login', login);
router.delete('/logout', logout);

export default router;