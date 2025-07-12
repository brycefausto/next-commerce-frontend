import { AlertTriangle } from "lucide-react"

export default function ServerErrorScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-4 text-red-500">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          500 - Server Error
        </h1>
        <p className="text-gray-600 mb-6">
          Oops! Something went wrong on our end. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition"
        >
          Reload Page
        </button>
      </div>
    </div>
  )
}
