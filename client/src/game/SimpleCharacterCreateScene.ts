import { Scene } from "phaser";

// Uma implementação simplificada da tela de criação de personagem
// para resolver o problema de hitAreaCallback
export class SimpleCharacterCreateScene extends Scene {
  private characterClass: string = "Warrior";
  private hairStyle: number = 1;
  private hairColor: number = 1;
  private skinColor: number = 1;
  private characterPreview: Phaser.GameObjects.Container | null = null;
  private classDescription: Phaser.GameObjects.Text | null = null;

  constructor() {
    super("SimpleCharacterCreateScene");
  }

  create() {
    // Fundo
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xc4a484)
      .setOrigin(0, 0);
    
    // Borda
    const border = this.add.graphics();
    border.lineStyle(8, 0x8b5a2b, 1);
    border.strokeRect(4, 4, this.cameras.main.width - 8, this.cameras.main.height - 8);
    
    // Título - Character Creator
    this.add.text(this.cameras.main.width / 2, 40, "Character Creator", {
      fontFamily: "MedievalSharp",
      fontSize: "32px",
      color: "#ffffff"
    }).setOrigin(0.5);
    
    // Campo de nome do personagem
    this.createNameField();
    
    // Painel de personalização
    this.createCustomizationOptions();
    
    // Painel de prévia
    this.createCharacterPreview();
    
    // Painel de classes
    this.createClassPanel();
    
    // Botões de ação
    this.createActionButtons();
    
