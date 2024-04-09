import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Todo() {
  const { id } = useParams(); // 从 URL 中获取待办事项 ID
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null); // 待办事项的状态
  const [editDescription, setEditDescription] = useState(''); // 新增状态来保存编辑中的描述
  const [categories, setCategories] = useState([]); // 添加用于存储类别的状态
  const [selectedCategory, setSelectedCategory] = useState(''); // 当前选中的类别
  //用于检查用户是否登录的函数
  const checkLoggedIn = async () => {
    try {
      // 向/.auth/me发送请求以获取当前用户的登录状态
      const response = await fetch('/.auth/me');
      const data = await response.json();
  
      // 检查返回的数据中是否有用户信息
      if (!data.clientPrincipal) {
        // 如果没有用户信息，则视为未登录，重定向到根路径'/'
        navigate('/');
      }
      // 如果有用户信息，则视为已登录，无需操作
    } catch (error) {
      // 如果请求失败，可以根据实际情况处理错误，例如显示错误信息或重定向
      console.error("Failed to check login status:", error);
      navigate('/');
    }
  };
  useEffect(() => {
    // 从后端获取待办事项的详细信息
    checkLoggedIn();
    fetch(`/api/todo/${id}`)
      .then(response => response.json())
      .then(data => {
        setTodo(data.todo); // 设置待办事项的数据
        setEditDescription(data.todo.description); // 初始加载时也设置编辑中的描述
      })
      .catch(error => console.error('Error fetching todo:', error));
      fetch('/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data.categories))
      .catch(error => console.error('Error fetching categories:', error));
  }, [id]);
// 更新待办事项类别的函数
const updateCategory = () => {
  fetch(`/api/todo/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...todo, category: selectedCategory }),
  })
  .then(response => response.json())
  .then(() => {
    const updatedTodo = { ...todo, category: selectedCategory };
    setTodo(updatedTodo);
    alert('Category updated!');
  })
  .catch(error => console.error('Error updating category:', error));
};

// 在待办事项数据加载后，初始化selectedCategory
useEffect(() => {
  if (todo) {
    setSelectedCategory(todo.category);
  }
}, [todo]);
  // 更新待办事项为已完成的状态
  const markAsDone = () => {
    fetch(`/api/todo/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...todo, completed: true }),
    })
    .then(() => {
      alert('Todo marked as done!');
      navigate('/todos'); // 标记为完成后跳转回待办事项列表页面
    })
    .catch(error => console.error('Error marking todo as done:', error));
  };
 // 新增更新描述的函数
 const updateDescription = () => {
  fetch(`/api/todo/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...todo, description: editDescription }),
  })
  .then(response => response.json())
  .then(() => {
    // 如果后端不返回更新后的待办事项
    const updatedTodo = { ...todo, description: editDescription };
    setTodo(updatedTodo);
    alert('Description updated!');
  })
  .catch(error => console.error('Error updating description:', error));
};

  if (!todo) return <div>Loading...</div>; // 在待办事项数据加载中显示加载状态
    // 定义handleLogout函数
    const handleLogout = () => {
      const logoutUrl = `${window.location.origin}/.auth/logout`;
      window.location.href = logoutUrl;
    };

  return (
    <div>
      <h1>Todo Details</h1>
      <button onClick={handleLogout}>Log Out</button>
      {/* 显示待办事项的标题和内容，如果内容过长则使用 CSS 来限制显示为一行 */}
      <h2>{todo.title}</h2>
      <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {todo.description}
      </p>
      <div>
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          rows="4"
          cols="50"
        ></textarea>
      </div>
      <button onClick={updateDescription}>Save Description</button>
      <button onClick={markAsDone}>{todo.completed ? 'Already Done' : 'Mark as Done'}</button>
      <button onClick={() => navigate('/todos')}>Back to Todos</button>
           {/* 类别选择器 */}
           <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button onClick={updateCategory}>Save Category</button>
    </div>
  );
}

export default Todo;
