import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SharedTestingModule,
  createReadingListItem
} from '@tmo/shared/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import {
  getReadingList,
  removeFromReadingList,
  addToReadingList
} from '@tmo/books/data-access';
import { ReadingListItem } from '@tmo/shared/models';

export class MatSnackBarMock {
  public open() {
    return {
      onAction: () => of({})
    };
  }
  public dismiss() {}
}

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let mockStore: MockStore;
  let item: ReadingListItem;
  const initialBooksState = { loaded: false };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule, NoopAnimationsModule],
      providers: [
        provideMockStore({ initialState: initialBooksState }),
        { provide: MatSnackBar, useClass: MatSnackBarMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    item = createReadingListItem('123');
    mockStore.overrideSelector(getReadingList, [item]);
    spyOn(mockStore, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should remove item from reading list', () => {
    component.removeFromReadingList(item);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      removeFromReadingList({ item })
    );
  });

  it('should undo item removal from reading list', () => {
    const book = { id: item.bookId, ...item };
    component.undoItemRemoval(item);
    expect(mockStore.dispatch).toHaveBeenCalledWith(addToReadingList({ book }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
