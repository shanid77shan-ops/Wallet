import{B as e,C as t,g as n,j as r,r as i,u as a,y as o,z as s}from"./ModalController-CB-GFP55.js";import{T as c,b as l,c as u,g as d,l as f,o as p,p as m,s as h,v as g}from"./wui-text-DOWykSyR.js";import{t as _}from"./if-defined-B9gw6DSI.js";import"./wui-image-BGGabAFH.js";import"./wui-icon-box-Yc_yvI5o.js";import"./wui-link-Bcu5YEel.js";import"./wui-icon-box-Dsf7H7bQ.js";import"./wui-shimmer-BKGnKiI5.js";var v;(function(e){e.approve=`approved`,e.bought=`bought`,e.borrow=`borrowed`,e.burn=`burnt`,e.cancel=`canceled`,e.claim=`claimed`,e.deploy=`deployed`,e.deposit=`deposited`,e.execute=`executed`,e.mint=`minted`,e.receive=`received`,e.repay=`repaid`,e.send=`sent`,e.sell=`sold`,e.stake=`staked`,e.trade=`swapped`,e.unstake=`unstaked`,e.withdraw=`withdrawn`})(v||={});var y=d`
  :host > wui-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  :host([data-no-images='true']) > wui-flex {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[3]} !important;
  }

  :host > wui-flex wui-image {
    display: block;
  }

  :host > wui-flex,
  :host > wui-flex wui-image,
  .swap-images-container,
  .swap-images-container.nft,
  wui-image.nft {
    border-top-left-radius: var(--local-left-border-radius);
    border-top-right-radius: var(--local-right-border-radius);
    border-bottom-left-radius: var(--local-left-border-radius);
    border-bottom-right-radius: var(--local-right-border-radius);
  }

  .swap-images-container {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .swap-images-container wui-image:first-child {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    left: 0%;
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-images-container wui-image:last-child {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }

  .swap-fallback-container {
    position: absolute;
    inset: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .swap-fallback-container.first {
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-fallback-container.last {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }

  wui-flex.status-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
    border-radius: ${({borderRadius:e})=>e[4]};
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.theme.backgroundPrimary};
    overflow: hidden;
    width: 16px;
    height: 16px;
  }
`,b=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},x=class extends g{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:``},this.failedImageUrls=new Set}handleImageError(e){return t=>{t.stopPropagation(),this.failedImageUrls.add(e),this.requestUpdate()}}render(){let[e,t]=this.images;this.images.length||(this.dataset.noImages=`true`);let n=e?.type===`NFT`,r=t?.url?t.type===`NFT`:n,i=n?`var(--apkt-borderRadius-3)`:`var(--apkt-borderRadius-5)`,a=r?`var(--apkt-borderRadius-3)`:`var(--apkt-borderRadius-5)`;return this.style.cssText=`
    --local-left-border-radius: ${i};
    --local-right-border-radius: ${a};
    `,l`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){let[e,t]=this.images;return this.images.length===2&&(e?.url||t?.url)?this.renderSwapImages(e,t):e?.url&&!this.failedImageUrls.has(e.url)?this.renderSingleImage(e):e?.type===`NFT`?this.renderPlaceholderIcon(`nftPlaceholder`):this.renderPlaceholderIcon(`coinPlaceholder`)}renderSwapImages(e,t){return l`<div class="swap-images-container">
      ${e?.url?this.renderImageOrFallback(e,`first`,!0):null}
      ${t?.url?this.renderImageOrFallback(t,`last`,!0):null}
    </div>`}renderSingleImage(e){return this.renderImageOrFallback(e,void 0,!1)}renderImageOrFallback(e,t,n=!1){return e.url?this.failedImageUrls.has(e.url)?n&&t?this.renderFallbackIconInContainer(t):this.renderFallbackIcon():l`<wui-image
      src=${e.url}
      alt="Transaction image"
      @onLoadError=${this.handleImageError(e.url)}
    ></wui-image>`:null}renderFallbackIconInContainer(e){return l`<div class="swap-fallback-container ${e}">${this.renderFallbackIcon()}</div>`}renderFallbackIcon(){return l`<wui-icon
      size="xl"
      weight="regular"
      color="default"
      name="networkPlaceholder"
    ></wui-icon>`}renderPlaceholderIcon(e){return l`<wui-icon size="xl" weight="regular" color="default" name=${e}></wui-icon>`}templateIcon(){let e=`accent-primary`,t;return t=this.getIcon(),this.status&&(e=this.getStatusColor()),t?l`
      <wui-flex alignItems="center" justifyContent="center" class="status-box">
        <wui-icon-box size="sm" color=${e} icon=${t}></wui-icon-box>
      </wui-flex>
    `:null}getDirectionIcon(){switch(this.direction){case`in`:return`arrowBottom`;case`out`:return`arrowTop`;default:return}}getIcon(){return this.onlyDirectionIcon?this.getDirectionIcon():this.type===`trade`?`swapHorizontal`:this.type===`approve`?`checkmark`:this.type===`cancel`?`close`:this.getDirectionIcon()}getStatusColor(){switch(this.status){case`confirmed`:return`success`;case`failed`:return`error`;case`pending`:return`inverse`;default:return`accent-primary`}}};x.styles=[y],b([h()],x.prototype,`type`,void 0),b([h()],x.prototype,`status`,void 0),b([h()],x.prototype,`direction`,void 0),b([h({type:Boolean})],x.prototype,`onlyDirectionIcon`,void 0),b([h({type:Array})],x.prototype,`images`,void 0),b([h({type:Object})],x.prototype,`secondImage`,void 0),b([p()],x.prototype,`failedImageUrls`,void 0),x=b([u(`wui-transaction-visual`)],x);var S=d`
  :host {
    width: 100%;
  }

  :host > wui-flex:first-child {
    align-items: center;
    column-gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    width: 100%;
  }

  :host > wui-flex:first-child wui-text:nth-child(1) {
    text-transform: capitalize;
  }

  wui-transaction-visual {
    width: 40px;
    height: 40px;
  }

  wui-flex {
    flex: 1;
  }

  :host wui-flex wui-flex {
    overflow: hidden;
  }

  :host .description-container wui-text span {
    word-break: break-all;
  }

  :host .description-container wui-text {
    overflow: hidden;
  }

  :host .description-separator-icon {
    margin: 0px 6px;
  }

  :host wui-text > span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`,C=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},w=class extends g{constructor(){super(...arguments),this.type=`approve`,this.onlyDirectionIcon=!1,this.images=[]}render(){return l`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${_(this.direction)}
          type=${this.type}
          .onlyDirectionIcon=${this.onlyDirectionIcon}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="lg-medium" color="primary">
            ${v[this.type]||this.type}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="sm-medium" color="secondary"><span>${this.date}</span></wui-text>
      </wui-flex>
    `}templateDescription(){let e=this.descriptions?.[0];return e?l`
          <wui-text variant="md-regular" color="secondary">
            <span>${e}</span>
          </wui-text>
        `:null}templateSecondDescription(){let e=this.descriptions?.[1];return e?l`
          <wui-icon class="description-separator-icon" size="sm" name="arrowRight"></wui-icon>
          <wui-text variant="md-regular" color="secondary">
            <span>${e}</span>
          </wui-text>
        `:null}};w.styles=[m,S],C([h()],w.prototype,`type`,void 0),C([h({type:Array})],w.prototype,`descriptions`,void 0),C([h()],w.prototype,`date`,void 0),C([h({type:Boolean})],w.prototype,`onlyDirectionIcon`,void 0),C([h()],w.prototype,`status`,void 0),C([h()],w.prototype,`direction`,void 0),C([h({type:Array})],w.prototype,`images`,void 0),w=C([u(`wui-transaction-list-item`)],w);var T=d`
  wui-flex {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e[128]};
  }

  .fallback-icon {
    color: ${({tokens:e})=>e.theme.iconInverse};
    border-radius: ${({borderRadius:e})=>e[3]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .direction-icon,
  .status-image {
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: ${({borderRadius:e})=>e[128]};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .direction-icon {
    padding: ${({spacing:e})=>e[`01`]};
    color: ${({tokens:e})=>e.core.iconSuccess};

    background-color: color-mix(
      in srgb,
      ${({tokens:e})=>e.core.textSuccess} 30%,
      ${({tokens:e})=>e.theme.backgroundPrimary} 70%
    );
  }

  /* -- Sizes --------------------------------------------------- */
  :host([data-size='sm']) > wui-image:not(.status-image),
  :host([data-size='sm']) > wui-flex {
    width: 24px;
    height: 24px;
  }

  :host([data-size='lg']) > wui-image:not(.status-image),
  :host([data-size='lg']) > wui-flex {
    width: 40px;
    height: 40px;
  }

  :host([data-size='sm']) .fallback-icon {
    height: 16px;
    width: 16px;
    padding: ${({spacing:e})=>e[1]};
  }

  :host([data-size='lg']) .fallback-icon {
    height: 32px;
    width: 32px;
    padding: ${({spacing:e})=>e[1]};
  }

  :host([data-size='sm']) .direction-icon,
  :host([data-size='sm']) .status-image {
    transform: translate(40%, 30%);
  }

  :host([data-size='lg']) .direction-icon,
  :host([data-size='lg']) .status-image {
    transform: translate(40%, 10%);
  }

  :host([data-size='sm']) .status-image {
    height: 14px;
    width: 14px;
  }

  :host([data-size='lg']) .status-image {
    height: 20px;
    width: 20px;
  }

  /* -- Crop effects --------------------------------------------------- */
  .swap-crop-left-image,
  .swap-crop-right-image {
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .swap-crop-left-image {
    left: 0;
    clip-path: inset(0px calc(50% + 1.5px) 0px 0%);
  }

  .swap-crop-right-image {
    right: 0;
    clip-path: inset(0px 0px 0px calc(50% + 1.5px));
  }
`,E=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},D={sm:`xxs`,lg:`md`},O=class extends g{constructor(){super(...arguments),this.type=`approve`,this.size=`lg`,this.statusImageUrl=``,this.images=[]}render(){return l`<wui-flex>${this.templateVisual()} ${this.templateIcon()}</wui-flex>`}templateVisual(){switch(this.dataset.size=this.size,this.type){case`trade`:return this.swapTemplate();case`fiat`:return this.fiatTemplate();case`unknown`:return this.unknownTemplate();default:return this.tokenTemplate()}}swapTemplate(){let[e,t]=this.images;return this.images.length===2&&(e||t)?l`
        <wui-image class="swap-crop-left-image" src=${e} alt="Swap image"></wui-image>
        <wui-image class="swap-crop-right-image" src=${t} alt="Swap image"></wui-image>
      `:e?l`<wui-image src=${e} alt="Swap image"></wui-image>`:null}fiatTemplate(){return l`<wui-icon
      class="fallback-icon"
      size=${D[this.size]}
      name="dollar"
    ></wui-icon>`}unknownTemplate(){return l`<wui-icon
      class="fallback-icon"
      size=${D[this.size]}
      name="questionMark"
    ></wui-icon>`}tokenTemplate(){let[e]=this.images;return e?l`<wui-image src=${e} alt="Token image"></wui-image> `:l`<wui-icon
      class="fallback-icon"
      name=${this.type===`nft`?`image`:`coinPlaceholder`}
    ></wui-icon>`}templateIcon(){return this.statusImageUrl?l`<wui-image
        class="status-image"
        src=${this.statusImageUrl}
        alt="Status image"
      ></wui-image>`:l`<wui-icon
      class="direction-icon"
      size=${D[this.size]}
      name=${this.getTemplateIcon()}
    ></wui-icon>`}getTemplateIcon(){return this.type===`trade`?`arrowClockWise`:`arrowBottom`}};O.styles=[T],E([h()],O.prototype,`type`,void 0),E([h()],O.prototype,`size`,void 0),E([h()],O.prototype,`statusImageUrl`,void 0),E([h({type:Array})],O.prototype,`images`,void 0),O=E([u(`wui-transaction-thumbnail`)],O);var k=d`
  :host > wui-flex:first-child {
    gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[3]};
    width: 100%;
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`,A=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},j=class extends g{render(){return l`
      <wui-flex alignItems="center" .padding=${[`1`,`2`,`1`,`2`]}>
        <wui-shimmer width="40px" height="40px" rounded></wui-shimmer>
        <wui-flex flexDirection="column" gap="1">
          <wui-shimmer width="124px" height="16px" rounded></wui-shimmer>
          <wui-shimmer width="60px" height="14px" rounded></wui-shimmer>
        </wui-flex>
        <wui-shimmer width="24px" height="12px" rounded></wui-shimmer>
      </wui-flex>
    `}};j.styles=[m,k],j=A([u(`wui-transaction-list-item-loader`)],j);var M=d`
  :host {
    min-height: 100%;
  }

  .group-container[last-group='true'] {
    padding-bottom: ${({spacing:e})=>e[3]};
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:e})=>e[3]};
  }

  .contentContainer > .textContent {
    width: 65%;
  }

  .emptyContainer {
    height: 100%;
  }
`,N=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},P=`last-transaction`,F=7,I=class extends g{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.page=`activity`,this.caipAddress=i.state.activeCaipAddress,this.transactionsByYear=a.state.transactionsByYear,this.loading=a.state.loading,this.empty=a.state.empty,this.next=a.state.next,a.clearCursor(),this.unsubscribe.push(i.subscribeKey(`activeCaipAddress`,e=>{e&&this.caipAddress!==e&&(a.resetTransactions(),a.fetchTransactions(e)),this.caipAddress=e}),i.subscribeKey(`activeCaipNetwork`,()=>{this.updateTransactionView()}),a.subscribe(e=>{this.transactionsByYear=e.transactionsByYear,this.loading=e.loading,this.empty=e.empty,this.next=e.next}))}firstUpdated(){this.updateTransactionView(),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return l` ${this.empty?null:this.templateTransactionsByYear()}
    ${this.loading?this.templateLoading():null}
    ${!this.loading&&this.empty?this.templateEmpty():null}`}updateTransactionView(){a.resetTransactions(),this.caipAddress&&a.fetchTransactions(e.getPlainAddress(this.caipAddress))}templateTransactionsByYear(){return Object.keys(this.transactionsByYear).sort().reverse().map(e=>{let t=parseInt(e,10),n=Array(12).fill(null).map((e,n)=>({groupTitle:f.getTransactionGroupTitle(t,n),transactions:this.transactionsByYear[t]?.[n]})).filter(({transactions:e})=>e).reverse();return n.map(({groupTitle:e,transactions:t},r)=>{let i=r===n.length-1;return t?l`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${i?`true`:`false`}"
            data-testid="month-indexes"
          >
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${[`2`,`3`,`3`,`3`]}
            >
              <wui-text variant="md-medium" color="secondary" data-testid="group-title">
                ${e}
              </wui-text>
            </wui-flex>
            <wui-flex flexDirection="column" gap="2">
              ${this.templateTransactions(t,i)}
            </wui-flex>
          </wui-flex>
        `:null})})}templateRenderTransaction(e,t){let{date:n,descriptions:r,direction:i,images:a,status:o,type:s,transfers:c,isAllNFT:u}=this.getTransactionListItemProps(e);return l`
      <wui-transaction-list-item
        date=${n}
        .direction=${i}
        id=${t&&this.next?P:``}
        status=${o}
        type=${s}
        .images=${a}
        .onlyDirectionIcon=${u||c.length===1}
        .descriptions=${r}
      ></wui-transaction-list-item>
    `}templateTransactions(e,t){return e.map((n,r)=>{let i=t&&r===e.length-1;return l`${this.templateRenderTransaction(n,i)}`})}emptyStateActivity(){return l`<wui-flex
      class="emptyContainer"
      flexGrow="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      .padding=${[`10`,`5`,`10`,`5`]}
      gap="5"
      data-testid="empty-activity-state"
    >
      <wui-icon-box color="default" icon="wallet" size="xl"></wui-icon-box>
      <wui-flex flexDirection="column" alignItems="center" gap="2">
        <wui-text align="center" variant="lg-medium" color="primary">No Transactions yet</wui-text>
        <wui-text align="center" variant="lg-regular" color="secondary"
          >Start trading on dApps <br />
          to grow your wallet!</wui-text
        >
      </wui-flex>
    </wui-flex>`}emptyStateAccount(){return l`<wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="4"
      data-testid="empty-account-state"
    >
      <wui-icon-box icon="swapHorizontal" size="lg" color="default"></wui-icon-box>
      <wui-flex
        class="textContent"
        gap="2"
        flexDirection="column"
        justifyContent="center"
        flexDirection="column"
      >
        <wui-text variant="md-regular" align="center" color="primary">No activity yet</wui-text>
        <wui-text variant="sm-regular" align="center" color="secondary"
          >Your next transactions will appear here</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)}>Trade</wui-link>
    </wui-flex>`}templateEmpty(){return this.page===`account`?l`${this.emptyStateAccount()}`:l`${this.emptyStateActivity()}`}templateLoading(){return this.page===`activity`?l` <wui-flex flexDirection="column" width="100%">
        <wui-flex .padding=${[`2`,`3`,`3`,`3`]}>
          <wui-shimmer width="70px" height="16px" rounded></wui-shimmer>
        </wui-flex>
        <wui-flex flexDirection="column" gap="2" width="100%">
          ${Array(F).fill(l` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(e=>e)}
        </wui-flex>
      </wui-flex>`:null}onReceiveClick(){o.push(`WalletReceive`)}createPaginationObserver(){let{projectId:o}=r.state;this.paginationObserver=new IntersectionObserver(([r])=>{r?.isIntersecting&&!this.loading&&(a.fetchTransactions(e.getPlainAddress(this.caipAddress)),t.sendEvent({type:`track`,event:`LOAD_MORE_TRANSACTIONS`,properties:{address:e.getPlainAddress(this.caipAddress),projectId:o,cursor:this.next,isSmartAccount:n(i.state.activeChain)===s.ACCOUNT_TYPES.SMART_ACCOUNT}}))},{}),this.setPaginationObserver()}setPaginationObserver(){this.paginationObserver?.disconnect();let e=this.shadowRoot?.querySelector(`#${P}`);e&&this.paginationObserver?.observe(e)}getTransactionListItemProps(e){let t=c.formatDate(e?.metadata?.minedAt),n=f.mergeTransfers(e?.transfers||[]),r=f.getTransactionDescriptions(e,n),i=n?.[0],a=!!i&&n?.every(e=>!!e.nft_info),o=f.getTransactionImages(n);return{date:t,direction:i?.direction,descriptions:r,isAllNFT:a,images:o,status:e.metadata?.status,transfers:n,type:e.metadata?.operationType}}};I.styles=M,N([h()],I.prototype,`page`,void 0),N([p()],I.prototype,`caipAddress`,void 0),N([p()],I.prototype,`transactionsByYear`,void 0),N([p()],I.prototype,`loading`,void 0),N([p()],I.prototype,`empty`,void 0),N([p()],I.prototype,`next`,void 0),I=N([u(`w3m-activity-list`)],I);