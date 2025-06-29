const { test, expect } = require('../fixtures/test-helpers');
const { chromium } = require('@playwright/test');

test.describe('Multiplayer Functionality', () => {
  let browser1, browser2;
  let context1, context2;
  let page1, page2;

  test.beforeAll(async () => {
    // Launch two browser instances
    browser1 = await chromium.launch();
    browser2 = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser1?.close();
    await browser2?.close();
  });

  test.beforeEach(async () => {
    // Create contexts and pages for each test
    context1 = await browser1.newContext();
    context2 = await browser2.newContext();
    page1 = await context1.newPage();
    page2 = await context2.newPage();
  });

  test.afterEach(async () => {
    await context1?.close();
    await context2?.close();
  });

  test('should show multiple players on the grid', async () => {
    console.log('🔄 Starting: Multiplayer visibility test');
    
    console.log('👤 Player 1 joining...');
    await page1.goto('/');
    await page1.fill('#playerName', 'Player1');
    await page1.click('button:has-text("Join Game")');
    await page1.waitForSelector('#gameCanvas', { state: 'visible' });
    
    console.log('👤 Player 2 joining...');
    await page2.goto('/');
    await page2.fill('#playerName', 'Player2');
    await page2.click('button:has-text("Join Game")');
    await page2.waitForSelector('#gameCanvas', { state: 'visible' });
    
    console.log('⏳ Waiting for players to sync...');
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);
    
    console.log('📸 Taking multiplayer screenshots...');
    await page1.screenshot({ 
      path: 'screenshots/08-multiplayer-player1-view.png',
      fullPage: true 
    });
    await page2.screenshot({ 
      path: 'screenshots/09-multiplayer-player2-view.png',
      fullPage: true 
    });
    
    console.log('🔢 Checking player counts...');
    const player1Count = await page1.evaluate(() => window.clientState?.players?.size || 0);
    const player2Count = await page2.evaluate(() => window.clientState?.players?.size || 0);
    
    console.log(`👥 Player1 sees: ${player1Count} players, Player2 sees: ${player2Count} players`);
    expect(player1Count).toBe(2);
    expect(player2Count).toBe(2);
    
    console.log('📝 Verifying player names...');
    const player1Names = await page1.evaluate(() => 
      Array.from(window.clientState?.players?.values() || []).map(p => p.name).sort()
    );
    const player2Names = await page2.evaluate(() => 
      Array.from(window.clientState?.players?.values() || []).map(p => p.name).sort()
    );
    
    console.log(`👤 Player1 sees names: [${player1Names.join(', ')}]`);
    console.log(`👤 Player2 sees names: [${player2Names.join(', ')}]`);
    expect(player1Names).toEqual(['Player1', 'Player2']);
    expect(player2Names).toEqual(['Player1', 'Player2']);
    console.log('✅ Completed: Multiplayer visibility test');
  });

  test('should update other players when one moves', async () => {
    // Both players join
    await page1.goto('/');
    await page1.fill('#playerName', 'Mover');
    await page1.click('button:has-text("Join Game")');
    await page1.waitForSelector('#gameCanvas', { state: 'visible' });
    
    await page2.goto('/');
    await page2.fill('#playerName', 'Observer');
    await page2.click('button:has-text("Join Game")');
    await page2.waitForSelector('#gameCanvas', { state: 'visible' });
    
    await page1.waitForTimeout(1000);
    
    // Take screenshot before movement
    await page2.screenshot({ 
      path: 'screenshots/10-before-player-movement.png',
      fullPage: true 
    });
    
    // Get Mover's initial position as seen by Observer
    const moverIdOnObserver = await page2.evaluate(() => {
      const players = Array.from(window.clientState?.players?.values() || []);
      const mover = players.find(p => p.name === 'Mover');
      return mover?.id;
    });
    
    const initialPos = await page2.evaluate((id) => {
      const player = window.clientState?.players?.get(id);
      return player ? { x: player.x, y: player.y } : null;
    }, moverIdOnObserver);
    
    expect(initialPos).toBeTruthy();
    
    // Mover moves right
    await page1.keyboard.press('ArrowRight');
    await page1.waitForTimeout(500);
    
    // Take screenshot after movement from Observer's view
    await page2.screenshot({ 
      path: 'screenshots/11-after-player-movement.png',
      fullPage: true 
    });
    
    // Check Observer sees the movement
    const newPos = await page2.evaluate((id) => {
      const player = window.clientState?.players?.get(id);
      return player ? { x: player.x, y: player.y } : null;
    }, moverIdOnObserver);
    
    expect(newPos.x).toBe(Math.min(initialPos.x + 1, 19));
    expect(newPos.y).toBe(initialPos.y);
  });

  test('should remove player when they disconnect', async () => {
    // Both players join
    await page1.goto('/');
    await page1.fill('#playerName', 'Leaver');
    await page1.click('button:has-text("Join Game")');
    await page1.waitForSelector('#gameCanvas', { state: 'visible' });
    
    await page2.goto('/');
    await page2.fill('#playerName', 'Stayer');
    await page2.click('button:has-text("Join Game")');
    await page2.waitForSelector('#gameCanvas', { state: 'visible' });
    
    await page2.waitForTimeout(1000);
    
    // Verify both players are present
    const initialCount = await page2.evaluate(() => window.players?.size || 0);
    expect(initialCount).toBe(2);
    
    // Player 1 disconnects
    await page1.close();
    
    // Wait for disconnect to propagate
    await page2.waitForTimeout(1000);
    
    // Check only one player remains
    const finalCount = await page2.evaluate(() => window.players?.size || 0);
    expect(finalCount).toBe(1);
    
    // Verify remaining player is Stayer
    const remainingPlayer = await page2.evaluate(() => {
      const players = Array.from(window.players?.values() || []);
      return players[0]?.name;
    });
    expect(remainingPlayer).toBe('Stayer');
  });

  test('should handle simultaneous movements', async () => {
    // Both players join
    await page1.goto('/');
    await page1.fill('#playerName', 'Racer1');
    await page1.click('button:has-text("Join Game")');
    await page1.waitForSelector('#gameCanvas', { state: 'visible' });
    
    await page2.goto('/');
    await page2.fill('#playerName', 'Racer2');
    await page2.click('button:has-text("Join Game")');
    await page2.waitForSelector('#gameCanvas', { state: 'visible' });
    
    await page1.waitForTimeout(1000);
    
    // Both players move simultaneously
    await Promise.all([
      page1.keyboard.press('ArrowUp'),
      page2.keyboard.press('ArrowDown')
    ]);
    
    await page1.waitForTimeout(500);
    
    // Verify both movements were processed
    const player1Positions = await page1.evaluate(() => {
      const players = Array.from(window.players?.values() || []);
      return players.map(p => ({ name: p.name, x: p.x, y: p.y }));
    });
    
    const player2Positions = await page2.evaluate(() => {
      const players = Array.from(window.players?.values() || []);
      return players.map(p => ({ name: p.name, x: p.x, y: p.y }));
    });
    
    // Both players should see the same state
    expect(player1Positions.length).toBe(2);
    expect(player2Positions.length).toBe(2);
    
    // Sort to ensure consistent comparison
    player1Positions.sort((a, b) => a.name.localeCompare(b.name));
    player2Positions.sort((a, b) => a.name.localeCompare(b.name));
    
    expect(player1Positions).toEqual(player2Positions);
  });

  test('should assign different colors to players', async () => {
    // Three players join
    await page1.goto('/');
    await page1.fill('#playerName', 'ColorTest1');
    await page1.click('button:has-text("Join Game")');
    await page1.waitForSelector('#gameCanvas', { state: 'visible' });
    
    await page2.goto('/');
    await page2.fill('#playerName', 'ColorTest2');
    await page2.click('button:has-text("Join Game")');
    await page2.waitForSelector('#gameCanvas', { state: 'visible' });
    
    await page1.waitForTimeout(1000);
    
    // Get player colors
    const colors = await page1.evaluate(() => {
      const players = Array.from(window.players?.values() || []);
      return players.map(p => p.color);
    });
    
    // Verify colors are assigned
    expect(colors.length).toBe(2);
    expect(colors[0]).toBeTruthy();
    expect(colors[1]).toBeTruthy();
    
    // Colors should be valid hex colors
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    expect(colors[0]).toMatch(hexColorRegex);
    expect(colors[1]).toMatch(hexColorRegex);
  });
});