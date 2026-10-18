(function(root){
function assess(d){
 const num=k=>d[k]===''||d[k]==null?null:Number(d[k]);
 const s=num('sys'),di=num('dia'),p=num('pulse'),o=num('spo2');
 const errors=[];
 for(const [k,max] of [['sys',400],['dia',400],['pulse',350],['spo2',100],['rr',100],['pain',10]]){const n=num(k);if(n!==null&&(!Number.isFinite(n)||n<0||n>max))errors.push('Valeur invalide : '+k);}
 if(s!==null&&di!==null&&s<di)errors.push('La systolique doit être supérieure ou égale à la diastolique.');
 if(!Number.isFinite(num('duration'))||num('duration')<3||num('duration')>30)errors.push('La durée doit être comprise entre 3 et 30 minutes.');
 if(num('remaining')!==null&&(!Number.isFinite(num('remaining'))||num('remaining')<0))errors.push('Temps restant invalide.');
 if(errors.length)return {errors};
 const pam=s!==null&&di!==null?(s+2*di)/3:null,kpa=pam===null?null:pam/7.5006168;
 let level=0,reasons=[];
 for(const [severity,low,max,hr,blood,spo] of [[3,5.21,30,20,4,65],[2,5.21,40,30,3,75],[1,7.11,80,40,2,85]]){
 const found=[];
 if(p!==null&&p<hr)found.push('Pouls inférieur à '+hr+' battements/min.');
 if(p!==null&&p>220)found.push('Pouls supérieur à 220 battements/min.');
 if(kpa!==null&&kpa>29.5)found.push('PAM supérieure à 29,5 kPa.');
 if(kpa!==null&&p!==null&&kpa<low&&p<=max)found.push('PAM basse avec pouls ≤ '+max+'.');
 if(d.blood!=='unknown'&&Number(d.blood)>=blood)found.push('Perte de sang de classe '+blood+' ou plus.');
 if(o!==null&&o<spo)found.push('SpO₂ inférieure à '+spo+' %.');
 if(found.length){level=severity;reasons=found;break;}
 }
 const warnings=[];
 if(['vomit','blocked'].includes(d.airway))warnings.push('Voies respiratoires obstruées : risque de dégradation. LifeLine ne contrôle pas directement ce point.');
 if(['simple','tension'].includes(d.pneumo))warnings.push('Pneumothorax renseigné : ses conséquences peuvent dégrader les constantes ACE.');
 if(num('rr')===0)warnings.push('Respiration nulle renseignée. Ce signe seul ne fait pas directement reprendre le timer LifeLine.');
 if(d.cpr==='yes')warnings.push('Le massage cardiaque ne suspend pas le timer. Confirme l’état ACE « Réanimation » si observé.');
 if(level&&d.vital==='stable')warnings.push('Les mesures franchissent un seuil mais l’état déclaré est stable : vérifie les mesures et la mise à jour de l’état ACE.');
 let timer='État à vérifier',detail='Renseigne l’état vital ACE et le saignement pour confirmer le comportement du timer.',tone='unknown';
 if(d.awake==='dead'){timer='Patient déclaré mort';detail='Le délai de sauvetage ne réanime pas un personnage déjà mort.';}
 else if(d.episode==='no'){timer='Timer non déclenché';detail='Les mesures seules ne démarrent pas LifeLine : il faut un déclenchement de blessure létale.';}
 else if(d.vital!=='unknown'&&d.vital!=='stable'||d.bleed==='yes'){timer='Le timer avance';tone='bad';detail=d.bleed==='yes'?'Un saignement suffit à empêcher la pause.':'L’état ACE déclaré est différent de stable.';}
 else if(d.vital==='stable'&&d.bleed==='no'){
  if(d.awake==='yes'){timer='Sauvetage terminé';tone='good';detail='Patient stable, sans saignement et conscient : fin de l’épisode.';}
  else if(d.awake==='no'){timer='Le timer est suspendu';tone='good';detail='Patient stable et sans saignement. Une dégradation relance le temps restant.';}
  else {timer='Pause ou sauvetage terminé';detail='Stable et sans saignement : précise la conscience pour distinguer les deux.';}
 }
 else if(d.vital==='unknown'&&level){timer='Le timer devrait avancer';tone='warn';detail='Estimation d’après les mesures. Confirme l’état vital ACE réel.';}
 if(num('remaining')===0&&d.episode==='yes')warnings.push('Temps restant nul : LifeLine traite l’expiration avant de réévaluer la stabilité.');
 return {errors,pam,kpa,level,reasons,warnings,timer,detail,tone};
}
root.DFTAssess=assess;if(typeof module!=='undefined')module.exports=assess;
})(typeof window!=='undefined'?window:globalThis);
