import { Scene } from "phaser";

export class LoginScene extends Scene {
  private buttons: Phaser.GameObjects.Container[] = [];
  private animating: boolean = false;
  
  constructor() {
    super("LoginScene");
  }

  create() {
    // Background escuro
    const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x111111);
    background.setOrigin(0, 0);
    
    // Main content container
    const mainContainer = this.add.container(0, 0);
    
    // Título criado diretamente no jogo (texto estilizado)
    const titleText = this.add.text(this.cameras.main.width / 2, 140, "Heartwood", {
      fontFamily: "MedievalSharp",
      fontSize: "72px",
      color: "#a67c00",
      stroke: "#000000",
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: "#000000", blur: 5, fill: true }
    });
    titleText.setOrigin(0.5);
    
    // Subtítulo "Online"
    const subtitleText = this.add.text(this.cameras.main.width / 2, 210, "Online", {
      fontFamily: "MedievalSharp",
      fontSize: "48px",
      color: "#ffdd00",
      stroke: "#000000",
      strokeThickness: 2,
      shadow: { offsetX: 2, offsetY: 2, color: "#000000", blur: 3, fill: true }
    });
    subtitleText.setOrigin(0.5);
    
    // Adiciona decoração - espada embaixo
    const sword = this.add.graphics();
    sword.fillStyle(0xaaaaaa, 1);
    sword.fillRect(this.cameras.main.width / 2 - 5, 220, 10, 40);
    sword.fillStyle(0xcccccc, 1);
    sword.fillTriangle(
      this.cameras.main.width / 2 - 20, 220,
      this.cameras.main.width / 2 + 20, 220,
      this.cameras.main.width / 2, 205
    );
    
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
    const panelContainer = this.add.container(centerX, 370);
    
    // Play button grande e verde
    const playButton = this.createButton(0, 0, "Play", () => {
      console.log("Play button clicked");
        
      // Vamos usar setTimeout para garantir que a cena carregue corretamente
      setTimeout(() => {
        this.scene.start("CharacterSelectScene", { characters: [] });
      }, 100);
    });
    playButton.setScale(1.2);
    this.styleText(playButton.getAt(1) as Phaser.GameObjects.Text, { 
      fontSize: "24px",
      fontFamily: "MedievalSharp",
      fontStyle: "bold" 
    });
    
    // Or login with text
    const orText = this.add.text(0, 60, "Or login with", { 
      fontFamily: "Arial", 
      fontSize: "16px", 
      color: "#ffffff" 
    });
    orText.setOrigin(0.5);
    
    // Social login buttons
    const googleButton = this.createSocialButton(-50, 100, "Google");
    const appleButton = this.createSocialButton(50, 100, "Apple");
    
    // Add all to container
    panelContainer.add([playButton, orText, googleButton, appleButton]);
    
    // Adiciona separador horizontal
    const separator = this.add.graphics();
    separator.lineStyle(2, 0x888888, 0.8);
    separator.lineBetween(centerX - 120, 430, centerX + 120, 430);
  }
  
  private createPreviewPanel() {
    // Panel on the left side - painel marrom como na imagem
    const panel = this.add.graphics();
    panel.fillStyle(0x755c48, 1);
    panel.fillRoundedRect(30, 120, 230, 380, 16);
    panel.lineStyle(3, 0xc0a080, 1);
    panel.strokeRoundedRect(30, 120, 230, 380, 16);
    
    // Área da prévia do jogo (imagem de jogo similar à imagem de referência)
    const preview = this.add.graphics();
    preview.fillStyle(0x666666, 1);
    preview.fillRect(40, 130, 210, 210);
    
    // Campo marrom para preview do jogo
    const previewImage = this.add.tileSprite(145, 235, 190, 190, "grass-texture");
    previewImage.setTint(0xa67c52);
    
    // Pequena tenda
    const tent = this.add.graphics();
    tent.fillStyle(0xf5f5f5, 1);
    tent.fillTriangle(75, 235, 105, 195, 135, 235);
    tent.fillStyle(0xcccccc, 1);
    tent.fillRect(85, 235, 40, 10);
    
    // Pequenos personagens
    const character1 = this.add.graphics();
    character1.fillStyle(0x333333, 1);
    character1.fillRect(125, 210, 14, 20);
    
    const character2 = this.add.graphics();
    character2.fillStyle(0x333333, 1);
    character2.fillRect(150, 220, 14, 20);
    
    // Árvore pequena
    const tree = this.add.graphics();
    tree.fillStyle(0x2a5e1e, 1);
    tree.fillCircle(180, 215, 12);
    tree.fillStyle(0x5a3928, 1);
    tree.fillRect(178, 215, 4, 15);
    
    // Coming soon text
    const comingSoonText = this.add.text(145, 365, "Coming Soon", { 
      fontFamily: "MedievalSharp", 
      fontSize: "18px", 
      color: "#ffdd00",
      fontStyle: "bold"
    });
    comingSoonText.setOrigin(0.5);
    
    // Feature list - igual à imagem de referência
    const features = [
      "• Infiltrate the Shadowfang",
      "• And more..."
    ];
    
    features.forEach((feature, index) => {
      const featureText = this.add.text(50, 395 + (index * 30), feature, { 
        fontFamily: "Arial", 
        fontSize: "16px", 
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 2
      });
    });
  }
  
  private createBottomButtons() {
    // Bottom buttons - exatamente como na imagem de referência
    const accountButton = this.createButton(120, this.cameras.main.height - 50, "Account", () => {
      console.log("Account button clicked");
      // Account functionality would go here
    });
    const privacyButton = this.createButton(320, this.cameras.main.height - 50, "Privacy Policy", () => {
      console.log("Privacy Policy button clicked");
      window.open("https://example.com/privacy", "_blank");
    });
    const quitButton = this.createButton(this.cameras.main.width - 100, this.cameras.main.height - 50, "Quit", () => {
      console.log("Quit button clicked");
      // In a real app, this might redirect to another page
      window.close();
    });
    
    // Estilizando os textos dos botões
    this.styleText(accountButton.getAt(1) as Phaser.GameObjects.Text, { fontSize: "16px" });
    this.styleText(privacyButton.getAt(1) as Phaser.GameObjects.Text, { fontSize: "16px" });
    this.styleText(quitButton.getAt(1) as Phaser.GameObjects.Text, { fontSize: "16px", fontStyle: "bold" });
  }

  private createSocialButton(x: number, y: number, type: "Google" | "Apple") {
    const button = this.add.container(x, y);

    // Círculo branco para fundo
    const circle = this.add.circle(0, 0, 24, 0xffffff);
    circle.setStrokeStyle(2, 0x000000, 0.3);

    // Logo ou texto
    const icon = this.add.text(0, 0, type === "Google" ? "G" : "A", {
      fontFamily: "Arial",
      fontSize: "20px",
      color: type === "Google" ? "#4285F4" : "#000000"
    }).setOrigin(0.5);

    button.add([circle]);
    button.add([icon]);

    // Fazer o container interativo
    button.setSize(48, 48);
    button.setInteractive({ useHandCursor: true });

    // Eventos
    button.on("pointerover", () => {
      button.setScale(1.1);
    });

    button.on("pointerout", () => {
      button.setScale(1.0);
    });

    button.on("pointerdown", () => {
      button.setScale(0.9);
    });

    button.on("pointerup", () => {
      button.setScale(1.0);
      this.sound.play("click");

      if (type === "Google") {
        window.open("https://accounts.google.com", "_blank");
      } else {
        window.open("https://appleid.apple.com", "_blank");
      }
    });

    this.buttons.push(button);
    return button;
  }

  private createButton(x: number, y: number, text: string, callback: () => void): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 120, 40, 0x4a9df5);
    bg.setStrokeStyle(2, 0x000000);

    const buttonText = this.add.text(0, 0, text, {
      fontFamily: "MedievalSharp",
      fontSize: "18px",
      color: "#ffffff"
    }).setOrigin(0.5);

    button.add([bg, buttonText]);

    // Fazer o container interativo
    button.setSize(120, 40);
    button.setInteractive({ useHandCursor: true });

    // Eventos
    button.on("pointerover", () => {
      button.setScale(1.1);
    });

    button.on("pointerout", () => {
      button.setScale(1.0);
    });

    button.on("pointerdown", () => {
      button.setScale(0.9);
    });

    button.on("pointerup", () => {
      button.setScale(1.0);
      this.sound.play("click");
      callback();
    });

    return button;
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