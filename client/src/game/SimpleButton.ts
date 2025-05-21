
import Phaser from 'phaser';

export class SimpleButton extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;
  private callback: Function;
  private originalScale: number = 1;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, 
              text: string, textStyle: any, 
              backgroundColor: number, 
              callback: Function, 
              scale: number = 1) {
    super(scene, x, y);
    
    this.originalScale = scale;
    this.callback = callback;
    
    // Button background
    this.background = scene.add.rectangle(0, 0, width, height, backgroundColor, 1);
    this.background.setStrokeStyle(2, 0x000000);

    // Button text
    this.label = scene.add.text(0, 0, text, textStyle);
    this.label.setOrigin(0.5);

    // Add children to container
    this.add([this.background, this.label]);
    
    // Set scale
    this.setScale(scale);
    
    // Make interactive
    this.setSize(width, height);
    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
    
    // Set up events
    this.on('pointerdown', this.onPointerDown, this);
    this.on('pointerup', this.onPointerUp, this);
    this.on('pointerover', this.onPointerOver, this);
    this.on('pointerout', this.onPointerOut, this);
    
    // Add to scene
    scene.add.existing(this);
  }
  
  onPointerDown() {
    this.setScale(this.originalScale * 0.95);
  }
  
  onPointerUp() {
    this.setScale(this.originalScale);
    this.callback();
  }
  
  onPointerOver() {
    this.setScale(this.originalScale * 1.05);
  }
  
  onPointerOut() {
    this.setScale(this.originalScale);
  }
}
