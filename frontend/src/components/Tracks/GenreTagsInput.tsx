import React, { useState, useEffect } from 'react';
import { Genre } from '../../types';
import { getGenres } from '../../api/trackApi';

interface GenreTagsInputProps {
  selectedGenres: Genre[];
  onChange: (genres: Genre[]) => void;
  'data-testid'?: string;
}

const GenreTagsInput: React.FC<GenreTagsInputProps> = ({
  selectedGenres,
  onChange,
  'data-testid': testId
}) => {
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genreToAdd, setGenreToAdd] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      setError(null);
      try {
        const genres = await getGenres();
        setAvailableGenres(genres);
      } catch (err) {
        console.error("Failed to fetch genres for input:", err);
        setError("Could not load genres");
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  const handleAddGenre = () => {
    if (genreToAdd && !selectedGenres.includes(genreToAdd)) {
      onChange([...selectedGenres, genreToAdd]);
      setGenreToAdd('');
    }
  };

  const handleRemoveGenre = (genreToRemove: Genre) => {
    onChange(selectedGenres.filter((g) => g !== genreToRemove));
  };

  const genresForDropdown = availableGenres.filter(g => !selectedGenres.includes(g));

  return (
    <div className="genre-tags-input" data-testid={testId}>
      <label>Genres:</label>
      <div className="selected-genres">
        {selectedGenres.map((genre) => (
          <span key={genre} className="genre-tag">
            {genre}
            <button
              type="button"
              onClick={() => handleRemoveGenre(genre)}
              className="remove-genre-button"
              aria-label={`Remove genre ${genre}`}
            >
              &times;
            </button>
          </span>
        ))}
        {selectedGenres.length === 0 && <span className="no-genres">No genres added</span>}
      </div>
      <div className="add-genre-controls">
        <select
          value={genreToAdd}
          onChange={(e) => setGenreToAdd(e.target.value)}
          disabled={loading || !!error || genresForDropdown.length === 0}
          aria-label="Select genre to add"
        >
          <option value="">{loading ? 'Loading...' : error || (genresForDropdown.length === 0 ? 'All genres added' : 'Add genre...')}</option>
          {genresForDropdown.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAddGenre}
          disabled={!genreToAdd}
          aria-label="Add selected genre"
        >
          + Add
        </button>
      </div>
      <span data-testid="error-genre">{error}</span>
    </div>
  );
};

export default GenreTagsInput;