import React, { useState, useEffect } from 'react';
import TodoItem from '../common/TodoItem'; // 根据实际位置调整
import { useParams, useNavigate, Link } from 'react-router-dom';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTodoContent, setNewTodoContent] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const navigate = useNavigate();
  const { category } = useParams();
  //用于检查用户是否登录的函数
  const checkLoggedIn = async () => {
    try {
      // 向/.auth/me发送请求以获取当前用户的登录状态
      const response = await fetch('/.auth/me');
      const data = await response.json();
  
      // 检查返回的数据中是否有用户信息
      if (!data.clientPrincipal) {
        // 如果没有用户信息，则视为未登录，重定向到根路径'/'
        console.log(11111);
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

  async function addTodo() {
    // 创建新待办事项逻辑...
    const newTodo = {
      title: newTodoContent, // Assuming you only have a title, no description
      description: "", // You can add an input for users to enter a description, or leave it empty
      completed: false, // New todos are not completed by default
      category: ""
    };
    
    const result = await fetch("/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo)
    });

    if (result.ok) {
      const addedTodo = await result.json();
      // Update the state to include the new todo item
      setTodos([...todos, addedTodo]);
      // Clear the input after adding the todo
      setNewTodoContent("");
    }
  }

  async function addCategory() {
    // 检查类别名称是否为空
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }
  
    const response = await fetch('/api/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryName: newCategoryName.trim() }),
    });
  
    if (response.ok) {
      const addedCategory = await response.json();
      setCategories([...categories, addedCategory.name]); // 这里你可能需要调整以匹配你的数据结构
      setNewCategoryName('');
    } else {
      const error = await response.json();
      alert(error.error || "Failed to add category.");
    }
  }
  

  async function deleteCategory(categoryName) {
    const response = await fetch(`/api/category/${categoryName}`, { method: 'DELETE' });
    if (response.ok) {
      setCategories(categories.filter(name => name !== categoryName));
    } else {
      alert("Failed to delete category.");
    }
  }
  // 定义handleLogout函数
  const handleLogout = () => {
    const logoutUrl = `${window.location.origin}/.auth/logout`;
    window.location.href = logoutUrl;
  };
  
  return (
    <div>
      <Link to="/">Go Home</Link> | <Link to="/done">Completed Todos</Link>
      <button onClick={handleLogout}>Log Out</button>

      <h1>Todo List {category ? `for ${category}` : ''}</h1>
      {todos.filter(todo => !todo.completed && (!category || todo.category === category)).map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
      <div>
        <input value={newTodoContent} onChange={(e) => setNewTodoContent(e.target.value)} placeholder="Enter new todo" />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <h2>Categories</h2>
{categories.map((categoryName, index) => {
  // 如果类别名称为空，跳过渲染
  if (!categoryName) {
    console.log(`Skipping category at index ${index} because it has no name.`);
    return null;
  }

  return (
    <React.Fragment key={index}>
      <Link to={`/todos/${categoryName}`} style={{ marginRight: 10 }}>
        {categoryName}
      </Link>
      <button onClick={() => deleteCategory(categoryName)}>Delete</button>
    </React.Fragment>
  );
})}

      <div>
        <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New category name" />
        <button onClick={addCategory}>Add Category</button>
      </div>
    </div>
  );
}

export default TodoList;
