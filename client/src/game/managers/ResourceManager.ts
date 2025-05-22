import { Scene } from "phaser";

/**
 * Gerenciador de recursos do jogo
 */
export class ResourceManager {
  private scene: Scene;
  private gridSize: number;
  private resources: Phaser.GameObjects.Sprite[] = [];
  private occupiedTiles: Set<string> = new Set();
  private resourceShadows: Phaser.GameObjects.Ellipse[] = [];
  
  private resourceTypes = {
    trees: [
      { key: 'tree1', frequency: 0.03 },
      { key: 'tree2', frequency: 0.03 },
      { key: 'tree3', frequency: 0.03 },
      { key: 'Pine1', frequency: 0.02 },
      { key: 'Pine2', frequency: 0.02 },
      { key: 'Pine3', frequency: 0.02 },
      { key: 'OldTree1', frequency: 0.02 },
      { key: 'OldTree2', frequency: 0.02 },
      { key: 'OldTree3', frequency: 0.02 }
    ],
    stones: [
      { key: 'stone1', frequency: 0.02 },
      { key: 'stone2', frequency: 0.02 },
      { key: 'stone3', frequency: 0.02 },
      { key: 'stone4', frequency: 0.02 },
      { key: 'stone5', frequency: 0.02 },
      { key: 'stone6', frequency: 0.02 },
      { key: 'stone7', frequency: 0.02 },
      { key: 'stone8', frequency: 0.02 }
    ],
    tiles: [
      { key: 'grass1', frequency: 0.25 },
      { key: 'grass2', frequency: 0.25 },
      { key: 'grass3', frequency: 0.25 },
      { key: 'grass4', frequency: 0.25 }
    ]
  };

  constructor(scene: Scene, gridSize: number) {
    this.scene = scene;
    this.gridSize = gridSize;
  }

  /**
   * Retorna os tipos de recursos disponíveis
   */
  public getResourceTypes() {
    return this.resourceTypes;
  }

  /**
   * Retorna as sombras dos recursos
   */
  public getResourceShadows() {
    return this.resourceShadows;
  }

  /**
   * Cria os recursos no grid
   */
  public createResources() {
    const gridSize = 20;
    for (let i = 1; i < gridSize - 1; i++) {
      for (let j = 1; j < gridSize - 1; j++) {
        const chance = Math.random();

        if (chance < 0.15) { // 15% chance for trees
          this.placeRandomResource(i, j, this.resourceTypes.trees);
        } else if (chance < 0.25) { // 10% chance for stones
          this.placeRandomResource(i, j, this.resourceTypes.stones);
        }
      }
    }
  }

  /**
   * Verifica se uma área está ocupada
   */
  private isAreaOccupied(startI: number, startJ: number, size: number): boolean {
    for (let i = startI; i < startI + size; i++) {
      for (let j = startJ; j < startJ + size; j++) {
        if (this.occupiedTiles.has(`${i},${j}`)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Marca uma área como ocupada
   */
  private occupyArea(startI: number, startJ: number, size: number) {
    for (let i = startI; i < startI + size; i++) {
      for (let j = startJ; j < startJ + size; j++) {
        this.occupiedTiles.add(`${i},${j}`);
      }
    }
  }

  /**
   * Posiciona um recurso aleatório no grid
   */
  private placeRandomResource(i: number, j: number, resourceArray: Array<{key: string, frequency: number}>) {
    const resource = resourceArray[Math.floor(Math.random() * resourceArray.length)];
    let size = 1;
    
    if (resource.key.toLowerCase().includes('oldtree')) {
      size = 4;
      // Check if we have enough space for a 4x4 tree
      if (i > 16 || j > 16 || this.isAreaOccupied(i, j, size)) {
        return;
      }
    } else if (resource.key.toLowerCase().includes('pine')) {
      size = 2;
      // Check if we have enough space for a 2x2 tree
      if (i > 18 || j > 18 || this.isAreaOccupied(i, j, size)) {
        return;
      }
    } else {
      // Check if the single tile is occupied
      if (this.isAreaOccupied(i, j, size)) {
        return;
      }
    }

    let offsetX = 0;
    let offsetY = 0;
    
    // Calculate center position based on size
    if (resource.key.toLowerCase().includes('oldtree')) {
      offsetX = this.gridSize * 1.5;
      offsetY = this.gridSize * 1.5;
    } else if (resource.key.toLowerCase().includes('pine')) {
      offsetX = this.gridSize * 0.5;
      offsetY = this.gridSize * 0.5;
    }

    const resourceSprite = this.scene.add.sprite(
      i * this.gridSize + offsetX,
      j * this.gridSize + offsetY,
      resource.key
    );

    let scale = 1.0;
    if (resource.key.toLowerCase().includes('pine')) {
      scale = 1.2;
    } else if (resource.key.toLowerCase().includes('oldtree')) {
      scale = 4.0;
    }

    this.occupyArea(i, j, size);
    resourceSprite.setDisplaySize(this.gridSize * scale, this.gridSize * scale);
    resourceSprite.setDepth(2);
    
    // Adicionar efeito de sombra para o recurso
    const shadow = this.scene.add.ellipse(
      i * this.gridSize + offsetX,
      j * this.gridSize + offsetY + (this.gridSize * scale * 0.4),
      this.gridSize * scale * 0.7,
      this.gridSize * scale * 0.2,
      0x000000,
      0.3
    );
    shadow.setDepth(1);
    this.resourceShadows.push(shadow);
    
    // Adicionar efeito de hover
    resourceSprite.setInteractive();
    resourceSprite.on('pointerover', () => {
      resourceSprite.setTint(0xdddddd);
      this.scene.tweens.add({
        targets: resourceSprite,
        scaleX: scale * 1.05,
        scaleY: scale * 1.05,
        duration: 200,
        ease: 'Power1'
      });
    });
    
    resourceSprite.on('pointerout', () => {
      resourceSprite.clearTint();
      this.scene.tweens.add({
        targets: resourceSprite,
        scaleX: scale,
        scaleY: scale,
        duration: 200,
        ease: 'Power1'
      });
    });
    
    // Adicionar efeito de clique
    resourceSprite.on('pointerdown', () => {
      this.scene.tweens.add({
        targets: resourceSprite,
        scaleX: scale * 0.95,
        scaleY: scale * 0.95,
        duration: 100,
        yoyo: true,
        ease: 'Power1'
      });
    });
    
    this.resources.push(resourceSprite);
  }
}
