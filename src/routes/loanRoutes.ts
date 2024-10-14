import { Router } from 'express';
import { addLoan, returnBook, getAllLoans, getAllLoanPanel } from '../controller/loanController';
import authMiddleware from "../midleware/authorization"

const router = Router();

router.post('/', authMiddleware, addLoan);
router.put('/return/:id', authMiddleware, returnBook);
router.get('/', authMiddleware, getAllLoans);
router.get('/list', getAllLoanPanel)

export default router;
