export type Category = {
  id: string
  name: string
  description: string | null
  created_at: string
}

export type Product = {
  id: string
  branch_id: string | null
  category_id: string | null
  name: string
  sku: string
  description: string | null
  material: string | null
  size: string | null
  color: string | null
  gender: string | null
  cost_price: number
  retail_price: number
  wholesale_price: number
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  category?: Category | null
  inventory?: {
    quantity: number
    reorder_level: number
  } | null
}

export type Inventory = {
  id: string
  product_id: string
  quantity: number
  reorder_level: number
  updated_at: string
}

export type StockMovement = {
  id: string
  product_id: string
  movement_type: 'in' | 'out' | 'adjustment' | 'return'
  quantity: number
  reference: string | null
  notes: string | null
  created_by: string | null
  created_at: string
}