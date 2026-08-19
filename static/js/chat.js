// Chat widget submission logic
document.addEventListener('DOMContentLoaded', ()=>{
  const chatForm = document.getElementById('chat-form');
  const result = document.getElementById('chat-result');
  if(!chatForm) return;
  chatForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = {}
    new FormData(chatForm).forEach((v,k)=> data[k]=v);
    try{
      const res = await fetch('/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const json = await res.json();
      if(json.success){ result.textContent = 'Thanks! Your request was submitted.'; chatForm.reset(); }
      else result.textContent = json.error || 'Submission failed';
    }catch(err){ result.textContent = 'Network error'; }
  })
})
