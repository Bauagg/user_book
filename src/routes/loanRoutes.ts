import { Router } from 'express';
import { addLoan, returnBook, getAllLoans } from '../controller/loanController';
import authMiddleware from "../midleware/authorization"

const router = Router();

router.post('/', authMiddleware, addLoan);
router.put('/return/:id', authMiddleware, returnBook);
router.get('/', authMiddleware, getAllLoans);

export default router;
