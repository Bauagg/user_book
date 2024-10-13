import express, { Request, Response, NextFunction } from 'express';
import { errorHandler, CustomError } from './midleware/err-handler';
import ConnectDB from './database/db';

const app = express();
const port = 3000;

ConnectDB().then(() => {
    console.log('Connected to MongoDB');
})
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err as CustomError, req, res, next); // Casting Error to CustomError
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
