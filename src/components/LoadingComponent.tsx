import React from "react"

export default function LoadingComponent() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="
            flex items-center justify-center
            w-16 h-16
            border-4 rounded-full
            border-t-transparent border-blue-500
            animate-spin
          "
        role="status" // ARIA role for accessibility, indicating a live region that is not a direct input.
        aria-label="Loading" // ARIA label for accessibility, providing a descriptive name for the element.
      >
        {/*
            An inner span for visual effect (optional, but can add depth).
            - sr-only: Screen reader only text, hidden visually but read by assistive technologies.
          */}
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
