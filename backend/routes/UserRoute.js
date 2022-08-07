import express from 'express';
import {
    getUsers,
    getUserById,
    postUser,
    updateUser,
    deleteUser
} from '../controller/UserController.js';
import { verifyUser, verifyAdminOnly } from '../middleware/authUser.js';

const router = express.Router();

router.route('/')
.get(verifyUser, verifyAdminOnly, getUsers)
.post(postUser);

router.route('/:id')
.get(verifyUser, verifyAdminOnly, getUserById)
.put(verifyUser, verifyAdminOnly, updateUser)
.delete(verifyUser, verifyAdminOnly, deleteUser);

export default router;