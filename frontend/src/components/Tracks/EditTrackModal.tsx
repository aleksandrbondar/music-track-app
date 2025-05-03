import React from 'react';
import Modal from '../Common/Modal';
import TrackForm from './TrackForm';
import { Track, UpdateTrackDTO, CreateTrackDTO } from '../../types';

interface EditTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackToEdit: Track | null;
  updateTrack: (data: UpdateTrackDTO) => void;
  isUpdating: boolean;
}

const EditTrackModal: React.FC<EditTrackModalProps> = ({ isOpen, onClose, trackToEdit, updateTrack, isUpdating }) => {

  const handleSubmit = (data: CreateTrackDTO | UpdateTrackDTO) => {
    if (!trackToEdit) return;
    updateTrack(data as UpdateTrackDTO);
  };

  return (
    <Modal isOpen={isOpen && !!trackToEdit} onClose={onClose} title={`Edit Track: ${trackToEdit?.title || ''}`}>
      {trackToEdit && (
        <TrackForm
          initialData={trackToEdit}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isUpdating}
          submitButtonText="Save Changes"
        />
      )}
    </Modal>
  );
};

export default EditTrackModal;