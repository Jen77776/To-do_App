// Import React, TodoItem component, useState and useLoaderData hooks, and Link component from 'react-router-dom'
import React from 'react';
import TodoItem from '../common/TodoItem'; // Adjust based on actual location
import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import 'bulma/css/bulma.min.css';


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
  const [userId, setUserId] = useState(null);  // 新增 userId 状态
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
      try {
        const response = await fetch('/.auth/me');
        const data = await response.json();
  
        if (!data.clientPrincipal) {
          console.log(11111);
          navigate('/');
          return; // 如果未登录，直接返回
        }
  
        setUserId(data.clientPrincipal.userId);
        console.log("this is Userid:", data.clientPrincipal.userId);
        const todosResp = await fetch("/api/todo");
        const todosData = await todosResp.json();
        setTodos(todosData.data || []);
        const userTodos = todosData.data.filter(todo => todo.userId === data.clientPrincipal.userId);
        const reversedTodos = userTodos.reverse();
        setTodos(reversedTodos);

        const categoriesResp = await fetch("/api/categories");
        const categoriesData = await categoriesResp.json();
        console.log("获取的类别数据:", categoriesData); // 打印原始类别数据
        setCategories(categoriesData.categories || []);
  
      } catch (error) {
        console.error("Failed to check login status:", error);
        navigate('/');
      }
    }
    fetchData();
  }, [navigate]);
    // 定义handleLogout函数
    const handleLogout = () => {
      const logoutUrl = `${window.location.origin}/.auth/logout`;
      window.location.href = logoutUrl;
    };
      // 获取特定ID的待办事项的完整数据
const getTodoById = (todoId) => {
  return todos.find(todo => todo._id === todoId);
};

const completeTodo = async (todoId) => {
  const todoToUpdate = getTodoById(todoId);

  // 确保找到了待办事项
  if (!todoToUpdate) {
    alert("Todo not found!");
    return;
  }

  // 更新待办事项的完成状态
  const updatedTodo = { ...todoToUpdate, completed: true };

  const response = await fetch(`/api/todo/${todoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTodo) // 发送更新后的待办事项
  });

  if (response.ok) {
    // 如果成功，更新前端的状态
    setTodos(todos.map(todo => todo._id === todoId ? updatedTodo : todo));
    alert("Todo marked as completed!");
  } else {
    // 错误处理
    alert("Failed to complete the todo.");
  }
};
const deleteTodo = async (todoId) => {
  const response = await fetch(`/api/todo/${todoId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    // 从状态中移除已删除的待办事项
    setTodos(todos.filter(todo => todo._id !== todoId));
  } else {
    // 错误处理，比如显示错误消息
    alert("Failed to delete the todo.");
  }
};
    

  return (
    <section className="section">
      <div className="container">
        <div className="buttons">
          <Link className="button is-info is-light" to="/">Go Home</Link>
          <Link className="button is-info is-light" to="/todos">All Todos</Link>
          <button className="button is-danger is-light" onClick={handleLogout}>Log Out</button>
        </div>

        <h1 className="title">Completed Todos</h1>
        <div className="box">
        {todos.filter(todo => todo.completed).map((todo) => (
    <div className="notification is-primary is-light">
      {todo.completed && <span className="tag is-success">Completed</span>}
      <TodoItem
        key={todo.id}
        todo={todo}
        onComplete={completeTodo}
        onDelete={deleteTodo}
      />
    </div>
  ))}
        </div>
      </div>
    </section>
  );
}

export default Done;
