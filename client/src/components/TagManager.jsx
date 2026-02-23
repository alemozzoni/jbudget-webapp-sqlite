import { useState } from 'react';
import { tagsAPI } from '../services/api';
import { Plus, Edit2, Trash2, X, Save, Tag as TagIcon } from 'lucide-react';
import './TagManager.css';

const TagManager = ({ tags, onTagsChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3498db',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#3498db',
      description: ''
    });
    setEditingTag(null);
    setError('');
  };

  const handleOpenModal = (tag = null) => {
    if (tag) {
      setFormData({
        name: tag.name,
        color: tag.color,
        description: tag.description || ''
      });
      setEditingTag(tag);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingTag) {
        await tagsAPI.update(editingTag.id, formData);
      } else {
        await tagsAPI.create(formData);
      }
      
      // Ricarica tags
      const response = await tagsAPI.getAll();
      onTagsChange(response.data.data);
      
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il salvataggio');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tagId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa categoria?')) {
      return;
    }

    try {
      await tagsAPI.delete(tagId);
      
      // Ricarica tags
      const response = await tagsAPI.getAll();
      onTagsChange(response.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Errore durante l\'eliminazione');
    }
  };

  const predefinedColors = [
    '#e74c3c', // Rosso
    '#3498db', // Blu
    '#2ecc71', // Verde
    '#f39c12', // Arancione
    '#9b59b6', // Viola
    '#1abc9c', // Turchese
    '#e67e22', // Arancione scuro
    '#34495e', // Grigio scuro
    '#16a085', // Verde acqua
    '#c0392b', // Rosso scuro
    '#8e44ad', // Viola scuro
    '#27ae60'  // Verde scuro
  ];

  return (
    <div className="tag-manager">
      <div className="tag-manager-header">
        <h3>
          <TagIcon size={20} />
          <span>Gestione Categorie</span>
        </h3>
        <button className="btn btn-primary btn-small" onClick={() => handleOpenModal()}>
          <Plus size={16} />
          <span>Nuova Categoria</span>
        </button>
      </div>

      <div className="tags-list">
        {tags.length === 0 ? (
          <div className="empty-tags">
            <TagIcon size={48} color="#ccc" />
            <p>Nessuna categoria creata</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={16} />
              <span>Crea la tua prima categoria</span>
            </button>
          </div>
        ) : (
          <div className="tags-grid">
            {tags.map(tag => (
              <div key={tag.id} className="tag-card">
                <div className="tag-card-header" style={{ backgroundColor: tag.color }}>
                  <span className="tag-name">{tag.name}</span>
                </div>
                <div className="tag-card-body">
                  {tag.description && (
                    <p className="tag-description">{tag.description}</p>
                  )}
                  <div className="tag-card-actions">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleOpenModal(tag)}
                    >
                      <span>✏️ Modifica</span>
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(tag.id)}
                    >
                      <span>🗑️ Elimina</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTag ? 'Modifica Categoria' : 'Nuova Categoria'}</h3>
              <button className="btn-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="tag-form">
              <div className="form-group">
                <label htmlFor="name">Nome Categoria *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  maxLength={50}
                  placeholder="Es: Cibo, Trasporto, Stipendio..."
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descrizione</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  maxLength={200}
                  placeholder="Breve descrizione della categoria..."
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Colore</label>
                <div className="color-picker">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${formData.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                      disabled={loading}
                      title={color}
                    />
                  ))}
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="color-input"
                    disabled={loading}
                    title="Scegli colore personalizzato"
                  />
                </div>
              </div>

              <div className="preview-tag">
                <span className="label">Anteprima:</span>
                <span
                  className="tag-preview"
                  style={{
                    backgroundColor: formData.color,
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '600'
                  }}
                >
                  {formData.name || 'Nome Categoria'}
                </span>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <Save size={16} />
                  <span>{loading ? 'Salvataggio...' : 'Salva'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagManager;
