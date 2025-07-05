"use client"

import React, { PropsWithChildren, createContext, useContext, useState } from "react"
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog"

export enum ModalType {
  CONFIRM, ERROR, DIALOG
}

export type ConfirmCallback = () => void | Promise<void>

export interface IAlertModalContext {
  show: boolean
  setShow: (showModal: boolean) => void,
  type: ModalType,
  setType: (type: ModalType) => void,
  setTitle: (title: string) => void,
  setMessage: (message: string) => void,
  setOnConfirm: (callback: () => ConfirmCallback) => void
}

export const AlertModalContext = createContext<IAlertModalContext>({
  show: false,
  setShow: (showModal: boolean) => {},
  type: ModalType.CONFIRM,
  setType: (type: ModalType) => {},
  setTitle: (title: string) => {},
  setMessage: (message: string) => {},
  setOnConfirm: (callback: () => ConfirmCallback) => {},
})

export function useAlertModal() {
  const { setShow, setType, setMessage, setOnConfirm, setTitle } = useContext(AlertModalContext)

  const close = () => {
    setShow(false)
    setType(ModalType.CONFIRM)
    setTitle("")
    setMessage("")
    setOnConfirm(() => () => {})
  }

  const showConfirmModal = (title: string, message: string, callback?: ConfirmCallback) => {
    setShow(true)
    setType(ModalType.CONFIRM)
    setTitle(title)
    setMessage(message)
    setOnConfirm(() => callback || (() => {}))

    return { close }
  }

  const showDeleteModal = (dataName: string, callback: ConfirmCallback) => {
    const title = `Delete ${dataName || "data"}`
    const message = `Are you sure you want to delete this ${dataName || "data"}?`

    return showConfirmModal(title, message, callback)
  }

  return {
    showConfirmModal,
    showDeleteModal
  }
}

export default function AlertModalProvider({ children }: PropsWithChildren) {
  const [show, setShow] = useState(false)
  const [type, setType] = useState(ModalType.CONFIRM)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [onConfirm, setOnConfirm] = useState<ConfirmCallback>(() => () => {})

  const value = { show, setShow, type, setType, setTitle, setMessage, setOnConfirm }

  const renderModal = () => {
    switch (type) {
      case ModalType.CONFIRM:
        return <ConfirmDialog {...{ open: show, onOpenChange: setShow, title, description: message, onConfirm }} />
      default:
        return <></>
    }
  }

  return (
    <AlertModalContext.Provider value={value}>
      {renderModal()}
      {children}
    </AlertModalContext.Provider>
  )
}
