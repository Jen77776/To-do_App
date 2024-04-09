// Import React, TodoItem component, useState and useLoaderData hooks, and Link component from 'react-router-dom'
import React from 'react';
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
    return await result.json();
  } else {
    throw new Response("ERROR", { status: result.status });
  }
}

function Done() {
  const { data } = useLoaderData();
  const [todos, setTodos] = useState(data);

  return (
    <div>
      <Link to="/">Go Home</Link> | <Link to="/todos">All Todos</Link> {/* 添加一个链接回到所有待办事项的页面 */}
      <h1>Completed Todos</h1>
      {/* 过滤并映射已完成的待办事项，展示它们 */}
      {todos.filter(todo => todo.completed).map((todo) => (
        <div style={{ textDecoration: 'line-through', opacity: 0.6 }}> {/* 添加视觉指示以表明这些待办事项已完成 */}
          <TodoItem key={todo.id} todo={todo} />
        </div>
      ))}
      {/* 移除创建新待办事项的界面 */}
    </div>
  );
}

export default Done;
