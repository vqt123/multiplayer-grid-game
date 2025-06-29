let canvas = null;
let ctx = null;

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    
    // Initial grid render
    renderGrid();
});

function renderGame() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw grid
    renderGrid();
    
    // Draw players
    renderPlayers();
}

function renderGrid() {
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
        ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
        ctx.stroke();
    }
}

function renderPlayers() {
    const currentPlayers = (typeof global !== 'undefined' && global.clientState) ? global.clientState.players : players;
    const currentMyPlayerId = (typeof global !== 'undefined' && global.clientState) ? global.clientState.myPlayerId : myPlayerId;
    
    currentPlayers.forEach((player, playerId) => {
        const isMe = playerId === currentMyPlayerId;
        
        // Draw player circle
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.arc(
            player.x * CELL_SIZE + CELL_SIZE / 2,
            player.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 3,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw border for current player
        if (isMe) {
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        
        // Draw player name
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(
            player.name,
            player.x * CELL_SIZE + CELL_SIZE / 2,
            player.y * CELL_SIZE + CELL_SIZE + 2
        );
    });
}

// Export for testing
if (typeof global !== 'undefined') {
    global.renderGame = renderGame;
    global.renderGrid = renderGrid;
    global.renderPlayers = renderPlayers;
}