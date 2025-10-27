import type { SubmissionCardProps } from '../types/submission';

const SubmissionCard = ({ submission, onViewDetails }: SubmissionCardProps) => {
  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Extract key fields from submission data
  const getKeyFields = (): Array<{ label: string; value: string }> => {
    const fields: Array<{ label: string; value: string }> = [];
    const data = submission.data;

    // Limit to first 3 key fields to keep card concise
    const keys = Object.keys(data).slice(0, 3);

    keys.forEach((key) => {
      let value: string = '';
      const rawValue = data[key];

      // Handle different data types
      if (typeof rawValue === 'object' && rawValue !== null) {
        value = JSON.stringify(rawValue);
      } else if (rawValue === null || rawValue === undefined) {
        value = 'N/A';
      } else {
        value = String(rawValue);
      }

      // Truncate long values
      if (value.length > 50) {
        value = value.substring(0, 50) + '...';
      }

      fields.push({
        label:
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        value,
      });
    });

    return fields;
  };

  const keyFields = getKeyFields();
  const totalFields = Object.keys(submission.data).length;

  return (
    <div className="submission-card">
      <div className="submission-card-header">
        <h3 className="submission-card-title">Submission</h3>
        <span className="submission-card-id">
          {submission._id.substring(0, 8)}...
        </span>
      </div>

      <div className="submission-card-body">
        <div className="submission-card-meta">
          <div className="meta-item">
            <span className="meta-label">Created:</span>
            <span className="meta-value">{formatDate(submission.created)}</span>
          </div>
          {submission.modified && (
            <div className="meta-item">
              <span className="meta-label">Modified:</span>
              <span className="meta-value">
                {formatDate(submission.modified)}
              </span>
            </div>
          )}
          {submission.state && (
            <div className="meta-item">
              <span className="meta-label">State:</span>
              <span className={`meta-badge state-${submission.state}`}>
                {submission.state}
              </span>
            </div>
          )}
        </div>

        {keyFields.length > 0 && (
          <div className="submission-card-fields">
            <h4 className="fields-title">Key Data Fields</h4>
            {keyFields.map((field, index) => (
              <div key={index} className="field-item">
                <span className="field-label">{field.label}:</span>
                <span className="field-value">{field.value}</span>
              </div>
            ))}
            {totalFields > 3 && (
              <p className="fields-more">
                +{totalFields - 3} more field{totalFields - 3 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </div>

      {onViewDetails && (
        <div className="submission-card-footer">
          <button
            className="btn btn-view-details"
            onClick={() => onViewDetails(submission)}
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmissionCard;
