import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { App } from '../App';
import { Category } from '@shared/types';

const HomePage = lazy(() =>
  import('@pages/homePage').then(m => ({ default: m.HomePage })),
);

const NotFoundPage = lazy(() =>
  import('@pages/notFound').then(m => ({ default: m.NotFoundPage })),
);

const CategoriesPage = lazy(() =>
  import('@pages/categoriesPage').then(m => ({ default: m.CategoriesPage })),
);

const ProductPage = lazy(() =>
  import('@pages/productPage').then(m => ({ default: m.ProductPage })),
);

const CartPage = lazy(() =>
  import('@pages/cartPage').then(m => ({ default: m.CartPage })),
);

const FavouritesPage = lazy(() =>
  import('@pages/favouritesPage').then(m => ({ default: m.FavouritesPage })),
);

const CheckoutComplete = lazy(() =>
  import('@pages/checkoutComplete').then(m => ({
    default: m.CheckoutComplete,
  })),
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      ...Object.values(Category).map(cat => ({
        path: cat,
        element: <CategoriesPage category={cat} />,
      })),
      {
        path: 'product/:productId',
        element: <ProductPage />,
      },
      {
        path: 'favourites',
        element: <FavouritesPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout-complete',
        element: <CheckoutComplete />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];
