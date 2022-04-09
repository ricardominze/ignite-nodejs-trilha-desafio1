//---------
//Libraries
//---------
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Logger = require('./logger')

//-----------------------
//Configuration Libraries
//-----------------------

const app = express();
const logfile = 'app.log';
app.use(cors());
app.use(express.json());

//---------------
//Appication Vars
//---------------

const users = [];

//-----------
//Middlewares
//-----------

function checksExistsUserAccount(request, response, next) {

  // Complete aqui

  const { username } = request.headers;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return response.status(404).json({ error: "User not found!" });
  }
  request.user = user;
  return next();
}

function checksAlredyExistsUserAccount(request, response, next) {

  const { username } = request.body;
  const user = users.find((user) => user.username === username);
  if (user) {
    return response.status(400).json({ error: "User alredy exists!" });
  }
  return next();
}

function checksExistsUserTodoAccount(request, response, next) {

  // Complete aqui

  const { user } = request;
  const { id } = request.params;
  const todo = user.todos.find((todo) => todo.id === id);
  if (!todo) {
    response.status(404).json({ error: "Todo not found!" });
  }
  request.todo = todo;
  return next();
}

//------
//Routes
//------

app.post('/users', checksAlredyExistsUserAccount, (request, response) => {

  // Complete aqui

  try {
    const { name, username } = request.body;
    const user = {
      id: uuidv4(),
      name: name,
      username: username,
      todos: []
    };
    users.push(user);
    return response.status(201).json(user);
  } catch (e) {
    Logger.write(logfile, e.message);
    return response.status(500).send();
  }

});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  // Complete aqui

  try {
    const { todos } = request.user;
    return response.status(200).json(todos);
  } catch (e) {
    Logger.write(logfile, e.message);
    return response.status(500).send();
  }

});

app.post('/todos', checksExistsUserAccount, (request, response) => {

  // Complete aqui
  try {
    const user = request.user;
    const { title, deadline } = request.body;
    const todo = {
      id: uuidv4(),
      title: title,
      done: false,
      deadline: new Date(deadline),
      created_at: new Date()
    }
    user.todos.push(todo);
    return response.status(201).json(todo);
  } catch (e) {
    Logger.write(logfile, e.message);
    return response.status(500).send();
  }

});

app.patch('/todos/:id', checksExistsUserAccount, checksExistsUserTodoAccount, (request, response) => {

  // Complete aqui

  try {
    const todo = request.todo;
    const { title, deadline } = request.body;
    todo.title = title;
    todo.deadline = deadline;
    return response.status(200).json(todo);
  } catch (e) {
    Logger.write(logfile, e.message);
    return response.status(500).send();
  }

});

app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsUserTodoAccount, (request, response) => {

  // Complete aqui

  try {
    const todo = request.todo;
    todo.done = true;
    return response.status(200).json(todo);
  } catch (e) {
    Logger.write(logfile, e.message);
    return response.status(500).send();
  }

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {

  // Complete aqui

  var ret;
  try {
    const { user } = request;
    const { id } = request.params;
    const todo = user.todos.find((todo) => todo.id === id);
    if (!todo) {
      ret = response.status(404).json({ error: "Todo not found!" });
    } else {
      user.todos = user.todos.filter(td => { return td.id != todo.id });
      ret = response.status(204).send();
    }
  } catch (e) {
    Logger.write(logfile, e.message);
    return response.status(500).send();
  }
  return ret;
});

app.put('/todos/:id', checksExistsUserAccount, checksExistsUserTodoAccount, (request, response) => {

  try {
    const todo = request.todo;
    const { title, deadline } = request.body;
    todo.title = title;
    todo.deadline = deadline;
    return response.status(200).json(todo);
  } catch (e) {
    Logger.write(logfile, e.message);
    return response.status(500).send();
  }
});

module.exports = app;