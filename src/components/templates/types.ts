export interface CardData {
  id?: string
  name: string
  title?: string | null
  company?: string | null
  bio?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  website?: string | null
  instagram?: string | null
  twitter?: string | null
  linkedin?: string | null
  facebook?: string | null
  tiktok?: string | null
  youtube?: string | null
  whatsapp?: string | null
  photoUrl?: string | null
  mapLink?: string | null
  portfolio?: string | null
  templateId: number
  canEdit?: boolean
  canViewStats?: boolean
  allowedTemplates?: number[]
  views?: number
}
