import { Scene } from "phaser";

export class CharacterSelectScene extends Scene {
  private characters: any[] = [];
  private selectedCharacterIndex: number = 0;
  private characterDisplay: Phaser.GameObjects.Container | null = null;
  private characterNameText: Phaser.GameObjects.Text | null = null;
  private characterLevelText: Phaser.GameObjects.Text | null = null;
  private characterList: Phaser.GameObjects.Container | null = null;

  constructor() {
    super("CharacterSelectScene");
  }

  init(data: any) {
    // If we have characters passed from the login scene, use them
    // Otherwise, for testing, we'll create some demo characters
    this.characters = data.characters || [
      { 
        id: 1, 
        name: "oChaps", 
        level: 25, 
        class: "Mage", 
        location: "Oakwood",
        sprite: "mage-character",
        isFavorite: true
      },
      { 
        id: 2, 
        name: "aPati", 
        level: 10, 
        class: "Priest", 
        location: "Heartwood",
        sprite: "priest-character",
        isFavorite: false
      }
    ];
  }

  create() {
    // Background - grass texture
    const background = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "grass-texture");
    background.setOrigin(0, 0);
    
    // Add some decorative elements to make it look like a world
    this.createWorldElements();

    // Create main UI containers
    this.createCharacterDisplay();
    this.createCharacterList();
    this.createButtons();
    
    // UI Header elements
    this.createHeader();
    
    // Add world selector at the bottom left
    this.createWorldSelector();

    // Logout button at the bottom right
    this.createLogoutButton();
    
