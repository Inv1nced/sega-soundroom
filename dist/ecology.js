/* Living vines: the animals and leaves share their branch's coordinate system. */
(() => {
 const NS='http://www.w3.org/2000/svg';
 const svg=(name,attrs={},parent)=>{const node=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));if(parent)parent.append(node);return node};
 const scenes=[];
 const freeze=new URLSearchParams(location.search).get('t');
 const frozen=freeze!==null;
 const initialTime=frozen?Number(freeze)||0:0;
 function limb(parent,path,index=0){
  const group=svg('g',{class:'wind-limb wind-limb-'+index},parent);
  const root=svg('path',{d:path,class:'living-root'},group);
  svg('path',{d:path,class:'living-highlight'},group);
  const origin=root.getPointAtLength(0);group.style.transformOrigin=origin.x+'px '+origin.y+'px';
  return {group,path:root,length:root.getTotalLength()};
 }
 function addLeaves(branch,count=15){
  const {path,group,length}=branch;
  for(let i=1;i<count;i++){
   const distance=length*i/count,p=path.getPointAtLength(distance),q=path.getPointAtLength(Math.min(length,distance+1));
   const angle=Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI+(i%2?28:148);
   const anchor=svg('g',{transform:`translate(${p.x} ${p.y}) rotate(${angle})`},group);
   const leaf=svg('g',{class:'leaf-motion'},anchor);
   svg('path',{d:'M0 0Q-21 -4 -18 -26Q4 -24 0 0',fill:i%3?'#64834b':'#91a462',stroke:'#30492a','stroke-width':1.4},leaf);
   svg('path',{d:'M0 0L-13 -20',fill:'none',stroke:'#b4bb77','stroke-width':.8},leaf);
   leaf.style.animationDelay=-(i*.87)+'s';
  }
 }
 function snail(branch,{species='amber',start=.3,speed=2.1,scale=1,phase=0}={}){
  const colors=species==='jade'?['#60897e','#91b1a1','#284d45','#a5c48b']:['#ac8150','#dec493','#5b5333','#a0be70'];
  const anchor=svg('g',{class:'vine-snail','data-species':species,'aria-hidden':'true'},branch.group);
  const animal=svg('g',{transform:`translate(0 -5) scale(${scale})`},anchor);
  const shadow=svg('ellipse',{cx:-3,cy:-.8,rx:23,ry:1.4,fill:'#1a301b',opacity:.25},animal);
  const body=svg('path',{fill:colors[3],stroke:'#385539','stroke-width':1.1,'stroke-linejoin':'round'},animal);
  const foot=svg('path',{stroke:'#617d4d','stroke-width':.85,fill:'none'},animal);
  const shell=svg('g',{},animal);
  svg('path',{d:'M-18 -6L-21 -11V-20L-17 -26L-11 -30H-1L6 -26L10 -20V-11L7 -6Z',fill:colors[0],stroke:colors[2],'stroke-width':1.4},shell);
  svg('path',{d:'M-15 -23L-10 -26H-2L4 -22L6 -16L3 -10H-5L-11 -14V-20L-6 -22L-1 -20L1 -16L-2 -14L-5 -16',fill:'none',stroke:colors[1],'stroke-width':2.5,'stroke-linejoin':'round'},shell);
  svg('path',{d:'M-17 -24L-12 -28H-4',fill:'none',stroke:'#f2e2af','stroke-width':1,opacity:.6},shell);
  const head=svg('g',{},animal);
  const antennaA=svg('path',{fill:'none',stroke:'#547448','stroke-width':1.7,'stroke-linecap':'round'},head);
  const antennaB=svg('path',{fill:'none',stroke:'#547448','stroke-width':1.5,'stroke-linecap':'round'},head);
  const eyeA=svg('circle',{r:1.2,fill:'#243e2d'},head),eyeB=svg('circle',{r:1,fill:'#243e2d'},head);
  const face=svg('circle',{cx:22,cy:-5,r:.8,fill:'#304d35'},head);
  const state={branch,anchor,animal,body,foot,shell,head,antennaA,antennaB,eyeA,eyeB,shadow,start,speed,scale,phase};
  return state;
 }
 function renderSnail(s,time){
  const cycle=time*1.65+s.phase;
  // Progress comes in soft muscular waves. The shell follows rather than sliding rigidly.
  const progress=time*s.speed+s.speed*.2*(1-Math.cos(cycle));
  const range=s.branch.length*.8,period=range*2+24;
  const distance=(s.start*range+progress)%period;
  let offset,face;
  if(distance<range){offset=distance;face=1}
  else if(distance<range+12){offset=range;face=Math.cos((distance-range)/12*Math.PI)}
  else if(distance<range*2+12){offset=range*2+12-distance;face=-1}
  else{offset=0;face=-Math.cos((distance-range*2-12)/12*Math.PI)}
  const length=s.branch.length*.1+offset;
  const p=s.branch.path.getPointAtLength(length),p1=s.branch.path.getPointAtLength(Math.max(0,length-1)),p2=s.branch.path.getPointAtLength(Math.min(s.branch.length,length+1));
  const angle=Math.atan2(p2.y-p1.y,p2.x-p1.x)*180/Math.PI;
  s.anchor.setAttribute('transform',`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${angle.toFixed(2)})`);
  s.animal.setAttribute('transform',`translate(0 -5) scale(${s.scale})`);
  s.body.setAttribute('transform',`scale(${face.toFixed(3)} 1)`);
  s.foot.setAttribute('transform',`scale(${face.toFixed(3)} 1)`);
  const reach=1.6*Math.sin(cycle),tail=-26+1.4*Math.sin(cycle-.8),arch=-4.5-1.1*Math.sin(cycle-1.1);
  s.body.setAttribute('d',`M${tail} -.5Q-18 ${arch-2} -7 ${arch}Q6 -5 ${17+reach} -8Q${24+reach} -13 ${26+reach} -7Q${29+reach} -1 22 -.4Q5 ${-.4+.35*Math.sin(cycle)} -9 -.2Q-22 .5 ${tail} -.5Z`);
  s.foot.setAttribute('d',`M${tail+3} -.5Q-10 ${-.8+.3*Math.sin(cycle)} 23 -.7`);
  s.shell.setAttribute('transform',`translate(${(.6*Math.sin(cycle-.9)+5*(1-face)).toFixed(2)} ${(-.45+.45*Math.sin(cycle-.4)).toFixed(2)}) rotate(${(.9*Math.sin(cycle-.8)).toFixed(2)} -5 -13)`);
  s.head.setAttribute('transform',`scale(${face.toFixed(3)} 1) translate(${reach.toFixed(2)} 0)`);
  const feel=Math.sin(cycle*.65)*1.5;
  s.antennaA.setAttribute('d',`M23 -8Q25 -14 ${26+feel} -18`);
  s.antennaB.setAttribute('d',`M20 -8Q19 -13 ${18+feel*.7} -16`);
  s.eyeA.setAttribute('cx',26+feel);s.eyeA.setAttribute('cy',-18);
  s.eyeB.setAttribute('cx',18+feel*.7);s.eyeB.setAttribute('cy',-16);
 }
 function register(root,snails){
  const scene={root,snails,time:initialTime,visible:true};scenes.push(scene);snails.forEach(s=>renderSnail(s,initialTime));return scene;
 }
 // Split the existing logo vines into independently rooted limbs, with matching leaves.
 const logo=document.querySelector('.vines .vine-grow');
 if(logo){
  const leaves=[...logo.children].filter(n=>n.tagName.toLowerCase()==='g');
  const limbs=[...logo.querySelectorAll('.vine-root')].map((root,i)=>{
   const light=root.nextElementSibling,group=svg('g',{class:'wind-limb wind-limb-'+i},logo);
   group.append(root);if(light?.classList.contains('vine-light'))group.append(light);
   const start=root.getPointAtLength(0);group.style.transformOrigin=start.x+'px '+start.y+'px';
   return {group,path:root,length:root.getTotalLength()};
  });
  leaves.forEach(leaf=>{
   const xy=leaf.getAttribute('transform').match(/translate\(([-\d.]+) ([-\d.]+)/);if(!xy)return;
   const x=+xy[1],y=+xy[2];let nearest=limbs[0],best=Infinity;
   limbs.forEach(l=>{for(let n=0;n<=32;n++){const p=l.path.getPointAtLength(l.length*n/32),d=(p.x-x)**2+(p.y-y)**2;if(d<best){nearest=l;best=d}}});
   const movement=svg('g',{class:'leaf-motion'});while(leaf.firstChild)movement.append(leaf.firstChild);leaf.append(movement);nearest.group.append(leaf);
  });
  register(document.querySelector('.hero'),[snail(limbs[1],{start:.44,speed:1.1,scale:.75,phase:1.2})]);
 }
 function vineScene(host,className,path,options){
  if(!host)return;
  const root=svg('svg',{class:'living-vine '+className,viewBox:'0 0 1000 160','aria-hidden':'true'},host);
  const branch=limb(root,path,options.index||0);addLeaves(branch,options.leaves||18);
  register(host,[snail(branch,options)]);
 }
 vineScene(document.querySelector('.hero'),'hero-vine','M-70 114C100 100 200 40 365 87S620 144 770 93S980 60 1070 90',{start:.72,speed:2.4,scale:1.15,index:1});
 vineScene(document.querySelector('.tree-divider'),'divider-vine','M-70 75C160 95 215 145 390 100S620 66 795 96S985 130 1070 96',{species:'jade',start:.22,speed:2.8,scale:1.15,phase:2,index:2});
 vineScene(document.querySelector('.branch-scene'),'story-vine','M-70 90C100 75 200 135 350 96S610 55 780 94S980 116 1070 88',{species:'amber',start:.6,speed:2.1,scale:.95,phase:4,index:3});
 // Each section has its own silhouette, anatomy and motion vocabulary.
 const illustrations={
  fox:`<svg viewBox="0 0 80 60" aria-hidden="true"><g class="fox-tail"><path d="M27 38Q-2 40 4 18Q12 13 17 25Q25 23 29 31" fill="#b77842" stroke="#624a32" stroke-width="2"/><path d="M5 18Q1 24 6 31L13 27L16 23Q11 14 5 18" fill="#e3d2a2"/></g><g class="fox-body"><path d="M25 30Q36 22 50 30L59 44L24 44Z" fill="#ba854b"/><path class="fox-leg back" d="M28 41L27 49H34L35 41" fill="#5d4c32"/><path class="fox-leg front" d="M48 41L49 49H56L54 39" fill="#5d4c32"/><path d="M41 13L42 3L52 10L66 3L67 17L72 28L60 38L44 33L36 24Z" fill="#cf995c" stroke="#6f5637" stroke-width="1.5"/><path d="M39 24L52 25L68 24L59 35L46 31Z" fill="#ede0b5"/><path d="M47 19h3v3h-3M62 18h3v3h-3" fill="#263e2b"/><path d="M56 28h4v3h-4" fill="#393b28"/></g></svg>`,
  moth:`<svg viewBox="0 0 80 70" aria-hidden="true"><g class="moth-flight"><g class="wing wing-left"><path d="M40 34Q8 -1 5 25Q1 42 21 43Q7 65 30 60L40 38" fill="#bbcbae" stroke="#6b8c70" stroke-width="2"/><path d="M35 31Q12 11 11 29L28 37M32 44L23 54" fill="none" stroke="#8d9968" stroke-width="2"/><path d="M19 25l4 -4l4 4l-4 4Z" fill="#d7b66c"/></g><g class="wing wing-right"><path d="M40 34Q72 -1 75 25Q79 42 59 43Q73 65 50 60L40 38" fill="#bbcbae" stroke="#6b8c70" stroke-width="2"/><path d="M45 31Q68 11 69 29L52 37M48 44L57 54" fill="none" stroke="#8d9968" stroke-width="2"/><path d="M61 25l-4 -4l-4 4l4 4Z" fill="#d7b66c"/></g><path d="M36 29Q40 22 44 29L43 50L40 56L37 50Z" fill="#65846b"/><path d="M38 28Q32 20 32 15M42 28Q48 20 48 15" fill="none" stroke="#69876a" stroke-width="1.4"/></g></svg>`,
  mushroom:`<svg viewBox="0 0 70 70" aria-hidden="true"><g class="mushroom-breathe"><path d="M25 34L21 58Q36 68 50 57L45 34" fill="#d5d6ad" stroke="#7f8d61" stroke-width="1.5"/><g class="mushroom-cap"><path d="M6 34Q12 7 34 7Q58 8 65 34Q52 45 35 43Q17 44 6 34Z" fill="#a66e48" stroke="#715a3a" stroke-width="2"/><path d="M8 34Q36 45 63 34" fill="none" stroke="#e0b883" stroke-width="3"/><path d="M20 17h7v5h-7M42 12h6v5h-6M48 26h8v5h-8M12 29h6v4h-6" fill="#ead9b0" opacity=".85"/></g><g class="mushroom-eyes"><path d="M29 49h2v4h-2M40 49h2v4h-2" fill="#4f6349"/></g><path d="M33 57Q36 59 39 56" fill="none" stroke="#87956c"/><path d="M20 59Q12 49 11 58M48 60Q58 52 58 61" fill="none" stroke="#6f8a52" stroke-width="2"/></g></svg>`
 };
 Object.entries(illustrations).forEach(([kind,markup])=>document.querySelectorAll('.sprite.'+kind).forEach(el=>el.innerHTML=markup));
 const visibility=new IntersectionObserver(entries=>{entries.forEach(e=>scenes.filter(s=>s.root===e.target).forEach(s=>s.visible=e.isIntersecting));wake()},{rootMargin:'60px'});
 scenes.forEach(s=>visibility.observe(s.root));
 let handle=0,last=0,accumulator=0;
 function allowed(){return !document.hidden&&!reduced.matches&&!document.body.classList.contains('paused')&&!frozen&&scenes.some(s=>s.visible)}
 function tick(now){
  handle=0;if(!allowed()){last=0;return}
  const dt=last?Math.min((now-last)/1000,.08):0;last=now;accumulator+=dt;
  if(accumulator>=1/30){const step=accumulator;accumulator=0;scenes.forEach(s=>{if(s.visible){s.time+=step;s.snails.forEach(a=>renderSnail(a,s.time))}})}
  handle=requestAnimationFrame(tick);
 }
 function wake(){if(allowed()&&!handle){last=0;handle=requestAnimationFrame(tick)}else if(!allowed()&&handle){cancelAnimationFrame(handle);handle=0;last=0}}
 new MutationObserver(wake).observe(document.body,{attributes:true,attributeFilter:['class']});
 document.addEventListener('visibilitychange',wake);reduced.addEventListener('change',wake);
 if(frozen)document.querySelectorAll('.wind-limb,.leaf-motion,.fox-tail,.fox-body,.wing,.moth-flight,.mushroom-breathe,.mushroom-cap').forEach(el=>{el.style.animationDelay=-initialTime+'s';el.style.animationPlayState='paused'});
 wake();
})();
