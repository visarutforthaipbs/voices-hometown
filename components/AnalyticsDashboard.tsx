import React, { useState, useEffect, useMemo } from 'react';
import { Download, Filter, Map, FileSpreadsheet } from 'lucide-react';
import { subscribeToVotes, VoteData } from '../config/firebase';

const AnalyticsDashboard: React.FC = () => {
    const [votes, setVotes] = useState<VoteData[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = subscribeToVotes((newVotes) => {
            setVotes(newVotes);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Extract unique provinces for filter
    const provinces = useMemo(() => {
        const unique = new Set(votes.map(v => v.location.province).filter(Boolean));
        return Array.from(unique).sort();
    }, [votes]);

    // Filter votes
    const filteredVotes = useMemo(() => {
        if (selectedProvince === 'all') return votes;
        return votes.filter(v => v.location.province === selectedProvince);
    }, [votes, selectedProvince]);

    // CSV Download Handler
    const handleDownloadCSV = () => {
        if (filteredVotes.length === 0) return;

        // Define headers
        const headers = [
            'Timestamp',
            'Province',
            'District',
            'Subdistrict',
            'Zipcode',
            'Region',
            'Policy Rank 1',
            'Policy Rank 2',
            'Policy Rank 3',
            'Additional Comment'
        ];

        // Map data to CSV rows
        const rows = filteredVotes.map(vote => {
            // Sort policies by rank to ensure consistent column order
            const sortedPolicies = [...vote.selectedPolicies].sort((a, b) => a.rank - b.rank);
            const policy1 = sortedPolicies.find(p => p.rank === 1)?.title || '';
            const policy2 = sortedPolicies.find(p => p.rank === 2)?.title || '';
            const policy3 = sortedPolicies.find(p => p.rank === 3)?.title || '';

            // Format timestamp safely
            let dateStr = '';
            if (vote.timestamp) {
                // Handle Firebase Timestamp or standard Date object
                dateStr = vote.timestamp.toDate ? vote.timestamp.toDate().toLocaleString('th-TH') : new Date(vote.timestamp).toLocaleString('th-TH');
            }

            return [
                `"${dateStr}"`,
                `"${vote.location.province}"`,
                `"${vote.location.district}"`,
                `"${vote.location.subdistrict}"`,
                `"${vote.location.zipcode}"`,
                `"${vote.location.region || ''}"`,
                `"${policy1.replace(/"/g, '""')}"`, // Escape quotes
                `"${policy2.replace(/"/g, '""')}"`,
                `"${policy3.replace(/"/g, '""')}"`,
                `"${(vote.additionalComment || '').replace(/"/g, '""')}"`
            ].join(',');
        });

        const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n'); // Add BOM for Excel support
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `survey_data_${selectedProvince}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-deepIndigo flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-deepIndigo p-2 rounded-lg">
                            <FileSpreadsheet size={20} className="text-white" />
                        </div>
                        <h1 className="font-bold text-xl text-deepIndigo">Analytics Dashboard</h1>
                    </div>
                    <div className="text-sm text-slate-500">
                        For Analytical Team
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

                {/* Controls Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

                        {/* Filter */}
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                                <Filter size={16} className="mr-2 text-slate-400" />
                                Filter by Province
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedProvince}
                                    onChange={(e) => setSelectedProvince(e.target.value)}
                                    className="w-full appearance-none p-3 bg-slate-50 border border-slate-200 rounded-lg text-deepIndigo font-medium focus:ring-2 focus:ring-deepIndigo focus:border-transparent outline-none transition-all"
                                    disabled={loading}
                                >
                                    <option value="all">All Provinces ({provinces.length})</option>
                                    <option disabled>──────────</option>
                                    {provinces.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="flex-grow flex gap-4 md:justify-center">
                            <div className="bg-slate-50 px-6 py-2 rounded-lg border border-slate-100">
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Records</p>
                                <p className="text-2xl font-bold text-deepIndigo">{votes.length.toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-50 px-6 py-2 rounded-lg border border-slate-100">
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Filtered</p>
                                <p className="text-2xl font-bold text-terracotta">{filteredVotes.length.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Action */}
                        <div>
                            <button
                                onClick={handleDownloadCSV}
                                disabled={loading || filteredVotes.length === 0}
                                className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={18} />
                                <span>Export CSV</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Preview Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-deepIndigo">Data Preview <span className="text-slate-400 font-normal text-sm ml-2">(Showing latest 50 records)</span></h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                    <th className="p-4 font-semibold">Time</th>
                                    <th className="p-4 font-semibold">Location</th>
                                    <th className="p-4 font-semibold">Top Priority Policy</th>
                                    <th className="p-4 font-semibold">Other Choices</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {loading && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-400">Loading data...</td>
                                    </tr>
                                )}
                                {!loading && filteredVotes.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-400">No data found based on current filters.</td>
                                    </tr>
                                )}
                                {filteredVotes.slice(0, 50).map((vote, idx) => {
                                    const sortedPolicies = [...vote.selectedPolicies].sort((a, b) => a.rank - b.rank);
                                    return (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 text-slate-500 whitespace-nowrap">
                                                {vote.timestamp?.toDate ? vote.timestamp.toDate().toLocaleDateString('th-TH') : 'N/A'}
                                                <div className="text-xs opacity-70">
                                                    {vote.timestamp?.toDate ? vote.timestamp.toDate().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-semibold text-deepIndigo">{vote.location.province}</div>
                                                <div className="text-xs text-slate-500">{vote.location.district}, {vote.location.subdistrict}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-terracotta/10 text-terracotta">
                                                    {sortedPolicies[0]?.title}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-600 text-xs max-w-xs truncate">
                                                2. {sortedPolicies[1]?.title}<br />
                                                3. {sortedPolicies[2]?.title}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {filteredVotes.length > 50 && (
                        <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-100">
                            Showing 50 of {filteredVotes.length} records. Download CSV for full dataset.
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default AnalyticsDashboard;
