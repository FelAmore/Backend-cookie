from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import sqlite3
import os

# Define a Pydantic model for Task
class Task(BaseModel):
    title: str
    description: str
    completed: bool

# Initialize FastAPI app
app = FastAPI()

# CORS (Cross-Origin Resource Sharing) configuration
origins = [
    "http://localhost:5174",
    "http://127.0.0.1:8000",
    "http://localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the directory containing api.py
current_directory = os.path.dirname(__file__)

# Path to the database file
database_path = os.path.join(current_directory, '', 'todos.db')

# Open a connection to the SQLite database
conn = sqlite3.connect(database_path)
cursor = conn.cursor()


# Alter the todos table to drop the is_completed column
cursor.execute("PRAGMA foreign_keys=off")
cursor.execute("BEGIN TRANSACTION")
cursor.execute("CREATE TABLE todos_backup (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, completed INTEGER DEFAULT 0, user_id INTEGER)")
cursor.execute("INSERT INTO todos_backup SELECT id, title, description, completed, user_id FROM todos")
cursor.execute("DROP TABLE todos")
cursor.execute("ALTER TABLE todos_backup RENAME TO todos")
cursor.execute("COMMIT")
cursor.execute("PRAGMA foreign_keys=on")
conn.commit()

# CRUD operations

# Endpoint to get all tasks with indices
@app.get("/tasks/")
async def get_tasks():
    print("GET request received for tasks endpoint...")
    cursor.execute("SELECT * FROM todos")
    tasks = cursor.fetchall()
    tasks_list = [{"id": task[0], "title": task[1], "description": task[2], "completed": bool(task[3])} for task in tasks]
    print("Tasks retrieved from database:", tasks_list)
    return tasks_list  # Return list of tasks directly


# Endpoint to create a new task
@app.post("/tasks/")
async def create_task(task: Task):
    try:
        # Insert task into the database
        cursor.execute("INSERT INTO todos (title, description, completed) VALUES (?, ?, ?)",
                       (task.title, task.description, int(task.completed)))
        conn.commit()

        # Fetch the ID of the inserted task
        task_id = cursor.lastrowid

        # Return success response with task details
        return {"message": "Task successfully created",
                "task": {"id": task_id, "title": task.title,
                         "description": task.description,
                         "completed": task.completed}}
    except Exception as e:
        # If an error occurs, rollback the transaction
        conn.rollback()
        # Raise HTTP exception with error message
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# Endpoint to get a specific task by index
@app.get("/tasks/{task_id}")
async def get_task(task_id: int):
    cursor.execute("SELECT * FROM todos WHERE id=?", (task_id,))
    task = cursor.fetchone()
    if task:
        return {"message": "Task successfully retrieved", "task": {"id": task[0], "title": task[1], "description": task[2], "completed": bool(task[3])}}
    else:
        raise HTTPException(status_code=404, detail="Task not found")

# Endpoint to update a task
@app.put("/tasks/{task_id}")
async def update_task(task_id: int, updated_task: Task):
    cursor.execute("UPDATE todos SET title=?, description=?, completed=? WHERE id=?", (updated_task.title, updated_task.description, int(updated_task.completed), task_id))
    conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    else:
        return {"message": "Task successfully updated", "task": {"id": task_id, "title": updated_task.title, "description": updated_task.description, "completed": updated_task.completed}}

# Endpoint to delete a task
@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    cursor.execute("DELETE FROM todos WHERE id=?", (task_id,))
    conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    else:
        return {"message": "Task successfully deleted", "task": {"id": task_id}}

# Close the database connection
@app.on_event("shutdown")
async def shutdown_event():
    conn.close()
