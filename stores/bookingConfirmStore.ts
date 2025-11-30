
import { BookingState } from "@/types/type";
import { create } from "zustand"

interface RideStore {
  confirmationData?: BookingState;
  setConfirmationData: (data: BookingState) => void;
}

export const useRideStore = create<RideStore>((set) => ({
  confirmationData: undefined,
  setConfirmationData: (data) => set({ confirmationData: data }),
}));

