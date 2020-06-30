import { TestBed } from '@angular/core/testing';
import { expect } from 'chai';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence, NxModule } from '@nrwl/angular';

import {
  SharedTestingModule,
  createReadingListItem,
  createBook
} from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { HttpTestingController } from '@angular/common/http/testing';
import { ReadingListItem, Book } from '@tmo/shared/models';
import { bookDataAccessConstants } from '../books-data-access-constants';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot(), SharedTestingModule],
      providers: [
        ReadingListEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('Should test OnInitEffect', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListEffects.prototype.ngrxOnInitEffects());
      effects.loadReadingList$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne(`${bookDataAccessConstants.listApi}`).flush([]);
    });

    it('should produce error while loading reading list items', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.loadReadingList());

      const res = ReadingListActions.loadReadingListError(new ErrorEvent(''));
      effects.loadReadingList$.subscribe(action => {
        expect(action.type).to.eql(res.type);
        done();
      });

      httpMock
        .expectOne(`${bookDataAccessConstants.listApi}`)
        .error(new ErrorEvent(''));
    });
  });

  describe('addBook$', () => {
    it('should add the book to the reading list', done => {
      actions = new ReplaySubject();
      const book = createBook('BOOK-A');
      actions.next(ReadingListActions.addToReadingList({ book }));
      effects.addBook$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.confirmedAddToReadingList({ book })
        );
        done();
      });
      httpMock.expectOne(`${bookDataAccessConstants.listApi}`).flush(book);
    });

    it('should undo add to reading list', done => {
      actions = new ReplaySubject();
      const book = createBook('book');
      actions.next(ReadingListActions.addToReadingList({ book }));
      effects.addBook$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.failedAddToReadingList({ book })
        );
        done();
      });
      httpMock
        .expectOne(`${bookDataAccessConstants.listApi}`)
        .error(new ErrorEvent(''));
    });

    it('should provide error while adding book to reading list', done => {
      actions = new ReplaySubject();
      const book: Book = createBook('BOOK-A');
      actions.next(ReadingListActions.addToReadingList({ book }));
      effects.addBook$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.failedAddToReadingList({ book })
        );
        done();
      });
      httpMock
        .expectOne(`${bookDataAccessConstants.listApi}`)
        .error(new ErrorEvent(''));
    });
  });

  describe('removeBook$', () => {
    it('should remove the book from reading list', done => {
      actions = new ReplaySubject();
      const item: ReadingListItem = createReadingListItem('A');
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.confirmedRemoveFromReadingList({ item })
        );
        done();
      });
      httpMock
        .expectOne(`${bookDataAccessConstants.delApi}${item.bookId}`)
        .flush(item);
    });

    it('should provide error while removing book from reading list', done => {
      actions = new ReplaySubject();
      const item: ReadingListItem = createReadingListItem('B');
      actions.next(ReadingListActions.removeFromReadingList({ item }));
      effects.removeBook$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.failedRemoveFromReadingList({ item })
        );
        done();
      });
      httpMock
        .expectOne(`${bookDataAccessConstants.delApi}${item.bookId}`)
        .error(new ErrorEvent(''));
    });
  });

  describe('finishReadingListItem$', () => {
    it('should set book finished', done => {
      const book = createBook('A');
      const item = createReadingListItem('A');
      actions = new ReplaySubject();
      actions.next(ReadingListActions.finishReadingFromReadingList({ item }));
      effects.finishReadingListItem$.subscribe(action => {
        expect(action).to.eql(ReadingListActions.loadReadingList());
        done();
      });
      httpMock
        .expectOne(`${bookDataAccessConstants.listApi}/${item.bookId}/finished`)
        .flush(book);
    });

    it('should fail the setting the book as finished', done => {
      const item = createReadingListItem('A');
      actions = new ReplaySubject();
      actions.next(ReadingListActions.finishReadingFromReadingList({ item }));
      effects.finishReadingListItem$.subscribe(action => {
        expect(action).to.eql(ReadingListActions.failedFinishReading({ item }));
        done();
      });
      httpMock
        .expectOne(`${bookDataAccessConstants.listApi}/${item.bookId}/finished`)
        .error(new ErrorEvent(''));
    });
  });
});
