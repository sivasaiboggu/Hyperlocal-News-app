import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CategoryType } from '../../../core/types';
import { CategorySlider } from '../components/CategorySlider';
import { selectSelectedCategory, setSelectedCategory } from '../store/newsSlice';
import { MOCK_CATEGORIES } from '../../../core/mocks';

export const CategoryContainer: React.FC = () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(selectSelectedCategory);

  const handleSelectCategory = (category: CategoryType) => {
    dispatch(setSelectedCategory(category));
  };

  return (
    <CategorySlider
      categories={MOCK_CATEGORIES}
      selectedCategory={selectedCategory}
      onSelectCategory={handleSelectCategory}
    />
  );
};

export default CategoryContainer;
