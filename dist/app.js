const tracks = [{"name":"Love Blur","artist":"slayr","url":"https://open.spotify.com/track/7fMAcSEZdFE7QMsZ2wW2Dy?utm_source=openai&utm_medium=chatgpt&go=1&nap_web=1&request_id=0b37c13c-f850-4f3f-b780-653c74602263","cover":"https://i.scdn.co/image/ab67616d0000b27391c8d820a4b5f5be5782d797","duration":"2:46"},{"name":"Daytona","artist":"slayr × Lucy Bedroque","url":"https://open.spotify.com/track/1z8YIll8YL4H0HqWH6MRH8?utm_source=openai&utm_medium=chatgpt&go=1&nap_web=1&request_id=6be0f1e7-4059-478b-8f59-1fb168fe255f","cover":"https://i.scdn.co/image/ab67616d0000b273062f9b3af7c96bca8fb13466","duration":"2:44"},{"name":"promise","artist":"slayr","url":"https://open.spotify.com/track/3M1QxosuSy3XPJkoeogqlf?utm_source=openai&utm_medium=chatgpt&go=1&nap_web=1&request_id=ba5afad1-8a80-43ca-b2a3-cd6cadab3c53","cover":"https://i.scdn.co/image/ab67616d0000b273f24d6735458f274c742f0d46","duration":"2:47"}];
const list=document.querySelector('#tracklist');
let selectedTrack=0,toastTimer;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
tracks.forEach((track,i)=>{
 const button=document.createElement('button');button.className='track';button.dataset.track=i;
 button.setAttribute('aria-pressed',String(i===0));
 button.innerHTML='<span class="track-num">'+String(i+1).padStart(2,'0')+'</span><img class="track-art" src="'+track.cover+'" alt="Обложка '+track.name+'"><span class="track-info"><strong>'+track.name+'</strong><small>'+track.artist+'</small></span><span class="track-time">'+track.duration+'</span><span class="track-arrow">↗</span>';
 list.append(button);
});
function notify(message){
 const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('visible');
 clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),3200);
}
function selectTrack(i,announce=false){
 selectedTrack=i;const t=tracks[i];
 document.querySelector('#selected-name').textContent=t.name;
 document.querySelector('.selected-copy>span').textContent=t.artist;
 const cover=document.querySelector('#selected-cover');cover.style.visibility='visible';cover.src=t.cover;cover.alt='Обложка '+t.name;
 cover.onerror=()=>{cover.style.visibility='hidden'};
 document.querySelector('#spotify').href=t.url;
 document.querySelector('#slot').textContent=String(i+1).padStart(2,'0')+' / 03';
 document.querySelectorAll('.track').forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));
 if(announce){
  notify('Выбран '+t.name+' · слушай в Spotify');
  const panel=document.querySelector('.selected');panel.classList.remove('is-changing');
  requestAnimationFrame(()=>panel.classList.add('is-changing'));
 }
}
document.querySelectorAll('[data-track]').forEach(button=>button.addEventListener('click',()=>{
 selectTrack(Number(button.dataset.track),true);
 if(button.classList.contains('sticker'))document.querySelector('#collection').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});
}));
selectTrack(0);
document.querySelectorAll('.track-art').forEach(img=>img.addEventListener('error',()=>{img.style.visibility='hidden'}));
const motion=document.querySelector('#motion');
function setMotion(on){
 document.body.classList.toggle('paused',!on);motion.setAttribute('aria-pressed',String(on));
 motion.querySelector('span:last-child').textContent=on?'Лес оживает':'Тихий лес';
 if(!on)document.querySelector('.forest-art').style.transform='none';
}
setMotion(!reduced.matches);
motion.addEventListener('click',()=>setMotion(motion.getAttribute('aria-pressed')!=='true'));
reduced.addEventListener('change',()=>setMotion(!reduced.matches));
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('hidden',document.hidden));
// The content remains visible if observers or scripting are unavailable.
if('IntersectionObserver' in window){
 document.body.classList.add('motion-ready');
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target)}
 }),{threshold:.08,rootMargin:'0px 0px -20px 0px'});
 document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%2)*60+'ms';revealObserver.observe(el)});
 const sceneObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('offscreen',!e.isIntersecting)),{rootMargin:'100px'});
 document.querySelectorAll('.scene').forEach(el=>sceneObserver.observe(el));
}
document.querySelectorAll('.fireflies').forEach((field,fieldIndex)=>{
 for(let i=0;i<18;i++){
  const fly=document.createElement('i');fly.className='firefly';
  fly.style.left=((i*37+fieldIndex*19)%100)+'%';fly.style.top=((i*23+11)%94)+'%';
  fly.style.setProperty('--duration',(7+i%6)+'s');fly.style.setProperty('--delay',(-i*1.7)+'s');field.append(fly);
 }
});
document.querySelectorAll('[data-creature]').forEach(button=>button.addEventListener('click',()=>{
 const kind=button.dataset.creature;
 const messages={spirit:'Листовой дух: «'+tracks[selectedTrack].name+'? Отличный выбор!»',fox:'Лисёнок прислушался к лесу и шевельнул ушами.',moth:'Мотылёк: «Я танцую между нотами»',mushroom:'Грибной мечтатель: «Тише… кажется, лес подпевает»'};
 notify(messages[kind]||'Лес заметил тебя.');
 if(!reduced.matches&&!document.body.classList.contains('paused')){
  const sprite=button.querySelector('.sprite');
  const frames=kind==='spirit'?[{transform:'translateY(0)'},{transform:'translateY(-26px) rotate(5deg)'},{transform:'translateY(0)'}]:kind==='moth'?[{transform:'translateY(0) rotate(0)'},{transform:'translateY(-10px) rotate(-8deg)'},{transform:'translateY(0) rotate(0)'}]:[{transform:'rotate(0)'},{transform:'rotate(4deg)'},{transform:'rotate(0)'}];
  sprite.animate(frames,{duration:650,easing:'cubic-bezier(.23,1,.32,1)'});
 }
}));
// A small, bounded parallax offset keeps the painting separate from the page.
let frameQueued=false;
function parallax(){
 frameQueued=false;
 if(document.hidden||reduced.matches||document.body.classList.contains('paused')||innerWidth<641)return;
 const hero=document.querySelector('.hero');
 if(scrollY>hero.offsetHeight)return;
 document.querySelector('.forest-art').style.transform='translate3d(0,'+Math.min(scrollY*.09,65)+'px,0)';
}
addEventListener('scroll',()=>{if(!frameQueued){frameQueued=true;requestAnimationFrame(parallax)}},{passive:true});
const freeze=new URLSearchParams(location.search).get('t');
if(freeze!==null){
 const time=Number(freeze)||0;
 document.querySelectorAll('.aurora i,.firefly,.sticker,.creature,.sprite,.vine-grow,.vine-leaf,.scroll-cue span,.lantern,.hanging-charm').forEach(e=>{e.style.animationDelay=-time+'s';e.style.animationPlayState='paused'});
}
window.__ready=true;
