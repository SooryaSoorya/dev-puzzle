import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  getReadingList,
  removeFromReadingList,
  addToReadingList
} from '@tmo/books/data-access';
import { ReadingListItem } from '@tmo/shared/models';
import { snackBarConstants } from '../snack-bar.constants';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar
  ) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    const snackBarRef = this.snackBar.open(
      snackBarConstants.SNACK_BAR_REMOVE_MESSAGE,
      snackBarConstants.SNACK_BAR_ACTION,
      {
        duration: snackBarConstants.SNACK_BAR_DURATION,
        panelClass: ['book-snackbar']
      }
    );
    snackBarRef.onAction().subscribe(() => {
      this.undoItemRemoval(item);
    });
  }

  undoItemRemoval(item: ReadingListItem) {
    const book = { id: item.bookId, ...item };
    this.store.dispatch(addToReadingList({ book }));
  }
}
