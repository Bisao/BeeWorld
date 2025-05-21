
import { Scene } from "phaser";

export class GameScene extends Scene {
  private player!: Phaser.GameObjects.Sprite;
  private gridSize = 64; // Tamanho de cada célula do grid
  private movementKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private isMoving: boolean = false;
  private characterData: any;

  constructor() {
    super("GameScene");
  }

  init(data: any) {
    this.characterData = data.character;
  }

  create() {
    // Criar grid com textura de grama
    const gridSize = 20;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const tile = this.add.sprite(
          i * this.gridSize + this.gridSize/2,
          j * this.gridSize + this.gridSize/2,
          'grass-texture'
        );
        tile.setDisplaySize(this.gridSize, this.gridSize);
      }
    }

    // Criar linhas do grid
    this.createGrid();

    // Criar player no centro do grid
    const centerX = (10 * this.gridSize); // Centro do grid (20x20)
    const centerY = (10 * this.gridSize);
    this.player = this.add.sprite(centerX, centerY, this.characterData.sprite || 'warrior-character');
    this.player.setOrigin(0.5);
    this.player.setScale(2); // Aumentar escala para melhor visibilidade
    this.player.setDepth(1); // Garantir que o player fique sobre o grid

    // Configurar câmera para seguir o player
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setZoom(1);

    // Configurar teclas de movimento
    this.movementKeys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
    }) as any;
  }

  update() {
    if (!this.isMoving) {
      let dx = 0;
      let dy = 0;

      // Detectar movimento horizontal
      if (this.movementKeys.A.isDown) dx -= 1;
      if (this.movementKeys.D.isDown) dx += 1;

      // Detectar movimento vertical
      if (this.movementKeys.W.isDown) dy -= 1;
      if (this.movementKeys.S.isDown) dy += 1;

      // Normalizar movimento diagonal
      if (dx !== 0 && dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        dx /= length;
        dy /= length;
      }

      if (dx !== 0 || dy !== 0) {
        this.movePlayer(dx, dy);
      }
    }
  }

  private createGrid() {
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x000000, 0.2);

    // Criar linhas do grid
    const gridSize = 20;
    for (let i = 0; i <= gridSize; i++) {
      // Linhas verticais
      graphics.moveTo(i * this.gridSize, 0);
      graphics.lineTo(i * this.gridSize, gridSize * this.gridSize);
      // Linhas horizontais
      graphics.moveTo(0, i * this.gridSize);
      graphics.lineTo(gridSize * this.gridSize, i * this.gridSize);
    }
    graphics.strokePath();
    graphics.setDepth(1); // Garantir que as linhas fiquem sobre a grama
  }

  private movePlayer(dx: number, dy: number) {
    const newX = this.player.x + dx * this.gridSize;
    const newY = this.player.y + dy * this.gridSize;

    this.isMoving = true;

    this.tweens.add({
      targets: this.player,
      x: newX,
      y: newY,
      duration: 200,
      ease: 'Linear',
      onComplete: () => {
        this.isMoving = false;
      }
    });
  }
}
