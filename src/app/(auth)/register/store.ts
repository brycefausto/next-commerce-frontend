import { create } from "zustand"
import type { CreateCompanyData, CreateUserData } from "./CreateCompanySchema"

interface FormProps {
  currentStep: number
  companyData: CreateCompanyData
  userData: CreateUserData
}

interface FormStore extends FormProps {
  setCurrentStep: (step: number) => void
  setCompanyData: (data: CreateCompanyData) => void
  setUserData: (data: CreateUserData) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

const EMPTY_COMPANY: CreateCompanyData = {
  name: "",
  slug: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  logoUrl: "",
}

const EMPTY_USER = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  address: "",
}

const DEFAULT_FORM_VALUES = {
  currentStep: 1,
  companyData: EMPTY_COMPANY,
  userData: EMPTY_USER,
}

export const useFormStore = create<FormStore>((set, get) => ({
  ...DEFAULT_FORM_VALUES,
  setCurrentStep: (step) => set({ currentStep: step }),
  setCompanyData: (data) =>
    set((state) => ({
      companyData: { ...state.companyData, ...data },
    })),
  setUserData: (data) =>
    set((state) => ({
      userData: { ...state.userData, ...data },
    })),
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 2),
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),
  reset: () => set(DEFAULT_FORM_VALUES),
}))
