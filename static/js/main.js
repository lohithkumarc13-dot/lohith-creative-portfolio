// Basic UI interactions: chat open/close, quick options, contact form submit, filter buttons
window.addEventListener('DOMContentLoaded', () => {
  const chatWidget = document.getElementById('chat-widget');
  function openChat(){ chatWidget.classList.remove('closed'); }
  function closeChat(){ chatWidget.classList.add('closed'); }

  document.querySelectorAll('.chat-open').forEach(b=>b.addEventListener('click', openChat));
  document.querySelectorAll('.chat-close').forEach(b=>b.addEventListener('click', closeChat));

  // Quick options put service into form
  document.querySelectorAll('.quick-options button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.getElementById('chat-service').value = btn.dataset.service;
    })
  })

  // Get started buttons open chat with service
  document.querySelectorAll('.get-started').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      openChat();
      const s = btn.dataset.service;
      document.getElementById('chat-service').value = s;
    })
  })

  // Contact form submit
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const form = new FormData(contactForm);
      const payload = {};
      form.forEach((v,k)=> payload[k]=v);
      const res = await fetch('/inquiry', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const json = await res.json();
      alert(json.message || (json.error || 'Submitted'));
      contactForm.reset();
    })
  }

  // Portfolio filters
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const f = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(pc=>{
        if(f==='ALL' || pc.dataset.category===f) pc.style.display='block'; else pc.style.display='none';
      })
    })
  })

});
