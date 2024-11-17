import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Search, SlidersHorizontal } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { productsApi } from '../lib/api';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const sortOptions = [
  { name: 'Price: Low to High', value: 'price-asc' },
  { name: 'Price: High to Low', value: 'price-desc' },
  { name: 'Newest First', value: 'date-desc' },
];

export default function ProductList() {
  const [search, setSearch] = React.useState('');
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = React.useState(sortOptions[0]);
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });

  const filteredProducts = React.useMemo(() => {
    return products
      .filter(product => 
        product.title.toLowerCase().includes(search.toLowerCase()) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
      )
      .sort((a, b) => {
        switch (sortBy.value) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'date-desc':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0;
        }
      });
  }, [products, search, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              AffiliateHub
              </h1>
            </div>
            <div className="flex flex-1 items-center gap-4 sm:max-w-xs">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border-gray-300 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <SlidersHorizontal className="h-4 w-4" />
                  Sort
                </Menu.Button>
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.value}>
                        {({ active }) => (
                          <button
                            onClick={() => setSortBy(option)}
                            className={`
                              ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                              ${sortBy.value === option.value ? 'bg-indigo-50 text-indigo-600' : ''}
                              block w-full px-4 py-2 text-left text-sm
                            `}
                          >
                            {option.name}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Menu>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div className="mt-2 flex gap-4">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium text-gray-900">No products found</p>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  amazonUrl={product.amazonUrl}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Featured Products. All rights reserved.
            This site includes affiliate links.
          </p>
        </div>
      </footer>
    </div>
  );
}