import { Shoemaker, html } from '@shoelace-style/shoemaker';
import { calculateView } from './calculate-view';

export class TdxInfiniteScroll extends Shoemaker {
  childItems: HTMLElement[];
  items: any[];
  itemHeight: number;
  renderItem: (item: any) => HTMLElement;
  visibleItemCount: number;

  private _contentArea: HTMLDivElement;
  private _viewport: HTMLDivElement;
  private _visibleItems: HTMLDivElement;

  static tagName = 'tdx-infinite-scroll';
  static props = [
    'items',
    'itemHeight',
    'renderItem',
    'visibleItemCount',
    'childItems',
  ];

  onReady() {
    this._contentArea = this.shadowRoot.querySelector('.content-area');
    this._viewport = this.shadowRoot.querySelector('.viewport');
    this._visibleItems = this.shadowRoot.querySelector('.visible-items');

    const contentAreaHeight = this.items.length * this.itemHeight;
    const viewportHeight = this._viewport.clientHeight;
    const viewSettings = calculateView({
      itemCount: this.items.length,
      itemHeight: this.itemHeight,
      offsetTop: 0,
      viewportHeight,
      viewportPadding: 0,
    });

    this.updateView({
      contentAreaHeight,
      startNodeIndex: viewSettings.startNodeIndex,
      visibleAreaOffsetTop: viewSettings.visibleAreaOffsetTop,
    });
  }

  updateView({ contentAreaHeight, startNodeIndex, visibleAreaOffsetTop }) {
    this._contentArea.style.height = contentAreaHeight;
    this._visibleItems.style.transform = `translateY(${visibleAreaOffsetTop}px)`;

    // TODO area for improvement - this should do differential rendering - not re-render EVERYTHING
    this.childItems = new Array(this.visibleItemCount)
      .fill(null)
      .map((_, index) => this.renderItem(index + startNodeIndex));
  }

  static styles = `.viewport, .content-area {
    height: 100%;
    overflow: hidden;
  }`;

  render() {
    return html`
      <div class="viewport">
        <div class="content-area">
          <div class="visible-items">${this.childItems}</div>
        </div>
      </div>
    `;
  }
}
