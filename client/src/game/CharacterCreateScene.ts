import { Scene } from "phaser";

interface CharacterOptions {
  name: string;
  hairStyle: number;
  hairColor: number;
  skinColor: number;
  characterClass: string;
}

export class CharacterCreateScene extends Scene {
  private options: CharacterOptions = {
    name: "",
    hairStyle: 1,
    hairColor: 1,
    skinColor: 1,
    characterClass: "Warrior"
  };
  
  private characterPreview: Phaser.GameObjects.Container | null = null;
  private classDescription: Phaser.GameObjects.Text | null = null;
  private nameInput: Phaser.GameObjects.Text | null = null;
  private totalHairStyles: number = 9;
  private totalHairColors: number = 5;
  private totalSkinColors: number = 4;
  
  // Class options and descriptions
  private classOptions = [
    {
      id: "Warrior",
      description: "Specialized in melee combat and\nmassive armor to defend their allies\nand deal powerful blows to enemies.",
      icon: "warrior-icon"
    },
    {
      id: "Priest",
      description: "With higher focus to resist crowd\ncontrol, they protect and heal allies\nthrough holy damage.",
      icon: "priest-icon"
    },
    {
      id: "Mage",
      description: "Powerful spellcasters who use\ndevastating elemental attacks\nagainst enemies.",
      icon: "mage-icon"
    }
  ];

  constructor() {
    super("CharacterCreateScene");
  }

  create() {
    // Background - brown panel to match the reference images
    this.createBackground();
    
    // Character customization options panel (left side)
    this.createCustomizationPanel();
    
    // Character preview in the center
    this.createCharacterPreview();
    
    // Character class selection panel (right side)
    this.createClassPanel();
    
    // Buttons at the bottom
    this.createButtons();
    
    // Update the character preview with initial values
    this.updateCharacterPreview();
  }
  
