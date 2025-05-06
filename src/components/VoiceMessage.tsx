import React, { useEffect, useState, useCallback } from 'react';

interface VoiceMessageProps {
  text: string;
  onPlayComplete?: () => void;
}

export default function VoiceMessage({ text, onPlayComplete }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>([0.3, 0.5, 0.7, 0.5, 0.3, 0.4, 0.6, 0.4]);

  const updateWave = useCallback(() => {
    if (isPlaying) {
      setWaveHeights(prev => 
        prev.map(() => Math.random() * 0.8 + 0.2) // Random heights between 0.2 and 1
      );
    }
  }, [isPlaying]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isPlaying) {
      intervalId = setInterval(updateWave, 100); // Update wave more frequently
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, updateWave]);

  useEffect(() => {
    let speech: SpeechSynthesisUtterance | null = null;

    const speak = () => {
      if ('speechSynthesis' in window) {
        speech = new SpeechSynthesisUtterance(text);
        
        // Configure voice settings for a tiny, sassy voice
        speech.pitch = 1.5; // Higher pitch
        speech.rate = 1.1;  // Slightly faster
        speech.volume = 0.8;

        // Try to set a female voice if available
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('female'));
        if (femaleVoice) {
          speech.voice = femaleVoice;
        }

        speech.onstart = () => setIsPlaying(true);
        speech.onend = () => {
          setIsPlaying(false);
          if (onPlayComplete) onPlayComplete();
        };

        window.speechSynthesis.speak(speech);
      }
    };

    speak();

    return () => {
      if (speech) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, onPlayComplete]);

  return (
    <div className="flex items-center">
      {isPlaying && (
        <div className="flex items-center space-x-0.5">
          {waveHeights.map((height, index) => (
            <div
              key={index}
              className="w-0.5 bg-gray-400 rounded-full"
              style={{
                height: `${height * 24}px`,
                transition: 'height 0.1s ease-in-out',
                opacity: 0.7 + (height * 0.3) // Vary opacity based on height
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
} 