import { expect } from 'chai';
import { $, $$, browser, by, element, ExpectedConditions } from 'protractor';

describe('When: I use the reading list feature', () => {
  beforeEach(async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const items = await $$('[data-testing="reading-list-item"]');
    items.forEach(async item => await item.element(by.id('remove')).click());

    const drawer = $('[data-testing="reading-list-container"]');
    await drawer.element(by.css('button')).click();

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('angular');
    await form.submit();
  });

  it('I should be able to add book to reading-list and undo from  snackbar', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const input = await $('input[type="search"]');
    await input.sendKeys('Java');
    const form = await $('form');
    await form.submit();
    const addToReadingListButtonItems = await $$(
      '.reading-list .reading-list-item'
    );
    const wantToReadBtns = await $$(
      '[data-testing="book-item"] button:not(:disabled)'
    );
    if ((await wantToReadBtns.length) > 0) {
      await wantToReadBtns[0].click();
      const undoBtn = await browser.driver.findElement(
        by.css('.mat-simple-snackbar-action .mat-button')
      );
      undoBtn.click();
      const afterAddingToReadingList = await $$(
        '.reading-list .reading-list-item'
      );
      expect(afterAddingToReadingList.length).to.equal(
        addToReadingListButtonItems.length
      );
    }
  });

  it('I should be able to undo removing a book from reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const items = await $$('[data-testing="book-item"]');
    expect(items.length).to.be.greaterThan(1, 'At least one book');

    const bookAddToRead = await $$('[data-testing="book-add-to-read"]');
    bookAddToRead[0].click();

    let readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const booksInReadingList = await $$('.reading-list-item');
    expect(booksInReadingList.length).to.be.equal(1);

    const bookToRemoveFromReadingList = await $$(
      '[data-testing="book-remove"]'
    );
    bookToRemoveFromReadingList[0].click();

    await browser.executeScript(`
    const button = document.querySelector('.mat-simple-snackbar-action button');
    button.click();`);

    await browser.get('/');

    readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const booksInReadingListUndo = await $$('.reading-list-item');
    expect(booksInReadingListUndo.length).to.be.greaterThan(
      0,
      'At least one book'
    );
  });
});
