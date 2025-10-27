import { useState, useEffect } from 'react';
import { Formio } from '@formio/js';
import type { Submission, SubmissionListProps } from '../types/submission';
import SubmissionCard from './SubmissionCard';

const SubmissionList = ({ formUrl }: SubmissionListProps) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const formio = new Formio(formUrl);
        const subs = await formio.loadSubmissions();
        setSubmissions(subs as Submission[]);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load submissions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [formUrl]); // Re-fetch if formUrl changes

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const handleCloseModal = () => {
    setSelectedSubmission(null);
  };

  const formName = formUrl.substring(formUrl.lastIndexOf('/') + 1);

  return (
    <div className="submission-list">
      <div className="submission-list-header">
        <h2 className="submission-list-title">
          Submissions for form: <span className="form-name">{formName}</span>
        </h2>
        <div className="submission-list-stats">
          <span className="stats-badge">
            Total: <strong>{submissions.length}</strong>
          </span>
        </div>
      </div>

      {isLoading && (
        <div className="submission-list-loading">
          <div className="loading-spinner"></div>
          <p>Loading submissions...</p>
        </div>
      )}

      {error && (
        <div className="submission-list-error">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && submissions.length === 0 && (
        <div className="submission-list-empty">
          <p>No submissions found for this form.</p>
        </div>
      )}

      {!isLoading && !error && submissions.length > 0 && (
        <div className="submission-grid">
          {submissions.map((submission) => (
            <SubmissionCard
              key={submission._id}
              submission={submission}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedSubmission && (
        <div className="submission-modal-overlay" onClick={handleCloseModal}>
          <div
            className="submission-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="submission-modal-header">
              <h3>Submission Details</h3>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="submission-modal-body">
              <div className="modal-section">
                <h4>Submission ID</h4>
                <p className="modal-id">{selectedSubmission._id}</p>
              </div>
              {selectedSubmission.created && (
                <div className="modal-section">
                  <h4>Created</h4>
                  <p>{new Date(selectedSubmission.created).toLocaleString()}</p>
                </div>
              )}
              {selectedSubmission.modified && (
                <div className="modal-section">
                  <h4>Last Modified</h4>
                  <p>
                    {new Date(selectedSubmission.modified).toLocaleString()}
                  </p>
                </div>
              )}
              <div className="modal-section">
                <h4>Submission Data</h4>
                <pre className="modal-data">
                  {JSON.stringify(selectedSubmission.data, null, 2)}
                </pre>
              </div>
            </div>
            <div className="submission-modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionList;
