import { Link, useParams } from "react-router-dom"

export const hiRoute = {
    path: "/hi/:id",
    element: <Hi/>,
}

export function Hi() {

    let { id } = useParams();



    return <div>Hi yall! 
        if: {id}

        <Link to="/">go home</Link>


    </div>
}