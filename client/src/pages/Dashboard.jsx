import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { transactionsAPI, tagsAPI } from '../services/api';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import Statistics from '../components/Statistics';
import TagManager from '../components/TagManager';
import { Receipt, BarChart3, Plus, User, LogOut, Tag } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('transactions');
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [transRes, tagsRes] = await Promise.all([
                transactionsAPI.getAll(),
                tagsAPI.getAll()
            ]);
            setTransactions(transRes.data.data);
            setTags(tagsRes.data.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAddTransaction = () => {
        setEditingTransaction(null);
        setShowForm(true);
    };

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setShowForm(true);
    };

    const handleDeleteTransaction = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questa transazione?')) {
            try {
                await transactionsAPI.delete(id);
                await loadData();
            } catch (error) {
                console.error('Error deleting transaction:', error);
                alert('Errore durante l\'eliminazione della transazione');
            }
        }
    };

    const handleFormSubmit = async () => {
        setShowForm(false);
        setEditingTransaction(null);
        await loadData();
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingTransaction(null);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Caricamento...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="container">
                    <h1>JBudget</h1>
                    <div className="user-menu">
                        <span>Ciao, {user?.name}!</span>
                        <button onClick={() => navigate('/profile')} className="btn btn-secondary btn-with-icon">
                            <User size={18} />
                            <span>Profilo</span>
                        </button>
                        <button onClick={handleLogout} className="btn btn-secondary btn-with-icon">
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <nav className="dashboard-nav">
                <div className="container">
                    <button
                        className={`nav-btn ${activeView === 'transactions' ? 'active' : ''}`}
                        onClick={() => setActiveView('transactions')}
                    >
                        <Receipt size={20} />
                        <span>Transazioni</span>
                    </button>
                    <button
                        className={`nav-btn ${activeView === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveView('categories')}
                    >
                        <Tag size={20} />
                        <span>Categorie</span>
                    </button>
                    <button
                        className={`nav-btn ${activeView === 'statistics' ? 'active' : ''}`}
                        onClick={() => setActiveView('statistics')}
                    >
                        <BarChart3 size={20} />
                        <span>Statistiche</span>
                    </button>
                </div>
            </nav>

            <main className="dashboard-main">
                <div className="container">
                    {activeView === 'transactions' && (
                        <>
                            <div className="section-header">
                                <h2>Le tue Transazioni</h2>
                                <button onClick={handleAddTransaction} className="btn btn-primary btn-with-icon">
                                    <Plus size={18} />
                                    <span>Aggiungi Transazione</span>
                                </button>
                            </div>

                            {showForm && (
                                <TransactionForm
                                    transaction={editingTransaction}
                                    tags={tags}
                                    onSubmit={handleFormSubmit}
                                    onCancel={handleFormCancel}
                                />
                            )}

                            <TransactionList
                                transactions={transactions}
                                tags={tags}
                                onEdit={handleEditTransaction}
                                onDelete={handleDeleteTransaction}
                            />
                        </>
                    )}

                    {activeView === 'categories' && (
                        <TagManager
                            tags={tags}
                            onTagsChange={setTags}
                        />
                    )}

                    {activeView === 'statistics' && (
                        <Statistics transactions={transactions} tags={tags} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;