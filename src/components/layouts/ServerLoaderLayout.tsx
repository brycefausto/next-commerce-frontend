"use client"

import { getErrorMessage } from "@/lib/serverFetch"
import { httpService } from "@/services/http.service"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import LoadingScreenWithMessage from "../LoadingScreenWithMessage"
import ServerErrorScreen from "../ServerErrorScreen"

const loadingMessages = [
  "Initializing Sales & Inventory System...",
  "Boot sequence started. Loading core modules...",
  "Establishing secure database connection...",
  "Activating product and stock modules...",
  "Loading user preferences and access rights...",
  "Starting sales engine... almost there!",
  "Verifying licenses and syncing services...",
  "Preparing inventory tracker and sales monitor...",
  "System warm-up in progress... please wait.",
  "All systems green. Launching dashboard shortly...",
]

export default function ServerLoaderLayout({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [isError, setIsError] = useState(false)
  const currentMessageIndex = useRef(messageIndex)

  useEffect(() => {
    currentMessageIndex.current = messageIndex
  }, [messageIndex])

  useEffect(() => {
    setLoading(true)
    const timer = setInterval(() => {
      if (currentMessageIndex.current < 9) {
        setMessageIndex((index) => index + 1)
      } else {
        setMessageIndex(0)
      }
    }, 1000)
    httpService
      .getHealth()
      .then(() => {
        setTimeout(() => {
          setMessageIndex(9)
          setLoading(false)
        }, 2000)
      })
      .catch((error) => {
        toast.error(getErrorMessage(error))
        setLoading(false)
        setIsError(true)
      })
      .finally(() => {
        clearInterval(timer)
      })
  }, [])

  if (loading) {
    return <LoadingScreenWithMessage message={loadingMessages[messageIndex]} />
  }

  if (isError) {
    return <ServerErrorScreen />
  }

  return children
}
