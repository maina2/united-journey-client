import { Loader2, AlertTriangle } from 'lucide-react'

interface DeleteConfirmationModalProps {
  matchOpponent: string
  matchDate: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}

export const DeleteConfirmationModal = ({
  matchOpponent,
  matchDate,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Delete Match</h2>
        </div>

        <p className="text-gray-600 mb-2">
          Are you sure you want to delete this match?
        </p>
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-semibold">{matchOpponent}</span> • {matchDate}
        </p>

        <p className="text-sm text-red-600 mb-6">
          ⚠️ This action cannot be undone. All points earned from this match will be removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Match'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
