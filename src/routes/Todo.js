import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Todo() {
  let { id } = useParams();
  let navigate = useNavigate();
  const [todo, setTodo] = useState({ title: '', done: false });
  const [editTitle, setEditTitle] = useState(''); // 用于编辑待办事项文本

  useEffect(() => {
    // 获取特定待办事项的详情
    fetch(`/api/todos/${id}`)
      .then(response => response.json())
      .then(data => {
        setTodo(data);
        setEditTitle(data.title); // 初始化编辑文本为当前待办事项的标题
      })
      .catch(error => console.error('Error fetching todo:', error));
  }, [id]); // 当id变化时调用

  const handleSave = () => {
    // 调用后端API更新待办事项的文本
    fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...todo, title: editTitle }),
    })
    .then(response => response.json())
    .then(data => {
      setTodo(data); // 更新待办事项
      alert('Todo updated successfully!');
    })
    .catch(error => console.error('Error updating todo:', error));
  };

  const markDone = () => {
    // 调用后端API更新待办事项的完成状态
    fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...todo, done: true }),
    })
    .then(() => {
      alert('Todo marked as done!');
      navigate('/todos'); // 标记完成后跳转回待办事项列表
    })
    .catch(error => console.error('Error marking todo as done:', error));
  };

  return (
    <div>
      <h2>Todo Details (ID: {id})</h2>
      <textarea value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
      <button onClick={handleSave}>Save</button>
      <button onClick={markDone}>Mark as Done</button>
      <button onClick={() => navigate('/todos')}>Back to Todos</button>
    </div>
  );
}

export default Todo;
