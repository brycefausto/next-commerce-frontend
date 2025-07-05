import { Company } from "./company";

export interface CreateBankAccountDto {
  bank: string;
  accountHolder: string;
  accountNumber: string;
  swiftCode: string;
  companyId: string;
}

export interface UpdateBankAccountDto {
  bank: string;
  accountHolder: string;
  accountNumber: string;
  swiftCode: string;
  forTransfer: boolean
}

export interface BankAccount {
  id: string;
  bank: string;
  accountHolder: string;
  accountNumber: string;
  swiftCode: string;
  company: Company;
  forTransfer: boolean
}