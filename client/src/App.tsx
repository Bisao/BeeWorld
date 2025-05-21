import { useEffect, useState } from "react";
import Game from "./game/Game";
import DiscordBanner from "./components/DiscordBanner";
import { useAudio } from "./lib/stores/useAudio";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  // Load audio files
  useEffect(() => {
    const loadAudio = async () => {
      try {
        // Create audio elements
        const bgMusic = new Audio("/sounds/background.mp3");
        bgMusic.loop = true;
        bgMusic.volume = 0.3;
        
        const hitSfx = new Audio("/sounds/hit.mp3");
        const successSfx = new Audio("/sounds/success.mp3");
        
        // Store in the global audio store
        setBackgroundMusic(bgMusic);
        setHitSound(hitSfx);
        setSuccessSound(successSfx);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load audio:", error);
        setIsLoading(false);
      }
    };

    loadAudio();
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h2>Loading Heartwood Online...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <DiscordBanner />
      <Game />
    </div>
  );
}

export default App;
