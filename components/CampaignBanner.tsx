import React from 'react';

const CampaignBanner: React.FC = () => {
    return (
        <div className="w-full bg-campaign-black border-b-4 border-campaign-gold py-3 px-4 shadow-lg z-50 relative">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Logo replacement */}
                    <img
                        src="/logos/thaipbs-logo.svg"
                        alt="Thai PBS เลือกตั้ง 69"
                        className="h-12 w-auto object-contain"
                    />
                </div>
                <div className="hidden md:block text-campaign-gold text-sm font-light">
                    #เสียงของทุกคนฝ่าวิกฤตประเทศไทย
                </div>
            </div>
        </div>
    );
};

export default CampaignBanner;
