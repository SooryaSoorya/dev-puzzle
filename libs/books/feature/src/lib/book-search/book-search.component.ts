import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import { BOOKS_CONSTANTS } from '../books.constants';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  getBooksError,
  getBooksLoaded
} from '@tmo/books/data-access';
import { Book } from '@tmo/shared/models';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  errorStatus: Boolean = false;
  getBooksErrorSubscriber: Subscription;
  instantSearchSubscriber: Subscription;
  books$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  getBooksLoaded$ = this.store.select(getBooksLoaded);

  searchForm = this.fb.group({
    term: ['', [Validators.required]]
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.instantSearchSubscriber = this.searchForm.valueChanges
      .pipe(debounceTime(BOOKS_CONSTANTS.DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe(() => this.searchBooks());

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
    if (this.instantSearchSubscriber) {
      this.instantSearchSubscriber.unsubscribe();
    }
    if (this.getBooksErrorSubscriber) {
      this.getBooksErrorSubscriber.unsubscribe();
    }
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue(BOOKS_CONSTANTS.SEARCH_DEFAULT_TEXT);
  }

  searchBooks() {
    if (this.searchForm.valid) {
      this.store.dispatch(searchBooks({ term: this.searchTerm.trim() }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
