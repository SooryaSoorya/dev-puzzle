import { expect } from 'chai';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule, createBook } from '@tmo/shared/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { getAllBooks, getBooksError } from '@tmo/books/data-access';

export class MatSnackBarMock {
  public open() {
    return {
      onAction: () => of({})
    };
  }
  public dismiss() {}
}
describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let mockStore: MockStore;
  const initialBooksState = { loaded: false };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [
        provideMockStore({ initialState: initialBooksState }),
        { provide: MatSnackBar, useClass: MatSnackBarMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockStore.overrideSelector(getAllBooks, []);
    mockStore.overrideSelector(getBooksError, null);
    spyOn(mockStore, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should undo the addition of book into reading list', () => {
    component.searchForm.controls.term.setValue('javascript');
    const book = createBook('A');
    mockStore.overrideSelector(getAllBooks, [{ ...book, isAdded: true }]);
    mockStore.refreshState();
    component.searchBooks();
    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(By.css('div.book--title'));
    expect(elements.length).equals(1);
    component.undoBookAddition(book);
    const item = { item: { bookId: book.id, ...book } };
  });

  it('should create', () => {
    expect(component).to.exist;
  });
});
