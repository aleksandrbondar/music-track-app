import React from 'react';
import Modal from './Modal';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isDeleting: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDeleting,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      testId="confirm-dialog"
    >
      <div className="confirm-dialog-content">
        <p>Are you sure you want to delete "{itemName}"?</p>
        <p>This action cannot be undone.</p>
      </div>
      <div className="confirm-dialog-actions">
        <button onClick={onClose} disabled={isDeleting} data-testid="cancel-delete">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          data-loading={isDeleting}
          aria-disabled={isDeleting}
          className="delete-confirm-button"
          data-testid="confirm-delete"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmDialog;