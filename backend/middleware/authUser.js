import Users from '../models/userModel.js';

export const verifyUser = async (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({msg: 'Mohon login terlebih dahulu ke akun Anda'});
    const user = await Users.findOne({
        where: {
            uuid : req.session.userId
        }
    });
    if (!user) return res.status(404).json({msg: 'user tidak ditemukan'});

    req.userId = user.id;
    req.role = user.role;
    next();
};

export const verifyAdminOnly = async (req, res, next) => {
    if (req.role !== 'admin') return res.status(403).json({msg: 'akses terlarang'});
    next();
};