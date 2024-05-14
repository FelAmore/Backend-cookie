import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Header } from "../components/Header/header";
import { Tasks } from "../components/Tasks/tasks";
import { useAuth } from '../contexts/authContext';
import { useParams } from 'react-router-dom';
import { useAuthRedirect } from "../firebase/auth"; // Import useAuthRedirect

function Homepage() {
  useAuthRedirect(); // Call useAuthRedirect to handle authentication redirection
  const { currentUser, isGoogleUser, isEmailUser } = useAuth();
  const userId = currentUser.uid; // Retrieve the UID of the current user
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [editedTaskDescription, setEditedTaskDescription] = useState('');

  useEffect(() => {
    console.log("userId in fetch task:", userId); // Log userId to verify its value
    async function fetchTasks() {
        try {
            const tasksFromApi = await fetchTasksFromApi(); // Fetch tasks from the API using userId
            setTasks(tasksFromApi);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }
    fetchTasks();
  }, [userId]);

  async function fetchTasksFromApi() {
    console.log("Fetching tasks from API...");
    try {
        const response = await axios.get(`http://127.0.0.1:8000/tasks/`);
        console.log("Response from API:", response.data);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error; // Rethrow the error for further handling
    }
  }


  async function addTask(taskTitle, taskDescription) {
    try {
        // Log the parameters to ensure they have the expected values
        console.log('userId in addTask:', userId);
        console.log('taskTitle:', taskTitle);
        console.log('taskDescription:', taskDescription);

        // Check if taskDescription is defined
        if (taskDescription !== undefined) {
            const newTask = { title: taskTitle, description: taskDescription, completed: false };

            // Make POST request to the backend API
            const response = await axios.post(`http://127.0.0.1:8000/tasks/`, newTask, {
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                    'Authorization': `Bearer ${userId}` // Add authorization header with user ID
                }
            });

            // Extract added task from the response data
            const addedTask = response.data.task;

            // Update tasks state with the added task
            setTasks([...tasks, addedTask]);
        } else {
            console.error('Task description is undefined');
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
  }


  async function deleteTaskById(taskId) {
    try {
      console.log("Deleting task with ID:", taskId);
      await deleteTodo(taskId); // Pass the taskId to the API
      const newTasks = tasks.filter(task => task.id !== taskId); // Filter out deleted task
      setTasks(newTasks); // Update tasks state
      // Clear editing state if the deleted task was being edited
      if (editingTaskId === taskId) {
        setEditingTaskId(null);
        setEditedTaskTitle('');
      }
      console.log("Task deleted successfully");
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  async function toggleTaskCompletedById(taskId) {
    try {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        setTasks(updatedTasks); // Update UI optimistically
        // Update task using the API
        await updateTodo(taskId, { completed: updatedTasks.find(task => task.id === taskId).completed });
    } catch (error) {
        console.error('Error toggling task completion:', error);
        // Revert UI changes in case of error
        const revertedTasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        setTasks(revertedTasks);
    }
  }

  async function startEditingTask(taskId, taskTitle) {
    setEditingTaskId(taskId);
    setEditedTaskTitle(taskTitle);
  }

  function cancelEditingTask() {
    setEditingTaskId(null);
    setEditedTaskTitle('');
  }

  async function updateTask(taskId, newTitle, newDescription, newData) {
      try {
        console.log('Updating task with ID:', taskId);
        const updatedTask = { title: newTitle, description: newDescription, ...newData }; // Include newData
        await updateTodo(taskId, updatedTask); // Pass taskId and updatedTask to the API
        console.log('Task updated successfully');
        const updatedTasks = tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, title: newTitle, description: newDescription, ...newData }; // Include newData
          }
          return task;
        });
        setTasks(updatedTasks); // Update UI optimistically
        setEditingTaskId(null); // Clear editing state after updating task
        // Clear edited task title and description only if they were successfully updated
        if (!newTitle && !newDescription) {
          setEditedTaskTitle('');
          setEditedTaskDescription('');
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
  }

  return (
    <>
      <Header handleAddTask={addTask} />
      <Tasks
        tasks={tasks}
        onDelete={deleteTaskById}
        onComplete={toggleTaskCompletedById}
        onEdit={updateTask}
        editingTaskId={editingTaskId}
        editedTaskTitle={editedTaskTitle}
        editedTaskDescription={editedTaskDescription}
        setEditedTaskTitle={setEditedTaskTitle}
        setEditedTaskDescription={setEditedTaskDescription}
        onCancelEdit={cancelEditingTask}
      />
      {/* Container for logged in user info */}
      <div className="bg-transparent text-[#ffa0ad] p-4 text-center mt-8 fixed bottom-0 w-full" style={{ fontSize: '12px' }}>
        Logged in as: {isGoogleUser ? currentUser.displayName : (isEmailUser ? currentUser.email : currentUser.email)}
      </div>
    </>
  );
}

export default Homepage;
