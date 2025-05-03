import React from 'react';
import TrackItem from './TrackItem';
import { Track } from '../../types';

interface TrackListProps {
  tracks: Track[];
  loading: boolean;
  error: string | null;
  onEdit: (track: Track) => void;
  onDelete: (track: Track) => void;
  onUpload: (track: Track) => void;
  currentlyPlayingId: string | null;
  onPlayTrack: (trackId: string) => void;
  onPauseTrack: (trackId: string) => void;
  isSelectMode: boolean;
  selectedTrackIds: Set<string>;
  onToggleSelect: (trackId: string, selected: boolean) => void;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, loading, error, onEdit, onDelete, onUpload, currentlyPlayingId, onPlayTrack, onPauseTrack, isSelectMode, selectedTrackIds, onToggleSelect }) => {
  if (loading) { return <div data-testid="loading-tracks">Loading tracks...</div>; }
  if (error) { return <div className="error-message">Error loading tracks: {error}</div>; }
  if (tracks.length === 0) { return <div>No tracks found. Adjust filters or create one!</div>; }
  return (
    <div className="track-list">
      {tracks.map((track) => (
        <TrackItem
          key={track.id}
          track={track}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpload={onUpload}
          currentlyPlayingId={currentlyPlayingId}
          onPlayTrack={onPlayTrack}
          onPauseTrack={onPauseTrack}
          isSelectMode={isSelectMode}
          isSelected={selectedTrackIds.has(track.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
};

export default TrackList;