const { test as base } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Create custom test fixture with game-specific helpers
exports.test = base.extend({
  // Auto-navigate to game page
  gamePage: async ({ page }, use) => {
    await page.goto('/');
    await use(page);
  },

  // Helper to join game with a player name
  joinGame: async ({ page }, use) => {
    await use(async (playerName = 'TestPlayer') => {
      await page.fill('#playerName', playerName);
      await page.click('button:has-text("Join Game")');
      
      // Wait for canvas to be visible
      await page.waitForSelector('#gameCanvas', { state: 'visible' });
      
      // Wait for WebSocket connection
      await page.waitForFunction(() => {
        const status = document.querySelector('#status');
        return status && status.textContent.includes('Connected');
      });
    });
  },

  // Helper to simulate arrow key presses
  pressArrowKey: async ({ page }, use) => {
    await use(async (direction) => {
      const keyMap = {
        up: 'ArrowUp',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight'
      };
      
      await page.keyboard.press(keyMap[direction]);
    });
  },

  // Helper to get canvas screenshot
  canvasScreenshot: async ({ page }, use) => {
    await use(async (filename = null) => {
      const canvas = await page.locator('#gameCanvas');
      const screenshot = await canvas.screenshot();
      
      if (filename) {
        const screenshotDir = path.join(__dirname, '../../screenshots');
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }
        const filepath = path.join(screenshotDir, filename);
        fs.writeFileSync(filepath, screenshot);
      }
      
      return screenshot;
    });
  },

  // Helper to take full page screenshot  
  takeScreenshot: async ({ page }, use) => {
    await use(async (filename) => {
      const screenshotDir = path.join(__dirname, '../../screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      const filepath = path.join(screenshotDir, filename);
      await page.screenshot({ path: filepath, fullPage: true });
      return filepath;
    });
  },

  // Helper to count players on canvas
  getPlayerCount: async ({ page }, use) => {
    await use(async () => {
      return await page.evaluate(() => {
        // Access global players map from client
        return window.clientState ? window.clientState.players.size : 0;
      });
    });
  },

  // Helper to get player position
  getPlayerPosition: async ({ page }, use) => {
    await use(async (playerId) => {
      return await page.evaluate((id) => {
        const player = window.clientState?.players?.get(id);
        return player ? { x: player.x, y: player.y } : null;
      }, playerId);
    });
  }
});

exports.expect = base.expect;