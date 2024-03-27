import logo from '../logo.svg';
import Card from '../common/Card'
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import Deck from '../common/Deck';

async function loader({ request }) {
  const result = await fetch("/api/deck", {
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

function App() {
  const { data } = useLoaderData();
  const [decks, setDecks] = useState(data);
  const [name, setName] = useState("");

  async function newDeck() {
    const result = await fetch("/api/deck", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({name})
    })
    if (result.ok) {
      setDecks([...decks, await result.json()]);
      setName("");
    }
  }

  return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
            {decks.map(deck => <Deck key={deck._id} deck={deck}></Deck>)}
            <input value={name} placeholder="name" onChange={e=>setName(e.target.value)}></input>
            <button onClick={newDeck}>Add Deck</button>
        </div>
      </header>
  );
}

export const App_Page = {
  path:"/",
  element:<App></App>,
  loader:loader
}