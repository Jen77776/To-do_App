import React from 'react';
import { Link } from 'react-router-dom';

function Done() {
  // 假设已完成的待办事项
  const doneTodos = [
    { id: 2, text: "Build a Todo App", done: true },
  ];

  return (
    <div>
      <h2>Done Items</h2>
      <ul>
        {doneTodos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      <Link to="/todos">Back to Todos</Link>
    </div>
  );
}

export default Done;
