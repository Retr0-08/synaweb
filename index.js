const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.post('/api/chat', async (req, res) => {
  const { message, userId } = req.body;
  if(!message) return res.status(400).json({ error:'Mensagem vazia' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model:'gpt-4o-mini',
        messages:[
          { role:'system', content:"Você é Syna, assistente divertida e empática." },
          { role:'user', content: message }
        ],
        max_tokens:300,
        temperature:0.8
      })
    });

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || '...';
    res.json({ reply });
  } catch(e){
    console.error(e);
    res.status(500).json({ error: 'Erro ao conectar à OpenAI' });
  }
});

app.get('/', (req,res) => res.sendFile(path.join(__dirname,'public','index.html')));

app.listen(PORT, ()=> console.log(`Syna rodando na porta ${PORT}`));
