import React, { useState, useRef, ChangeEvent } from 'react';
import Modal from '../Common/Modal';
import { Track } from '../../types';

// Интерфейс пропсов с функциями mutate и статусами
interface UploadTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackToUpload: Track | null;
  uploadAudio: (variables: { id: string; file: File }) => void;
  isUploading: boolean;
  deleteAudio: (id: string) => void;
  isDeletingAudio: boolean;
}

// Константы для валидации
const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_AUDIO_TYPES = 'audio/mpeg, audio/wav, audio/ogg';
const ACCEPTED_MIME_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-wav'];

const UploadTrackModal: React.FC<UploadTrackModalProps> = ({
  isOpen, onClose, trackToUpload,
  uploadAudio, isUploading, deleteAudio, isDeletingAudio
}) => {
  // Локальные состояния для файла и ошибки валидации
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Сброс состояния при закрытии/открытии модалки
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      if (!selectedFile) {
        setError(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  }, [isOpen, trackToUpload?.id, selectedFile]);

  // Обработчик выбора файла с валидацией
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      // Валидация типа файла
      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        setError(`Invalid file type (${file.type}). Please upload MP3, WAV, or OGG.`);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      // Валидация размера файла
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File is too large (Max ${MAX_FILE_SIZE_MB} MB).`);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      // Если все проверки пройдены
      setSelectedFile(file);
    } else {
      // Если пользователь отменил выбор файла
      setSelectedFile(null);
    }
  };


  // Обработчик для кнопки "Upload Audio"
  const handleUpload = () => {
    if (!selectedFile || !trackToUpload) return;
    setError(null);
    uploadAudio({ id: trackToUpload.id, file: selectedFile });
  };

  const handleDeleteAudio = () => {
    if (!trackToUpload || !trackToUpload.audioFile) return;
    setError(null);
    deleteAudio(trackToUpload.id);
    onClose();
  };

  // Рендеринг модального окна
  return (
    <Modal isOpen={isOpen && !!trackToUpload} onClose={onClose} title={`Manage Audio for: ${trackToUpload?.title || ''}`} testId="upload-track-modal">
      {trackToUpload && (
        <div className="upload-track-modal">
          {/* Отображение информации о текущем файле и кнопка удаления */}
          {trackToUpload.audioFile && (
            <div className="current-audio">
              <p>Current audio file present.</p>
              <button onClick={handleDeleteAudio} disabled={isUploading || isDeletingAudio} className="delete-audio-button" data-testid="delete-audio-button">
                {isDeletingAudio ? 'Deleting...' : 'Delete Audio File'}
              </button>
            </div>
          )}

          {/* Форма для загрузки нового файла */}
          <div className="form-group">
            <label htmlFor="audioFile">{trackToUpload.audioFile ? 'Upload New Audio File:' : 'Select Audio File:'}</label>
            <input
              ref={fileInputRef}
              type="file"
              id="audioFile"
              accept={ACCEPTED_AUDIO_TYPES}
              onChange={handleFileChange}
              disabled={isUploading || isDeletingAudio}
              data-testid="input-audio-file"
            />
            <small>Accepted: MP3, WAV, OGG. Max: {MAX_FILE_SIZE_MB}MB</small>
          </div>

          {/* Отображение ошибки валидации */}
          {error && <p className="error-message" data-testid="error-upload">{error}</p>}

          {/* Индикатор загрузки (используем статус isUploading из React Query) */}
          {isUploading && <div className="upload-progress" data-testid="upload-progress-indicator"><p>Uploading...</p>{/* Можно добавить progress bar если нужно */}</div>}

          {/* Кнопки действий */}
          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={isUploading || isDeletingAudio}>Cancel</button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || isDeletingAudio}
              data-loading={isUploading}
              aria-disabled={isUploading || isDeletingAudio}
              data-testid="submit-upload-button"
            >
              {isUploading ? 'Uploading...' : 'Upload Audio'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UploadTrackModal;