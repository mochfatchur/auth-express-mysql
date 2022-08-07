import express from 'express';
import {
    getProducts,
    getProductById,
    postProduct,
    updateProduct,
    deleteProduct
} from '../controller/ProductController.js';
import { verifyUser, verifyAdminOnly } from '../middleware/authUser.js';

const router = express.Router();

router.route('/').get(verifyUser, getProducts).post(verifyUser, postProduct);
router.route('/:id').get(verifyUser, getProductById).put(verifyUser, updateProduct).delete(verifyUser, deleteProduct);

export default router;