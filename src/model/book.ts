import {Schema, model, Document} from 'mongoose';

// Definisikan interface untuk Book
interface IBook extends Document {
    code: string;
    title: string;
    author: string;
    stock: number;
}

// Buat skema untuk Book
const BookSchema = new Schema<IBook>({
    code: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
});

// Buat model Book
const Book = model<IBook>('Book', BookSchema);

export default Book;
