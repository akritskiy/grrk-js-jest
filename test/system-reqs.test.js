const { Item, Shop } = require('../src/gilded-rose');

// All items have a sellIn value. All items have a quality value.
test('All items have name, sellIn, and quality attributes.', () => {
  let item = new Item('Test item', 5, 5);
  expect(Object.keys(item)).toEqual(['name', 'sellIn', 'quality']);
});

// At the end of each day, the system lowers sellIn and quality for each item.
test('Running updateQuality() results in sellIn decreasing by one, and quality decreasing by one or more, for each normal item.', () => {
  let items = [new Item('Test item 1', 5, 10), new Item('Test item 2', 1, 5)];
  let shop = new Shop(items);
  shop.updateQuality();

  // Test item 1
  expect(items[0].sellIn).toEqual(4);
  expect(items[0].quality).toBeLessThan(10);

  // Test item 2
  expect(items[1].sellIn).toEqual(0);
  expect(items[1].quality).toBeLessThan(5);
});