    // Atualizar prévia do personagem
    this.updateCharacterPreview();
  }
  
  // Campo para nome do personagem
  private characterName: string = "";
  
  private createNameField() {
    const nameField = this.add.rectangle(
      this.cameras.main.width / 2,
      90,
      300,
      40,
      0x3e2f1a
    ).setInteractive();
    
    const nameText = this.add.text(
      this.cameras.main.width / 2,
      90,
      "Character name",
      {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#cccccc"
      }
    ).setOrigin(0.5);
    
    nameField.on('pointerdown', () => {
      const name = prompt("Enter character name (min 3 letters):");
      if (name) {
        if (name.length >= 3) {
          this.characterName = name;
          nameText.setText(name);
        } else {
          alert("Name must be at least 3 letters long!");
        }
      }
    });
  }
  
  // Opções de personalização (cabelo, cor, etc)
  private createCustomizationOptions() {
    const options = [
      {
        name: "Hair Style",
        value: this.hairStyle,
        max: 9,
        onChange: (val: number) => { this.hairStyle = val; this.updateCharacterPreview(); }
      },
      {
        name: "Hair Color",
        value: this.hairColor,
        max: 5,
        onChange: (val: number) => { this.hairColor = val; this.updateCharacterPreview(); }
      },
      {
        name: "Skin Color",
        value: this.skinColor,
        max: 4,
        onChange: (val: number) => { this.skinColor = val; this.updateCharacterPreview(); }
      }
    ];
    
    options.forEach((option, index) => {
      const y = 170 + (index * 70);
      
      // Background
      this.add.rectangle(220, y, 300, 50, 0xb08d57)
        .setStrokeStyle(2, 0x000000);
      
      // Label
      const label = this.add.text(220, y, `${option.name} ${option.value}/${option.max}`, {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffffff"
      }).setOrigin(0.5);
      
      // Left/Right buttons
      const leftBtn = this.add.triangle(110, y, 0, 0, 20, 10, 0, 20, 0x3e2f1a)
        .setOrigin(0.5);
        
      const rightBtn = this.add.triangle(330, y, 0, 0, 0, 10, 20, 20, 0x3e2f1a)
        .setOrigin(0.5);
      
      // Make buttons interactive
      leftBtn.setInteractive()
        .on('pointerdown', () => {
          let newVal = option.value - 1;
          if (newVal < 1) newVal = option.max;
          option.onChange(newVal);
          label.setText(`${option.name} ${newVal}/${option.max}`);
        });
      
      rightBtn.setInteractive()
        .on('pointerdown', () => {
          let newVal = option.value + 1;
          if (newVal > option.max) newVal = 1;
          option.onChange(newVal);
          label.setText(`${option.name} ${newVal}/${option.max}`);
        });
    });
  }
  
  // Prévia do personagem
  private createCharacterPreview() {
    // Background do painel de prévia
    this.add.rectangle(
      this.cameras.main.width / 2,
      320,
      200,
      250,
      0xb08d57,
      0.5
    );
    
    // Container para o personagem
    this.characterPreview = this.add.container(this.cameras.main.width / 2, 320);
  }
  
  // Painel de seleção de classe
  private createClassPanel() {
    // Painel de classe
    this.add.rectangle(
      this.cameras.main.width - 200,
      200,
      330,
      250,
      0xb08d57
    );
    
    // Título da classe
    const classTitle = this.add.text(
      this.cameras.main.width - 200,
      150,
      this.characterClass,
      {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
        fontStyle: "bold"
      }
    ).setOrigin(0.5);
    
    // Descrição da classe
    this.classDescription = this.add.text(
      this.cameras.main.width - 200,
      200,
      this.getClassDescription(),
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 280 }
      }
    ).setOrigin(0.5, 0);
    
    // Ícones de classe
    const classes = ["Warrior", "Priest", "Mage"];
    classes.forEach((cls, index) => {
      const x = this.cameras.main.width - 320 + (index * 70);
      const y = 320;
      
      // Fundo do ícone
      const iconBg = this.add.rectangle(x, y, 50, 50, 0x3e2f1a)
        .setStrokeStyle(2, cls === this.characterClass ? 0xffffff : 0x666666);
      
      // Ícone
      let icon;
      if (cls === "Warrior") {
        icon = this.add.text(x, y, "W", { 
          fontFamily: "Arial", 
          fontSize: "30px", 
          color: "#aaaaaa",
          fontStyle: "bold"
        }).setOrigin(0.5);
      } else if (cls === "Priest") {
        icon = this.add.text(x, y, "P", { 
          fontFamily: "Arial", 
          fontSize: "30px", 
          color: "#ffffff",
          fontStyle: "bold"
        }).setOrigin(0.5);
      } else { // Mage
        icon = this.add.text(x, y, "M", { 
          fontFamily: "Arial", 
          fontSize: "30px", 
          color: "#3366cc",
          fontStyle: "bold"
        }).setOrigin(0.5);
      }
      
      // Interatividade
      iconBg.setInteractive()
        .on('pointerdown', () => {
          this.characterClass = cls;
          classTitle.setText(cls);
          this.classDescription?.setText(this.getClassDescription());
          this.updateCharacterPreview();
          
          // Atualizar bordas dos ícones
          this.children.getAll().forEach(child => {
            if (child instanceof Phaser.GameObjects.Rectangle && 
                child.width === 50 && child.height === 50) {
              const isSelected = child.x === iconBg.x && child.y === iconBg.y;
              child.setStrokeStyle(2, isSelected ? 0xffffff : 0x666666);
            }
          });
        });
    });
  }
  
  // Botões de ação (criar/cancelar)
  private createActionButtons() {
    // Botão Cancelar
    const cancelBtn = this.add.rectangle(200, this.cameras.main.height - 70, 150, 50, 0xf54a4a)
      .setInteractive();
    
    this.add.text(200, this.cameras.main.height - 70, "Cancel", {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#ffffff"
    }).setOrigin(0.5);
    
    // Botão Criar
    const createBtn = this.add.rectangle(this.cameras.main.width - 200, this.cameras.main.height - 70, 150, 50, 0x76c442)
      .setInteractive();
    
    this.add.text(this.cameras.main.width - 200, this.cameras.main.height - 70, "Create", {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#ffffff"
    }).setOrigin(0.5);
    
    // Eventos
    cancelBtn.on('pointerdown', () => {
      this.scene.start("SimpleLoginScene");
    });
    
    createBtn.on('pointerdown', () => {
      if (this.characterName.length >= 3) {
        // Criar objeto de personagem
        const newCharacter = {
          id: new Date().getTime(), // ID único baseado no timestamp
          name: this.characterName,
          level: 1,
          class: this.characterClass,
          hairStyle: this.hairStyle,
          hairColor: this.hairColor,
          skinColor: this.skinColor,
          location: "Heartwood",
          isFavorite: false,
          createdAt: new Date().toISOString()
        };
        
        // Salvar o personagem no localStorage
        this.saveCharacter(newCharacter);
        
        alert(`Character ${this.characterName} created successfully!`);
        this.scene.start("CharacterSelectScene", { characters: this.getCharacters() });
      } else {
        alert("Please enter a valid name with at least 3 letters!");
      }
    });
  }
  
  // Pegar descrição da classe selecionada
  private getClassDescription(): string {
    switch(this.characterClass) {
      case "Warrior":
        return "Specialized in melee combat and massive armor to defend their allies and deal powerful blows to enemies.";
      case "Priest":
        return "With higher focus to resist crowd control, they protect and heal allies through holy damage.";
      case "Mage":
        return "Powerful spellcasters who use devastating elemental attacks against enemies.";
      default:
        return "";
    }
  }
  
  // Atualizar a prévia do personagem
  private updateCharacterPreview() {
    if (!this.characterPreview) return;
    
    this.characterPreview.removeAll();
    
    // Corpo
    const body = this.add.graphics();
    body.fillStyle(this.getSkinColor(), 1);
    body.fillCircle(0, -40, 20);
    body.fillRect(-15, -20, 30, 40);
    
    // Cabelo
    const hair = this.add.graphics();
    hair.fillStyle(this.getHairColor(), 1);
    
    // Diferentes estilos de cabelo
    switch(this.hairStyle) {
      case 1: // Curto
        hair.fillRect(-12, -45, 24, 5);
        break;
      case 2: // Médio
        hair.fillRect(-15, -55, 30, 15);
        break;
      case 3: // Longo
        hair.fillRect(-18, -55, 36, 20);
        hair.fillRect(-10, -35, 5, 10);
        hair.fillRect(5, -35, 5, 10);
        break;
      default:
        hair.fillRect(-12, -45, 24, 5);
    }
    
    // Items específicos da classe
    const classItems = this.add.graphics();
    
    if (this.characterClass === "Warrior") {
      // Armadura
      classItems.fillStyle(0x777777, 1);
      classItems.fillRect(-18, -20, 36, 40);
      
      // Espada
      classItems.fillStyle(0xaaaaaa, 1);
      classItems.fillRect(20, -30, 5, 50);
    } 
    else if (this.characterClass === "Priest") {
      // Veste
      classItems.fillStyle(0xffffff, 1);
      classItems.fillRect(-16, -20, 32, 40);
      
      // Símbolo
      classItems.fillStyle(0xffdd00, 1);
      classItems.fillRect(-5, -10, 10, 20);
      classItems.fillRect(-10, -5, 20, 10);
    } 
    else if (this.characterClass === "Mage") {
      // Veste
      classItems.fillStyle(0x3366cc, 1);
      classItems.fillRect(-16, -20, 32, 40);
      
      // Chapéu
      classItems.fillStyle(0x3366cc, 1);
      classItems.fillTriangle(-15, -40, 15, -40, 0, -70);
      classItems.fillStyle(0xffcc00, 1);
      classItems.fillCircle(0, -55, 5);
    }
    
    // Olhos
    const eyes = this.add.graphics();
    eyes.fillStyle(0x000000, 1);
    eyes.fillRect(-8, -45, 4, 4);
    eyes.fillRect(4, -45, 4, 4);
    
    // Boca
    const mouth = this.add.graphics();
    mouth.fillStyle(0x000000, 1);
    mouth.fillRect(-5, -35, 10, 2);
    
    // Adicionar tudo ao container
    this.characterPreview.add([body, classItems, hair, eyes, mouth]);
  }
  
  // Cores de pele
  private getSkinColor(): number {
    const colors = [
      0xffe0bd, // Claro
      0xf1c27d, // Bronzeado
      0xc68642, // Marrom médio
      0x8d5524  // Marrom escuro
    ];
    return colors[this.skinColor - 1] || colors[0];
  }
  
  // Cores de cabelo
  private getHairColor(): number {
    const colors = [
      0x090806, // Preto
      0x71491e, // Marrom escuro
      0xb27e4b, // Marrom claro
      0xfff5e1, // Loiro
      0xa52a2a  // Ruivo
    ];
    return colors[this.hairColor - 1] || colors[0];
  }
  
  // Salvar um novo personagem
  private saveCharacter(character: any): void {
    try {
      // Recuperar personagens existentes
      const savedCharacters = this.getCharacters();
      
      // Adicionar o novo personagem
      savedCharacters.push(character);
      
      // Salvar no localStorage
      localStorage.setItem('heartwoodCharacters', JSON.stringify(savedCharacters));
      
      console.log("Character saved:", character);
    } catch (error) {
      console.error("Error saving character:", error);
      alert("Failed to save character. Please try again.");
    }
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
}