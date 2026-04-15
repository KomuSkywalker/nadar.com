'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

interface Area {
  x: number
  y: number
  width: number
  height: number
}

interface Props {
  imageSrc: string
  onCancel: () => void
  onCropComplete: (blob: Blob) => void
}

async function getCroppedImg(imageSrc: string, crop: Area): Promise<Blob> {
  const image = new Image()
  image.src = imageSrc
  await new Promise<void>((resolve) => { image.onload = () => resolve() })

  const canvas = document.createElement('canvas')
  canvas.width = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext('2d')!

  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9)
  })
}

export default function ImageCropper({ imageSrc, onCancel, onCropComplete }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)

  const onCropCompleteCallback = useCallback((_: unknown, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleSave = async () => {
    if (!croppedAreaPixels) return
    setProcessing(true)
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels)
      onCropComplete(blob)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#fff',
        maxWidth: 500, width: '100%',
        padding: 24,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', letterSpacing: '-0.01em' }}>
          Fotoğrafı Düzenle
        </div>

        {/* Crop area */}
        <div style={{ position: 'relative', height: 300, background: '#1A1A1A' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={3 / 4}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteCallback}
          />
        </div>

        {/* Zoom slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: '#9B9B9B', flexShrink: 0 }}>Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#1A1A1A' }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '11px', fontSize: 12, fontWeight: 500,
              border: '1px solid #E0DCD7', background: 'none',
              color: '#6B6B6B', cursor: 'pointer', letterSpacing: '0.05em',
            }}
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={processing}
            style={{
              flex: 1, padding: '11px', fontSize: 12, fontWeight: 600,
              background: '#1A1A1A', color: '#fff', border: 'none',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.6 : 1, letterSpacing: '0.05em',
            }}
          >
            {processing ? 'İşleniyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}
