//import React, { useEffect } from 'react';
import TodoItem from '../common/TodoItem'; // Adjust based on actual location
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';

export async function loader({ request }) {
  const result = await fetch("/api/todo", {
    signal: request.signal,
    method: "get",
  });
  if (result.ok) {
    return await result.json()
  } else {
    // this is just going to trigger the 404 page, but we can fix that later :|
    throw new Response("ERROR", { status: result.status });
  }
}

function TodoList() {
  const { data } = useLoaderData();
  const [todos, setTodos] = useState(data);
  const [newTodoContent, setNewTodoContent] = useState("");

  // async function addTodo() {
  //   const newTodo = { content: newTodoContent, isDone: false };
    
  //   const result = await fetch("/api/todo", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(newTodo)
  //   });

  //   if (result.ok) {
  //     const addedTodo = await result.json();
  //     // Update the state to include the new todo item
  //     setTodos([...todos, addedTodo]);
  //     // Clear the input after adding the todo
  //     setNewTodoContent("");
  //   }
  // }
  
  return (
    <div>
      <Link to="/">Go Home</Link>
      <h1>Todo List</h1>
      {todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
      {/* <div>
        <input
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          placeholder="Enter new todo"
        />
        <button onClick={addTodo}>Add Todo</button>
      </div> */}
    </div>
  );
}

export default TodoList;
