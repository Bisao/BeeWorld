import { Scene } from "phaser";

/**
 * Gerenciador de jogador
 */
export class PlayerManager {
  private scene: Scene;
  private gridSize: number;
  private player!: Phaser.GameObjects.Sprite;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private characterData: any;
  private isMoving: boolean = false;
  
  constructor(scene: Scene, gridSize: number, characterData: any) {
    this.scene = scene;
    this.gridSize = gridSize;
    this.characterData = characterData;
  }
  
  /**
   * Retorna o sprite do jogador
   */
  public getPlayer(): Phaser.GameObjects.Sprite {
    return this.player;
  }
  
  /**
   * Retorna a sombra do jogador
   */
  public getPlayerShadow(): Phaser.GameObjects.Ellipse {
    return this.playerShadow;
  }
  
  /**
   * Cria o jogador no grid
   */
  public createPlayer() {
    const centerX = (10 * this.gridSize) + (this.gridSize / 2);
    const centerY = (10 * this.gridSize) + (this.gridSize / 2);
    const spriteKey = this.characterData?.class?.toLowerCase() + '-character' || 'warrior-character';

    // Adicionar sombra do jogador
    this.playerShadow = this.scene.add.ellipse(
      centerX,
      centerY + 10,
      this.gridSize * 0.7,
      this.gridSize * 0.2,
      0x000000,
      0.3
    );
    this.playerShadow.setDepth(2);

    this.player = this.scene.add.sprite(centerX, centerY, spriteKey);
    this.player.setOrigin(0.5);
    this.player.setScale(this.gridSize / this.player.width);
    this.player.setDepth(3);
    
    // Adicionar efeito de brilho ao redor do jogador
    const playerGlow = this.scene.add.graphics();
    playerGlow.fillStyle(0xffff00, 0.2);
    playerGlow.fillCircle(centerX, centerY, this.gridSize * 0.6);
    playerGlow.setDepth(1);
    
    // Animar o brilho
    this.scene.tweens.add({
      targets: playerGlow,
      alpha: 0.1,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Fazer o brilho seguir o jogador
    this.scene.time.addEvent({
      delay: 16,
      callback: () => {
        playerGlow.clear();
        playerGlow.fillStyle(0xffff00, playerGlow.alpha);
        playerGlow.fillCircle(this.player.x, this.player.y, this.gridSize * 0.6);
      },
      callbackScope: this,
      loop: true
    });
  }
  
  /**
   * Atualiza o jogador
   */
  public update() {
    // Atualizar posição da sombra do jogador
    if (this.playerShadow) {
      this.playerShadow.setPosition(this.player.x, this.player.y + 10);
    }
  }
  
  /**
   * Move o jogador na direção especificada
   */
  public movePlayer(dx: number, dy: number) {
    if (this.isMoving) return;
    
    const newX = this.player.x + dx * this.gridSize;
    const newY = this.player.y + dy * this.gridSize;

    this.isMoving = true;

    // Adicionar efeito de "bounce" ao movimento
    this.scene.tweens.add({
      targets: this.player,
      x: newX,
      y: newY,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.isMoving = false;
      }
    });
    
    // Adicionar efeito de "squash and stretch" durante o movimento
    this.scene.tweens.add({
      targets: this.player,
      scaleY: this.player.scaleY * 0.9,
      scaleX: this.player.scaleX * 1.1,
      duration: 100,
      yoyo: true,
      ease: 'Sine.easeInOut'
    });
  }
  
  /**
   * Verifica se o jogador está se movendo
   */
  public isPlayerMoving(): boolean {
    return this.isMoving;
  }
}
