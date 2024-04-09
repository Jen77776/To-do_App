// Import React, TodoItem component, useState and useLoaderData hooks, and Link component from 'react-router-dom'
import React from 'react';
import TodoItem from '../common/TodoItem'; // Adjust based on actual location
import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  //用于检查用户是否登录的函数
  const checkLoggedIn = async () => {
    try {
      // 向/.auth/me发送请求以获取当前用户的登录状态
      const response = await fetch('/.auth/me');
      const data = await response.json();
  
      // 检查返回的数据中是否有用户信息
      if (!data.clientPrincipal) {
        // 如果没有用户信息，则视为未登录，重定向到根路径'/'
        console(11111);
        navigate('/');
      }
      // 如果有用户信息，则视为已登录，无需操作
    } catch (error) {
      // 如果请求失败，可以根据实际情况处理错误，例如显示错误信息或重定向
      console.error("Failed to check login status:", error);
      navigate('/');
    }
  };
   // 在组件加载时获取待办事项和类别列表
   useEffect(() => {
    checkLoggedIn();
    async function fetchData() {
      const todosResp = await fetch("/api/todo");
      const todosData = await todosResp.json();
      setTodos(todosData.data || []);

      const categoriesResp = await fetch("/api/categories");
      const categoriesData = await categoriesResp.json();
      console.log("获取的类别数据:", categoriesData); // 打印原始类别数据
      setCategories(categoriesData.categories || []);
    }
    fetchData();
  }, []);
    // 定义handleLogout函数
    const handleLogout = () => {
      const logoutUrl = `${window.location.origin}/.auth/logout`;
      window.location.href = logoutUrl;
    };
    

  return (
    <div>
      <Link to="/">Go Home</Link> | <Link to="/todos">All Todos</Link> {/* 添加一个链接回到所有待办事项的页面 */}
      <button onClick={handleLogout}>Log Out</button>
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
