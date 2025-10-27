import express from "express";
import {
  addTodos,
  changeStatus,
  deleteTodo,
  getTodos,
  login,
  registUser,
  updateTodos,
} from "../controller/userController.js";
import authUser from "../middleware/authUser.js";

const userRouter = express();



userRouter.post("/register", registUser);
userRouter.post("/login", login);
userRouter.post("/add-todo",authUser, addTodos);
userRouter.delete("/delete-todo/:id",authUser, deleteTodo);
userRouter.get("/getAllTodo", authUser, getTodos);
userRouter.put("/updateTodo/:id",authUser,  updateTodos);
userRouter.patch("/change-status/:id", authUser, changeStatus);

export default userRouter;
