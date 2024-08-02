const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./db");

// init app & middleware
const app = express();
app.use(express.json());

// db connection
let db;

connectToDb((err) => {
  if (!err) {
    // start express once connected to mongodb database
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});

// routes
// GET all endpoint
app.get("/books", (req, res) => {
  // current page
  const page = req.query.p || 0; // gets value of the query parameter 'p'
  const booksPerPage = 3;

  let books = [];

  db.collection("books")
    .find()
    .sort({ author: 1 }) // sort books in ascending order
    .skip(page * booksPerPage) // skip the amount of booksPerPage and limit to the next 3 (for query pagination)
    .limit(booksPerPage)
    .forEach((book) => books.push(book)) // add each book to books
    .then(() => {
      res.status(200).json(books); // send books to the client
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
  //   res.json({ mssg: "welcome to the api" });
});

// GET by id endpoint
app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) }) // get id by url params
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not fetch the document" });
      });
  } else {
    res.status(500).json({ error: "Not a vlid doc id" });
  }
});

// POST endpoint
app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not create a new document" });
    });
});

// DELETE endpoint
app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) }) // get id by url params
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not delete the document" });
      });
  } else {
    res.status(500).json({ error: "Not a vlid doc id" });
  }
});

// PATCH endpoint
app.patch("/books/:id", (req, res) => {
  const updates = req.body; // when a patch request is sent, the request's body JSON will describe what keys/columns and values/fields to update to

  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates }) // get id by url params
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not delete the document" });
      });
  } else {
    res.status(500).json({ error: "Not a vlid doc id" });
  }
});
