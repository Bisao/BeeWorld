import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { BootScene } from "./BootScene";
import { PreloadScene } from "./PreloadScene";
import { LoginScene } from "./LoginScene";

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
        scene: [BootScene, PreloadScene, LoginScene],
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0 },
            debug: false
          }
        },
        pixelArt: true,
        roundPixels: true
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
