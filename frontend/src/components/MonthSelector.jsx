import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export default function MonthSelector({ selectedYear, selectedMonth, onMonthChange, availableMonths }) {
  const [isOpen, setIsOpen] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentSelection = `${monthNames[selectedMonth - 1]} ${selectedYear}`;

  const handleSelect = (year, month) => {
    onMonthChange(year, month);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:border-rose transition-colors"
      >
        <Calendar className="w-4 h-4 text-rose" />
        <span className="font-medium">{currentSelection}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-border rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
          {availableMonths.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No photos yet
            </div>
          ) : (
            <div className="py-2">
              {availableMonths.map((item) => (
                <button
                  key={`${item.year}-${item.month}`}
                  onClick={() => handleSelect(item.year, item.month)}
                  className={`w-full px-4 py-2 text-left hover:bg-rose-light/20 transition-colors flex justify-between items-center ${
                    item.year === selectedYear && item.month === selectedMonth
                      ? 'bg-rose-light/30 text-rose font-medium'
                      : ''
                  }`}
                >
                  <span>{monthNames[item.month - 1]} {item.year}</span>
                  <span className="text-xs text-gray-500">{item.photo_count} photos</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
