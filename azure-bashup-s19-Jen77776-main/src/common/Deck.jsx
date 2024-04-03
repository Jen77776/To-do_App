import { Link } from "react-router-dom";

export default function Deck({deck}) {
    return <div>
        <Link to={"/deck/"+deck._id}>{deck.name}</Link>
        </div>
}