
import { ConfirmationState } from "@/types/type"
import { create } from "zustand"

interface RideStore {
  confirmationData?: ConfirmationState;
  setConfirmationData: (data: ConfirmationState) => void;
}

export const useRideStore = create<RideStore>((set) => ({
  confirmationData: undefined,
  setConfirmationData: (data) => set({ confirmationData: data }),
}));

