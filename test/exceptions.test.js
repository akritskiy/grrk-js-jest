const { Item, Shop } = require('../src/gilded-rose');

test('After the sell by date, quality degrades twice as fast.', () => {
  let items = [new Item('Test item 1', 1, 50)]; // create an item with sellIn = 1
  let shop = new Shop(items);

  let initialQuality = items[0].quality;
  shop.updateQuality();
  let difference1 = initialQuality - items[0].quality; // change in quality as sellIn 1 -> 0

  initialQuality = items[0].quality;
  shop.updateQuality();
  let difference2 = initialQuality - items[0].quality; // change in quality after sellIn = 0

  expect(difference2 / difference1).toEqual(2); // the ratio should be 2 - "degrades twice as fast"
});

test('The quality of an item is never negative.', () => {
  let items = [new Item('Test item 1', 10, 0)]; // create an item with quality = 0
  let shop = new Shop(items);
  shop.updateQuality();

  expect(items[0].quality).toBeGreaterThanOrEqual(0); // quality should be non-negative
});
