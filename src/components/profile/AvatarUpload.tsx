import { useState, useRef } from 'react'
import { Camera, X, Loader2 } from 'lucide-react'
import { useUploadAvatar } from '../../hooks/useUser'
import { useAuthStore } from '../../stores/authStore'

interface AvatarUploadProps {
  currentAvatarUrl: string | null
  username: string
  onUploadSuccess: (url: string) => void
}

export const AvatarUpload = ({ currentAvatarUrl, username, onUploadSuccess }: AvatarUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadAvatar = useUploadAvatar()
  const { user } = useAuthStore()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPEG, PNG, GIF, or WEBP image.')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB.')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    uploadAvatar.mutate(file, {
      onSuccess: (response) => {
        onUploadSuccess(response.data.avatar_url)
        setPreviewUrl(null)
      },
      onError: (error: any) => {
        alert(error.response?.data?.detail || 'Failed to upload avatar')
        setPreviewUrl(null)
      },
    })
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const displayUrl = previewUrl || currentAvatarUrl

  return (
    <div className="relative">
      <div
        className="relative w-24 h-24 rounded-full overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-400">
              {username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}

        {isHovering && !uploadAvatar.isPending && (
          <button
            onClick={triggerFileInput}
            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white transition-colors"
          >
            <Camera className="w-6 h-6" />
          </button>
        )}

        {uploadAvatar.isPending && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl && (
        <button
          onClick={handleRemove}
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
