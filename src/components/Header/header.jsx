// Header.jsx

import Logo from '../../assets/logo.png';
import styles from '../../styles/header.module.css';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useState } from 'react';

export function Header({ handleAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (title.trim() !== '') {
      handleAddTask(title, description); // Pass description here
      setTitle('');
      setDescription('');
    }
  };

  const onChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const onChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  return (
    <header className={styles.header}>
      <img src={Logo} alt="Logo" />

      <form onSubmit={handleSubmit} className={styles.newTaskForm}>
        <input
          placeholder="Add a new task"
          type="text"
          onChange={onChangeTitle}
          value={title}
        />
        <input
          placeholder="Add description"
          type="text"
          onChange={onChangeDescription}
          value={description}
        />
        <button type="submit"><AiOutlinePlusCircle size={20} /></button>
      </form>
    </header>
  );
}
