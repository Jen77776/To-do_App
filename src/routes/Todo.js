import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Todo() {
  const { id } = useParams(); // 从 URL 中获取待办事项 ID
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null); // 待办事项的状态
  const [editDescription, setEditDescription] = useState(''); // 新增状态来保存编辑中的描述

  useEffect(() => {
    // 从后端获取待办事项的详细信息
    fetch(`/api/todo/${id}`)
      .then(response => response.json())
      .then(data => {
        setTodo(data.todo); // 设置待办事项的数据
        setEditDescription(data.todo.description); // 初始加载时也设置编辑中的描述
      })
      .catch(error => console.error('Error fetching todo:', error));
  }, [id]);

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

  return (
    <div>
      <h1>Todo Details</h1>
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
    </div>
  );
}

export default Todo;
