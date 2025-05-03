import React from 'react';
import { Track } from '../../types';
import AudioPlayer from './AudioPlayer';

interface TrackItemProps {
  track: Track;
  onEdit: (track: Track) => void;
  onDelete: (track: Track) => void;
  onUpload: (track: Track) => void;
  currentlyPlayingId: string | null;
  onPlayTrack: (trackId: string) => void;
  onPauseTrack: (trackId: string) => void;
  isSelectMode: boolean;
  isSelected: boolean;
  onToggleSelect: (trackId: string, selected: boolean) => void;
}

const BACKEND_STORAGE_BASE_URL = import.meta.env.VITE_BACKEND_STORAGE_URL || 'http://localhost:8000';
const AUDIO_FILES_PATH = import.meta.env.VITE_AUDIO_FILES_PATH || '/api/files/';
const DEFAULT_COVER = 'https://placehold.co/600x400?text=No+Cover';


const TrackItem: React.FC<TrackItemProps> = ({
  track,
  onEdit,
  onDelete,
  onUpload,
  currentlyPlayingId,
  onPlayTrack,
  onPauseTrack,
  isSelectMode,
  isSelected,
  onToggleSelect
}) => {
  const coverImage = track.coverImage || DEFAULT_COVER;
  const isOtherPlaying = currentlyPlayingId !== null && currentlyPlayingId !== track.id;

  // Обработчик изменения чекбокса
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggleSelect(track.id, event.target.checked);
  };

  // Формирование полного URL для аудио
  let fullAudioSrc = '';
  if (track.audioFile) {
    const fileName = track.audioFile.startsWith('/') ? track.audioFile.substring(1) : track.audioFile;
    fullAudioSrc = `${BACKEND_STORAGE_BASE_URL}${AUDIO_FILES_PATH}${fileName}`;
  }

  return (
    // Контейнер элемента трека
    <div className={`track-item ${isSelected ? 'selected' : ''}`} data-testid={`track-item-${track.id}`}>

      {isSelectMode && (
        <div className="track-item__select-checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            data-testid={`track-checkbox-${track.id}`}
            aria-label={`Select track ${track.title}`}
          />
        </div>
      )}

      {/* Обложка трека */}
      <img src={coverImage} alt={`${track.title} cover`} className="track-item__cover" width="64" height="64" />

      {/* Информация о треке */}
      <div className="track-item__info">
        <h3 className="track-item__title" data-testid={`track-item-${track.id}-title`}>
          {track.title}
        </h3>
        <p className="track-item__artist" data-testid={`track-item-${track.id}-artist`}>
          {track.artist} {track.album && ` - ${track.album}`}
        </p>
        <div className="track-item__genres">
          {track.genres?.map((genre) => (
            <span key={genre} className="genre-tag">{genre}</span>
          ))}
        </div>

        {/* Аудиоплеер (если есть аудиофайл) */}
        {fullAudioSrc && (
          <AudioPlayer
            src={fullAudioSrc}
            trackId={track.id}
            isPlayingGlobal={isOtherPlaying}
            onPlay={() => onPlayTrack(track.id)}
            onPause={() => onPauseTrack(track.id)}
          />
        )}
      </div>

      {!isSelectMode && (
        <div className="track-item__actions">
          <button onClick={() => onEdit(track)} data-testid={`edit-track-${track.id}`} aria-label={`Edit ${track.title}`}>Edit</button>
          <button onClick={() => onUpload(track)} data-testid={`upload-track-${track.id}`} aria-label={`${track.audioFile ? 'Manage' : 'Upload'} audio for ${track.title}`}>
            {track.audioFile ? 'Manage Audio' : 'Upload Audio'}
          </button>
          <button onClick={() => onDelete(track)} data-testid={`delete-track-${track.id}`} className="delete-button" aria-label={`Delete ${track.title}`}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default TrackItem;