const inputText = document.getElementById('inputText');
const sendBtn = document.getElementById('sendBtn');
const messages = document.getElementById('messages');

const userId = Date.now() + Math.floor(Math.random()*1000);

sendBtn.addEventListener('click', sendMessage);
inputText.addEventListener('keypress', (e)=>{ if(e.key==='Enter') sendMessage(); });

async function sendMessage(){
  const text = inputText.value.trim();
  if(!text) return;
  appendMessage(`Você: ${text}`);
  inputText.value = '';

  try{
    const res = await fetch('/api/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ message: text, userId })
    });
    const data = await res.json();
    appendMessage(`Syna: ${data.reply}`);
  } catch(e){
    appendMessage('Syna: Erro ao se conectar.');
  }
}

function appendMessage(msg){
  const div = document.createElement('div');
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
