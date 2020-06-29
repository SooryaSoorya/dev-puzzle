import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  getBooksError,
  getBooksLoaded,
  removeFromReadingList
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Subscription, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackBarConstants } from '../snack-bar.constants';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  errorStatus: Boolean = false;
  getBooksErrorSubscriber: Subscription;
  books$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  getBooksLoaded$ = this.store.select(getBooksLoaded);
  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly matSnackBar: MatSnackBar
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.getBooksErrorSubscriber = this.store
      .select(getBooksError)
      .subscribe(errorInfo => {
        if (errorInfo) {
          this.errorStatus = true;
          this.store.dispatch(clearSearch());
        }
      });
  }

  ngOnDestroy() {
    if (this.getBooksErrorSubscriber) {
      this.getBooksErrorSubscriber.unsubscribe();
    }
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
    const snackBarRef = this.matSnackBar.open(
      snackBarConstants.SNACK_BAR_ADD_MESSAGE,
      snackBarConstants.SNACK_BAR_ACTION,
      {
        duration: snackBarConstants.SNACK_BAR_DURATION,
        panelClass: ['book-snackbar']
      }
    );
    snackBarRef.onAction().subscribe(() => {
      this.undoBookAddition(book);
    });
  }

  undoBookAddition(book: Book) {
    const item = { item: { bookId: book.id, ...book } };
    this.store.dispatch(removeFromReadingList(item));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm.trim() }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
