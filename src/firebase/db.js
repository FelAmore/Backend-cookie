import axios from 'axios';

// Function to get todos for a specific user
async function getTodos(userId) {
    try {
        // Make a GET request to the FastAPI endpoint to fetch todos for the user
        const response = await axios.get("http://127.0.0.1:8000/users/${userId}/todos");
        return response.data;
    } catch (error) {
        console.error('Error getting todos:', error);
        throw error;
    }
}

// Function to add a todo for a specific user
async function addTodo(userId, todo) {
    try {
        // Make a POST request to the FastAPI endpoint to add a todo for the user
        const response = await axios.post("http://127.0.0.1:8000/users/${userId}/todos", todo);
        return response.data;
    } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
    }
}

// Function to update a todo for a specific user
async function updateTodo(userId, id, newData) {
    try {
        // Make a PUT request to the FastAPI endpoint to update the todo for the user
        const response = await axios.put("http://127.0.0.1:8000/users/${userId}/todos/${id}", newData);
        return response.data;
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
}

// Function to delete a todo for a specific user
async function deleteTodo(userId, id) {
    try {
        // Make a DELETE request to the FastAPI endpoint to delete the todo for the user
        const response = await axios.delete("http://127.0.0.1:8000/users/${userId}/todos/${id}");
        return response.data;
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
}

export { getTodos, addTodo, updateTodo, deleteTodo };

