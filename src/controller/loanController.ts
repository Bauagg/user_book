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

export const getAllLoanPanel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const loanData = await Loan.aggregate([
            {
                $group: {
                    _id: "$memberId", // Group by memberId
                    totalBooksLoaned: { $sum: 1 }, // Count the number of loans (books)
                    loans: { $push: "$$ROOT" } // Push the entire loan document for later use
                }
            },
            {
                $lookup: {
                    from: 'users', // Lookup the 'users' collection (change this if your collection name is different)
                    localField: '_id', // Match '_id' with 'memberId' in 'users' collection
                    foreignField: '_id',
                    as: 'memberInfo'
                }
            },
            {
                $lookup: {
                    from: 'books', // Lookup the 'books' collection
                    localField: 'loans.bookId', // Match 'bookId' in the 'loans' subdocument
                    foreignField: '_id',
                    as: 'bookInfo'
                }
            },
            {
                $unwind: '$memberInfo' // Unwind to flatten the memberInfo array
            },
            {
                $project: {
                    _id: 1, // Include the memberId as _id
                    totalBooksLoaned: 1, // Include the total count
                    memberInfo: {
                        _id: "$memberInfo._id",
                        name: "$memberInfo.name",
                        email: "$memberInfo.email",
                        role: "$memberInfo.role",
                        createdAt: "$memberInfo.createdAt",
                        updatedAt: "$memberInfo.updatedAt",
                        __v: "$memberInfo.__v" // Include version key if necessary
                    },
                    bookInfo: 1 // Include book info
                    // Exclude 'loans' since it's no longer needed in the response
                }
            }
        ]);

        if (loanData.length === 0) {
            res.status(404).json({ message: "No loans found for this member." });
            return;
        }

        res.status(200).json({
            message: "Total number of books loaned by the member",
            data: loanData // Send the first (and only) result for the current member
        });
    } catch (error) {
        console.log(error)
        next(error)
    }
}

// Mengambil semua pinjaman
export const getAllLoans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const loans = await Loan.find({ memberId: req.user?.userId }).populate('bookId', 'title').populate('memberId', 'name');

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