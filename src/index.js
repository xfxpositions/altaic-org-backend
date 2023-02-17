const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Post = require("./models/Post.js");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  Post.find({}, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ err: err });
    } else {
      res.json({ result: result });
    }
  });
});

app.post("/create", (req, res) => {
  console.log(req.body);
  const postToSave = new Post(req.body);
  postToSave.save({}, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ err: err });
    } else {
      res.json({ result: result });
    }
  });
});

app.post("/update/:id", (req, res) => {
  Post.updateById(res.params.id, res.body, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ err: err });
    } else {
      res.json({ result: result });
    }
  });
});
app.delete("/delete/:id", (req, res) => {
  Post.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ err: err });
    } else {
      res.json({ result: result });
    }
  });
});
app.post("/find/", (req, res) => {
  let searchInAll = req.query?.all || false;
  const regex = new RegExp();

  Post.find(
    searchInAll
      ? {
          title: { $regex: regex },
          content: { $regex: regex },
          author: { $regex: regex },
        }
      : req.body
  ).then((err, result) => {
    if (err) {
      console.log(err);
      res.json({ err: err });
    } else {
      res.json({ result: result });
    }
  });
});
app.get("/fetch/:id", (req, res) => {
  Post.findById(req.params.id, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ err: err });
    } else {
      res.json({ result: result });
    }
  });
});
const dbConnect = async () => {
  await mongoose.connect("mongodb://localhost:27017");
  console.log("connected to db!");
};

let port = process.env.port || 7881;

app.listen(port, async () => {
  await dbConnect();
  console.log("listening on " + port);
});
