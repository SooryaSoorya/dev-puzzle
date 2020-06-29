import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  getBooksError,
  getBooksLoaded
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Subscription, Observable } from 'rxjs';

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
    private readonly fb: FormBuilder
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
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    console.log('books', this.getBooksLoaded$);
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm.trim() }));
      console.log('books', this.getBooksLoaded$);
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
