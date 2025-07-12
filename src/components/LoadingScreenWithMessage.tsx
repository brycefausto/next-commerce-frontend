export default function LoadingScreenWithMessage({
  message,
}: {
  message: string
}) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <p className="text-gray-700 text-lg font-medium">
          Loading, please wait...
        </p>
        <p className="text-gray-700 text-lg font-medium">{message}</p>
      </div>
    </div>
  )
}
