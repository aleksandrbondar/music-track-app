import React, { useState, useEffect } from 'react';
import { Genre, SortField, SortOrder } from '../../types';
import { getGenres } from '../../api/trackApi';

interface TrackFiltersProps {
  searchTerm: string;
  sortField: SortField;
  sortOrder: SortOrder;
  selectedGenre: string;
  onSearchChange: (term: string) => void;
  onSortChange: (field: SortField, order: SortOrder) => void;
  onGenreChange: (genre: string) => void;
}

const TrackFilters: React.FC<TrackFiltersProps> = ({ searchTerm, sortField, sortOrder, selectedGenre, onSearchChange, onSortChange, onGenreChange }) => {
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [errorGenres, setErrorGenres] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoadingGenres(true); setErrorGenres(null);
      try {
        const genres = await getGenres(); setAvailableGenres(genres);
      } catch (err) {
        console.error("Failed to fetch genres:", err); setErrorGenres("No genres.");
      } finally { setLoadingGenres(false); }
    };
    fetchGenres();
  }, []);

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => { onSortChange(e.target.value as SortField, sortOrder); };
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => { onSortChange(sortField, e.target.value as SortOrder); };

  return (
    <div className="track-filters">
      <input type="text" placeholder="Search by title, artist, album..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} data-testid="search-input" aria-label="Search tracks" />
      <div className="sort-controls">
        <label htmlFor="sort-field">Sort by:</label>
        <select id="sort-field" value={sortField} onChange={handleSortFieldChange} data-testid="sort-select" aria-label="Sort field">
          <option value="createdAt">Date Added</option> <option value="title">Title</option> <option value="artist">Artist</option> <option value="album">Album</option>
        </select>
        <select value={sortOrder} onChange={handleSortOrderChange} aria-label="Sort order">
          <option value="desc">Descending</option> <option value="asc">Ascending</option>
        </select>
      </div>
      <div className="filter-controls">
        <label htmlFor="filter-genre">Genre:</label>
        <select id="filter-genre" value={selectedGenre} onChange={(e) => onGenreChange(e.target.value)} data-testid="filter-genre" disabled={loadingGenres || !!errorGenres} aria-label="Filter by genre">
          <option value="">All Genres</option>
          {loadingGenres && <option disabled>Loading...</option>}
          {errorGenres && <option disabled>{errorGenres}</option>}
          {availableGenres.map((genre) => (<option key={genre} value={genre}>{genre}</option>))}
        </select>
      </div>
      <div className="filter-controls"> <label htmlFor="filter-artist">Artist:</label> <select id="filter-artist" data-testid="filter-artist" disabled> <option value="">All Artists</option> </select> </div>
    </div>
  );
};

export default TrackFilters;