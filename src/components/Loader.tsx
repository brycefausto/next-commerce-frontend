import React, { PropsWithChildren } from 'react'
import LoadingComponent from './LoadingComponent'

export interface LoaderProps extends PropsWithChildren {
  loading: boolean
}

export default function Loader({ loading, children }: LoaderProps) {
  return (
    <>
      {children}
      {loading && <LoadingComponent />}
    </>
  )
}
