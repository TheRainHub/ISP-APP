import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Car, ArrowLeft, History, Settings, Receipt, LayoutDashboard } from "lucide-react";
import { mockClients, mockServiceHistory } from "../../constants/mockData";
import { Client } from "../../types";
import { useEffect } from "react";

interface ClientsViewProps {
  initialSelectedClientId?: string | null;
  onClientSelect?: (clientId: string | null) => void;
  onBackToDashboard?: () => void;
}

export function ClientsView({ initialSelectedClientId, onClientSelect, onBackToDashboard }: ClientsViewProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    initialSelectedClientId ? mockClients.find(c => c.id === initialSelectedClientId) || null : null
  );

  useEffect(() => {
    if (initialSelectedClientId) {
      const client = mockClients.find(c => c.id === initialSelectedClientId);
      if (client) setSelectedClient(client);
    } else {
      setSelectedClient(null);
    }
  }, [initialSelectedClientId]);

  const handleSelectClient = (client: Client | null) => {
    setSelectedClient(client);
    if (onClientSelect) onClientSelect(client?.id || null);
  };

  const clientHistory = selectedClient
    ? mockServiceHistory.filter(h => h.vin === selectedClient.vin)
    : [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {!selectedClient ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-6 overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-6 text-gray-900">Client Database</h2>
            <div className="grid grid-cols-1 gap-4">
              {mockClients.map((client) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleSelectClient(client)}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-red-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-lg text-gray-900 mb-1">{client.name}</div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          {client.phone}
                        </div>
                        <div>{client.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Total Orders</div>
                      <div className="text-2xl font-bold text-red-600">{client.totalOrders}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{client.vehicle}</span>
                      <span className="text-xs text-gray-500">· {client.vin}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last visit: {client.lastVisit}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="p-6 pb-4 border-b border-gray-100">
              <button
                onClick={() => handleSelectClient(null)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Clients
              </button>
              
              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 mb-4 transition-colors bg-red-50 px-3 py-1.5 rounded-full w-fit"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Return to Active Requests
                </button>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedClient?.name}</h2>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{selectedClient?.phone}</div>
                    <div>{selectedClient?.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Total Orders</div>
                  <div className="text-3xl font-bold text-red-600">{selectedClient?.totalOrders}</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-bold text-gray-900">{selectedClient?.vehicle}</div>
                  <div className="text-xs text-gray-600">VIN: {selectedClient?.vin}</div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Preferences</h3>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Parts Preference</div>
                      <div className="font-bold text-gray-900">
                        {clientHistory.length > 0 ? clientHistory[0].partsPreference : 'Not set'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Last Visit</div>
                      <div className="font-bold text-gray-900">{selectedClient?.lastVisit}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Service History</h3>
                </div>
                {clientHistory.length > 0 ? (
                  <div className="space-y-3">
                    {clientHistory.map((record) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-bold text-gray-900 mb-1">{record.service}</div>
                            <div className="text-xs text-gray-600">{record.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-emerald-700 font-bold">
                              <Receipt className="w-4 h-4" />
                              {record.cost.toLocaleString()} Kč
                            </div>
                          </div>
                        </div>
                        {record.parts.length > 0 && (
                          <div className="mb-2">
                            <div className="text-xs text-gray-600 mb-1">Parts Used:</div>
                            <div className="flex flex-wrap gap-1">
                              {record.parts.map((part, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                >
                                  {part}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="pt-2 border-t border-gray-100 text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>Mileage: {record.mileage.toLocaleString()} km</span>
                            <span className={`px-2 py-1 rounded-full font-bold ${
                              record.partsPreference === 'OEM'
                                ? 'bg-blue-100 text-blue-700'
                                : record.partsPreference === 'Aftermarket'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {record.partsPreference}
                            </span>
                          </div>
                        </div>
                        {record.notes && (
                          <div className="mt-2 text-xs text-gray-600 italic">
                            Note: {record.notes}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No service history available
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
