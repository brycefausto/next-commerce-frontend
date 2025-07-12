import { Order } from "@/models/order";
import { createStore, useStore } from "zustand";

export interface CheckoutStateProps {
  order?: Order | null,
  isCheckoutSubmitted: boolean,
  isBankTransfer?: boolean,
}

export interface CheckoutStoreProps {
  state: CheckoutStateProps,
  setCheckoutState: (order: Order, isCheckoutSubmitted: boolean, isBankTransfer?: boolean) => void,
  resetCheckoutState: () => void,
}

const EMPTY_STATE: CheckoutStateProps = {
  order: null,
  isCheckoutSubmitted: false,
  isBankTransfer: false,
}

export const CheckoutStore = createStore<CheckoutStoreProps>()((set) => ({
    state: EMPTY_STATE,
    setCheckoutState: (order: Order, isCheckoutSubmitted: boolean, isBankTransfer?: boolean) => set({ state: { order, isCheckoutSubmitted, isBankTransfer } }),
    resetCheckoutState: () => {
      set({ state: EMPTY_STATE })
    }
  }))

export const useCheckoutStore = () => useStore(CheckoutStore, state => state)