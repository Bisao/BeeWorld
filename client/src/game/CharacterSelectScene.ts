import { Scene } from "phaser";
import { SimpleButton } from "./SimpleButton";

export class CharacterSelectScene extends Scene {
  private characters: any[] = [];
  private selectedCharacterIndex: number = 0;
  private characterDisplay: Phaser.GameObjects.Container | null = null;
  private characterNameText: Phaser.GameObjects.Text | null = null;
  private characterList: Phaser.GameObjects.Container | null = null;

  constructor() {
    super("CharacterSelectScene");
  }

  init(data: any) {
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
    // Background
    const background = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "grass-texture");
    background.setOrigin(0, 0);

    this.createWorldElements();
    this.createCharacterDisplay();
    this.createCharacterList();
    this.createActionButtons();
    this.createWorldSelector();
    this.createLogoutButton();

    if (this.characters.length > 0) {
      this.selectCharacter(0);
    }
  }

  private createWorldElements() {
    // Add decorative elements
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
      const y = Phaser.Math.Between(50, this.cameras.main.height - 50);
      const scale = Phaser.Math.FloatBetween(0.8, 1.2);

      this.add.circle(x, y, 20 * scale, 0x2a5e1e);
      this.add.rectangle(x, y + 15 * scale, 6 * scale, 25 * scale, 0x5a3928);
    }
  }
  
  private createCharacterDisplay() {
    // Display panel
    const panel = this.add.rectangle(
      this.cameras.main.width / 2,
      230,
      300,
      300,
      0xc4a484,
      0.9
    );

    this.characterDisplay = this.add.container(this.cameras.main.width / 2, 230);

    this.characterNameText = this.add.text(this.cameras.main.width / 2, 110, "", {
      fontFamily: "MedievalSharp",
      fontSize: "24px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4
    }).setOrigin(0.5);
  }

  private validateCharacterName(name: string): boolean {
    return name.length >= 3 && name.length <= 16 && /^[a-zA-Z0-9]+$/.test(name);
}

private saveCharacter(character: any): void {
    try {
        // Recupera personagens existentes
        const savedCharactersStr = localStorage.getItem('heartwoodCharacters');
        const savedCharacters = savedCharactersStr ? JSON.parse(savedCharactersStr) : [];
        
        // Adiciona o novo personagem
        savedCharacters.push(character);
        
        // Salva no localStorage
        localStorage.setItem('heartwoodCharacters', JSON.stringify(savedCharacters));
        
        console.log("Character saved:", character);
    } catch (error) {
        console.error("Error saving character:", error);
        throw new Error("Failed to save character");
    }
}

