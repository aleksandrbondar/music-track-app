import React, { useState, useEffect, FormEvent } from 'react';
import { Track, Genre, CreateTrackDTO, UpdateTrackDTO } from '../../types';
import GenreTagsInput from './GenreTagsInput';

interface TrackFormProps {
  initialData?: Track | null;
  onSubmit: (data: CreateTrackDTO | UpdateTrackDTO) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitButtonText?: string;
}

const URL_REGEX = /^(https?:\/\/)?([\w.-]+(?:\.[\w.-]+)+|localhost)[\w._~:/?#[\]@!$&'()*+,;=%-]+$/i;

const TrackForm: React.FC<TrackFormProps> = ({
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText = 'Save Track',
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [artist, setArtist] = useState(initialData?.artist || '');
  const [album, setAlbum] = useState(initialData?.album || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [genres, setGenres] = useState<Genre[]>(initialData?.genres || []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setTitle(initialData?.title || '');
    setArtist(initialData?.artist || '');
    setAlbum(initialData?.album || '');
    setCoverImage(initialData?.coverImage || '');
    setGenres(initialData?.genres || []);
    setErrors({});
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!title.trim()) { newErrors.title = 'Title is required.'; isValid = false; }
    if (!artist.trim()) { newErrors.artist = 'Artist is required.'; isValid = false; }
    if (coverImage.trim() && !URL_REGEX.test(coverImage.trim())) { newErrors.coverImage = 'Please enter a valid URL.'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      const formData: CreateTrackDTO | UpdateTrackDTO = {
        title: title.trim(),
        artist: artist.trim(),
        album: album.trim() || undefined,
        genres: genres,
        coverImage: coverImage.trim() || undefined,
      };
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="track-form" noValidate>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} data-testid="input-title" aria-required="true" aria-invalid={!!errors.title} aria-describedby="error-title" disabled={isSubmitting} />
        {errors.title && <span className="error-message" id="error-title" data-testid="error-title">{errors.title}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="artist">Artist *</label>
        <input id="artist" type="text" value={artist} onChange={(e) => setArtist(e.target.value)} data-testid="input-artist" aria-required="true" aria-invalid={!!errors.artist} aria-describedby="error-artist" disabled={isSubmitting} />
        {errors.artist && <span className="error-message" id="error-artist" data-testid="error-artist">{errors.artist}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="album">Album</label>
        <input id="album" type="text" value={album} onChange={(e) => setAlbum(e.target.value)} data-testid="input-album" aria-invalid={!!errors.album} aria-describedby="error-album" disabled={isSubmitting} />
        {errors.album && <span className="error-message" id="error-album" data-testid="error-album">{errors.album}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="coverImage">Cover Image URL</label>
        <input id="coverImage" type="text" value={coverImage.trim()} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://example.com/image.jpg" data-testid="input-cover-image" aria-invalid={!!errors.coverImage} aria-describedby="error-coverImage" disabled={isSubmitting} />
        {errors.coverImage && <span className="error-message" id="error-coverImage" data-testid="error-coverImage">{errors.coverImage}</span>}
      </div>
      <div className="form-group">
        <GenreTagsInput selectedGenres={genres} onChange={setGenres} data-testid="genre-selector" />
        {errors.genres && <span className="error-message" data-testid="error-genre">{errors.genres}</span>}
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={isSubmitting}>Cancel</button>
        <button type="submit" data-testid="submit-button" disabled={isSubmitting} aria-disabled={isSubmitting} data-loading={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default TrackForm;