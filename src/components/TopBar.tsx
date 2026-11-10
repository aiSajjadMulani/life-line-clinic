import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Calendar, UserPlus, Stethoscope, ArrowRight } from 'lucide-react';
import { Patient } from '../types/clinic';

interface TopBarProps {
  onOpenMobileMenu: () => void;
  onOpenNewPatient: () => void;
  onOpenNewVisit: (preSelectedPatientId?: string) => void;
  onSelectPatient: (patientId: string) => void;
  patients: Patient[];
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileMenu,
  onOpenNewPatient,
  onOpenNewVisit,
  onSelectPatient,
  patients
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  const searchResults = searchQuery.trim()
    ? patients
        .filter((p) => {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q) ||
            p.mobile.includes(q) ||
            p.complaint.toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between gap-4 no-print">
      {/* Left: Mobile Toggle & Live Patient Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div ref={searchRef} className="relative flex-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Quick search patient by name, mobile, or ID..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-900 placeholder-slate-400 rounded-xl border border-transparent focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
            />
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  <p className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Matching Patients ({searchResults.length})
                  </p>
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectPatient(p.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">{p.name}</span>
                          <span className="text-xs font-mono bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-200">
                            {p.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {p.age}y / {p.gender} · {p.mobile} · {p.complaint}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-sky-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <span>View Chart</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500">
                  No registered patient found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Date Chip & Primary Action CTAs */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{formattedDate}</span>
        </div>

        <button
          onClick={() => onOpenNewVisit()}
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-xl transition-all shadow-xs"
        >
          <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
          <span>Log Visit</span>
        </button>

        <button
          onClick={onOpenNewPatient}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl transition-all shadow-sm shadow-sky-600/30"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>New Patient</span>
        </button>
      </div>
    </header>
  );
};
