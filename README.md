
# GamblingWebsite

A full-stack multiplayer casino web app featuring games like Blackjack and TriCard. Built with React (frontend) and Flask-SocketIO (backend) for real-time gameplay.

## Features
- Real-time multiplayer Blackjack and TriCard
- WebSocket-based communication (Flask-SocketIO, socket.io-client)
- Player lobbies, room creation, and in-game chat
- Persistent player data (nickname, money, guild)
- Responsive UI with React and Bootstrap

## Tech Stack
- **Frontend:** React, socket.io-client, Bootstrap
- **Backend:** Python, Flask, Flask-SocketIO, eventlet
- **Other:** SQLAlchemy (optional), dotenv, CORS

## Setup

### Prerequisites
- Python 3.10+
- Node.js & npm


### Backend Setup
1. (Recommended) Create a Python virtual environment:
	 ```bash
	 cd server
	 python -m venv venv
	 ```
	 - **On macOS/Linux:**
		 ```bash
		 source venv/bin/activate
		 ```
	 - **On Windows (cmd):**
		 ```cmd
		 venv\Scripts\activate
		 ```
	 - **On Windows (PowerShell):**
		 ```powershell
		 .\venv\Scripts\Activate.ps1
		 ```
2. Install Python dependencies:
	 ```bash
	 pip install -r requirements.txt
	 ```
3. Run the backend server:
	 ```bash
	 python backend.py
	 ```

### Frontend Setup
1. Install Node dependencies:
	```bash
	npm install
	```
2. Start the React app:
	```bash
	npm start
	```

### Configuration
- The backend runs on `localhost:5000` by default.
- The frontend expects the backend at `localhost:5000` (see `src/GetBackend.js`).
- To change ports, update both backend and frontend configs.

## Project Structure
```
server/         # Python backend (Flask, SocketIO, game logic)
src/            # React frontend (components, styles, assets)
public/         # Static files for React
build/          # Production build output
```

## Key Files
- `server/backend.py` — Flask-SocketIO server
- `src/App.js` — Main React app
- `src/GetBackend.js` — Socket.io client setup
- `src/BlackJack.js`, `src/TriCard.js` — Game components

## Notes
- For production, use a proper WSGI server and secure CORS settings.
- Make sure your frontend and backend use compatible socket.io versions.

## License
MIT
