export interface TdxInfiniteScrollOptions {
  items: any[];
  loadMoreItems: (page: number) => Promise<any[]>;
  renderItem: (item: any) => HTMLElement;
}

export class TdxInfiniteScroll extends HTMLElement {
  items: any[] = [];
  loadMoreItems: (page: number) => Promise<any[]> = () => Promise.resolve([]);
  renderItem: (item: any) => HTMLElement = () => document.createElement('div');

  private _contentArea: HTMLDivElement;
  private _isLoadingMoreItems: boolean = false;
  private _lastRenderedItemIndex: number = 0;
  private _loadingItem: HTMLSlotElement;
  private _loadMoreItemsObserver: IntersectionObserver;
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

    this._contentArea = this._root.querySelector<HTMLDivElement>(
      '.content-area'
    ) as HTMLDivElement;
    this._loadingItem = this._root.querySelector<HTMLSlotElement>(
      '#loading-item'
    ) as HTMLSlotElement;
    this._renderedItems = this._root.querySelector<HTMLDivElement>(
      '.rendered-items'
    ) as HTMLDivElement;

    this._loadMoreItemsObserver = new IntersectionObserver(
      this._loadMoreItems.bind(this),
      {
        root: this._contentArea,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );
    this._loadMoreItemsObserver.observe(this._loadingItem);

    this._updateView();
  }

  setOptions(options: TdxInfiniteScrollOptions) {
    this.items = options.items;
    this.loadMoreItems = options.loadMoreItems;
    this.renderItem = options.renderItem;
  }

  private async _loadMoreItems() {
    console.log('_loadMoreItems');
    if (!this._isLoadingMoreItems) {
      this._isLoadingMoreItems = true;
      this._page++;
      try {
        const newItems = await this.loadMoreItems(this._page);
        this.items = [...this.items, ...newItems];
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
