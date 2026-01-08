import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StageEntry from "./components/StageEntry";
import StageSelection from "./components/StageSelection";
import StageConfirmation from "./components/StageConfirmation";
import StageDashboard from "./components/StageDashboard";
import InternalDashboard from "./components/InternalDashboard";
import { LocationData, Policy } from "./types";

// Defining stages as constants for readability
const STAGE_ENTRY = 1;
const STAGE_SELECTION = 2;
const STAGE_CONFIRMATION = 3;
const STAGE_DASHBOARD = 4;

const SurveyApp: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<number>(STAGE_ENTRY);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [selectedPolicies, setSelectedPolicies] = useState<Policy[]>([]);
  const [additionalComment, setAdditionalComment] = useState<string>("");

  // Handlers to transition between stages
  const handleEntryComplete = (loc: LocationData) => {
    setLocation(loc);
    setCurrentStage(STAGE_SELECTION);
    window.scrollTo(0, 0);
  };

  const handleSelectionComplete = (policies: Policy[]) => {
    setSelectedPolicies(policies);
    setCurrentStage(STAGE_CONFIRMATION);
    window.scrollTo(0, 0);
  };

  const handleConfirmationComplete = (comment: string) => {
    setAdditionalComment(comment);
    setCurrentStage(STAGE_DASHBOARD);
    window.scrollTo(0, 0);
  };

  const handleBackToSelection = () => {
    setCurrentStage(STAGE_SELECTION);
  };

  const getStepTitle = () => {
    switch (currentStage) {
      case STAGE_ENTRY:
        return "ระบุพื้นที่";
      case STAGE_SELECTION:
        return "เลือกนโยบาย";
      case STAGE_CONFIRMATION:
        return "ยืนยัน";
      case STAGE_DASHBOARD:
        return "ผลโหวต";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-softCream font-sans text-deepIndigo flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/logos/logo.svg"
              alt="เสียงในหัว คนบ้านฉัน"
              className="h-10 md:h-12 w-auto"
            />
          </div>

          <div className="flex items-center text-xs md:text-sm font-medium text-slate-400">
            <span className="hidden sm:inline mr-1">
              ขั้นตอนที่ {currentStage}/4 :
            </span>
            <span className="sm:hidden mr-1">{currentStage}/4 :</span>
            <span className="text-deepIndigo font-bold">{getStepTitle()}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100">
          <div
            className="h-full bg-terracotta transition-all duration-500 ease-out"
            style={{ width: `${(currentStage / 4) * 100}%` }}
          ></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {currentStage === STAGE_ENTRY && (
          <StageEntry onComplete={handleEntryComplete} />
        )}

        {currentStage === STAGE_SELECTION && (
          <StageSelection onComplete={handleSelectionComplete} />
        )}

        {currentStage === STAGE_CONFIRMATION && location && (
          <StageConfirmation
            location={location}
            selectedPolicies={selectedPolicies}
            onConfirm={handleConfirmationComplete}
            onBack={handleBackToSelection}
          />
        )}

        {currentStage === STAGE_DASHBOARD && location && (
          <StageDashboard
            location={location}
            userSelection={selectedPolicies}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-deepIndigo text-slate-400 py-8 text-center text-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-6 transition-all duration-300">
            <img
              src="/logos/partners-3.svg"
              alt="Partner 1"
              className="h-6 md:h-12 w-auto object-contain"
            />
            <div className="h-4 md:h-6 w-px bg-slate-600"></div>
            <img
              src="/logos/partners-2.svg"
              alt="Partner 2"
              className="h-6 md:h-10 w-auto object-contain"
            />
            <div className="h-4 md:h-6 w-px bg-slate-600"></div>
            <img
              src="/logos/partners-1.svg"
              alt="Partner 3"
              className="h-6 md:h-10 w-auto object-contain"
            />
          </div>
          <p className="mb-2">
            กิจกรรมในช่วงการเลือกตั้งเพื่อรวบรวมความต้องการของประชาชน
            โดยสำนักเครือข่ายและการมีส่วนร่วมสาธารณะ ไทยพีบีเอส (Thai PBS)
          </p>
        </div>
      </footer>
    </div>
  );
};

import CampaignBanner from "./components/CampaignBanner";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CampaignBanner />
      <Routes>
        <Route path="/" element={<SurveyApp />} />
        <Route path="/monitor" element={<InternalDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
