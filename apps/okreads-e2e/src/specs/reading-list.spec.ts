import { $, $$, browser, ExpectedConditions } from 'protractor';
import { expect } from 'chai';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My reading list'
      )
    );
  });

  it('Then: mark Reading status of book to completed', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const markedElementsBefore = await $$(
      '.reading-list-item mat-button-toggle-group [title="Mark as finished"]'
    );
    if (markedElementsBefore.length > 0) {
      await markedElementsBefore[0].click();
      const markedElementsAfterTest = await $$(
        '.reading-list-item mat-button-toggle-group [title="Mark as finished"]'
      );
      expect(markedElementsBefore.length).to.eq(
        markedElementsAfterTest.length + 1
      );
    } else {
      return;
    }
  });
});
