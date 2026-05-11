import React from "react";
import { motion } from "framer-motion";
import { User, LogOut, Users } from "lucide-react";
import { Mechanic, LoggedInMechanic } from "../../types";

interface MechanicSwitcherProps {
  mechanics: Mechanic[];
  loggedInMechanics: LoggedInMechanic[];
  currentMechanicView: string | null;
  onSwitch: (mechanicId: string | null) => void;
  onLogout: (mechanicId: string) => void;
}

export function MechanicSwitcher({
  mechanics,
  loggedInMechanics,
  currentMechanicView,
  onSwitch,
  onLogout,
}: MechanicSwitcherProps) {
  const currentMechanic = mechanics.find(m => m.id === currentMechanicView);

  return (
    <div className="bg-white border-b border-gray-200 p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-bold text-gray-900">
            Active Mechanics ({loggedInMechanics.length})
          </span>
        </div>
        {currentMechanic && (
          <button
            onClick={() => onSwitch(null)}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
          >
            View All
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {loggedInMechanics.map((logged) => {
          const mechanic = mechanics.find(m => m.id === logged.mechanicId);
          if (!mechanic) return null;

          const isActive = currentMechanicView === mechanic.id;

          return (
            <motion.div
              key={mechanic.id}
              whileHover={{ scale: 1.02 }}
              className={`flex-shrink-0 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                isActive
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSwitch(mechanic.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-blue-100' : 'bg-gray-200'
                }`}>
                  <User className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-gray-900 truncate">
                    {mechanic.name}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {mechanic.specialty}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLogout(mechanic.id);
                  }}
                  className="ml-2 p-1.5 hover:bg-red-100 rounded-lg transition-colors group"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
