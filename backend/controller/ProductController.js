import Product from '../models/productModel.js';
import {Op} from 'sequelize';

export const getProducts = async (req, res) => {
    try {
        let response;
        if (req.role === 'admin') {
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price']
            });
        } else {
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    userId: req.userId
                }
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

export const getProductById = async (req, res) => {
    try {
        let response;
        if (req.role === 'admin') {
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    uuid: req.params.id
                }
            });
        } else {
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    [Op.and] : [{uuid: req.params.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({msg: error.message});
    }
};

export const postProduct = async (req, res) => {
    const { name, price } = req.body;
    try {
        await Product.create({
            name: name,
            price: price,
            userId: req.userId
        });
        res.status(201).json({msg: 'Product created'});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

export const updateProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!product) return res.status(404).json({msg: 'Product tidak ditemukan'});
    const { name, price } = req.body;
    try {
        if (req.role === 'admin') {
            await Product.update({
                name: name,
                price: price
            }, {
                where: {
                    id: product.id
                }
            });
        } else {
            if (req.userId !== product.userId) return res.status(403).json({msg: 'akses terlarang'});
            await Product.update({
                name: name,
                price: price
            }, {
                where: {
                    [Op.and] : [{id: product.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: 'product updated'});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
};

export const deleteProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!product) return res.status(404).json({msg: 'Product tidak ditemukan'});
    try {
        if (req.role === 'admin') {
            await Product.destroy({
                where: {
                    id: product.id
                }
            });
        } else {
            if (req.userId !== product.userId) return res.status(403).json({msg: 'akses terlarang'});
            await Product.destroy({
                where: {
                    [Op.and] : [{id: product.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: 'product deleted'});        
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
};
