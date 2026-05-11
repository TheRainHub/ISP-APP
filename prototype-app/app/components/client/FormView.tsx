import React from "react";
import { Camera, X } from "lucide-react";
import { mockStandardServices } from "../../constants/mockData";

interface FormViewProps {
  formData: {
    vehicle: string;
    vin: string;
    issue: string;
    photos: string[];
    selectedServices: string[];
  };
  formRejected: boolean;
  rejectionComment: string;
  isClient: boolean;
  onFormChange: (field: string, value: string | string[]) => void;
  onPhotoUpload: () => void;
  onPhotoRemove: (idx: number) => void;
  onSubmitRequest: () => void;
  onResubmitForm: () => void;
}

export function FormView({
  formData,
  formRejected,
  rejectionComment,
  isClient,
  onFormChange,
  onPhotoUpload,
  onPhotoRemove,
  onSubmitRequest,
  onResubmitForm,
}: FormViewProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl text-gray-900 mb-2">New Service Request</h3>
      <p className="text-sm text-gray-600 mb-4">Fill in the details about your vehicle issue</p>

      {formRejected && (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="font-bold text-sm text-amber-900 mb-1">Changes Requested</div>
              <p className="text-xs text-amber-800 mb-3">{rejectionComment}</p>
              <button
                onClick={onResubmitForm}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 underline"
              >
                Resubmit after making changes →
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-gray-700 mb-2 block">Vehicle Model</label>
        <input
          type="text"
          value={formData.vehicle}
          onChange={(e) => onFormChange('vehicle', e.target.value)}
          placeholder="e.g., BMW X5"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-700 mb-2 block">VIN (Vehicle Identification Number)</label>
        <input
          type="text"
          value={formData.vin}
          onChange={(e) => onFormChange('vin', e.target.value)}
          placeholder="e.g., 1HGBH41JXMN109186"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-mono"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-700 mb-2 block">Describe the Issue</label>
        <textarea
          value={formData.issue}
          onChange={(e) => onFormChange('issue', e.target.value)}
          placeholder="What's wrong with your vehicle?"
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-none"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-700 mb-2 block">Standard Services (Optional)</label>
        <div className="space-y-2 bg-gray-50 rounded-xl p-3 border border-gray-200">
          {mockStandardServices.map((service) => (
            <label
              key={service.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.selectedServices.includes(service.id)}
                onChange={(e) => {
                  const newServices = e.target.checked
                    ? [...formData.selectedServices, service.id]
                    : formData.selectedServices.filter(id => id !== service.id);
                  onFormChange('selectedServices', newServices);
                }}
                className="mt-0.5 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{service.name}</span>
                  <span className="text-sm font-bold text-red-600">{service.price} Kč</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{service.description}</p>
                <p className="text-xs text-gray-500 mt-1">~{service.duration} min</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-700 mb-2 block">Photos (Optional)</label>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {formData.photos.map((photo, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => onPhotoRemove(idx)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onPhotoUpload}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-red-500 hover:text-red-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Camera className="w-4 h-4" />
          Add Photo
        </button>
      </div>

      <button
        onClick={onSubmitRequest}
        disabled={!formData.vehicle || !formData.vin || !formData.issue}
        className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-4"
        suppressHydrationWarning
      >
        Submit Request
      </button>
    </div>
  );
}
