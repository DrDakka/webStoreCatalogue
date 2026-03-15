import { describe, it, expect } from 'vitest';
import { appReducer, initialState } from './appReducer';
import type { Item, CartItem } from './types';

const item1: Item = { id: 'iphone-14' };
const item2: Item = { id: 'ipad-pro' };
const cartItem1: CartItem = { id: 'iphone-14', amount: 1 };
const cartItem2: CartItem = { id: 'ipad-pro', amount: 2 };

describe('appReducer — TOGGLE_FAV', () => {
  it('adds an item to favourites', () => {
    const state = appReducer(initialState, { type: 'TOGGLE_FAV', payload: item1 });
    expect(state.itemsInFav).toContainEqual(item1);
  });

  it('removes an item already in favourites', () => {
    const withFav = { ...initialState, itemsInFav: [item1] };
    const state = appReducer(withFav, { type: 'TOGGLE_FAV', payload: item1 });
    expect(state.itemsInFav).toHaveLength(0);
  });

  it('does not affect other items in favourites', () => {
    const withFav = { ...initialState, itemsInFav: [item1, item2] };
    const state = appReducer(withFav, { type: 'TOGGLE_FAV', payload: item1 });
    expect(state.itemsInFav).toContainEqual(item2);
    expect(state.itemsInFav).not.toContainEqual(item1);
  });
});

describe('appReducer — UPDATE_CART_ITEM', () => {
  it('adds a new item to cart', () => {
    const state = appReducer(initialState, { type: 'UPDATE_CART_ITEM', payload: cartItem1 });
    expect(state.itemsInCart).toContainEqual(cartItem1);
  });

  it('updates amount of existing cart item', () => {
    const withCart = { ...initialState, itemsInCart: [cartItem1] };
    const updated: CartItem = { id: 'iphone-14', amount: 3 };
    const state = appReducer(withCart, { type: 'UPDATE_CART_ITEM', payload: updated });
    expect(state.itemsInCart).toContainEqual(updated);
    expect(state.itemsInCart).toHaveLength(1);
  });

  it('removes item when amount is 0', () => {
    const withCart = { ...initialState, itemsInCart: [cartItem1, cartItem2] };
    const state = appReducer(withCart, {
      type: 'UPDATE_CART_ITEM',
      payload: { id: 'iphone-14', amount: 0 },
    });
    expect(state.itemsInCart).not.toContainEqual(cartItem1);
    expect(state.itemsInCart).toContainEqual(cartItem2);
  });
});

describe('appReducer — TOGGLE_MODAL', () => {
  it('opens modal when closed', () => {
    const state = appReducer(initialState, { type: 'TOGGLE_MODAL' });
    expect(state.modalIsOpened).toBe(true);
  });

  it('closes modal when open', () => {
    const withModal = { ...initialState, modalIsOpened: true };
    const state = appReducer(withModal, { type: 'TOGGLE_MODAL' });
    expect(state.modalIsOpened).toBe(false);
  });
});

describe('appReducer — CLEAR_CART', () => {
  it('empties the cart', () => {
    const withCart = { ...initialState, itemsInCart: [cartItem1, cartItem2] };
    const state = appReducer(withCart, { type: 'CLEAR_CART' });
    expect(state.itemsInCart).toHaveLength(0);
  });

  it('preserves favourites when clearing cart', () => {
    const withBoth = { ...initialState, itemsInCart: [cartItem1], itemsInFav: [item2] };
    const state = appReducer(withBoth, { type: 'CLEAR_CART' });
    expect(state.itemsInFav).toContainEqual(item2);
  });
});
