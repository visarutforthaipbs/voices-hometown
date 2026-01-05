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
  const [showMethodology, setShowMethodology] = useState(false);

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
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-deepIndigo text-lg">เลือก 3 นโยบายที่ "ใช่" ที่สุด</h2>
            <button
              onClick={() => setShowMethodology(true)}
              className="text-slate-400 hover:text-terracotta transition-colors"
            >
              <Info size={18} />
            </button>
          </div>
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
            <RotateCcw size={12} className="mr-1" /> ล้างค่าเลือกใหม่
          </button>
        )}
      </div>

      {showMethodology && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="font-bold text-xl text-deepIndigo">ที่มาของชุดนโยบาย</h3>
              <button
                onClick={() => setShowMethodology(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <RotateCcw className="rotate-45" size={24} />
              </button>
            </div>
            <div className="p-6 text-slate-600 space-y-6 leading-relaxed text-sm md:text-base">
              <div>
                <h4 className="font-bold text-deepIndigo mb-2">ส่วนที่ 1 Disclaimer คำชี้แจงอธิบายกระบวนการกลั่นกรองตัวเลือก</h4>
                <p>เพื่อให้ชุดตัวเลือกในแบบสำรวจนี้สะท้อนปัญหาที่แท้จริงและครอบคลุมความเดือดร้อนของประชาชนในทุกภูมิภาค ทีมงานได้พัฒนากระบวนการคัดสรรประเด็นสำคัญที่สัมพันธ์กับการพัฒนาและนโยบายเชิงพื้้นที่ ผ่านขั้นตอนการทำงานอย่างเป็นระบบ โดยผสมผสานเทคโนโลยีการวิเคราะห์ข้อมูลเข้ากับงานวิชาการเชิงพื้นที่...</p>
                <p className="mt-2 text-xs text-slate-400">อ่านเพิ่มเติม...</p>
                {/* Note to USER: I've truncated this for brevity but can add full text if you wish */}
              </div>
              <div>
                <h4 className="font-bold text-deepIndigo mb-2">ส่วนที่ 1 Disclaimer คำชี้แจงอธิบายกระบวนการกลั่นกรองตัวเลือก</h4>
                <p className="mb-4">เพื่อให้ชุดตัวเลือกในแบบสำรวจนี้สะท้อนปัญหาที่แท้จริงและครอบคลุมความเดือดร้อนของประชาชนในทุกภูมิภาค ทีมงานได้พัฒนากระบวนการคัดสรรประเด็นสำคัญที่สัมพันธ์กับการพัฒนาและนโยบายเชิงพื้้นที่ ผ่านขั้นตอนการทำงานอย่างเป็นระบบ โดยผสมผสานเทคโนโลยีการวิเคราะห์ข้อมูลเข้ากับงานวิชาการเชิงพื้นที่ สามารถอธิบายกระบวนการได้ดังต่อไปนี้</p>

                <p className="mb-2"><strong className="text-terracotta">ขั้นตอนแรก</strong> นำฐานข้อมูลตั้งต้นที่นำมาใช้วิเคราะห์มาจากสองแหล่งหลัก แหล่งแรกคือฐานข้อมูลจากภาคพลเมือง ผ่านแพลตฟอร์ม C-Site จำนวน 40,000 รายการ และเครือข่ายนักข่าวพลเมืองที่เกาะติดสถานการณ์จริงในระดับท้องถิ่น แหล่งที่สองคือข้อมูลเชิงวิชาการจากรายงานความต้องการระดับพื้นที่ หรือ Area Need และรายงานสถานการณ์ความยั่งยืนระดับภูมิภาค (SDG Insights) ทั้ง 4 ภาค ซึ่งเป็นข้อมูลที่ผ่านการสังเคราะห์และตรวจสอบความถูกต้องตามหลักวิชาการแล้ว</p>

                <p className="mb-2"><strong className="text-terracotta">ลำดับถัดมา</strong> การประมวลผลข้อมูลปริมาณจำนวนใช้เครื่องมือทางวิทยาศาสตร์ข้อมูลเข้ามาช่วยจัดการ คณะทำงานได้เขียนชุดคำสั่งด้วยภาษาไพธอน (Python) เพื่อทำหน้าที่ประมวลผลภาษาธรรมชาติ โดยเริ่มจากการทำความสะอาดข้อมูลเพื่อคัดกรองคำฟุ่มเฟือยออก จากนั้นจึงใช้กระบวนการตัดคำและแยกส่วนประกอบของประโยคเพื่อค้นหาคำสำคัญ ที่ถูกกล่าวถึงบ่อยครั้งที่สุดในแต่ละบริบทพื้นที่ (จังหวัด) รวมถึงการวิเคราะห์ความสัมพันธ์ของคำที่มักปรากฏร่วมกันเพื่อดูความเชื่อมโยงของปัญหา</p>

                <p className="mb-2"><strong className="text-terracotta">ขั้นตอนต่อมา</strong> คือ การจัดกลุ่มและสังเคราะห์ประเด็น เมื่อได้ชุดคำสำคัญที่มีนัยสำคัญทางสถิติแล้ว ทีมงานได้นำมาจัดหมวดหมู่ใหม่โดยเทียบเคียงกับยุทธศาสตร์การพัฒนาประเทศ เพื่อยกระดับจากปัญหาเฉพาะจุดให้กลายเป็นโจทย์เชิงโครงสร้าง</p>

                <p><strong className="text-terracotta">ท้ายที่สุด</strong> คือ การออกแบบภาษาเพื่อการสื่อสาร คณะทำงานได้ทำการแปลงศัพท์ทางเทคนิคและภาษาราชการ ให้กลายเป็นภาษาที่สื่อถึงผลลัพธ์ในชีวิตจริงของประชาชน ตัวเลือกทั้ง 20 ข้อจึงเป็นโจทย์ที่พร้อมนำไปสู่การออกแบบนโยบายกฎหมายและการจัดสรรงบประมาณใหม่ที่เหมาะสมต่อไป</p>
              </div>

              <div>
                <h4 className="font-bold text-deepIndigo mb-2">ส่วนที่ 2 การแปลงภาษาเชิงนโยบายสู่ผลลัพธ์ในชีวิต</h4>
                <p>หัวใจสำคัญของการออกแบบตัวเลือกชุดนี้คือการเปลี่ยนจุดเน้นจากการสื่อสารด้วยกระบวนการทำงานของภาครัฐ มาเป็นการสื่อสารด้วยความรู้สึกและผลลัพธ์ที่ประชาชนจะได้รับ โดยมีตัวอย่างการเปรียบเทียบ ยกตัวอย่าง</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><span className="font-bold">กรณีปัญหาหนี้สิน:</span> จาก "การปรับปรุงโครงสร้างหนี้..." ปรับเป็น <span className="text-terracotta font-bold">"ล้างหนี้สิน ตั้งหลักชีวิตใหม่"</span></li>
                  <li><span className="font-bold">กรณีปัญหามลพิษ:</span> จาก "การบูรณาการจัดการปัญหาหมอกควัน..." ปรับเป็น <span className="text-terracotta font-bold">"อากาศสะอาด หายใจได้เต็มปอด"</span></li>
                  <li><span className="font-bold">กรณีปัญหาการกระจายอำนาจ:</span> จาก "การส่งเสริมการกระจายอำนาจ..." ปรับเป็น <span className="text-terracotta font-bold">"ท้องถิ่นจัดการตนเอง งบถึงมือ ไม่ต้องรอส่วนกลาง"</span></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-deepIndigo mb-2">ส่วนที่ 3 โครงสร้างข้อมูลเพื่อการประมวลผล</h4>
                <p>ระบบฐานข้อมูลถูกออกแบบให้มีการจัดเก็บข้อมูลแบบหลายมิติ หรือ Metadata เมื่อประชาชนเลือกหัวข้อวาระ ระบบจะบันทึกข้อมูลรหัสไปรษณีย์เพื่อระบุพิกัดทางภูมิศาสตร์ และบันทึกป้ายกำกับเชิงโครงสร้างที่ซ่อนอยู่เบื้องหลัง เพื่อให้นักวิเคราะห์สรุปรากเหง้าของปัญหาได้</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setShowMethodology(false)}
                className="w-full bg-deepIndigo text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        </div>
      )}

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