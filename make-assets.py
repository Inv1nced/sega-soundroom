from pathlib import Path
import random,math
p=Path(__file__).parent/'dist/assets'
p.mkdir(exist_ok=True)
def pixel(name,rows,palette):
 w=max(map(len,rows));h=len(rows)
 rects=[]
 for y,row in enumerate(rows):
  for x,c in enumerate(row):
   if c in palette:rects.append(f'<path d="M{x} {y}h1v1h-1z" fill="{palette[c]}"/>')
 (p/f'{name}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" shape-rendering="crispEdges">'+''.join(rects)+'</svg>')
pixel('spirit',[
'        gg        ',
'      ggGg        ',
'     gGGg         ',
'      tt          ',
'    ggggggg       ',
'   gGLLLLLGg      ',
'  gGLLLLLLLGg     ',
'  gLLLLLLLLLg     ',
' gLLLwwLLwwLLg    ',
' gLLLkwLLkwLLg    ',
' gLLLkkLLkkLLg    ',
'  gLLLLLLLLLg     ',
'   gLLrrLLLg      ',
'    ggggggg       ',
'   gggLLLggg      ',
'  gggLLLLLggg     ',
'   ggLLLLLgg      ',
'    ggLLLgg       ',
'    tt   tt       ',
'   ttt   ttt      '],{'g':'#2b6040','G':'#6fba51','L':'#cbefb2','w':'#faf7dc','k':'#153529','r':'#d6a17b','t':'#69834a'})
pixel('snail',[
'                        ',
'       sssss            ',
'     ssccccc ss          ',
'    scaaaaaccss          ',
'   scaaasssaacs          ',
'   scaascccsacs       b b',
'   scasccacsacs       b b',
'   scascccssacs      bb bb',
'    scassssaacs      bwwb ',
'    sccaacccss       bkkb ',
'     ssssssss      bbbbbb ',
'  bbbbbbbbbbbbbbbbbbbbbbb ',
' bBbbbbbbbbbbbbbbbbbbbbb  ',
'  BBBBBBBBBBBBBBBBBBBB    ',
'   bbbbbbbbbbbbbbbbb     '],{'s':'#4a5031','c':'#a77d4a','a':'#dcc087','b':'#5a965a','B':'#a6cc7b','w':'#f9f1d4','k':'#223c27'})
r=random.Random(27)
out=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 300"><defs><linearGradient id="bark" x2="0" y2="1"><stop stop-color="#67734c"/><stop offset=".4" stop-color="#364b33"/><stop offset="1" stop-color="#192f24"/></linearGradient></defs>']
out+=['<path d="M-40 95C220 80 330 190 620 115S1170 110 1640 175" fill="none" stroke="#263e2b" stroke-width="65"/>','<path d="M-40 86C220 71 330 181 620 106S1170 101 1640 166" fill="none" stroke="url(#bark)" stroke-width="46"/>','<path d="M-30 70C230 70 340 157 625 89S1180 92 1640 145" fill="none" stroke="#879260" stroke-width="7" opacity=".7"/>']
for x,y in [(100,100),(320,135),(560,125),(790,100),(1030,110),(1260,138),(1460,155)]:
 sign=r.choice([-1,1]);ex=x+r.uniform(-100,100);ey=y+sign*r.uniform(55,95)
 out.append(f'<path d="M{x} {y}Q{x-25} {ey} {ex} {ey}" fill="none" stroke="#415b38" stroke-width="7"/>')
 for j in range(33):
  lx=ex+r.uniform(-110,110);ly=ey+r.uniform(-38,40);angle=r.uniform(-75,75);c=r.choice(['#2c6540','#3f7942','#5b8e4b','#739459','#1c5035','#759459'])
  out.append(f'<path d="M{lx:.1f} {ly:.1f}q-13 -18 4 -25q18 11 -4 25" fill="{c}" transform="rotate({angle:.1f} {lx:.1f} {ly:.1f})"/>')
 for j in range(10):
  lx=ex+r.uniform(-90,90);ly=ey+r.uniform(-35,35)
  out.append(f'<path d="M{lx:.1f} {ly:.1f}h3v3h-3z" fill="#e7e5bc"/>')
for j in range(110):
 x=r.uniform(0,1600);y=100+30*math.sin(x/180)+r.uniform(-10,7)
 out.append(f'<path d="M{x:.1f} {y:.1f}q14 -5 22 0" fill="none" stroke="#a0a174" stroke-width="1" opacity=".4"/>')
out.append('</svg>');(p/'branch.svg').write_text(''.join(out))
