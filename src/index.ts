import express, { Request, Response, NextFunction } from 'express';
import { errorHandler, CustomError } from './midleware/err-handler';
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"

//import DB
import ConnectDB from './database/db';

// import Router
import userRouter from "./routes/userRouter"
import bookRoutes from './routes/bookRoutes'

const app = express();
const port = 3000;

//connectDatabase
ConnectDB().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

// midleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

// router
app.use('/api/books', bookRoutes);
app.use('/api/user', userRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err as CustomError, req, res, next); // Casting Error to CustomError
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
