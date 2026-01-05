import React, { useState } from 'react';
import { ArrowRight, Info, RotateCcw } from 'lucide-react';
import { POLICIES } from '../data/policies';
import PolicyCard from './PolicyCard';
import { Policy } from '../types';

interface StageSelectionProps {
  onComplete: (selectedPolicies: Policy[]) => void;
}

const StageSelection: React.FC<StageSelectionProps> = ({ onComplete }) => {
  // Stores IDs in order of selection (which is the ranking)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const togglePolicy = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(pid => pid !== id));
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const getRank = (id: string) => {
    const index = selectedIds.indexOf(id);
    return index !== -1 ? index + 1 : undefined;
  };

  const isFull = selectedIds.length === 3;

  const handleSubmit = () => {
    const selectedPolicies = selectedIds
      .map(id => POLICIES.find(p => p.id === id))
      .filter((p): p is Policy => !!p);
    onComplete(selectedPolicies);
  };

  return (
    <div className="pb-24">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 sticky top-20 z-10 mx-4 lg:mx-0">
        <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-deepIndigo text-lg">เลือก 3 นโยบายที่ "ใช่" ที่สุด</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${isFull ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {selectedIds.length} / 3
            </span>
        </div>
        <p className="text-sm text-slate-500">
            {selectedIds.length === 0 && "แตะเพื่อเลือกอันดับ 1"}
            {selectedIds.length === 1 && "เลือกอันดับ 2 ต่อเลย"}
            {selectedIds.length === 2 && "สุดท้าย! เลือกอันดับ 3"}
            {selectedIds.length === 3 && "ครบแล้ว! กดปุ่มด้านล่างเพื่อไปต่อ"}
        </p>
        
        {selectedIds.length > 0 && (
             <button 
                onClick={() => setSelectedIds([])}
                className="text-xs text-red-500 flex items-center mt-2 hover:underline"
             >
                <RotateCcw size={12} className="mr-1"/> ล้างค่าเลือกใหม่
             </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-0">
        {POLICIES.map((policy) => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            selected={selectedIds.includes(policy.id)}
            rank={getRank(policy.id)}
            onToggle={togglePolicy}
            disabled={isFull && !selectedIds.includes(policy.id)}
          />
        ))}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-xl transition-transform duration-300 ${isFull ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="hidden sm:block">
                <p className="font-bold text-deepIndigo">เลือกครบ 3 ข้อแล้ว</p>
                <p className="text-xs text-slate-500">พร้อมที่จะส่งเสียงของคุณหรือยัง?</p>
            </div>
            <button
                onClick={handleSubmit}
                disabled={!isFull}
                className="w-full sm:w-auto bg-deepIndigo hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center space-x-2"
            >
                <span>ไปขั้นตอนต่อไป</span>
                <ArrowRight size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default StageSelection;