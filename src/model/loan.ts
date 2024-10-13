import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILoan extends Document {
    bookId: mongoose.Types.ObjectId;  
    memberId: mongoose.Types.ObjectId; 
    borrowedAt: Date;                  
    dueDate: Date;                     
    returnedAt?: Date;                
    status: 'active' | 'returned';    
}

const loanSchema: Schema<ILoan> = new Schema({
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book', 
        required: true,
    },
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    borrowedAt: {
        type: Date,
        default: Date.now, 
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    returnedAt: {
        type: Date,
        default: null, 
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'returned'],
            message: '{VALUE} is not a valid status',
        },
        default: 'active', 
    },
}, { timestamps: true });


// Membuat model dari schema
const Loan: Model<ILoan> = mongoose.model<ILoan>('Loan', loanSchema);

export default Loan;
