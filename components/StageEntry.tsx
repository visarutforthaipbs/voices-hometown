import React, { useState, useEffect } from 'react';
import { MapPin, Search, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { lookupPostcode } from '../data/postcodes';
import { LocationData } from '../types';

interface StageEntryProps {
  onComplete: (location: LocationData) => void;
}

const StageEntry: React.FC<StageEntryProps> = ({ onComplete }) => {
  const [zip, setZip] = useState('');
  const [error, setError] = useState('');
  const [possibleLocations, setPossibleLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    if (zip.length === 5) {
      const locations = lookupPostcode(zip);
      if (locations.length > 0) {
        setPossibleLocations(locations);
        // If only one match, auto-select
        if (locations.length === 1) {
          setSelectedLocation(locations[0]);
        } else {
          setSelectedLocation(null);
        }
        setError('');
      } else {
        setPossibleLocations([]);
        setSelectedLocation(null);
        setError('ไม่พบข้อมูลรหัสไปรษณีย์นี้ ลองตรวจสอบอีกครั้ง');
      }
    } else {
      setPossibleLocations([]);
      setSelectedLocation(null);
      setError('');
    }
  }, [zip]);

  const handleSelectLocation = (loc: LocationData) => {
    setSelectedLocation(loc);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto px-4 animate-fade-in">
      <div className="mb-6 md:mb-8">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-deepIndigo rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-white transform transition hover:scale-105">
          <MapPin className="w-8 h-8 md:w-9 md:h-9" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-deepIndigo mb-2">เสียงของคุณ... ส่งจากที่ไหน?</h2>
        <p className="text-sm md:text-base text-slate-500">กรอกรหัสไปรษณีย์เพื่อเริ่มต้นสะท้อนปัญหาในพื้นที่</p>
      </div>

      <div className="w-full relative mb-6">
        <input
          type="text"
          value={zip}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            if (val.length <= 5) setZip(val);
          }}
          placeholder="รหัสไปรษณีย์ 5 หลัก"
          className="w-full text-center text-2xl md:text-4xl font-bold tracking-widest p-4 md:p-5 border-2 border-slate-200 rounded-2xl focus:border-terracotta focus:outline-none focus:ring-4 focus:ring-terracotta/10 transition-all text-deepIndigo placeholder:text-slate-200 shadow-sm"
        />
        <div className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="w-6 h-6 md:w-7 md:h-7" />
        </div>
      </div>

      {error && (
        <div className="flex items-center text-red-500 bg-red-50 p-3 rounded-xl w-full justify-center mb-4 border border-red-100">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Multiple locations found selector */}
      {possibleLocations.length > 1 && (
        <div className="w-full mb-6 text-left animate-fade-in-up">
          <p className="text-sm font-bold text-slate-500 mb-2 ml-1">
            พบ {possibleLocations.length} พื้นที่ในรหัส {zip} กรุณาระบุตำบลของคุณ:
          </p>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-h-60 overflow-y-auto divide-y divide-slate-100">
            {possibleLocations.map((loc, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectLocation(loc)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between ${selectedLocation === loc ? 'bg-orange-50' : ''}`}
              >
                <div>
                  <span className="font-bold text-deepIndigo block">{loc.subdistrict}</span>
                  <span className="text-xs text-slate-400">อ.{loc.district} จ.{loc.province}</span>
                </div>
                {selectedLocation === loc && <CheckCircle2 className="text-terracotta" size={20} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Single location found display */}
      {possibleLocations.length === 1 && (
        <div className="w-full mb-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in-up text-left flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">พื้นที่ของคุณ</p>
            <div className="text-lg text-deepIndigo font-bold">
              ต.{possibleLocations[0].subdistrict} อ.{possibleLocations[0].district}
            </div>
            <div className="text-sm text-slate-500">จ.{possibleLocations[0].province}</div>
          </div>
          <div className="bg-green-100 text-green-600 p-2 rounded-full">
            <CheckCircle2 size={24} />
          </div>
        </div>
      )}

      {/* Confirm Button */}
      {selectedLocation && (
        <button
          onClick={() => onComplete(selectedLocation)}
          className="w-full bg-terracotta hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-orange-200 transform transition hover:-translate-y-1 active:scale-95 text-xl flex items-center justify-center animate-fade-in-up"
        >
          <span>ไปขั้นตอนต่อไป</span>
          <ChevronRight size={24} className="ml-2" />
        </button>
      )}
    </div>
  );
};

export default StageEntry;