import Users from '../models/userModel.js';
import argon2 from 'argon2';

export const getUsers = async (req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ['uuid', 'name', 'email', 'role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg:error.message});
    }
};

export const getUserById = async (req, res) => {
    try {
        const response = await Users.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.params.id,
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg:error.message});
    }
};

export const postUser = async (req, res) => {
    const { name, email, password, confirmPass, role } = req.body;
    if (confirmPass !== password) return res.status(400).json({msg: 'Password dan Confirm Password berbeda'});
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({msg: 'registrasi berhasil'});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
};

export const updateUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            uuid : req.params.id 
        }
    });
    console.log(user);
    if (!user) return res.status(404).json({msg: `user dengan uuid ${req.params.id} tidak ditemukan`});
    console.log(user.id);
    const { name, email, password, confirmPass, role } = req.body;
    let hashPassword;
     
    if (password === '' || password === null) {
        hashPassword = Users.password
    } else {
        hashPassword = await argon2.hash(password);
    }

    if (password !== confirmPass) return res.status(400).json({msg: 'Password dan Confirm Password tidak cocok'});
    try {
        await Users.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        },{
            where: {
                id : user.id
            }
        });
        res.status(200).json({msg: 'user updated'});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }

};

export const deleteUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });
    
    if (!user) return res.status(404).json({msg: `user dengan uuid ${req.params.id} tidak ditemukan`});
    try {
        await Users.destroy({
            where: {
                id : user.id
            }
        });
        res.status(200).json({msg: 'user deleted'});
    } catch (error) {
        res.status(400).json({msg : error.message});
    }
};
