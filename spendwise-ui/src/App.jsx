import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Trash2, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api/transactions';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
    category: { id: '' }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [txRes, catRes] = await Promise.all([
        axios.get(API_BASE_URL),
        axios.get(`${API_BASE_URL}/categories`)
      ]);
      setTransactions(txRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0) {
        setFormData(prev => ({ ...prev, category: { id: catRes.data[0].id } }));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category.id) return;
    
    try {
      await axios.post(API_BASE_URL, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setFormData({
        amount: '',
        description: '',
        transactionDate: new Date().toISOString().split('T')[0],
        category: { id: categories[0]?.id || '' }
      });
      fetchData();
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  // Financial Calculations
  const income = transactions
    .filter(t => t.category?.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter(t => t.category?.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center pb-4 border-b border-slate-800">
          <h1 className="text-3xl font-bold tracking-tight text-emerald-400">Spendwise</h1>
          <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full">MVP v1.0</span>
        </header>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-sm font-medium">Total Balance</span>
              <Wallet className="w-5 h-5 text-indigo-400" />
            </div>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-white' : 'text-rose-400'}`}>
              ₹{balance.toFixed(2)}
            </p>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-sm font-medium">Total Income</span>
              <ArrowUpCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">₹{income.toFixed(2)}</p>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-sm font-medium">Total Expenses</span>
              <ArrowDownCircle className="w-5 h-5 text-rose-400" />
            </div>
            <p className="text-2xl font-bold text-rose-400">₹{expense.toFixed(2)}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Transaction Form */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50 h-fit">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" /> Add Transaction
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Category</label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  value={formData.category.id}
                  onChange={e => setFormData({ ...formData, category: { id: e.target.value } })}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  value={formData.transactionDate}
                  onChange={e => setFormData({ ...formData, transactionDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Groceries, Freelance work"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-2 rounded-lg transition"
              >
                Save Transaction
              </button>
            </form>
          </div>

          {/* Transactions Table */}
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            {transactions.length === 0 ? (
              <p className="text-slate-400 text-sm">No transactions logged yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3 text-right">Amount</th>
                      <th className="pb-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-slate-700/20">
                        <td className="py-3 text-slate-400">{t.transactionDate}</td>
                        <td className="py-3 font-medium">{t.category?.name}</td>
                        <td className="py-3 text-slate-400">{t.description || '-'}</td>
                        <td className={`py-3 text-right font-semibold ${t.category?.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {t.category?.type === 'INCOME' ? '+' : '-'}₹{Number(t.amount).toFixed(2)}
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-slate-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}