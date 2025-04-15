import{c as J,i as me,r as a,o as R,j as l,P as N,m as W,l as P,q as C,v as pe,d as T,h as be,u as ve,s as xe}from"./index-BpY0WgHP.js";import{L as ge}from"./layout-DGSTY2PH.js";import{B as $}from"./button-A5Wi0IzG.js";import{I as Se}from"./input-BvL5Mogg.js";import{u as we,C as ye}from"./index-BA7pfreJ.js";import{c as Ce}from"./index-BdQq_4o_.js";import{T as Pe}from"./trash-2-Bp2gZTWM.js";import{L as q}from"./loader-circle-BFBYu-De.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ae=J("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ee=J("Send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);function Re(e,t){return a.useReducer((r,n)=>t[r][n]??r,e)}var X="ScrollArea",[Q,rt]=me(X),[je,x]=Q(X),K=a.forwardRef((e,t)=>{const{__scopeScrollArea:r,type:n="hover",dir:o,scrollHideDelay:s=600,...i}=e,[c,d]=a.useState(null),[m,u]=a.useState(null),[h,f]=a.useState(null),[p,v]=a.useState(null),[w,Y]=a.useState(null),[y,L]=a.useState(0),[M,_]=a.useState(0),[k,j]=a.useState(!1),[D,I]=a.useState(!1),b=R(t,A=>d(A)),g=we(o);return l.jsx(je,{scope:r,type:n,dir:g,scrollHideDelay:s,scrollArea:c,viewport:m,onViewportChange:u,content:h,onContentChange:f,scrollbarX:p,onScrollbarXChange:v,scrollbarXEnabled:k,onScrollbarXEnabledChange:j,scrollbarY:w,onScrollbarYChange:Y,scrollbarYEnabled:D,onScrollbarYEnabledChange:I,onCornerWidthChange:L,onCornerHeightChange:_,children:l.jsx(N.div,{dir:g,...i,ref:b,style:{position:"relative","--radix-scroll-area-corner-width":y+"px","--radix-scroll-area-corner-height":M+"px",...e.style}})})});K.displayName=X;var Z="ScrollAreaViewport",ee=a.forwardRef((e,t)=>{const{__scopeScrollArea:r,children:n,asChild:o,nonce:s,...i}=e,c=x(Z,r),d=a.useRef(null),m=R(t,d,c.onViewportChange);return l.jsxs(l.Fragment,{children:[l.jsx("style",{dangerouslySetInnerHTML:{__html:`
[data-radix-scroll-area-viewport] {
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}
[data-radix-scroll-area-viewport]::-webkit-scrollbar {
  display: none;
}
:where([data-radix-scroll-area-viewport]) {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
:where([data-radix-scroll-area-content]) {
  flex-grow: 1;
}
`},nonce:s}),l.jsx(N.div,{"data-radix-scroll-area-viewport":"",...i,asChild:o,ref:m,style:{overflowX:c.scrollbarXEnabled?"scroll":"hidden",overflowY:c.scrollbarYEnabled?"scroll":"hidden",...e.style},children:We({asChild:o,children:n},u=>l.jsx("div",{"data-radix-scroll-area-content":"",ref:c.onContentChange,style:{minWidth:c.scrollbarXEnabled?"fit-content":void 0},children:u}))})]})});ee.displayName=Z;var S="ScrollAreaScrollbar",V=a.forwardRef((e,t)=>{const{forceMount:r,...n}=e,o=x(S,e.__scopeScrollArea),{onScrollbarXEnabledChange:s,onScrollbarYEnabledChange:i}=o,c=e.orientation==="horizontal";return a.useEffect(()=>(c?s(!0):i(!0),()=>{c?s(!1):i(!1)}),[c,s,i]),o.type==="hover"?l.jsx(Ne,{...n,ref:t,forceMount:r}):o.type==="scroll"?l.jsx(Te,{...n,ref:t,forceMount:r}):o.type==="auto"?l.jsx(te,{...n,ref:t,forceMount:r}):o.type==="always"?l.jsx(B,{...n,ref:t}):null});V.displayName=S;var Ne=a.forwardRef((e,t)=>{const{forceMount:r,...n}=e,o=x(S,e.__scopeScrollArea),[s,i]=a.useState(!1);return a.useEffect(()=>{const c=o.scrollArea;let d=0;if(c){const m=()=>{window.clearTimeout(d),i(!0)},u=()=>{d=window.setTimeout(()=>i(!1),o.scrollHideDelay)};return c.addEventListener("pointerenter",m),c.addEventListener("pointerleave",u),()=>{window.clearTimeout(d),c.removeEventListener("pointerenter",m),c.removeEventListener("pointerleave",u)}}},[o.scrollArea,o.scrollHideDelay]),l.jsx(W,{present:r||s,children:l.jsx(te,{"data-state":s?"visible":"hidden",...n,ref:t})})}),Te=a.forwardRef((e,t)=>{const{forceMount:r,...n}=e,o=x(S,e.__scopeScrollArea),s=e.orientation==="horizontal",i=U(()=>d("SCROLL_END"),100),[c,d]=Re("hidden",{hidden:{SCROLL:"scrolling"},scrolling:{SCROLL_END:"idle",POINTER_ENTER:"interacting"},interacting:{SCROLL:"interacting",POINTER_LEAVE:"idle"},idle:{HIDE:"hidden",SCROLL:"scrolling",POINTER_ENTER:"interacting"}});return a.useEffect(()=>{if(c==="idle"){const m=window.setTimeout(()=>d("HIDE"),o.scrollHideDelay);return()=>window.clearTimeout(m)}},[c,o.scrollHideDelay,d]),a.useEffect(()=>{const m=o.viewport,u=s?"scrollLeft":"scrollTop";if(m){let h=m[u];const f=()=>{const p=m[u];h!==p&&(d("SCROLL"),i()),h=p};return m.addEventListener("scroll",f),()=>m.removeEventListener("scroll",f)}},[o.viewport,s,d,i]),l.jsx(W,{present:r||c!=="hidden",children:l.jsx(B,{"data-state":c==="hidden"?"hidden":"visible",...n,ref:t,onPointerEnter:P(e.onPointerEnter,()=>d("POINTER_ENTER")),onPointerLeave:P(e.onPointerLeave,()=>d("POINTER_LEAVE"))})})}),te=a.forwardRef((e,t)=>{const r=x(S,e.__scopeScrollArea),{forceMount:n,...o}=e,[s,i]=a.useState(!1),c=e.orientation==="horizontal",d=U(()=>{if(r.viewport){const m=r.viewport.offsetWidth<r.viewport.scrollWidth,u=r.viewport.offsetHeight<r.viewport.scrollHeight;i(c?m:u)}},10);return E(r.viewport,d),E(r.content,d),l.jsx(W,{present:n||s,children:l.jsx(B,{"data-state":s?"visible":"hidden",...o,ref:t})})}),B=a.forwardRef((e,t)=>{const{orientation:r="vertical",...n}=e,o=x(S,e.__scopeScrollArea),s=a.useRef(null),i=a.useRef(0),[c,d]=a.useState({content:0,viewport:0,scrollbar:{size:0,paddingStart:0,paddingEnd:0}}),m=le(c.viewport,c.content),u={...n,sizes:c,onSizesChange:d,hasThumb:m>0&&m<1,onThumbChange:f=>s.current=f,onThumbPointerUp:()=>i.current=0,onThumbPointerDown:f=>i.current=f};function h(f,p){return Oe(f,i.current,c,p)}return r==="horizontal"?l.jsx(Le,{...u,ref:t,onThumbPositionChange:()=>{if(o.viewport&&s.current){const f=o.viewport.scrollLeft,p=G(f,c,o.dir);s.current.style.transform=`translate3d(${p}px, 0, 0)`}},onWheelScroll:f=>{o.viewport&&(o.viewport.scrollLeft=f)},onDragScroll:f=>{o.viewport&&(o.viewport.scrollLeft=h(f,o.dir))}}):r==="vertical"?l.jsx(_e,{...u,ref:t,onThumbPositionChange:()=>{if(o.viewport&&s.current){const f=o.viewport.scrollTop,p=G(f,c);s.current.style.transform=`translate3d(0, ${p}px, 0)`}},onWheelScroll:f=>{o.viewport&&(o.viewport.scrollTop=f)},onDragScroll:f=>{o.viewport&&(o.viewport.scrollTop=h(f))}}):null}),Le=a.forwardRef((e,t)=>{const{sizes:r,onSizesChange:n,...o}=e,s=x(S,e.__scopeScrollArea),[i,c]=a.useState(),d=a.useRef(null),m=R(t,d,s.onScrollbarXChange);return a.useEffect(()=>{d.current&&c(getComputedStyle(d.current))},[d]),l.jsx(oe,{"data-orientation":"horizontal",...o,ref:m,sizes:r,style:{bottom:0,left:s.dir==="rtl"?"var(--radix-scroll-area-corner-width)":0,right:s.dir==="ltr"?"var(--radix-scroll-area-corner-width)":0,"--radix-scroll-area-thumb-width":H(r)+"px",...e.style},onThumbPointerDown:u=>e.onThumbPointerDown(u.x),onDragScroll:u=>e.onDragScroll(u.x),onWheelScroll:(u,h)=>{if(s.viewport){const f=s.viewport.scrollLeft+u.deltaX;e.onWheelScroll(f),ce(f,h)&&u.preventDefault()}},onResize:()=>{d.current&&s.viewport&&i&&n({content:s.viewport.scrollWidth,viewport:s.viewport.offsetWidth,scrollbar:{size:d.current.clientWidth,paddingStart:z(i.paddingLeft),paddingEnd:z(i.paddingRight)}})}})}),_e=a.forwardRef((e,t)=>{const{sizes:r,onSizesChange:n,...o}=e,s=x(S,e.__scopeScrollArea),[i,c]=a.useState(),d=a.useRef(null),m=R(t,d,s.onScrollbarYChange);return a.useEffect(()=>{d.current&&c(getComputedStyle(d.current))},[d]),l.jsx(oe,{"data-orientation":"vertical",...o,ref:m,sizes:r,style:{top:0,right:s.dir==="ltr"?0:void 0,left:s.dir==="rtl"?0:void 0,bottom:"var(--radix-scroll-area-corner-height)","--radix-scroll-area-thumb-height":H(r)+"px",...e.style},onThumbPointerDown:u=>e.onThumbPointerDown(u.y),onDragScroll:u=>e.onDragScroll(u.y),onWheelScroll:(u,h)=>{if(s.viewport){const f=s.viewport.scrollTop+u.deltaY;e.onWheelScroll(f),ce(f,h)&&u.preventDefault()}},onResize:()=>{d.current&&s.viewport&&i&&n({content:s.viewport.scrollHeight,viewport:s.viewport.offsetHeight,scrollbar:{size:d.current.clientHeight,paddingStart:z(i.paddingTop),paddingEnd:z(i.paddingBottom)}})}})}),[ke,re]=Q(S),oe=a.forwardRef((e,t)=>{const{__scopeScrollArea:r,sizes:n,hasThumb:o,onThumbChange:s,onThumbPointerUp:i,onThumbPointerDown:c,onThumbPositionChange:d,onDragScroll:m,onWheelScroll:u,onResize:h,...f}=e,p=x(S,r),[v,w]=a.useState(null),Y=R(t,b=>w(b)),y=a.useRef(null),L=a.useRef(""),M=p.viewport,_=n.content-n.viewport,k=C(u),j=C(d),D=U(h,10);function I(b){if(y.current){const g=b.clientX-y.current.left,A=b.clientY-y.current.top;m({x:g,y:A})}}return a.useEffect(()=>{const b=g=>{const A=g.target;(v==null?void 0:v.contains(A))&&k(g,_)};return document.addEventListener("wheel",b,{passive:!1}),()=>document.removeEventListener("wheel",b,{passive:!1})},[M,v,_,k]),a.useEffect(j,[n,j]),E(v,D),E(p.content,D),l.jsx(ke,{scope:r,scrollbar:v,hasThumb:o,onThumbChange:C(s),onThumbPointerUp:C(i),onThumbPositionChange:j,onThumbPointerDown:C(c),children:l.jsx(N.div,{...f,ref:Y,style:{position:"absolute",...f.style},onPointerDown:P(e.onPointerDown,b=>{b.button===0&&(b.target.setPointerCapture(b.pointerId),y.current=v.getBoundingClientRect(),L.current=document.body.style.webkitUserSelect,document.body.style.webkitUserSelect="none",p.viewport&&(p.viewport.style.scrollBehavior="auto"),I(b))}),onPointerMove:P(e.onPointerMove,I),onPointerUp:P(e.onPointerUp,b=>{const g=b.target;g.hasPointerCapture(b.pointerId)&&g.releasePointerCapture(b.pointerId),document.body.style.webkitUserSelect=L.current,p.viewport&&(p.viewport.style.scrollBehavior=""),y.current=null})})})}),O="ScrollAreaThumb",ne=a.forwardRef((e,t)=>{const{forceMount:r,...n}=e,o=re(O,e.__scopeScrollArea);return l.jsx(W,{present:r||o.hasThumb,children:l.jsx(De,{ref:t,...n})})}),De=a.forwardRef((e,t)=>{const{__scopeScrollArea:r,style:n,...o}=e,s=x(O,r),i=re(O,r),{onThumbPositionChange:c}=i,d=R(t,h=>i.onThumbChange(h)),m=a.useRef(),u=U(()=>{m.current&&(m.current(),m.current=void 0)},100);return a.useEffect(()=>{const h=s.viewport;if(h){const f=()=>{if(u(),!m.current){const p=ze(h,c);m.current=p,c()}};return c(),h.addEventListener("scroll",f),()=>h.removeEventListener("scroll",f)}},[s.viewport,u,c]),l.jsx(N.div,{"data-state":i.hasThumb?"visible":"hidden",...o,ref:d,style:{width:"var(--radix-scroll-area-thumb-width)",height:"var(--radix-scroll-area-thumb-height)",...n},onPointerDownCapture:P(e.onPointerDownCapture,h=>{const p=h.target.getBoundingClientRect(),v=h.clientX-p.left,w=h.clientY-p.top;i.onThumbPointerDown({x:v,y:w})}),onPointerUp:P(e.onPointerUp,i.onThumbPointerUp)})});ne.displayName=O;var F="ScrollAreaCorner",se=a.forwardRef((e,t)=>{const r=x(F,e.__scopeScrollArea),n=!!(r.scrollbarX&&r.scrollbarY);return r.type!=="scroll"&&n?l.jsx(Ie,{...e,ref:t}):null});se.displayName=F;var Ie=a.forwardRef((e,t)=>{const{__scopeScrollArea:r,...n}=e,o=x(F,r),[s,i]=a.useState(0),[c,d]=a.useState(0),m=!!(s&&c);return E(o.scrollbarX,()=>{var h;const u=((h=o.scrollbarX)==null?void 0:h.offsetHeight)||0;o.onCornerHeightChange(u),d(u)}),E(o.scrollbarY,()=>{var h;const u=((h=o.scrollbarY)==null?void 0:h.offsetWidth)||0;o.onCornerWidthChange(u),i(u)}),m?l.jsx(N.div,{...n,ref:t,style:{width:s,height:c,position:"absolute",right:o.dir==="ltr"?0:void 0,left:o.dir==="rtl"?0:void 0,bottom:0,...e.style}}):null});function z(e){return e?parseInt(e,10):0}function le(e,t){const r=e/t;return isNaN(r)?0:r}function H(e){const t=le(e.viewport,e.content),r=e.scrollbar.paddingStart+e.scrollbar.paddingEnd,n=(e.scrollbar.size-r)*t;return Math.max(n,18)}function Oe(e,t,r,n="ltr"){const o=H(r),s=o/2,i=t||s,c=o-i,d=r.scrollbar.paddingStart+i,m=r.scrollbar.size-r.scrollbar.paddingEnd-c,u=r.content-r.viewport,h=n==="ltr"?[0,u]:[u*-1,0];return ae([d,m],h)(e)}function G(e,t,r="ltr"){const n=H(t),o=t.scrollbar.paddingStart+t.scrollbar.paddingEnd,s=t.scrollbar.size-o,i=t.content-t.viewport,c=s-n,d=r==="ltr"?[0,i]:[i*-1,0],m=Ce(e,d);return ae([0,i],[0,c])(m)}function ae(e,t){return r=>{if(e[0]===e[1]||t[0]===t[1])return t[0];const n=(t[1]-t[0])/(e[1]-e[0]);return t[0]+n*(r-e[0])}}function ce(e,t){return e>0&&e<t}var ze=(e,t=()=>{})=>{let r={left:e.scrollLeft,top:e.scrollTop},n=0;return function o(){const s={left:e.scrollLeft,top:e.scrollTop},i=r.left!==s.left,c=r.top!==s.top;(i||c)&&t(),r=s,n=window.requestAnimationFrame(o)}(),()=>window.cancelAnimationFrame(n)};function U(e,t){const r=C(e),n=a.useRef(0);return a.useEffect(()=>()=>window.clearTimeout(n.current),[]),a.useCallback(()=>{window.clearTimeout(n.current),n.current=window.setTimeout(r,t)},[r,t])}function E(e,t){const r=C(t);pe(()=>{let n=0;if(e){const o=new ResizeObserver(()=>{cancelAnimationFrame(n),n=window.requestAnimationFrame(r)});return o.observe(e),()=>{window.cancelAnimationFrame(n),o.unobserve(e)}}},[e,r])}function We(e,t){const{asChild:r,children:n}=e;if(!r)return typeof t=="function"?t(n):t;const o=a.Children.only(n);return a.cloneElement(o,{children:typeof t=="function"?t(o.props.children):t})}var ie=K,He=ee,Ue=se;const de=a.forwardRef(({className:e,children:t,...r},n)=>l.jsxs(ie,{ref:n,className:T("relative overflow-hidden",e),...r,children:[l.jsx(He,{className:"h-full w-full rounded-[inherit]",children:t}),l.jsx(ue,{}),l.jsx(Ue,{})]}));de.displayName=ie.displayName;const ue=a.forwardRef(({className:e,orientation:t="vertical",...r},n)=>l.jsx(V,{ref:n,orientation:t,className:T("flex touch-none select-none transition-colors",t==="vertical"&&"h-full w-2.5 border-l border-l-transparent p-[1px]",t==="horizontal"&&"h-2.5 flex-col border-t border-t-transparent p-[1px]",e),...r,children:l.jsx(ne,{className:"relative flex-1 rounded-full bg-border"})}));ue.displayName=V.displayName;const Ye="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",Me="https://api.groq.com/openai/v1/chat/completions",Xe=async(e,t)=>{var r;try{const n=`You are an AI assistant for the Daily Snap application. Provide direct, clear responses about the user's notes and tasks.
            Never include any <think> tags or thinking process in your response.
            Never explain your reasoning or methodology.
            Just provide the final, polished response that:
            - Is focused on the application data
            - Is clear and concise
            - Directly answers the user's query
            - Is professional but friendly
            - Only discusses tasks, notes, and activity in the app

            Example format:
            User: "What tasks do I have?"
            Assistant: "You have 3 tasks: [list tasks]"

            NOT:
            User: "What tasks do I have?"
            Assistant: "<think>Let me analyze the tasks...</think>
            You have 3 tasks: [list tasks]"`,o=[{role:"system",content:n},{role:"user",content:`User data: ${JSON.stringify(e)}
                    Query: ${t}
                    Remember: Provide ONLY the final response without any thinking process or meta-commentary.`}],s=await fetch(Me,{method:"POST",headers:{Authorization:`Bearer ${Ye}`,"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:n},{role:"user",content:`User data: ${JSON.stringify(e)}
                        Query: ${t}`}],model:"llama3-70b-8192",temperature:.3,max_tokens:1e3})});if(!s.ok){const c=await s.json();throw new Error(`Groq API error: ${s.status} - ${((r=c.error)==null?void 0:r.message)||"Unknown error"}`)}return(await s.json()).choices[0].message.content.trim()}catch(n){throw console.error("Error analyzing notes with Groq:",n),n}},Ve=be("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",{variants:{variant:{default:"bg-background text-foreground",destructive:"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"}},defaultVariants:{variant:"default"}}),he=a.forwardRef(({className:e,variant:t,...r},n)=>l.jsx("div",{ref:n,role:"alert",className:T(Ve({variant:t}),e),...r}));he.displayName="Alert";const Be=a.forwardRef(({className:e,...t},r)=>l.jsx("h5",{ref:r,className:T("mb-1 font-medium leading-none tracking-tight",e),...t}));Be.displayName="AlertTitle";const fe=a.forwardRef(({className:e,...t},r)=>l.jsx("div",{ref:r,className:T("text-sm [&_p]:leading-relaxed",e),...t}));fe.displayName="AlertDescription";const Fe=({notes:e})=>{const[t,r]=a.useState(""),[n,o]=a.useState([]),[s,i]=a.useState(!1),[c,d]=a.useState(null),m=async h=>{if(h.preventDefault(),!t.trim())return;const f={role:"user",content:t};o(p=>[...p,f]),r(""),i(!0),d(null);try{const v={role:"assistant",content:await Xe(e,t)};o(w=>[...w,v])}catch(p){console.error("Error getting AI response:",p),d(p.message||"Failed to get AI response. Please try again.")}finally{i(!1)}},u=()=>{o([]),d(null)};return l.jsx(ye,{className:"w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8",children:l.jsxs("div",{className:"flex flex-col gap-4",children:[l.jsxs("div",{className:"flex items-center justify-between",children:[l.jsx("h2",{className:"text-xl md:text-2xl lg:text-3xl font-semibold",children:"AI Assistant"}),n.length>0&&l.jsxs($,{variant:"ghost",size:"sm",onClick:u,className:"text-gray-500 hover:text-red-500",children:[l.jsx(Pe,{className:"h-4 w-4 mr-2"}),"Clear Chat"]})]}),n.length>0&&l.jsx(de,{className:"min-h-[100px] max-h-[500px] w-full rounded-md border p-4 mb-4",children:l.jsxs("div",{className:"space-y-4",children:[n.map((h,f)=>l.jsx("div",{className:`flex ${h.role==="user"?"justify-end":"justify-start"}`,children:l.jsx("div",{className:`max-w-[80%] rounded-lg p-3 ${h.role==="user"?"bg-primary text-primary-foreground ml-4":"bg-muted mr-4"}`,children:l.jsx("p",{className:"text-sm md:text-base whitespace-pre-wrap",children:h.content})})},f)),s&&l.jsx("div",{className:"flex justify-start",children:l.jsx("div",{className:"bg-muted rounded-lg p-3 mr-4",children:l.jsx(q,{className:"h-4 w-4 animate-spin"})})})]})}),c&&l.jsxs(he,{variant:"destructive",children:[l.jsx(Ae,{className:"h-4 w-4"}),l.jsx(fe,{children:c})]}),l.jsxs("form",{onSubmit:m,className:"flex flex-col md:flex-row gap-2 w-full",children:[l.jsx(Se,{type:"text",value:t,onChange:h=>r(h.target.value),placeholder:"Ask about your tasks, notes, or get a summary of your activity...",className:"flex-1 min-h-[40px] md:min-h-[48px] text-sm md:text-base"}),l.jsx($,{type:"submit",disabled:s,className:"w-full md:w-auto min-h-[40px] md:min-h-[48px]",children:s?l.jsx(q,{className:"h-4 w-4 animate-spin"}):l.jsx(Ee,{className:"h-4 w-4"})})]})]})})},ot=()=>{const{user:e}=ve(),[t,r]=a.useState([]);return a.useEffect(()=>{(async()=>{if(e)try{const{data:o,error:s}=await xe.from("notes").select("*").order("created_at",{ascending:!1});if(s)throw s;const i=o.map(c=>({id:c.id,content:c.content,type:c.type,createdAt:new Date(c.created_at),completed:c.completed,imageUrl:c.image_url,tags:c.tags||[]}));r(i)}catch(o){console.error("Error fetching notes:",o.message)}})()},[e]),l.jsx(ge,{children:l.jsx("div",{className:"min-h-screen bg-gray-50",children:l.jsx("div",{className:"container mx-auto px-4 py-6",children:l.jsxs("div",{className:"max-w-4xl mx-auto",children:[l.jsx("h1",{className:"text-2xl font-bold mb-6",children:"AI Assistant"}),l.jsx(Fe,{notes:t})]})})})})};export{ot as default};
