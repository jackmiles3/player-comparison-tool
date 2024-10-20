import React, { useEffect, useState } from 'react';

function App() {
  const [team, setTeam] = useState('');
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/players')
      .then((response) => response.json())
      .then((data) => {
        setTeam(data.team);
        setPlayers(data.players);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <h1>{team}</h1>
      <ul>
        {players.length > 0 ? (
          players.map((player: any, index: number) => (
            <li key={index}>{player.name}</li>
          ))
        ) : (
          <p>No players available.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
