import{$ as e,A as t,B as n,C as r,M as i,T as a,Z as o,_ as s,c,et as l,h as u,it as ee,j as d,l as f,nt as p,o as te,r as m,rt as ne,st as re,t as h,y as g}from"./ModalController-BrSEVdVr.js";import{C as ie,_ as ae,b as _,c as v,d as oe,g as y,o as b,p as se,s as x,t as ce,u as le,v as S,w as ue}from"./wui-text-BzY9ZYvk.js";import{n as C}from"./wui-network-image-BnGDINDk.js";import{t as w}from"./if-defined-1eJj9azs.js";import"./wui-icon-CuHcOIyv.js";import"./wui-icon-link-Mh5Lk4iY.js";import"./wui-list-item-BxYsj49e.js";import"./wui-button-DltTaMa5.js";import"./wui-separator-CZ4-58oQ.js";import"./wui-shimmer-DjftyOib.js";import"./wui-loading-spinner-HziOIYqJ.js";import"./wui-image-CQuXzd25.js";var de=y`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  /* -- Colors --------------------------------------------------- */
  button[data-type='accent'] wui-icon {
    color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  button[data-type='neutral'][data-variant='primary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconInverse};
  }

  button[data-type='neutral'][data-variant='secondary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button[data-type='success'] wui-icon {
    color: ${({tokens:e})=>e.core.iconSuccess};
  }

  button[data-type='error'] wui-icon {
    color: ${({tokens:e})=>e.core.iconError};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='xs'] {
    width: 16px;
    height: 16px;

    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='sm'] {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'] {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='lg'] {
    width: 28px;
    height: 28px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='xs'] wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] wui-icon {
    width: 20px;
    height: 20px;
  }

  /* -- Hover --------------------------------------------------- */
  @media (hover: hover) {
    button[data-type='accent']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    }

    button[data-variant='primary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-variant='secondary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-type='success']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};
    }

    button[data-type='error']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundError};
    }
  }

  /* -- Focus --------------------------------------------------- */
  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  /* -- Properties --------------------------------------------------- */
  button[data-full-width='true'] {
    width: 100%;
  }

  :host([fullWidth]) {
    width: 100%;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,T=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},E=class extends S{constructor(){super(...arguments),this.icon=`card`,this.variant=`primary`,this.type=`accent`,this.size=`md`,this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return _`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${w(this.iconSize)}></wui-icon>
    </button>`}};E.styles=[se,oe,de],T([x()],E.prototype,`icon`,void 0),T([x()],E.prototype,`variant`,void 0),T([x()],E.prototype,`type`,void 0),T([x()],E.prototype,`size`,void 0),T([x()],E.prototype,`iconSize`,void 0),T([x({type:Boolean})],E.prototype,`fullWidth`,void 0),T([x({type:Boolean})],E.prototype,`disabled`,void 0),E=T([v(`wui-icon-button`)],E);var D={INVALID_PAYMENT_CONFIG:`INVALID_PAYMENT_CONFIG`,INVALID_RECIPIENT:`INVALID_RECIPIENT`,INVALID_ASSET:`INVALID_ASSET`,INVALID_AMOUNT:`INVALID_AMOUNT`,UNKNOWN_ERROR:`UNKNOWN_ERROR`,UNABLE_TO_INITIATE_PAYMENT:`UNABLE_TO_INITIATE_PAYMENT`,INVALID_CHAIN_NAMESPACE:`INVALID_CHAIN_NAMESPACE`,GENERIC_PAYMENT_ERROR:`GENERIC_PAYMENT_ERROR`,UNABLE_TO_GET_EXCHANGES:`UNABLE_TO_GET_EXCHANGES`,ASSET_NOT_SUPPORTED:`ASSET_NOT_SUPPORTED`,UNABLE_TO_GET_PAY_URL:`UNABLE_TO_GET_PAY_URL`,UNABLE_TO_GET_BUY_STATUS:`UNABLE_TO_GET_BUY_STATUS`,UNABLE_TO_GET_TOKEN_BALANCES:`UNABLE_TO_GET_TOKEN_BALANCES`,UNABLE_TO_GET_QUOTE:`UNABLE_TO_GET_QUOTE`,UNABLE_TO_GET_QUOTE_STATUS:`UNABLE_TO_GET_QUOTE_STATUS`,INVALID_RECIPIENT_ADDRESS_FOR_ASSET:`INVALID_RECIPIENT_ADDRESS_FOR_ASSET`},O={[D.INVALID_PAYMENT_CONFIG]:`Invalid payment configuration`,[D.INVALID_RECIPIENT]:`Invalid recipient address`,[D.INVALID_ASSET]:`Invalid asset specified`,[D.INVALID_AMOUNT]:`Invalid payment amount`,[D.INVALID_RECIPIENT_ADDRESS_FOR_ASSET]:`Invalid recipient address for the asset selected`,[D.UNKNOWN_ERROR]:`Unknown payment error occurred`,[D.UNABLE_TO_INITIATE_PAYMENT]:`Unable to initiate payment`,[D.INVALID_CHAIN_NAMESPACE]:`Invalid chain namespace`,[D.GENERIC_PAYMENT_ERROR]:`Unable to process payment`,[D.UNABLE_TO_GET_EXCHANGES]:`Unable to get exchanges`,[D.ASSET_NOT_SUPPORTED]:`Asset not supported by the selected exchange`,[D.UNABLE_TO_GET_PAY_URL]:`Unable to get payment URL`,[D.UNABLE_TO_GET_BUY_STATUS]:`Unable to get buy status`,[D.UNABLE_TO_GET_TOKEN_BALANCES]:`Unable to get token balances`,[D.UNABLE_TO_GET_QUOTE]:`Unable to get quote. Please choose a different token`,[D.UNABLE_TO_GET_QUOTE_STATUS]:`Unable to get quote status`},k=class e extends Error{get message(){return O[this.code]}constructor(t,n){super(O[t]),this.name=`AppKitPayError`,this.code=t,this.details=n,Error.captureStackTrace&&Error.captureStackTrace(this,e)}},fe=`https://rpc.walletconnect.org/v1/json-rpc`,pe=`reown_test`;function me(){let{chainNamespace:e}=o.parseCaipNetworkId(L.state.paymentAsset.network);if(!n.isAddress(L.state.recipient,e))throw new k(D.INVALID_RECIPIENT_ADDRESS_FOR_ASSET,`Provide valid recipient address for namespace "${e}"`)}async function he(e,t,n){if(t!==p.CHAIN.EVM)throw new k(D.INVALID_CHAIN_NAMESPACE);if(!n.fromAddress)throw new k(D.INVALID_PAYMENT_CONFIG,`fromAddress is required for native EVM payments.`);let r=typeof n.amount==`string`?parseFloat(n.amount):n.amount;if(isNaN(r))throw new k(D.INVALID_PAYMENT_CONFIG);let i=e.metadata?.decimals??18,a=f.parseUnits(r.toString(),i);if(typeof a!=`bigint`)throw new k(D.GENERIC_PAYMENT_ERROR);return await f.sendTransaction({chainNamespace:t,to:n.recipient,address:n.fromAddress,value:a,data:`0x`})??void 0}async function ge(t,n){if(!n.fromAddress)throw new k(D.INVALID_PAYMENT_CONFIG,`fromAddress is required for ERC20 EVM payments.`);let r=t.asset,i=n.recipient,a=Number(t.metadata.decimals),o=f.parseUnits(n.amount.toString(),a);if(o===void 0)throw new k(D.GENERIC_PAYMENT_ERROR);return await f.writeContract({fromAddress:n.fromAddress,tokenAddress:r,args:[i,o],method:`transfer`,abi:e.getERC20Abi(r),chainNamespace:p.CHAIN.EVM})??void 0}async function _e(e,t){if(e!==p.CHAIN.SOLANA)throw new k(D.INVALID_CHAIN_NAMESPACE);if(!t.fromAddress)throw new k(D.INVALID_PAYMENT_CONFIG,`fromAddress is required for Solana payments.`);let n=typeof t.amount==`string`?parseFloat(t.amount):t.amount;if(isNaN(n)||n<=0)throw new k(D.INVALID_PAYMENT_CONFIG,`Invalid payment amount.`);try{if(!te.getProvider(e))throw new k(D.GENERIC_PAYMENT_ERROR,`No Solana provider available.`);let r=await f.sendTransaction({chainNamespace:p.CHAIN.SOLANA,to:t.recipient,value:n,tokenMint:t.tokenMint});if(!r)throw new k(D.GENERIC_PAYMENT_ERROR,`Transaction failed.`);return r}catch(e){throw e instanceof k?e:new k(D.GENERIC_PAYMENT_ERROR,`Solana payment failed: ${e}`)}}async function ve({sourceToken:e,toToken:t,amount:n,recipient:r}){let i=f.parseUnits(n,e.metadata.decimals),a=f.parseUnits(n,t.metadata.decimals);return Promise.resolve({type:Re,origin:{amount:i?.toString()??`0`,currency:e},destination:{amount:a?.toString()??`0`,currency:t},fees:[{id:`service`,label:`Service Fee`,amount:`0`,currency:t}],steps:[{requestId:Re,type:`deposit`,deposit:{amount:i?.toString()??`0`,currency:e.asset,receiver:r}}],timeInSeconds:6})}function A(e){if(!e)return null;let t=e.steps[0];return!t||t.type!==`deposit`?null:t}function j(e,t=0){if(!e)return[];let n=e.steps.filter(e=>e.type===ze),r=n.filter((e,n)=>n+1>t);return n.length>0&&n.length<3?r:[]}var M=new i({baseUrl:n.getApiUrl(),clientId:null}),ye=class extends Error{};function be(){return`${fe}?projectId=${d.getSnapshot().projectId}`}function xe(){let{projectId:e,sdkType:t,sdkVersion:n}=d.state;return{projectId:e,st:t||`appkit`,sv:n||`html-wagmi-4.2.2`}}async function Se(e,t){let n=be(),{sdkType:r,sdkVersion:i,projectId:a}=d.getSnapshot(),o={jsonrpc:`2.0`,id:1,method:e,params:{...t||{},st:r,sv:i,projectId:a}},s=await(await fetch(n,{method:`POST`,body:JSON.stringify(o),headers:{"Content-Type":`application/json`}})).json();if(s.error)throw new ye(s.error.message);return s}async function Ce(e){return(await Se(`reown_getExchanges`,e)).result}async function we(e){return(await Se(`reown_getExchangePayUrl`,e)).result}async function Te(e){return(await Se(`reown_getExchangeBuyStatus`,e)).result}async function Ee(e){let t=l.bigNumber(e.amount).times(10**e.toToken.metadata.decimals).toString(),{chainId:n,chainNamespace:r}=o.parseCaipNetworkId(e.sourceToken.network),{chainId:i,chainNamespace:a}=o.parseCaipNetworkId(e.toToken.network),s=e.sourceToken.asset===`native`?u(r):e.sourceToken.asset,c=e.toToken.asset===`native`?u(a):e.toToken.asset;return await M.post({path:`/appkit/v1/transfers/quote`,body:{user:e.address,originChainId:n.toString(),originCurrency:s,destinationChainId:i.toString(),destinationCurrency:c,recipient:e.recipient,amount:t},params:xe()})}async function De(e){let t=C.isLowerCaseMatch(e.sourceToken.network,e.toToken.network),n=C.isLowerCaseMatch(e.sourceToken.asset,e.toToken.asset);return t&&n?ve(e):Ee(e)}async function Oe(e){return await M.get({path:`/appkit/v1/transfers/status`,params:{requestId:e.requestId,...xe()}})}async function ke(e){return await M.get({path:`/appkit/v1/transfers/assets/exchanges/${e}`,params:xe()})}var Ae=[`eip155`,`solana`],je={eip155:{native:{assetNamespace:`slip44`,assetReference:`60`},defaultTokenNamespace:`erc20`},solana:{native:{assetNamespace:`slip44`,assetReference:`501`},defaultTokenNamespace:`token`}},Me={56:`714`,204:`714`};function N(e,t){let{chainNamespace:n,chainId:r}=o.parseCaipNetworkId(e),i=je[n];if(!i)throw Error(`Unsupported chain namespace for CAIP-19 formatting: ${n}`);let a=i.native.assetNamespace,s=i.native.assetReference;return t===`native`?n===`eip155`&&Me[r]&&(s=Me[r]):(a=i.defaultTokenNamespace,s=t),`${`${n}:${r}`}/${a}:${s}`}function Ne(e){let{chainNamespace:t}=o.parseCaipNetworkId(e);return Ae.includes(t)}function Pe(e){let t=m.getAllRequestedCaipNetworks().find(t=>t.caipNetworkId===e.chainId),r=e.address;if(!t)throw Error(`Target network not found for balance chainId "${e.chainId}"`);if(C.isLowerCaseMatch(e.symbol,t.nativeCurrency.symbol))r=`native`;else if(n.isCaipAddress(r)){let{address:e}=o.parseCaipAddress(r);r=e}else if(!r)throw Error(`Balance address not found for balance symbol "${e.symbol}"`);return{network:t.caipNetworkId,asset:r,metadata:{name:e.name,symbol:e.symbol,decimals:Number(e.quantity.decimals),logoURI:e.iconUrl},amount:e.quantity.numeric}}function Fe(e){return{chainId:e.network,address:`${e.network}:${e.asset}`,symbol:e.metadata.symbol,name:e.metadata.name,iconUrl:e.metadata.logoURI||``,price:0,quantity:{numeric:`0`,decimals:e.metadata.decimals.toString()}}}function P(e){let t=l.bigNumber(e,{safe:!0});return t.lt(.001)?`<0.001`:t.round(4).toString()}function Ie(e){let t=m.getAllRequestedCaipNetworks().find(t=>t.caipNetworkId===e.network);return t?!!t.testnet:!1}var Le=0,F=`unknown`,Re=`direct-transfer`,ze=`transaction`,I=ee({paymentAsset:{network:`eip155:1`,asset:`0x0`,metadata:{name:`0x0`,symbol:`0x0`,decimals:0}},recipient:`0x0`,amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0,choice:`pay`,tokenBalances:{[p.CHAIN.EVM]:[],[p.CHAIN.SOLANA]:[]},isFetchingTokenBalances:!1,selectedPaymentAsset:null,quote:void 0,quoteStatus:`waiting`,quoteError:null,isFetchingQuote:!1,selectedExchange:void 0,exchangeUrlForQuote:void 0,requestId:void 0}),L={state:I,subscribe(e){return re(I,()=>e(I))},subscribeKey(e,t){return ne(I,e,t)},async handleOpenPay(e){this.resetState(),this.setPaymentConfig(e),this.initializeAnalytics(),me(),await this.prepareTokenLogo(),I.isConfigured=!0,r.sendEvent({type:`track`,event:`PAY_MODAL_OPEN`,properties:{exchanges:I.exchanges,configuration:{network:I.paymentAsset.network,asset:I.paymentAsset.asset,recipient:I.recipient,amount:I.amount}}}),await h.open({view:`Pay`})},resetState(){I.paymentAsset={network:`eip155:1`,asset:`0x0`,metadata:{name:`0x0`,symbol:`0x0`,decimals:0}},I.recipient=`0x0`,I.amount=0,I.isConfigured=!1,I.error=null,I.isPaymentInProgress=!1,I.isLoading=!1,I.currentPayment=void 0,I.selectedExchange=void 0,I.exchangeUrlForQuote=void 0,I.requestId=void 0},resetQuoteState(){I.quote=void 0,I.quoteStatus=`waiting`,I.quoteError=null,I.isFetchingQuote=!1,I.requestId=void 0},setPaymentConfig(e){if(!e.paymentAsset)throw new k(D.INVALID_PAYMENT_CONFIG);try{I.choice=e.choice??`pay`,I.paymentAsset=e.paymentAsset,I.recipient=e.recipient,I.amount=e.amount,I.openInNewTab=e.openInNewTab??!0,I.redirectUrl=e.redirectUrl,I.payWithExchange=e.payWithExchange,I.error=null}catch(e){throw new k(D.INVALID_PAYMENT_CONFIG,e.message)}},setSelectedPaymentAsset(e){I.selectedPaymentAsset=e},setSelectedExchange(e){I.selectedExchange=e},setRequestId(e){I.requestId=e},setPaymentInProgress(e){I.isPaymentInProgress=e},getPaymentAsset(){return I.paymentAsset},getExchanges(){return I.exchanges},async fetchExchanges(){try{I.isLoading=!0,I.exchanges=(await Ce({page:Le})).exchanges.slice(0,2)}catch{throw t.showError(O.UNABLE_TO_GET_EXCHANGES),new k(D.UNABLE_TO_GET_EXCHANGES)}finally{I.isLoading=!1}},async getAvailableExchanges(e){try{let t=e?.asset&&e?.network?N(e.network,e.asset):void 0;return await Ce({page:e?.page??Le,asset:t,amount:e?.amount?.toString()})}catch{throw new k(D.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(e,t,n=!1){try{let i=Number(t.amount),a=await we({exchangeId:e,asset:N(t.network,t.asset),amount:i.toString(),recipient:`${t.network}:${t.recipient}`});return r.sendEvent({type:`track`,event:`PAY_EXCHANGE_SELECTED`,properties:{source:`pay`,exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:i},currentPayment:{type:`exchange`,exchangeId:e},headless:n}}),n&&(this.initiatePayment(),r.sendEvent({type:`track`,event:`PAY_INITIATED`,properties:{source:`pay`,paymentId:I.paymentId||F,configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:i},currentPayment:{type:`exchange`,exchangeId:e}}})),a}catch(e){throw e instanceof Error&&e.message.includes(`is not supported`)?new k(D.ASSET_NOT_SUPPORTED):Error(e.message)}},async generateExchangeUrlForQuote({exchangeId:e,paymentAsset:t,amount:n,recipient:r}){let i=await we({exchangeId:e,asset:N(t.network,t.asset),amount:n.toString(),recipient:r});I.exchangeSessionId=i.sessionId,I.exchangeUrlForQuote=i.url},async openPayUrl(e,t,r=!1){try{let i=await this.getPayUrl(e.exchangeId,t,r);if(!i)throw new k(D.UNABLE_TO_GET_PAY_URL);let a=e.openInNewTab??!0?`_blank`:`_self`;return n.openHref(i.url,a),i}catch(e){throw e instanceof k?I.error=e.message:I.error=O.GENERIC_PAYMENT_ERROR,new k(D.UNABLE_TO_GET_PAY_URL)}},async onTransfer({chainNamespace:e,fromAddress:n,toAddress:r,amount:i,paymentAsset:a}){if(I.currentPayment={type:`wallet`,status:`IN_PROGRESS`},!I.isPaymentInProgress)try{this.initiatePayment();let t=m.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===a.network);if(!t)throw Error(`Target network not found`);let o=m.state.activeCaipNetwork;switch(C.isLowerCaseMatch(o?.caipNetworkId,t.caipNetworkId)||await m.switchActiveNetwork(t),e){case p.CHAIN.EVM:a.asset===`native`&&(I.currentPayment.result=await he(a,e,{recipient:r,amount:i,fromAddress:n})),a.asset.startsWith(`0x`)&&(I.currentPayment.result=await ge(a,{recipient:r,amount:i,fromAddress:n})),I.currentPayment.status=`SUCCESS`;break;case p.CHAIN.SOLANA:I.currentPayment.result=await _e(e,{recipient:r,amount:i,fromAddress:n,tokenMint:a.asset===`native`?void 0:a.asset}),I.currentPayment.status=`SUCCESS`;break;default:throw new k(D.INVALID_CHAIN_NAMESPACE)}}catch(e){throw e instanceof k?I.error=e.message:I.error=O.GENERIC_PAYMENT_ERROR,I.currentPayment.status=`FAILED`,t.showError(I.error),e}finally{I.isPaymentInProgress=!1}},async onSendTransaction(e){try{let{namespace:t,transactionStep:n}=e;L.initiatePayment();let r=m.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===I.paymentAsset?.network);if(!r)throw Error(`Target network not found`);let i=m.state.activeCaipNetwork;if(C.isLowerCaseMatch(i?.caipNetworkId,r.caipNetworkId)||await m.switchActiveNetwork(r),t===p.CHAIN.EVM){let{from:e,to:r,data:i,value:a}=n.transaction;await f.sendTransaction({address:e,to:r,data:i,value:BigInt(a),chainNamespace:t})}else if(t===p.CHAIN.SOLANA){let{instructions:e}=n.transaction;await f.writeSolanaTransaction({instructions:e})}}catch(e){throw e instanceof k?I.error=e.message:I.error=O.GENERIC_PAYMENT_ERROR,t.showError(I.error),e}finally{I.isPaymentInProgress=!1}},getExchangeById(e){return I.exchanges.find(t=>t.id===e)},validatePayConfig(e){let{paymentAsset:t,recipient:n,amount:r}=e;if(!t)throw new k(D.INVALID_PAYMENT_CONFIG);if(!n)throw new k(D.INVALID_RECIPIENT);if(!t.asset)throw new k(D.INVALID_ASSET);if(r==null||r<=0)throw new k(D.INVALID_AMOUNT)},async handlePayWithExchange(e){try{I.currentPayment={type:`exchange`,exchangeId:e};let{network:t,asset:n}=I.paymentAsset,r={network:t,asset:n,amount:I.amount,recipient:I.recipient},i=await this.getPayUrl(e,r);if(!i)throw new k(D.UNABLE_TO_INITIATE_PAYMENT);return I.currentPayment.sessionId=i.sessionId,I.currentPayment.status=`IN_PROGRESS`,I.currentPayment.exchangeId=e,this.initiatePayment(),{url:i.url,openInNewTab:I.openInNewTab}}catch(e){return e instanceof k?I.error=e.message:I.error=O.GENERIC_PAYMENT_ERROR,I.isPaymentInProgress=!1,t.showError(I.error),null}},async getBuyStatus(e,t){try{let i=await Te({sessionId:t,exchangeId:e});return(i.status===`SUCCESS`||i.status===`FAILED`)&&r.sendEvent({type:`track`,event:i.status===`SUCCESS`?`PAY_SUCCESS`:`PAY_ERROR`,properties:{message:i.status===`FAILED`?n.parseError(I.error):void 0,source:`pay`,paymentId:I.paymentId||F,configuration:{network:I.paymentAsset.network,asset:I.paymentAsset.asset,recipient:I.recipient,amount:I.amount},currentPayment:{type:`exchange`,exchangeId:I.currentPayment?.exchangeId,sessionId:I.currentPayment?.sessionId,result:i.txHash}}}),i}catch{throw new k(D.UNABLE_TO_GET_BUY_STATUS)}},async fetchTokensFromEOA({caipAddress:e,caipNetwork:t,namespace:n}){if(!e)return[];let{address:r}=o.parseCaipAddress(e),i=t;return n===p.CHAIN.EVM&&(i=void 0),await c.getMyTokensWithBalance({address:r,caipNetwork:i})},async fetchTokensFromExchange(){if(!I.selectedExchange)return[];let e=await ke(I.selectedExchange.id),t=Object.values(e.assets).flat();return await Promise.all(t.map(async e=>{let t=Fe(e),{chainNamespace:r}=o.parseCaipNetworkId(t.chainId),i=t.address;if(n.isCaipAddress(i)){let{address:e}=o.parseCaipAddress(i);i=e}return t.iconUrl=await a.getImageByToken(i??``,r).catch(()=>void 0)??``,t}))},async fetchTokens({caipAddress:e,caipNetwork:n,namespace:r}){try{I.isFetchingTokenBalances=!0;let t=await(I.selectedExchange?this.fetchTokensFromExchange():this.fetchTokensFromEOA({caipAddress:e,caipNetwork:n,namespace:r}));I.tokenBalances={...I.tokenBalances,[r]:t}}catch(e){let n=e instanceof Error?e.message:`Unable to get token balances`;t.showError(n)}finally{I.isFetchingTokenBalances=!1}},async fetchQuote({amount:e,address:n,sourceToken:r,toToken:i,recipient:a}){try{L.resetQuoteState(),I.isFetchingQuote=!0;let t=await De({amount:e,address:I.selectedExchange?void 0:n,sourceToken:r,toToken:i,recipient:a});if(I.selectedExchange){let e=A(t);if(e){let t=`${r.network}:${e.deposit.receiver}`,n=l.formatNumber(e.deposit.amount,{decimals:r.metadata.decimals??0,round:8});await L.generateExchangeUrlForQuote({exchangeId:I.selectedExchange.id,paymentAsset:r,amount:n.toString(),recipient:t})}}I.quote=t}catch(e){let n=O.UNABLE_TO_GET_QUOTE;if(e instanceof Error&&e.cause&&e.cause instanceof Response)try{let t=await e.cause.json();t.error&&typeof t.error==`string`&&(n=t.error)}catch{}throw I.quoteError=n,t.showError(n),new k(D.UNABLE_TO_GET_QUOTE)}finally{I.isFetchingQuote=!1}},async fetchQuoteStatus({requestId:e}){try{if(e===`direct-transfer`){let e=I.selectedExchange,t=I.exchangeSessionId;if(e&&t){switch((await this.getBuyStatus(e.id,t)).status){case`IN_PROGRESS`:I.quoteStatus=`waiting`;break;case`SUCCESS`:I.quoteStatus=`success`,I.isPaymentInProgress=!1;break;case`FAILED`:I.quoteStatus=`failure`,I.isPaymentInProgress=!1;break;case`UNKNOWN`:I.quoteStatus=`waiting`;break;default:I.quoteStatus=`waiting`;break}return}I.quoteStatus=`success`;return}let{status:t}=await Oe({requestId:e});I.quoteStatus=t}catch{throw I.quoteStatus=`failure`,new k(D.UNABLE_TO_GET_QUOTE_STATUS)}},initiatePayment(){I.isPaymentInProgress=!0,I.paymentId=crypto.randomUUID()},initializeAnalytics(){I.analyticsSet||(I.analyticsSet=!0,this.subscribeKey(`isPaymentInProgress`,e=>{if(I.currentPayment?.status&&I.currentPayment.status!==`UNKNOWN`){let e={IN_PROGRESS:`PAY_INITIATED`,SUCCESS:`PAY_SUCCESS`,FAILED:`PAY_ERROR`}[I.currentPayment.status];r.sendEvent({type:`track`,event:e,properties:{message:I.currentPayment.status===`FAILED`?n.parseError(I.error):void 0,source:`pay`,paymentId:I.paymentId||F,configuration:{network:I.paymentAsset.network,asset:I.paymentAsset.asset,recipient:I.recipient,amount:I.amount},currentPayment:{type:I.currentPayment.type,exchangeId:I.currentPayment.exchangeId,sessionId:I.currentPayment.sessionId,result:I.currentPayment.result}}})}}))},async prepareTokenLogo(){if(!I.paymentAsset.metadata.logoURI)try{let{chainNamespace:e}=o.parseCaipNetworkId(I.paymentAsset.network),t=await a.getImageByToken(I.paymentAsset.asset,e);I.paymentAsset.metadata.logoURI=t}catch{}}},Be=y`
  wui-separator {
    margin: var(--apkt-spacing-3) calc(var(--apkt-spacing-3) * -1) var(--apkt-spacing-2)
      calc(var(--apkt-spacing-3) * -1);
    width: calc(100% + var(--apkt-spacing-3) * 2);
  }

  .token-display {
    padding: var(--apkt-spacing-3) var(--apkt-spacing-3);
    border-radius: var(--apkt-borderRadius-5);
    background-color: var(--apkt-tokens-theme-backgroundPrimary);
    margin-top: var(--apkt-spacing-3);
    margin-bottom: var(--apkt-spacing-3);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--apkt-spacing-2);
  }

  .left-image-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 40px;
    height: 40px;
  }

  .chain-image {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[8]};
    border-top-left-radius: ${({borderRadius:e})=>e[8]};
  }
