import { Scene } from "phaser";
import { SimpleButton } from "./SimpleButton";

export class SimpleLoginScene extends Scene {
  constructor() {
    super("SimpleLoginScene");
  }

  create() {
    // Background escuro
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x111111)
      .setOrigin(0, 0);
    
    // Logo do jogo
    const titleText = this.add.text(this.cameras.main.width / 2, 140, "Heartwood", {
      fontFamily: "MedievalSharp",
      fontSize: "72px",
      color: "#a67c00",
      stroke: "#000000",
      strokeThickness: 4,
      shadow: { offsetX: 2, offsetY: 2, color: "#000000", blur: 5, fill: true }
    }).setOrigin(0.5);
    
    // Subtítulo "Online"
    const subtitleText = this.add.text(this.cameras.main.width / 2, 210, "Online", {
      fontFamily: "MedievalSharp",
      fontSize: "48px",
      color: "#ffdd00",
      stroke: "#000000",
      strokeThickness: 2,
      shadow: { offsetX: 2, offsetY: 2, color: "#000000", blur: 3, fill: true }
    }).setOrigin(0.5);
    
    // Decoração - espada
    const sword = this.add.graphics();
    sword.fillStyle(0xaaaaaa, 1);
    sword.fillRect(this.cameras.main.width / 2 - 5, 220, 10, 40);
    sword.fillStyle(0xcccccc, 1);
    sword.fillTriangle(
      this.cameras.main.width / 2 - 20, 220,
      this.cameras.main.width / 2 + 20, 220,
      this.cameras.main.width / 2, 205
    );
    
    // Botão Play (principal)
    new SimpleButton(
      this,
      this.cameras.main.width / 2,
      370,
      190,
      50,
      "Play",
      { 
        fontFamily: "MedievalSharp", 
        fontSize: "24px", 
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2
      },
      0x76c442, // verde
      () => {
        console.log("Play button clicked");
        // Carregar personagens salvos
      const savedCharacters = this.getCharacters();
      
      if (savedCharacters.length > 0) {
        this.scene.start("CharacterSelectScene", { characters: savedCharacters });
      } else {
        this.scene.start("SimpleCharacterCreateScene");
      }
      },
      1.2
    );
    
    // Login alternativo
    const orText = this.add.text(this.cameras.main.width / 2, 430, "Or login with", { 
      fontFamily: "Arial", 
      fontSize: "16px", 
      color: "#ffffff" 
    }).setOrigin(0.5);
    
    // Botões sociais
    this.createSocialButton(this.cameras.main.width / 2 - 50, 470, "Google");
    this.createSocialButton(this.cameras.main.width / 2 + 50, 470, "Apple");
    
    // Botões inferiores
    new SimpleButton(
      this,
      120,
      this.cameras.main.height - 50,
      120,
      40,
      "Account",
      { fontFamily: "MedievalSharp", fontSize: "16px", color: "#ffffff" },
      0x4a9df5, // azul
      () => console.log("Account button clicked")
    );
    
    new SimpleButton(
      this,
      320,
      this.cameras.main.height - 50,
      120,
      40,
      "Privacy Policy",
      { fontFamily: "MedievalSharp", fontSize: "16px", color: "#ffffff" },
      0x4a9df5, // azul
      () => console.log("Privacy Policy clicked")
    );
    
    new SimpleButton(
      this,
      this.cameras.main.width - 100,
      this.cameras.main.height - 50,
      120,
      40,
      "Quit",
      { fontFamily: "MedievalSharp", fontSize: "16px", color: "#ffffff" },
      0xf54a4a, // vermelho
      () => console.log("Quit button clicked")
    );
    
    // Version text
    const versionText = this.add.text(
      this.cameras.main.width - 10, 
      this.cameras.main.height - 10, 
      "v0.4.13 BETA", 
      { fontFamily: "monospace", fontSize: "14px", color: "#aaaaaa" }
    ).setOrigin(1, 1);
  }
  
  // Função para recuperar personagens salvos
  private getCharacters(): any[] {
    try {
      const savedCharactersStr = localStorage.getItem('heartwoodCharacters');
      if (savedCharactersStr) {
        return JSON.parse(savedCharactersStr);
      }
    } catch (error) {
      console.error("Error retrieving characters:", error);
    }
    
    // Retornar array vazio se não houver personagens ou ocorrer erro
    return [];
  }
  
  private createSocialButton(x: number, y: number, type: "Google" | "Apple") {
    // Círculo branco para fundo
    const circle = this.add.circle(x, y, 24, 0xffffff);
    circle.setStrokeStyle(2, 0x000000, 0.3);
    
    // Logo ou texto
    let icon = this.add.text(x, y, type === "Google" ? "G" : "A", {
      fontFamily: "Arial",
      fontSize: "20px",
      color: type === "Google" ? "#4285F4" : "#000000"
    }).setOrigin(0.5);
    
    // Tornar interativo
    circle.setInteractive({ useHandCursor: true });
    
    // Eventos
    circle.on("pointerdown", () => {
      this.sound.play("click");
      console.log(`${type} login clicked`);
      if (type === "Google") {
        window.open("https://accounts.google.com", "_blank");
      } else {
        window.open("https://appleid.apple.com", "_blank");
      }
    });
    
    // Efeitos de hover
    circle.on("pointerover", () => {
      circle.setScale(1.1);
      icon.setScale(1.1);
    });
    
    circle.on("pointerout", () => {
      circle.setScale(1.0);
      icon.setScale(1.0);
    });
  }
}