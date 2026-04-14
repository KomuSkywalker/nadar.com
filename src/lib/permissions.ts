/**
 * Paket bazlı kart izinleri.
 * Her iki card oluşturma yolunda (admin/cards ve orders/[id]) tutarlı davranış için.
 */
export function getPackagePermissions(pkg: string | null | undefined) {
  const isPaid = pkg === 'pro' || pkg === 'premium'
  return {
    canEdit: isPaid,
    canViewStats: isPaid,
    allowedTemplates: isPaid ? [1, 2, 3, 4, 5] : [1, 2],
  }
}
