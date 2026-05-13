import React from "react";
import { motion } from "framer-motion";
import { Info, Camera, AlertCircle, CheckCircle, Check } from "lucide-react";
import { AdditionalTask, OrderStatus } from "../../types";

interface TechWorkspaceProps {
  formData: {
    vehicle: string;
    vin: string;
    issue: string;
  };
  intakePhotosComplete: boolean;
  intakePhotos: string[];
  checksCompleted: number;
  additionalTasks: AdditionalTask[];
  orderStatus: OrderStatus;
  onIntakePhoto: () => void;
  onCompleteIntakePhotos: () => void;
  onTechCheck: () => void;
  onOpenAdditionalTaskModal: () => void;
  onTechComplete: () => void;
}

export function TechWorkspace({
  formData,
  intakePhotosComplete,
  intakePhotos,
  checksCompleted,
  additionalTasks,
  orderStatus,
  onIntakePhoto,
  onCompleteIntakePhotos,
  onTechCheck,
  onOpenAdditionalTaskModal,
  onTechComplete,
}: TechWorkspaceProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-gray-900">{formData.vehicle} (ABC-123)</h2>
          <span className="text-amber-600 text-sm flex items-center gap-1">
            <Info className="w-4 h-4"/>
            {formData.issue}
          </span>
        </div>
      </div>

      {!intakePhotosComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-blue-50 border-2 border-blue-300 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-blue-900">Vehicle Intake Photos</span>
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">Required</span>
          </div>
          <p className="text-xs text-blue-800 mb-3">
            Document vehicle condition before starting work
          </p>

          {intakePhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {intakePhotos.map((photo, idx) => (
                <img key={idx} src={photo} alt={`Intake ${idx + 1}`} className="w-full aspect-square rounded-lg object-cover border-2 border-blue-200" />
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onIntakePhoto}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Take Photo ({intakePhotos.length}/4)
            </button>
            {intakePhotos.length >= 3 && (
              <button
                onClick={onCompleteIntakePhotos}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-all"
              >
                ✓ Complete
              </button>
            )}
          </div>
        </motion.div>
      )}

      <div className="space-y-3 mb-6 flex-1">
        {[
          { id: 1, label: "Brake system diagnostics" },
          { id: 2, label: "Replace front brake pads" },
          ...additionalTasks
            .filter(t => t.approved)
            .map((t, idx) => ({
              id: 100 + idx,
              label: t.description,
              isAdditional: true
            }))
        ].map((item, idx) => {
          const isChecked = checksCompleted > idx;
          return (
            <div key={item.id} onClick={onTechCheck} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${isChecked ? 'bg-emerald-50 border-emerald-200 text-gray-600 line-through' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm'} ${item.isAdditional ? 'border-l-4 border-l-amber-500' : ''}`}>
              <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${isChecked ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'}`}>
                {isChecked && <Check className="w-4 h-4 text-white" />}
              </div>
              <div className="flex-1">
                {item.label}
                {item.isAdditional && (
                  <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Additional</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {intakePhotosComplete && orderStatus !== 'done' && (
        <button
          onClick={onOpenAdditionalTaskModal}
          className="w-full py-3 mb-3 border-2 border-amber-300 bg-amber-50 text-amber-900 rounded-xl font-bold text-sm hover:bg-amber-100 transition-all flex items-center justify-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          Report Additional Issue
        </button>
      )}

      <button
        disabled={(() => {
          const totalTasks = 2 + additionalTasks.filter(t => t.approved).length;
          return !intakePhotosComplete || checksCompleted < totalTasks || orderStatus === 'done';
        })()}
        onClick={onTechComplete}
        className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
          orderStatus === 'done'
            ? 'bg-emerald-600 text-white'
            : (() => {
                const totalTasks = 2 + additionalTasks.filter(t => t.approved).length;
                return intakePhotosComplete && checksCompleted >= totalTasks;
              })()
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {orderStatus === 'done' ? <><CheckCircle className="w-5 h-5"/> Work Completed</> : 'Complete Service'}
      </button>
    </motion.div>
  );
}
