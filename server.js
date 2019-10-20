const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('DB connection successfull');
    });

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down');

    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. SHUTTING DOWN');
    server.close(() => {
        console.log('🔧 Process terminated');
    });
});
