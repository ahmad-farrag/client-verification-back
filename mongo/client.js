const mongoose = require("mongoose");

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const DB_NAME = "client-verification-db";

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@db-cluster.sojwdcn.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
mongoose.connect(uri);

exports.db = mongoose.connection;
