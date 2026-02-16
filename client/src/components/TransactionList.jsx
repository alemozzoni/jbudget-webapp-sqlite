import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import './TransactionList.css';

const TransactionList = ({ transactions, tags, onEdit, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>Nessuna transazione ancora. Inizia aggiungendone una!</p>
      </div>
    );
  }

  const formatAmount = (amount, type) => {
    const formatted = new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);

    return type === 'INCOME' ? `+${formatted}` : `-${formatted}`;
  };

  const getTagById = (tagId) => {
    return tags.find(t => t.id === tagId);
  };

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className={`transaction-card ${transaction.type.toLowerCase()}`}
        >
          <div className="transaction-main">
            <div className="transaction-info">
              <h3>{transaction.description}</h3>
              <p className="transaction-date">
                {format(new Date(transaction.date), 'dd MMMM yyyy', { locale: it })}
              </p>
              {transaction.tags && transaction.tags.length > 0 && (
                <div className="transaction-tags">
                  {transaction.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="tag"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="transaction-amount">
              <span className={`amount ${transaction.type.toLowerCase()}`}>
                {formatAmount(transaction.amount, transaction.type)}
              </span>
            </div>
          </div>

          <div className="transaction-actions">
            <button
              onClick={() => onEdit(transaction)}
              className="btn btn-sm btn-secondary"
            >
              ✏️ Modifica
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="btn btn-sm btn-danger"
            >
              🗑️ Elimina
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
