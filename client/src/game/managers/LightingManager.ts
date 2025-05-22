import { Scene } from "phaser";

/**
 * Gerenciador de iluminação e efeitos de luz
 */
export class LightingManager {
  private scene: Scene;
  private gridSize: number;
  private ambientLight!: Phaser.GameObjects.Graphics;
  private dayNightCycle: number = 0;
  private timeOfDay: string = 'day';
  
  constructor(scene: Scene, gridSize: number) {
    this.scene = scene;
    this.gridSize = gridSize;
    this.createAmbientLight();
  }
  
  /**
   * Cria a camada de iluminação ambiente
   */
  private createAmbientLight() {
    this.ambientLight = this.scene.add.graphics();
    this.ambientLight.fillStyle(0x000000, 0);
    this.ambientLight.fillRect(0, 0, this.scene.cameras.main.width * 2, this.scene.cameras.main.height * 2);
    this.ambientLight.setDepth(10);
    this.ambientLight.setScrollFactor(0);
  }
  
  /**
   * Inicia o ciclo dia/noite
   */
  public startDayNightCycle() {
    // Ciclo completo a cada 5 minutos (300000ms)
    this.scene.time.addEvent({
      delay: 10000, // Atualiza a cada 10 segundos
      callback: this.updateDayNightCycle,
      callbackScope: this,
      loop: true
    });
  }
  
  /**
   * Atualiza o ciclo dia/noite
   */
  private updateDayNightCycle() {
    this.dayNightCycle = (this.dayNightCycle + 0.033) % 1; // Incrementa em 3.3% (completa em ~5min)
    
    // Determinar hora do dia (manhã, dia, tarde, noite)
    if (this.dayNightCycle < 0.25) {
      // Manhã - luz suave amarelada
      this.timeOfDay = 'morning';
      const alpha = 0.1 - (this.dayNightCycle * 0.4); // Diminui gradualmente
      this.ambientLight.clear();
      this.ambientLight.fillStyle(0xffcc88, alpha);
      this.ambientLight.fillRect(0, 0, this.scene.cameras.main.width * 2, this.scene.cameras.main.height * 2);
    } else if (this.dayNightCycle < 0.5) {
      // Dia - sem efeito de luz
      this.timeOfDay = 'day';
      this.ambientLight.clear();
      this.ambientLight.fillStyle(0xffffff, 0);
      this.ambientLight.fillRect(0, 0, this.scene.cameras.main.width * 2, this.scene.cameras.main.height * 2);
    } else if (this.dayNightCycle < 0.75) {
      // Tarde - luz alaranjada
      this.timeOfDay = 'evening';
      const alpha = (this.dayNightCycle - 0.5) * 0.4; // Aumenta gradualmente
      this.ambientLight.clear();
      this.ambientLight.fillStyle(0xff8844, alpha);
      this.ambientLight.fillRect(0, 0, this.scene.cameras.main.width * 2, this.scene.cameras.main.height * 2);
    } else {
      // Noite - luz azulada escura
      this.timeOfDay = 'night';
      const alpha = 0.3 - ((this.dayNightCycle - 0.75) * 0.8); // Diminui no final
      this.ambientLight.clear();
      this.ambientLight.fillStyle(0x112244, alpha);
      this.ambientLight.fillRect(0, 0, this.scene.cameras.main.width * 2, this.scene.cameras.main.height * 2);
    }
  }
  
  /**
   * Atualiza as sombras com base na hora do dia
   */
  public updateShadows(playerShadow: Phaser.GameObjects.Ellipse, resourceShadows: Phaser.GameObjects.Ellipse[], player: Phaser.GameObjects.Sprite) {
    // Ajustar sombra do jogador
    if (playerShadow) {
      if (this.timeOfDay === 'night') {
        playerShadow.setAlpha(0.1); // Sombra mais fraca à noite
      } else {
        playerShadow.setAlpha(0.3); // Sombra normal durante o dia
        
        // Ajustar posição da sombra com base na hora do dia
        let offsetX = 0;
        let offsetY = 0;
        
        if (this.timeOfDay === 'morning') {
          offsetX = -5;
          offsetY = 5;
        } else if (this.timeOfDay === 'day') {
          offsetX = 0;
          offsetY = 5;
        } else if (this.timeOfDay === 'evening') {
          offsetX = 5;
          offsetY = 5;
        }
        
        playerShadow.setPosition(player.x + offsetX, player.y + offsetY + 10);
      }
    }
    
    // Atualizar sombras dos recursos
    resourceShadows.forEach(shadow => {
      if (this.timeOfDay === 'night') {
        shadow.setAlpha(0.1);
      } else {
        shadow.setAlpha(0.3);
      }
    });
  }
  
  /**
   * Retorna a hora do dia atual
   */
  public getTimeOfDay(): string {
    return this.timeOfDay;
  }
  
  /**
   * Atualiza o gerenciador de iluminação
   */
  public update() {
    // Implementação futura para efeitos dinâmicos de iluminação
  }
}
