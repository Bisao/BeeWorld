import { Scene } from "phaser";

export class PreloadScene extends Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    // Background and UI elements
    this.load.image("wood-panel", "/textures/wood.jpg");
    this.load.image("grass-texture", "/textures/grass.png");
    this.load.image("heartwood-title", "/assets/heartwood-title.png");
    this.load.image("apple-icon", "/assets/apple-icon.svg");
    this.load.image("google-icon", "/assets/google-icon.svg");
    this.load.image("discord-icon", "/assets/discord-icon.svg");
    
    // Load sound for button clicks
    this.load.audio("click", "/sounds/hit.mp3");
    
    // Load pixel for graphics operations
    this.load.image("pixel", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
  }

  create() {
    // Create button textures programmatically
    this.createButtonTexture("green-button", 0x76c442, 0x5ba332, 190, 49);
    this.createButtonTexture("gold-button", 0xffd700, 0xc6a700, 190, 49);
    this.createButtonTexture("blue-button", 0x4a9df5, 0x3a7dc5, 190, 49);
    this.createButtonTexture("account-button", 0x4a9df5, 0x3a7dc5, 120, 40);
    this.createButtonTexture("privacy-button", 0x4a9df5, 0x3a7dc5, 120, 40);
    this.createButtonTexture("quit-button", 0xf54a4a, 0xc53a3a, 120, 40);
    
    // Start the login scene
    this.scene.start("LoginScene");
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