  private createBackground() {
    // Golden/brown panel background
    const background = this.add.graphics();
    background.fillStyle(0xc4a484, 1);
    background.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    
    // Border
    background.lineStyle(8, 0x8b5a2b, 1);
    background.strokeRect(4, 4, this.cameras.main.width - 8, this.cameras.main.height - 8);
    
    // Character name field at the top
    const nameFieldBg = this.add.graphics();
    nameFieldBg.fillStyle(0x3e2f1a, 1);
    nameFieldBg.fillRoundedRect(
      this.cameras.main.width / 2 - 125, 
      20, 
      250, 
      40, 
      10
    );
    
    // "Character name" text
    this.nameInput = this.add.text(
      this.cameras.main.width / 2,
      40,
      "Character name", 
      {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#cccccc",
        align: "center"
      }
    );
    this.nameInput.setOrigin(0.5);
    
    // Make name field interactive
    nameFieldBg.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        // In a real game, this would open an input dialog
        // For demo purposes, we'll just update the name
        const newName = prompt("Enter character name:");
        if (newName) {
          this.options.name = newName;
          if (this.nameInput) {
            this.nameInput.setText(newName);
          }
        }
      });
  }
  
  private createCustomizationPanel() {
    // Left panel with customization options
    // Hair style selection
    this.createSlider("Hair", 1, this.totalHairStyles, this.options.hairStyle, 150, (value) => {
      this.options.hairStyle = value;
      this.updateCharacterPreview();
    });
    
    // Hair color selection
    this.createSlider("Hair Color", 1, this.totalHairColors, this.options.hairColor, 220, (value) => {
      this.options.hairColor = value;
      this.updateCharacterPreview();
    });
    
    // Skin color selection
    this.createSlider("Skin Color", 1, this.totalSkinColors, this.options.skinColor, 290, (value) => {
      this.options.skinColor = value;
      this.updateCharacterPreview();
    });
  }
  
  private createSlider(label: string, min: number, max: number, currentValue: number, yPosition: number, callback: (value: number) => void) {
    // Slider container
    const sliderContainer = this.add.container(230, yPosition);
    
    // Slider background
    const sliderBg = this.add.graphics();
    sliderBg.fillStyle(0xb08d57, 1);
    sliderBg.fillRoundedRect(-150, -25, 300, 50, 8);
    
    // Label
    const labelText = this.add.text(0, 0, `${label} ${currentValue}/${max}`, {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#ffffff",
      align: "center"
    });
    labelText.setOrigin(0.5);
    
    // Left arrow
    const leftArrow = this.add.graphics();
    leftArrow.fillStyle(0x3e2f1a, 1);
    leftArrow.fillTriangle(-130, 0, -110, -15, -110, 15);
    
    // Right arrow
    const rightArrow = this.add.graphics();
    rightArrow.fillStyle(0x3e2f1a, 1);
    rightArrow.fillTriangle(130, 0, 110, -15, 110, 15);
    
    // Add all to container
    sliderContainer.add([sliderBg, labelText, leftArrow, rightArrow]);
    
    // Make arrows interactive
    const leftArrowHitArea = new Phaser.Geom.Rectangle(-140, -20, 40, 40);
    const rightArrowHitArea = new Phaser.Geom.Rectangle(100, -20, 40, 40);
    
    this.add.zone(-140 + 230, -20 + yPosition, 40, 40)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        let newValue = currentValue - 1;
        if (newValue < min) newValue = max;
        labelText.setText(`${label} ${newValue}/${max}`);
        callback(newValue);
      });
    
    this.add.zone(100 + 230, -20 + yPosition, 40, 40)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        let newValue = currentValue + 1;
        if (newValue > max) newValue = min;
        labelText.setText(`${label} ${newValue}/${max}`);
        callback(newValue);
      });
  }
  
  private createCharacterPreview() {
    // Center panel for character preview
    const previewBg = this.add.graphics();
    previewBg.fillStyle(0xb08d57, 0.5);
    previewBg.fillRoundedRect(
      this.cameras.main.width / 2 - 100, 
      100, 
      200, 
      250, 
      10
    );
    
    // Character container
    this.characterPreview = this.add.container(this.cameras.main.width / 2, 225);
  }
  
  private createClassPanel() {
    // Right panel for class selection
    const classPanelBg = this.add.graphics();
    classPanelBg.fillStyle(0xb08d57, 1);
    classPanelBg.fillRoundedRect(
      this.cameras.main.width - 350, 
      100, 
      330, 
      250, 
      10
    );
    
    // Class title
    const classTitleBg = this.add.graphics();
    classTitleBg.fillStyle(0x3e2f1a, 1);
    classTitleBg.fillRoundedRect(
      this.cameras.main.width - 300, 
      120, 
      230, 
      40, 
      10
    );
    
    const classTitle = this.add.text(
      this.cameras.main.width - 185,
      140,
      this.options.characterClass, 
      {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#ffffff",
        fontStyle: "bold",
        align: "center"
      }
    );
    classTitle.setOrigin(0.5);
    
    // Class description text
    this.classDescription = this.add.text(
      this.cameras.main.width - 185,
      200,
      this.getClassDescription(this.options.characterClass), 
      {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
        align: "center"
      }
    );
    this.classDescription.setOrigin(0.5, 0);
    
    // Class selection icons
    this.createClassIcons();
  }
  
  private createClassIcons() {
    const startX = this.cameras.main.width - 300;
    const y = 300;
    const spacing = 70;
    
    this.classOptions.forEach((classOption, index) => {
      const x = startX + (index * spacing);
      
      // Class icon background
      const iconBg = this.add.graphics();
      iconBg.fillStyle(0x3e2f1a, 1);
      iconBg.fillRect(x, y, 50, 50);
      
      // Icon border (highlight if selected)
      const isSelected = this.options.characterClass === classOption.id;
      const borderColor = isSelected ? 0xffffff : 0x666666;
      iconBg.lineStyle(3, borderColor, 1);
      iconBg.strokeRect(x, y, 50, 50);
      
      // Class symbol (temporary graphics for demo)
      const symbol = this.add.graphics();
      
      if (classOption.id === "Warrior") {
        // Warrior helmet icon
        symbol.fillStyle(0xaaaaaa, 1);
        symbol.fillCircle(x + 25, y + 20, 15);
        symbol.fillStyle(0x777777, 1);
        symbol.fillRect(x + 15, y + 25, 20, 10);
      } 
      else if (classOption.id === "Priest") {
        // Priest holy symbol
        symbol.fillStyle(0xffffff, 1);
        symbol.fillRect(x + 22, y + 10, 6, 30);
        symbol.fillRect(x + 10, y + 25, 30, 6);
      } 
      else if (classOption.id === "Mage") {
        // Mage hat icon
        symbol.fillStyle(0x3366cc, 1);
        symbol.fillTriangle(x + 10, y + 35, x + 40, y + 35, x + 25, y + 10);
        symbol.fillStyle(0xffcc00, 1);
        symbol.fillCircle(x + 25, y + 18, 4);
      }
      
      // Make icon interactive
      iconBg.setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.options.characterClass = classOption.id;
          this.updateClassSelection();
          this.updateCharacterPreview();
        });
    });
  }
  
  private createButtons() {
    // Cancel button - bottom left
    const cancelButton = this.add.graphics();
    cancelButton.fillStyle(0xf54a4a, 1);
    cancelButton.fillRoundedRect(
      150, 
      this.cameras.main.height - 80, 
      150, 
      50, 
      10
    );
    
    const cancelText = this.add.text(
      150 + 75,
      this.cameras.main.height - 55,
      "Cancel", 
      {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold"
      }
    );
    cancelText.setOrigin(0.5);
    
    // Create button - bottom right
    const createButton = this.add.graphics();
    createButton.fillStyle(0x76c442, 1);
    createButton.fillRoundedRect(
      this.cameras.main.width - 300, 
      this.cameras.main.height - 80, 
      150, 
      50, 
      10
    );
    
    const createText = this.add.text(
      this.cameras.main.width - 300 + 75,
      this.cameras.main.height - 55,
      "Create", 
      {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold"
      }
    );
    createText.setOrigin(0.5);
    
    // Make buttons interactive
    cancelButton.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start("CharacterSelectScene");
      });
    
    createButton.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        if (this.options.name && this.options.name.trim() !== "") {
          // Create character and go back to selection screen
          const newCharacter = {
            id: Date.now(),
            name: this.options.name,
            level: 1,
            class: this.options.characterClass,
            location: "Heartwood", // Default starting location
            isFavorite: false,
            hairStyle: this.options.hairStyle,
            hairColor: this.options.hairColor,
            skinColor: this.options.skinColor
          };
          
          // In a real game, this would save to a database
          console.log("Created character:", newCharacter);
          this.scene.start("CharacterSelectScene", { newCharacter });
        } else {
          // Alert user to enter a name
          alert("Please enter a character name!");
        }
      });
  }
  
  private updateClassSelection() {
    // Update class title
    const classTitle = this.children.getByName("class-title") as Phaser.GameObjects.Text;
    if (classTitle) {
      classTitle.setText(this.options.characterClass);
    }
    
    // Update class description
    if (this.classDescription) {
      this.classDescription.setText(this.getClassDescription(this.options.characterClass));
    }
    
    // Update class icons (highlight selected)
    this.createClassIcons(); // Recreate to update selection
  }
  
  private getClassDescription(className: string): string {
    const classInfo = this.classOptions.find(c => c.id === className);
    return classInfo ? classInfo.description : "";
  }
  
  private updateCharacterPreview() {
    if (!this.characterPreview) return;
    
    // Clear current preview
    this.characterPreview.removeAll();
    
    // Create character sprite based on options
    // Base character body
    const body = this.add.graphics();
    body.fillStyle(this.getSkinColor(this.options.skinColor), 1);
    body.fillCircle(0, -40, 20); // Head
    body.fillRect(-15, -20, 30, 40); // Body
    
    // Hair
    const hair = this.add.graphics();
    hair.fillStyle(this.getHairColor(this.options.hairColor), 1);
    
    // Different hair styles
    switch(this.options.hairStyle % this.totalHairStyles) {
      case 1: // Bald or very short
        hair.fillRect(-12, -45, 24, 5);
        break;
      case 2: // Short hair
        hair.fillRect(-15, -55, 30, 15);
        break;
      case 3: // Medium length
        hair.fillRect(-18, -55, 36, 20);
        hair.fillRect(-10, -35, 5, 10); // Side hair
        hair.fillRect(5, -35, 5, 10); // Side hair
        break;
      case 4: // Long hair
        hair.fillRect(-15, -55, 30, 15);
        hair.fillRect(-10, -40, 5, 30); // Side hair
        hair.fillRect(5, -40, 5, 30); // Side hair
        break;
      case 5: // Ponytail
        hair.fillRect(-15, -55, 30, 15);
        hair.fillRect(10, -40, 5, 40); // Ponytail
        break;
      case 6: // Mohawk
        hair.fillRect(-5, -65, 10, 25);
        break;
      case 7: // Afro
        hair.fillCircle(0, -50, 25);
        break;
      case 8: // Pigtails
        hair.fillRect(-15, -55, 30, 15);
        hair.fillRect(-20, -40, 8, 30); // Left pigtail
        hair.fillRect(12, -40, 8, 30); // Right pigtail
        break;
      default: // Default short hair
        hair.fillRect(-12, -50, 24, 10);
    }
    
    // Class-specific gear
    const gear = this.add.graphics();
    
    if (this.options.characterClass === "Warrior") {
      // Warrior armor
      gear.fillStyle(0x777777, 1); // Silver armor
      gear.fillRect(-18, -20, 36, 40); // Chest plate
      gear.fillStyle(0x555555, 1); // Darker metal
      gear.fillCircle(0, -40, 22); // Helmet outline
      gear.fillStyle(this.getSkinColor(this.options.skinColor), 1);
      gear.fillCircle(0, -40, 20); // Face area
      
      // Sword
      gear.fillStyle(0xaaaaaa, 1);
      gear.fillRect(20, -30, 5, 50); // Blade
      gear.fillStyle(0x8b5a2b, 1);
      gear.fillRect(17, -5, 11, 5); // Handle
    } 
    else if (this.options.characterClass === "Priest") {
      // Priest robe
      gear.fillStyle(0xffffff, 1); // White robe
      gear.fillRect(-16, -20, 32, 40);
      
      // Holy symbol
      gear.fillStyle(0xffdd00, 1); // Gold
      gear.fillRect(-5, -10, 10, 20); // Vertical line
      gear.fillRect(-10, -5, 20, 10); // Horizontal line
    } 
    else if (this.options.characterClass === "Mage") {
      // Mage robe
      gear.fillStyle(0x3366cc, 1); // Blue robe
      gear.fillRect(-16, -20, 32, 40);
      
      // Wizard hat
      gear.fillStyle(0x3366cc, 1);
      gear.fillTriangle(-15, -40, 15, -40, 0, -70);
      gear.fillStyle(0xffcc00, 1); // Gold trim
      gear.fillCircle(0, -55, 5);
      
      // Staff
      gear.fillStyle(0x8b5a2b, 1); // Brown staff
      gear.fillRect(20, -40, 5, 60);
      gear.fillStyle(0x3399ff, 1); // Blue crystal
      gear.fillCircle(22.5, -45, 8);
    }
    
    // Eyes
    const eyes = this.add.graphics();
    eyes.fillStyle(0x000000, 1);
    eyes.fillRect(-8, -45, 4, 4);
    eyes.fillRect(4, -45, 4, 4);
    
    // Mouth
    const mouth = this.add.graphics();
    mouth.fillStyle(0x000000, 1);
    mouth.fillRect(-5, -35, 10, 2);
    
    // Arms
    const arms = this.add.graphics();
    if (this.options.characterClass !== "Warrior") { // Non-warrior shows arms
      arms.fillStyle(this.getSkinColor(this.options.skinColor), 1);
      arms.fillRect(-25, -15, 10, 25); // Left arm
      arms.fillRect(15, -15, 10, 25); // Right arm
    }
    
    // Add all to container
    this.characterPreview.add([body, arms, gear, hair, eyes, mouth]);
  }
  
  private getSkinColor(index: number): number {
    const skinColors = [
      0xffe0bd, // Light
      0xf1c27d, // Tan
      0xc68642, // Brown
      0x8d5524  // Dark brown
    ];
    return skinColors[(index - 1) % skinColors.length];
  }
  
  private getHairColor(index: number): number {
    const hairColors = [
      0x090806, // Black
      0x71491e, // Dark brown
      0xb27e4b, // Light brown
      0xfff5e1, // Blonde
      0xa52a2a  // Red
    ];
    return hairColors[(index - 1) % hairColors.length];
  }
}