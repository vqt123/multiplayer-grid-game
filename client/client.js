// Create a state object that can be accessed and modified
const clientState = {
    ws: null,
    players: new Map(),
    myPlayerId: null,
    connected: false
};

// For backward compatibility
let ws = clientState.ws;
let players = clientState.players;
let myPlayerId = clientState.myPlayerId;
let connected = clientState.connected;

function joinGame() {
    const nameInput = document.getElementById('playerName');
    const playerName = nameInput.value.trim() || 'Anonymous';
    
    if (clientState.connected) {
        updateStatus('Already connected!', 'error');
        return;
    }
    
    connectToServer(playerName);
}

function connectToServer(playerName) {
    updateStatus('Connecting...', '');
    
    clientState.ws = new WebSocket(`ws://localhost:${SERVER_PORT}`);
    ws = clientState.ws;
    if (typeof window !== 'undefined') window.ws = clientState.ws;
    
    clientState.ws.onopen = () => {
        clientState.connected = true;
        connected = true;
        updateStatus('Connected! Joining game...', 'connected');
        
        clientState.ws.send(JSON.stringify({
            type: MESSAGES.JOIN,
            name: playerName
        }));
        
        document.getElementById('joinForm').style.display = 'none';
        document.getElementById('gameCanvas').style.display = 'block';
        document.getElementById('instructions').style.display = 'block';
        
        setupKeyboardControls();
    };
    
    clientState.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleServerMessage(message);
    };
    
    clientState.ws.onclose = () => {
        clientState.connected = false;
        connected = false;
        updateStatus('Disconnected from server', 'error');
        document.getElementById('joinForm').style.display = 'block';
        document.getElementById('gameCanvas').style.display = 'none';
        document.getElementById('instructions').style.display = 'none';
        clientState.players.clear();
        clientState.myPlayerId = null;
        myPlayerId = null;
    };
    
    clientState.ws.onerror = (error) => {
        updateStatus('Connection error', 'error');
        console.error('WebSocket error:', error);
    };
}

function handleServerMessage(message) {
    switch (message.type) {
        case MESSAGES.GAME_STATE:
            initializeGame(message);
            break;
        case MESSAGES.PLAYER_JOINED:
            addPlayer(message.player);
            break;
        case MESSAGES.PLAYER_MOVED:
            movePlayer(message.playerId, message.x, message.y);
            break;
        case MESSAGES.PLAYER_LEFT:
            removePlayer(message.playerId);
            break;
    }
}

function initializeGame(message) {
    clientState.players.clear();
    
    message.players.forEach(player => {
        clientState.players.set(player.id, player);
        if (player.name === document.getElementById('playerName').value.trim() || 
            (player.name === 'Anonymous' && !document.getElementById('playerName').value.trim())) {
            if (!clientState.myPlayerId) {
                clientState.myPlayerId = player.id;
                myPlayerId = player.id;
            }
        }
    });
    
    updateStatus(`Connected as ${clientState.players.get(clientState.myPlayerId)?.name || 'Unknown'}`, 'connected');
    renderGame();
}

function addPlayer(player) {
    clientState.players.set(player.id, player);
    
    if (!clientState.myPlayerId && (player.name === document.getElementById('playerName').value.trim() || 
        (player.name === 'Anonymous' && !document.getElementById('playerName').value.trim()))) {
        clientState.myPlayerId = player.id;
        myPlayerId = player.id;
        updateStatus(`Connected as ${player.name}`, 'connected');
    }
    
    renderGame();
}

function movePlayer(playerId, x, y) {
    const player = clientState.players.get(playerId);
    if (player) {
        player.x = x;
        player.y = y;
        renderGame();
    }
}

function removePlayer(playerId) {
    clientState.players.delete(playerId);
    renderGame();
}

function setupKeyboardControls() {
    document.addEventListener('keydown', (event) => {
        if (!clientState.connected || !clientState.ws || !clientState.myPlayerId) return;
        
        let direction = null;
        
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
        
        if (direction) {
            event.preventDefault();
            clientState.ws.send(JSON.stringify({
                type: MESSAGES.MOVE,
                direction: direction
            }));
        }
    });
}

function updateStatus(message, className) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = className;
}

// Allow joining with Enter key
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('playerName').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            joinGame();
        }
    });
});

// Export for testing
if (typeof global !== 'undefined') {
    global.joinGame = joinGame;
    global.connectToServer = connectToServer;
    global.handleServerMessage = handleServerMessage;
    global.clientState = clientState;
    
    // Reset function for tests
    global.resetClientState = () => {
        clientState.ws = null;
        clientState.connected = false;
        clientState.players.clear();
        clientState.myPlayerId = null;
        ws = null;
        connected = false;
        myPlayerId = null;
        if (typeof window !== 'undefined') window.ws = null;
    };
    
    // Update global references
    global.updateGlobalRefs = () => {
        players = clientState.players;
        ws = clientState.ws;
        connected = clientState.connected;
        myPlayerId = clientState.myPlayerId;
    };
}