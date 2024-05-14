const sqlite3 = require('sqlite3').verbose();

// Open a connection to the database
const db = new sqlite3.Database('todos.db');

// Create todos table if it doesn't exist
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, is_completed INTEGER DEFAULT 0)");
});

// Function to add a new todo
function addTodo(title, description) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO todos (title, description) VALUES (?, ?)", [title, description], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

// Function to get all todos
function getAllTodos() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM todos", (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Function to update a todo
function updateTodo(id, title, description, isCompleted) {
    return new Promise((resolve, reject) => {
        db.run("UPDATE todos SET title = ?, description = ?, is_completed = ? WHERE id = ?", [title, description, isCompleted, id], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

// Function to delete a todo
function deleteTodo(id) {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM todos WHERE id = ?", id, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

module.exports = {
    addTodo,
    getAllTodos,
    updateTodo,
    deleteTodo
};