private createCharacterList() {
    // Panel background
    const panel = this.add.rectangle(
      this.cameras.main.width - 165,
      280,
      270,
      400,
      0x333333,
      0.8
    );

    this.characterList = this.add.container(this.cameras.main.width - 165, 130);

    this.characters.forEach((character, index) => {
      const yOffset = index * 80;

      // Character entry container
      const entryContainer = this.add.container(0, yOffset);

      // Background for entry
      const bg = this.add.rectangle(
        0,
        0,
        240,
        70,
        character.isFavorite ? 0xd4af37 : 0x444444,
        0.9
      ).setInteractive({ useHandCursor: true });

      // Name text
      const nameText = this.add.text(0, -15, character.name, {
        fontFamily: "MedievalSharp",
        fontSize: "20px",
        color: "#ffffff"
      }).setOrigin(0.5);

      // Info text
      const infoText = this.add.text(0, 10, 
        `Level ${character.level} ${character.class}\n${character.location}`, {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#ffffff",
        align: "center"
      }).setOrigin(0.5);

      // Add interaction
      bg.on('pointerover', () => {
        bg.setFillStyle(0xffffff, 0.2);
      });

      bg.on('pointerout', () => {
        bg.setFillStyle(character.isFavorite ? 0xd4af37 : 0x444444, 0.9);
      });

      bg.on('pointerdown', () => {
        this.selectCharacter(index);
      });

      entryContainer.add([bg, nameText, infoText]);
      this.characterList.add(entryContainer);
    });

    // Create new character button
    const createButton = new SimpleButton(
      this,
      this.cameras.main.width - 165,
      130 + this.characters.length * 80 + 50,
      190,
      50,
      "Create new\ncharacter",
      { fontFamily: "Arial", fontSize: "16px", color: "#ffffff", align: "center" },
      0xffaa00,
      () => this.showCreateCharacterScreen()
    );
  }

  private createActionButtons() {
    // Play button
    const playButton = new SimpleButton(
      this,
      this.cameras.main.width / 2,
      425,
      200,
      50,
      "Play",
      { fontFamily: "Arial", fontSize: "24px", color: "#ffffff", fontStyle: "bold" },
      0x76c442,
      () => this.handlePlay()
    );

    // Delete button
    const deleteButton = new SimpleButton(
      this,
      this.cameras.main.width / 2 - 65,
      490,
      110,
      40,
      "⊘ Delete",
      { fontFamily: "Arial", fontSize: "16px", color: "#ffffff" },
      0xf54a4a,
      () => this.handleDelete()
    );

    // Favorite button
    const favoriteButton = new SimpleButton(
      this,
      this.cameras.main.width / 2 + 65,
      490,
      110,
      40,
      "Set Favorite",
      { fontFamily: "Arial", fontSize: "16px", color: "#ffffff" },
      0x4aac4a,
      () => this.handleSetFavorite()
    );
  }

  private createWorldSelector() {
    const worldButton = new SimpleButton(
      this,
      80,
      this.cameras.main.height - 35,
      120,
      50,
      "Amazonia\nWilds",
      { fontFamily: "MedievalSharp", fontSize: "16px", color: "#ffffff", align: "center" },
      0x0088cc,
      () => console.log("World select clicked")
    );
  }

  private createLogoutButton() {
    const logoutButton = new SimpleButton(
      this,
      this.cameras.main.width - 60,
      this.cameras.main.height - 30,
      80,
      40,
      "Logout",
      { fontFamily: "Arial", fontSize: "16px", color: "#ffffff" },
      0x3498db,
      () => this.scene.start("LoginScene")
    );
  }

  private handlePlay() {
    if (this.characters.length > 0) {
      const selectedCharacter = this.characters[this.selectedCharacterIndex];
      console.log(`Playing with character: ${selectedCharacter.name}`);
    }
  }

  private handleDelete() {
    if (this.characters.length > 0) {
      this.deleteCharacter(this.selectedCharacterIndex);
    }
  }

  private handleSetFavorite() {
    if (this.characters.length > 0) {
      this.setAsFavorite(this.selectedCharacterIndex);
    }
  }

  private selectCharacter(index: number) {
    if (index < 0 || index >= this.characters.length) return;

    this.selectedCharacterIndex = index;
    const character = this.characters[index];

    if (this.characterDisplay) {
      this.characterDisplay.removeAll();
      this.createCharacterSprite(character.class);
    }

    if (this.characterNameText) {
      this.characterNameText.setText(character.name);
    }
  }

  private createCharacterSprite(characterClass: string) {
    const sprite = this.add.container(0, 0);
    const body = this.add.rectangle(0, 0, 30, 50, 0x333333);
    sprite.add(body);

    if (characterClass === "Mage") {
      const hat = this.add.triangle(0, -30, -15, 0, 15, 0, 0, -20, 0xffd700);
      sprite.add(hat);
    } else if (characterClass === "Priest") {
      const symbol = this.add.rectangle(0, 0, 20, 5, 0xffffff);
      sprite.add(symbol);
    }

    this.characterDisplay?.add(sprite);
  }

  private deleteCharacter(index: number) {
    if (confirm(`Delete character "${this.characters[index].name}"?`)) {
      this.characters.splice(index, 1);
      this.saveCharacters(this.characters);
      this.scene.restart({ characters: this.characters });
    }
  }

  private setAsFavorite(index: number) {
    this.characters.forEach(char => char.isFavorite = false);
    this.characters[index].isFavorite = true;
    this.saveCharacters(this.characters);
    this.scene.restart({ characters: this.characters });
  }

  private saveCharacters(characters: any[]) {
    try {
      localStorage.setItem('heartwoodCharacters', JSON.stringify(characters));
    } catch (error) {
      console.error("Error saving characters:", error);
    }
  }

  private showCreateCharacterScreen() {
    const name = prompt("Enter character name (3-16 alphanumeric characters):");
    if (name) {
        try {
            if (this.validateCharacterName(name)) {
                const newCharacter = {
                    id: Date.now(),
                    name: name,
                    level: 1,
                    class: "Warrior",
                    location: "Heartwood",
                    sprite: "warrior-character",
                    isFavorite: false,
                    createdAt: new Date().toISOString()
                };

                this.saveCharacter(newCharacter);
                this.characters.push(newCharacter);
                this.scene.restart({ characters: this.characters });
            } else {
                alert("Invalid name! Use 3-16 alphanumeric characters.");
                this.showCreateCharacterScreen();
            }
        } catch (error) {
            alert("Error creating character. Please try again.");
            console.error(error);
        }
    }
}
}