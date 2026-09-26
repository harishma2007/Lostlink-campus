import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../types/index';
import { MapPin, Calendar, Clock, AlertTriangle, CheckCircle, Package } from 'lucide-react';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  // Status badge styling
  const getStatusDisplay = () => {
    switch (item.status) {
      case 'Lost':
        return { text: 'Lost', color: 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'Found':
        return { text: 'Found & Safekeeping', color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
      case 'Claim Pending':
        return { text: 'Claim In Review', color: 'text-blue-800 bg-blue-50 border-blue-200' };
      case 'Verified':
        return { text: 'Owner Verified', color: 'text-purple-800 bg-purple-50 border-purple-200' };
      case 'Returned':
        return { text: 'Returned to Owner', color: 'text-slate-700 bg-slate-100 border-slate-200' };
      default:
        return { text: item.status, color: 'text-slate-700 bg-slate-50 border-slate-200' };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <Link
      to={`/item/${item.id}`}
      className="group flex flex-col bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 overflow-hidden"
    >
      {/* Visual Thumbnail */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {item.image && !imageError ? (
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4 text-center">
            <Package className="w-10 h-10 text-slate-300 mb-1" />
            <span className="text-[11px] font-medium text-slate-400">Campus Verification Photo</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">{item.reportId}</span>
          </div>
        )}

        {/* Quiet type tag in corner */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border shadow-2xs ${
              item.type === 'lost'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {item.type}
          </span>
        </div>

        {item.isSuspicious && (
          <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-2xs">
            <AlertTriangle className="w-3 h-3" />
            Flagged
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Unboxed metadata line with dot separators */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
          <span className="font-semibold text-emerald-800">{item.category}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[11px] tabular-nums text-slate-500">{item.reportId}</span>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
          {item.name}
        </h3>

        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Campus Location & Date */}
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{item.date}</span>
            </div>
            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
