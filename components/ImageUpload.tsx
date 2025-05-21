import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface ImageUploadProps {
  auctionId: string
  onUploadComplete: (imageUrl: string) => void
}

export default function ImageUpload({ auctionId, onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${auctionId}/${fileName}`

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('auction-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('auction-images')
        .getPublicUrl(filePath)

      // Save image reference to database
      const { error: dbError } = await supabase
        .from('auction_images')
        .insert([
          {
            auction_id: auctionId,
            image_url: publicUrl,
            is_primary: true
          }
        ])

      if (dbError) {
        throw dbError
      }

      onUploadComplete(publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">
        Upload Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={uploadImage}
        disabled={uploading}
        className="mt-1 block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-50 file:text-indigo-700
          hover:file:bg-indigo-100"
      />
      {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
    </div>
  )
}
