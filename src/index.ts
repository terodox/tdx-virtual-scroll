import { calculateView } from './calculate-view';

export interface TdxVirtualScrollOptions {
  debounceTimeInMs: number;
  items: any[];
  itemHeight: number;
  renderItem: (item: any) => HTMLElement;
  visibleItemCount: number;
}

export class TdxVirtualScroll extends HTMLElement {
  childItems: HTMLElement[] = [];
  debounceTimeInMs: number = 0;
  items: any[] = [];
  itemHeight: number = 0;
  renderItem: (item: any) => HTMLElement = () => document.createElement('div');
  visibleItemCount: number = 10;

  private _contentArea: HTMLDivElement;
  // @ts-ignore not initialized in constructor
  private _debounceTimeInMsr: NodeJS.Timeout;
  private _root: ShadowRoot;
  private _viewport: HTMLDivElement;
  private _visibleItems: HTMLDivElement;

  static tagName = 'tdx-virtual-scroll';

  static register() {
    customElements.define(this.tagName, this);
  }

  constructor() {
    super();
    this._root = this.attachShadow({ mode : 'open' });

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
        <div class="visible-items">${this.childItems}</div>
      </div>
    </div>
    `;

    this._contentArea = this._root.querySelector<HTMLDivElement>('.content-area') as HTMLDivElement;
    this._viewport = this._root.querySelector<HTMLDivElement>('.viewport') as HTMLDivElement;
    this._visibleItems = this._root.querySelector<HTMLDivElement>('.visible-items') as HTMLDivElement;

    this._viewport.addEventListener("scroll", () => this._debounce(this._handleScroll.bind(this), this.debounceTimeInMs), {
      passive: true
    });
  }

  setOptions(options: TdxVirtualScrollOptions) {
    // TODO Options validation
    this.debounceTimeInMs = options.debounceTimeInMs;
    this.items = options.items;
    this.itemHeight = options.itemHeight;
    this.renderItem = options.renderItem;
    this.visibleItemCount = options.visibleItemCount;

    this._handleScroll();
  }

  // TODO Refactor to own module
  private _debounce(functionToCall: () => void, howLong: number) {
    console.log('debounce');
    clearTimeout(this._debounceTimeInMsr);
    this._debounceTimeInMsr = setTimeout(functionToCall, howLong);
  }

  private _handleScroll() {
    console.log('handleScroll');
    const viewportHeight = this._viewport.clientHeight;
    const contentAreaHeight = this.items.length * this.itemHeight;

    const viewSettings = calculateView({
      itemHeight: this.itemHeight,
      offsetTop: this._viewport.scrollTop,
      viewportHeight,
      viewportPadding: 0,
    });

    this._updateView({
      contentAreaHeight,
      startNodeIndex: viewSettings.startNodeIndex,
      visibleAreaOffsetTop: viewSettings.visibleAreaOffsetTop,
    });
  }

  private _updateView({ contentAreaHeight, startNodeIndex, visibleAreaOffsetTop } : { contentAreaHeight: number, startNodeIndex: number, visibleAreaOffsetTop: number }) {
    this._contentArea.style.height = `${contentAreaHeight}px`;
    this._visibleItems.style.transform = `translateY(${visibleAreaOffsetTop}px)`;

    // TODO area for improvement - this should do differential rendering - not re-render EVERYTHING
    this.childItems = new Array(this.visibleItemCount)
      .fill(null)
      .map((_, index) => this.renderItem(index + startNodeIndex));
    this._renderVisibleItems(this.childItems);
  }

  private _renderVisibleItems(newChildren: Node []) {
    while(this._visibleItems.childNodes.length) {
      this._visibleItems.removeChild(this._visibleItems.firstChild as Node);
    }

    const fragment = document.createDocumentFragment();
    newChildren.forEach((child: Node) => fragment.appendChild(child));

    this._visibleItems.appendChild(fragment);
  }
}

TdxVirtualScroll.register();
