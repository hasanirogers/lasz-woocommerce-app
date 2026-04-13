var vt=Object.defineProperty,yt=Object.getOwnPropertyDescriptor,d=(o,t,e,r)=>{for(var s=r>1?void 0:r?yt(t,e):t,i=o.length-1,a;i>=0;i--)(a=o[i])&&(s=(r?a(t,e,s):a(s))||s);return r&&s&&vt(t,e,s),s};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=globalThis,Z=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,J=Symbol(),tt=new WeakMap;let ut=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==J)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Z&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=tt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&tt.set(e,t))}return t}toString(){return this.cssText}};const pt=o=>new ut(typeof o=="string"?o:o+"",void 0,J),H=(o,...t)=>{const e=o.length===1?o[0]:t.reduce((r,s,i)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+o[i+1],o[0]);return new ut(e,o,J)},kt=(o,t)=>{if(Z)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=j.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,o.appendChild(r)}},et=Z?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return pt(e)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:$t,defineProperty:_t,getOwnPropertyDescriptor:wt,getOwnPropertyNames:xt,getOwnPropertySymbols:At,getPrototypeOf:Et}=Object,q=globalThis,rt=q.trustedTypes,St=rt?rt.emptyScript:"",Ct=q.reactiveElementPolyfillSupport,L=(o,t)=>o,F={toAttribute(o,t){switch(t){case Boolean:o=o?St:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},Y=(o,t)=>!$t(o,t),ot={attribute:!0,type:String,converter:F,reflect:!1,useDefault:!1,hasChanged:Y};Symbol.metadata??=Symbol("metadata"),q.litPropertyMetadata??=new WeakMap;let P=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ot){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&_t(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:i}=wt(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:s,set(a){const h=s?.call(this);i?.call(this,a),this.requestUpdate(t,h,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ot}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;const t=Et(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){const e=this.properties,r=[...xt(e),...At(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(et(s))}else t!==void 0&&e.push(et(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return kt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const i=(r.converter?.toAttribute!==void 0?r.converter:F).toAttribute(e,r.type);this._$Em=t,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(t,e){const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const i=r.getPropertyOptions(s),a=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:F;this._$Em=s;const h=a.fromAttribute(e,i.type);this[s]=h??this._$Ej?.get(s)??h,this._$Em=null}}requestUpdate(t,e,r,s=!1,i){if(t!==void 0){const a=this.constructor;if(s===!1&&(i=this[t]),r??=a.getPropertyOptions(t),!((r.hasChanged??Y)(i,e)||r.useDefault&&r.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:i},a){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),i!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[s,i]of r){const{wrapped:a}=i,h=this[s];a!==!0||this._$AL.has(s)||h===void 0||this.C(s,void 0,i,h)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};P.elementStyles=[],P.shadowRootOptions={mode:"open"},P[L("elementProperties")]=new Map,P[L("finalized")]=new Map,Ct?.({ReactiveElement:P}),(q.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const G=globalThis,st=o=>o,I=G.trustedTypes,it=I?I.createPolicy("lit-html",{createHTML:o=>o}):void 0,mt="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,bt="?"+x,Pt=`<${bt}>`,C=document,T=()=>C.createComment(""),z=o=>o===null||typeof o!="object"&&typeof o!="function",Q=Array.isArray,Ot=o=>Q(o)||typeof o?.[Symbol.iterator]=="function",W=`[ 	
\f\r]`,B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,at=/-->/g,nt=/>/g,E=RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),lt=/'/g,dt=/"/g,ft=/^(?:script|style|textarea|title)$/i,Ut=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),v=Ut(1),O=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),ht=new WeakMap,S=C.createTreeWalker(C,129);function gt(o,t){if(!Q(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return it!==void 0?it.createHTML(t):t}const Mt=(o,t)=>{const e=o.length-1,r=[];let s,i=t===2?"<svg>":t===3?"<math>":"",a=B;for(let h=0;h<e;h++){const n=o[h];let u,m,c=-1,$=0;for(;$<n.length&&(a.lastIndex=$,m=a.exec(n),m!==null);)$=a.lastIndex,a===B?m[1]==="!--"?a=at:m[1]!==void 0?a=nt:m[2]!==void 0?(ft.test(m[2])&&(s=RegExp("</"+m[2],"g")),a=E):m[3]!==void 0&&(a=E):a===E?m[0]===">"?(a=s??B,c=-1):m[1]===void 0?c=-2:(c=a.lastIndex-m[2].length,u=m[1],a=m[3]===void 0?E:m[3]==='"'?dt:lt):a===dt||a===lt?a=E:a===at||a===nt?a=B:(a=E,s=void 0);const w=a===E&&o[h+1].startsWith("/>")?" ":"";i+=a===B?n+Pt:c>=0?(r.push(u),n.slice(0,c)+mt+n.slice(c)+x+w):n+x+(c===-2?h:w)}return[gt(o,i+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class R{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let i=0,a=0;const h=t.length-1,n=this.parts,[u,m]=Mt(t,e);if(this.el=R.createElement(u,r),S.currentNode=this.el.content,e===2||e===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=S.nextNode())!==null&&n.length<h;){if(s.nodeType===1){if(s.hasAttributes())for(const c of s.getAttributeNames())if(c.endsWith(mt)){const $=m[a++],w=s.getAttribute(c).split(x),D=/([.?@])?(.*)/.exec($);n.push({type:1,index:i,name:D[2],strings:w,ctor:D[1]==="."?Lt:D[1]==="?"?Tt:D[1]==="@"?zt:K}),s.removeAttribute(c)}else c.startsWith(x)&&(n.push({type:6,index:i}),s.removeAttribute(c));if(ft.test(s.tagName)){const c=s.textContent.split(x),$=c.length-1;if($>0){s.textContent=I?I.emptyScript:"";for(let w=0;w<$;w++)s.append(c[w],T()),S.nextNode(),n.push({type:2,index:++i});s.append(c[$],T())}}}else if(s.nodeType===8)if(s.data===bt)n.push({type:2,index:i});else{let c=-1;for(;(c=s.data.indexOf(x,c+1))!==-1;)n.push({type:7,index:i}),c+=x.length-1}i++}}static createElement(t,e){const r=C.createElement("template");return r.innerHTML=t,r}}function U(o,t,e=o,r){if(t===O)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl;const i=z(t)?void 0:t._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),i===void 0?s=void 0:(s=new i(o),s._$AT(o,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=U(o,s._$AS(o,t.values),s,r)),t}class Bt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??C).importNode(e,!0);S.currentNode=s;let i=S.nextNode(),a=0,h=0,n=r[0];for(;n!==void 0;){if(a===n.index){let u;n.type===2?u=new N(i,i.nextSibling,this,t):n.type===1?u=new n.ctor(i,n.name,n.strings,this,t):n.type===6&&(u=new Rt(i,this,t)),this._$AV.push(u),n=r[++h]}a!==n?.index&&(i=S.nextNode(),a++)}return S.currentNode=C,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class N{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=U(this,t,e),z(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==O&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ot(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=R.createElement(gt(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{const i=new Bt(s,this),a=i.u(this.options);i.p(e),this.T(a),this._$AH=i}}_$AC(t){let e=ht.get(t.strings);return e===void 0&&ht.set(t.strings,e=new R(t)),e}k(t){Q(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const i of t)s===e.length?e.push(r=new N(this.O(T()),this.O(T()),this,this.options)):r=e[s],r._$AI(i),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const r=st(t).nextSibling;st(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class K{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,i){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=p}_$AI(t,e=this,r,s){const i=this.strings;let a=!1;if(i===void 0)t=U(this,t,e,0),a=!z(t)||t!==this._$AH&&t!==O,a&&(this._$AH=t);else{const h=t;let n,u;for(t=i[0],n=0;n<i.length-1;n++)u=U(this,h[r+n],e,n),u===O&&(u=this._$AH[n]),a||=!z(u)||u!==this._$AH[n],u===p?t=p:t!==p&&(t+=(u??"")+i[n+1]),this._$AH[n]=u}a&&!s&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Lt extends K{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}}class Tt extends K{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}}class zt extends K{constructor(t,e,r,s,i){super(t,e,r,s,i),this.type=5}_$AI(t,e=this){if((t=U(this,t,e,0)??p)===O)return;const r=this._$AH,s=t===p&&r!==p||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==p&&(r===p||s);s&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Rt{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){U(this,t)}}const Ht=G.litHtmlPolyfillSupport;Ht?.(R,N),(G.litHtmlVersions??=[]).push("3.3.2");const Nt=(o,t,e)=>{const r=e?.renderBefore??t;let s=r._$litPart$;if(s===void 0){const i=e?.renderBefore??null;r._$litPart$=s=new N(t.insertBefore(T(),i),i,void 0,e??{})}return s._$AI(o),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const X=globalThis;class y extends P{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Nt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return O}}y._$litElement$=!0,y.finalized=!0,X.litElementHydrateSupport?.({LitElement:y});const Dt=X.litElementPolyfillSupport;Dt?.({LitElement:y});(X.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const M=o=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,t)}):customElements.define(o,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jt={attribute:!0,type:String,converter:F,reflect:!1,hasChanged:Y},Ft=(o=jt,t,e)=>{const{kind:r,metadata:s}=e;let i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),r==="setter"&&((o=Object.create(o)).wrapped=!0),i.set(e.name,o),r==="accessor"){const{name:a}=e;return{set(h){const n=t.get.call(this);t.set.call(this,h),this.requestUpdate(a,n,o,!0,h)},init(h){return h!==void 0&&this.C(a,void 0,o,h),h}}}if(r==="setter"){const{name:a}=e;return function(h){const n=this[a];t.call(this,h),this.requestUpdate(a,n,o,!0,h)}}throw Error("Unsupported decorator location: "+r)};function l(o){return(t,e)=>typeof e=="object"?Ft(o,t,e):((r,s,i)=>{const a=s.hasOwnProperty(i);return s.constructor.createProperty(i,r),a?Object.getOwnPropertyDescriptor(s,i):void 0})(o,t,e)}var It=H`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :host {
    --kemet-card-padding: 1rem;
    --kemet-card-border-color: rgb(var(--kemet-color-gray-300));
    --kemet-card-color: rgb(var(--kemet-color-text));
    --kemet-card-max-width: 600px;
    --kemet-card-border: 1px solid var(--kemet-card-border-color);
    --kemet-card-border-radius: 0;
    --kemet-card-background-color: rgb(var(--kemet-color-background));
    --kemet-card-body-padding: var(--kemet-card-padding);
    --kemet-card-header-padding: var(--kemet-card-padding);
    --kemet-card-header-border-bottom: 1px solid var(--kemet-card-border-color);
    --kemet-card-caption-color: rgb(var(--kemet-color-white));
    --kemet-card-caption-padding: calc(var(--kemet-card-padding) / 2) var(--kemet-card-padding);
    --kemet-card-caption-background-color: rgb(var(--kemet-color-black) / 35%);
    --kemet-card-footer-padding: var(--kemet-card-padding);
    --kemet-card-footer-border-top: 1px solid var(--kemet-card-border-color);

    color: var(--kemet-card-color);
    display: inline-flex;
    flex-direction: column;
    max-width: var(--kemet-card-max-width);
    border: var(--kemet-card-border);
    border-radius: var(--kemet-card-border-radius);
    background-color: var(--kemet-card-background-color);
  }

  :host([center]) {
    align-items: center;
    text-align: center;
  }

  .body {
    padding: var(--kemet-card-body-padding);
  }

  .media {
    position: relative;
  }

  ::slotted(*) {
    max-width: 100%;
  }

  ::slotted(img) {
    display: flex;
    max-width: 100%;
  }

  ::slotted([slot="header"]) {
    width: 100%;
    padding: var(--kemet-card-header-padding);
    border-bottom: var(--kemet-card-header-border-bottom);
  }

  ::slotted([slot="caption"]) {
    color: var(--kemet-card-caption-color);
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: var(--kemet-card-caption-padding);
    background-color: var(--kemet-card-caption-background-color);
  }

  ::slotted([slot="footer"]) {
    width: 100%;
    padding: var(--kemet-card-footer-padding);
    border-top: var(--kemet-card-footer-border-top);
  }
`,V=class extends y{render(){return v`
      <slot name="header"></slot>
      <div class="media" part="media">
        <slot name="media"></slot>
        <slot name="caption"></slot>
      </div>
      <div class="body" part="body">
        <slot></slot>
      </div>
      </div>
      <slot name="footer"></slot>
    `}};V.styles=[It];d([l({type:Boolean,reflect:!0})],V.prototype,"center",2);V=d([M("kemet-card")],V);var Vt=class{constructor(o,t=void 0){(this.host=o).addController(this),this.options={form:e=>e.closest("form"),name:e=>e.name,value:e=>e.value,disabled:e=>e.disabled,...t},this.handleFormData=this.handleFormData.bind(this),this.handleFormSubmit=this.handleFormSubmit.bind(this)}hostConnected(){this.form=this.options.form(this.host),this.form&&(this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit))}hostDisconnected(){this.form&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form=void 0)}handleFormData(o){const t=this.options.disabled(this.host),e=this.options.name(this.host),r=this.options.value(this.host);!t&&typeof e=="string"&&typeof r<"u"&&o.formData?.append(e,r.toString())}handleFormSubmit(o){o.preventDefault(),o.stopImmediatePropagation();const t=this.options.disabled(this.host);this.form=this.options.form(this.host),this.form&&!t&&this.form.querySelectorAll("kemet-input, kemet-textarea, kemet-select, kemet-checkbox, kemet-radios").forEach(r=>{r.checkValidity&&(r.checkValidity(),r.checkValidity()||(r.status="error",r.invalid=!0,r.dispatchEvent(new CustomEvent("kemet-input-status",{bubbles:!0,composed:!0,detail:{status:"error",validity:r.validity?r.validity:{},element:r}}))),r.checkLimitValidity&&!r.checkLimitValidity()&&(r.status="error",r.invalid=!0,r.dispatchEvent(new CustomEvent("kemet-input-status",{bubbles:!0,composed:!0,detail:{status:"error",validity:{passedLimit:!0},element:r}}))))})}submit(){const o=document.createElement("button");this.form&&(o.type="submit",o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clip="rect(0 0 0 0)",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",this.form.append(o),o.click(),o.remove())}},qt=H`
  :host {
    --kemet-button-font-size: inherit;
    --kemet-button-color: rgb(var(--kemet-color-background));
    --kemet-button-width: auto;
    --kemet-button-height: auto;
    --kemet-button-border: 0;
    --kemet-button-border-radius: 0;
    --kemet-button-transition-speed: 300ms;
    --kemet-button-background-color: rgb(var(--kemet-color-foreground));
    --kemet-button-hover-brightness: 1.25;
    --kemet-button-disabled-opacity: 0.5;
    --kemet-button-gap: 0.5rem;
    --kemet-button-padding: 1rem 1.25rem;
    --kemet-button-hover-decoration: underline;
    --kemet-button-circle-size: 50px;
    --kemet-button-border-width: 1.5px;
    --kemet-button-border-style: solid;
    --kemet-button-border-color: rgb(var(--kemet-color-foreground));

    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--kemet-button-font-size);
    color: var(--kemet-button-color);
    width: var(--kemet-button-width);
    height: var(--kemet-button-height);
    border: var(--kemet-button-border);
    border-radius: var(--kemet-button-border-radius);
    transition: filter var(--kemet-button-transition-speed) ease;
    background-color: var(--kemet-button-background-color);
  }

  :host(:hover:not([disabled])) {
    filter: brightness(var(--kemet-button-hover-brightness));
  }

  :host([disabled]) {
    opacity: var(--kemet-button-disabled-opacity);
  }

  .button {
    cursor: pointer;
    text-decoration: none;
    display: flex;
    gap: var(--kemet-button-gap);
    align-items: center;
    justify-content: center;
    color: inherit;
    font-size: inherit;
    width: 100%;
    padding: var(--kemet-button-padding);
    border: 0;
    background: none;
  }

  :host([disabled]) .button {
    cursor: not-allowed;
  }

  :host([variant=text]) {
    --kemet-button-color: rgb(var(--kemet-color-text));
    --kemet-button-background-color: none;
  }

  :host([variant=text]:hover) {
    text-decoration: var(--kemet-button-hover-decoration);
  }

  :host([rounded]) {
    --kemet-button-border-radius: var(--kemet-border-radius-md);
  }

  :host([rounded=sm]) {
    --kemet-button-border-radius: var(--kemet-border-radius-sm);
  }

  :host([rounded=lg]) {
    --kemet-button-border-radius: var(--kemet-border-radius-lg);
  }

  :host([rounded=xl]) {
    --kemet-button-border-radius: var(--kemet-border-radius-xl);
  }

  :host([rounded=circle]) {
    --kemet-button-border-radius: var(--kemet-border-radius-circle);
    --kemet-button-width: var(--kemet-button-circle-size);
    --kemet-button-height: var(--kemet-button-circle-size);
  }

  :host([rounded=pill]) {
    --kemet-button-border-radius: var(--kemet-border-radius-pill);
  }

  :host([variant=outlined]) {
    --kemet-button-color: rgb(var(--kemet-color-foreground));
    --kemet-button-background-color: transparent;
    --kemet-button-border: var(--kemet-button-border-width) var(--kemet-button-border-style) var(--kemet-button-border-color);
  }

  :host([icon-left]) {
    --kemet-button-padding: 1rem 1.25rem 1rem .75rem;
  }

  :host([icon-right]) {
    --kemet-button-padding:  1rem .75rem 1rem 1.25rem;
  }
`,f=class extends y{constructor(){super(),this.disabled=!1,this.variant="standard",this.target="_self",this.type="button",this.iconLeft=!1,this.iconRight=!1,this.addEventListener("click",this.handleClick.bind(this)),this.addEventListener("mouseover",this.handleMouseOver.bind(this)),this.addEventListener("mouseout",this.handleMouseOut.bind(this)),this.addEventListener("blur",this.handleBlur.bind(this)),this.addEventListener("keyup",o=>this.handleKeyUp(o)),this.formSubmitController=new Vt(this)}render(){return this.link&&!this.disabled?v`
        <a href=${this.link} target=${this.target} class="button" role="button" part="button">
          <slot name="left" @slotchange=${this.handleLeftChange}></slot>
          <slot></slot>
          <slot name="right" @slotchange=${this.handleRightChange}></slot>
        </a>
      `:v`
      <button class="button" part="button" type=${this.type} ?disabled=${this.disabled} aria-disabled=${this.disabled?"true":"false"}>
        <slot name="left" @slotchange=${this.handleLeftChange}></slot>
        <slot></slot>
        <slot name="right" @slotchange=${this.handleRightChange}></slot>
      </button>
    `}handleLeftChange(){this.querySelector('[slot="left"]')&&(this.iconLeft=!0)}handleRightChange(){this.querySelector('[slot="right"]')&&(this.iconRight=!0)}handleMouseOver(){this.hover=!0}handleMouseOut(){this.hover=!1}handleClick(){this.disabled||(this.hover=!1,this.active=!0,setTimeout(()=>{this.active=!1},300),this.shadowRoot.querySelector("button")&&this.formSubmitController.submit())}handleBlur(){this.focused=!1,this.active=!1,this.hover=!1}handleKeyUp(o){o.key==="Tab"&&(this.focused=!0)}};f.styles=[qt];d([l({type:Boolean,reflect:!0})],f.prototype,"active",2);d([l({type:Boolean,reflect:!0})],f.prototype,"hover",2);d([l({type:Boolean,reflect:!0})],f.prototype,"focused",2);d([l({type:String})],f.prototype,"link",2);d([l({type:Boolean,reflect:!0})],f.prototype,"disabled",2);d([l({reflect:!0})],f.prototype,"variant",2);d([l()],f.prototype,"target",2);d([l()],f.prototype,"type",2);d([l({type:Boolean,reflect:!0,attribute:"icon-left"})],f.prototype,"iconLeft",2);d([l({type:Boolean,reflect:!0,attribute:"icon-right"})],f.prototype,"iconRight",2);d([l({type:String,reflect:!0})],f.prototype,"rounded",2);f=d([M("kemet-button")],f);var Kt=H`
  :host {
    --kemet-fab-size: 50px;
    --kemet-fab-color: rgb(var(--kemet-color-white));
    --kemet-fab-background-color: rgb(var(--kemet-color-primary));
    --kemet-fab-outlined-color: rgb(var(--kemet-color-foreground));
    --kemet-fab-outlined-border: 1px solid rgb(var(--kemet-color-foreground));
    --kemet-fab-pill-radius: 10rem;
    --kemet-fab-background-color: rgb(var(--kemet-color-primary));
    --kemet-fab-outline-border: 1px solid rgb(var(--kemet-color-primary));
    --kemet-fab-color: rgb(var(--kemet-color-white));
    --kemet-fab-outlined-color: rgb(var(--kemet-color-foreground));

    display: inline-block;
    position: relative;
  }

  button {
    color: var(--kemet-fab-color);
    font-size: inherit;
    display: inline-flex;
    padding: 0;
    position: relative;
    min-height: var(--kemet-fab-size);
    min-width: var(--kemet-fab-size);
    max-width: var(--kemet-fab-size);
    align-items: center;
    justify-content: flex-start;
    transition: all 0.4s ease;
    border: none;
    background-color: var(--kemet-fab-background-color);
  }

  :host([outlined]) button {
    color: var(--kemet-fab-outlined-color);
    border: var(--kemet-fab-outlined-border);
    background-color: transparent;
  }

  :host([pill]) button {
    border-radius: var(--kemet-fab-pill-radius);
  }

  button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    transition: background-color 0.3s ease-in-out;
    background-color: var(--kemet-fab-background-color);
  }

  :host([pill]) button::before {
    border-radius: var(--kemet-fab-pill-radius);
  }

  :host([outlined]) button::before {
    border: var(--kemet-fab-outline-border);
    background-color: transparent;
  }

  :host([expanded]) button {
    max-width: 99rem;
    padding: 0 1.35rem 0 0.25rem;
  }

  :host([disabled]) button {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon {
    width: var(--kemet-fab-size);
    height: var(--kemet-fab-size);
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
  }

  .text {
    color: var(--kemet-fab-color);
    z-index: 1;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  :host([outlined]) .text {
    color: var(--kemet-fab-outlined-color);
  }

  :host([expanded]) .text {
    opacity: 1;
  }
`,_=class extends y{constructor(){super(...arguments),this.expanded=!1,this.outlined=!1,this.disabled=!1}firstUpdated(){window.addEventListener("scroll",this.handleScroll.bind(this)),this.addEventListener("mouseover",this.handleMouseOver.bind(this)),this.addEventListener("mouseout",this.handleMouseOut.bind(this))}render(){return v`
      <button class="button" part="button" ?disabled=${this.disabled}>
        <span class="icon" part="icon">
          <slot name="icon"></slot>
        </span>
        <span class="text" part="text">
          <slot></slot>
        </span>
      </button>
    `}handleMouseOver(){this.disabled||(this.expanded=!0)}handleMouseOut(){this.disabled||(this.expanded=!1)}handleScroll(){window.scrollY>this.expandPoint&&window.scrollY<this.collapsePoint?this.expanded=!0:this.expanded=!1}};_.styles=[Kt];d([l({type:Boolean,reflect:!0})],_.prototype,"expanded",2);d([l({type:Boolean,reflect:!0})],_.prototype,"outlined",2);d([l({type:Boolean,reflect:!0})],_.prototype,"disabled",2);d([l({type:Boolean,reflect:!0})],_.prototype,"pill",2);d([l({type:Number,attribute:"expand-point"})],_.prototype,"expandPoint",2);d([l({type:Number,attribute:"collapse-point"})],_.prototype,"collapsePoint",2);_=d([M("kemet-fab")],_);var ct=(o,t,e,r=!0,s=!0)=>{o.dispatchEvent(new CustomEvent(t,{bubbles:r,composed:s,detail:e}))},Wt=H`
  :host {
    --kemet-alert-padding: 1rem;
    --kemet-alert-border-thickness: 4px;
    --kemet-alert-status-color: inherit;
    --kemet-alert-align-items: center;
    --kemet-alert-border: 1px solid rgb(var(--kemet-alert-status-color));
    --kemet-alert-radius: 0;
    --kemet-alert-color: inherit;
    --kemet-alert-background-color: transparent;

    color: var(--kemet-alert-color);
    display: flex;
    grid-template-columns: auto 1fr auto;
    gap: var(--kemet-alert-padding);
    align-items: var(--kemet-alert-align-items);
    opacity: 0;
    padding: var(--kemet-alert-padding);
    border: var(--kemet-alert-border);
    transition: opacity 300ms ease;
    border-radius: var(--kemet-alert-radius);
    background-color: var(--kemet-alert-background-color);
  }

  :host([opened]) {
    opacity: 1;
  }

  :host([filled]) {
    --kemet-alert-border: 2px solid rgb(var(--kemet-color-white));
    --kemet-alert-color: rgb(var(--kemet-color-white));
    --kemet-alert-background-color: rgb(var(--kemet-alert-status-color));
  }

  :host([filled][status=standard]) {
    --kemet-alert-color: rgb(var(--kemet-color-background));
  }

  :host([border-status="top"]) {
    border-top: var(--kemet-alert-border-thickness) solid rgb(var(--kemet-alert-status-color));
  }

  :host([border-status="right"]) {
    border-right: var(--kemet-alert-border-thickness) solid rgb(var(--kemet-alert-status-color));
  }

  :host([border-status="bottom"]) {
    border-bottom: var(--kemet-alert-border-thickness) solid rgb(var(--kemet-alert-status-color));
  }

  :host([border-status="left"]) {
    border-left: var(--kemet-alert-border-thickness) solid rgb(var(--kemet-alert-status-color));
  }

  :host([status="standard"]) {
    --kemet-alert-status-color: var(--kemet-color-text);
  }

  :host([status="primary"]) {
    --kemet-alert-status-color: var(--kemet-color-primary);
  }

  :host([status="success"]) {
    --kemet-alert-status-color: var(--kemet-color-success);
  }

  :host([status="warning"]) {
    --kemet-alert-status-color: var(--kemet-color-warning);
  }

  :host([status="error"]) {
    --kemet-alert-status-color: var(--kemet-color-error);
  }

  :host([hidden]) {
    display: none;
  }

  :host([reveal]) {
    animation: fadeIn 300ms ease forwards;
  }

  :host([overlay]) {
    position: fixed;
  }

  :host([overlay*="full"]) {
    width: 100%;
  }

  :host([overlay*="top"]) {
    top: 0;
  }

  :host([overlay*="bottom"]) {
    bottom: 0;
  }

  :host([overlay*="left"]) {
    left: 0;
  }

  :host([overlay*="right"]) {
    right: 0;
  }

  :host([rounded]) {
    --kemet-alert-radius: var(--kemet-border-radius-md);
  }

  :host([rounded="sm"]) {
    --kemet-alert-radius: var(--kemet-border-radius-sm);
  }

  :host([rounded="md"]) {
    --kemet-alert-radius: var(--kemet-border-radius-md);
  }

  :host([rounded="lg"]) {
    --kemet-alert-radius: var(--kemet-border-radius-lg);
  }

  :host([rounded="xl"]) {
    --kemet-alert-radius: var(--kemet-border-radius-xl);
  }

  :host([rounded="circle"]) {
    --kemet-alert-radius: var(--kemet-border-radius-circle);
  }

  :host([rounded="pill"]) {
    --kemet-alert-radius: var(--kemet-border-radius-pill);
  }

  [part=message] {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .close {
    cursor: pointer;
    margin-left: auto;
  }

  :host(:not([filled])) ::slotted(kemet-icon-bootstrap) {
    color: rgb(var(--kemet-alert-status-color));
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`,g=class extends y{constructor(){super(...arguments),this.status="standard"}shouldUpdate(o){return o.has("opened")&&!o.get("opened")&&(this.hidden=!1,this.reveal=!0),!0}firstUpdated(){this.handleMotion()}updated(o){!o.get("opened")&&this.opened===!0?ct(this,"kemet-opened",this):ct(this,"kemet-closed",this)}render(){return v`
      <slot name="icon"></slot>
      <div part="message">
        <slot></slot>
      </div>
      <div class="close" part="close">
        ${this.makeCloseBtn()}
      </div>
    `}makeCloseBtn(){return this.closable?v`<kemet-icon-bootstrap icon="x-lg" @click=${()=>{this.opened=!1}}></kemet-icon-bootstrap>`:null}handleMotion(){this.addEventListener("transitionend",()=>{this.opened||(this.hidden=!0)}),this.addEventListener("animationend",()=>{this.reveal=!1})}};g.styles=[Wt];d([l({type:Boolean,reflect:!0})],g.prototype,"opened",2);d([l({type:Boolean,reflect:!0})],g.prototype,"reveal",2);d([l({type:Boolean,reflect:!0})],g.prototype,"closable",2);d([l({type:String,reflect:!0})],g.prototype,"status",2);d([l({type:String,reflect:!0,attribute:"border-status"})],g.prototype,"borderStatus",2);d([l({type:Boolean,reflect:!0})],g.prototype,"hidden",2);d([l({type:String,reflect:!0})],g.prototype,"overlay",2);d([l({type:String,reflect:!0})],g.prototype,"rounded",2);d([l({type:Boolean,reflect:!0})],g.prototype,"filled",2);g=d([M("kemet-alert")],g);var b=class extends y{constructor(){super(...arguments),this.icon="code",this.version="1.11.3",this.size=24,this.stylesLoaded=!1}async connectedCallback(){super.connectedCallback(),await this._loadBootstrapStyles()}async _resolveVersion(o){if(o!=="latest"&&/^\d+\.\d+\.\d+/.test(o))return o;if(b.resolvedVersions.has(o))return b.resolvedVersions.get(o);try{const t=await fetch("https://unpkg.com/bootstrap-icons/package.json");if(!t.ok)throw new Error("Failed to resolve version");const r=(await t.json()).version;return b.resolvedVersions.set(o,r),r}catch(t){return console.warn("Failed to resolve Bootstrap Icons version, using 1.11.3:",t),"1.11.3"}}async _loadBootstrapStyles(){if(!this.stylesLoaded)try{const o=await this._resolveVersion(this.version),t=o;b.fontFaceLoaded.get(t)||(await this._loadFontFaceInDocument(o),b.fontFaceLoaded.set(t,!0));let e=b.iconStylesCache.get(t);if(!e){const r=await fetch(`https://unpkg.com/bootstrap-icons@${o}/font/bootstrap-icons.min.css`);if(!r.ok)throw new Error(`HTTP error! status: ${r.status}`);let s=await r.text();s=s.replace(/@font-face\s*{[^}]*}/g,""),e=new CSSStyleSheet,await e.replace(s),b.iconStylesCache.set(t,e)}this.shadowRoot.adoptedStyleSheets=[...this.shadowRoot.adoptedStyleSheets,e],this.stylesLoaded=!0,this.requestUpdate()}catch(o){console.error("Failed to load Bootstrap Icons:",o),this.requestUpdate()}}async _loadFontFaceInDocument(o){try{const t=await fetch(`https://unpkg.com/bootstrap-icons@${o}/font/bootstrap-icons.min.css`);if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);const r=(await t.text()).match(/@font-face\s*{[^}]*}/g);if(!r)return;const s=`https://unpkg.com/bootstrap-icons@${o}/font/`;let i=r.join(`
`);i=i.replace(/url\(["']?\.\/fonts\//g,`url("${s}fonts/`),i=i.replace(/url\(["']?fonts\//g,`url("${s}fonts/`);const a=`bootstrap-icons-fonts-${o}`;if(!document.getElementById(a)){const h=document.createElement("style");h.id=a,h.textContent=i,document.head.appendChild(h)}}catch(t){throw console.error("Failed to load Bootstrap Icons fonts:",t),t}}render(){return v`
      <i class="bi bi-${this.icon}" style="font-size: ${this.size}px;"></i>
    `}};b.fontFaceLoaded=new Map;b.iconStylesCache=new Map;b.resolvedVersions=new Map;b.styles=H`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `;d([l()],b.prototype,"icon",2);d([l()],b.prototype,"version",2);d([l()],b.prototype,"size",2);b=d([M("kemet-icon-bootstrap")],b);const Zt="img{max-height:48px}h2{margin:0}div{display:flex;align-items:center}a{color:inherit}header{display:flex;justify-content:space-between;margin:.5rem auto;padding:0;max-width:var(--page-width)}header>div{font-size:1rem;display:flex;gap:2rem}kemet-avatar{--kemet-avatar-background-color: transparent;width:40px;height:40px;display:flex;align-items:center;padding-left:4px}kemet-avatar span{font-size:.8rem;color:var(--color-white);display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center;border-radius:50%;background-color:rgb(var(--kemet-color-green-700))}.logo{color:rgb(var(--kemet-color-black));display:flex;gap:.5rem;align-items:center;text-decoration:none}";var Jt=Object.defineProperty,Yt=Object.getOwnPropertyDescriptor,A=(o,t,e,r)=>{for(var s=r>1?void 0:r?Yt(t,e):t,i=o.length-1,a;i>=0;i--)(a=o[i])&&(s=(r?a(t,e,s):a(s))||s);return r&&s&&Jt(t,e,s),s};let k=class extends y{render(){return v`
      <header>
        <div>
          <a class="logo" href="${this.home}">
            ${this.logo?v`<img src="${this.logo}" alt="${this.name} Logo" />`:null}
            ${this.name?v`<h2>${this.name}</h2>`:null}
          </a>
          <div>
            <strong>${this.total}</strong>&nbsp;in your cart.
          </div>
        </div>
        <div>
          <slot></slot>
          <a href="${this.home}/cart">
            <kemet-avatar circle>
              <kemet-icon-bootstrap size="24" icon="cart3"></kemet-icon-bootstrap>
              <span>${this.count}</span>
            </kemet-avatar>
          </a>
        </div>
      </header>
    `}};k.styles=[pt(Zt)];A([l({type:String})],k.prototype,"home",2);A([l()],k.prototype,"logo",2);A([l()],k.prototype,"name",2);A([l()],k.prototype,"logout",2);A([l()],k.prototype,"total",2);A([l()],k.prototype,"count",2);A([l({type:Boolean,reflect:!0,attribute:"logged-in"})],k.prototype,"logged",2);k=A([M("lasz-header")],k);
