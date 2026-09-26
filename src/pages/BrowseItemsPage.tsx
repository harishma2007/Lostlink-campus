import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Item, ItemCategory, ItemStatus, ItemType } from '../types/index';
import { ItemCard } from '../components/ItemCard';
import {
  Search,
  Filter,
  PlusCircle,
  HelpCircle,
  X,
  SlidersHorizontal,
  PackageOpen,
  RotateCcw,
} from 'lucide-react';

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'ID Cards',
  'Books',
  'Bags',
  'Wallets',
  'Keys',
  'Accessories',
  'Clothing',
  'Other',
];

const LOCATIONS = [
  'All Campus Locations',
  'CSE Block',
  'Central Library',
  'Student Activity Center',
  'Sports Complex',
  'North Campus Bicycle Stand',
  'Mechanical Engg Block',
  'Auditorium',
  'Cafeteria',
];

const STATUSES: ItemStatus[] = ['Lost', 'Found', 'Claim Pending', 'Verified', 'Returned'];

export const BrowseItemsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state sync
  const initialType = searchParams.get('type') || 'all';
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [activeTab, setActiveTab] = useState<string>(initialType);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const typeParam = activeTab === 'all' ? undefined : activeTab;
        const res = await api.getItems({
          type: typeParam,
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          status: selectedStatus === 'All' ? undefined : selectedStatus,
          location: selectedLocation === 'All Campus Locations' || selectedLocation === 'All' ? undefined : selectedLocation,
          search: searchQuery.trim() || undefined,
        });
        setItems(res.items);
      } catch (err: any) {
        setError(err.message || 'Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [activeTab, selectedCategory, selectedLocation, selectedStatus, searchQuery]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams(prev => {
      if (tab === 'all') {
        prev.delete('type');
      } else {
        prev.set('type', tab);
      }
      return prev;
    });
  };

  const handleResetFilters = () => {
    setActiveTab('all');
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSelectedStatus('All');
    setSearchParams({});
  };

  const hasActiveFilters =
    activeTab !== 'all' ||
    selectedCategory !== 'All' ||
    selectedLocation !== 'All' ||
    selectedStatus !== 'All' ||
    searchQuery !== '';

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Campus Directory
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Search and explore lost and found reports across all campus blocks.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/report-lost"
                className="px-3.5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Report Lost
              </Link>
              <Link
                to="/report-found"
                className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Report Found
              </Link>
            </div>
          </div>

          {/* Segmented Tab Bar (Constitutional Functional Control) */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => handleTabChange('all')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Reports
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('lost')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'lost'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Lost Items
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('found')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'found'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Found Items
              </button>
            </div>

            <div className="text-xs text-slate-500 font-mono tabular-nums">
              Showing {items.length} verified listings
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 space-y-4">
          
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, model, color, or location..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="All">All Statuses</option>
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filters pill-less bar and reset */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Filters Applied</span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All Filters
              </button>
            </div>
          )}

        </div>

        {/* Content Display */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 rounded-xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-white rounded-xl border border-rose-200 text-rose-700">
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={handleResetFilters}
              className="mt-3 px-3 py-1.5 text-xs bg-rose-50 text-rose-800 rounded-md font-medium"
            >
              Clear filters and reload
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <PackageOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No matching items found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query, clearing filters, or submit a new report.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
              <Link
                to="/report-lost"
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Report Lost Item
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
