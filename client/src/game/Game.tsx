import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { BootScene } from "./BootScene";
import { PreloadScene } from "./PreloadScene";
import { LoginScene } from "./LoginScene";
import { CharacterSelectScene } from "./CharacterSelectScene";
import { CharacterCreateScene } from "./CharacterCreateScene";

// Adiciona interfaces do Phaser para garantir que estão disponíveis corretamente
declare global {
  interface Window {
    gameReady: boolean;
  }
}

const Game = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameContainerRef.current && !gameInstanceRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: gameContainerRef.current,
        width: 1280,
        height: 720,
        backgroundColor: "#111111",
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: [
          BootScene, 
          PreloadScene, 
          LoginScene, 
          CharacterSelectScene, 
          CharacterCreateScene
        ],
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
          }
        },
        pixelArt: true,
        roundPixels: true,
        dom: {
          createContainer: true
        },
        input: {
          activePointers: 3
        }
      };

      // Initialize the game
      gameInstanceRef.current = new Phaser.Game(config);

      // Handle window resize
      const resizeGame = () => {
        if (gameInstanceRef.current) {
          gameInstanceRef.current.scale.refresh();
        }
      };

      window.addEventListener("resize", resizeGame);

      // Clean up
      return () => {
        window.removeEventListener("resize", resizeGame);
        if (gameInstanceRef.current) {
          gameInstanceRef.current.destroy(true);
          gameInstanceRef.current = null;
        }
      };
    }
  }, []);

  return <div ref={gameContainerRef} className="game-container" />;
};

export default Game;
