// const mongoose = require("mongoose");

// const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, TEST_DB_HOST } =
//   process.env;

// const DB_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${
//   process.env.NODE_ENV === "test" ? TEST_DB_HOST : DB_HOST
// }:${DB_PORT}/${DB_NAME}?authSource=admin`;

// const url = DB_URI;
// const uri = 'mongodb+srv://mpilo:86wpLH7Wdy9z7JzB@backend.tsx2iii.mongodb.net/?retryWrites=true&w=majority&appName=backend';

// const connectToMongo = () => {
//   mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(client => {
//     console.log(`Connected to MongoDB: ${client.host}`);
//   }).catch(err=> {
//     console.log('Error', err)
//   });



//   db = mongoose.connection;

//   db.once("open", () => {
//     console.log("Database connected: ", url);
//   });

//   db.on("error", (err) => {
//     console.error("Database connection error: ", err);
//   });
// };

// module.exports = connectToMongo;


// const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, TEST_DB_HOST } =
//   process.env;
// const DB_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${
//   process.env.NODE_ENV === "test" ? TEST_DB_HOST : DB_HOST
// }:${DB_PORT}/${DB_NAME}?authSource=admin`;

// const url = DB_URI;
const mongoose = require("mongoose");
const uri = 'mongodb+srv://mpilo:86wpLH7Wdy9z7JzB@backend.tsx2iii.mongodb.net/?retryWrites=true&w=majority&appName=backend';

const connectToMongo = () => {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;

  db.once("open", () => {
    console.log("Database connected: ", uri);
  });

  db.on("error", (err) => {
    console.error("Database connection error: ", err);
  });
};
module.exports = connectToMongo

