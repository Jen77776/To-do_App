import classes from './Card.module.css';

import { useState } from "react";

export default function Card({front, children, onFlip}) {
    const [isFront, setIsFront] = useState(true);
    
    function flip() {
        if (onFlip) {
            onFlip();
        }
        setIsFront(!isFront)
    }

    return <div onClick={flip}>
        {isFront ?
          <div class={classes.cardFront}>{front}</div>
        :  
        <div class={classes.cardBack}>{children}</div>
        }
    </div>
}