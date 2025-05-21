import { Scene } from "phaser";

export class LoginScene extends Scene {
  private buttons: Phaser.GameObjects.Container[] = [];
  private animating: boolean = false;
  
  constructor() {
    super("LoginScene");
  }

  create() {
    // Background
    const background = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "wood-panel");
    background.setOrigin(0, 0);
    background.setTint(0x222222);
    
    // Main content container
    const mainContainer = this.add.container(0, 0);
    
    // Game title
    const gameTitle = this.add.image(this.cameras.main.width / 2, 160, "game-title");
    gameTitle.setScale(0.6);
    
    // Create the login panel
    this.createLoginPanel();
    
    // Create the game preview panel
    this.createPreviewPanel();
    
    // Bottom buttons
    this.createBottomButtons();
    
    // Version text
    const versionText = this.add.text(
      this.cameras.main.width - 10, 
      this.cameras.main.height - 10, 
      "v0.4.13 BETA", 
      { fontFamily: "monospace", fontSize: "14px", color: "#aaaaaa" }
    );
    versionText.setOrigin(1, 1);
    
    // Add initial animation
    this.animateIntro();
  }
  
  private createLoginPanel() {
    const centerX = this.cameras.main.width / 2;
    const panelContainer = this.add.container(centerX, 350);
    
    // Play button
    const playButton = this.createButton(0, 0, "green-button", "Play");
    playButton.setScale(1.2);
    this.styleText(playButton.getAt(1) as Phaser.GameObjects.Text, { fontSize: "24px" });
    
    // Or login with text
    const orText = this.add.text(0, 50, "Or login with", { 
      fontFamily: "Arial", 
      fontSize: "16px", 
      color: "#ffffff" 
    });
    orText.setOrigin(0.5);
    
    // Social login buttons
    const googleButton = this.createSocialButton(-50, 90, "google-icon", "G");
    const appleButton = this.createSocialButton(50, 90, "apple-icon", "");
    
    // Add all to container
    panelContainer.add([playButton, orText, googleButton, appleButton]);
    
    // Button interactions
    this.setupButtonInteraction(playButton, () => {
      console.log("Play button clicked");
      this.events.emit("play");
    });
    
    this.setupButtonInteraction(googleButton, () => {
      console.log("Google login clicked");
      window.open("https://accounts.google.com", "_blank");
    });
    
    this.setupButtonInteraction(appleButton, () => {
      console.log("Apple login clicked");
      window.open("https://appleid.apple.com", "_blank");
    });
  }
  
  private createPreviewPanel() {
    // Panel on the left side
    const panel = this.add.graphics();
    panel.fillStyle(0x333333, 0.8);
    panel.fillRoundedRect(30, 120, 230, 380, 16);
    panel.lineStyle(2, 0x76c442, 1);
    panel.strokeRoundedRect(30, 120, 230, 380, 16);
    
    // Sample game preview
    const preview = this.add.graphics();
    preview.fillStyle(0x666666, 1);
    preview.fillRect(40, 130, 210, 210);
    
    // Generate a simple pixel art preview scene
    const previewImage = this.add.tileSprite(145, 235, 190, 190, "grass-texture");
    previewImage.setTint(0xaabbcc);
    
    // Character pixel art (simple representation)
    const character = this.add.graphics();
    character.fillStyle(0x333333, 1);
    character.fillRect(125, 205, 16, 24);
    character.fillStyle(0x775533, 1);
    character.fillRect(125, 215, 16, 14);
    
    // Create a tent
    const tent = this.add.graphics();
    tent.fillStyle(0xccbbaa, 1);
    tent.fillTriangle(75, 235, 105, 205, 135, 235);
    tent.fillStyle(0xaaaaaa, 1);
    tent.fillRect(85, 235, 40, 10);
    
    // Coming soon text
    const comingSoonText = this.add.text(145, 365, "Coming Soon", { 
      fontFamily: "MedievalSharp", 
      fontSize: "18px", 
      color: "#ffdd00",
      fontStyle: "bold"
    });
    comingSoonText.setOrigin(0.5);
    
    // Feature list
    const features = [
      "• Infiltrate the Shadowfang",
      "• And more..."
    ];
    
    features.forEach((feature, index) => {
      const featureText = this.add.text(50, 395 + (index * 30), feature, { 
        fontFamily: "Arial", 
        fontSize: "16px", 
        color: "#ffffff" 
      });
    });
  }
  
  private createBottomButtons() {
    // Bottom buttons
    const accountButton = this.createButton(120, this.cameras.main.height - 50, "blue-button", "Account");
    const privacyButton = this.createButton(320, this.cameras.main.height - 50, "blue-button", "Privacy Policy");
    const quitButton = this.createButton(this.cameras.main.width - 100, this.cameras.main.height - 50, "gold-button", "Quit");
    
    this.setupButtonInteraction(accountButton, () => {
      console.log("Account button clicked");
      // Account functionality would go here
    });
    
    this.setupButtonInteraction(privacyButton, () => {
      console.log("Privacy Policy button clicked");
      window.open("https://example.com/privacy", "_blank");
    });
    
    this.setupButtonInteraction(quitButton, () => {
      console.log("Quit button clicked");
      // In a real app, this might redirect to another page
      window.close();
    });
  }
  
  private createButton(x: number, y: number, texture: string, text: string): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);
    
    // Button background
    const buttonBg = this.add.image(0, 0, texture);
    
    // Button text
    const buttonText = this.add.text(0, 0, text, { 
      fontFamily: "MedievalSharp", 
      fontSize: "18px", 
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 2
    });
    buttonText.setOrigin(0.5);
    
    button.add([buttonBg, buttonText]);
    this.buttons.push(button);
    
    return button;
  }
  
  private createSocialButton(x: number, y: number, iconKey: string, fallbackText: string): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);
    
    // Button circle background
    const circle = this.add.graphics();
    circle.fillStyle(0xffffff, 1);
    circle.fillCircle(0, 0, 24);
    circle.lineStyle(2, 0x000000, 0.3);
    circle.strokeCircle(0, 0, 24);
    
    // Icon or fallback text
    let icon;
    try {
      icon = this.add.image(0, 0, iconKey);
      icon.setScale(0.4);
    } catch (e) {
      icon = this.add.text(0, 0, fallbackText, { 
        fontFamily: "Arial", 
        fontSize: "20px", 
        color: "#000000" 
      });
      icon.setOrigin(0.5);
    }
    
    button.add([circle, icon]);
    this.buttons.push(button);
    
    return button;
  }
  
  private setupButtonInteraction(button: Phaser.GameObjects.Container, callback: () => void) {
    const buttonBg = button.getAt(0) as Phaser.GameObjects.Image;
    
    // Fix the hitAreaCallback error
    buttonBg.setInteractive({ 
      useHandCursor: true,
      pixelPerfect: false
    });
    
    buttonBg.on("pointerover", () => {
      button.setScale(button.scale * 1.05);
      this.tweens.add({
        targets: button,
        y: button.y - 3,
        duration: 100
      });
    });
    
    buttonBg.on("pointerout", () => {
      button.setScale(button.scale / 1.05);
      this.tweens.add({
        targets: button,
        y: button.y + 3,
        duration: 100
      });
    });
    
    buttonBg.on("pointerdown", () => {
      button.setScale(button.scale * 0.95);
    });
    
    buttonBg.on("pointerup", () => {
      button.setScale(button.scale / 0.95);
      
      // Play sound effect
      this.sound.play("click");
      
      if (callback) callback();
    });
  }
  
  private styleText(text: Phaser.GameObjects.Text, style: Phaser.Types.GameObjects.Text.TextStyle) {
    const currentStyle = text.style;
    text.setStyle({ ...currentStyle, ...style });
  }
  
  private animateIntro() {
    if (this.animating) return;
    this.animating = true;
    
    // Animate buttons
    this.buttons.forEach((button, index) => {
      button.setAlpha(0);
      button.y += 50;
      
      this.tweens.add({
        targets: button,
        alpha: 1,
        y: button.y - 50,
        duration: 500,
        delay: 100 * index,
        ease: "Back.out"
      });
    });
    
    // After animations complete
    this.time.delayedCall(1000, () => {
      this.animating = false;
    });
  }
}
