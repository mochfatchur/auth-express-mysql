import { Sequelize } from 'sequelize';
import db from '../db/database.js';
import Users from './userModel.js'

const { DataTypes } = Sequelize;

const Product = db.define('products', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
}, {
    freezeTableName: true
});

Users.hasMany(Product);
Product.belongsTo(Users, {foreignKey: 'userId'});

export default Product;