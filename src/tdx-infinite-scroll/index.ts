import { debounce } from '../debounce';

export interface TdxInfiniteScrollOptions {
  debounceTimeInMs: number;
  items: any[];
  loadMoreItemsOffset: number;
  loadMoreItems: (page: number) => Promise<any[]>;
  renderItem: (item: any) => HTMLElement;
}

export class TdxInfiniteScroll extends HTMLElement {
  debounceTimeInMs: number = 50;
  items: any[] = [];
  loadMoreItemsOffset: number = 100;
  loadMoreItems: (page: number) => Promise<any[]> = () => Promise.resolve([]);
  renderItem: (item: any) => HTMLElement = () => document.createElement('div');

  private _isLoadingMoreItems: boolean = false;
  private _lastRenderedItemIndex: number = 0;
  private _contentArea: HTMLDivElement;
  private _viewport: HTMLDivElement;
  private _page: number = 0;
  private _renderedItems: HTMLDivElement;
  private _root: ShadowRoot;

  static tagName = 'tdx-infinite-scroll';

  static register() {
    customElements.define(this.tagName, this);
  }

  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });

    this._root.innerHTML = `
    <style>
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
      .viewport {
        height: 100%;
        overflow: scroll;
      }
      .content-area {
        overflow: hidden;
      }

      .content-area {
        background-color: green;
      }
    </style>
    <div class="viewport">
      <div class="content-area">
        <div class="rendered-items"></div>
        <slot id="loading-item" name="loading-item">Loading...</slot>
      </div>
    </div>
    `;

    this._renderedItems = this._root.querySelector<HTMLDivElement>(
      '.rendered-items'
    ) as HTMLDivElement;
    this._viewport = this._root.querySelector<HTMLDivElement>(
      '.viewport'
    ) as HTMLDivElement;
    this._contentArea = this._root.querySelector<HTMLDivElement>(
      '.content-area'
    ) as HTMLDivElement;


    this._viewport.addEventListener(
      'scroll',
      () => debounce(this._calculateLoadMore.bind(this), this.debounceTimeInMs),
      {
        passive: true,
      }
    );
    this._updateView();
  }

  setOptions(options: TdxInfiniteScrollOptions) {
    this.items = options.items;
    this.loadMoreItems = options.loadMoreItems;
    this.loadMoreItemsOffset = options.loadMoreItemsOffset;
    this.renderItem = options.renderItem;
    this.debounceTimeInMs = options.debounceTimeInMs;
    this._loadMoreItems();
  }

  private _calculateLoadMore() {
    console.log(this._contentArea.clientHeight, this._viewport.scrollTop + this._viewport.clientHeight);
    if (Math.abs(this._viewport.scrollTop + this._viewport.clientHeight - this._contentArea.clientHeight) < this.loadMoreItemsOffset) {
      console.log('load more things now');
      this._loadMoreItems();
    }
  }

  private async _loadMoreItems() {
    console.log('_loadMoreItems');
    if (!this._isLoadingMoreItems) {
      this._isLoadingMoreItems = true;
      this._page++;
      try {
        const newItems = await this.loadMoreItems(this._page);
        this.items = [...this.items, ...newItems];
        console.log('Added more items for a total of', this.items.length);
      } finally {
        this._isLoadingMoreItems = false;
      }
      this._updateView();
    }
  }

  private _updateView() {
    if (this._lastRenderedItemIndex < this.items.length - 1) {
      const newItemsFragment = document.createDocumentFragment();
      for (
        let itemIndex = this._lastRenderedItemIndex;
        itemIndex < this.items.length;
        itemIndex++
      ) {
        const newItem = this.renderItem(this.items[itemIndex]);
        newItemsFragment.appendChild(newItem);
      }
      this._renderedItems.appendChild(newItemsFragment);
      this._lastRenderedItemIndex = this.items.length - 1;
    }
  }
}
