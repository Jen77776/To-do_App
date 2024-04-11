import React, { useState, useEffect } from 'react';
import TodoItem from '../common/TodoItem'; // Adjust based on actual location
import { useParams, Link } from 'react-router-dom';
import 'bulma/css/bulma.min.css';

function Category() {
  const { category } = useParams();
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTodoContent, setNewTodoContent] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/todo");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const filteredTodos = result.data.filter(todo => todo.category === category && !todo.completed);
        setTodos(filteredTodos);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [category]); // 依赖数组中包含category，确保当category变化时重新获取数据

  async function addTodo() {
    const newTodo = {
      title: newTodoContent,
      description: "", // 如果需要，可以添加一个输入框让用户输入描述
      completed: false,
      category: category // 确保新添加的待办事项被分配到当前类别
    };

    try {
      const response = await fetch("/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo)
      });

      if (response.ok) {
        const addedTodo = await response.json();
        setTodos(todos => [...todos, addedTodo]); // 将新待办事项添加到状态中
        setNewTodoContent(""); // 清空输入框
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const getTodoById = (todoId) => {
    return todos.find(todo => todo._id === todoId);
  };
  
  const completeTodo = async (todoId) => {
    const todoToUpdate = getTodoById(todoId);
    if (!todoToUpdate) {
      alert("Todo not found!");
      return;
    }
  
    const updatedTodo = { ...todoToUpdate, completed: true };
    const response = await fetch(`/api/todo/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo)
    });
  
    if (response.ok) {
      setTodos(currentTodos => {
        const updatedTodos = currentTodos.map(todo =>
          todo._id === todoId ? { ...todo, completed: true } : todo
        );
        console.log(updatedTodos); // 打印查看是否正确更新
        return updatedTodos;
      });
    } else {
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
          <nav className="level">
            <div className="level-left">
              <Link className="button is-info is-light" to="/">Go Home</Link>
              <Link className="button is-info is-light" to="/todos">All Todos</Link>
            </div>
          </nav>
          <h1 className="title">Category: {category}</h1>
          <div>
        {
          todos
            .filter(todo => !todo.completed && todo.category === category)
            .map(todo => (
              <TodoItem 
                key={todo._id} 
                todo={todo}             
                onComplete={completeTodo}
                onDelete={deleteTodo}
              />
            ))
        }
      </div>
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                className="input is-info"
                type="text"
                value={newTodoContent}
                onChange={(e) => setNewTodoContent(e.target.value)}
                placeholder="Enter new todo"
              />
            </div>
            <div className="control">
              <button className="button is-success" onClick={addTodo}>Add Todo</button>
            </div>
          </div>
        </div>
      </section>
    );
}

export default Category;
