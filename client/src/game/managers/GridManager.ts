import { Scene } from "phaser";

/**
 * Gerenciador de grid e terreno
 */
export class GridManager {
  private scene: Scene;
  private gridSize: number;
  private gridGraphics!: Phaser.GameObjects.Graphics;
  private gridVisible: boolean = true;
  
  constructor(scene: Scene, gridSize: number) {
    this.scene = scene;
    this.gridSize = gridSize;
  }
  
  /**
   * Cria o terreno do jogo
   */
  public createTerrain(tileTypes: Array<{key: string, frequency: number}>) {
    const gridSize = 20;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const randomGrass = tileTypes[Math.floor(Math.random() * tileTypes.length)];
        const tile = this.scene.add.sprite(
          i * this.gridSize + this.gridSize/2,
          j * this.gridSize + this.gridSize/2,
          randomGrass.key
        );
        tile.setDisplaySize(this.gridSize, this.gridSize);
        tile.setDepth(0);
        
        // Adicionar variação sutil de cores para mais naturalidade
        const tint = Phaser.Display.Color.GetColor(
          255 - Math.random() * 10,
          255 - Math.random() * 10,
          255 - Math.random() * 10
        );
        tile.setTint(tint);
      }
    }
  }
  
  /**
   * Cria o grid visual
   */
  public createGrid() {
    this.gridGraphics = this.scene.add.graphics();
    this.gridGraphics.lineStyle(1, 0x000000, 0.2);

    const gridSize = 20;
    for (let i = 0; i <= gridSize; i++) {
      this.gridGraphics.moveTo(i * this.gridSize, 0);
      this.gridGraphics.lineTo(i * this.gridSize, gridSize * this.gridSize);
      this.gridGraphics.moveTo(0, i * this.gridSize);
      this.gridGraphics.lineTo(gridSize * this.gridSize, i * this.gridSize);
    }
    this.gridGraphics.strokePath();
    this.gridGraphics.setDepth(1);
  }
  
  /**
   * Alterna a visibilidade do grid
   */
  public toggleGrid() {
    this.gridVisible = !this.gridVisible;
    if (this.gridVisible) {
      this.gridGraphics.setAlpha(0.2);
    } else {
      this.gridGraphics.setAlpha(0);
    }
  }
  
  /**
   * Retorna se o grid está visível
   */
  public isGridVisible(): boolean {
    return this.gridVisible;
  }
}
