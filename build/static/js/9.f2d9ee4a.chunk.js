(this["webpackJsonpcubdefi-frontend"]=this["webpackJsonpcubdefi-frontend"]||[]).push([[9],{1086:function(e,a,c){"use strict";c.r(a),c.d(a,"default",(function(){return ca}));var t=c(5),n=c(31),d=c(48),b=c(0),i=c(38),r=c(56),f=c(4),s=c.n(f),o=c(63),l=c(32),x=c(3),j=c(239),u=c(79),O=c(142),p=c(121),m=c(866),h=c(92),g=c(11),v=c(248),w=c(953),k=c(124),y=c(911),P=c(912),S=c(880),B=c(233),C=c(78),A=c(963),T=function(e,a){return e&&a?(e+a).toLocaleString("en-US",{maximumFractionDigits:2}):e?e.toLocaleString("en-US",{maximumFractionDigits:2}):null},N=function(e,a,c,t,n){var d,b,i,r=e.apr,f=e.isKingdom,o=e.poolWeightPCS,l=e.compounding,x=e.lpTokenBalancePCS,j=void 0===x?0:x,u=e.lpTotalInQuoteTokenPCS,O=void 0===u?0:u,p=e.quoteToken.busdPrice,h=e.altPid,g=e.farmType,v=e.beltAPR;if(12===h){var w=new s.a(n.lpTotalInQuoteToken).times(n.quoteToken.busdPrice);i=Object(m.a)(n.poolWeight,n.tokenPriceVsQuote,w);var k=new s.a(i).div(new s.a(365)).toNumber(),y=100*(Math.pow(i/100/l+1,l)-1),P=y,S=P&&P.toLocaleString("en-US",{maximumFractionDigits:2});return{hostApr:i,dailyAPR:k,farmAPY:y,totalAPY:P,totalAPYString:S,newMultiplier:n.multiplier}}if("CAKE"===e.lpSymbol)i=Object(m.b)(Number(e.token.busdPrice),Number(e.token.busdPrice),Object(B.b)(new s.a(j).times(C.i),18),parseFloat("10"));else{var N=new s.a(O).times(p),D=a;"Bakery"===g?D=c:"Belt"===g&&(D=t),i="Belt"===g?Number(v):Object(m.a)(new s.a(o),D,N,f,g)}var L=null!==(d=A[null===(b=e.lpAddresses[56])||void 0===b?void 0:b.toLocaleLowerCase()])&&void 0!==d?d:0,U=T(i,L);"Bakery"===g&&(i=10);var F=i?new s.a(i).div(new s.a(365)).toNumber():new s.a(0).toNumber(),R=100*(Math.pow(i/100/l+1,l)-1);"Pancake v2"===g&&(R=100*(Math.pow(Number(U)/100/l+1,l)-1));var z=r?r+R:R,K=z&&z.toLocaleString("en-US",{maximumFractionDigits:2});return{hostApr:i,dailyAPR:F,farmAPY:R,totalAPY:z,totalAPYString:K,lpRewardsApr:L,aprWithLpRewards:U}},D=c(861),L=c.n(D),U=c(13),F=function(e){var a=e.value,c=e.fontSize,t=e.color,n=e.decimals,d=e.isDisabled,i=e.unit,r=e.bold,f=Object(b.useRef)(0);return Object(b.useEffect)((function(){f.current=a}),[a]),Object(U.jsxs)(l.O,{bold:r,color:d?"textDisabled":t,fontSize:c,children:[Object(U.jsx)(L.a,{start:f.current,end:a,decimals:n,duration:1,separator:","}),a&&i&&Object(U.jsx)("span",{children:i})]})};F.defaultProps={fontSize:"32px",isDisabled:!1,color:"text",decimals:3};var R,z,K,Q,q,E,I,M,Y,V,W,$,G,J,H,X,Z,_,ee,ae,ce,te,ne,de,be,ie=F,re=c(867),fe=c(1),se=c.n(fe),oe=c(6),le=c(862),xe=c(885),je=c(886),ue=c(874),Oe=c(884),pe=c(865),me=c(868),he=c(881),ge=c(68),ve=c(853),we=(c(964),x.e.div(R||(R=Object(d.a)(["\n  align-self: baseline;\n  /*background: ",";\n  border-radius: 8px;\n  box-shadow: 0 3px 4px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);*/\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  /*padding: 6px 12px;*/\n  position: relative;\n  margin-top: 0.5rem;\n  margin-bottom: 1rem;\n"])),(function(e){return e.theme.card.background}))),ke=Object(x.e)(l.h)(z||(z=Object(d.a)(["\n  height: 40px;\n  margin-top: 0.3rem;\n  display: block;\n"]))),ye=x.e.div(K||(K=Object(d.a)(["\n  display: flex;\n"]))),Pe=x.e.span(Q||(Q=Object(d.a)(["\n  color: ",";\n"])),(function(e){return e.theme.colors.text})),Se=function(e){var a=e.farm,c=e.walletBalance,t=e.depositBalance,d=e.rewardBalance,r=e.walletBalanceQuoteValue,f=e.depositBalanceQuoteValue,o=e.addLiquidityUrl,x=e.account,j=e.cakePrice,O=e.bnbDividends,p=Object(i.f)(),m=Object(u.a)("BNB-BUSD LP"),h=Object(b.useState)(!1),v=Object(n.a)(h,2),w=v[0],k=v[1],y=Object(b.useState)(!1),P=Object(n.a)(y,2),S=P[0],B=P[1],A=Object(b.useState)(!1),T=Object(n.a)(A,2),N=T[0],D=T[1],L=a.pid,F=a.isTokenOnly,R=a.isKingdom,z=a.isKingdomToken,K=a.lpSymbol,Q=a.lpAddresses,q=a.token.address,E=K.toUpperCase(),I=a.userData||{},M=I.allowance,Y=void 0===M?0:M,V=I.tokenBalance,W=void 0===V?0:V,$=I.stakedBalance,G=void 0===$?0:$,J=new s.a(Y),H=new s.a(W),X=new s.a(G),Z=d?new s.a(d).multipliedBy(j).toNumber():0,_=Object(ve.a)(),ee=Object(ue.a)(L,R).onStake,ae=Object(Oe.a)(L,R).onUnstake,ce=Object(pe.b)(L,R).onReward,te=Object(he.a)(O||{}).onClaim,ne=x&&J&&J.isGreaterThan(0),de=Object(l.W)(Object(U.jsx)(xe.a,{max:H,onConfirm:ee,tokenName:E,addLiquidityUrl:o,isTokenOnly:F,isKingdomToken:z})),be=Object(n.a)(de,1)[0],re=Object(l.W)(Object(U.jsx)(je.a,{max:X,onConfirm:ae,tokenName:E,isTokenOnly:F,isKingdomToken:z})),fe=Object(n.a)(re,1)[0],Se=Object(g.a)(Q),Be=Object(g.a)(q),Ce=Object(b.useMemo)((function(){return F||z?Object(ge.a)(Be,_):Object(ge.a)(Se,_)}),[Se,F,_,Be,z]),Ae=Object(me.a)(Ce,R).onApprove,Te=Object(b.useCallback)(Object(oe.a)(se.a.mark((function e(){return se.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,k(!0),e.next=4,Ae();case 4:k(!1),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.error(e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])}))),[Ae]),Ne=Object(U.jsx)(ke,{mt:"8px",disabled:w||p.pathname.includes("archived"),onClick:Te,children:"Approve Contract"}),De=O&&O.amount?new s.a(O.amount).div(C.i).toNumber():0,Le=De?new s.a(De).multipliedBy(m).toNumber():0,Ue=null;return Ue="CUB"===a.lpSymbol?Object(U.jsxs)(U.Fragment,{children:[Object(U.jsx)(l.O,{children:"BNB Dividends"}),Object(U.jsxs)(ye,{children:[Object(U.jsx)(ie,{fontSize:"16px",value:De,decimals:De?3:2,unit:""}),"\xa0",Object(U.jsx)(Pe,{children:"("}),Object(U.jsx)(le.a,{value:Le}),Object(U.jsx)(Pe,{children:")"})]}),Object(U.jsx)(ke,{disabled:0===De||N||!ne,onClick:Object(oe.a)(se.a.mark((function e(){return se.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return D(!0),e.next=3,te();case 3:D(!1);case 4:case"end":return e.stop()}}),e)}))),children:"Claim"})]}):Object(U.jsxs)(U.Fragment,{children:[Object(U.jsx)(l.O,{children:"CUB Rewards"}),Object(U.jsxs)(ye,{children:[Object(U.jsx)(ie,{fontSize:"16px",value:d,decimals:d?3:2,unit:""}),"\xa0",Object(U.jsx)(Pe,{children:"("}),Object(U.jsx)(le.a,{value:Z}),Object(U.jsx)(Pe,{children:")"})]}),Object(U.jsx)(ke,{disabled:0===d||S||!ne,onClick:Object(oe.a)(se.a.mark((function e(){return se.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return B(!0),e.next=3,ce();case 3:B(!1);case 4:case"end":return e.stop()}}),e)}))),children:"Harvest"})]}),Object(U.jsx)(we,{children:Object(U.jsx)("div",{className:"k-card",children:Object(U.jsxs)("div",{className:"flex-grid",children:[Object(U.jsxs)("div",{className:"col",children:[Object(U.jsx)(l.t,{justifyContent:"space-between",children:Object(U.jsx)(l.O,{children:"Balance (Wallet)"})}),Object(U.jsxs)(ye,{children:[Object(U.jsx)(ie,{fontSize:"16px",value:c,decimals:c?3:2,unit:""}),"\xa0",Object(U.jsx)(Pe,{children:"("}),Object(U.jsx)(le.a,{value:r}),Object(U.jsx)(Pe,{children:")"})]}),ne?Object(U.jsx)(ke,{mt:"8px",fullWidth:!0,onClick:be,children:"Deposit"}):Ne]}),Object(U.jsxs)("div",{className:"col",children:[Object(U.jsx)(l.t,{justifyContent:"space-between",children:Object(U.jsx)(l.O,{children:"Deposit (Staked)"})}),Object(U.jsxs)(ye,{children:[Object(U.jsx)(ie,{fontSize:"16px",value:t,decimals:t?3:2,unit:""}),"\xa0",Object(U.jsx)(Pe,{children:"("}),Object(U.jsx)(le.a,{value:f}),Object(U.jsx)(Pe,{children:")"})]}),ne?Object(U.jsx)(ke,{mt:"8px",fullWidth:!0,onClick:fe,children:"Withdraw"}):Ne]}),Object(U.jsx)("div",{className:"col",children:Ue})]})})})},Be=c(906),Ce=function(e){var a=e.aprApy,c=e.lpLabel,t=e.addLiquidityUrl,n=a.farmAPR,d=a.apr,b=a.compounding,i=a.hostApr,r=a.dailyAPR,f=a.farmAPY,o=a.totalAPYString,x=a.cakePrice,j=a.aprWithLpRewards,u=a.lpRewardsApr;return Object(U.jsxs)(U.Fragment,{children:[Object(U.jsxs)(l.t,{justifyContent:"space-between",children:[Object(U.jsx)(l.O,{color:"warning",children:"Total APY:"}),Object(U.jsxs)(l.O,{bold:!0,color:"warning",children:[o,"%"]})]}),Object(U.jsxs)(l.t,{justifyContent:"space-between",children:[Object(U.jsx)(l.O,{children:"Farm APR:"}),Object(U.jsx)(l.O,{children:"".concat(new s.a(i).toFixed(2),"% (").concat(new s.a(r).toFixed(3),"%)")})]}),u?Object(U.jsxs)(l.t,{justifyContent:"space-between",children:[Object(U.jsx)(l.O,{children:"APR+LP rewards:"}),Object(U.jsxs)(l.O,{children:[j,"%"]})]}):null,Object(U.jsxs)(l.t,{justifyContent:"space-between",children:[Object(U.jsx)(l.O,{children:"Compounds / year:"}),Object(U.jsxs)(l.O,{children:["~",b]})]}),Object(U.jsxs)(l.t,{justifyContent:"space-between",children:[Object(U.jsx)(l.O,{children:"Farm APY:"}),Object(U.jsx)(ie,{fontSize:"16px",value:f,decimals:2,unit:"%"})]}),Object(U.jsxs)(l.t,{justifyContent:"space-between",alignItems:"center",children:[Object(U.jsx)(l.O,{children:"CUB APR:"}),Object(U.jsx)(l.O,{bold:!0,style:{display:"flex",alignItems:"center"},children:d?Object(U.jsxs)(U.Fragment,{children:[Object(U.jsx)(Be.a,{lpLabel:c,addLiquidityUrl:t,cakePrice:x,apr:d}),n||d.toLocaleString("en-US",{maximumFractionDigits:2}),"%"]}):Object(U.jsx)(l.L,{height:24,width:80})})]})]})},Ae=x.e.div(q||(q=Object(d.a)(["\n  margin-top: 1rem;\n  display: flex;\n  justify-content: space-between;\n  /*padding-left: 0.8rem;\n  padding-right: 0.8rem;*/\n  /*font-size: 0.95rem*/\n"]))),Te=x.e.div(E||(E=Object(d.a)(["\n  /*display: inline;\n  margin-right: 1rem;*/\n  /*& div {\n    font-family: Arial;\n    font-size: 0.8rem;\n    padding: 2px;\n  }*/\n  &:nth-child(1) {\n    width: 25%\n  }\n  &:nth-child(2) {\n    width: 33%\n  }\n"]))),Ne=x.e.div(I||(I=Object(d.a)(["\n  /*background: ",";\n  border-radius: 8px;\n  box-shadow: 0 3px 4px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);*/\n"])),(function(e){return e.theme.card.background})),De=Object(x.e)(l.z)(M||(M=Object(d.a)(["\n  font-weight: 400;\n"]))),Le=x.e.div(Y||(Y=Object(d.a)(["\n  color: ",";\n  margin-top: 0.2rem;\n"])),(function(e){return e.theme.colors.text})),Ue=function(e){var a=e.farm,c=e.walletBalance,t=e.depositBalance,n=e.rewardBalance,d=e.walletBalanceQuoteValue,b=e.depositBalanceQuoteValue,i=e.farmName,r=e.oneTokenQuoteValue,f=e.removed,s=e.aprApy,o=e.account,x=e.cakePrice,j=e.bnbDividends,u=r&&"NaN"!==r.toString()?"~$".concat(r.times(C.i).toFixed(2)):"-",O=a.lpSymbol,p=a.multiplier,m=a.quoteToken,h=a.token,g=a.lpAddresses,v=a.isTokenOnly,w=a.isKingdomToken,k=a.kingdomContract,y=a.altPid,P=O&&O.toUpperCase().replace("PANCAKE",""),S=Object(re.a)({quoteTokenAddress:m.address,tokenAddress:h.address}),B=g[56],A=h.address[56],T="https://bscscan.com/token/".concat(v||w?A:B),N="https://bscscan.com/address/".concat(k),D="https://pancakeswap.info/pair/".concat(v?A:B),L=C.k,F="".concat(C.l,"/swap/").concat(h.address[56]),R="".concat(L,"/").concat(S);"Bakery"===a.farmType?(L=C.a,R="".concat(L,"/").concat(S),D="https://info.bakeryswap.org/#/pair/".concat(v?A:B)):"Belt"===a.farmType&&(R=L=C.d,F=L,D=L);var z=p;return s.newMultiplier&&(z="".concat(s.newMultiplier,"*")),Object(U.jsxs)(Ne,{children:[Object(U.jsx)(Se,{farm:a,walletBalance:c,depositBalance:t,rewardBalance:n,walletBalanceQuoteValue:d,depositBalanceQuoteValue:b,addLiquidityUrl:R,account:o,cakePrice:x,bnbDividends:j}),Object(U.jsxs)(Ae,{className:"k-details",children:[Object(U.jsxs)(Te,{children:[Object(U.jsxs)(l.t,{justifyContent:"space-between",children:[Object(U.jsxs)(l.O,{children:[O,":"]}),Object(U.jsxs)(l.O,{children:["(",u,")"]})]}),Object(U.jsxs)(l.t,{justifyContent:"space-between",children:[Object(U.jsx)(l.O,{children:"Multiplier:"}),Object(U.jsx)(l.O,{children:z})]}),Object(U.jsxs)(l.t,{justifyContent:"space-between",children:[Object(U.jsx)(l.O,{children:"Type:"}),Object(U.jsx)(l.O,{children:"Auto-compound"})]}),12===y?Object(U.jsx)(Le,{children:"*CUB Kingdom multiplier coexists with CUB Den multiplier"}):Object(U.jsxs)(l.t,{justifyContent:"space-between",children:[Object(U.jsx)(l.O,{children:"Farm:"}),Object(U.jsx)(l.O,{children:i})]})]}),Object(U.jsx)(Te,{children:Object(U.jsx)(Ce,{aprApy:s,lpLabel:P,addLiquidityUrl:R})}),Object(U.jsxs)(Te,{children:[Object(U.jsx)(De,{external:!0,href:T,children:"Farm Contract"}),Object(U.jsx)(De,{external:!0,href:N,children:"Kingdom Contract"}),!f&&Object(U.jsxs)(U.Fragment,{children:[Object(U.jsx)(De,{external:!0,href:F,children:"Buy ".concat(h.symbol)}),Object(U.jsx)(De,{external:!0,href:R,children:"Add Liquidity"})]}),Object(U.jsx)(De,{external:!0,href:D,children:"See Token Info"})]})]})]})},Fe=x.e.div(V||(V=Object(d.a)(["\n  background-color: ",";\n  opacity: 0.2;\n  height: 1px;\n  margin: 12px auto;\n  width: 100%;\n"])),(function(e){return e.theme.colors.primary})),Re=x.e.div(W||(W=Object(d.a)(["\n  height: 1px;\n  margin: 12px auto;\n  width: 100%;\n"]))),ze=x.e.div($||($=Object(d.a)(["\n  height: ",";\n  overflow: hidden;\n"])),(function(e){return e.expanded?"100%":"0px"})),Ke=x.e.div(G||(G=Object(d.a)(["\n  align-self: baseline;\n  background: ",";\n  border-radius: 8px;\n  box-shadow: 0 3px 4px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  padding: 0.4rem 0.8rem;\n  position: relative;\n"])),(function(e){return e.theme.card.background})),Qe=Object(x.f)(J||(J=Object(d.a)(["\n\t0% {\n\t\tbackground-position: 0% 50%;\n\t}\n\t50% {\n\t\tbackground-position: 100% 50%;\n\t}\n\t100% {\n\t\tbackground-position: 0% 50%;\n\t}\n"]))),qe=x.e.div(H||(H=Object(d.a)(["\n  background: linear-gradient(\n    45deg,\n    rgba(255, 0, 0, 1) 0%,\n    rgba(255, 154, 0, 1) 10%,\n    rgba(208, 222, 33, 1) 20%,\n    rgba(79, 220, 74, 1) 30%,\n    rgba(63, 218, 216, 1) 40%,\n    rgba(47, 201, 226, 1) 50%,\n    rgba(28, 127, 238, 1) 60%,\n    rgba(95, 21, 242, 1) 70%,\n    rgba(186, 12, 248, 1) 80%,\n    rgba(251, 7, 217, 1) 90%,\n    rgba(255, 0, 0, 1) 100%\n  );\n  background-size: 300% 300%;\n  animation: "," 2s linear infinite;\n  border-radius: 8px;\n  filter: blur(6px);\n  position: absolute;\n  top: -2px;\n  right: -2px;\n  bottom: -2px;\n  left: -2px;\n  z-index: -1;\n"])),Qe),Ee=Object(x.e)(l.x)(X||(X=Object(d.a)(["\n  width: 64px;\n"]))),Ie=x.e.div(Z||(Z=Object(d.a)(["\n  cursor: pointer;\n"]))),Me=function(e){var a=e.farm,c=e.removed,d=e.cakePrice,i=e.account,r=e.bakePrice,f=e.beltPrice,o=e.cubDen,x=e.realCakePrice,j=e.bnbDividends,u=Object(b.useState)(!1),O=Object(n.a)(u,2),p=O[0],m=O[1],h=a.apr,g=a.lpTotalInQuoteToken,v=a.lpSymbol,w=a.lpTokenBalancePCS,k=void 0===w?0:w,y=a.lpTotalInQuoteTokenPCS,P=void 0===y?0:y,S=a.quoteToken.busdPrice,A=a.altPid,T=a.farmType,D=a.token.busdPrice,L=a.compounding,F=v.split(" ")[0].toLocaleLowerCase(),R=N(a,x,r,f,o),z=R,K=z.dailyAPR,Q=z.totalAPY,q=z.hostApr,E=a.userData,I=E.tokenBalance,M=E.stakedBalance,Y=E.earnings,V=I?Object(B.b)(new s.a(I)):0,W=M?Object(B.b)(new s.a(M)):0,$=Y?Object(B.b)(new s.a(Y)):0,G=new s.a(D),J=new s.a(0);J=a.isKingdomToken?"Belt"!==a.farmType?G.div(C.i):new s.a(a.token.busdPrice).div(C.i):P?new s.a(P).div(new s.a(k)).times(S).div(C.i):new s.a(0);var H=I?new s.a(I).times(J).toNumber():0,X=M?new s.a(M).times(J).toNumber():0,Z=g?"$".concat(Number(new s.a(g).times(S)).toLocaleString(void 0,{maximumFractionDigits:0})):"-",_=h&&h.toLocaleString("en-US",{maximumFractionDigits:2});return R=Object(t.a)(Object(t.a)({},R),{},{compounding:L,farmAPR:_,apr:12===A?q:h,cakePrice:d,quoteTokenPriceUsd:Number(S),lpTotalInQuoteToken:g}),Object(U.jsxs)(U.Fragment,{children:[Object(U.jsx)(Re,{}),Object(U.jsxs)(Ke,{children:["CUB"===a.token.symbol&&Object(U.jsx)(qe,{}),Object(U.jsxs)(Ie,{role:"presentation",className:"flex-grid k-grid",onClick:function(){return m(!p)},children:[Object(U.jsx)("div",{className:"col",children:Object(U.jsx)(Ee,{src:"/images/farms/".concat(F,".png"),alt:v,width:64,height:64})}),Object(U.jsxs)("div",{className:"col",children:[Object(U.jsx)(l.t,{justifyContent:"flex-start",alignItems:"center",children:"Bakery"===T?Object(U.jsxs)(l.O,{className:"token inactive",children:[v," ",Object(U.jsx)("span",{style:{position:"absolute"},children:"\xa0(DEPRECATED) - Migrate to PCSv2 BTC-BNB Kingdom"})]}):Object(U.jsx)(l.O,{className:"token",children:v})}),Object(U.jsxs)(l.O,{children:["Uses: ",T]}),Object(U.jsxs)(l.O,{children:["TVL ",Z]})]}),Object(U.jsxs)("div",{className:"col",children:[Object(U.jsx)(ie,{fontSize:"16px",value:V,decimals:V?2:1,unit:"",color:V?"warning":"text"}),Object(U.jsx)(l.O,{children:"Balance"})]}),Object(U.jsxs)("div",{className:"col",children:[Object(U.jsx)(ie,{fontSize:"16px",value:W,decimals:W?2:1,unit:"",color:W>1e-7?"warning":"text"}),Object(U.jsx)(l.O,{children:"Deposited"})]}),Object(U.jsxs)("div",{className:"col",children:[Object(U.jsx)(ie,{fontSize:"16px",value:$,decimals:$?2:1,unit:"",color:$?"warning":"text"}),Object(U.jsx)(l.O,{children:"Rewards"})]}),Object(U.jsxs)("div",{className:"col",children:[Object(U.jsx)(ie,{fontSize:"16px",value:"NaN"!==Q.toString()?Q:0,decimals:2,unit:"%",color:"warning"}),Object(U.jsx)(l.O,{color:"warning",children:"APY"})]}),Object(U.jsxs)("div",{className:"col",children:[Object(U.jsx)(ie,{fontSize:"16px",value:K,decimals:2,unit:"%"}),Object(U.jsx)(l.O,{children:"Daily"})]})]}),Object(U.jsxs)(ze,{expanded:p,children:[Object(U.jsx)(Fe,{}),Object(U.jsx)(Ue,{farm:a,walletBalance:V,depositBalance:W,rewardBalance:$,walletBalanceQuoteValue:H,depositBalanceQuoteValue:X,farmName:T,oneTokenQuoteValue:J,removed:c,aprApy:R,account:i,cakePrice:d,bnbDividends:j})]})]})]})},Ye=Object(x.e)(l.O)(_||(_=Object(d.a)(["\n  line-height: 1.5;\n\n"]))),Ve=function(e){var a=e.value,c=e.decimals,t=e.prefix,n=e.fontSize,d=void 0===n?"16px":n,i=Object(D.useCountUp)({start:0,end:a,duration:1,separator:",",decimals:void 0!==c?c:a<0?4:a>1e5?0:3}),r=i.countUp,f=i.update,s=Object(b.useRef)(f);return Object(b.useEffect)((function(){s.current(a)}),[a,s]),Object(U.jsxs)(Ye,{fontSize:d,children:[t,r]})},We=c(27),$e=function(e,a,c,t,n){var d=We.b,b=We.b,i=0,r=0,f=0;e.forEach((function(e){if(e.isKingdom){var o=e.userData,l=e.lpTotalInQuoteTokenPCS,x=void 0===l?0:l,j=e.lpTokenBalancePCS,u=void 0===j?0:j,O=e.quoteToken.busdPrice,p=e.token.busdPrice,m=o.stakedBalance,h=o.earnings,g=N(e,a,c,t,n);if(m>"1"){var v=We.b;v=e.isKingdomToken?"Belt"!==e.farmType?p:new s.a(e.token.busdPrice):x?new s.a(x).div(new s.a(u)).times(O):new s.a(0);var w=m?new s.a(m).times(v):new s.a(0);b=b.plus(new s.a(w)),i=+i+ +g.totalAPY,r=+r+ +g.dailyAPR,f+=1}"0"!==h&&(d=d.plus(new s.a(h)))}}));var o=b!==We.b?Object(B.b)(b):0,l=d!==We.b?Object(B.b)(d):0;return[o,l,l?new s.a(l).multipliedBy(a).toNumber():0,i,r,f]},Ge=x.e.div(ee||(ee=Object(d.a)(["\n  max-width: 700px;\n  margin: 0 auto;\n"]))),Je=function(e){var a=e.farms,c=e.cakePrice,t=e.bakePrice,d=e.beltPrice,b=e.cubDen,i=$e(a,c,t,d,b),r=Object(n.a)(i,6),f=r[0],s=r[1],o=r[2],x=r[3],j=r[4],u=r[5],O="NaN"!==x.toString()&&0!==x?x/u:0,p=j?j/u:0,m=f?"$".concat(f.toLocaleString("en-US",{maximumFractionDigits:2})):"0.00",h=p?"".concat(p.toLocaleString("en-US",{maximumFractionDigits:2}),"%"):"0.00",g=o?"$".concat(o.toLocaleString("en-US",{maximumFractionDigits:2})):"0.00";return Object(U.jsx)(Ge,{children:Object(U.jsxs)(l.t,{justifyContent:"space-between",alignItems:"flex-start",children:[Object(U.jsxs)("div",{children:[Object(U.jsx)(l.O,{children:"Total Deposit"}),Object(U.jsx)(l.O,{fontSize:"18px",color:"textSubtle",children:m}),Object(U.jsxs)(l.O,{children:[u," assets"]})]}),Object(U.jsxs)("div",{children:[Object(U.jsx)(l.O,{children:"Average APY"}),Object(U.jsx)(ie,{fontSize:"18px",value:O,decimals:O?2:1,unit:"%",color:"textSubtle"}),Object(U.jsxs)(l.O,{children:["Daily ",h]})]}),Object(U.jsxs)("div",{children:[Object(U.jsx)(l.O,{children:"CUB Rewards"}),Object(U.jsx)(ie,{fontSize:"18px",value:s,decimals:s?2:1,unit:"",color:"textSubtle"}),Object(U.jsx)(l.O,{children:g})]})]})})},He=(c(965),x.e.div(ae||(ae=Object(d.a)(["\n  display: flex;\n  width: 100%;\n  align-items: center;\n  position: relative;\n\n  justify-content: space-between;\n  flex-direction: column;\n  margin-bottom: 32px;\n\n  "," {\n    flex-direction: row;\n    flex-wrap: wrap;\n    padding: 16px 32px;\n    margin-bottom: 0;\n  }\n"])),(function(e){return e.theme.mediaQueries.sm}))),Xe=x.e.div(ce||(ce=Object(d.a)(["\n  display: flex;\n  align-items: center;\n  margin-left: 10px;\n\n  "," {\n    margin-left: 8px;\n  }\n"])),l.O),Ze=x.e.div(te||(te=Object(d.a)(["\n  > "," {\n    font-size: 12px;\n  }\n"])),l.O),_e=x.e.div(ne||(ne=Object(d.a)(["\n  display: flex;\n  align-items: center;\n  width: 100%;\n  padding: 8px 0px;\n\n  "," {\n    width: auto;\n    padding: 0;\n  }\n"])),(function(e){return e.theme.mediaQueries.sm})),ea=x.e.div(de||(de=Object(d.a)(["\n  flex-wrap: wrap;\n  justify-content: space-between;\n  display: flex;\n  align-items: center;\n  width: 100%;\n\n  > div {\n    padding: 8px 0px;\n  }\n\n  "," {\n    justify-content: flex-start;\n    width: auto;\n\n    > div {\n      padding: 0;\n    }\n  }\n"])),(function(e){return e.theme.mediaQueries.sm})),aa=x.e.div(be||(be=Object(d.a)(["\n  max-width: 400px;\n"]))),ca=function(){var e=Object(u.l)(),a=Object(i.f)().pathname,c=Object(u.d)().data,d=Object(b.useState)(""),f=Object(n.a)(d,2),x=f[0],B=f[1],C=Object(o.c)().account,A=Object(b.useState)("hot"),T=Object(n.a)(A,2),N=T[0],D=T[1],L=Object(u.h)(),F=Object(u.i)(),R=Object(u.a)("CAKE")||new s.a(0),z=Object(u.a)("BAKE-BNB LP"),K=Object(u.a)("BELT-BNB LP"),Q=Object(u.b)(12),q=Object(S.a)()||{},E=Object(r.b)(),I=Object(O.a)().fastRefresh;Object(b.useEffect)((function(){C&&E(Object(p.a)(C))}),[C,E,I]);var M=a.includes("archived"),Y=!a.includes("history")&&!M,V=Object(b.useState)(!Y),W=Object(n.a)(V,2),$=W[0],G=W[1];Object(b.useEffect)((function(){G(!Y)}),[Y]),Object(b.useEffect)((function(){E(Object(k.d)(M)),M&&(E(Object(k.c)()),C&&E(Object(p.a)(C)))}),[M,E,C]);var J=c.filter((function(e){return e.isKingdom&&!Object(v.a)(e.pid)})),H=c.filter((function(e){return e.isKingdom&&"0X"===e.multiplier&&!Object(v.a)(e.pid)})),X=J.filter((function(e){return e.userData&&new s.a(e.userData.stakedBalance).isGreaterThan(0)})),Z=(H.filter((function(e){return e.userData&&new s.a(e.userData.stakedBalance).isGreaterThan(0)})),Object(b.useCallback)((function(e){var a=e.map((function(e){if(!e.lpTotalInQuoteToken||!L)return e;var a=L[Object(g.a)(e.quoteToken.address).toLowerCase()],c=new s.a(e.lpTotalInQuoteToken).times(a),n=Y?Object(m.a)(e.poolWeight,F,c):0;return Object(t.a)(Object(t.a)({},e),{},{apr:n,liquidity:c})}));if(x){var c=x.toLowerCase();a=a.filter((function(e){return e.lpSymbol.toLowerCase().includes(c)}))}return a}),[F,L,x,Y])),_=Object(b.useRef)(null),ee=Object(b.useState)(20),ae=Object(n.a)(ee,2),ce=ae[0],te=ae[1],ne=Object(b.useState)(!1),de=Object(n.a)(ne,2),be=de[0],ie=de[1],re=Object(b.useMemo)((function(){var e=[];return Y&&(e=Z($?X:J)),function(e){switch(N){case"apr":return Object(h.orderBy)(e,(function(e){return e.apr}),"desc");case"multiplier":return Object(h.orderBy)(e,(function(e){return e.multiplier?Number(e.multiplier.slice(0,-1)):0}),"desc");case"earned":return Object(h.orderBy)(e,(function(e){return e.userData?e.userData.earnings:0}),"desc");case"liquidity":return Object(h.orderBy)(e,(function(e){return Number(e.liquidity)}),"desc");default:return e}}(e).slice(0,ce)}),[N,J,Z,Y,$,X,ce]);Object(b.useEffect)((function(){be||(new IntersectionObserver((function(e){Object(n.a)(e,1)[0].isIntersecting&&te((function(e){return e+20}))}),{rootMargin:"0px",threshold:1}).observe(_.current),ie(!0))}),[re,be]);return Object(U.jsxs)(U.Fragment,{children:[Object(U.jsxs)(w.a,{children:[Object(U.jsxs)("div",{className:"k-header",children:[Object(U.jsx)(l.u,{as:"h1",size:"xxl",color:"secondary",mb:"10px",children:"Kingdoms"}),Object(U.jsxs)(l.t,{children:[Object(U.jsx)(l.O,{bold:!0,fontSize:"24px",children:"TVL\xa0"}),Object(U.jsx)(Ve,{fontSize:"24px",value:e.toNumber(),prefix:"$",decimals:2})]})]}),Object(U.jsx)(l.u,{as:"h1",size:"lg",color:"primary",mb:"10px",style:{textAlign:"left"},children:"Composable Auto-Compounding"}),Object(U.jsx)(l.u,{as:"h2",color:"secondary",mb:"10px",style:{textAlign:"left"},children:"Stake tokens for cross-platform farming plus CUB rewards"}),Object(U.jsx)(l.u,{as:"h2",color:"warning",mb:"10px",style:{textAlign:"left"},children:"IMPORTANT: Must use the host farm exchange (eg. PCS, Bakery) for Kingdom LP tokens"}),Object(U.jsx)(l.u,{as:"h2",color:"warning",mb:"10px",style:{textAlign:"left"},children:"CertiK Audit is Pending: Our other contracts have been audited by CertiK and Kingdoms are currently under review. Please use at your own discretion until the audit has been published"}),Object(U.jsxs)(aa,{children:[Object(U.jsx)(l.u,{as:"h2",color:"secondary",mb:"5px",style:{textAlign:"left"},children:"Fees"}),Object(U.jsxs)(l.t,{justifyContent:"space-between",children:[Object(U.jsx)(l.O,{children:"Fee for CUB Staking Kingdom BNB Dividends:"}),Object(U.jsx)(l.O,{children:"3%"})]}),Object(U.jsxs)(l.t,{justifyContent:"space-between",children:[Object(U.jsx)(l.O,{children:"Management Fee:"}),Object(U.jsx)(l.O,{children:"7%"})]}),Object(U.jsxs)(l.t,{justifyContent:"space-between",children:[Object(U.jsx)(l.O,{children:"CUB Burn Rate:"}),Object(U.jsx)(l.O,{children:"100% of Fees Buyback and Burn CUB"})]}),Object(U.jsxs)(l.t,{justifyContent:"space-between",children:[Object(U.jsx)(l.O,{children:"Withdrawal Fee:"}),Object(U.jsx)(l.O,{children:"None"})]})]})]}),Object(U.jsxs)(j.a,{className:"k-container",children:[Object(U.jsx)(Je,{farms:re,cakePrice:F,bakePrice:z,beltPrice:K,cubDen:Q}),Object(U.jsxs)(He,{children:[Object(U.jsx)(ea,{children:Object(U.jsxs)(Xe,{children:[Object(U.jsx)(l.P,{checked:$,onChange:function(){return G(!$)},scale:"sm"}),Object(U.jsx)(l.O,{children:"Staked only"})]})}),Object(U.jsxs)(_e,{children:[Object(U.jsxs)(Ze,{children:[Object(U.jsx)(l.O,{children:"SORT BY"}),Object(U.jsx)(y.a,{options:[{label:"Default",value:"default"},{label:"APR",value:"apr"},{label:"Multiplier",value:"multiplier"},{label:"Earned",value:"earned"},{label:"Liquidity",value:"liquidity"}],onChange:function(e){D(e.value)}})]}),Object(U.jsxs)(Ze,{style:{marginLeft:16},children:[Object(U.jsx)(l.O,{children:"SEARCH"}),Object(U.jsx)(P.a,{onChange:function(e){B(e.target.value)}})]})]})]}),Object(U.jsx)("div",{id:"kingdoms",children:re.map((function(e){return Object(U.jsx)(Me,{farm:e,cakePrice:F,account:C,removed:!1,bakePrice:z,beltPrice:K,cubDen:Q,realCakePrice:R,bnbDividends:q},e.pid)}))}),Object(U.jsx)("div",{ref:_})]})]})}},880:function(e,a,c){"use strict";var t=c(1),n=c.n(t),d=c(6),b=c(31),i=c(0),r=c(63),f=c(186),s=c.n(f),o=c(142);a.a=function(){var e=Object(i.useState)(),a=Object(b.a)(e,2),c=a[0],t=a[1],f=Object(r.c)().account,l=Object(o.a)().fastRefresh;return Object(i.useEffect)((function(){f&&function(){var e=Object(d.a)(n.a.mark((function e(){var a;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.a.get("https://bnb.fbslo.net/?address=".concat(f),{timeout:7e3}).then((function(e){return e.data})).catch((function(e){return console.log("error",e),{error:!0}}));case 2:a=e.sent,t(a);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()()}),[f,l]),c}},881:function(e,a,c){"use strict";c.d(a,"a",(function(){return l}));var t=c(1),n=c.n(t),d=c(6),b=c(0),i=c(63),r=c(56),f=c(121),s=c(852),o=c(851),l=function(e){var a=Object(r.b)(),c=Object(i.c)().account,t=Object(o.a)(),l=e.user,x=void 0===l?"":l,j=e.amount,u=void 0===j?"":j,O=e.nonce,p=void 0===O?"":O,m=e.signature,h=void 0===m?"":m;return{onClaim:Object(b.useCallback)(Object(d.a)(n.a.mark((function e(){var d;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(s.b)(t,c,x,u,p,h);case 2:return d=e.sent,a(Object(f.a)(c)),e.abrupt("return",d);case 5:case"end":return e.stop()}}),e)}))),[a,c,x,u,p,h,t])}}},963:function(e){e.exports=JSON.parse('{"0x00e53c169da54a7e11172aeedf8eb87f060f479e":32.3,"0x0ecc84c9629317a494f12bc56aa2522475bf32e8":3.77,"0x0ed7e52944161450477ee417de9cd3a859b14fd0":3.49,"0x109cbffe72c02f26536ff8b92278dfd3610de656":15.97,"0x1472976e0b97f5b2fc93f1fff14e2b5c4447b64f":37.12,"0x1cc18962b919ef90085a8b21f8ddc95824fbad9e":3.15,"0x2bf2deb40639201c9a94c9e33b4852d9aea5fd2d":55.06,"0x2e28b9b74d6d99d4697e913b82b41ef1cac51c6c":1.56,"0x3747e3e107223539fd09bb730b055a1f11f78adf":16.06,"0x37ff7d4459ad96e0b01275e5efffe091f33c2cad":10,"0x3c2b7b578dd2175a1c3524aa0d515106282bf108":55.02,"0x3edb06e2d182d133864fe7c0f9b4c204bbf61d4e":6.05,"0x4ddd56e2f34338839bb5953515833950ea680afb":8.18,"0x58f876857a02d6762e0101bb5c46a8c1ed44dc16":18.05,"0x59fac9e98479fc9979ae2a0c7422af50bcbb9b26":15.34,"0x5b0a3b98c2f01741a11e57a9d0595b254e62f9f2":1.19,"0x5d937c3966002cbd9d32c890a59439b4b300a14d":14.19,"0x67efef66a55c4562144b9acfcfbc62f9e4269b3e":5.37,"0x69dee989c30b5ffe40867f5fc14f00e4bce7b681":4.36,"0x6a445ceb72c8b1751755386c3990055ff92e14a0":6.81,"0x74fa517715c4ec65ef01d55ad5335f90dce7cc87":22.51,"0x89ebf9cd99864f6e51bd7a578965922029cab977":11.45,"0xb5d108578be3750209d1b3a8f45ffee8c5a75146":7.05,"0xb5e33fe13a821e55ed33c884589a804b1b4f6fd8":2.12,"0xcaa662ad41a662b81be2aea5d59ec0697628665f":2.92,"0xdcfbb12ded3fea12d2a078bc6324131cd14bf835":6.35,"0xe267018c943e77992e7e515724b07b9ce7938124":2.77,"0xe834bf723f5bdff34a5d1129f3c31ea4787bc76a":20.03,"0xe8d5d81dac092ae61d097f84efe230759bf2e522":5.13,"0xf90baa331cfd40f094476e752bf272892170d399":14.38,"0x04b56a5b3f45cfeafbfdcfc999c14be5434f2146":8.8,"0x0648ff5de80adf54aac07ece2490f50a418dde23":19.76,"0x24d3b0ed4c444a4f6882d527cbf67adc8c026582":1.12,"0x289841bfb694767bcb56fbc7b741ab4b4d97d490":4.17,"0x28ea5894d4dbbe90bb58ee3bab2869387d711c87":14.04,"0x2a995d355d5df641e878c0f366685741fd18d004":1.02,"0x2d5db889392bc3c8b023a8631ca230a033eea1b8":5.36,"0x3cd338c3bb249b6b3c55799f85a589febbbff9dd":18.35,"0x3e19c18fe3458a6065d8f0844cb7eae52c9dae07":17.85,"0x3e4370204f598205998143f07ebcc486e441b456":6.25,"0x46c6ba71af7648cd7f67d0ad4d16f75be251ed12":10.52,"0x547a355e70cd1f8caf531b950905af751dbef5e6":12.28,"0x7275278c94b5e20708380561c4af98f38ddc6374":51.25,"0x7759283571da8c0928786a96ae601944e10461ff":19.66,"0x7b4682d2b3f8670b125af6aea8d7ed2daa43bdc1":6.83,"0x894bd57afd8efc93d9171cb585d11d0977557425":5.28,"0x89ee0491ce55d2f7472a97602a95426216167189":6.55,"0x8b2824d57eebf07f5aff5c91fa67ed7c501a9f43":94.02,"0x92247860a03f48d5c6425c7ca35cdcfcb1013aa1":10.05,"0x9392a1f471d9aa14c0b8eb28bd7a3f4a814727be":3.39,"0x946696344e7d4346b223e1cf77035a76690d6a73":9.82,"0x9d2296e2fe3cdbf2eb3e3e2ca8811bafa42eedff":21.79,"0xa39af17ce4a8eb807e076805da1e2b8ea7d0755b":21.35,"0xb87b857670a44356f2b70337e0f218713d2378e8":2.35,"0xba01662e978de7d67f8ffc937726215eb8995d17":63.98,"0xc19dfd34d3ba5816df9cbdaa02d32a9f8dc6f6fc":14.93,"0xc2d00de94795e60fb76bc37d899170996cbda436":11.06,"0xcdb0016d97fd0e7ec2c3b78aa4786cbd8e19c14c":9.71,"0xec6557348085aa57c72514d67070dc863c0a5a8c":1.72,"0xfdfde3af740a22648b9dd66d05698e5095940850":26.15,"0x1090c996fd1490d15dd7906322ee676a5cc3cf82":5.11,"0x1d94cb25895abd6ccfef863c53372bb462aa6b86":18.26,"0x222f93187f15f354d41ff6a7703ef7e18cdd5103":8.89,"0x226af4e918fcf3e62e5eeec867a3e78aaa7bb01d":21.22,"0x3c2c77353e2f6ac1578807b6b2336bf3a3cbb014":17.24,"0x41f049d990d38305504631c9835f6f856bf1ba67":96.91,"0x48028de4a9b0d3d91180333d796021ec7757ba1b":31.7,"0x4dca4d427511bc327639b222da18fa5e334f686f":22.62,"0x51bf99bbae59b67e5ce2fa9c17b683384773f8b3":4.51,"0x6045931e511ef7e53a4a817f971e0ca28c758809":15.46,"0x6e98beb694ff1cdb1ee130edd2b21b0298683d58":13.49,"0x804678fa97d91b974ec2af3c843270886528a9e6":27.55,"0x8853e3309a31583ea438f7704681f46f0d4d909b":5.34,"0x8e04b3972b5c25766c681dfd30a8a1cbf6dcc8c1":6.13,"0x8fa59693458289914db0097f5f366d771b7a7c3f":9.83,"0xa0387ebea6be90849c2261b911fbbd52b4c9eac4":33.83,"0xa4963b38b271c0d714593063497fc786fa4029ce":3.39,"0xb8b4383b49d451bbea63bc4421466e1086da6f18":0.62,"0xc74f7243766269dec5b85b0ef4af186e909c1b06":8.2,"0xcecfc2789af72ed151589a96a59f3a1abc65c3b5":28.56,"0xd171b26e4484402de70e3ea256be5a2630d7e88d":2.61,"0xdc7188ac11e124b1fa650b73ba88bf615ef15256":48.72,"0xdfa808da5cfb9aba5fb3748ff85888f79174f378":12.59,"0xea26b78255df2bbc31c1ebf60010d78670185bd0":10.76,"0xec95ff6281c3ad8e27372fa6675eb337640b8e5e":0.03,"0xecf30fbecfa642012f54212a3be92eef1e48edac":5.44,"0xef5212ada83ec2cc105c409df10b8806d20e3b35":17.18,"0xef7767677867552cfa699148b96a03358a9be779":6.12,"0xf23bad605e94de0e3b60c9718a43a94a5af43915":11.79,"0xf74ee1e10e097dc326a2ad004f9cc95cb71088d3":11.82,"0x029d66f9c0469450b7b4834b8ddc6a1118cec3e1":5.34,"0x0604471c532f9febad3e37190b667f44bd0894b3":148.72,"0x0716725d78081a9e0e1ff81516f5415b399e274d":2.82,"0x2030845ce7d4224523fd2f03ca20afe4aad1d890":0.91,"0x2c624c9ecf16cb81ab85cc2c0b0c5e12a09afda6":0.4,"0x4cc442220be1ce560c1f2573f8ca8f460b3e4172":2.13,"0x4d057f769d930eafd597b49d6fb2e1009a73a702":5.8,"0x4eafbf68a2d50291ffd163d4e00ad0f040aae707":0,"0x4fd6d315bef387fad2322fbc64368fc443f0886d":4.95,"0x61010e6cba3b56ba47e9dfd56da682dacfe76131":11.28,"0x6a00e41561ac36a78dba1d09091b0f00c4e53724":19.11,"0x7752e1fa9f3a2e860856458517008558deb989e3":19.95,"0x8046fa66753928f35f7db23ae0188ee6743c2fba":0.28,"0x8271d7eafeeb8f24d7c9fe1acce2ae20611972e5":15.1,"0x8d3ff27d2ad6a9556b7c4f82f4d602d20114bc90":3.56,"0x950fd020f8e4b8c57285ec7020b7a204348dadfa":1.8,"0xa7a0b605343df36b748ff4b5f7578b3f2d0651ce":21.25,"0xaa40f1ac20aafcfee8595da606d78c503c7e70a3":4.91,"0xac109c8025f272414fd9e2faa805a583708a017f":3.36,"0xb7cada0f120ca46745a024e6b9fe907b2fe10cf3":24.38,"0xbc7ac609fa730239190a70952e64ee1dfc2530ac":2.26,"0xbcf01a42f6bc42f3cfe81b05519565044d65d22a":0.36,"0xc20a92a1424b29b78dfaf92fd35d4cf8a06419b4":6.06,"0xc309a6d2f1537922e06f15aa2eb21caa1b2eedb6":9.68,"0xdaa89d335926628367b47852989bb22ee62ca5de":0,"0xdc9a574b9b341d4a98ce29005b614e1e27430e74":2.35,"0xdde420cbb3794ebd8ffc3ac69f9c78e5d1411870":11.75,"0xe6b421a4408c82381b226ab5b6f8c4b639044359":8.55,"0xea61020e5a128d2bec67d48f7cfbe3408db7e391":1.27,"0xf45cd219aef8618a92baa7ad848364a158a24f33":6.8,"0x0362ba706dfe8ed12ec1470ab171d8dcb1c72b8d":121.88,"0x123d475e13aa54a43a7421d94caa4459da021c77":6.28,"0x1434bb50196a0c7ea825940b1dfd8aad25d79817":17.15,"0x153ad7d25b0b810497483d0cee8af42fc533fec8":1.84,"0x20c6de8983fb2d641c55004646aef40b4ea66e18":0.37,"0x222c3cbb89647bf77822435bd4c234a04272a77a":17.86,"0x3578b1f9bce98d2f4d293b422d8850fdf48b1f21":14.72,"0x3e42c1f7239231e3752b507764445dd8e6a570d5":4.07,"0x3f1a9f3d9aad8bd339ed4853f345d2ef89fbfe0c":13.1,"0x510b29a93ebf098f3fc24a16541aaa0114d07056":11.14,"0x5a58609da96469e9def3fe344bc39b00d18eb9a5":1.05,"0x5afef8567414f29f0f927a0f2787b188624c10e2":12.09,"0x6615ce60d71513aa4849269dd63821d324a23f8c":8.14,"0x678edb8b268e73db57b7694c163e1dc296b6e219":3.1,"0x6a97867a4b7eb7646ffb1f359ad582e9903aa1c2":4.34,"0x6d0c831254221ba121fb53fb44df289a6558867d":17.1,"0x81d776c90c89b8d51e9497d58338933127e2fa80":1.7,"0x853784b7bde87d858555715c0123374242db7943":12.61,"0x89666d026696660e93bf6edf57b71a68615768b7":3.64,"0x8f6baf368e7a4f6e2c9c995f22702d5e654a0237":1.24,"0x9730c791743300e9f984c9264395ce705a55da7c":6.96,"0xa5bb44c6f5fd9b836e5a654c8abbccc96a15dee5":14.39,"0xcad7019d6d84a3294b0494aef02e73bd0f2572eb":11.31,"0xd02da76c813b9cd4516ed50442923e625f90228f":6.95,"0xe482249cd295c0d1e9d2baaee71e66de21024c68":173.32,"0xe60b4e87645093a42fa9dcc5d0c8df6e67f1f9d2":42.1,"0xe98585bbb2dc81854ff100a3d9d7b0f53e0dafed":6.03,"0xf1ec67fa1881796bff63db3e1a301ce9cb787fad":7.46,"0xf3bc6fc080ffcc30d93df48bfa2aa14b869554bb":1.84,"0xffd4b200d3c77a0b691b5562d804b3bd54294e6e":6.29,"0x05faf555522fa3f93959f86b41a3808666093210":6.15,"0x13321acff4a27f3d2bca64b8beac6e5fdaaaf12c":2.89,"0x16afc4f2ad82986bbe2a4525601f8199ab9c832d":6.61,"0x1b415c3ec8095afbf9d78882b3a6263c4ad141b5":3.8,"0x1f37d4226d23d09044b8005c127c0517bd7e94fd":5.62,"0x21dd71ab78ede3033c976948f769d506e4f489ee":6.02,"0x2354ef4df11afacb85a5c7f98b624072eccddbb1":3.82,"0x24eb18ba412701f278b172ef96697c4622b19da6":16.96,"0x37908620def1491dd591b5a2d16022a33cdda415":2.69,"0x4288706624e3dd839b069216eb03b8b9819c10d2":2.89,"0x47c42b0a056a9c6e9c65b9ef79020af518e767a5":0.7,"0x66fdb2eccfb58cf098eaa419e5efde841368e489":4.2,"0x71b01ebddd797c8e9e0b003ea2f4fd207fbf46cc":3.36,"0x7653d2c31440f04d2c6520d482dc5dbd7650f70a":9.15,"0x856f9ad94ca8680b899214bb1eb3d235a3c33afe":5.34,"0x8e799cb0737525ceb8a6c6ad07f748535ff6377b":24.07,"0x91417426c3feaa3ca795921eb9fdd9715ad92537":0.19,"0x942b294e59a8c47a0f7f20df105b082710f7c305":3.48,"0xa3bfbbad526c6b856b1fdf73f99bcd894761fbf3":0.36,"0xa9986fcbdb23c2e8b11ab40102990a08f8e58f06":15.38,"0xb2678c414ebc63c9cc6d1a0fc45f43e249b50fde":14.85,"0xc05654c66756ebb82c518598c5f1ea1a0199a563":0.28,"0xc13aa76aac067c86ae38028019f414d731b3d86a":23.64,"0xc5768c5371568cf1114cddd52caed163a42626ed":14.51,"0xc6b668548aa4a56792e8002a920d3159728121d5":13.18,"0xc7a9c2af263ebb86139cca9349e49b17129ba033":1.53,"0xc869a9943b702b03770b6a92d2b2d25cf3a3f571":1.4,"0xcd68856b6e72e99b5eeaae7d41bb4a3b484c700d":166.07,"0xe094c686ad6cdda57b9564457f541fbf099b948a":5.33,"0xec6b56a736859ae8ea4beda16279ecd8c60da7ea":0.16,"0x014608e87af97a054c9a49f81e1473076d51d9a3":4.5,"0x03f18135c44c64ebfdcbad8297fe5bdafdbbdd86":5.24,"0x133ee93fe93320e1182923e1a640912ede17c90c":4.86,"0x168b273278f3a8d302de5e879aa30690b7e6c28f":3.54,"0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae":19.05,"0x1bdcebca3b93af70b58c41272aea2231754b23ca":7.98,"0x28415ff2c35b65b9e5c7de82126b4015ab9d031f":13.6,"0x356dd24bff8e23bde0430f00ad0c290e33438bd7":67.12,"0x3dcb1787a95d2ea0eb7d00887704eebf0d79bb13":17.58,"0x44ea47f2765fd5d26b7ef0222736ad6fd6f61950":20.06,"0x460b4193ec4c1a17372aa5fdcd44c520ba658646":37.45,"0x468b2dc8dc75990ee3e9dc0648965ad6294e7914":87.33,"0x61eb789d75a95caa3ff50ed7e47b96c132fec082":4.12,"0x73566ca86248bd12f0979793e4671e99a40299a7":18.07,"0x74e4716e431f45807dcf19f284c7aa99f18a4fbc":5.02,"0x7eb5d86fd78f3852a3e0e064f2842d45a3db6ea2":10.14,"0x7efaef62fddcca950418312c6c91aef321375a00":2.64,"0x824eb9fadfb377394430d2744fa7c42916de3ece":5.15,"0x8645148de4e339964ba480ae3478653b5bc6e211":1.91,"0xacf47cbeaab5c8a6ee99263cfe43995f89fb3206":3.84,"0xb6e34b5c65eda51bb1bd4ea5f79d385fb94b9504":17.57,"0xce383277847f8217392eea98c5a8b4a7d27811b0":5.37,"0xd63b5cecb1f40d626307b92706df357709d05827":4.13,"0xd8e2f8b6db204c405543953ef6359912fe3a88d6":5.78,"0xd9bccbbbdfd9d67beb5d2273102ce0762421d1e3":89.21,"0xdd5bad8f8b360d76d12fda230f8baf42fe0022cf":9.17}')},964:function(e,a,c){},965:function(e,a,c){}}]);
//# sourceMappingURL=9.f2d9ee4a.chunk.js.map