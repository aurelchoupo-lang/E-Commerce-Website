import { addToWishlist, getWishlist, removeFromWishlist } from '../services/api';

// run in isolated localStorage environment
function clear() {
  localStorage.clear();
}

describe('wishlist helpers', () => {
  beforeEach(() => clear());
  it('starts empty', () => {
    expect(getWishlist('user@example.com')).toEqual([]);
  });
  it('can add and retrieve items', () => {
    addToWishlist('user@example.com', 'item1');
    expect(getWishlist('user@example.com')).toEqual(['item1']);
    addToWishlist('user@example.com', 'item2');
    expect(getWishlist('user@example.com')).toEqual(['item1','item2']);
  });
  it('does not add duplicates', () => {
    addToWishlist('user@example.com','item1');
    addToWishlist('user@example.com','item1');
    expect(getWishlist('user@example.com')).toEqual(['item1']);
  });
  it('can remove items', () => {
    addToWishlist('user@example.com','item1');
    addToWishlist('user@example.com','item2');
    removeFromWishlist('user@example.com','item1');
    expect(getWishlist('user@example.com')).toEqual(['item2']);
  });
});
