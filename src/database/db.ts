import { connect } from 'mongoose';

const ConnectDB = async (): Promise<void> => {
  try {
    await connect('mongodb://127.0.0.1:27017/library');
    console.log('MongoDB berhasil terhubung');
  } catch (error) {
    console.error('Koneksi ke MongoDB gagal:', error);
    process.exit(1); 
  }
};

export default ConnectDB;
