"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const BaseDatabase_1 = require("./connection/BaseDatabase");
exports.routes = (0, express_1.Router)();
exports.routes.post("/todos", async (req, res) => {
    const { name } = req.body;
    const todo = await BaseDatabase_1.connection.insert({
        name,
    })
        .into("Todo");
    return res.sendStatus(201).send({ message: "Todo created successfully", todo });
});
exports.routes.get("/todos", async (req, res) => {
    const todos = await BaseDatabase_1.connection
        .select("*")
        .from("Todo");
    return res.status(200).send(todos);
});
exports.routes.put("/todos", async (req, res) => {
    try {
        const { name, id, status } = req.body;
        if (!id) {
            return res.status(400).send("Id is mandatory");
        }
        const todoAlreadyExist = await (0, BaseDatabase_1.connection)("Todo")
            .where({ id });
        if (todoAlreadyExist.length === 0) {
            return res.status(404).json("Todo not exist");
        }
        const todo = await (0, BaseDatabase_1.connection)("Todo")
            .where({ id })
            .update({
            status,
            name,
        });
        return res.status(200).json(todo);
    }
    catch (error) {
        throw new Error(error.sqlMessage || error.message);
    }
});
exports.routes.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const intId = parseInt(id);
    if (!intId) {
        return res.status(400).json("Id is mandatory");
    }
    const todoAlreadyExist = await (0, BaseDatabase_1.connection)("Todo")
        .where({ id: intId });
    if (todoAlreadyExist.length === 0) {
        return res.status(404).json("Todo not exist");
    }
    await (0, BaseDatabase_1.connection)("Todo")
        .where({ id: intId })
        .delete();
    return res.status(200).send(`Todo with id ${id} was deleted successfully`);
});
