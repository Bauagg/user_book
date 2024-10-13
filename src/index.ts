import express, { Request, Response, NextFunction } from 'express';
import { errorHandler, CustomError } from './midleware/err-handler';
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"


const app = express();
const port = 3000;

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err as CustomError, req, res, next); // Casting Error to CustomError
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
