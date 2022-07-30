const express = require("express");
const mongoose = require("mongoose");
const verifyJWT = require("../middleWares/verifyJWT");
const router = express.Router();
const todoSchema = require("../schemas/todoSchema");
const userSchema = require("../schemas/userSchema");
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);

// Gat active todos as a custom instance way (optional)
router.get("/active", verifyJWT, async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json({ data });
});

// Gat active todos with callback function as a custom instance way (optional)
router.get("/active-callback", async (req, res) => {
  const todo = new Todo();
  todo.findActiveCallback((err, data) => {
    res.status(200).json({ data });
  });
});

// Gat exist (js) with  as a custom static way (optional)
router.get("/js", async (req, res) => {
  const data = await Todo.findByJs();
  res.status(200).json({ data });
});

// Gat exist (react) with  as a custom static way (optional)
router.get("/language", async (req, res) => {
  const data = await Todo.find().byLanguage("react");
  res.status(200).json({ data });
});

// get all the todo
router.get("/", async (req, res) => {
  Todo.find({}, (err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was a server error!",
      });
    } else {
      res.status(200).json({ message: "Todo was inserted successfully!", result: data });
    }
  });
});

// get all the todo select item and limit
router.get("/select", async (req, res) => {
  Todo.find({})
    .select({ _id: 0, date: 0 })
    .limit(2)
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: "There was a server error!",
        });
      } else {
        res.status(200).json({ message: "Todo was inserted successfully!", result: data });
      }
    });
});

// relational  get all the todo select item and limit
/**
 * if you just get  name userName
 * also _id exclude
 */
router.get("/relation", async (req, res) => {
  Todo.find({})
    .populate("user", "name userName -_id")
    .select({ _id: 0, date: 0 })
    // .limit(2)
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: "There was a server error!",
        });
      } else {
        res.status(200).json({ message: "Todo was inserted successfully!", result: data });
      }
    });
});

// get todo by id
router.get("/:id", async (req, res) => {
  Todo.find({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was a server error!",
      });
    } else {
      res.status(200).json({ message: "Todo was inserted successfully!", result: data });
    }
  });
});

// relational post todo
router.post("/relation", verifyJWT, async (req, res) => {
  const newTodo = new Todo({ ...req.body, user: req.userId });
  try {
    const todo = await newTodo.save();
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: todo._id,
        },
      }
    );
    res.status(200).json({ message: "Todo was inserted successfully!" });
  } catch (error) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

// post todo
router.post("/", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save((err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server error!",
      });
    } else {
      res.status(200).json({ message: "Todo was inserted successfully!" });
    }
  });
});

// post multiple todo
router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server error!",
      });
    } else {
      res.status(200).json({ message: "Todo was inserted successfully!" });
    }
  });
});

// 1 way.  put  todo  and  if you want to update file back
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updateDoc = {
    $set: {
      status: "inactive",
    },
  };
  const options = { new: true, useFindAndModify: false };
  Todo.findByIdAndUpdate({ _id: id }, updateDoc, options, (err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was a server error!",
      });
    } else {
      res.status(200).json({ message: "Todo was inserted successfully!", result: data });
    }
  });
});

//2 way.  put  todo  and  if you want to update file back
// router.put("/:id", async (req, res) => {
//   const id = req.params.id;
//   const updateDoc = {
//     $set: {
//       status: "active",
//     },
//   };
//   const result = await Todo.findByIdAndUpdate({ _id: id }, updateDoc, {
//     new: true,
//     useFindAndModify: false,
//   });
//   console.log(result);
//   res.send(result);
// });

// put todo
// router.put("/:id", async (req, res) => {
//   const id = req.params.id;
//   const updateDoc = {
//     $set: {
//       status: "active",
//     },
//   };
//   const result = Todo.findByIdAndUpdate(
//     { _id: id },
//     updateDoc,
//     { new: true, useFindAndModify: false },
//     (err) => {
//       if (err) {
//         res.status(500).json({
//           error: "There was a server error!",
//         });
//       } else {
//         res.status(200).json({ message: "Todo was inserted successfully!" });
//       }
//     }
//   );
//   console.log(result);
// });

// // put todo
// router.put("/:id", async (req, res) => {
//   const id = req.params.id;
//   const updateDoc = {
//     $set: {
//       status: "active",
//     },
//   };
//   Todo.updateOne({ _id: id }, updateDoc, (err) => {
//     if (err) {
//       res.status(500).json({
//         error: "There was a server error!",
//       });
//     } else {
//       res.status(200).json({ message: "Todo was inserted successfully!" });
//     }
//   });
// });

// // put todo best way
// router.put("/:id", async (req, res) => {
//   const id = req.params.id;
//   const updateDoc = {
//     $set: {
//       status: "inactive",
//     },
//   };
//   try {
//     const a = await Todo.updateOne({ _id: mongoose.Types.ObjectId(id) }, updateDoc);
//     if (a.acknowledged) {
//       res.status(200).json({ message: "Todo was inserted successfully!" });
//     }
//   } catch (error) {
//     res.status(500).json({
//       error: "There was a server error!",
//     });
//   }
// });

//  many put todo best way
// router.put("/", async (req, res) => {
//   const updateDoc = {
//     $set: {
//       status: "active",
//     },
//   };
//   try {
//     const a = await Todo.updateMany({ status: "aaaactive" }, updateDoc);
//     console.log(a);
//     if (a.acknowledged) {
//       res.status(200).json({ message: "Todo was inserted successfully!" });
//     }
//   } catch (error) {
//     return res.json(error.message);
//   }
// });

// delete todo
router.delete("/:id", verifyJWT, async (req, res) => {
  Todo.deleteOne({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was a server error!",
      });
    } else {
      res.status(200).json({ message: "Todo was deleted successfully", data: data });
    }
  });
});

module.exports = router;
