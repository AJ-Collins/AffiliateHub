import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { productsApi } from '../lib/api';
import type { Product } from '../types';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<
    Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  >();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
      reset();
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
      setEditingProduct(null);
      reset();
    },
    onError: () => toast.error('Failed to update product'),
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const onSubmit = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct && editingProduct.id) {
      console.log('Submitting update for product ID:', editingProduct.id);
      updateMutation.mutate({ id: editingProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              defaultValue={editingProduct?.title}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' },
              })}
              defaultValue={editingProduct?.price}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              {...register('imageUrl', {
                required: 'Image URL is required',
                pattern: {
                  value: /^https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+([\/\w .-]*)*\/?$/i,
                  message: 'Must be a valid URL',
                },
              })}
              defaultValue={editingProduct?.imageUrl}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amazon URL</label>
            <input
              {...register('amazonUrl', {
                required: 'Amazon URL is required',
                pattern: {
                  value: /^https:\/\/(www\.amazon\.[a-z]{2,3}|amzn\.to)\/.+(\?.*)?$/i,
                  message: 'Must be a valid Amazon URL',
                },
              })}
              defaultValue={editingProduct?.amazonUrl}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.amazonUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.amazonUrl.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  reset();
                }}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Products</h2>
        </div>
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {products?.map((product) => (
              <div key={product.id} className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
                  <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const productId = product._id;
                      if (productId) {
                        setEditingProduct(product);
                      } else {
                        console.error('Product ID is missing');
                      }
                    }}
                    className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      const productId = product._id; 
                      if (productId) {
                        deleteMutation.mutate(productId); 
                      } else {
                        console.error('Product ID is missing');
                      }
                    }
                  }
                    className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}