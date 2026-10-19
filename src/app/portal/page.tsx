
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package, Plus, AlertTriangle } from 'lucide-react'

function ProductsLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-8" />
      <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />
    </div>
  )
}

async function ProductsContent() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name),
      inventory(quantity, reorder_level)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch products:', error)

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <p className="text-red-600">
          Failed to load products. Please try again.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">
            Manage your bag inventory
          </p>
        </div>

        <Link
          href="/portal/products/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <Package
            size={48}
            className="mx-auto text-gray-300 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-700">
            No products yet
          </h3>
          <p className="text-gray-500 mt-1">
            Add your first bag product to get started
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">SKU</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Retail</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Wholesale</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Stock</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product: any) => {
                const qty = product.inventory?.quantity ?? 0
                const reorder = product.inventory?.reorder_level ?? 5
                const isLow = qty <= reorder

                return (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.color}{' '}
                        {product.size && `• ${product.size}`}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                      {product.sku}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {product.category?.name || '—'}
                    </td>

                    <td className="px-4 py-3 text-right">
                      Rs {Number(product.retail_price).toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-right">
                      Rs {Number(product.wholesale_price).toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span className={isLow ? 'text-red-600 font-medium' : ''}>
                        {qty}
                      </span>
                      {isLow && (
                        <AlertTriangle
                          size={14}
                          className="inline ml-1 text-red-500"
                        />
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                          product.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  )
}
