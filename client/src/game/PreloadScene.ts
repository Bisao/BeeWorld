import { Scene } from "phaser";

export class PreloadScene extends Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    // Background and UI elements
    this.load.image("wood-panel", "/textures/wood.jpg");
    this.load.image("grass-texture", "/textures/grass.png");
    this.load.image("game-title", "/src/assets/game-title.svg");
    this.load.image("apple-icon", "/src/assets/apple-icon.svg");
    this.load.image("google-icon", "/src/assets/google-icon.svg");
    this.load.image("discord-icon", "/src/assets/discord-icon.svg");
    
    // Button sprites (generated via sprite factory)
    this.load.spritesheet("button-green", "data:image/png;base64,FAKE_DATA", { frameWidth: 190, frameHeight: 49 });
    this.load.spritesheet("button-gold", "data:image/png;base64,FAKE_DATA", { frameWidth: 190, frameHeight: 49 });
    
    // Load button sprite factory
    this.load.image("pixel", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
  }

  create() {
    // Create button textures using the sprite factory
    this.createButtonTexture("green-button", 0x76c442, 0x5ba332, 190, 49);
    this.createButtonTexture("gold-button", 0xffd700, 0xc6a700, 190, 49);
    this.createButtonTexture("blue-button", 0x4a9df5, 0x3a7dc5, 190, 49);
    this.createButtonTexture("red-button", 0xf54a4a, 0xc53a3a, 190, 49);
    
    // Start the login scene
    this.scene.start("LoginScene");
  }
  
  // Helper function to create button textures programmatically
  createButtonTexture(name: string, fillColor: number, borderColor: number, width: number, height: number) {
    const buttonTexture = this.textures.createCanvas(name, width, height);
    const context = buttonTexture.getContext();
    
    // Button background
    context.fillStyle = this.rgbToHex(fillColor);
    context.fillRect(0, 0, width, height);
    
    // Button border
    context.strokeStyle = this.rgbToHex(borderColor);
    context.lineWidth = 4;
    context.strokeRect(2, 2, width - 4, height - 4);
    
    // Button highlight (top)
    const gradient = context.createLinearGradient(0, 0, 0, height * 0.4);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.fillStyle = gradient;
    context.fillRect(4, 4, width - 8, height * 0.4);
    
    buttonTexture.refresh();
  }
  
  // Helper to convert RGB to hex
  rgbToHex(color: number): string {
    return "#" + color.toString(16).padStart(6, "0");
  }
}
