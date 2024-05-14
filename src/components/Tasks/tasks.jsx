import React, { useState } from 'react';
import { Task } from '../Task/task';
import styles from '../../styles/global.module.css';

export function Tasks({
  tasks,
  onDelete,
  onComplete,
  onEdit,
  editingTaskId,
  editedTaskTitle,
  editedTaskDescription,
  setEditedTaskTitle,
  setEditedTaskDescription,
  onCancelEdit,
  onUpdate
}) {
  const [filter, setFilter] = useState('all'); // Default filter is set to 'all'

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') {
      return task.isCompleted;
    } else if (filter === 'active') {
      return !task.isCompleted;
    }
    return true; // Show all tasks for 'all' filter
  });

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  console.log('Tasks:', tasks); // Log tasks array
  console.log('Editing Task ID:', editingTaskId); // Log editingTaskId

  return (
    <section className={styles.tasks}>
      <header className={styles.header}>
        <div>
          <p>Created tasks</p>
          <span>{filteredTasks.length}</span> {/* Show the count of filtered tasks */}
        </div>
        <div className="filteredContainer">
          <select
            value={filter}
            onChange={handleFilterChange}
            style={{
              backgroundColor: '#509be1',
              color: '#f9f2ed',
              border: '1px solid #d3e9ff',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              padding: '4px 10px',
            }}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="active">Active</option>
          </select>
        </div>
      </header>

      <div className={styles.list}>
        {filteredTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDelete={onDelete}
            onComplete={onComplete}
            onEdit={onEdit}
            editingTaskId={editingTaskId}
            editedTaskTitle={editedTaskTitle}
            editedTaskDescription={editedTaskDescription} // Pass editedTaskDescription
            setEditedTaskTitle={setEditedTaskTitle}
            setEditedTaskDescription={setEditedTaskDescription}
            onCancelEdit={onCancelEdit}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </section>
  );
}
