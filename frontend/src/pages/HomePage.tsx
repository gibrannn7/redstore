import MainLayout from '../layouts/MainLayout';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-red-700 rounded-2xl p-12 text-white mb-12">
          <h1 className="font-heading text-5xl font-bold mb-4">
            Welcome to RedStore
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Discover amazing products from trusted sellers
          </p>
          <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Shop Now
          </button>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="font-heading text-3xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Electronics', 'Fashion', 'Home & Living', 'Sports'].map((category) => (
              <div
                key={category}
                className="bg-white dark:bg-dark-surface rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-dark-border"
              >
                <div className="text-4xl mb-2">📦</div>
                <h3 className="font-semibold">{category}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <h2 className="font-heading text-3xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-dark-surface rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 dark:border-dark-border"
              >
                <div className="aspect-square bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Product Name</h3>
                  <p className="text-primary font-bold text-lg">Rp 999,000</p>
                  <button className="w-full mt-3 bg-primary text-white py-2 rounded-lg hover:bg-primary-hover transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
