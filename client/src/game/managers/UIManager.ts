import { Scene } from "phaser";

/**
 * Gerenciador de interface do usuário
 */
export class UIManager {
  private scene: Scene;
  private infoPanel!: Phaser.GameObjects.Rectangle;
  private infoText!: Phaser.GameObjects.Text;
  private controlsText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  
  constructor(scene: Scene) {
    this.scene = scene;
  }
  
  /**
   * Cria a interface do usuário
   */
  public createUI(getTimeOfDayCallback: () => string) {
    // Criar painel de informações
    this.infoPanel = this.scene.add.rectangle(10, 10, 200, 80, 0x000000, 0.5);
    this.infoPanel.setOrigin(0, 0);
    this.infoPanel.setScrollFactor(0);
    this.infoPanel.setDepth(11);
    
    // Adicionar texto de informações
    this.infoText = this.scene.add.text(20, 20, 'BeeWorld', { 
      fontFamily: 'Arial', 
      fontSize: '18px', 
      color: '#ffffff' 
    });
    this.infoText.setScrollFactor(0);
    this.infoText.setDepth(12);
    
    // Adicionar texto de controles
    this.controlsText = this.scene.add.text(20, 45, 'WASD: Mover | G: Grid | +/-: Zoom', { 
      fontFamily: 'Arial', 
      fontSize: '12px', 
      color: '#ffffff' 
    });
    this.controlsText.setScrollFactor(0);
    this.controlsText.setDepth(12);
    
    // Adicionar indicador de hora do dia
    this.timeText = this.scene.add.text(20, 65, 'Hora: Dia', { 
      fontFamily: 'Arial', 
      fontSize: '12px', 
      color: '#ffffff' 
    });
    this.timeText.setScrollFactor(0);
    this.timeText.setDepth(12);
    
    // Atualizar texto de hora
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        const timeOfDay = getTimeOfDayCallback();
        this.timeText.setText(`Hora: ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}`);
      },
      callbackScope: this,
      loop: true
    });
  }
}
