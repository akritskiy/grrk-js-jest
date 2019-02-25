const { Item, Shop } = require('../src/gilded-rose');

// Working from the grrk-reqs-short file, basic system requirements section:

// Reqs 1 and 2: Items have sellIn and quality attributes.
// Constraint C3, the Item class can't be altered, so Items should have name, sellIn, and quality attributes.
test('Items should only have name, sellIn, and quality attributes.', () => {
  let item = new Item('Test item', 5, 5);
  expect(Object.keys(item)).toEqual(['name', 'sellIn', 'quality']);
});

// Req 3: The system lowers sellIn by 1 and quality by 1 (for now) for each (normal) item at the end of each day.
test('updateQuality() should lower the sellIn (by 1) and quality (by 1 or more) of each item.', () => {
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
