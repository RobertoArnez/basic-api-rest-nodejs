const express = require("express");
const bodyParser = require("body-parser");
const pg = require('pg');
const { response } = require("express");

const config = {
  user: 'todos_db_ety7_user',
  database: 'todos_db_ety7',
  password: '0HuuVDSSZDU70iKfwQPL5h0FdyziyEOO',
  host: 'dpg-cf2as4mn6mpkr6drba6g-a.oregon-postgres.render.com',
  port: 5432,
  ssl: true,
  idleTimeoutMillis: 3000, 
}

const client = new pg.Pool(config);

// Modelo
class TodoModel {
  constructor() {
    this.todos = [];
  }

  async getTodos(){
    const res = await client.query('select * from todos');
    console.log(res);
    return res.rows;
  }

  async  addTodo(todoText) {
    const query = 'INSERT INTO todos(id, task) VALUES($1, $2) RETURNING *';
    const values = [Math.floor(1000 + Math.random() * 9000), todoText];
    const res = await client.query(query, values);
    return res;
  }
}

// Controlador
class TodoController {
  constructor(model) {
    this.model = model;
  }

  async getTodos(){
    return await this.model.getTodos();
  }

  async addTodo(todoText) {
    await this.model.addTodo(todoText);
  }
}

// Vistas (Rutas)
const app = express();
const todoModel = new TodoModel();
const todoController = new TodoController(todoModel);

app.use(bodyParser.json());

app.get("/todos", async (req, res) => {
  const response = await todoController.getTodos();
  res.json(response);
});

// Vistas (Rutas) (continuación)
app.post("/todos", (req, res) => {
  const todoText = req.body.text;
  console.log(req.body)
  todoController.addTodo(todoText);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
