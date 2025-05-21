import { Scene } from "phaser";

export class BootScene extends Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Create a loading bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
    
    // Loading text
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        color: "#ffffff"
      }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    // Percentage text
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: "0%",
      style: {
        font: "18px monospace",
        color: "#ffffff"
      }
    });
    percentText.setOrigin(0.5, 0.5);
    
    // Update progress bar as assets are loaded
    this.load.on("progress", (value: number) => {
      percentText.setText(parseInt(String(value * 100)) + "%");
      progressBar.clear();
      progressBar.fillStyle(0x76c442, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });
    
    // Cleanup when loading completes
    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      
      this.scene.start("PreloadScene");
    });
    
    // Load essential assets needed for the loading screen
    this.load.image("background", "/textures/wood.jpg");
  }

  create() {
    this.scene.start("PreloadScene");
  }
}
