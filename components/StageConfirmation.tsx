import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { Policy, LocationData } from '../types';
import { submitVote } from '../config/firebase';

interface StageConfirmationProps {
  location: LocationData;
  selectedPolicies: Policy[];
  onConfirm: (additionalText: string) => void;
  onBack: () => void;
}

const StageConfirmation: React.FC<StageConfirmationProps> = ({ location, selectedPolicies, onConfirm, onBack }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);

    // Prepare data for Firebase
    const voteData = {
      location: {
        province: location.province,
        district: location.district,
        subdistrict: location.subdistrict,
        zipcode: location.zipcode
      },
      selectedPolicies: selectedPolicies.map((p, index) => ({
        id: p.id,
        title: p.title,
        rank: index + 1
      })),
      additionalComment: comment
    };

    const success = await submitVote(voteData);

    if (success) {
      onConfirm(comment);
    } else {
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล โปรดลองใหม่อีกครั้ง");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-deepIndigo mb-2">ยืนยันเสียงของคุณ</h2>
        <p className="text-slate-500">
          3 สิ่งที่อยากเห็นการเปลี่ยนแปลงใน <span className="text-terracotta font-bold">จ.{location.province}</span>
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {selectedPolicies.map((policy, index) => (
          <div key={policy.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-deepIndigo text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
              {index + 1}
            </div>
            <div>
              <h3 className="font-bold text-deepIndigo">{policy.title}</h3>
              <p className="text-sm text-slate-500">{policy.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="flex items-center mb-3 text-deepIndigo font-bold">
          <MessageSquare size={20} className="mr-2 text-terracotta" />
          ข้อความเพิ่มเติมถึงผู้สมัคร (ไม่บังคับ)
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="เช่น อยากให้แก้ปัญหาถนนในซอย..., อยากให้เพิ่มรถเมล์..."
          className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent outline-none min-h-[120px]"
        ></textarea>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 px-6 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50"
        >
          แก้ไข
        </button>
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className={`flex-[2] py-4 px-6 rounded-xl bg-terracotta text-white font-bold shadow-lg shadow-orange-200 flex items-center justify-center ${isSubmitting ? 'opacity-80 cursor-wait' : 'hover:bg-orange-700'}`}
        >
          {isSubmitting ? (
            <span>กำลังส่งข้อมูล...</span>
          ) : (
            <>
              <Send size={20} className="mr-2" />
              ยืนยันและส่งข้อมูล
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StageConfirmation;