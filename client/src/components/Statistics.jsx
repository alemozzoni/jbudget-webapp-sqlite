import { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Wallet, 
  CreditCard, 
  Building2, 
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  BarChart3
} from 'lucide-react';
import './Statistics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistics = ({ transactions, tags }) => {
  const [period, setPeriod] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('both'); // 'income', 'expense', 'both'

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        if (customStartDate) startDate = new Date(customStartDate);
        if (customEndDate) endDate = new Date(customEndDate);
        break;
      default:
        return transactions;
    }

    return transactions.filter(t => {
      const transDate = new Date(t.date);
      if (startDate && transDate < startDate) return false;
      if (endDate && transDate > endDate) return false;
      return true;
    });
  }, [transactions, period, customStartDate, customEndDate]);

  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const byTag = {};
    const byMonth = {};
    const byPaymentMethod = {
      CASH: { income: 0, expense: 0 },
      CARD: { income: 0, expense: 0 },
      BANK_TRANSFER: { income: 0, expense: 0 },
      OTHER: { income: 0, expense: 0 }
    };

    filteredTransactions.forEach(t => {
      const amount = parseFloat(t.amount);

      if (t.type === 'INCOME') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }

      // By tag
      t.tags?.forEach(tag => {
        if (!byTag[tag.name]) {
          byTag[tag.name] = { income: 0, expense: 0, color: tag.color };
        }
        if (t.type === 'INCOME') {
          byTag[tag.name].income += amount;
        } else {
          byTag[tag.name].expense += amount;
        }
      });

      // By month
      const month = t.date.substring(0, 7);
      if (!byMonth[month]) {
        byMonth[month] = { income: 0, expense: 0 };
      }
      if (t.type === 'INCOME') {
        byMonth[month].income += amount;
      } else {
        byMonth[month].expense += amount;
      }

      // By payment method
      const paymentMethod = t.payment_method || 'CASH';
      if (byPaymentMethod[paymentMethod]) {
        if (t.type === 'INCOME') {
          byPaymentMethod[paymentMethod].income += amount;
        } else {
          byPaymentMethod[paymentMethod].expense += amount;
        }
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      byTag,
      byMonth,
      byPaymentMethod
    };
  }, [filteredTransactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Monthly chart data
  const monthlyChartData = {
    labels: Object.keys(stats.byMonth).sort(),
    datasets: [
      {
        label: 'Entrate',
        data: Object.keys(stats.byMonth)
          .sort()
          .map(m => stats.byMonth[m].income),
        backgroundColor: 'rgba(46, 213, 115, 0.8)',
      },
      {
        label: 'Uscite',
        data: Object.keys(stats.byMonth)
          .sort()
          .map(m => stats.byMonth[m].expense),
        backgroundColor: 'rgba(255, 71, 87, 0.8)',
      }
    ]
  };

  const filteredTags = Object.keys(stats.byTag)
    .filter(t => stats.byTag[t]?.expense > 0)


  // Category pie chart data
  const categoryChartData = {
    labels: filteredTags,
      datasets: [
        {
          label: 'Spese per Categoria',
          data: filteredTags.map(t => stats.byTag[t].expense),
          backgroundColor: filteredTags.map(t => stats.byTag[t].color),
        }
      ]
  };

  return (
    <div className="statistics">
      <div className="statistics-header">
        <h2>
          <Calendar size={28} />
          <span>Statistiche</span>
        </h2>
        
        <div className="period-filter">
          <Filter size={18} />
          <label>Periodo:</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="all">Tutto</option>
            <option value="week">Ultima settimana</option>
            <option value="month">Questo mese</option>
            <option value="quarter">Questo trimestre</option>
            <option value="year">Quest'anno</option>
            <option value="custom">Personalizzato</option>
          </select>
          
          {period === 'custom' && (
            <div className="custom-date-range">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                placeholder="Da"
              />
              <span>-</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                placeholder="A"
              />
            </div>
          )}
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card income">
          <h3>Entrate Totali</h3>
          <p className="stat-value">{formatCurrency(stats.totalIncome)}</p>
        </div>

        <div className="stat-card expense">
          <h3>Uscite Totali</h3>
          <p className="stat-value">{formatCurrency(stats.totalExpense)}</p>
        </div>

        <div className={`stat-card ${stats.balance >= 0 ? 'balance-positive' : 'balance-negative'}`}>
          <h3>Bilancio</h3>
          <p className="stat-value">{formatCurrency(stats.balance)}</p>
        </div>
      </div>

      {Object.keys(stats.byMonth).length > 0 && (
        <div className="chart-container">
          <h3>Entrate e Uscite Mensili</h3>
          <Bar
            data={monthlyChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      )}

      {Object.keys(stats.byTag).length > 0 && (
        <div className="chart-container">
          <h3>Distribuzione Spese per Categoria</h3>
          <div className="pie-chart-wrapper">
            <Pie
              data={categoryChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Payment Methods Statistics */}
      <div className="payment-methods-section">
        <div className="payment-section-header">
          <h3>
            <CreditCard size={24} />
            <span>Metodi di Pagamento</span>
          </h3>
          
          {/* Toggle Filter */}
          <div className="payment-filter-toggle">
            <button
              className={`filter-btn ${paymentFilter === 'income' ? 'active income-btn' : ''}`}
              onClick={() => setPaymentFilter('income')}
            >
              <TrendingUp size={18} />
              <span>Solo Entrate</span>
            </button>
            <button
              className={`filter-btn ${paymentFilter === 'both' ? 'active both-btn' : ''}`}
              onClick={() => setPaymentFilter('both')}
            >
              <BarChart3 size={18} />
              <span>Entrambi</span>
            </button>
            <button
              className={`filter-btn ${paymentFilter === 'expense' ? 'active expense-btn' : ''}`}
              onClick={() => setPaymentFilter('expense')}
            >
              <TrendingDown size={18} />
              <span>Solo Uscite</span>
            </button>
          </div>
        </div>

        <div className="payment-methods-grid">
          {Object.entries(stats.byPaymentMethod).map(([method, data]) => {
            // Calcola i valori da mostrare in base al filtro
            const showIncome = paymentFilter === 'income' || paymentFilter === 'both';
            const showExpense = paymentFilter === 'expense' || paymentFilter === 'both';
            
            // Se il metodo non ha dati per il filtro selezionato, non mostrarlo
            if (paymentFilter === 'income' && data.income === 0) return null;
            if (paymentFilter === 'expense' && data.expense === 0) return null;
            if (paymentFilter === 'both' && data.income === 0 && data.expense === 0) return null;
            
            const methodConfig = {
              CASH: { 
                name: 'Contanti', 
                icon: Wallet,
                color: '#10b981'
              },
              CARD: { 
                name: 'Carta', 
                icon: CreditCard,
                color: '#3b82f6'
              },
              BANK_TRANSFER: { 
                name: 'Bonifico', 
                icon: Building2,
                color: '#8b5cf6'
              },
              OTHER: { 
                name: 'Altro', 
                icon: FileText,
                color: '#6b7280'
              }
            };

            const config = methodConfig[method];
            const Icon = config.icon;

            // Calcola il totale in base al filtro
            let total = 0;
            if (showIncome) total += data.income;
            if (showExpense) total -= data.expense;

            return (
              <div key={method} className="payment-method-card">
                <div className="payment-card-header" style={{ borderLeftColor: config.color }}>
                  <Icon size={32} color={config.color} />
                  <h4>{config.name}</h4>
                </div>
                
                <div className="payment-card-body">
                  {showIncome && paymentFilter === 'income' && (
                    <div className="payment-single-value income-value">
                      <TrendingUp size={20} />
                      <span className="label">Entrate</span>
                      <span className="amount">{formatCurrency(data.income)}</span>
                    </div>
                  )}
                  
                  {showExpense && paymentFilter === 'expense' && (
                    <div className="payment-single-value expense-value">
                      <TrendingDown size={20} />
                      <span className="label">Uscite</span>
                      <span className="amount">{formatCurrency(data.expense)}</span>
                    </div>
                  )}
                  
                  {paymentFilter === 'both' && (
                    <>
                      <div className="payment-row income-row">
                        <div className="payment-label">
                          <TrendingUp size={18} />
                          <span>Entrate</span>
                        </div>
                        <div className="payment-value">
                          {formatCurrency(data.income)}
                        </div>
                      </div>
                      
                      <div className="payment-row expense-row">
                        <div className="payment-label">
                          <TrendingDown size={18} />
                          <span>Uscite</span>
                        </div>
                        <div className="payment-value">
                          {formatCurrency(data.expense)}
                        </div>
                      </div>
                      
                      <div className="payment-divider"></div>
                      
                      <div className="payment-row total-row">
                        <div className="payment-label">
                          <span className="total-label">Totale</span>
                        </div>
                        <div className="payment-value payment-total">
                          {formatCurrency(total)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {Object.keys(stats.byTag).length > 0 && (
        <div className="category-breakdown">
          <h3>Dettaglio per Categoria</h3>
          <div className="category-list">
            {Object.entries(stats.byTag).map(([name, data]) => (
              <div key={name} className="category-item">
                <div className="category-header">
                  <span
                    className="category-color"
                    style={{ backgroundColor: data.color }}
                  ></span>
                  <span className="category-name">{name}</span>
                </div>
                <div className="category-amounts">
                  <span className="category-income">
                    Entrate: {formatCurrency(data.income)}
                  </span>
                  <span className="category-expense">
                    Uscite: {formatCurrency(data.expense)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
