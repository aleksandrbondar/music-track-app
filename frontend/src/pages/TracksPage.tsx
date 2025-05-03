/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// Импорты компонентов
import TrackList from '../components/Tracks/TrackList';
import TrackFilters from '../components/Tracks/TrackFilters';
import Pagination from '../components/Common/Pagination';
import CreateTrackModal from '../components/Tracks/CreateTrackModal';
import EditTrackModal from '../components/Tracks/EditTrackModal';
import UploadTrackModal from '../components/Tracks/UploadTrackModal';
import DeleteConfirmDialog from '../components/Common/DeleteConfirmDialog';
import { Track, PaginationMeta, SortField, SortOrder, GetTracksParams, UpdateTrackDTO } from '../types';
import { getTracks, deleteTrack, deleteMultipleTracks, createTrack, updateTrack, uploadTrackAudio, deleteTrackAudio } from '../api/trackApi';
import useDebounce from '../hooks/useDebounce';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 5;

const TracksPage: React.FC = () => {
  // --- Состояния UI ---
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedGenre, setSelectedGenre] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState<Track | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [trackToUpload, setTrackToUpload] = useState<Track | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(new Set());

  // --- React Query ---
  const queryClient = useQueryClient();

  const queryParams: GetTracksParams = useMemo(() => ({
    page: currentPage, limit: ITEMS_PER_PAGE, sort: sortField, order: sortOrder,
    search: debouncedSearchTerm, genre: selectedGenre || undefined,
  }), [currentPage, sortField, sortOrder, debouncedSearchTerm, selectedGenre]);

  const { data: tracksData, isLoading: isLoadingTracks, error: tracksError, isFetching: isFetchingTracks } = useQuery({
    queryKey: ['tracks', queryParams],
    queryFn: () => getTracks(queryParams),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });

  const tracks: Track[] = tracksData?.data || [];
  const paginationMeta: PaginationMeta | null = tracksData?.meta || null;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedGenre, sortField, sortOrder]);


  // --- Мутации ---
  const createTrackMutation = useMutation({ mutationFn: createTrack, onSuccess: (createdTrack) => { toast.success(`Track "${createdTrack.title}" created.`); queryClient.invalidateQueries({ queryKey: ['tracks'] }); setIsCreateModalOpen(false); }, onError: (error: any) => { toast.error(error.response?.data?.error || 'Failed to create.'); console.error(error); }, });
  const updateTrackMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: UpdateTrackDTO }) => updateTrack(id, data), onSuccess: (updatedTrack) => { toast.success(`Track "${updatedTrack.title}" updated.`); queryClient.invalidateQueries({ queryKey: ['tracks'] }); setIsEditModalOpen(false); setTrackToEdit(null); }, onError: (error: any) => { toast.error(error.response?.data?.error || 'Failed to update.'); console.error(error); }, });
  const uploadAudioMutation = useMutation({ mutationFn: ({ id, file }: { id: string; file: File }) => uploadTrackAudio(id, file), onSuccess: (updatedTrack) => { toast.success(`Audio uploaded for "${updatedTrack.title}".`); queryClient.invalidateQueries({ queryKey: ['tracks'] }); setIsUploadModalOpen(false); setTrackToUpload(null); }, onError: (error: any) => { toast.error(error.response?.data?.error || 'Upload failed.'); console.error(error); }, });
  const deleteAudioMutation = useMutation({ mutationFn: deleteTrackAudio, onSuccess: (updatedTrack) => { toast.success(`Audio removed for "${updatedTrack.title}".`); queryClient.invalidateQueries({ queryKey: ['tracks'] }); }, onError: (error: any) => { toast.error(error.response?.data?.error || 'Failed to delete audio.'); console.error(error); }, });
  const deleteTrackMutation = useMutation({ mutationFn: deleteTrack, onSuccess: () => { toast.success(`Track deleted.`); queryClient.invalidateQueries({ queryKey: ['tracks'] }); setIsDeleteConfirmOpen(false); setTrackToDelete(null); }, onError: (error: any) => { toast.error(error.response?.data?.error || 'Failed to delete track.'); console.error(error); }, });
  const bulkDeleteMutation = useMutation({ mutationFn: (ids: string[]) => deleteMultipleTracks({ ids }), onSuccess: (response) => { toast.success(`${response.success.length} track(s) deleted.`); if (response.failed.length > 0) { toast.error(`${response.failed.length} failed.`); console.warn("Failed IDs:", response.failed); } queryClient.invalidateQueries({ queryKey: ['tracks'] }); setSelectedTrackIds(new Set()); setIsSelectMode(false); setIsBulkDeleteConfirmOpen(false); }, onError: (error: any) => { toast.error(error.response?.data?.error || 'Bulk delete failed.'); console.error(error); }, });


  // --- Обработчики UI ---
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleOpenEditModal = (track: Track) => { setTrackToEdit(track); setIsEditModalOpen(true); };
  const handleOpenUploadModal = (track: Track) => { setTrackToUpload(track); setIsUploadModalOpen(true); };
  const handleOpenDeleteConfirm = (track: Track) => { setTrackToDelete(track); setIsDeleteConfirmOpen(true); };
  const handleOpenBulkDeleteConfirm = () => { if (selectedTrackIds.size > 0) setIsBulkDeleteConfirmOpen(true); };

  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleCloseEditModal = () => { setIsEditModalOpen(false); setTrackToEdit(null); };
  const handleCloseUploadModal = () => { setIsUploadModalOpen(false); setTrackToUpload(null); };
  const handleCloseDeleteConfirm = () => { setIsDeleteConfirmOpen(false); setTrackToDelete(null); };
  const handleCloseBulkDeleteConfirm = () => { setIsBulkDeleteConfirmOpen(false); };

  const handleConfirmDelete = () => { if (trackToDelete) deleteTrackMutation.mutate(trackToDelete.id); };
  const handleConfirmBulkDelete = () => { const ids = Array.from(selectedTrackIds); if (ids.length > 0) bulkDeleteMutation.mutate(ids); };

  const handlePageChange = (page: number) => { setCurrentPage(page); };
  const handleSortChange = (field: SortField, order: SortOrder) => { setSortField(field); setSortOrder(order); };
  const handleGenreChange = (genre: string) => { setSelectedGenre(genre); };

  const handlePlayTrack = (trackId: string) => { setCurrentlyPlayingId(trackId); };
  const handlePauseTrack = (trackId: string) => { if (currentlyPlayingId === trackId) setCurrentlyPlayingId(null); };

  const toggleSelectMode = () => { setIsSelectMode(!isSelectMode); setSelectedTrackIds(new Set()); };

  const handleToggleTrackSelect = (trackId: string, selected: boolean) => {
    setSelectedTrackIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (selected) {
        newSelected.add(trackId);
      } else {
        newSelected.delete(trackId);
      }
      return newSelected;
    });
  };

  const areAllVisibleSelected = tracks.length > 0 && tracks.every(track => selectedTrackIds.has(track.id));

  const handleToggleSelectAll = () => {
    const newSelected = new Set(selectedTrackIds);
    if (areAllVisibleSelected) {
      tracks.forEach(track => newSelected.delete(track.id));
    } else {
      tracks.forEach(track => newSelected.add(track.id));
    }
    setSelectedTrackIds(newSelected);
  };

  return (
    <div className="tracks-page">
      <h1 data-testid="tracks-header">Music Tracks</h1>

      {/* Действия */}
      <div className="page-actions">
        {!isSelectMode && (<button onClick={handleOpenCreateModal} data-testid="create-track-button" disabled={isLoadingTracks}>Create New Track</button>)}
        <button onClick={toggleSelectMode} data-testid="select-mode-toggle">{isSelectMode ? 'Cancel Selection' : 'Select Tracks'}</button>
        {isSelectMode && selectedTrackIds.size > 0 && (<button onClick={handleOpenBulkDeleteConfirm} data-testid="bulk-delete-button" className="delete-button" disabled={bulkDeleteMutation.isPending}>Delete Selected ({selectedTrackIds.size})</button>)}
      </div>

      {/* Фильтры */}
      <TrackFilters searchTerm={searchTerm} sortField={sortField} sortOrder={sortOrder} selectedGenre={selectedGenre} onSearchChange={setSearchTerm} onSortChange={handleSortChange} onGenreChange={handleGenreChange} />

      {/* Выбрать все */}
      {isSelectMode && tracks.length > 0 && (
        <div className="select-all-container">
          <input type="checkbox" id="select-all-checkbox" checked={areAllVisibleSelected} onChange={handleToggleSelectAll} data-testid="select-all" />
          <label htmlFor="select-all-checkbox">Select All Visible ({tracks.length})</label>
        </div>
      )}

      {/* Состояния загрузки/ошибки */}
      {isLoadingTracks && <div data-testid="loading-indicator">Loading initial data...</div>}
      {isFetchingTracks && !isLoadingTracks && <div data-testid="loading-indicator" style={{ fontSize: '0.8em', fontStyle: 'italic', textAlign: 'right', padding: '0 10px' }}>Updating...</div>}
      {tracksError && <div className="error-message">Error loading tracks: {(tracksError as Error).message}</div>}

      {/* Список треков */}
      {!isLoadingTracks && !tracksError && (
        <TrackList
          tracks={tracks} loading={false} error={null}
          onEdit={handleOpenEditModal} onDelete={handleOpenDeleteConfirm} onUpload={handleOpenUploadModal}
          currentlyPlayingId={currentlyPlayingId} onPlayTrack={handlePlayTrack} onPauseTrack={handlePauseTrack}
          isSelectMode={isSelectMode} selectedTrackIds={selectedTrackIds} onToggleSelect={handleToggleTrackSelect}
        />
      )}

      {/* Пагинация */}
      {paginationMeta && paginationMeta.totalPages > 1 && (
        <Pagination currentPage={paginationMeta.page} totalPages={paginationMeta.totalPages} onPageChange={handlePageChange} loading={isFetchingTracks} />
      )}

      {/* Модальные окна */}
      <CreateTrackModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} createTrack={createTrackMutation.mutate} isCreating={createTrackMutation.isPending} />
      <EditTrackModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} trackToEdit={trackToEdit} updateTrack={(data) => trackToEdit && updateTrackMutation.mutate({ id: trackToEdit.id, data })} isUpdating={updateTrackMutation.isPending} />
      <UploadTrackModal isOpen={isUploadModalOpen} onClose={handleCloseUploadModal} trackToUpload={trackToUpload} uploadAudio={uploadAudioMutation.mutate} isUploading={uploadAudioMutation.isPending} deleteAudio={deleteAudioMutation.mutate} isDeletingAudio={deleteAudioMutation.isPending} />
      <DeleteConfirmDialog isOpen={isDeleteConfirmOpen} onClose={handleCloseDeleteConfirm} onConfirm={handleConfirmDelete} itemName={trackToDelete?.title || ''} isDeleting={deleteTrackMutation.isPending} />
      <DeleteConfirmDialog isOpen={isBulkDeleteConfirmOpen} onClose={handleCloseBulkDeleteConfirm} onConfirm={handleConfirmBulkDelete} itemName={`${selectedTrackIds.size} track(s)`} isDeleting={bulkDeleteMutation.isPending} />
    </div>
  );
};

export default TracksPage;