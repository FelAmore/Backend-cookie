import React, { useState } from 'react';
import styles from '../../styles/global.module.css';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { TiEdit } from 'react-icons/ti';
import { TbTrash } from 'react-icons/tb';

export function Task({
  task,
  onDelete,
  onComplete,
  onEdit,
  editingTaskId, // Receive editingTaskId prop
  editedTaskTitle, // Receive editedTaskTitle prop
  editedTaskDescription, // Receive editedTaskDescription prop
  setEditedTaskTitle, // Receive setEditedTaskTitle prop
  setEditedTaskDescription, // Receive setEditedTaskDescription prop
}) {
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle editing task title
  const handleTitleInputChange = (e) => {
    setEditedTaskTitle(e.target.value);
  };

  // Function to handle editing task description
  const handleDescriptionInputChange = (e) => {
    setEditedTaskDescription(e.target.value);
  };

  // Function to save edited task
  const handleSave = () => {
    onEdit(task.id, editedTaskTitle, editedTaskDescription);
    setIsEditing(false);
  };

  console.log('Task:', task); // Log task object
  console.log('Editing Task ID:', editingTaskId); // Log editingTaskId

  return (
    <div className={styles.task}>
      {/* Render checkbox with check icon if task is completed */}
      <button className={styles.checkContainer} onClick={() => onComplete(task.id)}>
          {task.isCompleted ? <BsFillCheckCircleFill /> : <div />}
      </button>


      {/* Render task details or edit form based on editing state */}
      {isEditing ? (
        <div className={styles.modal}>
          <input
            type="text"
            value={editedTaskTitle}
            onChange={handleTitleInputChange}
            autoFocus
          />
          <textarea
            value={editedTaskDescription}
            onChange={handleDescriptionInputChange}
            rows={3}
          />
          <div>
            <button className={styles.update} onClick={handleSave}>Update</button>
            <button className={styles.cancel} onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className={styles.taskDetails}>
          {/* Render task title with completion styling */}
          <p className={task.isCompleted ? styles.textCompleted : ""}>
            {task.title}
          </p>
          {/* Render task description if available */}
          {task.description && (
            <p className={styles.taskDescription}>
              {task.description}
            </p>
          )}
        </div>
      )}

      {/* Render task action buttons */}
      <div className={styles.taskButtons}>
        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
          <TiEdit size={20} />
        </button>

        <button className={styles.deleteButton} onClick={() => onDelete(task.id)}>
          <TbTrash size={20} />
        </button>
      </div>
    </div>
  );
}