    // Select the first character by default
    if (this.characters.length > 0) {
      this.selectCharacter(0);
    } else {
      this.showCreateCharacterScreen();
    }
  }
  
  private createWorldElements() {
    // Add trees, rocks, water, etc. to make it look like a game world
    // Trees
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
      const y = Phaser.Math.Between(50, this.cameras.main.height - 50);
      const scale = Phaser.Math.FloatBetween(0.8, 1.2);
      
      const tree = this.add.graphics();
      tree.fillStyle(0x2a5e1e, 1);
      tree.fillCircle(x, y, 20 * scale);
      tree.fillStyle(0x5a3928, 1);
      tree.fillRect(x - 3, y, 6 * scale, 25 * scale);
    }
    
    // Water on the right side
    const water = this.add.graphics();
    water.fillStyle(0x4a99e0, 0.8);
    water.fillRect(this.cameras.main.width - 200, 300, 200, 300);
    
    // Rocks
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
      const y = Phaser.Math.Between(50, this.cameras.main.height - 50);
      const scale = Phaser.Math.FloatBetween(0.7, 1.1);
      
      const rock = this.add.graphics();
      rock.fillStyle(0x888888, 1);
      rock.fillCircle(x, y, 10 * scale);
    }
    
    // Path
    const path = this.add.graphics();
    path.fillStyle(0xc4a484, 0.7);
    path.fillRect(100, this.cameras.main.height/2 - 20, this.cameras.main.width - 200, 40);
  }
  
  private createHeader() {
    // Privacy Policy button in top-left
    const privacyButton = this.add.rectangle(100, 30, 150, 40, 0x00a0e0, 1);
    const privacyText = this.add.text(100, 30, "Privacy Policy", { 
      fontFamily: "Arial", 
      fontSize: "18px", 
      color: "#ffffff" 
    });
    privacyText.setOrigin(0.5);
    
    privacyButton.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        console.log("Privacy Policy clicked");
      });
  }
  
  private createCharacterDisplay() {
    // Center panel for displaying the selected character
    const centerPanel = this.add.graphics();
    centerPanel.fillStyle(0xc4a484, 0.9);
    centerPanel.fillRoundedRect(
      this.cameras.main.width / 2 - 150, 
      80, 
      300, 
      300, 
      16
    );
    centerPanel.lineStyle(4, 0x8b5a2b, 1);
    centerPanel.strokeRoundedRect(
      this.cameras.main.width / 2 - 150, 
      80, 
      300, 
      300, 
      16
    );
    
    // Character container
    this.characterDisplay = this.add.container(this.cameras.main.width / 2, 230);
    
    // Character name at top of panel
    this.characterNameText = this.add.text(this.cameras.main.width / 2, 110, "", {
      fontFamily: "MedievalSharp",
      fontSize: "24px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4
    });
    this.characterNameText.setOrigin(0.5);
    
    // Character level and class will be set when a character is selected
  }
  
  private createCharacterList() {
    // Right panel for the character list
    const rightPanel = this.add.graphics();
    rightPanel.fillStyle(0x333333, 0.8);
    rightPanel.fillRoundedRect(
      this.cameras.main.width - 300, 
      80, 
      270, 
      400, 
      16
    );
    rightPanel.lineStyle(3, 0x666666, 1);
    rightPanel.strokeRoundedRect(
      this.cameras.main.width - 300, 
      80, 
      270, 
      400, 
      16
    );
    
    // Character list container
    this.characterList = this.add.container(this.cameras.main.width - 165, 130);
    
    // Create character entry for each character
    this.characters.forEach((character, index) => {
      const yOffset = index * 80;
      
      // Character entry background - different color for favorite
      const entryBg = this.add.graphics();
      const bgColor = character.isFavorite ? 0xd4af37 : 0x444444;
      entryBg.fillStyle(bgColor, 0.9);
      entryBg.fillRoundedRect(-120, yOffset - 30, 240, 70, 8);
      
      // Character name
      const nameText = this.add.text(0, yOffset - 15, character.name, {
        fontFamily: "MedievalSharp",
        fontSize: "20px",
        color: "#ffffff"
      });
      nameText.setOrigin(0.5, 0.5);
      
      // Character level and class
      const infoText = this.add.text(0, yOffset + 10, 
        `Level ${character.level} ${character.class}\n${character.location}`, {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#ffffff",
        align: "center"
      });
      infoText.setOrigin(0.5, 0.5);
      
      // Make the entry interactive usando zona retangular
      const hitZone = this.add.rectangle(0, yOffset, 240, 70)
        .setOrigin(0.5)
        .setInteractive()
        .setFillStyle(0x000000, 0); // Transparente
      
      hitZone.on('pointerdown', () => {
        this.selectCharacter(index);
        console.log(`Selected character: ${character.name}`);
      });
      
      hitZone.on('pointerover', () => {
        hitZone.setFillStyle(0xffffff, 0.1);
      });
      
      hitZone.on('pointerout', () => {
        hitZone.setFillStyle(0x000000, 0);
      });
      
      // Add all elements to the container
      this.characterList.add([entryBg, nameText, infoText]);
    });
    
    // "Create new character" button at the bottom of the list
    const createButtonY = 130 + this.characters.length * 80 + 20;
    
    const createButton = this.add.graphics();
    createButton.fillStyle(0xffaa00, 1);
    createButton.fillRoundedRect(
      this.cameras.main.width - 260, 
      createButtonY, 
      190, 
      50, 
      10
    );
    createButton.lineStyle(3, 0xcc8800, 1);
    createButton.strokeRoundedRect(
      this.cameras.main.width - 260, 
      createButtonY, 
      190, 
      50, 
      10
    );
    
    const createText = this.add.text(
      this.cameras.main.width - 165,
      createButtonY + 25,
      "Create new\ncharacter", 
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
        fontStyle: "bold",
        align: "center"
      }
    );
    createText.setOrigin(0.5);
    
    createButton.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.showCreateCharacterScreen();
      });
  }
  
  private createButtons() {
    // Play button under the character display
    const playButton = this.add.graphics();
    playButton.fillStyle(0x76c442, 1);
    playButton.fillRoundedRect(
      this.cameras.main.width / 2 - 100, 
      400, 
      200, 
      50, 
      10
    );
    playButton.lineStyle(3, 0x5ba332, 1);
    playButton.strokeRoundedRect(
      this.cameras.main.width / 2 - 100, 
      400, 
      200, 
      50, 
      10
    );
    
    const playText = this.add.text(
      this.cameras.main.width / 2,
      425,
      "Play", 
      {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
        fontStyle: "bold"
      }
    );
    playText.setOrigin(0.5);
    
    playButton.setInteractive(new Phaser.Geom.Rectangle(
      this.cameras.main.width / 2 - 100,
      400,
      200,
      50
    ), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => {
        if (this.characters.length > 0) {
          const selectedCharacter = this.characters[this.selectedCharacterIndex];
          console.log(`Playing with character: ${selectedCharacter.name}`);
          // In a real game, this would transition to the game world
          // this.scene.start("GameScene", { character: selectedCharacter });
        }
      });
    
    // Delete and Set Favorite buttons below Play
    const deleteButton = this.add.graphics();
    deleteButton.fillStyle(0xf54a4a, 1);
    deleteButton.fillRoundedRect(
      this.cameras.main.width / 2 - 120, 
      470, 
      110, 
      40, 
      10
    );
    
    const deleteText = this.add.text(
      this.cameras.main.width / 2 - 95,
      470 + 20,
      "⊘ Delete", 
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff"
      }
    );
    deleteText.setOrigin(0.5);
    
    deleteButton.setInteractive(new Phaser.Geom.Rectangle(
      this.cameras.main.width / 2 - 120,
      470,
      110,
      40
    ), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => {
        if (this.characters.length > 0) {
          this.deleteCharacter(this.selectedCharacterIndex);
        }
      });
    
    const favoriteButton = this.add.graphics();
    favoriteButton.fillStyle(0x4aac4a, 1);
    favoriteButton.fillRoundedRect(
      this.cameras.main.width / 2 + 10, 
      470, 
      110, 
      40, 
      10
    );
    
    const favoriteText = this.add.text(
      this.cameras.main.width / 2 + 65,
      470 + 20,
      "Set Favorite", 
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff"
      }
    );
    favoriteText.setOrigin(0.5);
    
    favoriteButton.setInteractive(new Phaser.Geom.Rectangle(
      this.cameras.main.width / 2 + 10,
      470,
      110,
      40
    ), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => {
        if (this.characters.length > 0) {
          this.setAsFavorite(this.selectedCharacterIndex);
        }
      });
  }
  
  private createWorldSelector() {
    // World selector button at bottom left
    const worldSelectorBg = this.add.graphics();
    worldSelectorBg.fillStyle(0x0088cc, 1);
    worldSelectorBg.fillRoundedRect(20, this.cameras.main.height - 60, 120, 50, 10);
    
    const worldName = this.add.text(80, this.cameras.main.height - 45, "Amazonia", {
      fontFamily: "MedievalSharp",
      fontSize: "18px",
      color: "#ffffff"
    });
    worldName.setOrigin(0.5, 0.5);
    
    const worldDescription = this.add.text(80, this.cameras.main.height - 25, "Wilds", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#ffffff"
    });
    worldDescription.setOrigin(0.5, 0.5);
    
    const selectWorldText = this.add.text(20, this.cameras.main.height - 75, "Select World", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#ffffff"
    });
    
    worldSelectorBg.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        console.log("Select World clicked");
      });
  }
  
  private createLogoutButton() {
    // Logout button at bottom right
    const logoutButton = this.add.graphics();
    logoutButton.fillStyle(0x3498db, 1);
    logoutButton.fillRoundedRect(
      this.cameras.main.width - 100, 
      this.cameras.main.height - 50, 
      80, 
      40, 
      10
    );
    
    const logoutText = this.add.text(
      this.cameras.main.width - 60,
      this.cameras.main.height - 30,
      "Logout", 
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff"
      }
    );
    logoutText.setOrigin(0.5);
    
    logoutButton.setInteractive(new Phaser.Geom.Rectangle(
      this.cameras.main.width - 100,
      this.cameras.main.height - 50,
      80,
      40
    ), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => {
        console.log("Logout clicked");
        this.scene.start("LoginScene");
      });
  }
  
  private selectCharacter(index: number) {
    if (index < 0 || index >= this.characters.length) {
      return;
    }
    
    this.selectedCharacterIndex = index;
    const character = this.characters[index];
    
    // Update character display
    if (this.characterDisplay) {
      this.characterDisplay.removeAll();
      
      // Simple character sprite representation (would use actual sprites in a real game)
      const characterSprite = this.createCharacterSprite(character.class);
      this.characterDisplay.add(characterSprite);
    }
    
    // Update character name
    if (this.characterNameText) {
      this.characterNameText.setText(character.name);
    }
  }
  
  private createCharacterSprite(characterClass: string): Phaser.GameObjects.Container {
    const container = this.add.container(0, 0);
    const body = this.add.graphics();
    
    // Different colors/appearance based on class
    if (characterClass === "Mage") {
      // Mage with yellow hat
      body.fillStyle(0x333333, 1); // Black robe
      body.fillRect(-15, -10, 30, 50);
      
      // Yellow hat
      const hat = this.add.graphics();
      hat.fillStyle(0xffd700, 1);
      hat.fillTriangle(-15, -10, 15, -10, 0, -30);
      
      // Staff
      const staff = this.add.graphics();
      staff.fillStyle(0xaaaaaa, 1);
      staff.fillRect(15, -15, 5, 40);
      
      container.add([body, hat, staff]);
    } 
    else if (characterClass === "Priest") {
      // Priest with white details
      body.fillStyle(0x333333, 1); // Black robe
      body.fillRect(-15, -10, 30, 50);
      
      // White collar
      const collar = this.add.graphics();
      collar.fillStyle(0xffffff, 1);
      collar.fillRect(-10, -5, 20, 5);
      
      // Symbol
      const symbol = this.add.graphics();
      symbol.fillStyle(0xffffff, 1);
      symbol.fillRect(-3, 5, 6, 15);
      symbol.fillRect(-8, 10, 16, 5);
      
      container.add([body, collar, symbol]);
    } 
    else {
      // Warrior with armor
      body.fillStyle(0x777777, 1); // Silver armor
      body.fillRect(-15, -5, 30, 45);
      
      // Helmet
      const helmet = this.add.graphics();
      helmet.fillStyle(0x555555, 1);
      helmet.fillRect(-12, -15, 24, 10);
      
      // Sword
      const sword = this.add.graphics();
      sword.fillStyle(0xaaaaaa, 1);
      sword.fillRect(15, -10, 5, 30);
      sword.fillRect(10, -15, 15, 5);
      
      container.add([body, helmet, sword]);
    }
    
    // Head
    const head = this.add.graphics();
    head.fillStyle(0xffe0bd, 1);
    head.fillCircle(0, -25, 10);
    
    // Eyes
    const eyes = this.add.graphics();
    eyes.fillStyle(0x000000, 1);
    eyes.fillRect(-5, -28, 3, 3);
    eyes.fillRect(2, -28, 3, 3);
    
    container.add([head, eyes]);
    
    return container;
  }
  
  // Recuperar todos os personagens
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
  
  // Salvar personagens
  private saveCharacters(characters: any[]): void {
    try {
      localStorage.setItem('heartwoodCharacters', JSON.stringify(characters));
      console.log("Characters saved:", characters);
    } catch (error) {
      console.error("Error saving characters:", error);
    }
  }
  
  // Deletar um personagem
  private deleteCharacter(index: number): void {
    if (index < 0 || index >= this.characters.length) {
      return;
    }
    
    const characterName = this.characters[index].name;
    if (confirm(`Are you sure you want to delete character "${characterName}"?`)) {
      // Remover personagem do array
      this.characters.splice(index, 0);
      
      // Salvar alterações
      this.saveCharacters(this.characters);
      
      // Atualizar a interface - reiniciar a cena
      this.scene.restart({ characters: this.characters });
      
      // Notificar usuário
      alert(`Character "${characterName}" has been deleted.`);
    }
  }
  
  // Definir um personagem como favorito
  private setAsFavorite(index: number): void {
    if (index < 0 || index >= this.characters.length) {
      return;
    }
    
    // Desmarca todos os personagens como favoritos
    this.characters.forEach(char => char.isFavorite = false);
    
    // Define o personagem selecionado como favorito
    this.characters[index].isFavorite = true;
    
    // Salvar alterações
    this.saveCharacters(this.characters);
    
    // Atualizar a interface - reiniciar a cena
    this.scene.restart({ characters: this.characters });
    
    // Notificar usuário
    alert(`${this.characters[index].name} is now your favorite character!`);
  }
  
  private showCreateCharacterScreen() {
    this.scene.start("SimpleCharacterCreateScene");
  }
}