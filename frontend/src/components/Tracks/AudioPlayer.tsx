/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface AudioPlayerProps {
  src: string;
  trackId: string;
  isPlayingGlobal: boolean;
  onPlay: () => void;
  onPause: () => void;
}

const wavesurferOptions = (ref: HTMLDivElement) => ({
  container: ref,
  waveColor: '#ddd',       // Цвет волны
  progressColor: '#3498db', // Цвет прогресса
  cursorColor: 'transparent', // Цвет курсора
  barWidth: 2,            // Ширина столбика
  barRadius: 3,           // Скругление столбика
  responsive: true,       // Адаптивность
  height: 50,             // Высота волны
  normalize: true,        // Нормализовать громкость
});

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, trackId, isPlayingGlobal, onPlay, onPause }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingWaveform, setIsLoadingWaveform] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    setIsLoadingWaveform(true);
    setIsReady(false);
    setIsPlaying(false);
    const options = wavesurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    try {
      wavesurfer.current.load(src);
    } catch (error) {
      console.error(`Error loading audio into WaveSurfer for track ${trackId}:`, error);
      setIsLoadingWaveform(false);
    }

    wavesurfer.current.on('ready', () => {
      setIsLoadingWaveform(false);
      setIsReady(true);
      if (wavesurfer.current?.isPlaying()) {
        wavesurfer.current.pause();
      }
    });

    wavesurfer.current.on('play', () => { setIsPlaying(true); onPlay(); });
    wavesurfer.current.on('pause', () => { setIsPlaying(false); onPause(); });
    wavesurfer.current.on('finish', () => { setIsPlaying(false); onPause(); });
    wavesurfer.current.on('error', (err) => {
      console.error(`WaveSurfer error for track ${trackId}:`, err);
      setIsLoadingWaveform(false);
      setIsReady(false);
    });

    return () => {
      wavesurfer.current?.destroy();
      wavesurfer.current = null;
    };
  }, [src]);

  useEffect(() => {
    if (isPlayingGlobal && isPlaying) {
      wavesurfer.current?.pause();
    }
  }, [isPlayingGlobal, isPlaying]);

  const togglePlayPause = useCallback(() => {
    if (!isPlaying) {
      onPlay();
    }

    if (wavesurfer.current && isReady) {
      if (wavesurfer.current.isPlaying()) {
        wavesurfer.current.pause();
      } else {
        wavesurfer.current.play().catch(err => console.error(`Error playing track ${trackId}:`, err));
      }
    } else if (!isReady) {
      console.warn(`WaveSurfer is not ready yet, cannot play track ${trackId}.`);
    }
  }, [onPlay, isReady, isPlaying, trackId]);

  return (
    <div className="audio-player-container">
      {/* Контролы */}
      <div className="audio-controls">
        <button
          onClick={togglePlayPause}
          data-testid={isPlaying ? `pause-button-${trackId}` : `play-button-${trackId}`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          // Кнопка заблокирована, пока идет загрузка ИЛИ плеер не готов
          disabled={isLoadingWaveform || !isReady}
        >
          {/* Текст кнопки зависит от состояния загрузки/готовности/воспроизведения */}
          {(isLoadingWaveform || !isReady) ? 'Loading...' : (isPlaying ? 'Pause' : 'Play')}
        </button>
      </div>

      {/* Контейнер для волны */}
      <div
        className={`waveform-container ${isLoadingWaveform || !isReady ? 'loading' : ''}`}
        ref={waveformRef}
        data-testid={`waveform-container-${trackId}`}
      />
      {/* Индикатор загрузки поверх волны */}
      {(isLoadingWaveform || !isReady) && <div className="waveform-loader">Generating waveform...</div>}
    </div>
  );
};

export default AudioPlayer;