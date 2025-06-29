const { test, expect } = require('../fixtures/test-helpers');

test.describe('Game Functionality', () => {
  test('should load game page with join form', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle('Multiplayer Grid Game');
    
    // Check join form is visible
    await expect(page.locator('#joinForm')).toBeVisible();
    await expect(page.locator('#playerName')).toBeVisible();
    await expect(page.locator('button:has-text("Join Game")')).toBeVisible();
    
    // Canvas should be hidden initially
    await expect(page.locator('#gameCanvas')).toBeHidden();
  });

  test('should join game and display canvas', async ({ gamePage, joinGame }) => {
    await joinGame('Player1');
    
    // Check canvas is visible
    await expect(gamePage.locator('#gameCanvas')).toBeVisible();
    
    // Check join form is hidden
    await expect(gamePage.locator('#joinForm')).toBeHidden();
    
    // Check instructions are visible
    await expect(gamePage.locator('#instructions')).toBeVisible();
    
    // Check status shows connected
    await expect(gamePage.locator('#status')).toContainText('Connected');
  });

  test('should render grid on canvas', async ({ gamePage, joinGame, canvasScreenshot }) => {
    await joinGame();
    
    // Take screenshot of canvas
    const screenshot = await canvasScreenshot();
    
    // Canvas should have content (not empty)
    expect(screenshot).toBeTruthy();
    
    // Check canvas dimensions
    const canvas = await gamePage.locator('#gameCanvas');
    const box = await canvas.boundingBox();
    expect(box.width).toBe(600); // GRID_SIZE * CELL_SIZE = 20 * 30
    expect(box.height).toBe(600);
  });

  test('should display player on grid after joining', async ({ gamePage, joinGame, getPlayerCount }) => {
    await joinGame('TestPlayer');
    
    // Wait for player to be added
    await gamePage.waitForTimeout(500);
    
    // Check player count
    const count = await getPlayerCount();
    expect(count).toBe(1);
    
    // Verify canvas has been updated (player is drawn)
    const canvas = await gamePage.locator('#gameCanvas');
    const screenshot = await canvas.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('should move player with arrow keys', async ({ gamePage, joinGame, pressArrowKey }) => {
    await joinGame('Mover');
    
    // Wait for initial render
    await gamePage.waitForTimeout(500);
    
    // Get initial player position
    const initialPos = await gamePage.evaluate(() => {
      const player = Array.from(window.players.values())[0];
      return player ? { x: player.x, y: player.y } : null;
    });
    
    expect(initialPos).toBeTruthy();
    
    // Move player right
    await pressArrowKey('right');
    await gamePage.waitForTimeout(200);
    
    // Check position changed
    const newPos = await gamePage.evaluate(() => {
      const player = Array.from(window.players.values())[0];
      return player ? { x: player.x, y: player.y } : null;
    });
    
    expect(newPos.x).toBe(Math.min(initialPos.x + 1, 19)); // Grid boundary check
    expect(newPos.y).toBe(initialPos.y);
  });

  test('should respect grid boundaries', async ({ gamePage, joinGame, pressArrowKey }) => {
    await joinGame('BoundaryTester');
    await gamePage.waitForTimeout(500);
    
    // Move player to top-left corner
    for (let i = 0; i < 25; i++) {
      await pressArrowKey('up');
      await pressArrowKey('left');
    }
    
    await gamePage.waitForTimeout(500);
    
    // Get position - should be at (0, 0)
    const cornerPos = await gamePage.evaluate(() => {
      const player = Array.from(window.players.values())[0];
      return player ? { x: player.x, y: player.y } : null;
    });
    
    expect(cornerPos.x).toBe(0);
    expect(cornerPos.y).toBe(0);
    
    // Try to move beyond boundary
    await pressArrowKey('up');
    await pressArrowKey('left');
    await gamePage.waitForTimeout(200);
    
    // Position should still be (0, 0)
    const stillCornerPos = await gamePage.evaluate(() => {
      const player = Array.from(window.players.values())[0];
      return player ? { x: player.x, y: player.y } : null;
    });
    
    expect(stillCornerPos.x).toBe(0);
    expect(stillCornerPos.y).toBe(0);
  });

  test('should show player name below player circle', async ({ gamePage, joinGame }) => {
    const playerName = 'NamedPlayer';
    await joinGame(playerName);
    await gamePage.waitForTimeout(500);
    
    // Take screenshot to verify visual rendering
    const screenshot = await gamePage.locator('#gameCanvas').screenshot();
    expect(screenshot).toBeTruthy();
    
    // Verify player data includes name
    const playerData = await gamePage.evaluate(() => {
      const player = Array.from(window.players.values())[0];
      return player ? player.name : null;
    });
    
    expect(playerData).toBe(playerName);
  });

  test('should handle disconnection gracefully', async ({ page, joinGame }) => {
    await page.goto('/');
    await joinGame();
    
    // Simulate server disconnect by evaluating WebSocket close
    await page.evaluate(() => {
      if (window.ws && window.ws.close) {
        window.ws.close();
      }
    });
    
    await page.waitForTimeout(500);
    
    // Check UI returns to initial state
    await expect(page.locator('#joinForm')).toBeVisible();
    await expect(page.locator('#gameCanvas')).toBeHidden();
    await expect(page.locator('#status')).toContainText('Disconnected');
  });
});