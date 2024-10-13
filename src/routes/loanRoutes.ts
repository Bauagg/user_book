import { Router } from 'express';
import { addLoan, returnBook, getAllLoans } from '../controller/loanController';

const router = Router();

router.post('/', addLoan);
router.put('/return/:id', returnBook);
router.get('/', getAllLoans);

export default router;
