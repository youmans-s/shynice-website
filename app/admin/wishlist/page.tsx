import WishlistClient from './wishlist-client'

export default function WishlistPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Wishlist</h1>
      <p className="text-neutral-700">Add items you want to buy after hitting goals.</p>
      <WishlistClient />
    </div>
  )
}
