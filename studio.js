const $ = selector => document.querySelector(selector);
const stage = $('#stage');
const scenes = [...document.querySelectorAll('.scene')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const lengths = {home:0, hello:1.65, craft:2.9, ideas:4.2, lahore:5.5, work:6.8, about:10.9, contact:12.2};
const colors = ['#486451','#375b46','#4e684b','#1f3a31','#355446','#4d6540','#27463a','#486451'];
const anchors = Object.values(lengths);
const final = lengths.contact;
const clamp = (x, lo=0, hi=1) => Math.min(hi,Math.max(lo,x));
const ease = n => n*n*(3-2*n);
const fraction = (x,a,b) => clamp((x-a)/(b-a));
const distance = () => Math.max(1,document.documentElement.scrollHeight-innerHeight);
const scrollTime = () => clamp(scrollY/distance())*final;
let frame = 0, current = '', maxTravel = 0;
let userSound = false, audio, gain;
function go(time, animate=true) {
  window.scrollTo({top:distance()*time/final,behavior:animate&&!reduced.matches?'smooth':'instant'});
}
function navigate(id, push=true, animate=true) {
  if (!(id in lengths)) return;
  if(push && location.hash!=='#'+id) history.pushState(null,'','#'+id);
  go(lengths[id],animate);
}
document.addEventListener('click', event => {
  const a=event.target.closest('a[href^="#"]');
  if(!a || !(a.hash.slice(1) in lengths))return;
  event.preventDefault();navigate(a.hash.slice(1));
});
window.addEventListener('popstate',()=>navigate(location.hash.slice(1)||'home',false,false));

const tickLinks=[...document.querySelectorAll('.ruler a')];
for(const a of tickLinks) a.style.left=100*lengths[a.hash.slice(1)]/final+'%';
for(let i=0;i<43;i++){
  const speck=document.createElement('i');
  speck.style.cssText='left:'+((i*59+21)%100)+'%;top:'+((i*37+17)%100)+'%;opacity:'+(.15+(i%7)/13)+';animation-delay:-'+i%6+'s';
  $('.dust').append(speck);
}
for(let i=1;i<=12;i++){
  const ring=document.createElement('i');
  ring.style.width=(8*i)+'%';ring.style.height=(8*i)+'%';
  $('#tunnel').append(ring);
}
const hello=$('#hello h2');
const words=hello.textContent.split(' ');hello.textContent='';
for(const word of words){
  const group=document.createElement('span');
  for(const [i,ch] of [...word].entries()){
    const letter=document.createElement('span');letter.textContent=ch;
    letter.style.transform='rotate('+[-5,2,-3,4][i%4]+'deg)';group.append(letter);
  }
  hello.append(group,document.createTextNode(' '));
}
function mix(a,b,v) {
  const channel=(hex,i)=>parseInt(hex.slice(i,i+2),16);
  return 'rgb('+[1,3,5].map(i=>Math.round(channel(a,i)*(1-v)+channel(b,i)*v)).join(',')+')';
}
function update(){
  frame=0;
  const time=scrollTime(), minimal=reduced.matches;
  let active='home';
  for(let i=0;i<scenes.length;i++){
    const el=scenes[i], start=anchors[i], next=anchors[i+1];
    const fadeIn=i ? fraction(time,start-.52,start-.08) : 1;
    const fadeOut=next ? fraction(time,next-.63,next-.17) : 0;
    const opacity=clamp(fadeIn*(1-fadeOut));
    const show=opacity>.003;
    el.style.opacity=opacity;el.style.visibility=show?'visible':'hidden';
    if(opacity>.45)active=el.id;
    if(!minimal && el.id!=='home' && el.id!=='work'){
      const y=(1-fadeIn)*6-fadeOut*6;
      el.style.transform='translateY('+y+'%) scale('+(1+fadeOut*.06)+')';
    }
  }
  if(current!==active){
    current=active;
    for(const el of scenes){el.inert=el.id!==active;el.classList.toggle('active',el.id===active);}
    for(const link of tickLinks) if(link.hash==='#'+active)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');
  }
  const i=Math.max(0,anchors.findLastIndex(at=>at<=time));
  const blend=i<anchors.length-1?ease(fraction(time,anchors[i+1]-.8,anchors[i+1]-.1)):0;
  stage.style.backgroundColor=mix(colors[i],colors[Math.min(i+1,colors.length-1)],blend);
  $('.marker').style.left=100*time/final+'%';
  const open=ease(fraction(time,0,.55)), dive=ease(fraction(time,.34,1.28));
  $('#actor').style.setProperty('--lid-y',(-48*open)+'px');
  $('#actor').style.setProperty('--lid-r',(-2-16*open)+'deg');
  $('#actor').style.setProperty('--ideas',open*(1-dive));
  $('#actor').style.transform='translateX(-50%) scale('+(minimal?1:1+dive*dive*10)+')';
  $('#actor').style.opacity=1-fraction(time,.8,1.16);
  $('.heading-block').style.opacity=1-fraction(time,.04,.55);
  $('.scroll-hint').style.opacity=1-fraction(time,0,.25);
  $('.birds').style.opacity=1-fraction(time,0,.65);
  const closing=ease(fraction(time,lengths.contact-.48,lengths.contact-.05));
  stage.classList.toggle('closing',closing>0);
  if(closing>0){
    $('#home').style.visibility='visible';
    $('#home').style.opacity=closing;
    $('#actor').style.opacity=1;
    $('#actor').style.transform='translateX(-50%) scale('+(minimal?1:1+(1-closing)*.2)+')';
    $('#actor').style.setProperty('--lid-y','0px');
    $('#actor').style.setProperty('--lid-r','-2deg');
    $('#actor').style.setProperty('--ideas',0);
    $('.heading-block').style.opacity=closing;
    $('.birds').style.opacity=closing;
  }
  const tunnel=$('#tunnel');
  tunnel.style.opacity=minimal?0:fraction(time,.65,.95)*(1-fraction(time,1.26,1.55));
  tunnel.style.transform='scale('+(0.12+Math.pow(fraction(time,.65,1.55),2)*6)+')';
  const shift=fraction(time,lengths.work+.12,lengths.about-.77);
  $('.rail').style.transform='translateX('+(-maxTravel*shift)+'px)';
  $('.marker').style.opacity=time<.01?'.4':'1';
  $('.music-tip').hidden=userSound||time>.1;
}
function schedule(){if(!frame)frame=requestAnimationFrame(update);}
function measure(){
  const box=$('.selection');$('.measure').textContent=Math.round(box.clientWidth)+' × '+Math.round(box.clientHeight);
  maxTravel=Math.max(0,$('.rail').scrollWidth-stage.clientWidth);
  schedule();
}
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',measure);document.fonts.ready.then(measure);
document.addEventListener('pointermove',event=>{
  if(current!=='home'||reduced.matches)return;
  $('#actor').style.setProperty('--eye-x',(event.clientX/innerWidth-.5)*9+'px');
  $('#actor').style.setProperty('--eye-y',(event.clientY/innerHeight-.5)*6+'px');
});
const projectButtons=[...document.querySelectorAll('.project')];
function projectTime(index){
  const left=projectButtons[index].offsetLeft-stage.clientWidth*.09;
  return lengths.work+.12+(lengths.about-.77-lengths.work-.12)*clamp(left/Math.max(1,maxTravel));
}
function stepGallery(direction){
  const stops=[lengths.work,...projectButtons.map((_,i)=>projectTime(i))];
  const time=scrollTime();
  const target=direction>0?stops.find(x=>x>time+.05):stops.findLast(x=>x<time-.05);
  go(target??(direction>0?lengths.about:lengths.work));
}
$('#next').onclick=()=>stepGallery(1);$('#prev').onclick=()=>stepGallery(-1);
document.addEventListener('keydown',event=>{
  if(current!=='work'||$('#detail').open)return;
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();stepGallery(event.key==='ArrowRight'?1:-1);}
});
const projects=[
  ['Packaging portfolio','Packaging design','packaging.jpg','A collection of packaging artwork and box designs, presented together in my print portfolio.','https://www.behance.net/gallery/217618735/Portfolio-of-Packaging-Design'],
  ['Sight Pakistan','Web UI','sight.jpg','A travel website interface exploring how people browse destinations in Pakistan.','https://www.behance.net/gallery/170882909/Sight-Pakistan-UI'],
  ['Pizzeria','Mobile UI / UX','pizzeria.jpg','A mobile interface study for browsing pizza and ordering from a phone.','https://www.behance.net/gallery/152401601/Pizzeria-Mobile-App-UIUX-Design']
];
for(const button of projectButtons){
  button.addEventListener('click',()=>{
    const [name,type,file,copy,url]=projects[Number(button.dataset.project)];
    $('#detail-title').textContent=name;$('#detail-type').textContent=type;
    $('#detail-img').src='assets/'+file;$('#detail-img').alt=name+' original project cover';
    $('#detail-copy').textContent=copy;$('#detail-go').href=url;
    $('#detail').showModal();
  });
}
$('#detail').addEventListener('click',event=>{if(event.target===$('#detail'))$('#detail').close();});
$('#sound').addEventListener('click',async()=>{
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio)return;
  if(!audio){
    audio=new Audio();gain=audio.createGain();gain.gain.value=0;gain.connect(audio.destination);
    for(const hz of [130.813,195.998,246.942,293.665]){
      const osc=audio.createOscillator();osc.type='sine';osc.frequency.value=hz;osc.connect(gain);osc.start();
    }
  }
  await audio.resume();userSound=true;
  const on=$('#sound').getAttribute('aria-pressed')!=='true';
  gain.gain.setTargetAtTime(on?.012:0,audio.currentTime,.2);
  $('#sound').setAttribute('aria-pressed',String(on));$('#soundstate').textContent=on?'on':'off';
  $('.music-tip').hidden=true;
});
measure();update();
if(location.hash)requestAnimationFrame(()=>navigate(location.hash.slice(1),false,false));
