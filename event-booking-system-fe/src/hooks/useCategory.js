import * as categoryService from '../services/categoryService';
import { useState, useEffect } from 'react';
import { mapCategoryResponse } from '../mappers/categoryMapper';

export const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    useEffect(() => {
      const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await categoryService.getCategories();
          if (response.success) {
            setCategories(response.data.map(mapCategoryResponse));
          } else {
            throw new Error(response.message || 'Failed to fetch categories');
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCategories();
    }, []);

  return { categories, loading, error };
};