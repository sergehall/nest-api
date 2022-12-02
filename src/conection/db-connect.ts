import mongoose from 'mongoose';

const dbUrl = process.env.ATLAS_URI;
const dbName = process.env.DB_NAME_NEST;

// connect by mongoose
export async function runDb() {
  try {
    await mongoose.connect(dbUrl + '/' + dbName);
    console.log('Connected successfully to server :)');
  } catch (e) {
    console.log('No connection');
    console.error(e);
    await mongoose.disconnect();
  }
}
