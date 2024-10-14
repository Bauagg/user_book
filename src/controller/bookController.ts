import { NextFunction, Request, Response } from 'express';
import Book from '../model/book';

// Menambahkan buku baru
export const addBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { code, title, author, stock } = req.body;

    try {
        const newBook = new Book({ code, title, author, stock });
        await newBook.save();

        res.status(201).json({ message: "Create of successful book", data: newBook });
    } catch (error) {
        console.log(error)
        next(error)
    }
};


export const getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const books = await Book.find();

        const availableBooks = books.filter(book => book.stock > 0)

        // Mengubah format response untuk menampilkan quantity
        const bookList = availableBooks.map(book => ({
            id: book._id,
            code: book.code,
            title: book.title,
            author: book.author,
            stock: book.stock
        }));

        res.status(200).json({ message: "List of successful books", data: bookList });
    } catch (error) {
        console.log(error)
        next(error)
    }
};


// Mendapatkan buku berdasarkan ID
export const getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.status(200).json({ message: "detail book successful", data: book });
    } catch (error) {
        console.log(error)
        next(error)
    }
};

// Memperbarui buku berdasarkan ID
export const updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.status(200).json({ message: "Update of successful book", data: updatedBook });
    } catch (error) {
        console.log(error)
        next(error)
    }
};

// Menghapus buku berdasarkan ID
export const deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.status(204).json({ message: "Delete of successful book" });
    } catch (error) {
        console.log(error)
        next(error)
    }
};
