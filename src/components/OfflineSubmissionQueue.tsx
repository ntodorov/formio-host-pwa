import { useState } from 'react';
import type { OfflinePluginInstance } from '@formio/offline-plugin';

interface OfflineSubmissionQueueProps {
  offlinePlugin: OfflinePluginInstance | null;
  queueLength: number;
  isOnline: boolean;
}

const OfflineSubmissionQueue: React.FC<OfflineSubmissionQueueProps> = ({
  offlinePlugin,
  queueLength,
  isOnline,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    if (!offlinePlugin || !isOnline || queueLength === 0) return;

    setIsSyncing(true);
    try {
      await offlinePlugin.dequeueSubmissions();
      console.log('Manual sync completed');
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearQueue = () => {
    if (!offlinePlugin) return;

    const confirmed = window.confirm(
      'Are you sure you want to clear all offline data? This will remove all queued submissions that have not been synced.'
    );

    if (confirmed) {
      offlinePlugin.clearOfflineData();
      console.log('Offline data cleared');
    }
  };

  if (queueLength === 0) {
    return null;
  }

  return (
    <div className="offline-queue-container">
      <div
        className="offline-queue-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="queue-info">
          <span className="queue-icon">📋</span>
          <span className="queue-title">Offline Submissions</span>
          <span className="queue-count-badge">{queueLength}</span>
        </div>
        <button
          className="expand-button"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="offline-queue-body">
          <p className="queue-description">
            {isOnline
              ? 'Your submissions will be synced automatically. You can also manually trigger a sync.'
              : 'You are offline. Submissions will be synced when connection is restored.'}
          </p>

          <div className="queue-status">
            <div className="status-item">
              <span className="status-label">Status:</span>
              <span
                className={`status-value ${isOnline ? 'online' : 'offline'}`}
              >
                {isOnline ? 'Ready to sync' : 'Waiting for connection'}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Pending:</span>
              <span className="status-value">
                {queueLength} submission{queueLength !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="queue-actions">
            <button
              className="btn btn-primary"
              onClick={handleManualSync}
              disabled={!isOnline || queueLength === 0 || isSyncing}
            >
              {isSyncing ? (
                <>
                  <span className="spinner"></span>
                  Syncing...
                </>
              ) : (
                'Sync Now'
              )}
            </button>
            <button
              className="btn btn-danger"
              onClick={handleClearQueue}
              disabled={isSyncing}
            >
              Clear Queue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineSubmissionQueue;
