import React, { useEffect, useState } from 'react';

function App() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer1, setSelectedPlayer1] = useState<string | null>(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState<string | null>(null);
  const [playerStats1, setPlayerStats1] = useState<any>(null);
  const [playerStats2, setPlayerStats2] = useState<any>(null);

  // Fetch the list of players, teams, and positions from the FastAPI backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/players')
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data.players);
        setTeams(data.teams);
        setPositions(data.positions);
        setFilteredPlayers(data.players);
      })
      .catch((error) => console.error('Error fetching players:', error));
  }, []);

  // Filter players based on the selected team and position
  useEffect(() => {
    let filtered = players;

    if (selectedTeam) {
      filtered = filtered.filter((player: any) => player.team === selectedTeam);
    }

    if (selectedPosition) {
      filtered = filtered.filter((player: any) => player.position === selectedPosition);
    }

    setFilteredPlayers(filtered);
  }, [selectedTeam, selectedPosition, players]);

  // Handle player selection
  const handlePlayer1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedPlayer1(selected);
    const player = players.find((p: any) => p.name === selected);
    setPlayerStats1(player);
  };

  const handlePlayer2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedPlayer2(selected);
    const player = players.find((p: any) => p.name === selected);
    setPlayerStats2(player);
  };

  // Helper function to show the selected player at the top of the dropdown
  const renderPlayerOptions = (selectedPlayer: string | null) => {
    const options = [...filteredPlayers];

    // Add the selected player at the top if they are not part of the filtered players
    if (selectedPlayer) {
      const selectedPlayerObj = players.find((p: any) => p.name === selectedPlayer);
      if (selectedPlayerObj && !filteredPlayers.some((p: any) => p.name === selectedPlayer)) {
        options.unshift(selectedPlayerObj); // Add selected player to the top
      }
    }

    return options;
  };

  return (
    <div className="App">
      <h1>Player Comparison</h1>

      {/* Team Filter Dropdown */}
      <label>Filter by Team: </label>
      <select value={selectedTeam || ""} onChange={(e) => setSelectedTeam(e.target.value)}>
        <option value="">All Teams</option>
        {teams.map((team: string, index: number) => (
          <option key={index} value={team}>
            {team}
          </option>
        ))}
      </select>

      {/* Position Filter Dropdown */}
      <label>Filter by Position: </label>
      <select value={selectedPosition || ""} onChange={(e) => setSelectedPosition(e.target.value)}>
        <option value="">All Positions</option>
        {positions.map((position: string, index: number) => (
          <option key={index} value={position}>
            {position}
          </option>
        ))}
      </select>

      {/* Player 1 Dropdown */}
      <label>Select Player 1: </label>
      <select value={selectedPlayer1 || ""} onChange={handlePlayer1Change}>
        <option value="">Select Player</option>
        {renderPlayerOptions(selectedPlayer1).map((player: any, index: number) => (
          <option key={index} value={player.name}>
            {player.name} - {player.team} ({player.position})
          </option>
        ))}
      </select>

      {/* Player 2 Dropdown */}
      <label>Select Player 2: </label>
      <select value={selectedPlayer2 || ""} onChange={handlePlayer2Change}>
        <option value="">Select Player</option>
        {renderPlayerOptions(selectedPlayer2).map((player: any, index: number) => (
          <option key={index} value={player.name}>
            {player.name} - {player.team} ({player.position})
          </option>
        ))}
      </select>

      {/* Display Player 1 Stats */}
      {playerStats1 && (
        <div>
          <h2>Player 1: {playerStats1.name}</h2>
          <p>Position: {playerStats1.position}</p>
          <p>Team: {playerStats1.team}</p>
        </div>
      )}

      {/* Display Player 2 Stats */}
      {playerStats2 && (
        <div>
          <h2>Player 2: {playerStats2.name}</h2>
          <p>Position: {playerStats2.position}</p>
          <p>Team: {playerStats2.team}</p>
        </div>
      )}
    </div>
  );
}

export default App;
