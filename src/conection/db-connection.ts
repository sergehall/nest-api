import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.ATLAS_URI;
const dbName = process.env.DB_NAME_NEST;

// connect by mongoose
export async function runDb() {
  try {
    await mongoose.connect(dbUrl + '/' + dbName);
    console.log('Connected successfully to server :)');
  } catch (e) {
    console.log("Can't connection to Db");
    console.error(e);
    await mongoose.disconnect();
  }
}
