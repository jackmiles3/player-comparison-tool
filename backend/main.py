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
        
        if teams:
            team = teams[0]
            team_name = team.get("name")
            players = team.get("squad", [])
            return {"team": team_name, "players": players}
        else:
            return {"error": "No teams found"}
    else:
        return {"error": "Failed to fetch data"}
