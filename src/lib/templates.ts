export interface Template {
  id: number
  name: string
  theme: 'dark' | 'light'
  bg: string
  accent: string
  accentHex: string
  textPrimary: string
  textSecondary: string
  cardBg: string
  preview: string
}

export const templates: Template[] = [
  {
    id: 1,
    name: 'Klasik',
    theme: 'dark',
    bg: 'from-[#0f0c29] via-[#1a1040] to-[#24243e]',
    accent: 'text-[#e94560]',
    accentHex: '#e94560',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    cardBg: 'bg-gradient-to-br from-[#0f0c29] via-[#1a1040] to-[#24243e]',
    preview: 'bg-gradient-to-br from-[#0f0c29] to-[#24243e]',
  },
  {
    id: 2,
    name: 'Modern',
    theme: 'dark',
    bg: 'from-[#1a0533] via-[#2d1b4e] to-[#0d1b3e]',
    accent: 'text-[#00d2ff]',
    accentHex: '#00d2ff',
    textPrimary: 'text-white',
    textSecondary: 'text-blue-200',
    cardBg: 'bg-gradient-to-br from-[#1a0533] via-[#2d1b4e] to-[#0d1b3e]',
    preview: 'bg-gradient-to-br from-[#1a0533] to-[#0d1b3e]',
  },
  {
    id: 3,
    name: 'Elegant',
    theme: 'dark',
    bg: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
    accent: 'text-[#f5af19]',
    accentHex: '#f5af19',
    textPrimary: 'text-white',
    textSecondary: 'text-yellow-100',
    cardBg: 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
    preview: 'bg-gradient-to-br from-[#1a1a2e] to-[#0f3460]',
  },
  {
    id: 4,
    name: 'Doğal',
    theme: 'dark',
    bg: 'from-[#0f2027] via-[#203a43] to-[#2c5364]',
    accent: 'text-white',
    accentHex: '#ffffff',
    textPrimary: 'text-white',
    textSecondary: 'text-teal-200',
    cardBg: 'bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]',
    preview: 'bg-gradient-to-br from-[#0f2027] to-[#2c5364]',
  },
  {
    id: 5,
    name: 'Minimalist',
    theme: 'light',
    bg: 'from-white to-gray-50',
    accent: 'text-black',
    accentHex: '#000000',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-500',
    cardBg: 'bg-white border border-gray-200',
    preview: 'bg-white border border-gray-200',
  },
]

export function getTemplate(id: number): Template {
  return templates.find((t) => t.id === id) || templates[0]
}
