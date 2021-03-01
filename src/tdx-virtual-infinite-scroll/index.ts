import { calculateView } from './calculate-view';
import { debounce } from '../debounce';

export interface TdxVirtualInfiniteScrollOptions {
  debounceTimeInMs: number;
  items: any[];
  renderItem: (item: any) => HTMLElement;
  visibleItemCount: number;
}

export class TdxVirtualInfiniteScroll extends HTMLElement {
  debounceTimeInMs: number = 0;
  items: any[] = [];
  renderItem: (item: any) => HTMLElement = () => document.createElement('div');
  visibleItemCount: number = 10;

  private _contentArea: HTMLDivElement;
  private _itemOffsets: number[] = [];
  private _isOptionsSet: boolean = false;
  private _root: ShadowRoot;
  private _viewport: HTMLDivElement;
  private _visibleItems: HTMLDivElement;

  static tagName = 'tdx-virtual-infinite-scroll';

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
        height: 100%;
        overflow: hidden;
      }


      .content-area {
        background-color: green;
      }
      .visible-items {
        background-color: blue;
      }
    </style>
    <div class="viewport">
      <div class="content-area">
        <div class="visible-items"></div>
      </div>
    </div>
    `;

    this._contentArea = this._root.querySelector<HTMLDivElement>(
      '.content-area'
    ) as HTMLDivElement;
    this._viewport = this._root.querySelector<HTMLDivElement>(
      '.viewport'
    ) as HTMLDivElement;
    this._visibleItems = this._root.querySelector<HTMLDivElement>(
      '.visible-items'
    ) as HTMLDivElement;

    this._viewport.addEventListener(
      'scroll',
      () => debounce(this._handleScroll.bind(this), this.debounceTimeInMs),
      {
        passive: true,
      }
    );
  }

  setOptions(options: TdxVirtualInfiniteScrollOptions) {
    if (this._isOptionsSet) {
      throw new Error('Options can be set only once');
    }
    this._isOptionsSet = true;

    // TODO Options validation
    this.debounceTimeInMs = options.debounceTimeInMs;
    this.items = options.items;
    this.renderItem = options.renderItem;
    this.visibleItemCount = options.visibleItemCount;

    // const newChildItems = this._createItems(0, this.visibleItemCount - 1);
    // this._visibleItems.appendChild;
    // this._handleScroll();
  }

  _createItems() {
    //startIndex: number, endIndex: number) {
    // const childItems = new Array(endIndex - startIndex)
    //   .fill(null)
    //   .map((_, index) => this.renderItem(index + startIndex));
  }

  private _handleScroll() {
    console.log('handleScroll');

    const viewSettings = calculateView({
      itemOffsets: this._itemOffsets,
      offsetTop: this._viewport.scrollTop,
      visibleItemCount: this.visibleItemCount,
    });

    this._updateView({
      contentAreaHeight: viewSettings.contentAreaHeight,
      startNodeIndex: viewSettings.startNodeIndex,
      visibleAreaOffsetTop: viewSettings.visibleAreaOffsetTop,
    });
  }

  private _updateView({
    contentAreaHeight,
    startNodeIndex,
    visibleAreaOffsetTop,
  }: {
    contentAreaHeight: number;
    startNodeIndex: number;
    visibleAreaOffsetTop: number;
  }) {
    this._contentArea.style.height = `${contentAreaHeight}px`;
    this._visibleItems.style.transform = `translateY(${visibleAreaOffsetTop}px)`;

    // TODO area for improvement - this should do differential rendering - not re-render EVERYTHING
    const childItems = new Array(this.visibleItemCount)
      .fill(null)
      .map((_, index) => this.renderItem(index + startNodeIndex));
    this._renderVisibleItems(childItems, startNodeIndex);
  }

  private _renderVisibleItems(newChildren: Node[], startNodeIndex: number) {
    while (this._visibleItems.childNodes.length) {
      this._visibleItems.removeChild(this._visibleItems.firstChild as Node);
    }

    const fragment = document.createDocumentFragment();
    newChildren.forEach((child: Node) => fragment.appendChild(child));

    this._visibleItems.appendChild(fragment);

    this._calculateItemOffsets(startNodeIndex);
  }

  private _calculateItemOffsets(startNodeIndex: number) {
    let index = 0;
    for (const item of this._visibleItems.children) {
      // TODO safety to make sure previous values have been populated
      const element = item as HTMLElement;
      this._itemOffsets[startNodeIndex + index] =
        this._itemOffsets[startNodeIndex + index - 1] + element.offsetHeight;
      index++;
    }

    console.log(this._itemOffsets);
  }
}
