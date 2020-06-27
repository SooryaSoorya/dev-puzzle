import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestingModule, createReadingListItem } from '@tmo/shared/testing';
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { getReadingList, removeFromReadingList } from "@tmo/books/data-access";
import { ReadingListItem } from '@tmo/shared/models';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let mockStore: MockStore;
  let item: ReadingListItem;
  const initialBooksState = { loaded: false };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule, NoopAnimationsModule],
      providers: [provideMockStore({ initialState: initialBooksState })]
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
    expect(mockStore.dispatch).toHaveBeenCalledWith(removeFromReadingList({item}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
