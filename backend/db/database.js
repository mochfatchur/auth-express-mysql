import { Sequelize } from "sequelize";

const db = new Sequelize('auth_db', 'root', '', {
    dialect: 'mysql',
    host: 'localhost'
});

export default db;