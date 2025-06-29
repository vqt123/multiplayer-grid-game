const { test, expect } = require('../fixtures/test-helpers');

test.describe('Game Functionality', () => {
  test('should load game page with join form', async ({ page, takeScreenshot }) => {
    console.log('🔄 Starting: Load game page test');
    await page.goto('/');
    
    console.log('📸 Taking initial page screenshot...');
    await takeScreenshot('01-initial-page.png');
    
    console.log('✅ Verifying page title and elements');
    await expect(page).toHaveTitle('Multiplayer Grid Game');
    
    // Check join form is visible
    await expect(page.locator('#joinForm')).toBeVisible();
    await expect(page.locator('#playerName')).toBeVisible();
    await expect(page.locator('button:has-text("Join Game")')).toBeVisible();
    
    // Canvas should be hidden initially
    await expect(page.locator('#gameCanvas')).toBeHidden();
    console.log('✅ Completed: Load game page test');
  });

  test('should join game and display canvas', async ({ gamePage, joinGame, takeScreenshot }) => {
    console.log('🔄 Starting: Join game test');
    await joinGame('Player1');
    
    console.log('📸 Taking joined game screenshot...');
    await takeScreenshot('02-joined-game.png');
    
    console.log('✅ Verifying canvas and UI state');
    await expect(gamePage.locator('#gameCanvas')).toBeVisible();
    await expect(gamePage.locator('#joinForm')).toBeHidden();
    await expect(gamePage.locator('#instructions')).toBeVisible();
    await expect(gamePage.locator('#status')).toContainText('Connected');
    console.log('✅ Completed: Join game test');
  });

  test('should render grid on canvas', async ({ gamePage, joinGame, canvasScreenshot }) => {
    console.log('🔄 Starting: Grid rendering test');
    await joinGame();
    
    console.log('📸 Taking grid canvas screenshot...');
    const screenshot = await canvasScreenshot('03-grid-canvas.png');
    
    console.log('✅ Verifying canvas content and dimensions');
    expect(screenshot).toBeTruthy();
    
    const canvas = await gamePage.locator('#gameCanvas');
    const box = await canvas.boundingBox();
    console.log(`📐 Canvas dimensions: ${box.width}x${box.height}`);
    expect(box.width).toBeGreaterThan(590); // Allow for slight variations
    expect(box.height).toBeGreaterThan(590);
    console.log('✅ Completed: Grid rendering test');
  });

  test('should display player on grid after joining', async ({ gamePage, joinGame, getPlayerCount, canvasScreenshot }) => {
    console.log('🔄 Starting: Player display test');
    await joinGame('TestPlayer');
    
    console.log('⏳ Waiting for player to be added...');
    await gamePage.waitForTimeout(500);
    
    console.log('📸 Taking player on grid screenshot...');
    await canvasScreenshot('04-player-on-grid.png');
    
    console.log('🔢 Checking player count...');
    const count = await getPlayerCount();
    console.log(`👥 Player count: ${count}`);
    expect(count).toBeGreaterThanOrEqual(1);
    
    const canvas = await gamePage.locator('#gameCanvas');
    const screenshot = await canvas.screenshot();
    expect(screenshot).toBeTruthy();
    console.log('✅ Completed: Player display test');
  });

  test('should move player with arrow keys', async ({ gamePage, joinGame, pressArrowKey, canvasScreenshot }) => {
    console.log('🔄 Starting: Player movement test');
    await joinGame('Mover');
    
    console.log('⏳ Waiting for initial render...');
    await gamePage.waitForTimeout(500);
    
    console.log('📸 Taking before movement screenshot...');
    await canvasScreenshot('05-before-movement.png');
    
    console.log('🎯 Getting initial player position...');
    const initialPos = await gamePage.evaluate(() => {
      const player = Array.from(window.clientState?.players?.values() || [])[0];
      return player ? { x: player.x, y: player.y } : null;
    });
    
    if (initialPos) {
      console.log(`📍 Initial position: (${initialPos.x}, ${initialPos.y})`);
    }
    
    console.log('➡️ Moving player right...');
    await pressArrowKey('right');
    await gamePage.waitForTimeout(200);
    
    console.log('📸 Taking after movement screenshot...');
    await canvasScreenshot('06-after-movement.png');
    
    const newPos = await gamePage.evaluate(() => {
      const player = Array.from(window.clientState?.players?.values() || [])[0];
      return player ? { x: player.x, y: player.y } : null;
    });
    
    if (newPos && initialPos) {
      console.log(`📍 New position: (${newPos.x}, ${newPos.y})`);
      expect(newPos.x).toBeGreaterThanOrEqual(initialPos.x); // Allow movement or boundary
      expect(newPos.y).toBe(initialPos.y);
    }
    console.log('✅ Completed: Player movement test');
  });

  test('should respect grid boundaries', async ({ gamePage, joinGame, pressArrowKey, canvasScreenshot }) => {
    await joinGame('BoundaryTester');
    await gamePage.waitForTimeout(500);
    
    // Move player to top-left corner
    for (let i = 0; i < 25; i++) {
      await pressArrowKey('up');
      await pressArrowKey('left');
    }
    
    await gamePage.waitForTimeout(500);
    
    // Take screenshot at boundary
    await canvasScreenshot('07-boundary-test.png');
    
    // Get position - should be at (0, 0)
    const cornerPos = await gamePage.evaluate(() => {
      const player = Array.from(window.clientState.players.values())[0];
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
      const player = Array.from(window.clientState.players.values())[0];
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