
import { create } from "zustand"
export const useBookingStateStore = create((set) => ({
  bookingId: null,
  showBookingAnimation: false,
  setBookingId: (id: string) => set({ bookingId: id }),
  setShowBookingAnimation: (v: boolean) => set({ showBookingAnimation: v }),
}));
