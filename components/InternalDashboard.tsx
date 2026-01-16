import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Award, Filter, Map } from 'lucide-react';
import { POLICIES } from '../data/policies';
import { subscribeToVotes } from '../config/firebase';

// Mock regions for Thailand
const REGIONS = [
    { id: 'all', name: 'ทั่วประเทศ' },
    { id: 'north', name: 'ภาคเหนือ' },
    { id: 'northeast', name: 'ภาคอีสาน' },
    { id: 'central', name: 'ภาคกลาง' },
    { id: 'south', name: 'ภาคใต้' },
    { id: 'bangkok', name: 'กรุงเทพฯ และปริมณฑล' }
];

const InternalDashboard: React.FC = () => {
    const [selectedRegion, setSelectedRegion] = useState<string>('all');

    // Real data state
    const [votes, setVotes] = useState<any[]>([]);

    useEffect(() => {
        // Subscribe to real-time updates
        const unsubscribe = subscribeToVotes((newVotes) => {
            setVotes(newVotes);
        });
        return () => unsubscribe();
    }, []);

    // Process data based on selectedRegion
    const data = useMemo(() => {
        // Initialize scores for all policies to 0
        const scores: Record<string, number> = {};
        POLICIES.forEach(p => scores[p.id] = 0);
        let count = 0;

        votes.forEach(vote => {
            // Filter by region if needed
            if (selectedRegion !== 'all') {
                const region = vote.location?.region || '';
                // Simple mapping or check
                let match = false;
                if (selectedRegion === 'bangkok' && region.includes('กรุงเทพ')) match = true;
                else if (selectedRegion === 'north' && region.includes('เหนือ') && !region.includes('ตะวันออกเฉียงเหนือ')) match = true;
                else if (selectedRegion === 'northeast' && (region.includes('ตะวันออกเฉียงเหนือ') || region.includes('อีสาน'))) match = true;
                else if (selectedRegion === 'south' && region.includes('ใต้')) match = true;
                else if (selectedRegion === 'central' && (region.includes('กลาง') || region.includes('ตะวันตก') || (region.includes('ตะวันออก') && !region.includes('เฉียงเหนือ')))) match = true;

                if (!match) return; // Skip this vote
            }

            count++;
            // Weighted scoring: Rank 1 = 3pts, Rank 2 = 2pts, Rank 3 = 1pt
            vote.selectedPolicies.forEach((p: any) => {
                if (scores[p.id] !== undefined) {
                    const points = 4 - p.rank;
                    scores[p.id] += points;
                }
            });
        });

        // Convert back to array for chart
        const sortedPolicies = POLICIES.map(p => ({
            name: p.title,
            shortName: p.title.substring(0, 15),
            votes: scores[p.id],
            id: p.id,
            category: p.iconName
        })).sort((a, b) => b.votes - a.votes);

        return { sortedPolicies, respondentCount: count };
    }, [votes, selectedRegion]);

    const topPolicies = data.sortedPolicies.slice(0, 10);
    const totalVotes = data.sortedPolicies.reduce((acc, curr) => acc + curr.votes, 0);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-deepIndigo flex flex-col">
            <header className="bg-deepIndigo text-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Map size={20} className="text-terracotta" />
                        </div>
                        <h1 className="font-bold text-xl tracking-tight">Internal Board <span className="text-slate-400 text-sm font-normal ml-2">| Monitoring System</span></h1>
                    </div>
                    <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                        Internal Use Only
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

                {/* Filters and Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-500 mb-2 flex items-center">
                            <Filter size={16} className="mr-2" />
                            เลือกภูมิภาค
                        </label>
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-deepIndigo font-medium focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none transition-all"
                        >
                            {REGIONS.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>

                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-xs text-slate-400 mb-1">ยอดโหวตรวม ({REGIONS.find(r => r.id === selectedRegion)?.name})</p>
                            <p className="text-3xl font-bold text-terracotta">{totalVotes.toLocaleString()}</p>

                            <div className="mt-4 pt-4 border-t border-slate-100/50">
                                <p className="text-xs text-slate-400 mb-1">จำนวนผู้ตอบแบบสำรวจ</p>
                                <p className="text-xl font-bold text-deepIndigo">{data.respondentCount.toLocaleString()} <span className="text-sm font-normal text-slate-400">คน</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-3 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-lg flex items-center">
                                <Award className="text-yellow-500 mr-2" size={24} />
                                10 อันดับนโยบายยอดนิยม
                            </h2>
                            <span className="text-sm text-slate-400">อัปเดตล่าสุด: {new Date().toLocaleTimeString()}</span>
                        </div>

                        <div className="flex-grow min-h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topPolicies} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={180}
                                        tick={{ fontSize: 13, fill: '#64748b' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: '#f1f5f9' }}
                                    />
                                    <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={24}>
                                        {topPolicies.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index < 3 ? '#ea580c' : '#94a3b8'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Detailed List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-deepIndigo">รายละเอียดคะแนนรายนโยบาย</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-sm">
                                <tr>
                                    <th className="p-4 font-medium">อันดับ</th>
                                    <th className="p-4 font-medium">นโยบาย</th>
                                    <th className="p-4 font-medium text-right">คะแนนโหวต</th>
                                    <th className="p-4 font-medium text-right">สัดส่วน</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {data.sortedPolicies.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 w-16 text-center font-bold text-slate-400">#{idx + 1}</td>
                                        <td className="p-4 font-medium text-deepIndigo w-2/3">{item.name}</td>
                                        <td className="p-4 text-right font-bold text-terracotta">{item.votes.toLocaleString()}</td>
                                        <td className="p-4 text-right text-slate-500">{((item.votes / totalVotes) * 100).toFixed(1)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default InternalDashboard;
