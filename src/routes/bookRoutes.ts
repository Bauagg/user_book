import { Router } from 'express';
import { addBook, getAllBooks, getBookById, updateBook, deleteBook } from '../controller/bookController';

const router = Router();

router.post('/', addBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
