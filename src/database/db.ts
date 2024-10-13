import { connect } from 'mongoose';

const ConnectDB = async () => {
    await connect("mongodb://127.0.0.1:27017/library", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export default ConnectDB;
