import { Request, Response } from 'express';
import Loan from '../model/loan';

// Menambah pinjaman baru
export const addLoan = async (req: Request, res: Response): Promise<void> => {
    const { bookId, memberId, dueDate } = req.body;

    try {
        const newLoan = new Loan({ bookId, memberId, dueDate });
        await newLoan.save();
        res.status(201).json({
            message: 'Pinjaman berhasil ditambahkan',
            loan: newLoan, // Menampilkan data pinjaman yang baru ditambahkan
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambah pinjaman', error });
    }
};


// Mengembalikan buku
export const returnBook = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Mengambil ID dari parameter URL

    console.log(`Mencari pinjaman dengan ID: ${id}`); // Log ID yang dicari

    try {
        const loan = await Loan.findById(id); // Mencari pinjaman berdasarkan ID
        if (!loan) {
            res.status(404).json({ message: 'Pinjaman tidak ditemukan' });
            return;
        }

        loan.status = 'returned';
        loan.returnedAt = new Date();
        await loan.save(); // Menyimpan perubahan

        res.status(200).json({
            message: 'Buku telah dikembalikan',
            loan: {
                _id: loan._id,
                bookId: loan.bookId,
                memberId: loan.memberId,
                dueDate: loan.dueDate,
                status: loan.status,
                returnedAt: loan.returnedAt,
                
            }
        });
    } catch (error) {
        console.error(error); // Log error untuk debugging
        res.status(500).json({ message: 'Gagal mengembalikan buku', error });
    }
};


// Mengambil semua pinjaman
export const getAllLoans = async (req: Request, res: Response): Promise<void> => {
    try {
        const loans = await Loan.find().populate('bookId', 'title').populate('memberId', 'name');
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil daftar pinjaman', error });
    }
};
