import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { fetch, optimisticUpdate } from '@nrwl/angular';
import * as ReadingListActions from './reading-list.actions';
import { HttpClient } from '@angular/common/http';
import { ReadingListItem } from '@tmo/shared/models';
import { map } from 'rxjs/operators';

import { bookDataAccessConstants } from '../books-data-access-constants';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.loadReadingList),
      fetch({
        run: () => {
          return this.http
            .get<ReadingListItem[]>(`${bookDataAccessConstants.listApi}`)
            .pipe(
              map(data =>
                ReadingListActions.loadReadingListSuccess({ list: data })
              )
            );
        },
        onError: (action, error) => {
          return ReadingListActions.loadReadingListError({ error });
        }
      })
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      optimisticUpdate({
        run: ({ book }) => {
          return this.http
            .post(`${bookDataAccessConstants.listApi}`, book)
            .pipe(
              map(() =>
                ReadingListActions.confirmedAddToReadingList({
                  book
                })
              )
            );
        },
        undoAction: ({ book }) => {
          return ReadingListActions.failedAddToReadingList({
            book
          });
        }
      })
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      optimisticUpdate({
        run: ({ item }) => {
          return this.http
            .delete(`${bookDataAccessConstants.delApi}${item.bookId}`)
            .pipe(
              map(() =>
                ReadingListActions.confirmedRemoveFromReadingList({
                  item
                })
              )
            );
        },
        undoAction: ({ item }) => {
          return ReadingListActions.failedRemoveFromReadingList({
            item
          });
        }
      })
    )
  );

  finishReadingListItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.finishReadingFromReadingList),
      optimisticUpdate({
        run: ({ item }) => {
          return this.http
            .put(
              `${bookDataAccessConstants.listApi}/${item.bookId}/finished`,
              null
            )
            .pipe(
              map((markedItemStatus: ReadingListItem[]) =>
                ReadingListActions.loadReadingList()
              )
            );
        },
        undoAction: ({ item }) => {
          return ReadingListActions.failedFinishReading({
            item
          });
        }
      })
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.loadReadingList();
  }

  constructor(private actions$: Actions, private http: HttpClient) {}
}
