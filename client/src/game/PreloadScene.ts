import { Scene } from "phaser";

export class PreloadScene extends Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    // Background and UI elements
    this.load.image("wood-panel", "/textures/wood.jpg");
    this.load.image("grass-texture", "/textures/grass.png");
    this.load.image("apple-icon", "/assets/apple-icon.svg");
    this.load.image("google-icon", "/assets/google-icon.svg");
    this.load.image("discord-icon", "/assets/discord-icon.svg");
    
    // Load sound for button clicks
    this.load.audio("click", "/sounds/hit.mp3");
    
    // Load pixel for graphics operations
    this.load.image("pixel", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
    
    // Pre-load character sprites and resources
    this.load.image("warrior-character", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
    this.load.image("mage-character", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
    this.load.image("priest-character", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
    
    // Create temporary resource textures
    this.createResourceTexture("tree", 0x2d5a27);     // Dark green
    this.createResourceTexture("rock", 0x808080);     // Gray
    this.createResourceTexture("coal", 0x303030);     // Dark gray
    this.createResourceTexture("iron", 0xb0b0b0);     // Light gray
    this.createResourceTexture("copper", 0xb87333);   // Copper brown
    this.createResourceTexture("silver", 0xc0c0c0);   // Silver
    this.createResourceTexture("gold", 0xffd700);     // Gold
    
    // Class icons
    this.load.image("warrior-icon", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
    this.load.image("mage-icon", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
    this.load.image("priest-icon", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
  }

  create() {
    // Create button textures programmatically
    this.createButtonTexture("green-button", 0x76c442, 0x5ba332, 190, 49);
    this.createButtonTexture("gold-button", 0xffd700, 0xc6a700, 190, 49);
    this.createButtonTexture("blue-button", 0x4a9df5, 0x3a7dc5, 190, 49);
    this.createButtonTexture("account-button", 0x4a9df5, 0x3a7dc5, 120, 40);
    this.createButtonTexture("privacy-button", 0x4a9df5, 0x3a7dc5, 120, 40);
    this.createButtonTexture("quit-button", 0xf54a4a, 0xc53a3a, 120, 40);
    
    // Começar na tela de login
    this.scene.start("SimpleLoginScene");
  }
  
  // Helper function to create button textures programmatically
  createButtonTexture(name: string, fillColor: number, borderColor: number, width: number, height: number) {
    const buttonTexture = this.textures.createCanvas(name, width, height);
    
    if (buttonTexture) {
      const context = buttonTexture.getContext();
      
      // Button background with rounded corners
      context.fillStyle = this.rgbToHex(fillColor);
      this.roundRect(context, 0, 0, width, height, 10, true, false);
      
      // Button border with rounded corners
      context.strokeStyle = this.rgbToHex(borderColor);
      context.lineWidth = 4;
      this.roundRect(context, 2, 2, width - 4, height - 4, 8, false, true);
      
      // Button highlight (top)
      context.save();
      this.roundRect(context, 4, 4, width - 8, height * 0.4, 8, false, false);
      context.clip();
      const gradient = context.createLinearGradient(0, 0, 0, height * 0.4);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = gradient;
      context.fillRect(4, 4, width - 8, height * 0.4);
      context.restore();
      
      buttonTexture.refresh();
    }
  }
  
  // Helper to draw rounded rectangles
  roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fill: boolean, stroke: boolean) {
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }
  
  // Helper to convert RGB to hex
  rgbToHex(color: number): string {
    return "#" + color.toString(16).padStart(6, "0");
  }
}
    const size = 32;
    const texture = this.textures.createCanvas(name, size, size);
    const context = texture.getContext();
    
    context.fillStyle = this.rgbToHex(color);
    context.fillRect(0, 0, size, size);
    
    // Add some shading
    context.fillStyle = 'rgba(255,255,255,0.2)';
    context.fillRect(0, 0, size/2, size/2);
    
    context.fillStyle = 'rgba(0,0,0,0.2)';
    context.fillRect(size/2, size/2, size/2, size/2);
    
    texture.refresh();
  }
