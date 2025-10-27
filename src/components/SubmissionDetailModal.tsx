import { useState } from 'react';
import { Form } from '@formio/react';
import type { SubmissionDetailModalProps } from '../types/submission';

const SubmissionDetailModal = ({
  submission,
  formUrl,
  onClose,
}: SubmissionDetailModalProps) => {
  const [isFormLoading, setIsFormLoading] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFormReady = (form: unknown) => {
    console.log('Form ready in modal:', form);
    // Ensure form is completely read-only
    if (form && typeof form === 'object' && 'disabled' in form) {
      (form as { disabled: boolean }).disabled = true;
    }
    setIsFormLoading(false);
  };

  const handleFormError = (error: unknown) => {
    console.error('Form error in modal:', error);
    setFormError('Failed to load form. Please try again.');
    setIsFormLoading(false);
  };

  return (
    <div className="submission-modal-overlay" onClick={onClose}>
      <div className="submission-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="submission-modal-header">
          <div className="modal-header-content">
            <h3>Submission Details</h3>
            <div className="modal-metadata-badges">
              <span className="metadata-badge" title="Submission ID">
                <strong>ID:</strong> {submission._id.substring(0, 12)}...
              </span>
              {submission.state && (
                <span
                  className={`metadata-badge state-badge state-${submission.state}`}
                >
                  {submission.state}
                </span>
              )}
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Metadata Section */}
        <div className="submission-modal-metadata">
          <div className="metadata-item">
            <span className="metadata-label">Created:</span>
            <span className="metadata-value">
              {formatDate(submission.created)}
            </span>
          </div>
          {submission.modified && (
            <div className="metadata-item">
              <span className="metadata-label">Last Modified:</span>
              <span className="metadata-value">
                {formatDate(submission.modified)}
              </span>
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="submission-modal-body">
          {isFormLoading && (
            <div className="modal-form-loading">
              <div className="loading-spinner"></div>
              <p>Loading form...</p>
            </div>
          )}

          {formError && (
            <div className="modal-form-error">
              <p>{formError}</p>
            </div>
          )}

          <div className="submission-modal-form-container">
            <Form
              src={formUrl}
              submission={submission as never}
              options={{
                readOnly: true,
                viewAsHtml: false,
              }}
              onFormReady={handleFormReady}
              onError={handleFormError}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="submission-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailModal;
