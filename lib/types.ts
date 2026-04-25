export type ModCategory = 'free' | 'vip'

export interface Mod {
  id: string
  title: string
  description: string
  category: ModCategory
  download_url: string | null
  discord_url: string | null
  images: string[]
  tags: string[]
  created_at: string
  updated_at: string
}
