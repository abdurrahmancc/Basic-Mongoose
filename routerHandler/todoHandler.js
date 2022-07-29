const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../schemas/todoSchema");
const Todo = new mongoose.model("Todo", todoSchema);

// get all the todo
// router.get("/", async (req, res) => {
//   Todo.find({}, (err, data) => {
//     if (err) {
//       res.status(500).json({
//         error: "There was a server error!",
//       });
//     } else {
//       res.status(200).json({ message: "Todo was inserted successfully!", result: data });
//     }
//   });
// });

// get all the todo select item and limit
router.get("/", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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
