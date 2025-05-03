import React from 'react';
import Modal from '../Common/Modal';
import TrackForm from './TrackForm';
import { CreateTrackDTO, UpdateTrackDTO } from '../../types';

interface CreateTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  createTrack: (data: CreateTrackDTO) => void;
  isCreating: boolean;
}

const CreateTrackModal: React.FC<CreateTrackModalProps> = ({ isOpen, onClose, createTrack, isCreating }) => {

  const handleSubmit = (data: CreateTrackDTO | UpdateTrackDTO) => {
    createTrack(data as CreateTrackDTO);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Track">
      <TrackForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isCreating}
        submitButtonText="Create Track"
      />
    </Modal>
  );
};

export default CreateTrackModal;