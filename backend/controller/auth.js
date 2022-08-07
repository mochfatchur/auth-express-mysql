import Users from '../models/userModel.js';
import argon2 from 'argon2';

export const login = async (req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!user) return res.status(404).json({msg: 'User not found'});

    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({msg: 'wrong password'});

    req.session.userId = user.uuid;
    const { uuid, name, email, role } = user;
    res.status(200).json({uuid, name, email, role});
};

export const getMe = async (req, res) => {
    // cek apakah terdapat session userId
    if (!req.session.userId) return res.status(401).json({msg: 'Mohon login terlebih dahulu ke akun Anda'});
    // cari user dengan uuid = session.userId di database
    const user = await Users.findOne({
        attributes: ['uuid', 'name', 'email', 'role'],
        where: {
            uuid: req.session.userId
        }
    });
    // cek apakah terdapat user tersebut
    if (!user) return res.status(404).json({msg: 'user tidak ditemukan'});
    // kembalikan data user
    res.status(200).json(user);
}

export const logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) return res.status(400).json({msg: 'Tidak dapat logout'});
        res.status(200).json({msg: 'Anda telah logout'});
    });

};