import React from "react";
import { motion } from "framer-motion";
import { User, LogIn } from "lucide-react";
import { Mechanic, LoggedInMechanic } from "../../types";

interface MechanicLoginScreenProps {
  mechanics: Mechanic[];
  loggedInMechanics: LoggedInMechanic[];
  onLogin: (mechanicId: string) => void;
}

export function MechanicLoginScreen({
  mechanics,
  loggedInMechanics,
  onLogin,
}: MechanicLoginScreenProps) {
  const loggedInIds = loggedInMechanics?.map(m => m.mechanicId) || [];

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mechanic Login</h2>
          <p className="text-sm text-gray-600">Select your profile to start working</p>
        </div>

        <div className="space-y-3">
          {mechanics.map((mechanic) => {
            const isLoggedIn = loggedInIds.includes(mechanic.id);
            return (
              <motion.button
                key={mechanic.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !isLoggedIn && onLogin(mechanic.id)}
                disabled={isLoggedIn}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  isLoggedIn
                    ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
                    : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isLoggedIn ? 'bg-gray-300' : 'bg-blue-100'
                    }`}>
                      <User className={`w-6 h-6 ${isLoggedIn ? 'text-gray-500' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{mechanic.name}</div>
                      <div className="text-xs text-gray-600">{mechanic.specialty}</div>
                      <div className="text-xs text-amber-600 mt-1">★ {mechanic.rating}</div>
                    </div>
                  </div>
                  {isLoggedIn ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                      ACTIVE
                    </span>
                  ) : (
                    <LogIn className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {loggedInMechanics && loggedInMechanics.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <div className="text-xs font-bold text-blue-900 mb-2">Currently Active</div>
            <div className="flex flex-wrap gap-2">
              {loggedInMechanics.map((logged) => {
                const mechanic = mechanics.find(m => m.id === logged.mechanicId);
                return (
                  <div
                    key={logged.mechanicId}
                    className="text-xs bg-white px-3 py-1 rounded-full border border-blue-200 text-gray-700"
                  >
                    {mechanic?.name}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
