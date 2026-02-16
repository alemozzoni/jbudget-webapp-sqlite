import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, AlertTriangle, ArrowLeft, Mail, Shield, Trash2, Save } from 'lucide-react';
import './Profile.css';

function Profile() {
  const { user, updateProfile, updatePassword, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profilo aggiornato con successo' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Errore durante l\'aggiornamento' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Le password non corrispondono' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La password deve essere di almeno 6 caratteri' });
      setLoading(false);
      return;
    }

    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password aggiornata con successo' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Errore durante l\'aggiornamento della password' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile e cancellerà tutti i tuoi dati.')) {
      return;
    }

    if (!window.confirm('Confermi di voler eliminare definitivamente il tuo account?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteAccount();
      logout();
      navigate('/login');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Errore durante l\'eliminazione dell\'account' });
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="user-avatar">
              <User size={32} />
            </div>
            <div className="user-info">
              <h1>Il Mio Profilo</h1>
              <p>{user?.email}</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <User size={20} />
            <span>Informazioni</span>
          </button>
          <button
            className={`tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <Lock size={20} />
            <span>Sicurezza</span>
          </button>
          <button
            className={`tab ${activeTab === 'danger' ? 'active' : ''}`}
            onClick={() => setActiveTab('danger')}
          >
            <AlertTriangle size={20} />
            <span>Elimina Account</span>
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Content */}
        <div className="profile-content">
          {activeTab === 'info' && (
            <div className="tab-panel">
              <div className="panel-header">
                <User size={24} />
                <h2>Informazioni Personali</h2>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <User size={16} />
                      <span>Nome Completo</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                      placeholder="Il tuo nome"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Mail size={16} />
                      <span>Email</span>
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                      placeholder="la.tua@email.com"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  <Save size={18} />
                  <span>{loading ? 'Salvataggio...' : 'Salva Modifiche'}</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="tab-panel">
              <div className="panel-header">
                <Shield size={24} />
                <h2>Sicurezza Account</h2>
              </div>
              
              <form onSubmit={handlePasswordUpdate} className="profile-form">
                <div className="form-group">
                  <label>
                    <Lock size={16} />
                    <span>Password Attuale</span>
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    placeholder="Inserisci password attuale"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Lock size={16} />
                    <span>Nuova Password</span>
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                    placeholder="Minimo 6 caratteri"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Lock size={16} />
                    <span>Conferma Nuova Password</span>
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                    placeholder="Ripeti la nuova password"
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  <Shield size={18} />
                  <span>{loading ? 'Aggiornamento...' : 'Cambia Password'}</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="tab-panel danger-panel">
              <div className="panel-header danger-header">
                <AlertTriangle size={24} />
                <h2>Elimina Account</h2>
              </div>
              
              <div className="danger-content">
                <div className="warning-box">
                  <AlertTriangle size={20} />
                  <div>
                    <h3>Eliminazione Account</h3>
                    <p>Una volta eliminato il tuo account:</p>
                    <ul>
                      <li>Tutti i tuoi dati verranno cancellati permanentemente</li>
                      <li>Tutte le transazioni e statistiche saranno perse</li>
                      <li>Questa azione NON può essere annullata</li>
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={handleDeleteAccount} 
                  className="btn-danger"
                  disabled={loading}
                >
                  <Trash2 size={18} />
                  <span>{loading ? 'Eliminazione...' : 'Elimina Account Permanentemente'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