`,R=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},z=class extends S{constructor(){super(),this.unsubscribe=[],this.amount=L.state.amount,this.namespace=void 0,this.paymentAsset=L.state.paymentAsset,this.activeConnectorIds=s.state.activeConnectorIds,this.caipAddress=void 0,this.exchanges=L.state.exchanges,this.isLoading=L.state.isLoading,this.initializeNamespace(),this.unsubscribe.push(L.subscribeKey(`amount`,e=>this.amount=e)),this.unsubscribe.push(s.subscribeKey(`activeConnectorIds`,e=>this.activeConnectorIds=e)),this.unsubscribe.push(L.subscribeKey(`exchanges`,e=>this.exchanges=e)),this.unsubscribe.push(L.subscribeKey(`isLoading`,e=>this.isLoading=e)),L.fetchExchanges(),L.setSelectedExchange(void 0)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return _`
      <wui-flex flexDirection="column">
        ${this.paymentDetailsTemplate()} ${this.paymentMethodsTemplate()}
      </wui-flex>
    `}paymentMethodsTemplate(){return _`
      <wui-flex flexDirection="column" padding="3" gap="2" class="payment-methods-container">
        ${this.payWithWalletTemplate()} ${this.templateSeparator()}
        ${this.templateExchangeOptions()}
      </wui-flex>
    `}initializeNamespace(){let e=m.state.activeChain;this.namespace=e,this.caipAddress=m.getAccountData(e)?.caipAddress,this.unsubscribe.push(m.subscribeChainProp(`accountState`,e=>{this.caipAddress=e?.caipAddress},e))}paymentDetailsTemplate(){let e=m.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.paymentAsset.network);return _`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        .padding=${[`6`,`8`,`6`,`8`]}
        gap="2"
      >
        <wui-flex alignItems="center" gap="1">
          <wui-text variant="h1-regular" color="primary">
            ${P(this.amount||`0`)}
          </wui-text>

          <wui-flex flexDirection="column">
            <wui-text variant="h6-regular" color="secondary">
              ${this.paymentAsset.metadata.symbol||`Unknown`}
            </wui-text>
            <wui-text variant="md-medium" color="secondary"
              >on ${e?.name||`Unknown`}</wui-text
            >
          </wui-flex>
        </wui-flex>

        <wui-flex class="left-image-container">
          <wui-image
            src=${w(this.paymentAsset.metadata.logoURI)}
            class="token-image"
          ></wui-image>
          <wui-image
            src=${w(a.getNetworkImage(e))}
            class="chain-image"
          ></wui-image>
        </wui-flex>
      </wui-flex>
    `}payWithWalletTemplate(){return Ne(this.paymentAsset.network)?this.caipAddress?this.connectedWalletTemplate():this.disconnectedWalletTemplate():_``}connectedWalletTemplate(){let{name:e,image:t}=this.getWalletProperties({namespace:this.namespace});return _`
      <wui-flex flexDirection="column" gap="3">
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${this.onWalletPayment}
          .boxed=${!1}
          ?chevron=${!0}
          ?fullSize=${!1}
          ?rounded=${!0}
          data-testid="wallet-payment-option"
          imageSrc=${w(t)}
          imageSize="3xl"
        >
          <wui-text variant="lg-regular" color="primary">Pay with ${e}</wui-text>
        </wui-list-item>

        <wui-list-item
          type="secondary"
          icon="power"
          iconColor="error"
          @click=${this.onDisconnect}
          data-testid="disconnect-button"
          ?chevron=${!1}
          boxColor="foregroundSecondary"
        >
          <wui-text variant="lg-regular" color="secondary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>
    `}disconnectedWalletTemplate(){return _`<wui-list-item
      type="secondary"
      boxColor="foregroundSecondary"
      variant="icon"
      iconColor="default"
      iconVariant="overlay"
      icon="wallet"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="lg-regular" color="primary">Pay with wallet</wui-text>
    </wui-list-item>`}templateExchangeOptions(){if(this.isLoading)return _`<wui-flex justifyContent="center" alignItems="center">
        <wui-loading-spinner size="md"></wui-loading-spinner>
      </wui-flex>`;let e=this.exchanges.filter(e=>Ie(this.paymentAsset)?e.id===pe:e.id!==pe);return e.length===0?_`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="md-medium" color="primary">No exchanges available</wui-text>
      </wui-flex>`:e.map(e=>_`
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${()=>this.onExchangePayment(e)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          imageSrc=${w(e.imageUrl)}
        >
          <wui-text flexGrow="1" variant="lg-regular" color="primary">
            Pay with ${e.name}
          </wui-text>
        </wui-list-item>
      `)}templateSeparator(){return _`<wui-separator text="or" bgColor="secondary"></wui-separator>`}async onWalletPayment(){if(!this.namespace)throw Error(`Namespace not found`);this.caipAddress?g.push(`PayQuote`):(await s.connect(),await h.open({view:`PayQuote`}))}onExchangePayment(e){L.setSelectedExchange(e),g.push(`PayQuote`)}async onDisconnect(){try{await f.disconnect(),await h.open({view:`Pay`})}catch{console.error(`Failed to disconnect`),t.showError(`Failed to disconnect`)}}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};let n=s.getConnector({id:t,namespace:e});if(!n)return{name:void 0,image:void 0};let r=a.getConnectorImage(n);return{name:n.name,image:r}}};z.styles=Be,R([b()],z.prototype,`amount`,void 0),R([b()],z.prototype,`namespace`,void 0),R([b()],z.prototype,`paymentAsset`,void 0),R([b()],z.prototype,`activeConnectorIds`,void 0),R([b()],z.prototype,`caipAddress`,void 0),R([b()],z.prototype,`exchanges`,void 0),R([b()],z.prototype,`isLoading`,void 0),z=R([v(`w3m-pay-view`)],z);var Ve=y`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-container {
    position: relative;
    width: var(--pulse-size);
    height: var(--pulse-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-rings {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .pulse-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid var(--pulse-color);
    opacity: 0;
    animation: pulse var(--pulse-duration, 2s) ease-out infinite;
  }

  .pulse-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.5);
      opacity: var(--pulse-opacity, 0.3);
    }
    50% {
      opacity: calc(var(--pulse-opacity, 0.3) * 0.5);
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`,B=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},He=3,Ue=2,We=.3,Ge=`200px`,Ke={"accent-primary":ae.tokens.core.backgroundAccentPrimary},V=class extends S{constructor(){super(...arguments),this.rings=He,this.duration=Ue,this.opacity=We,this.size=Ge,this.variant=`accent-primary`}render(){let e=Ke[this.variant];return this.style.cssText=`
      --pulse-size: ${this.size};
      --pulse-duration: ${this.duration}s;
      --pulse-color: ${e};
      --pulse-opacity: ${this.opacity};
    `,_`
      <div class="pulse-container">
        <div class="pulse-rings">${Array.from({length:this.rings},(e,t)=>this.renderRing(t,this.rings))}</div>
        <div class="pulse-content">
          <slot></slot>
        </div>
      </div>
    `}renderRing(e,t){return _`<div class="pulse-ring" style=${`animation-delay: ${e/t*this.duration}s;`}></div>`}};V.styles=[se,Ve],B([x({type:Number})],V.prototype,`rings`,void 0),B([x({type:Number})],V.prototype,`duration`,void 0),B([x({type:Number})],V.prototype,`opacity`,void 0),B([x()],V.prototype,`size`,void 0),B([x()],V.prototype,`variant`,void 0),V=B([v(`wui-pulse`)],V);var qe=[{id:`received`,title:`Receiving funds`,icon:`dollar`},{id:`processing`,title:`Swapping asset`,icon:`recycleHorizontal`},{id:`sending`,title:`Sending asset to the recipient address`,icon:`send`}],Je=[`success`,`submitted`,`failure`,`timeout`,`refund`],Ye=y`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  .token-badge-container {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${({borderRadius:e})=>e[4]};
    z-index: 3;
    min-width: 105px;
  }

  .token-badge-container.loading {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-badge-container.success {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-image-container {
    position: relative;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 64px;
    height: 64px;
  }

  .token-image.success {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.error {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.loading {
    background: ${({colors:e})=>e.accent010};
  }

  .token-image wui-icon {
    width: 32px;
    height: 32px;
  }

  .token-badge {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  .token-badge wui-text {
    white-space: nowrap;
  }

  .payment-lifecycle-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[6]};
    border-top-left-radius: ${({borderRadius:e})=>e[6]};
  }

  .payment-step-badge {
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  .payment-step-badge.loading {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .payment-step-badge.error {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  .payment-step-badge.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  .step-icon-container {
    position: relative;
    height: 40px;
    width: 40px;
    border-radius: ${({borderRadius:e})=>e.round};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .step-icon-box {
    position: absolute;
    right: -4px;
    bottom: -1px;
    padding: 2px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .step-icon-box.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }
`,H=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Xe={received:[`pending`,`success`,`submitted`],processing:[`success`,`submitted`],sending:[`success`,`submitted`]},Ze=3e3,U=class extends S{constructor(){super(),this.unsubscribe=[],this.pollingInterval=null,this.paymentAsset=L.state.paymentAsset,this.quoteStatus=L.state.quoteStatus,this.quote=L.state.quote,this.amount=L.state.amount,this.namespace=void 0,this.caipAddress=void 0,this.profileName=null,this.activeConnectorIds=s.state.activeConnectorIds,this.selectedExchange=L.state.selectedExchange,this.initializeNamespace(),this.unsubscribe.push(L.subscribeKey(`quoteStatus`,e=>this.quoteStatus=e),L.subscribeKey(`quote`,e=>this.quote=e),s.subscribeKey(`activeConnectorIds`,e=>this.activeConnectorIds=e),L.subscribeKey(`selectedExchange`,e=>this.selectedExchange=e))}connectedCallback(){super.connectedCallback(),this.startPolling()}disconnectedCallback(){super.disconnectedCallback(),this.stopPolling(),this.unsubscribe.forEach(e=>e())}render(){return _`
      <wui-flex flexDirection="column" .padding=${[`3`,`0`,`0`,`0`]} gap="2">
        ${this.tokenTemplate()} ${this.paymentTemplate()} ${this.paymentLifecycleTemplate()}
      </wui-flex>
    `}tokenTemplate(){let e=P(this.amount||`0`),t=this.paymentAsset.metadata.symbol??`Unknown`,n=m.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.paymentAsset.network),r=this.quoteStatus===`failure`||this.quoteStatus===`timeout`||this.quoteStatus===`refund`;return this.quoteStatus===`success`||this.quoteStatus===`submitted`?_`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image success">
          <wui-icon name="checkmark" color="success" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:r?_`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image error">
          <wui-icon name="close" color="error" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:_`
      <wui-flex alignItems="center" justifyContent="center">
        <wui-flex class="token-image-container">
          <wui-pulse size="125px" rings="3" duration="4" opacity="0.5" variant="accent-primary">
            <wui-flex justifyContent="center" alignItems="center" class="token-image loading">
              <wui-icon name="paperPlaneTitle" color="accent-primary" size="inherit"></wui-icon>
            </wui-flex>
          </wui-pulse>

          <wui-flex
            justifyContent="center"
            alignItems="center"
            class="token-badge-container loading"
          >
            <wui-flex
              alignItems="center"
              justifyContent="center"
              gap="01"
              padding="1"
              class="token-badge"
            >
              <wui-image
                src=${w(a.getNetworkImage(n))}
                class="chain-image"
                size="mdl"
              ></wui-image>

              <wui-text variant="lg-regular" color="primary">${e} ${t}</wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}paymentTemplate(){return _`
      <wui-flex flexDirection="column" gap="2" .padding=${[`0`,`6`,`0`,`6`]}>
        ${this.renderPayment()}
        <wui-separator></wui-separator>
        ${this.renderWallet()}
      </wui-flex>
    `}paymentLifecycleTemplate(){let e=this.getStepsWithStatus();return _`
      <wui-flex flexDirection="column" padding="4" gap="2" class="payment-lifecycle-container">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">PAYMENT CYCLE</wui-text>

          ${this.renderPaymentCycleBadge()}
        </wui-flex>

        <wui-flex flexDirection="column" gap="5" .padding=${[`2`,`0`,`2`,`0`]}>
          ${e.map(e=>this.renderStep(e))}
        </wui-flex>
      </wui-flex>
    `}renderPaymentCycleBadge(){let e=this.quoteStatus===`failure`||this.quoteStatus===`timeout`||this.quoteStatus===`refund`,t=this.quoteStatus===`success`||this.quoteStatus===`submitted`;return e?_`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge error"
          gap="1"
        >
          <wui-icon name="close" color="error" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="error">Failed</wui-text>
        </wui-flex>
      `:t?_`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge success"
          gap="1"
        >
          <wui-icon name="checkmark" color="success" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="success">Completed</wui-text>
        </wui-flex>
      `:_`
      <wui-flex alignItems="center" justifyContent="space-between" gap="3">
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge loading"
          gap="1"
        >
          <wui-icon name="clock" color="default" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="primary">Est. ${this.quote?.timeInSeconds??0} sec</wui-text>
        </wui-flex>

        <wui-icon name="chevronBottom" color="default" size="xxs"></wui-icon>
      </wui-flex>
    `}renderPayment(){let e=m.getAllRequestedCaipNetworks().find(e=>{let t=this.quote?.origin.currency.network;if(!t)return!1;let{chainId:n}=o.parseCaipNetworkId(t);return C.isLowerCaseMatch(e.id.toString(),n.toString())});return _`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${[`3`,`0`,`3`,`0`]}
      >
        <wui-text variant="lg-regular" color="secondary">Payment Method</wui-text>

        <wui-flex flexDirection="column" alignItems="flex-end" gap="1">
          <wui-flex alignItems="center" gap="01">
            <wui-text variant="lg-regular" color="primary">${P(l.formatNumber(this.quote?.origin.amount||`0`,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString())}</wui-text>
            <wui-text variant="lg-regular" color="secondary">${this.quote?.origin.currency.metadata.symbol??`Unknown`}</wui-text>
          </wui-flex>

          <wui-flex alignItems="center" gap="1">
            <wui-text variant="md-regular" color="secondary">on</wui-text>
            <wui-image
              src=${w(a.getNetworkImage(e))}
              size="xs"
            ></wui-image>
            <wui-text variant="md-regular" color="secondary">${e?.name}</wui-text>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderWallet(){return _`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${[`3`,`0`,`3`,`0`]}
      >
        <wui-text variant="lg-regular" color="secondary"
          >${this.selectedExchange?`Exchange`:`Wallet`}</wui-text
        >

        ${this.renderWalletText()}
      </wui-flex>
    `}renderWalletText(){let{image:e}=this.getWalletProperties({namespace:this.namespace}),{address:t}=this.caipAddress?o.parseCaipAddress(this.caipAddress):{},n=this.selectedExchange?.name;return this.selectedExchange?_`
        <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
          <wui-text variant="lg-regular" color="primary">${n}</wui-text>
          <wui-image src=${w(this.selectedExchange.imageUrl)} size="mdl"></wui-image>
        </wui-flex>
      `:_`
      <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
        <wui-text variant="lg-regular" color="primary">
          ${le.getTruncateString({string:this.profileName||t||n||``,charsStart:this.profileName?16:4,charsEnd:this.profileName?0:6,truncate:this.profileName?`end`:`middle`})}
        </wui-text>

        <wui-image src=${w(e)} size="mdl"></wui-image>
      </wui-flex>
    `}getStepsWithStatus(){return this.quoteStatus===`failure`||this.quoteStatus===`timeout`||this.quoteStatus===`refund`?qe.map(e=>({...e,status:`failed`})):qe.map(e=>{let t=(Xe[e.id]??[]).includes(this.quoteStatus)?`completed`:`pending`;return{...e,status:t}})}renderStep({title:e,icon:t,status:n}){return _`
      <wui-flex alignItems="center" gap="3">
        <wui-flex justifyContent="center" alignItems="center" class="step-icon-container">
          <wui-icon name=${t} color="default" size="mdl"></wui-icon>

          <wui-flex alignItems="center" justifyContent="center" class=${ce({"step-icon-box":!0,success:n===`completed`})}>
            ${this.renderStatusIndicator(n)}
          </wui-flex>
        </wui-flex>

        <wui-text variant="md-regular" color="primary">${e}</wui-text>
      </wui-flex>
    `}renderStatusIndicator(e){return e===`completed`?_`<wui-icon size="sm" color="success" name="checkmark"></wui-icon>`:e===`failed`?_`<wui-icon size="sm" color="error" name="close"></wui-icon>`:e===`pending`?_`<wui-loading-spinner color="accent-primary" size="sm"></wui-loading-spinner>`:null}startPolling(){this.pollingInterval||=(this.fetchQuoteStatus(),setInterval(()=>{this.fetchQuoteStatus()},Ze))}stopPolling(){this.pollingInterval&&=(clearInterval(this.pollingInterval),null)}async fetchQuoteStatus(){let e=L.state.requestId;if(!e||Je.includes(this.quoteStatus))this.stopPolling();else try{await L.fetchQuoteStatus({requestId:e}),Je.includes(this.quoteStatus)&&this.stopPolling()}catch{this.stopPolling()}}initializeNamespace(){let e=m.state.activeChain;this.namespace=e,this.caipAddress=m.getAccountData(e)?.caipAddress,this.profileName=m.getAccountData(e)?.profileName??null,this.unsubscribe.push(m.subscribeChainProp(`accountState`,e=>{this.caipAddress=e?.caipAddress,this.profileName=e?.profileName??null},e))}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};let n=s.getConnector({id:t,namespace:e});if(!n)return{name:void 0,image:void 0};let r=a.getConnectorImage(n);return{name:n.name,image:r}}};U.styles=Ye,H([b()],U.prototype,`paymentAsset`,void 0),H([b()],U.prototype,`quoteStatus`,void 0),H([b()],U.prototype,`quote`,void 0),H([b()],U.prototype,`amount`,void 0),H([b()],U.prototype,`namespace`,void 0),H([b()],U.prototype,`caipAddress`,void 0),H([b()],U.prototype,`profileName`,void 0),H([b()],U.prototype,`activeConnectorIds`,void 0),H([b()],U.prototype,`selectedExchange`,void 0),U=H([v(`w3m-pay-loading-view`)],U);var Qe=ie`
  :host {
    display: block;
  }
`,$e=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},W=class extends S{render(){return _`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-shimmer width="60px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Network Fee</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-shimmer
              width="75px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>

            <wui-flex alignItems="center" gap="01">
              <wui-shimmer width="14px" height="14px" rounded variant="light"></wui-shimmer>
              <wui-shimmer
                width="49px"
                height="14px"
                borderRadius="4xs"
                variant="light"
              ></wui-shimmer>
            </wui-flex>
          </wui-flex>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Service Fee</wui-text>
          <wui-shimmer width="75px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>
      </wui-flex>
    `}};W.styles=[Qe],W=$e([v(`w3m-pay-fees-skeleton`)],W);var et=y`
  :host {
    display: block;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }
`,tt=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},G=class extends S{constructor(){super(),this.unsubscribe=[],this.quote=L.state.quote,this.unsubscribe.push(L.subscribeKey(`quote`,e=>this.quote=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return _`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-text variant="md-regular" color="primary">
            ${l.formatNumber(this.quote?.origin.amount||`0`,{decimals:this.quote?.origin.currency.metadata.decimals??0,round:6}).toString()} ${this.quote?.origin.currency.metadata.symbol||`Unknown`}
          </wui-text>
        </wui-flex>

        ${this.quote&&this.quote.fees.length>0?this.quote.fees.map(e=>this.renderFee(e)):null}
      </wui-flex>
    `}renderFee(e){let t=e.id===`network`,n=l.formatNumber(e.amount||`0`,{decimals:e.currency.metadata.decimals??0,round:6}).toString();if(t){let t=m.getAllRequestedCaipNetworks().find(t=>C.isLowerCaseMatch(t.caipNetworkId,e.currency.network));return _`
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">${e.label}</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-text variant="md-regular" color="primary">
              ${n} ${e.currency.metadata.symbol||`Unknown`}
            </wui-text>

            <wui-flex alignItems="center" gap="01">
              <wui-image
                src=${w(a.getNetworkImage(t))}
                size="xs"
              ></wui-image>
              <wui-text variant="sm-regular" color="secondary">
                ${t?.name||`Unknown`}
              </wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      `}return _`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-text variant="md-regular" color="secondary">${e.label}</wui-text>
        <wui-text variant="md-regular" color="primary">
          ${n} ${e.currency.metadata.symbol||`Unknown`}
        </wui-text>
      </wui-flex>
    `}};G.styles=[et],tt([b()],G.prototype,`quote`,void 0),G=tt([v(`w3m-pay-fees`)],G);var nt=y`
  :host {
    display: block;
    width: 100%;
  }

  .disabled-container {
    padding: ${({spacing:e})=>e[2]};
    min-height: 168px;
  }

  wui-icon {
    width: ${({spacing:e})=>e[8]};
    height: ${({spacing:e})=>e[8]};
  }

  wui-flex > wui-text {
    max-width: 273px;
  }
`,rt=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},K=class extends S{constructor(){super(),this.unsubscribe=[],this.selectedExchange=L.state.selectedExchange,this.unsubscribe.push(L.subscribeKey(`selectedExchange`,e=>this.selectedExchange=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return _`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
        class="disabled-container"
      >
        <wui-icon name="coins" color="default" size="inherit"></wui-icon>

        <wui-text variant="md-regular" color="primary" align="center">
          You don't have enough funds to complete this transaction
        </wui-text>

        ${this.selectedExchange?null:_`<wui-button
              size="md"
              variant="neutral-secondary"
              @click=${this.dispatchConnectOtherWalletEvent.bind(this)}
              >Connect other wallet</wui-button
            >`}
      </wui-flex>
    `}dispatchConnectOtherWalletEvent(){this.dispatchEvent(new CustomEvent(`connectOtherWallet`,{detail:!0,bubbles:!0,composed:!0}))}};K.styles=[nt],rt([x({type:Array})],K.prototype,`selectedExchange`,void 0),K=rt([v(`w3m-pay-options-empty`)],K);var it=y`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    min-height: 60px;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    bottom: -3px;
    right: -5px;
    border: 2px solid ${({tokens:e})=>e.theme.foregroundSecondary};
  }
`,at=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},q=class extends S{render(){return _`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.renderOptionEntry()} ${this.renderOptionEntry()} ${this.renderOptionEntry()}
      </wui-flex>
    `}renderOptionEntry(){return _`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-shimmer
              width="32px"
              height="32px"
              rounded
              variant="light"
              class="token-image"
            ></wui-shimmer>
            <wui-shimmer
              width="16px"
              height="16px"
              rounded
              variant="light"
              class="chain-image"
            ></wui-shimmer>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-shimmer
              width="74px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
            <wui-shimmer
              width="46px"
              height="14px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}};q.styles=[it],q=at([v(`w3m-pay-options-skeleton`)],q);var ot=y`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    mask-image: var(--options-mask-image);
    -webkit-mask-image: var(--options-mask-image);
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    cursor: pointer;
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-1`]};
    will-change: background-color;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 32px;
    height: 32px;
  }

  .chain-image {
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  @media (hover: hover) and (pointer: fine) {
    .pay-option-container:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`,J=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},st=300,Y=class extends S{constructor(){super(),this.unsubscribe=[],this.options=[],this.selectedPaymentAsset=null}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.resizeObserver?.disconnect(),(this.shadowRoot?.querySelector(`.pay-options-container`))?.removeEventListener(`scroll`,this.handleOptionsListScroll.bind(this))}firstUpdated(){let e=this.shadowRoot?.querySelector(`.pay-options-container`);e&&(requestAnimationFrame(this.handleOptionsListScroll.bind(this)),e?.addEventListener(`scroll`,this.handleOptionsListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleOptionsListScroll()}),this.resizeObserver?.observe(e),this.handleOptionsListScroll())}render(){return _`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.options.map(e=>this.payOptionTemplate(e))}
      </wui-flex>
    `}payOptionTemplate(e){let{network:t,metadata:n,asset:r,amount:i=`0`}=e,o=m.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===t),s=`${t}:${r}`==`${this.selectedPaymentAsset?.network}:${this.selectedPaymentAsset?.asset}`,c=l.bigNumber(i,{safe:!0}),u=c.gt(0);return _`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        @click=${()=>this.onSelect?.(e)}
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-image
              src=${w(n.logoURI)}
              class="token-image"
              size="3xl"
            ></wui-image>
            <wui-image
              src=${w(a.getNetworkImage(o))}
              class="chain-image"
              size="md"
            ></wui-image>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="lg-regular" color="primary">${n.symbol}</wui-text>
            ${u?_`<wui-text variant="sm-regular" color="secondary">
                  ${c.round(6).toString()} ${n.symbol}
                </wui-text>`:null}
          </wui-flex>
        </wui-flex>

        ${s?_`<wui-icon name="checkmark" size="md" color="success"></wui-icon>`:null}
      </wui-flex>
    `}handleOptionsListScroll(){let e=this.shadowRoot?.querySelector(`.pay-options-container`);e&&(e.scrollHeight>st?(e.style.setProperty(`--options-mask-image`,`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--options-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--options-scroll--top-opacity))) 1px,
          black 50px,
          black calc(100% - 50px),
          rgba(155, 155, 155, calc(1 - var(--options-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--options-scroll--bottom-opacity))) 100%
        )`),e.style.setProperty(`--options-scroll--top-opacity`,ue.interpolate([0,50],[0,1],e.scrollTop).toString()),e.style.setProperty(`--options-scroll--bottom-opacity`,ue.interpolate([0,50],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString())):(e.style.setProperty(`--options-mask-image`,`none`),e.style.setProperty(`--options-scroll--top-opacity`,`0`),e.style.setProperty(`--options-scroll--bottom-opacity`,`0`)))}};Y.styles=[ot],J([x({type:Array})],Y.prototype,`options`,void 0),J([x()],Y.prototype,`selectedPaymentAsset`,void 0),J([x()],Y.prototype,`onSelect`,void 0),Y=J([v(`w3m-pay-options`)],Y);var ct=y`
  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[5]};
    border-top-left-radius: ${({borderRadius:e})=>e[5]};
  }

  .pay-options-container {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding: ${({spacing:e})=>e[1]};
  }

  w3m-tooltip-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: fit-content;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  w3m-pay-options.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`,X=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Z={eip155:`ethereum`,solana:`solana`,bip122:`bitcoin`,ton:`ton`},lt={eip155:{icon:Z.eip155,label:`EVM`},solana:{icon:Z.solana,label:`Solana`},bip122:{icon:Z.bip122,label:`Bitcoin`},ton:{icon:Z.ton,label:`Ton`}},Q=class extends S{constructor(){super(),this.unsubscribe=[],this.profileName=null,this.paymentAsset=L.state.paymentAsset,this.namespace=void 0,this.caipAddress=void 0,this.amount=L.state.amount,this.recipient=L.state.recipient,this.activeConnectorIds=s.state.activeConnectorIds,this.selectedPaymentAsset=L.state.selectedPaymentAsset,this.selectedExchange=L.state.selectedExchange,this.isFetchingQuote=L.state.isFetchingQuote,this.quoteError=L.state.quoteError,this.quote=L.state.quote,this.isFetchingTokenBalances=L.state.isFetchingTokenBalances,this.tokenBalances=L.state.tokenBalances,this.isPaymentInProgress=L.state.isPaymentInProgress,this.exchangeUrlForQuote=L.state.exchangeUrlForQuote,this.completedTransactionsCount=0,this.unsubscribe.push(L.subscribeKey(`paymentAsset`,e=>this.paymentAsset=e)),this.unsubscribe.push(L.subscribeKey(`tokenBalances`,e=>this.onTokenBalancesChanged(e))),this.unsubscribe.push(L.subscribeKey(`isFetchingTokenBalances`,e=>this.isFetchingTokenBalances=e)),this.unsubscribe.push(s.subscribeKey(`activeConnectorIds`,e=>this.activeConnectorIds=e)),this.unsubscribe.push(L.subscribeKey(`selectedPaymentAsset`,e=>this.selectedPaymentAsset=e)),this.unsubscribe.push(L.subscribeKey(`isFetchingQuote`,e=>this.isFetchingQuote=e)),this.unsubscribe.push(L.subscribeKey(`quoteError`,e=>this.quoteError=e)),this.unsubscribe.push(L.subscribeKey(`quote`,e=>this.quote=e)),this.unsubscribe.push(L.subscribeKey(`amount`,e=>this.amount=e)),this.unsubscribe.push(L.subscribeKey(`recipient`,e=>this.recipient=e)),this.unsubscribe.push(L.subscribeKey(`isPaymentInProgress`,e=>this.isPaymentInProgress=e)),this.unsubscribe.push(L.subscribeKey(`selectedExchange`,e=>this.selectedExchange=e)),this.unsubscribe.push(L.subscribeKey(`exchangeUrlForQuote`,e=>this.exchangeUrlForQuote=e)),this.resetQuoteState(),this.initializeNamespace(),this.fetchTokens()}disconnectedCallback(){super.disconnectedCallback(),this.resetAssetsState(),this.unsubscribe.forEach(e=>e())}updated(e){super.updated(e),e.has(`selectedPaymentAsset`)&&this.fetchQuote()}render(){return _`
      <wui-flex flexDirection="column">
        ${this.profileTemplate()}

        <wui-flex
          flexDirection="column"
          gap="4"
          class="payment-methods-container"
          .padding=${[`4`,`4`,`5`,`4`]}
        >
          ${this.paymentOptionsViewTemplate()} ${this.amountWithFeeTemplate()}

          <wui-flex
            alignItems="center"
            justifyContent="space-between"
            .padding=${[`1`,`0`,`1`,`0`]}
          >
            <wui-separator></wui-separator>
          </wui-flex>

          ${this.paymentActionsTemplate()}
        </wui-flex>
      </wui-flex>
    `}profileTemplate(){if(this.selectedExchange){let e=l.formatNumber(this.quote?.origin.amount,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return _`
        <wui-flex
          .padding=${[`4`,`3`,`4`,`3`]}
          alignItems="center"
          justifyContent="space-between"
          gap="2"
        >
          <wui-text variant="lg-regular" color="secondary">Paying with</wui-text>

          ${this.quote?_`<wui-text variant="lg-regular" color="primary">
                ${l.bigNumber(e,{safe:!0}).round(6).toString()}
                ${this.quote.origin.currency.metadata.symbol}
              </wui-text>`:_`<wui-shimmer width="80px" height="18px" variant="light"></wui-shimmer>`}
        </wui-flex>
      `}let e=n.getPlainAddress(this.caipAddress)??``,{name:t,image:r}=this.getWalletProperties({namespace:this.namespace}),{icon:i,label:a}=lt[this.namespace]??{};return _`
      <wui-flex
        .padding=${[`4`,`3`,`4`,`3`]}
        alignItems="center"
        justifyContent="space-between"
        gap="2"
      >
        <wui-wallet-switch
          profileName=${w(this.profileName)}
          address=${w(e)}
          imageSrc=${w(r)}
          alt=${w(t)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        <wui-wallet-switch
          profileName=${w(a)}
          address=${w(e)}
          icon=${w(i)}
          iconSize="xs"
          .enableGreenCircle=${!1}
          alt=${w(a)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
      </wui-flex>
    `}initializeNamespace(){let e=m.state.activeChain;this.namespace=e,this.caipAddress=m.getAccountData(e)?.caipAddress,this.profileName=m.getAccountData(e)?.profileName??null,this.unsubscribe.push(m.subscribeChainProp(`accountState`,e=>this.onAccountStateChanged(e),e))}async fetchTokens(){if(this.namespace){let e;if(this.caipAddress){let{chainId:t,chainNamespace:n}=o.parseCaipAddress(this.caipAddress),r=`${n}:${t}`;e=m.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===r)}await L.fetchTokens({caipAddress:this.caipAddress,caipNetwork:e,namespace:this.namespace})}}fetchQuote(){if(this.amount&&this.recipient&&this.selectedPaymentAsset&&this.paymentAsset){let{address:e}=this.caipAddress?o.parseCaipAddress(this.caipAddress):{};L.fetchQuote({amount:this.amount.toString(),address:e,sourceToken:this.selectedPaymentAsset,toToken:this.paymentAsset,recipient:this.recipient})}}getWalletProperties({namespace:e}){if(!e)return{name:void 0,image:void 0};let t=this.activeConnectorIds[e];if(!t)return{name:void 0,image:void 0};let n=s.getConnector({id:t,namespace:e});if(!n)return{name:void 0,image:void 0};let r=a.getConnectorImage(n);return{name:n.name,image:r}}paymentOptionsViewTemplate(){return _`
      <wui-flex flexDirection="column" gap="2">
        <wui-text variant="sm-regular" color="secondary">CHOOSE PAYMENT OPTION</wui-text>
        <wui-flex class="pay-options-container">${this.paymentOptionsTemplate()}</wui-flex>
      </wui-flex>
    `}paymentOptionsTemplate(){let e=this.getPaymentAssetFromTokenBalances();return this.isFetchingTokenBalances?_`<w3m-pay-options-skeleton></w3m-pay-options-skeleton>`:e.length===0?_`<w3m-pay-options-empty
        @connectOtherWallet=${this.onConnectOtherWallet.bind(this)}
      ></w3m-pay-options-empty>`:_`<w3m-pay-options
      class=${ce({disabled:this.isFetchingQuote})}
      .options=${e}
      .selectedPaymentAsset=${w(this.selectedPaymentAsset)}
      .onSelect=${this.onSelectedPaymentAssetChanged.bind(this)}
    ></w3m-pay-options>`}amountWithFeeTemplate(){return this.isFetchingQuote||!this.selectedPaymentAsset||this.quoteError?_`<w3m-pay-fees-skeleton></w3m-pay-fees-skeleton>`:_`<w3m-pay-fees></w3m-pay-fees>`}paymentActionsTemplate(){let e=this.isFetchingQuote||this.isFetchingTokenBalances,t=this.isFetchingQuote||this.isFetchingTokenBalances||!this.selectedPaymentAsset||!!this.quoteError,n=l.formatNumber(this.quote?.origin.amount??0,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return this.selectedExchange?e||t?_`
          <wui-shimmer width="100%" height="48px" variant="light" ?rounded=${!0}></wui-shimmer>
        `:_`<wui-button
        size="lg"
        fullWidth
        variant="accent-secondary"
        @click=${this.onPayWithExchange.bind(this)}
      >
        ${`Continue in ${this.selectedExchange.name}`}

        <wui-icon name="arrowRight" color="inherit" size="sm" slot="iconRight"></wui-icon>
      </wui-button>`:_`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="md-regular" color="secondary">Order Total</wui-text>

          ${e||t?_`<wui-shimmer width="58px" height="32px" variant="light"></wui-shimmer>`:_`<wui-flex alignItems="center" gap="01">
                <wui-text variant="h4-regular" color="primary">${P(n)}</wui-text>

                <wui-text variant="lg-regular" color="secondary">
                  ${this.quote?.origin.currency.metadata.symbol||`Unknown`}
                </wui-text>
              </wui-flex>`}
        </wui-flex>

        ${this.actionButtonTemplate({isLoading:e,isDisabled:t})}
      </wui-flex>
    `}actionButtonTemplate(e){let t=j(this.quote),{isLoading:n,isDisabled:r}=e,i=`Pay`;return t.length>1&&this.completedTransactionsCount===0&&(i=`Approve`),_`
      <wui-button
        size="lg"
        variant="accent-primary"
        ?loading=${n||this.isPaymentInProgress}
        ?disabled=${r||this.isPaymentInProgress}
        @click=${()=>{t.length>0?this.onSendTransactions():this.onTransfer()}}
      >
        ${i}
        ${n?null:_`<wui-icon
              name="arrowRight"
              color="inherit"
              size="sm"
              slot="iconRight"
            ></wui-icon>`}
      </wui-button>
    `}getPaymentAssetFromTokenBalances(){return this.namespace?(this.tokenBalances[this.namespace]??[]).map(e=>{try{return Pe(e)}catch{return null}}).filter(e=>!!e).filter(e=>{let{chainId:t}=o.parseCaipNetworkId(e.network),{chainId:n}=o.parseCaipNetworkId(this.paymentAsset.network);return C.isLowerCaseMatch(e.asset,this.paymentAsset.asset)?!0:this.selectedExchange?!C.isLowerCaseMatch(t.toString(),n.toString()):!0}):[]}onTokenBalancesChanged(e){this.tokenBalances=e;let[t]=this.getPaymentAssetFromTokenBalances();t&&L.setSelectedPaymentAsset(t)}async onConnectOtherWallet(){await s.connect(),await h.open({view:`PayQuote`})}onAccountStateChanged(e){let{address:t}=this.caipAddress?o.parseCaipAddress(this.caipAddress):{};if(this.caipAddress=e?.caipAddress,this.profileName=e?.profileName??null,t){let{address:e}=this.caipAddress?o.parseCaipAddress(this.caipAddress):{};e?C.isLowerCaseMatch(e,t)||(this.resetAssetsState(),this.resetQuoteState(),this.fetchTokens()):h.close()}}onSelectedPaymentAssetChanged(e){this.isFetchingQuote||L.setSelectedPaymentAsset(e)}async onTransfer(){let e=A(this.quote);if(e){if(!C.isLowerCaseMatch(this.selectedPaymentAsset?.asset,e.deposit.currency))throw Error(`Quote asset is not the same as the selected payment asset`);let n=this.selectedPaymentAsset?.amount??`0`,r=l.formatNumber(e.deposit.amount,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!l.bigNumber(n).gte(r)){t.showError(`Insufficient funds`);return}if(this.quote&&this.selectedPaymentAsset&&this.caipAddress&&this.namespace){let{address:t}=o.parseCaipAddress(this.caipAddress);await L.onTransfer({chainNamespace:this.namespace,fromAddress:t,toAddress:e.deposit.receiver,amount:r,paymentAsset:this.selectedPaymentAsset}),L.setRequestId(e.requestId),g.push(`PayLoading`)}}}async onSendTransactions(){let e=this.selectedPaymentAsset?.amount??`0`,n=l.formatNumber(this.quote?.origin.amount??0,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!l.bigNumber(e).gte(n)){t.showError(`Insufficient funds`);return}let r=j(this.quote),[i]=j(this.quote,this.completedTransactionsCount);i&&this.namespace&&(await L.onSendTransaction({namespace:this.namespace,transactionStep:i}),this.completedTransactionsCount+=1,this.completedTransactionsCount===r.length&&(L.setRequestId(i.requestId),g.push(`PayLoading`)))}onPayWithExchange(){if(this.exchangeUrlForQuote){let e=n.returnOpenHref(``,`popupWindow`,`scrollbar=yes,width=480,height=720`);if(!e)throw Error(`Could not create popup window`);e.location.href=this.exchangeUrlForQuote;let t=A(this.quote);t&&L.setRequestId(t.requestId),L.initiatePayment(),g.push(`PayLoading`)}}resetAssetsState(){L.setSelectedPaymentAsset(null)}resetQuoteState(){L.resetQuoteState()}};Q.styles=ct,X([b()],Q.prototype,`profileName`,void 0),X([b()],Q.prototype,`paymentAsset`,void 0),X([b()],Q.prototype,`namespace`,void 0),X([b()],Q.prototype,`caipAddress`,void 0),X([b()],Q.prototype,`amount`,void 0),X([b()],Q.prototype,`recipient`,void 0),X([b()],Q.prototype,`activeConnectorIds`,void 0),X([b()],Q.prototype,`selectedPaymentAsset`,void 0),X([b()],Q.prototype,`selectedExchange`,void 0),X([b()],Q.prototype,`isFetchingQuote`,void 0),X([b()],Q.prototype,`quoteError`,void 0),X([b()],Q.prototype,`quote`,void 0),X([b()],Q.prototype,`isFetchingTokenBalances`,void 0),X([b()],Q.prototype,`tokenBalances`,void 0),X([b()],Q.prototype,`isPaymentInProgress`,void 0),X([b()],Q.prototype,`exchangeUrlForQuote`,void 0),X([b()],Q.prototype,`completedTransactionsCount`,void 0),Q=X([v(`w3m-pay-quote-view`)],Q);var ut=3e5;async function dt(e){return L.handleOpenPay(e)}async function ft(e,t=ut){if(t<=0)throw new k(D.INVALID_PAYMENT_CONFIG,`Timeout must be greater than 0`);try{await dt(e)}catch(e){throw e instanceof k?e:new k(D.UNABLE_TO_INITIATE_PAYMENT,e.message)}return new Promise((e,n)=>{let r=!1,i=setTimeout(()=>{r||(r=!0,o(),n(new k(D.GENERIC_PAYMENT_ERROR,`Payment timeout`)))},t);function a(){if(r)return;let t=L.state.currentPayment,n=L.state.error,a=L.state.isPaymentInProgress;if(t?.status===`SUCCESS`){r=!0,o(),clearTimeout(i),e({success:!0,result:t.result});return}if(t?.status===`FAILED`){r=!0,o(),clearTimeout(i),e({success:!1,error:n||`Payment failed`});return}n&&!a&&!t&&(r=!0,o(),clearTimeout(i),e({success:!1,error:n}))}let o=_t([$(`currentPayment`,a),$(`error`,a),$(`isPaymentInProgress`,a)]);a()})}function pt(){return L.getExchanges()}function mt(){return L.state.currentPayment?.result}function ht(){return L.state.error}function gt(){return L.state.isPaymentInProgress}function $(e,t){return L.subscribeKey(e,t)}function _t(e){return()=>{e.forEach(e=>{try{e()}catch{}})}}var vt={network:`eip155:8453`,asset:`native`,metadata:{name:`Ethereum`,symbol:`ETH`,decimals:18}},yt={network:`eip155:8453`,asset:`0x833589fcd6edb6e08f4c7c32d4f71b54bda02913`,metadata:{name:`USD Coin`,symbol:`USDC`,decimals:6}},bt={network:`eip155:84532`,asset:`native`,metadata:{name:`Ethereum`,symbol:`ETH`,decimals:18}},xt={network:`eip155:1`,asset:`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`,metadata:{name:`USD Coin`,symbol:`USDC`,decimals:6}},St={network:`eip155:10`,asset:`0x0b2c639c533813f4aa9d7837caf62653d097ff85`,metadata:{name:`USD Coin`,symbol:`USDC`,decimals:6}},Ct={network:`eip155:42161`,asset:`0xaf88d065e77c8cC2239327C5EDb3A432268e5831`,metadata:{name:`USD Coin`,symbol:`USDC`,decimals:6}},wt={network:`eip155:137`,asset:`0x3c499c542cef5e3811e1192ce70d8cc03d5c3359`,metadata:{name:`USD Coin`,symbol:`USDC`,decimals:6}},Tt={network:`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`,asset:`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`,metadata:{name:`USD Coin`,symbol:`USDC`,decimals:6}},Et={network:`eip155:1`,asset:`0xdAC17F958D2ee523a2206206994597C13D831ec7`,metadata:{name:`Tether USD`,symbol:`USDT`,decimals:6}},Dt={network:`eip155:10`,asset:`0x94b008aA00579c1307B0EF2c499aD98a8ce58e58`,metadata:{name:`Tether USD`,symbol:`USDT`,decimals:6}},Ot={network:`eip155:42161`,asset:`0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9`,metadata:{name:`Tether USD`,symbol:`USDT`,decimals:6}},kt={network:`eip155:137`,asset:`0xc2132d05d31c914a87c6611c10748aeb04b58e8f`,metadata:{name:`Tether USD`,symbol:`USDT`,decimals:6}},At={network:`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`,asset:`Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`,metadata:{name:`Tether USD`,symbol:`USDT`,decimals:6}},jt={network:`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`,asset:`native`,metadata:{name:`Solana`,symbol:`SOL`,decimals:9}};export{z as C,U as S,ht as _,yt as a,ft as b,St as c,kt as d,jt as f,gt as g,pt as h,bt as i,Dt as l,At as m,Ot as n,xt as o,Tt as p,vt as r,Et as s,Ct as t,wt as u,mt as v,L as w,Q as x,dt as y};