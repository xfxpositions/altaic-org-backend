const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Post = require("./models/Post.js");
const Common = require("./models/Common.js");
const cors = require("cors");
app.use(cors());
app.use(express.json());

const PostView = require("./views/PostViews.js");

app.use(PostView);

app.get("/increasevisitorcounter", (req, res, next) => {
  Common.find({}, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ err: err });
    } else {
      console.log(result);
      if (result.length == 0) {
        Common.create({ visitors: 0 }, (result) => {
          console.log(`visitors initialazed`);
        });
      } else {
        Common.findByIdAndUpdate(
          result[0]._id,
          { $inc: { visitors: 1 } },
          (err, result) => {
            console.log(`visitors increased`);
            res.json({ result: result.visitors });
          }
        );
      }
    }
  });
});
app.get("/visitors", (req, res) => {
  Common.find({}, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ err: err });
    } else {
      res.json({ visitors: result.visitors });
    }
  }).limit(1);
});
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

app.get("/multifetch", async (req, res) => {
  let limit = req.query.limit;
  let page = req.query.page;
  let totalPosts = 0;
  Post.countDocuments({}, (err, count) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Collection size: ${count}`);
      totalPosts = count;
      Post.find({}, (err, result) => {
        if (err) {
          console.log(err);
          res.json({ err: err });
        } else {
          res.json({ result: result, totalPosts: totalPosts });
        }
      })
        .skip(page * 3)
        .limit(limit);
    }
  });
});

const dbConnect = async () => {
  console.log("connecting db");
  await mongoose.connect("mongodb://127.0.0.1:27017");
  console.log("connected to db!");
};

let port = process.env.port || 7881;

app.listen(port, async () => {
  await dbConnect();
  console.log("listening on " + port);
});
