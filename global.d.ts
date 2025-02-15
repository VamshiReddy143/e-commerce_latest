import mongoose from "mongoose";


interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}


declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

export {};
