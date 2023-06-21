import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';

type TodoState = {
  id: number,
  description: string,
  completed: boolean
}

function App() {
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState<{[index: number]: TodoState}>({});
  
  const [darkMode, setDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Set app to dark mode
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode])

  // Get todos from local storage on mount
  const todosKey = "todos"
  useEffect(() => {
    const todosJson = window.localStorage.getItem(todosKey);
    if (todosJson !== null) {
      console.log("read")
      const todos = JSON.parse(todosJson);
      
      let highestCount = 0;
      Object.keys(todos).forEach(key => highestCount = +key > highestCount ? +key : highestCount)
      setCount(highestCount)

      setTodos(todos);
    }

    setReady(true);
  }, []);

  // Set todos from local storage
  useEffect(() => {
    if (ready) {
      window.localStorage.setItem(todosKey, JSON.stringify(todos))
    }
  }, [todos, ready]);

  const onNewTodo = (description: string) => {
    setTodos({ ...todos, [count]: {id: count, description, completed: false} });
    setCount(count + 1);
  };

  const onDelete = (id: number) => {
    delete todos[id];
    setTodos({ ...todos });
  };

  const onComplete = (id: number) => {
    todos[id].completed = !todos[id].completed;
    setTodos({ ...todos });
  };

  return (
    <main>
      <h1>Todo App</h1>
      <AddTodo onNewTodo={onNewTodo}/>

      <ul className="todo-list">
        {Object.entries(todos).map(([_, {id, description, completed}]) => {
          return <Todo 
            key={id}
            description={description}
            id={id}
            completed={completed}
            onDelete={onDelete}
            onComplete={onComplete}
          />
        })}
      </ul>
    </main>
  );
}

type AddTodoProps = {
  onNewTodo: (string) => void
}

function AddTodo({onNewTodo}: AddTodoProps) {
  // Focus the add todo at component mount
  useEffect(() => {
    document.querySelector<HTMLElement>(".add-todo-text-entry")!.focus();
  }, []);

  const [description, setDescription] = useState("");
  
  const addTodo = () => {
    if (description !== "") {
      onNewTodo(description); 
      setDescription("");
    } 
  };

  return (
    <div className="add-todo">
      <input 
        className="add-todo-text-entry"
        type="text" 
        onChange={e => setDescription(e.target.value)} 
        value={description} 
        onKeyDown={e => {
          if (e.key === "Enter") {
            addTodo();
          }
        }}
      />
      <button onClick={addTodo}>+</button>
    </div>
  );
}

type TodoProps = {
  description: string,
  id: number,
  completed: boolean,
  onDelete: (number) => void
  onComplete: (number) => void
}

function Todo({description, id, completed, onDelete, onComplete}: TodoProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true) }, []); // fade-in effect

  const descriptionClassName = completed ? "todo-text completed" : "todo-text"

  const deleteButtonOnClick = () => {
    // fade out effect
    // setVisible(false); 
    // setTimeout(() => onDelete(id), 250);
    onDelete(id);
  }

  return (
    <li key={id} className={visible ? "visible" : ""}>
      <span className={descriptionClassName}>{description}</span>
      <button onClick={() => onComplete(id)} className="todo-complete">✓</button>
      <button onClick={deleteButtonOnClick} className="todo-delete">×</button>
    </li>
  );
}

export default App;
