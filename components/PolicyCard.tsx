import React from 'react';
import { Policy } from '../types';
import * as LucideIcons from 'lucide-react';

interface PolicyCardProps {
  policy: Policy;
  selected: boolean;
  rank?: number;
  onToggle: (id: string) => void;
  disabled: boolean;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ policy, selected, rank, onToggle, disabled }) => {
  // Dynamic icon rendering
  const IconComponent = (LucideIcons as any)[policy.iconName] || LucideIcons.HelpCircle;

  return (
    <div
      onClick={() => {
        if (!disabled || selected) {
          onToggle(policy.id);
        }
      }}
      className={`
        group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer 
        flex flex-col h-full overflow-hidden
        ${selected
          ? 'border-terracotta bg-white shadow-lg ring-4 ring-terracotta/10 translate-y-[-4px]'
          : 'border-slate-100 bg-white hover:border-terracotta/50 hover:shadow-md hover:translate-y-[-2px]'
        }
        ${disabled && !selected ? 'opacity-40 cursor-not-allowed grayscale' : ''}
      `}
    >
      {selected && (
        <div className="absolute top-0 right-0 p-2">
          <div className="w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center font-bold shadow-sm animate-bounce">
            {rank}
          </div>
        </div>
      )}

      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-xl transition-colors duration-300 ${selected ? 'bg-terracotta text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-terracotta'}`}>
          <IconComponent size={28} />
        </div>
      </div>

      <h3 className={`font-bold text-lg mb-2 leading-tight ${selected ? 'text-terracotta' : 'text-slate-800'}`}>
        {policy.title}
      </h3>

      <p className="text-sm text-slate-500 mb-4 flex-grow leading-relaxed group-hover:hidden">
        {policy.description}
      </p>

      {/* Hover Content */}
      <div className="hidden group-hover:block flex-grow mb-4 animate-fade-in">
        <p className="text-xs font-bold text-terracotta mb-1">ตัวอย่างนโยบาย:</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          {policy.examples}
        </p>
      </div>


    </div>
  );
};

export default PolicyCard;