import type { ZCategory } from '@/zobjs/category';
import type { z } from 'zod';

interface Category {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  children?: Category[];
  parentId?: string;
}

export default function convertToCategories(
  inputs: (z.infer<typeof ZCategory> & {
    _id: string;
  })[]
): Category[] {
  const categories: Category[] = [];
  const categoryMap: { [key: string]: Category } = {};

  inputs.forEach((input) => {
    const category: Category = {
      name: input.name,
      slug: input.slug,
      logo: input.logo,
      children: [],
      parentId: input.parentCategory,
      _id: input._id,
    };
    categoryMap[input._id] = category;
    if (!input.parentCategory) {
      categories.push(category);
    }
  });

  Object.values(categoryMap).forEach((category) => {
    if (category.parentId) {
      categoryMap[category.parentId]?.children?.push(category);
    }
  });

  return categories;
}
