import { Link } from "react-router-dom";
import 'bulma/css/bulma.min.css';
export default function TodoItem({ todo, onComplete, onDelete  }) {
      // 事件处理器，调用从 TodoList 传递下来的函数
  const handleComplete = () => {
    onComplete(todo._id);
  };

  const handleDelete = () => {
    onDelete(todo._id);
  };
    return (
        <div className="card">
            <header className="card-header">
                <p className="card-header-title">
                    {/* 使用 Link 包装标题，以便可以点击进入详细页面 */}
                    <Link to={"/todo/" + todo._id} className="has-text-info">
                        {todo.title}
                    </Link>
                </p>
            </header>
            <div className="card-content">
                <div className="content">
                    {/* 这里可以展示待办事项的详细信息，如果有的话 */}
                    {todo.description ? todo.description : "No additional details provided."}
                </div>
            </div>
            <footer className="card-footer">
                <a href="#" className="card-footer-item has-text-success" onClick={handleComplete}>Complete</a>
                <a href="#" className="card-footer-item has-text-danger" onClick={handleDelete}>Delete</a>
            </footer>
        </div>
    );
}