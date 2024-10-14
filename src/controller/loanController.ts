import { NextFunction, Request, Response } from 'express';
import cron from "node-cron"
import Loan from '../model/loan';
import Book from "../model/book"
import User from "../model/user"

// Menambah pinjaman baru
export const addLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { bookId } = req.body;

    try {
        const dataUser = await User.findById(req.user?.userId)
        if (dataUser?.pinalti === 1) {
            res.status(400).json({ mesage: "You can no longer borrow books at this time, please wait up to 3 days." })
        }

        const today = new Date();

        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const loans = await Loan.find({ memberId: req.user?.userId, createdAt: { $gte: startOfDay, $lte: endOfDay } })

        if (loans.length >= 2) {
            res.status(400).json({ message: "you have reached the loan limit book" })
            return
        }

        const detailBook = await Book.findById(bookId)
        if (!detailBook) {
            res.status(404).json({ mesage: "Book not found" })
            return
        }

        await Book.findByIdAndUpdate(bookId, { stock: detailBook.stock - 1 }, { new: true })

        const newLoan = new Loan({ bookId, memberId: req.user?.userId, });
        await newLoan.save();

        res.status(201).json({
            message: 'Book loan successfully added',
            data: newLoan, // Menampilkan data pinjaman yang baru ditambahkan
        });
    } catch (error) {
        console.log(error)
        next(error)
    }
};


// Mengembalikan buku
export const returnBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params; // Mengambil ID dari parameter URL

    try {
        const loan = await Loan.findOne({ _id: id, memberId: req.user?.userId }); // Mencari pinjaman berdasarkan ID
        if (!loan) {
            res.status(404).json({ message: 'Book loan not found' });
            return;
        }

        const detailBook = await Book.findById(loan.bookId)
        if (!detailBook) {
            res.status(404).json({ mesage: "Book not found" })
            return
        }

        await Book.findByIdAndUpdate(loan.bookId, { stock: detailBook.stock + 1 }, { new: true })

        loan.status = 'returned';
        await loan.save(); // Menyimpan perubahan

        res.status(200).json({
            message: 'Buku telah dikembalikan',
            data: loan

        });
    } catch (error) {
        console.log(error)
        next(error)
    }
};


// Mengambil semua pinjaman
export const getAllLoans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        console.log(req.user?.userId)
        // { memberId: }
        const loans = await Loan.find().populate('bookId', 'title').populate('memberId', 'name');

        res.status(200).json({ message: "List of successful books", data: loans });
    } catch (error) {
        console.log(error)
        next(error)
    }
};

export const setupDailyLoanCronJob = (): void => {
    cron.schedule('* * * * *', async () => {
        try {
            const today = new Date();

            // Calculate the date 7 days ago
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);

            // Set the start and end of the 7-day range
            const startOfDay = new Date(sevenDaysAgo.setHours(0, 0, 0, 0));
            const endOfDay = new Date(sevenDaysAgo.setHours(23, 59, 59, 999));

            // Find all loans created today
            const loansToday = await Loan.find({
                createdAt: { $gte: startOfDay, $lte: endOfDay },
                status: "active"
            });

            for (let data of loansToday) {
                await User.findByIdAndUpdate(data.memberId, { pinalti: 1 }, { new: true })
            }
        } catch (error) {
            console.error('Error processing daily loans:', error);
        }
    });
};

export const setupuserPinaltiCronJob = (): void => {
    cron.schedule('* * * * *', async () => {
        try {
            const today = new Date();

            // Calculate the date 7 days ago
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 3);

            // Set the start and end of the 7-day range
            const startOfDay = new Date(sevenDaysAgo.setHours(0, 0, 0, 0));
            const endOfDay = new Date(sevenDaysAgo.setHours(23, 59, 59, 999));

            const user = await User.find({ createdAt: { $gte: startOfDay, $lte: endOfDay }, pinalti: 1 })

            for (let data of user) {
                await User.findByIdAndUpdate(data._id, { pinalti: 0 }, { new: true })
            }
        } catch (error) {
            console.error('Error processing User Pinalti:', error);
        }
    })

    console.log('tes');
}