/* NuraSpecs bespoke website — accessible interactions; no tracking and no remote APIs */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const ngn = new Intl.NumberFormat('en-NG', {style:'currency',currency:'NGN',maximumFractionDigits:0});
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mark the current page for assistive technology and clearer navigation state.
  const currentPath = location.pathname.replace(/\/index\.html$/, '/');
  $$('a[href]').forEach(a => {
    try { const u = new URL(a.href, location.href); const p = u.pathname.replace(/\/index\.html$/, '/'); if (u.origin === location.origin && p === currentPath) a.setAttribute('aria-current','page'); } catch {}
  });

  // Navigation, keyboard-friendly mobile menu and scroll state.
  const nav = $('.topnav');
  const toggle = $('#menu-toggle');
  const menu = $('#mobile-menu');
  const backtop = $('#back-to-top');
  const onScroll = () => {nav?.classList.toggle('scrolled', window.scrollY > 24);backtop?.classList.toggle('visible', window.scrollY > 650);};
  window.addEventListener('scroll', onScroll, {passive:true});onScroll();
  const closeMenu = () => {if(!menu)return;menu.classList.remove('open');menu.setAttribute('aria-hidden','true');toggle?.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');};
  toggle?.addEventListener('click', () => {
    const open = !menu.classList.contains('open');menu.classList.toggle('open',open);
    menu.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open));
    document.body.classList.toggle('menu-open',open);
    if(open) $('#mobile-menu a')?.focus();
  });
  $$('#mobile-menu a').forEach(a => a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  backtop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced?'instant':'smooth'}));
  if('IntersectionObserver' in window && !reduced){
    const observer = new IntersectionObserver(items => items.forEach(item=>{
      if(item.isIntersecting){item.target.classList.add('visible');observer.unobserve(item.target);}
    }),{threshold:.09});$$('.reveal').forEach(el=>observer.observe(el));
  } else $$('.reveal').forEach(el=>el.classList.add('visible'));

  // Cinematic hero storytelling: real imagery, pause/restart, manual previous/next.
  const hero = $('#hero-carousel');
  if(hero){
    const slides = $$('.hero-slide',hero);
    const dots = $$('.slider-dots button',hero);
    const next = $('[data-next]',hero),prev=$('[data-prev]',hero),pause=$('[data-pause]',hero);
    let active=0,paused=reduced,interval;
    const paint = n=>{
      active=(n+slides.length)%slides.length;
      slides.forEach((slide,i)=>{slide.classList.toggle('active',i===active);slide.hidden=i!==active;slide.setAttribute('aria-hidden',String(i!==active));});
      dots.forEach((dot,i)=>{dot.classList.toggle('active',i===active);dot.setAttribute('aria-label',`Show story ${i+1} of ${slides.length}`);dot.setAttribute('aria-current',String(i===active));});
    };
    const restart=()=>{clearInterval(interval);if(!paused && !document.hidden) interval=setInterval(()=>paint(active+1),8000);};
    dots.forEach((dot,i)=>dot.addEventListener('click',()=>{paint(i);restart();}));
    next?.addEventListener('click',()=>{paint(active+1);restart();});
    prev?.addEventListener('click',()=>{paint(active-1);restart();});
    pause?.addEventListener('click',()=>{paused=!paused;pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Play rotating stories':'Pause rotating stories');pause.setAttribute('aria-pressed',String(paused));restart();});
    document.addEventListener('visibilitychange',restart);
    paint(0);restart();
  }

  // Homepage Demo Studio with meaningful per-product call-to-action.
  const studio=$('#home-demo-studio');
  if(studio){
    const entries={
      one:{title:'Follow an approval from request to decision.',desc:'Explore the NuraSpecs One product vision using sample Nigerian naira amounts and an interactive approval flow.',img:'assets/one-dashboard.png',alt:'NuraSpecs One dashboard prototype, showing illustrative procurement and approval metrics',href:'demo.html?product=one',label:'Explore the One preview'},
      school:{title:'Experience a more connected school day.',desc:'Try an illustrative walk-through of student records, attendance and Nigerian naira fee tracking.',img:null,href:'demo.html?product=school',label:'Explore the school demo'}
    };
    const tabs=$$('[data-studio]',studio),img=$('#studio-image'),school=$('#studio-school');
    const select=key=>{const e=entries[key];tabs.forEach(b=>{b.classList.toggle('active',b.dataset.studio===key);b.setAttribute('aria-selected',String(b.dataset.studio===key));});
      $('#studio-title').textContent=e.title;$('#studio-desc').textContent=e.desc;
      $('#studio-link').href=e.href;$('#studio-link').textContent=e.label+' →';
      $('#studio-book').href='contact.html?product='+key;
      img.hidden=!e.img;school.hidden=!!e.img;if(e.img){img.src=e.img;img.alt=e.alt;}
    };
    tabs.forEach(tab=>tab.addEventListener('click',()=>select(tab.dataset.studio)));select('one');
  }

  // Product gallery for the real NuraSpecs One frontend screenshots.
  const gallery=$('#one-gallery');
  if(gallery){const image=$('img',gallery),caption=$('#gallery-caption');
    const sources={dashboard:{src:'../assets/one-dashboard.png',alt:'NuraSpecs One NGN executive dashboard frontend prototype',caption:'Executive dashboard — illustrative NGN figures'},requests:{src:'../assets/one-requests.png',alt:'NuraSpecs One procurement request listing prototype',caption:'Procurement requests — illustrative records'},currency:{src:'../assets/currency-settings.png',alt:'NuraSpecs One configuration page for currency selection',caption:'Organisation currency settings — configuration prototype'}};
    $$('[data-screen]').forEach(b=>b.addEventListener('click',()=>{const s=sources[b.dataset.screen];image.src=s.src;image.alt=s.alt;caption.textContent=s.caption;$$('[data-screen]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-selected',String(x===b));});}));
  }

  // Demo app deliberately runs ONLY in the visitor's browser using synthetic examples.
  const demoApp=$('#demo-app');
  if(demoApp){
    const query=new URLSearchParams(location.search);
    const startsSchool=query.get('product')==='school';
    const navButtons=$$('[data-demo-page]',demoApp);
    let page=startsSchool?'school':'overview';
    let proposal=null,approvalIndex=0,attendanceMarked=false;
    const stages=['Manager review','Finance approval','Executive sign-off'];
    const view=$('#demo-render');
    const escape=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    const toView=key=>{page=key;navButtons.forEach(b=>{b.classList.toggle('active',b.dataset.demoPage===key);b.setAttribute('aria-current',String(b.dataset.demoPage===key));});render();};
    navButtons.forEach(b=>b.addEventListener('click',()=>toView(b.dataset.demoPage)));
    const stats=arr=>`<div class="demo-stats">${arr.map(x=>`<div class="demo-stat"><small>${x[0]}</small><b>${x[1]}</b></div>`).join('')}</div>`;
    const screen={
      overview(){return `<div class="eyebrow">NuraSpecs One / Interactive preview</div><h2>Good morning.<br>Here's your overview.</h2><p class="muted">Explore illustrative company information in a frontend-only product preview.</p>${stats([['Pending approvals','12'],['In progress','8'],['Overdue','3'],['Completed this month','24']])}<h3>Recent procurement activity</h3><div class="table-shell"><table class="simpletable"><thead><tr><th>Request</th><th>Amount</th><th>Status</th></tr></thead><tbody><tr><td>Office equipment</td><td>${ngn.format(2500000)}</td><td><span class="pill warn">Pending</span></td></tr><tr><td>IT infrastructure</td><td>${ngn.format(12500000)}</td><td><span class="pill">In review</span></td></tr>${proposal?`<tr><td>${escape(proposal.title)}</td><td>${ngn.format(proposal.amount)}</td><td><span class="pill">${approvalIndex>=stages.length?'Approved':approvalIndex===0?'Submitted':'In review'}</span></td></tr>`:''}</tbody></table></div><button class="btn btn-primary" type="button" data-open-page="request">Try creating a request →</button>`},
      request(){return `<div class="eyebrow">NuraSpecs One / Procurement simulation</div><h2>Submit a purchase request.</h2><p class="muted">Use sample details. Your entries remain in this browser session and are not submitted to NuraSpecs.</p><form id="sample-request" class="formgrid" style="margin:28px 0;max-width:700px"><label><span class="mini-label">Request title</span><input class="field" name="title" maxlength="70" value="Office equipment" required></label><label><span class="mini-label">Estimated amount (NGN)</span><input class="field" name="amount" type="number" min="1000" max="10000000000" step="1000" value="2500000" required></label><label class="wide"><span class="mini-label">Business justification</span><textarea class="field" name="reason" maxlength="350" required>Replace ageing equipment used by the operations team.</textarea></label><div class="wide"><button class="btn btn-primary" type="submit">Submit simulated request →</button><p class="fine">No purchase, accounting entry or live approval is created.</p></div></form>${proposal?`<div class="info-banner"><strong>Last simulated request:</strong> ${escape(proposal.title)} · ${ngn.format(proposal.amount)}<br>Continue to approvals to progress this example.</div>`:''}`},
      approvals(){const approved=!!proposal && approvalIndex>=stages.length;return `<div class="eyebrow">NuraSpecs One / Approval simulation</div><h2>Decisions, with a clear trail.</h2><p class="muted">Follow a demonstration policy through a manager, finance and executive. This is illustrative, not a configured live customer policy.</p>${!proposal?`<div class="info-banner" style="margin:32px 0">Create a simulated request before starting the approval journey.</div><button class="btn btn-primary" data-open-page="request">Create a request →</button>`:`<div class="info-banner" style="margin-top:25px"><strong>${escape(proposal.title)}</strong> · ${ngn.format(proposal.amount)}<br>Request ID: DEMO-001 · <strong>${approved?'Completed':'In progress'}</strong></div><div class="stepsbar">${stages.map((s,i)=>`<div class="${i<=approvalIndex?'done':''}"><span></span><small>${s}</small></div>`).join('')}</div><h3>${approved?'Your illustrative request is approved.':'Current stage: '+stages[approvalIndex]}</h3><p class="muted">${approved?'This completes the simulated workflow.':'Advance this sample request and see the decision trail update.'}</p><div class="actions">${!approved?'<button class="btn btn-primary" id="approve-next">Approve this stage →</button>':''}<button class="btn btn-outline" id="reset-request">Reset simulation</button></div><div class="table-shell"><table class="simpletable"><thead><tr><th>Decision stage</th><th>Sample decision</th></tr></thead><tbody>${stages.map((s,i)=>`<tr><td>${s}</td><td>${approvalIndex>i?'<span class="pill green">Approved</span>':approvalIndex===i?'<span class="pill warn">Awaiting decision</span>':'Not started'}</td></tr>`).join('')}</tbody></table></div>`}`},
      school(){return `<div class="eyebrow teal">School Management / Guided demonstration</div><h2>Run the school day, with clarity.</h2><p class="muted">An illustrative screen experience. Sample data; not connected to a live school environment.</p>${stats([['Students','1,248'],['Attendance',attendanceMarked?'95.0%':'94.2%'],['Fees tracked',ngn.format(8400000)],['Reports ready','18']])}<div class="page-grid" style="margin:18px 0"><div class="detail-card"><div class="symbol">✓</div><h3>Attendance</h3><p>Take a simulated attendance action and watch this preview update.</p><button class="btn btn-outline" id="attendance-toggle" style="margin-top:20px">${attendanceMarked?'Undo demo action':'Mark today’s register'}</button></div><div class="detail-card"><div class="symbol">₦</div><h3>School fees</h3><p>Explore a simple view of Nigerian naira fee tracking and outstanding balances.</p><a class="btn-link" href="products/school-management.html">See school product details</a></div></div><h3>Recent activity</h3><div class="table-shell"><table class="simpletable"><thead><tr><th>Area</th><th>Illustrative activity</th><th>Status</th></tr></thead><tbody><tr><td>Admissions</td><td>New student registration</td><td>Completed</td></tr><tr><td>Attendance</td><td>Today's register</td><td>${attendanceMarked?'Submitted':'In progress'}</td></tr><tr><td>Finance</td><td>Fee reconciliation</td><td>Review</td></tr></tbody></table></div><a class="btn btn-primary" href="contact.html?product=school">Arrange a school demo →</a>`}
    };
    const render=()=>{
      view.innerHTML=screen[page]();
      $$('[data-open-page]',view).forEach(btn=>btn.addEventListener('click',()=>toView(btn.dataset.openPage)));
      $('#sample-request',view)?.addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.currentTarget);const amount=Number(form.get('amount'));if(!Number.isFinite(amount)||amount<1000)return;
        proposal={title:String(form.get('title')).trim(),amount,reason:String(form.get('reason')).trim()};approvalIndex=0;toView('approvals');
      });
      $('#approve-next',view)?.addEventListener('click',()=>{approvalIndex++;render();});
      $('#reset-request',view)?.addEventListener('click',()=>{proposal=null;approvalIndex=0;toView('request');});
      $('#attendance-toggle',view)?.addEventListener('click',()=>{attendanceMarked=!attendanceMarked;render();});
    };
    toView(page);
  }

  // Honest static-hosting contact experience. No false "sent" confirmation.
  const contact=$('#contact-form');
  if(contact){
    const prefill=new URLSearchParams(location.search).get('product');
    if(['one','school','services','general'].includes(prefill)) $('[name=product]',contact).value=prefill;
    const state=$('#contact-result');
    const build=()=>{const d=new FormData(contact);
      const product={one:'NuraSpecs One',school:'School Management',services:'Engineering services',general:'General enquiry'}[d.get('product')]||'General enquiry';
      const items=[['Product',product],['Name',d.get('name')],['Company / school',d.get('company')],['Email',d.get('email')],['Country',d.get('country')],['Message',d.get('message')]];
      const body=items.map(([k,v])=>`${k}: ${v||'Not provided'}`).join('\n');
      return {subject:`NuraSpecs demo enquiry — ${product}`,body};
    };
    contact.addEventListener('submit',async e=>{e.preventDefault();if(!contact.reportValidity())return;
      const d=new FormData(contact);
      const product={one:'NuraSpecs One',school:'School Management',services:'Engineering services',general:'General enquiry'}[d.get('product')]||'General enquiry';
      const submit=contact.querySelector('button[type=submit]');
      if(submit){submit.disabled=true;submit.textContent='Sending…';}
      state.hidden=false;state.textContent='Sending your enquiry…';
      try{
        const country=String(d.get('country')||'').trim();
        const message=String(d.get('message')||'').trim();
        const response=await fetch('/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
          name:d.get('name'),email:d.get('email'),company:d.get('company'),phone:d.get('phone'),interest:product,
          message:country?`Country: ${country}\n\n${message}`:message,website:''
        })});
        let payload={};try{payload=await response.json();}catch{}
        if(!response.ok)throw new Error(payload.error||'Unable to send your enquiry.');
        state.textContent='Thank you. Your enquiry has been sent to the NuraSpecs team and we will get back to you.';
        contact.reset();
      }catch(error){
        state.textContent=error?.message||'We could not send your enquiry right now. Please try again or email info@nuraspecs.com.';
      }finally{if(submit){submit.disabled=false;submit.textContent='Send enquiry ↗';}}
    });
    $('#copy-enquiry')?.addEventListener('click',async()=>{if(!contact.reportValidity())return;
      const {subject,body}=build();try{await navigator.clipboard.writeText(`${subject}\n\n${body}`);state.textContent='Enquiry copied. Paste it into your preferred email or messaging app and send it to info@nuraspecs.com.';state.hidden=false;}catch{state.textContent='Clipboard is unavailable. You can select your text and email info@nuraspecs.com directly.';state.hidden=false;}
    });
  }
})();
