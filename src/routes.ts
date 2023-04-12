import { Router } from "express";
import { connection } from "./connection/BaseDatabase";

export const routes = Router();

routes.post("/todos", async (req, res) => {
  const { name } = req.body;

  const todo = await connection.insert({
    name,
  })
  .into("Todo");

  return res.sendStatus(201).send({message: "Todo created successfully", todo});
});

routes.get("/todos", async (req, res) => {
  const todos = await connection
  .select("*")
  .from("Todo");

  return res.status(200).send(todos);

});

routes.put("/todos", async (req, res) => {
  try {
  const { name, id, status } = req.body;

  if (!id) {
    return res.status(400).send("Id is mandatory");
  }

  const todoAlreadyExist = await connection("Todo")
  .where({ id })

  if (todoAlreadyExist.length === 0) {
    return res.status(404).json("Todo not exist");
  }

  const todo = await connection("Todo")
  .where({ id })
  .update({
    status,
    name,
  });

  return res.status(200).json(todo);

  } catch (error: any) {
    throw new Error(error.sqlMessage || error.message);
  }

});

routes.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const intId = parseInt(id);

  if (!intId) {
    return res.status(400).json("Id is mandatory");
  }

  const todoAlreadyExist = await connection("Todo")
  .where({ id: intId });

  if (todoAlreadyExist.length === 0) {
    return res.status(404).json("Todo not exist");
  }

  await connection("Todo")
  .where({ id: intId })
  .delete();

  return res.status(200).send(
    `Todo with id ${id} was deleted successfully`
  );
});
