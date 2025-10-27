import { Todo } from "../model/todo.model.js";
import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//api register user

const registUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.json({
        success: false,
        message: "missing credentials",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        success: false,
        message: "user already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      email,
      password: hashedPassword,
      name,
    });
    await userData.save();
    const token = jwt.sign(
      { id: userData._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // optional but good
    );
    res.json({
      success: true,
      message: "registerd",
      token,
      user: { id: userData._id, name: userData.name, email: userData.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//api for  login user

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "user not found" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log("payload: ", { id: user._id });

    return res.json({
      success: true,
      message: "login successfull",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// api for add todo

const addTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, completed = false } = req.body;
    if (!title || typeof title !== "string") {
      return res.json({ success: false, message: "add the todo first" });
    }

    const newTodo = new Todo({
      title: title.trim(),
      completed,
      user: userId,
    });
    const todo = await newTodo.save();
    res.json({ success: true, message: "todo added", todo });
  } catch (error) {
    console.log(error);
  }
};

// api for deleting the  todo
const deleteTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    if (!id) {
      return res.json({ success: false, message: "Todo id required" });
    }

    const deletedTodo = await Todo.findOneAndDelete({ _id: id, user: userId });
    if (!deletedTodo) {
      return res.json({ success: false, message: "todo not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      todo: deletedTodo,
    });
  } catch (error) {
    console.log(error);
  }
};

//api for get todos
const getTodos = async (req, res) => {
  try {
    const userId = req.user.id;

    const allTodo = await Todo.find({ user: userId });
    if (!allTodo) {
      return res.json({ success: false, message: "no todo listed" });
    }
    res.json({ success: true, allTodo });
  } catch (error) {
    console.log(error);
  }
};

// api for updating todos
const updateTodos = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const userId = req.user.id;
  const todoData = await Todo.findOneAndUpdate(
    { _id: id, user: userId },
    { title, completed },
    { new: true }
  );
  if (!todoData) {
    return res.json({ success: false, message: "no todo for update" });
  }
  res.json({ success: true, todoData });
};

//api to update the  check box
const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const userId = req.user.id;

    // Validate ID and completed value
    if (!id) {
      return res.json({ success: false, message: "Todo ID is required" });
    }
    if (typeof completed !== "boolean") {
      return res.json({
        success: false,
        message: "Completed must be a boolean",
      });
    }

    // Ensure the todo belongs to the logged-in user

    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: userId },
      { completed },
      { new: true }
    );
    if (!todo) {
      return res.json({ success: false, message: "no todo for update" });
    }

    res.json({ success: true, message: "Status updated successfully", todo });
  } catch (error) {
    console.error("Change status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  addTodos,
  deleteTodo,
  getTodos,
  updateTodos,
  changeStatus,
  login,
  registUser,
};
