import getFormioUserInfo from '../utilities/getFormioUserInfo';

interface HeaderProps {
  handleLogout: () => void;
  isOnline?: boolean;
  queueLength?: number;
}

const Header: React.FC<HeaderProps> = ({
  handleLogout,
  isOnline = true,
  queueLength = 0,
}) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">AER Form Portal</h1>
        <p className="app-subtitle">
          Alberta Energy Regulator - Dynamic Form Renderer
        </p>
      </div>
      <div className="header-status">
        <div className="app-subtitle">{getFormioUserInfo()?.userName}</div>
        <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
          <span className="status-dot"></span>
          <span className="status-text">{isOnline ? 'Online' : 'Offline'}</span>
          {queueLength > 0 && (
            <span className="queue-badge">{queueLength} queued</span>
          )}
        </div>
      </div>
      <div className="header-actions">
        <button className="btn btn-secondary" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </header>
  );
};

export default Header;
