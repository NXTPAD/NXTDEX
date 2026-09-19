(()=> {
const rates={NXT:1.0123,USDC:1,SOL:153.42,ETH:4248.17,SUI:3.12};
const tokens=[
 ['NXT','NXT','assets/img/nxt-master-transparent.png','Multi-chain'],
 ['USDC','USD Coin','assets/img/coin-usdc.svg','Multi-chain'],
 ['SOL','Solana','assets/img/coin-sol.svg','Solana Devnet'],
 ['ETH','Ether','assets/img/coin-eth.svg','Ethereum Sepolia'],
 ['SUI','Sui','assets/img/coin-sui.svg','Sui Testnet']
];
let from='USDC',to='NXT',connected=false;
let slippage=Number(localStorage.getItem('nxtdex_slippage')||0.5);
let side='from';
let network=localStorage.getItem('nxtdex_network')||'Ethereum Sepolia';
const $=id=>document.getElementById(id);
const toast=message=>{const t=$('toast');if(!t)return;t.textContent=message;t.classList.add('show');clearTimeout(window.__nxtToast);window.__nxtToast=setTimeout(()=>t.classList.remove('show'),2600)};
const open=id=>{const backdrop=$('modalBackdrop'),modal=$(id);if(!backdrop||!modal)return;backdrop.hidden=false;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);modal.hidden=false};
const close=()=>{if($('modalBackdrop'))$('modalBackdrop').hidden=true};
const token=s=>tokens.find(t=>t[0]===s)||tokens[0];
const icon=s=>{const t=token(s);return '<i class="'+t[3]+'">'+t[2]+'</i>'};
function render(){
 const amount=Number($('fromAmount')?.value)||0;
 const out=amount*rates[from]/rates[to];
 const minimum=out*(1-slippage/100);
 if($('toAmount'))$('toAmount').value=amount?out.toFixed(4):'';
 if($('fromSymbol'))$('fromSymbol').textContent=from;
 if($('toSymbol'))$('toSymbol').textContent=to;
 if($('rate'))$('rate').textContent='1 '+from+' = '+(rates[from]/rates[to]).toFixed(4)+' '+to;
 if($('minimum'))$('minimum').textContent=amount?minimum.toFixed(4)+' '+to:'—';
 if($('slippageDisplay'))$('slippageDisplay').textContent=slippage.toFixed(2)+'%  ⚙';
 const fi=$('fromToken')?.querySelector('img'),ti=$('toToken')?.querySelector('img');
 if(fi){fi.src=token(from)[2];fi.alt=from}
 if(ti){ti.src=token(to)[2];ti.alt=to}
}
function list(query=''){
 const q=query.toLowerCase();
 const matches=tokens.filter(t=>(t[0]+' '+t[1]+' '+t[3]).toLowerCase().includes(q));
 $('tokenList').innerHTML=matches.map(t=>'<button class="token-row" data-token="'+t[0]+'"><span class="token-main">'+icon(t[0])+'<span><b>'+t[0]+'</b><small>'+t[1]+' · '+t[3]+'</small></span></span><span>›</span></button>').join('')||'<p>No matching assets.</p>';
 document.querySelectorAll('[data-token]').forEach(button=>button.addEventListener('click',()=>{
   const selected=button.dataset.token;
   if(side==='from'){if(selected===to)[from,to]=[to,from];else from=selected}
   else{if(selected===from)[from,to]=[to,from];else to=selected}
   close();render();
 }));
}
function walletList(){
 const wallets=[
  ['sui','Sui Wallet',!!(window.sui||window.suiWallet)],
  ['sol','Phantom / Solana',!!window.solana],
  ['eth','EVM Wallet',!!window.ethereum]
 ];
 $('walletList').innerHTML=wallets.map(w=>'<button class="wallet-row" data-wallet="'+w[0]+'"><span class="wallet-main"><img class="coin-icon" src="assets/img/'+(w[0]==='eth'?'coin-eth.svg':w[0]==='sol'?'coin-sol.svg':w[0]==='sui'?'coin-sui.svg':'assets/img/nxt-master-transparent.png')+'" alt="'+w[1]+'"><span><b>'+w[1]+'</b><small>'+(w[2]?'Detected in browser':'Not detected')+'</small></span></span><span>'+(w[2]?'Connect':'—')+'</span></button>').join('');
 document.querySelectorAll('[data-wallet]').forEach(b=>b.addEventListener('click',()=>connect(b.dataset.wallet)));
}
async function connect(kind){
 try{
  let address='';
  if(kind==='eth'&&window.ethereum) address=(await window.ethereum.request({method:'eth_requestAccounts'}))[0]||'';
  else if(kind==='sol'&&window.solana?.connect) address=(await window.solana.connect()).publicKey?.toString()||'';
  else if(kind==='sui'&&(window.sui||window.suiWallet)){const wallet=window.sui||window.suiWallet;if(wallet.connect)await wallet.connect();address=wallet.getAddress?await wallet.getAddress():''}
  else return toast('Wallet not detected in this browser.');
  if(!address)return toast('Wallet connection did not return an address.');
  connected=true;$('connectBtn').innerHTML='<span>✓</span> '+address.slice(0,6)+'…'+address.slice(-4);close();toast('Wallet connected — no signature requested.');
 }catch(e){toast('Wallet connection was cancelled or rejected.')}
}
function review(){
 const amount=Number($('fromAmount')?.value)||0;
 if(!amount)return toast('Enter an amount first.');
 if(!connected){open('walletModal');walletList();return}
 const out=amount*rates[from]/rates[to],minimum=out*(1-slippage/100);
 $('reviewFrom').textContent=amount.toFixed(4)+' '+from;
 $('reviewTo').textContent=out.toFixed(4)+' '+to;
 $('reviewRate').textContent='1 '+from+' ≈ '+(rates[from]/rates[to]).toFixed(4)+' '+to;
 $('reviewMin').textContent=minimum.toFixed(4)+' '+to;
 $('reviewSlip').textContent=slippage.toFixed(2)+'%';
 $('reviewNetwork').textContent=network;
 open('reviewModal');
}
function setNetwork(){
 const networks=['Ethereum Sepolia','Solana Devnet','Sui Testnet'];
 network=networks[(networks.indexOf(network)+1)%networks.length];
 localStorage.setItem('nxtdex_network',network);
 $('networkLabel').textContent=network;
 toast('Network target set to '+network);
}
$('connectBtn')?.addEventListener('click',()=>{if(connected)toast('Wallet is already connected.');else{open('walletModal');walletList()}});
$('assetConnect')?.addEventListener('click',()=>{if(connected)toast('Wallet is already connected.');else{open('walletModal');walletList()}});
$('swapBtn')?.addEventListener('click',review);
$('fromAmount')?.addEventListener('input',render);
$('maxBtn')?.addEventListener('click',()=>{$('fromAmount').value='1250';render();toast('Maximum prototype balance selected.')});
$('switchBtn')?.addEventListener('click',()=>{[from,to]=[to,from];render()});
$('fromToken')?.addEventListener('click',()=>{side='from';list();open('tokenModal')});
$('toToken')?.addEventListener('click',()=>{side='to';list();open('tokenModal')});
$('tokenSearch')?.addEventListener('input',e=>list(e.target.value));
$('settingsBtn')?.addEventListener('click',()=>open('settingsModal'));
$('networkBtn')?.addEventListener('click',setNetwork);
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',close));
$('modalBackdrop')?.addEventListener('click',e=>{if(e.target===$('modalBackdrop'))close()});
document.querySelectorAll('[data-slip]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-slip]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');slippage=Number(b.dataset.slip);localStorage.setItem('nxtdex_slippage',slippage);render()}));
$('customSlip')?.addEventListener('input',e=>{const v=Number(e.target.value);if(v>0&&v<=50){slippage=v;localStorage.setItem('nxtdex_slippage',slippage);render()}});
$('confirmBtn')?.addEventListener('click',()=>{const amount=Number($('fromAmount').value)||0,out=amount*rates[from]/rates[to];const row=document.createElement('div');row.className='activity-row';row.innerHTML='<span>'+amount.toFixed(4)+' '+from+' → '+out.toFixed(4)+' '+to+'</span><small>SIMULATED · '+network+'</small>' ;$('activityList')?.prepend(row);close();toast('Simulation complete. No on-chain transaction was sent.')});
document.querySelectorAll('.tab').forEach((tab,i)=>tab.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));tab.classList.add('active');toast(i===0?'Swap mode selected.':'Limit order interface is being prepared for protocol execution.')}));
document.querySelectorAll('.ranges button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.ranges button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');toast('Chart range: '+b.textContent)}));
$('networkLabel')&&($('networkLabel').textContent=network);
render();
})();