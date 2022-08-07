import express from 'express';
import cors from 'cors';
import session from 'express-session';
import SequalizeStore from 'connect-session-sequelize';
import dotenv from 'dotenv';
import authRoute from './routes/authRoutes.js';
import userRoute from './routes/UserRoute.js';
import productRoute from './routes/ProductRoute.js';
import db from './db/database.js';

// menerapkan konfigurasi .env
dotenv.config();

const app = express();

// (async() => {
//     await db.sync();
// })();

// define session store
const sessionStore = SequalizeStore(session.Store);
const store = new sessionStore({
    db: db
});

// menerapkan session
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    store: store,
    saveUninitialized: true,
    cookie: {
        secure: 'auto'
    }
}));

// menerapkan cors
app.use(cors({
    credentials:true,
    origin: 'http:localhost:3000'
}));

// untuk menerima data json
app.use(express.json());

// routes
app.use('/api/', authRoute);
app.use('/api/user/', userRoute);
app.use('/api/product/', productRoute);

// buat bikin tabel store
// store.sync();

app.listen(process.env.APP_PORT, ()=>{
    console.log(`Server Running on ${process.env.APP_PORT}`);
});
