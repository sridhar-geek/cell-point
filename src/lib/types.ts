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
  id: "d46bf650-726a-4fbf-bd70-6d005941fb82";
  created_at: "2025-01-25T09:38:01.015228+00:00";
  name: "Ear Phones";
  icon: null;
  priority: false;
};
