import { useState } from "react";
import { SystemState } from "../types";
import { initialState } from "../constants/initialState";

export function useSystemState() {
  const [state, setState] = useState<SystemState>(initialState);

  const updateState = (updates: Partial<SystemState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const reset = () => setState(initialState);

  return { state, setState, updateState, reset };
}
