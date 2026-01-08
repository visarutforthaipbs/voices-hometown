import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Share2, Map, Award } from 'lucide-react';
import { Policy, LocationData } from '../types';
import { POLICIES } from '../data/policies';
import { subscribeToVotes } from '../config/firebase';

interface StageDashboardProps {
    location: LocationData;
    userSelection: Policy[];
}

const StageDashboard: React.FC<StageDashboardProps> = ({ location, userSelection }) => {

    // Real data state
    const [votes, setVotes] = React.useState<any[]>([]);

    React.useEffect(() => {
        const unsubscribe = subscribeToVotes((newVotes) => {
            setVotes(newVotes);
        });
        return () => unsubscribe();
    }, []);

    // National Data Processing
    const data = useMemo(() => {
        const scores: Record<string, number> = {};
        POLICIES.forEach(p => scores[p.id] = 0);

        votes.forEach(vote => {
            vote.selectedPolicies.forEach((p: any) => {
                if (scores[p.id] !== undefined) {
                    scores[p.id] += (4 - p.rank);
                }
            });
        });

        return POLICIES.map(p => ({
            name: p.title,
            shortName: p.title.substring(0, 15),
            votes: scores[p.id],
            id: p.id
        })).sort((a, b) => b.votes - a.votes).slice(0, 5);
    }, [votes]);

    // Provincial Data Processing
    const provinceData = useMemo(() => {
        const scores: Record<string, number> = {};
        POLICIES.forEach(p => scores[p.id] = 0);

        votes.filter(v => v.location?.province === location.province).forEach(vote => {
            vote.selectedPolicies.forEach((p: any) => {
                if (scores[p.id] !== undefined) {
                    scores[p.id] += (4 - p.rank);
                }
            });
        });

        return POLICIES.map(p => ({
            name: p.title,
            shortName: p.title.substring(0, 15),
            votes: scores[p.id],
            id: p.id
        })).filter(p => p.votes > 0).sort((a, b) => b.votes - a.votes).slice(0, 5);
    }, [votes, location.province]);

    return (
        <div className="pb-20">
            <div className="bg-deepIndigo text-white p-8 rounded-2xl mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                        <circle cx="0" cy="0" r="40" fill="white" />
                        <circle cx="100" cy="100" r="60" fill="white" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold mb-2 relative z-10">ขอบคุณสำหรับเสียงของคุณ!</h2>
                <p className="text-slate-300 relative z-10">ข้อมูลของคุณถูกส่งเข้าระบบเรียบร้อยแล้ว</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* National/Overall Leaderboard */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg mr-3">
                            <Award size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-deepIndigo">5 อันดับยอดนิยม (ทั่วประเทศ)</h3>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={20}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={userSelection.some(u => u.id === entry.id) ? '#ea580c' : '#1e293b'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Province Specific Leaderboard */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                            <Map size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-deepIndigo">โฟกัส: {location.province}</h3>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={provinceData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={20} fill="#64748b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default StageDashboard;