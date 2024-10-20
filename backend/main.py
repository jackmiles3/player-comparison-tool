import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("API_KEY")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Player Comparison API!"}

@app.get("/players")
def get_players():
    url = "https://api.football-data.org/v4/competitions/PL/teams"
    headers = {"X-Auth-Token": API_KEY}
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        teams = data.get("teams", [])
        
        players = []
        all_teams = set()
        all_positions = set()

        # Extract players, teams, and positions from all teams
        for team in teams:
            team_name = team.get("name")
            all_teams.add(team_name)
            for player in team.get("squad", []):
                players.append({
                    "name": player.get("name"), 
                    "position": player.get("position"),
                    "team": team_name
                })
                all_positions.add(player.get("position"))

        return {
            "players": players,
            "teams": sorted(list(all_teams)),
            "positions": sorted(list(all_positions))
        }
    else:
        return {"error": "Failed to fetch data"}
