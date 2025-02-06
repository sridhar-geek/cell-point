export type ParamsProp = {
  params: {
    id: string;
  };
};

export type GroupedProductsProps = {
  groupedProducts: {
    [category: string]: productsProp[];
  };
};

export type productsProp = {
  available: boolean;
  categoryName: string;
  created_at: string;
  description: string;
  id: string;
  name: string;
  offerPrice: number;
  photos: {
    photos: string[];
  };
  price: number;
  updated_at: string;
};

export type categoryProp = {
  id: string;
  created_at: string;
  name: string;
  icon: string | null;
  priority: boolean;
};

export type bannerImagesProp = {
  bannerImages: {
    photos: string[];
  };
};
