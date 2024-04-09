import { Link } from "react-router-dom";

export default function TodoItem({ todo }) {
    return (
        <div>
            {/* Assuming each todo item has an 'id' and 'content' property */}
            <Link to={"/todo/"+todo._id}>{todo.title}</Link>
            {/* Add additional todo details or controls here if necessary */}
        </div>
    );
}