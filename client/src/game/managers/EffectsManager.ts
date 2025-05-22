import { Scene } from "phaser";

/**
 * Gerenciador de efeitos visuais
 */
export class EffectsManager {
  private scene: Scene;
  private gridSize: number;
  
  constructor(scene: Scene, gridSize: number) {
    this.scene = scene;
    this.gridSize = gridSize;
  }
  
  /**
   * Adiciona efeitos de partículas ao jogo
   */
  public addParticleEffects() {
    // Partículas de vento/folhas
    const particles = this.scene.add.particles(0, 0, 'grass1', {
      frame: 0,
      quantity: 1,
      frequency: 5000, // Uma partícula a cada 5 segundos
      scale: { start: 0.05, end: 0.01 },
      speed: { min: 20, max: 50 },
      lifespan: 10000,
      alpha: { start: 0.3, end: 0 },
      rotate: { min: 0, max: 360 },
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(0, 0, 20 * this.gridSize, 20 * this.gridSize)
      }
    });
    
    particles.setDepth(5);
  }
  
  /**
   * Atualiza os efeitos visuais
   */
  public update() {
    // Implementação futura para efeitos dinâmicos
  }
}
