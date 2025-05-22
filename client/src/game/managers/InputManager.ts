import { Scene } from "phaser";
import { GridManager } from "./GridManager";
import { PlayerManager } from "./PlayerManager";

/**
 * Gerenciador de entrada do usuário
 */
export class InputManager {
  private scene: Scene;
  private gridManager: GridManager;
  private playerManager: PlayerManager;
  private movementKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private gridToggleKey!: Phaser.Input.Keyboard.Key;
  private zoomInKey!: Phaser.Input.Keyboard.Key;
  private zoomOutKey!: Phaser.Input.Keyboard.Key;
  
  constructor(scene: Scene, gridManager: GridManager, playerManager: PlayerManager) {
    this.scene = scene;
    this.gridManager = gridManager;
    this.playerManager = playerManager;
    this.setupControls();
  }
  
  /**
   * Configura os controles do jogo
   */
  private setupControls() {
    this.movementKeys = this.scene.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      UP: Phaser.Input.Keyboard.KeyCodes.UP,
      LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
      DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT
    }) as any;
    
    // Adicionar tecla para alternar visibilidade do grid
    this.gridToggleKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
    this.scene.input.keyboard.on('keydown-G', () => {
      this.gridManager.toggleGrid();
    });
    
    // Adicionar teclas para zoom
    this.zoomInKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS);
    this.zoomOutKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS);
    
    this.scene.input.keyboard.on('keydown-PLUS', () => {
      (this.scene as any).adjustZoom(0.1);
    });
    
    this.scene.input.keyboard.on('keydown-MINUS', () => {
      (this.scene as any).adjustZoom(-0.1);
    });
    
    // Adicionar suporte a mouse wheel para zoom
    this.scene.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
      if (deltaY > 0) {
        (this.scene as any).adjustZoom(-0.1);
      } else {
        (this.scene as any).adjustZoom(0.1);
      }
    });
  }
  
  /**
   * Processa a entrada do usuário
   */
  public processInput() {
    if (this.playerManager.isPlayerMoving()) return;
    
    let dx = 0;
    let dy = 0;

    if (this.movementKeys.A.isDown || this.movementKeys.LEFT.isDown) dx -= 1;
    if (this.movementKeys.D.isDown || this.movementKeys.RIGHT.isDown) dx += 1;
    if (this.movementKeys.W.isDown || this.movementKeys.UP.isDown) dy -= 1;
    if (this.movementKeys.S.isDown || this.movementKeys.DOWN.isDown) dy += 1;

    if (dx !== 0 && dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx /= length;
      dy /= length;
    }

    if (dx !== 0 || dy !== 0) {
      this.playerManager.movePlayer(dx, dy);
    }
  }
}
