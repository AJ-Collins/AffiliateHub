import React from 'react';
import { ExternalLink, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  title: string;
  price: number;
  imageUrl: string;
  amazonUrl: string;
}

export default function ProductCard({ title, price, imageUrl, amazonUrl }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-xl">
      <div className="aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">{title}</h3>
        <div className="mb-4 text-2xl font-bold text-indigo-600">
          ${price.toFixed(2)}
        </div>
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Buy on Amazon
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}