interface Category {
  name: string;
  slug: string;
  logo: string;
  children?: Category[];
  parentId?: string;
}

export default function convertToCategories(
  inputs: {
    _id: string;
    name: string;
    slug: string;
    logo: string;
    parentCategory?: string;
    companyId: string;
  }[]
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
