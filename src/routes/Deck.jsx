import Card from '../common/Card'
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

async function loader({ request, params }) {
  const { id } = params;
  const result = await fetch("/api/deck/"+id, {
    signal: request.signal,
    method: "get",
  });
  if (result.ok) {
    return await result.json()
  } else {
    // this is just going to trigger the 404 page, but we can fix that later :|
    throw new Response("ERROR", { status: result.status });
  }
}

function Deck() {
  const { deck } = useLoaderData();
  // we will be updating the deck as we go...
  const [theDeck, updateTheDeck] = useState(deck);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");

  async function addCard() {
    const newCard = {front:newFront, back: newBack}
    setNewFront("")
    setNewBack("")
    const newDeck = {...theDeck}
    newDeck.cards.push(newCard)
    updateTheDeck(theDeck)
    fetch("/api/deck/"+deck._id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newDeck)
    })
  }

  return (
      <div>
        {theDeck.cards.map(card => <Card front={card.front}>{card.back}</Card>)}
        <input value={newFront} placeholder="front" onChange={e=>setNewFront(e.target.value)}></input>
        <input value={newBack} placeholder="back" onChange={e=>setNewBack(e.target.value)}></input>
        <button onClick={addCard}>add</button>
      </div>
  );
}

export const Deck_route = {
  path:"/deck/:id",
  element:<Deck></Deck>,
  loader:loader
}