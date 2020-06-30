# Code smells & problems fixed in the app

1. All subscriptions could be unsubscribed(implemented),
   Instead of .subscribe() we can use async pipes when possible which unsubscribe automatically
2. Could follow conventions and give meaningful variable names
3. API URLs can be considered as global constants and it is better practice to have it in a constant file
   and used across the app(constants added in the app)
4. console.log can be removed.
5. Updated specs with the proper description in describe() test functions
6. Missing a few unit test cases in functionality, lint and e2e test cases failure were there , which is fixed now
7. failedRemoveFromReadingList action was not implemented( which is now implemented)
8. failedAddToReadingList action is not implemented on the reducer( which is now implemented)
9. No reducer methods for reading-ist failure cases(implemented)
10. Component titles names were not properly described inside a few unit.spec files(fixed)
11. Added missing accessibility attributes in books, search and list components
12. After the search is done results will be displayed, if you start typing for another search term the old results will get
    displayed. Since it is bad user experience, We can stop this issue either of the below implementations
    - Remove old search results by resetting the search
    - Keep the old search results and only when new results come and search-term is there we can display them( which is implemented)
13. Used angular date-pipe for formatting
14. In Mobile mode, the layout ratio of `book-grid` is not proper. I have added the single value with
    `grid-template-columns: 100%;` in media query for the class `book-grid`. Which looks good now.
15. When search result is empty, after search nothing was showing in the book grid's area- added no result found container
16. Redundant and unused code, imports and empty CSS files can be removed(removed total-count.component.scss )
17. Added new 10 rules in the ts-lint config file that enforces various accessibility standards(in tslint.json- after adding new
    10 I was getting an error from book-search.component.html for `click-events-have-key-events` from line no 56- its fixed)

## Accessibility

Issues fixed other than auto-scan:

1. "alt" attribute absent in <img> reading-list container and book-result section
2. "aria-label" on the form
3. "role" attribute are not added to UI elements.Roles should be assigned to define a type of user
   interface element
4. When the icon is purely cosmetic and conveys no real semantic meaning, the <mat-icon> element
   can be marked with aria-hidden="true", this is done in reading-list
5. Accessibility reader was not reading header text okreads, reading-list side bar title,Reading
   list items details- all fixed

Fixed lighthouse accessibility issues.

1. Please go through changes made in files "app.component.html", "book-search.component.html" and "reading-list.component.html"
2. For button "aria-label" are added

# Improvements

1. After a search, add the book to list and after removing an item from list proper message can be displayed to the user(can  
   integrate some custom modal window / Dialog Box plugins)
2. UI design can be improvised with colors with good contrast
3. Type-ahead search for book search can be implemented to enhance user experience
4. Usage of routes would have been done to achieve lazy loading functionality
5. Performance can be improved by implementing caching for assets
6. Adding a clear button for the search input text field would make it easier to clear off longer text
7. Once we add a book to the reading list, "Want to Read" button is disabled in the book tile. At this time, we do not know if the
   book is already in the reading list OR I'm not supposed to read that book unless I open and check the reading list. Thus we can solve this issue by toggling the button to display an appropriate message
8. In the `libs/books/data-access/src/lib/+state/` folder, we can categorized files into sub-folders such as 'book-search' and
   'reading-list' thus can achieve better structural architecture of the application
9. Loading spinner can be added to the search component in order to improve UI
