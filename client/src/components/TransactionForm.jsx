import { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';
import './TransactionForm.css';

const TransactionForm = ({ transaction, tags, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    date: new Date().toISOString().split('T')[0],
    description: '',
    payment_method: 'CASH',
    recurrence_type: 'NONE',
    tagIds: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date,
        description: transaction.description,
        payment_method: transaction.payment_method || 'CASH',
        recurrence_type: transaction.recurrence_type || 'NONE',
        tagIds: transaction.tags?.map(t => t.id) || []
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (transaction) {
        await transactionsAPI.update(transaction.id, formData);
      } else {
        await transactionsAPI.create(formData);
      }
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il salvataggio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form-overlay">
      <div className="transaction-form-card">
        <h3>{transaction ? 'Modifica Transazione' : 'Nuova Transazione'}</h3>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Tipo</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="INCOME">Entrata</option>
                <option value="EXPENSE">Uscita</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Importo (€)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">Data</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrizione</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              disabled={loading}
              placeholder="Es: Spesa al supermercato, Stipendio mensile..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="payment_method">Metodo di Pagamento</label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="CASH">Contanti</option>
                <option value="CARD">Carta</option>
                <option value="BANK_TRANSFER">Bonifico</option>
                <option value="OTHER">Altro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="recurrence_type">Ricorrenza</label>
              <select
                id="recurrence_type"
                name="recurrence_type"
                value={formData.recurrence_type}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="NONE">Nessuna</option>
                <option value="DAILY">Giornaliera</option>
                <option value="WEEKLY">Settimanale</option>
                <option value="MONTHLY">Mensile</option>
                <option value="YEARLY">Annuale</option>
              </select>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="form-group">
              <label>Categorie</label>
              <div className="tag-selector">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    className={`tag-option ${
                      formData.tagIds.includes(tag.id) ? 'selected' : ''
                    }`}
                    style={{
                      backgroundColor: formData.tagIds.includes(tag.id)
                        ? tag.color
                        : '#f0f0f0',
                      color: formData.tagIds.includes(tag.id) ? '#fff' : '#333'
                    }}
                    onClick={() => handleTagToggle(tag.id)}
                    disabled={loading}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={loading}>
              Annulla
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvataggio...' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
