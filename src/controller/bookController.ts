import { Request, Response } from 'express';
import Book from '../model/book';

// Menambahkan buku baru
export const addBook = async (req: Request, res: Response): Promise<void> => {
    const { code, title, author, stock } = req.body;

    try {
        const newBook = new Book({ code, title, author, stock });
        await newBook.save();
        res.status(201).json(newBook); // Mengirim respons tanpa mengembalikannya
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan buku' });
    }
};

// Mengambil semua buku
export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const books = await Book.find();
        res.status(200).json(books); // Mengirim respons tanpa mengembalikannya
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil daftar buku' });
    }
};

// Mendapatkan buku berdasarkan ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: 'Buku tidak ditemukan' }); // Mengirim respons tanpa mengembalikannya
            return; // Menghentikan eksekusi lebih lanjut
        }
        res.status(200).json(book); // Mengirim respons tanpa mengembalikannya
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil buku' });
    }
};

// Memperbarui buku berdasarkan ID
export const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            res.status(404).json({ message: 'Buku tidak ditemukan' }); // Mengirim respons tanpa mengembalikannya
            return; // Menghentikan eksekusi lebih lanjut
        }
        res.status(200).json(updatedBook); // Mengirim respons tanpa mengembalikannya
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui buku' });
    }
};

// Menghapus buku berdasarkan ID
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            res.status(404).json({ message: 'Buku tidak ditemukan' }); // Mengirim respons tanpa mengembalikannya
            return; // Menghentikan eksekusi lebih lanjut
        }
        res.status(204).send(); // Mengirim respons tanpa konten
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus buku' });
    }
};
