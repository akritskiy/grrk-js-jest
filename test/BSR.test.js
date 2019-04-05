const { Item, Shop } = require('../src/gilded-rose');

test('BSR1: Items should have sellIn prop', () => {
  let item = new Item('Test Item', 1, 1);
  expect(Object.keys(item)).toContain('sellIn');
});

test('BSR2: Items should have quality prop', () => {
  let item = new Item('Test Item', 1, 1);
  expect(Object.keys(item)).toContain('quality');
});

test('BSR3: updateQuality method should decrease sellIn and quality of normal items', () => {
  let items = [
    new Item('Test Item 1', 1, 1),
    new Item('Test Item 2', 50, 50)
  ];
  let shop = new Shop(items);
  shop.updateQuality();

  expect(shop.items[0].sellIn).toBeLessThan(1);
  expect(shop.items[0].quality).toBeLessThan(1);
  expect(shop.items[1].sellIn).toBeLessThan(50);
  expect(shop.items[1].quality).toBeLessThan(50);
});
