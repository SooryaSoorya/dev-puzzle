# code smells

# Code smells & problems fixed in the app

1. All subscriptions can be unsubscribed(implemented)
2. There is no complete code coverage in the master branch code
3. Meaningful and follow conventions when name a variable
4. API urls can be considered as global constants and defined in a constant file and used across the app(constants added in the app).
5. console.log can be removed.
6. Updated spects with proper description in descibe test functions
7. Missing few unit test cases in functionality
8. failedRemoveFromReadingList action was not implemented( which is now implemented).
9. failedAddToReadingList action is not implemented on the reducer.
10. No reducer methods for readinglist failure cases
11. Component titles names were not properly described inside few unit.spec files
12. Added missing accessbility attributes in books , search , list components
13. After search is done results will be displayed ,if you make start typing for another search the old results will get displayed. Since
    this is a bad user experience, We can stop this issue either of the below implementations
    - Remove old search results by resetting the search
    - Keep the old search results and only when new results come we can display them(Implemented)
14. Used angular date-pipe for formatting
15. No reducer methods for reading-list failure cases
16. when no result found after search nothing was showing in the search result area- added no resul found container
17. 2 unit tests cases ,Lint and e2e test case failures was there, its fixed now.
18. Empty files can be removed(total-count.component.scss)

## Accessibility

1. Fixed light house acessibility issues.
   a. color contract issue on empty result
   b. button aria label

2. Issue not found in automated-scan
   b. Alt text missing for image in reading-list container
   a. Alt text missing for image in book-result section

   c. When the icon is purely cosmetic and conveys no real semantic meaning, the <mat-icon> element can marked with aria-hidden="true", this is done in reading list  
    e. Search Text, Add Aria Label text
   f. Reading List Item, contextual information can be provided to the user.

# Improvements

1. After serach , add book to list and after removing an item from list proper message can be displayed to user
2. book grids are not resonsive
3. UI design can be improvised with colors with good contrast.
4. Typeahead search for book search can be implemented to enhance user experience.
5. Performance can be improved by implementing caching

