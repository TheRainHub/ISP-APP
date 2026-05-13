import React from "react";
import { motion } from "framer-motion";
import { Info, Users } from "lucide-react";
import { mockStandardServices, mockServiceHistory } from "../../constants/mockData";

interface IncomingColumnProps {
  clientView: "form" | "tracking";
  orderStatus: string;
  formData: {
    vehicle: string;
    vin: string;
    issue: string;
    photos: string[];
    selectedServices: string[];
    prefersOriginalParts: boolean;
    clientName: string;
  };
  onTechReview: () => void;
  onOpenRejectionModal: () => void;
  onDeclineRequest: () => void;
  onClientClick: (clientName: string) => void;
  resourcesAllocated: boolean;
}

export function IncomingColumn({
  clientView,
  orderStatus,
  formData,
  onTechReview,
  onOpenRejectionModal,
  onDeclineRequest,
  onClientClick,
  resourcesAllocated,
}: IncomingColumnProps) {
  return (
    <div className="flex-1 min-w-[280px]">
      <h4 className="text-gray-600 text-sm font-semibold mb-4 flex items-center justify-between">
        Incoming <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">1</span>
      </h4>

      {clientView === 'tracking' && orderStatus === 'new' && !resourcesAllocated && (
        <motion.div layout className="bg-white border-l-4 border-l-amber-500 rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md">
          <div className="flex justify-between items-start mb-1">
            <div className="font-bold text-gray-900">{formData.vehicle} · {formData.vin}</div>
            <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase bg-amber-100 text-amber-700">New</span>
          </div>
          <div 
            onClick={() => onClientClick(formData.clientName)}
            className="text-sm font-bold text-red-600 hover:text-red-700 cursor-pointer mb-2 flex items-center gap-1 group"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="group-hover:underline">{formData.clientName}</span>
          </div>
          <p className="text-xs text-gray-600 mb-2">Issue: {formData.issue}</p>

          {formData.selectedServices.length > 0 && (
            <div className="mb-2">
              <div className="text-xs font-semibold text-gray-700 mb-1">Selected Services:</div>
              <div className="flex flex-wrap gap-1">
                {formData.selectedServices.map(svcId => {
                  const service = mockStandardServices.find(s => s.id === svcId);
                  return service ? (
                    <span key={svcId} className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {service.name}
                    </span>
                  ) : null;
                })}              </div>
            </div>
          )}

          {formData.prefersOriginalParts && (
            <div className="mb-2">
              <span className="text-[10px] px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-bold uppercase flex items-center gap-1.5 w-fit border border-purple-200">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Prefers original parts
              </span>
            </div>
          )}

          {formData.photos.length > 0 && (
            <div className="flex gap-1 mb-3">
              {formData.photos.slice(0, 3).map((photo, idx) => (
                <img key={idx} src={photo} alt={`Photo ${idx + 1}`} className="w-12 h-12 rounded object-cover border border-gray-200" />
              ))}
            </div>
          )}

          {(() => {
            const history = mockServiceHistory.filter(h => h.vin === formData.vin);
            if (history.length > 0) {
              const latestService = history[0];
              const preference = latestService.partsPreference;
              return (
                <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-900">Service History</span>
                  </div>
                  <div className="text-xs text-blue-800 space-y-1">
                    <div>Last visit: {latestService.date}</div>
                    <div>Total visits: {history.length}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-semibold">Parts Preference:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        preference === 'OEM' ? 'bg-emerald-100 text-emerald-700' :
                        preference === 'Aftermarket' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {preference}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={onTechReview}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
              >
                ✓ Accept
              </button>
              <button
                onClick={onOpenRejectionModal}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
              >
                ← Request Changes
              </button>
            </div>
            <button
              onClick={onDeclineRequest}
              className="w-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              ✕ Decline Request (Spam/Invalid)
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
