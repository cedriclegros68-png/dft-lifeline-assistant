const form=document.getElementById('medical'),key='dft-medical-v1';
const defaults=Object.fromEntries(new FormData(form));
function values(){return {duration:'10',remaining:'',vital:'unknown',bleed:'unknown',awake:'unknown',episode:'no',airway:'unknown',pneumo:'unknown',cpr:'unknown',pain:'',...Object.fromEntries(new FormData(form))};}
function list(id,items){document.getElementById(id).replaceChildren(...items.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));}
function update(){
 const d=values(),r=DFTAssess(d);
 document.getElementById('validation').textContent=r.errors.join(' ');
 const title=document.getElementById('severity');
 if(r.errors.length){title.textContent='Saisie à corriger';title.className='bad';document.getElementById('pam').textContent='— mmHg';document.getElementById('kpa').textContent='— kPa';document.getElementById('confidence').textContent='';list('reasons',[]);return;}
 const fmt=n=>n===null?'—':n.toLocaleString('fr-FR',{maximumFractionDigits:2,minimumFractionDigits:2});
 document.getElementById('pam').textContent=fmt(r.pam)+' mmHg';document.getElementById('kpa').textContent=fmt(r.kpa)+' kPa';
 const complete=['sys','dia','pulse','spo2'].every(k=>d[k]!=='')&&d.blood!=='unknown';
 const empty=['sys','dia','pulse','spo2'].every(k=>d[k]==='')&&d.blood==='unknown';
 const labels=['Aucun seuil franchi dans les mesures saisies','Seuil d’instabilité atteint','Seuil critique atteint','Seuil d’arrêt cardiaque atteint'];
 const respiratoryAlert=['vomit','blocked'].includes(d.airway)||['simple','tension'].includes(d.pneumo);
 title.textContent=r.level?labels[r.level]:respiratoryAlert?'Problème respiratoire renseigné':empty?'Mesures à renseigner':labels[0];title.className=r.level>=2?'bad':r.level===1||respiratoryAlert?'warn':empty?'':'good';
 document.getElementById('confidence').textContent=complete?'Seuils de référence appliqués. L’état ACE réel reste prioritaire.':'Les valeurs non renseignées ne sont pas évaluées. Ce résultat ne confirme pas la stabilité complète.';
 list('reasons',[...r.reasons,...r.warnings.filter(text=>!text.startsWith('Respiration nulle'))]);
 if(d.rr!==''&&Number(d.rr)===0){const li=document.createElement('li');li.textContent='Respiration nulle renseignée : à vérifier dans le jeu. Aucun seuil respiratoire direct dans cette classification ACE.';document.getElementById('reasons').append(li);}
 try{localStorage.setItem(key,JSON.stringify(Object.fromEntries(new FormData(form))));}catch{}
}
try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved)for(const [k,v]of Object.entries(saved))if(form.elements.namedItem(k))form.elements.namedItem(k).value=v;}catch{}
form.addEventListener('input',update);form.addEventListener('change',update);form.addEventListener('submit',e=>e.preventDefault());document.getElementById('reset').onclick=()=>{for(const[k,v]of Object.entries(defaults))form.elements.namedItem(k).value=v;update();};update();
let installPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;document.getElementById('install').hidden=false;});document.getElementById('install').onclick=async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null;document.getElementById('install').hidden=true;}};
if('serviceWorker'in navigator&&location.protocol!=='file:'){navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{document.getElementById('offline').textContent='Prêt hors ligne';}).catch(()=>{document.getElementById('offline').textContent='Copie hors ligne indisponible';});}else{document.getElementById('offline').textContent='Mode fichier local';}
