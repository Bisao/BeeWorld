import { Scene } from "phaser";
import { ResourceManager } from "./managers/ResourceManager";
import { PlayerManager } from "./managers/PlayerManager";
import { UIManager } from "./managers/UIManager";
import { LightingManager } from "./managers/LightingManager";
import { GridManager } from "./managers/GridManager";
import { InputManager } from "./managers/InputManager";
import { EffectsManager } from "./managers/EffectsManager";

/**
 * Cena principal do jogo responsável pelo grid, recursos e jogador
 */
export class GameScene extends Scene {
  // Managers
  private resourceManager!: ResourceManager;
  private playerManager!: PlayerManager;
  private uiManager!: UIManager;
  private lightingManager!: LightingManager;
  private gridManager!: GridManager;
  private inputManager!: InputManager;
  private effectsManager!: EffectsManager;
  
  // Configurações
  private gridSize = 64;
  private characterData: any;
  private currentZoom: number = 1;
  
  constructor() {
    super("GameScene");
  }

  init(data: any) {
    this.characterData = data.character;
  }

  create() {
    // Inicializar managers em ordem de dependência
    this.initializeManagers();
    
    // Criar elementos do jogo
    this.createGameElements();
    
    // Configurar câmera e controles
    this.setupCamera();
  }

  /**
   * Inicializa todos os managers do jogo
   */
  private initializeManagers(): void {
    // Gerenciador de iluminação (deve ser o primeiro para criar camadas de luz)
    this.lightingManager = new LightingManager(this, this.gridSize);
    
    // Gerenciador de grid
    this.gridManager = new GridManager(this, this.gridSize);
    
    // Gerenciador de recursos
    this.resourceManager = new ResourceManager(this, this.gridSize);
    
    // Gerenciador de jogador
    this.playerManager = new PlayerManager(this, this.gridSize, this.characterData);
    
    // Gerenciador de UI
    this.uiManager = new UIManager(this);
    
    // Gerenciador de efeitos
    this.effectsManager = new EffectsManager(this, this.gridSize);
    
    // Gerenciador de entrada (deve ser o último para ter acesso a todos os outros managers)
    this.inputManager = new InputManager(this, this.gridManager, this.playerManager);
  }

  /**
   * Cria todos os elementos do jogo
   */
  private createGameElements(): void {
    // Criar terreno e grid
    this.gridManager.createTerrain(this.resourceManager.getResourceTypes().tiles);
    this.gridManager.createGrid();
    
    // Criar recursos (árvores, pedras, etc)
    this.resourceManager.createResources();
    
    // Criar jogador
    this.playerManager.createPlayer();
    
    // Criar UI
    this.uiManager.createUI(this.lightingManager.getTimeOfDay.bind(this.lightingManager));
    
    // Iniciar ciclo dia/noite
    this.lightingManager.startDayNightCycle();
    
    // Adicionar efeitos de partículas
    this.effectsManager.addParticleEffects();
  }

  /**
   * Configura a câmera do jogo
   */
  private setupCamera(): void {
    this.cameras.main.startFollow(this.playerManager.getPlayer(), true, 0.9, 0.9);
    this.cameras.main.setLerp(0.1, 0.1);
    this.cameras.main.setDeadzone(this.gridSize / 3, this.gridSize / 3);
    this.cameras.main.setZoom(1);
    
    // Adicionar efeito de fade-in na inicialização
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  /**
   * Ajusta o zoom da câmera
   */
  public adjustZoom(amount: number): void {
    this.currentZoom = Phaser.Math.Clamp(this.currentZoom + amount, 0.5, 2);
    this.cameras.main.zoomTo(this.currentZoom, 300);
  }

  update(): void {
    // Atualizar managers
    this.playerManager.update();
    this.lightingManager.update();
    this.effectsManager.update();
  }
}
