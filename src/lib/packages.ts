export interface PackageInfo {
  id: 'starter' | 'pro'
  name: string
  price: number
  templateCount: number
  features: string[]
  recommended?: boolean
}

export const packages: PackageInfo[] = [
  {
    id: 'starter',
    name: 'Temel Paket',
    price: 350,
    templateCount: 2,
    features: [
      'Profesyonel kartvizit sayfası',
      'Paylaşılabilir link',
      'QR kod',
      '2 şablon hakkı',
      'Tüm iletişim butonları',
      'Sosyal medya linkleri',
      'Profil fotoğrafı',
      'Portföy linki',
    ],
  },
  {
    id: 'pro',
    name: 'İleri Paket',
    price: 550,
    templateCount: 5,
    features: [
      'Temel paketteki her şey',
      '5 şablon hakkı (tüm şablonlar)',
      'Sonradan düzenleme hakkı',
      'İstatistik paneli',
    ],
    recommended: true,
  },
]
