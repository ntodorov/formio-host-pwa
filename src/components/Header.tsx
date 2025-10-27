import getFormioUserInfo from '../utilities/getFormioUserInfo';

const Header: React.FC = ({ handleLogout }) => {
  return (
    <header className='app-header'>
      <div className='header-content'>
        <h1 className='app-title'>AER Form Portal</h1>
        <p className='app-subtitle'>
          Alberta Energy Regulator - Dynamic Form Renderer
        </p>
      </div>
      <div className='app-subtitle '>{getFormioUserInfo()?.userName}</div>
      <div className='header-actions'>
        <button className='btn btn-secondary' onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </header>
  );
};

export default Header;
