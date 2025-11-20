document.addEventListener("DOMContentLoaded", () => {
  const buttons = Array.from(document.querySelectorAll(".menu-btn"));
  let focusedIndex = buttons.findIndex(b => b.classList.contains("focused"));
  if (focusedIndex < 0) focusedIndex = 0;

  const setFocus = idx => {
    buttons.forEach((b,i) => b.classList.toggle("focused", i === idx));
    buttons[idx].focus();
    focusedIndex = idx;
  };

  setFocus(focusedIndex);

  
  window.addEventListener("keydown", (e) => {
    switch(e.key){
      case "ArrowDown":
        e.preventDefault();
        setFocus((focusedIndex + 1) % buttons.length);
        break;

      case "ArrowUp":
        e.preventDefault();
        setFocus((focusedIndex - 1 + buttons.length) % buttons.length);
        break;

      case "Enter":
        e.preventDefault();
        buttons[focusedIndex].click();
        break;
    }
  });

  
  const menu = document.querySelector(".menu");
  const instrBtn = document.createElement("button");
  instrBtn.id = "instructionsBtn";
  instrBtn.className = "menu-btn";
  instrBtn.textContent = "INSTRUÇÕES";

  // INSERIR ENTRE JOGAR (0) E SAIR (1)
  menu.insertBefore(instrBtn, document.getElementById("quitBtn"));

  buttons.push(instrBtn);

  
  instrBtn.addEventListener("click", () => {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("aria-hidden", "false");

    modal.innerHTML = `
      <div class="modal-inner">
        <h2>Instruções</h2>
        <p>Você é o carteiro da cidade! Cada cenário traz uma situação diferente.</p>
        <ul>
          <li>Use A e D para andar.</li>
          <li>Escolha entre as opções quando aparecer o balão.</li>
          <li>Suas decisões afetam o resultado final.</li>
        </ul>
        <button class="small-btn" id="closeInstructions">Fechar</button>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("closeInstructions").addEventListener("click", () => {
      modal.remove();
    });
  });

  
  document.getElementById("startBtn").addEventListener("click", startGame);
  document.getElementById("quitBtn").addEventListener("click", quitGame);

  function quitGame(){
    if(confirm("Deseja realmente sair do jogo?"))
      alert("Obrigado por jogar!");
  }
});

let gameStarted = false;
let _rafId = null;
let _lastTime = 0;
let keys = { left: false, right: false };
let player = { el: null, x: 20, w: 150, speed: 220 };
let textBox;
let currentScenario = 0;
let waitingNextScene = false;


let empatia = 0;
let ambicao = 0;
let coragem = 0;
let adapt = 0;
let etica = 0;


const scenarios = [
  { 
    bg: 'bg1.png', 
    character: 'person1.png',
    event: 'O carteiro encontra uma casa sem número, mas o nome na carta parece familiar.',
    options: [
      { text: 'Procurar o vizinho e confirmar o destinatário.', ambicao: 0, empatia: 1, coragem: 1 },
      { text: 'Deixar no correio central depois.', ambicao: 1, empatia: 0, coragem: 0 },
      { text: 'Tentar lembrar se já entregou algo aqui antes.', ambicao: 1, empatia: 0, coragem: 0 }
    ]
  },
  { 
    bg: 'bg2.png', 
    event: 'Um cachorro machucado está na calçada, parece ter dono.', 
    options: [
      { text: 'Avisar um morador e seguir o trabalho.', ambicao: 0, empatia: 1, coragem: 0 },
      { text: 'Levar o cachorro a um abrigo antes de continuar as entregas.', ambicao: 0, empatia: 2, coragem: 1 },
      { text: 'Fazer carinho e deixar um pouco de água antes de partir.', ambicao: 0, empatia: 1, coragem: 0 }
    ]
  },
  { 
    bg: 'bg3.png',
    event: 'Uma criança triste o vento levou sua carta antes de ser entregue.', 
    options: [
      { text: 'Parar a entrega e ajudar o menino a escrever outra.', ambicao: 0, empatia: 2, coragem: 1 },
      { text: 'Seguir a rota, isso não é problema do trabalho.', ambicao: 1, empatia: 0, coragem: 0 },
      { text: 'Prometer que vai procurar a carta no caminho de volta.', ambicao: 0, empatia: 1, coragem: 1 }
    ]
  },
  {  
    bg: 'bg4.png', 
    event: 'Uma carta sem remetente, com teu próprio nome escrito.', 
    options: [
      { text: 'Abrir e ler.', ambicao: 1, empatia: 1, coragem: 1, letter: true },
      { text: 'Ignorar', ambicao: 0, empatia: 0, coragem: 0 },
      { text: 'Guardar a carta no bolso e pensar sobre ela depois.', ambicao: 0, empatia: 1, coragem: 0 }
    ] 
  },
  {
    bg: "bg5.png",
    event: "Uma senhora pede ajuda para carregar caixas até o portão.",
    options: [
      { text: "Ajudar a senhora", empatia: 2, ambicao: 0, coragem: 1, adapt: 1, etica: 2 },
      { text: "Ignorar e seguir entregando", empatia: 0, ambicao: 2, coragem: 0, adapt: 0, etica: 0 }
    ]
  },
  {
    bg: "bg6.png",
    event: "Um jovem pede para entregar uma carta em outra cidade.",
    options: [
      { text: "Aceitar o desafio", empatia: 1, ambicao: 1, coragem: 2, adapt: 2, etica: 1 },
      { text: "Recusar educadamente", empatia: 1, ambicao: 0, coragem: 0, adapt: 1, etica: 2 }
    ]
  },
  {
    bg: "bg7.png",
    event: "Uma criança corre e quase derruba as cartas.",
    options: [
      { text: "Sorrir e ajudar a organizar", empatia: 2, ambicao: 0, coragem: 1, adapt: 1, etica: 2 },
      { text: "Reclamar da falta de cuidado", empatia: 0, ambicao: 1, coragem: 0, adapt: 0, etica: 0 }
    ]
  },
  {
    bg: "bg8.png",
    event: "Um morador irritado reclama de uma entrega atrasada.",
    options: [
      { text: "Pedir desculpas e explicar com calma", empatia: 2, ambicao: 0, coragem: 1, adapt: 1, etica: 2 },
      { text: "Responder de forma ríspida", empatia: 0, ambicao: 1, coragem: 0, adapt: 0, etica: 0 }
    ]
  },
  {
    bg: "bg9.png",
    event: "Você encontra uma carteira caída na rua.",
    options: [
      { text: "Devolver ao dono", empatia: 1, ambicao: 0, coragem: 1, adapt: 0, etica: 3 },
      { text: "Ficar com o dinheiro", empatia: 0, ambicao: 2, coragem: 0, adapt: 0, etica: -2 }
    ]
  },
  {
    bg: "bg10.png",
    event: "Uma tempestade forte começa durante as entregas.",
    options: [
      { text: "Seguir trabalhando apesar da chuva", empatia: 1, ambicao: 1, coragem: 3, adapt: 2, etica: 1 },
      { text: "Procurar abrigo e esperar passar", empatia: 1, ambicao: 0, coragem: 0, adapt: 1, etica: 2 }
    ]
  },
  {
    bg: "bg11.png",
    event: "Durante uma entrega, um morador idoso convida o carteiro para tomar um café e conversar.",
    options: [
      { text: "Aceitar o convite e ouvir suas histórias", empatia: 2, ambicao: 0, coragem: 0, adapt: 1, etica: 2 },
      { text: "Agradecer e continuar as entregas", empatia: 0, ambicao: 1, coragem: 1, adapt: 1, etica: 1 }
    ]
  },
  {
    bg: "bg12.png",
    event: "Você encontra um colega carteiro com o carro quebrado no meio do caminho.",
    options: [
      { text: "Ajudar o colega a empurrar o carro", empatia: 2, ambicao: 0, coragem: 1, adapt: 1, etica: 2 },
      { text: "Seguir o caminho, o serviço não pode parar", empatia: 0, ambicao: 2, coragem: 0, adapt: 0, etica: 0 }
    ]
  },
  {
    bg: "bg13.png",
    event: "Uma carta urgente precisa ser entregue fora do horário normal.",
    options: [
      { text: "Fazer a entrega mesmo assim", empatia: 1, ambicao: 1, coragem: 2, adapt: 2, etica: 2 },
      { text: "Deixar para o dia seguinte", empatia: 0, ambicao: 0, coragem: 0, adapt: 1, etica: 1 }
    ]
  },
  {
    bg: "bg14.png",
    event: "No caminho, um jovem pede ajuda para encontrar um endereço perdido.",
    options: [
      { text: "Ajudar a procurar o local", empatia: 2, ambicao: 0, coragem: 1, adapt: 2, etica: 1 },
      { text: "Explicar rapidamente e continuar a rota", empatia: 1, ambicao: 1, coragem: 0, adapt: 1, etica: 1 }
    ]
  },
  {
    bg: "bg15.png",
    event: "O carteiro encontra uma carta antiga nunca entregue, datada de décadas atrás.",
    options: [
      { text: "Investigar e tentar descobrir o destinatário", empatia: 2, ambicao: 0, coragem: 1, adapt: 2, etica: 2 },
      { text: "Guardar como lembrança de uma história perdida", empatia: 1, ambicao: 0, coragem: 0, adapt: 1, etica: 0 }
    ]
  },
  {
    bg: "bg16.png",
    event: "Enquanto o sol se põe, o carteiro observa o caminho percorrido e todas as escolhas feitas.",
    options: [
      { text: "Refletir sobre como cada entrega foi também uma parte de si mesmo.", empatia: 2, ambicao: 0, coragem: 1, adapt: 1, etica: 2 },
      { text: "Apenas seguir andando, como sempre fez.", empatia: 0, ambicao: 2, coragem: 1, adapt: 1, etica: 0 }
    ]
  }
];



function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  const layout = document.querySelector('.layout');
  if (layout) layout.style.display = 'none';

  createIntroScene();
}


function createIntroScene(){
  const introScene = document.createElement('div');
  introScene.className = 'game-scene';
  introScene.innerHTML = `
    <div class="game-inner" id="gameInner" style="background:black; position:relative; overflow:hidden;">
      <div id="lightOverlay" style="position:absolute; inset:0; background:radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, rgba(0,0,0,0.95) 70%); transition: opacity 2s;"></div>
      <img src="carteiro.png" id="carteiroSprite" style="position:absolute; bottom:50px; left:50%; transform:translateX(-50%); width:150px; filter:brightness(0); opacity:0; transition: filter 2s, opacity 2s;">
      <div class="dialogue-box" id="dialogueBox" style="display:none; opacity:0; transition: opacity 1s;"></div>
    </div>
  `;
  document.body.appendChild(introScene);

  player.el = document.getElementById('carteiroSprite');
  textBox = document.getElementById('dialogueBox');
  const light = document.getElementById('lightOverlay');

  setTimeout(() => {
    player.el.style.filter = "brightness(1.5) contrast(1.2) saturate(1.8)";
    player.el.style.opacity = "1";
  }, 500);

 
  let breatheUp = true;
  const breatheInterval = setInterval(() => {
    player.el.style.transform = breatheUp ? "translateX(-50%) translateY(-4px)" : "translateX(-50%) translateY(0px)";
    breatheUp = !breatheUp;
  }, 900);

  const introTexts = [
    "Ainda é de noite, mas ele permanece nas ruas.",
    "Entre desafios e momentos difíceis, o carteiro carrega mais do que cartas carrega escolhas.",
    "Em uma noite cansativa de trabalho, cada entrega é uma decisão, seguir o protocolo ou ouvir o coração."
  ];

  let currentText = 0;
  function showNextLine() {
    if (currentText < introTexts.length) {
      textBox.innerHTML += `<p>${introTexts[currentText]}</p>`;
      textBox.style.display = 'block';
      textBox.style.opacity = 1;
      currentText++;
      setTimeout(showNextLine, 2800);
    } else {
      textBox.innerHTML += `<button id="continueIntroBtn">Continuar</button>`;
      document.getElementById('continueIntroBtn').addEventListener('click', () => {
        clearInterval(breatheInterval);
        textBox.style.display = 'none';
        light.style.opacity = '0';
        setTimeout(() => {
          light.remove();
          loadScenario(0);
        }, 1000);
      });
    }
  }
  showNextLine();
}



function loadScenario(index){
  currentScenario = index;
  const gameInner = document.getElementById('gameInner');

  const gameBg = document.createElement('img');
  gameBg.id = 'gameBg';
  gameBg.className = 'game-bg';
  gameBg.src = scenarios[currentScenario].bg;
  gameBg.style.position = 'absolute';
  gameBg.style.inset = '0';
  gameBg.style.width = '100%';
  gameBg.style.height = '100%';
  gameInner.prepend(gameBg);

  player.x = 20;
  player.el.style.left = player.x + 'px';
  showEvent(scenarios[currentScenario]);

  window.addEventListener('keydown', _onKeyDown);
  window.addEventListener('keyup', _onKeyUp);
  _lastTime = performance.now();
  _rafId = requestAnimationFrame(_gameLoop);
}

function showEvent(scenario) {
  if (!textBox) return;

  textBox.style.display = 'block';
  textBox.innerHTML = `<p>${scenario.event}</p>`;

  if (!scenario.options.length) {
    textBox.innerHTML += `<button onclick="stopGame()">Encerrar Jornada</button>`;
    return;
  }

  // Cria os botões de forma dinâmica (sem perder atributos)
  scenario.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.textContent = opt.text;
    btn.onclick = () => chooseOption(opt); // mantém o objeto inteiro, inclusive letter:true
    textBox.appendChild(btn);
  });
}

function chooseOption(opt) {
  // Soma pontos
  ambicao += opt.ambicao || 0;
  empatia += opt.empatia || 0;
  coragem += opt.coragem || 0;
  adapt += opt.adapt || 0;
  etica += opt.etica || 0;

  
  textBox.innerHTML = `<p>Você escolheu: ${opt.text}. O carteiro segue sua rota...</p>`;
  textBox.style.display = 'block';

  if (opt.letter) {
    setTimeout(() => {
      showLetter();
    }, 800);
    return; 
  }


  setTimeout(() => {
    textBox.style.display = 'none';
    waitingNextScene = false;
  }, 1800);
}



function showLetter() {
  
  const carta = document.createElement('div');
  carta.style.position = 'fixed';
  carta.style.inset = '0';
  carta.style.display = 'flex';
  carta.style.alignItems = 'center';
  carta.style.justifyContent = 'center';
  carta.style.background = 'rgba(0, 0, 0, 0.85)';
  carta.style.zIndex = '9999';

  
  const box = document.createElement('div');
  Object.assign(box.style, {
    background: 'linear-gradient(#f4cfa1, #f6d9b3)',
    border: '4px solid #8b3a2b',
    borderRadius: '8px',
    padding: '20px 28px',
    maxWidth: '480px',
    fontFamily: "'Press Start 2P', monospace",
    color: '#3b1e06',
    textAlign: 'center',
    boxShadow: '0 0 10px rgba(0,0,0,0.6)',
    lineHeight: '1.6'
  });

  const title = document.createElement('h3');
  title.textContent = 'A Carta';
  Object.assign(title.style, {
    fontSize: '16px',
    marginBottom: '16px',
    textShadow: '1px 1px #fff'
  });

  const msg = document.createElement('p');
  msg.innerHTML = '"Querido carteiro, obrigado por entregar o que o mundo já havia esquecido: <b>esperança</b>."';
  Object.assign(msg.style, {
    fontSize: '12px',
    marginBottom: '10px'
  });

  const sign = document.createElement('p');
  sign.textContent = '— A cidade que você nunca deixou de cuidar.';
  sign.style.fontStyle = 'italic';
  sign.style.fontSize = '10px';

  const btn = document.createElement('button');
  btn.textContent = 'Fechar';
  Object.assign(btn.style, {
    marginTop: '20px',
    fontFamily: "'Press Start 2P', monospace",
    fontSize: '10px',
    padding: '6px 12px',
    border: '2px solid #3b1e06',
    borderRadius: '6px',
    background: '#d5b48c',
    color: '#3b1e06',
    cursor: 'pointer'
  });
  btn.onmouseenter = () => (btn.style.background = '#f0cf9d');
  btn.onmouseleave = () => (btn.style.background = '#d5b48c');
  
  // ⬇️ Aqui está o truque:
  // Ao fechar a carta, remove e segue pro próximo cenário
  btn.onclick = () => {
    carta.remove();
    waitingNextScene = true;
    setTimeout(() => {
      textBox.style.display = 'none';
      nextScenario();
    }, 500);
  };

  box.appendChild(title);
  box.appendChild(msg);
  box.appendChild(sign);
  box.appendChild(btn);
  carta.appendChild(box);
  document.body.appendChild(carta);
}





function _gameLoop(ts){
  const dt = Math.min(0.05,(ts-_lastTime)/1000);
  _lastTime=ts;

  const gameInner = document.getElementById('gameInner');
  if(gameInner && player.el){
    const innerW = gameInner.clientWidth;

    if(keys.left && !keys.right){
      player.x -= player.speed*dt;
      player.el.style.transform='scaleX(-1)';
    } else if(keys.right && !keys.left){
      player.x += player.speed*dt;
      player.el.style.transform='scaleX(1)';
    }

    const leftLimit = 8;
    const rightLimit = innerW - player.w - 8;
    if(player.x<leftLimit) player.x=leftLimit;
    if(player.x>rightLimit){
      player.x = rightLimit;
      if(!waitingNextScene) nextScenario();
    }
    player.el.style.left = Math.round(player.x)+'px';
  }

  _rafId = requestAnimationFrame(_gameLoop);
}

function _onKeyDown(e){ const k=e.key.toLowerCase(); if(k==='a'||k==='arrowleft'){keys.left=true;e.preventDefault();} if(k==='d'||k==='arrowright'){keys.right=true;e.preventDefault();} }
function _onKeyUp(e){ const k=e.key.toLowerCase(); if(k==='a'||k==='arrowleft'){keys.left=false;e.preventDefault();} if(k==='d'||k==='arrowright'){keys.right=false;e.preventDefault();} }



function nextScenario(){
  currentScenario++;
  if(currentScenario>=scenarios.length){ stopGame(); return; }
  const gameBg = document.getElementById('gameBg');
  if(gameBg) gameBg.src=scenarios[currentScenario].bg;
  player.x=20;
  player.el.style.left=player.x+'px';
  waitingNextScene=true;
  setTimeout(()=>showEvent(scenarios[currentScenario]),500);
}

function stopGame() {
  if (_rafId) cancelAnimationFrame(_rafId);
  window.removeEventListener("keydown", _onKeyDown);
  window.removeEventListener("keyup", _onKeyUp);
  waitingNextScene = true;

  const totals = { empatia, ambicao, coragem, adapt, etica };
  const maxVal = Math.max(...Object.values(totals));
  const topKeys = Object.keys(totals).filter(k => totals[k] === maxVal);

  const frases = {
    empatia: "O carteiro agiu guiado pelo coração. Psicologicamente, desenvolveu sensibilidade e compreensão; socialmente, fortaleceu laços e confiança com os outros; profissionalmente, demonstra liderança e colaboração. Suas escolhas mostram que cuidar do outro também constrói o próprio caminho.",
    ambicao: "Movido pela ambição, o carteiro avançou sem se deixar deter. Psicologicamente, ganhou foco e determinação; socialmente, pode ter deixado relações em segundo plano; profissionalmente, colhe oportunidades, mas precisa equilibrar ética e sucesso.",
    coragem: "O carteiro seguiu com coragem, enfrentando o desconhecido sem recuar. Psicologicamente, mostrou força e resiliência diante do medo; socialmente, inspirou confiança e autenticidade; profissionalmente, manteve princípios e tomou decisões firmes, transformando o medo em propósito.",
    adapt: "Entre coração e dever, o carteiro buscou equilíbrio. Psicologicamente, fortaleceu resiliência; socialmente, construiu relacionamentos saudáveis; profissionalmente, tomou decisões ponderadas, unindo humanidade e responsabilidade.",
    etica: "Fiel ao dever, o carteiro cumpre suas obrigações. Psicologicamente, mantém disciplina e estabilidade; socialmente, inspira confiança; profissionalmente, cria reputação sólida, mas pode sentir falta de satisfação emocional pessoal."
  };

  const gameInner = document.getElementById("gameInner");
  if (gameInner) {
    gameInner.style.transition = "opacity 1s ease";
    gameInner.style.opacity = "0";
    setTimeout(() => {
     
      gameInner.innerHTML = `
        <div id="lightOverlay" style="position:absolute; inset:0; background:radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.95) 70%); transition: opacity 2s;"></div>
        <img src="carteiro.png" id="carteiroSpriteFinal" style="position:absolute; bottom:50px; left:50%; transform:translateX(-50%); width:150px; filter:brightness(0); opacity:0; transition: filter 2s, opacity 2s;">
        <div class="dialogue-box" id="dialogueFinal" style="display:none; opacity:0; transition: opacity 1s;"></div>
      `;
      gameInner.style.background = "black";
      gameInner.style.opacity = "1";
      showFinalIntro();
    }, 1000);
  }

 
  function showFinalIntro() {
    const sprite = document.getElementById("carteiroSpriteFinal");
    const light = document.getElementById("lightOverlay");
    const balloon = document.getElementById("dialogueFinal");

    setTimeout(() => {
      sprite.style.filter = "brightness(1.5) contrast(1.2) saturate(1.8)";
      sprite.style.opacity = "1";
    }, 600);

    let breatheUp = true;
    const breatheInterval = setInterval(() => {
      sprite.style.transform = breatheUp ? "translateX(-50%) translateY(-4px)" : "translateX(-50%) translateY(0px)";
      breatheUp = !breatheUp;
    }, 900);

    
    const textos = [
      "Ao terminar sua jornada, o carteiro percebeu que cada escolha refletiu mais quem ele é do que o ambiente à sua volta.",
      "Ele entendeu que nem sempre existe uma opção totalmente certa ou errada, mas sempre há uma consequência.",
      "E que, apesar disso, amanhã sempre traz uma nova chance de recomeçar, evoluir e agir diferente.",
      "Com essa certeza, o carteiro segue em frente, carregando não apenas cartas. Mas tudo aquilo que aprendeu pelo caminho."
    ];

    let i = 0;
    function escreverTexto(texto, callback) {
      balloon.innerHTML = "";
      let idx = 0;
      balloon.style.display = "block";
      balloon.style.opacity = 1;

      function digitar() {
        if (idx < texto.length) {
          balloon.innerHTML = texto.slice(0, idx + 1);
          idx++;
          setTimeout(digitar, 35);
        } else {
          setTimeout(callback, 1000);
        }
      }
      digitar();
    }

    function mostrarLinha() {
      if (i < textos.length) {
        escreverTexto(textos[i], () => {
          i++;
          mostrarLinha();
        });
      } else {
        clearInterval(breatheInterval);
        light.style.opacity = "0";
        setTimeout(showFinalScreen, 1500);
      }
    }

    mostrarLinha();
  }

  
  function showFinalScreen() {
    const overlay = document.createElement("div");
    overlay.className = "final-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "9999"
    });

    const box = document.createElement("div");
    Object.assign(box.style, {
      background: "linear-gradient(#f4cfa1, #f6d9b3)",
      border: "4px solid #8b3a2b",
      borderRadius: "8px",
      padding: "24px 32px",
      maxWidth: "520px",
      textAlign: "center",
      fontFamily: "'Press Start 2P', monospace",
      color: "#3b1e06",
      boxShadow: "0 0 10px rgba(0,0,0,0.5)",
      lineHeight: "1.6"
    });

    const title = document.createElement("h2");
    title.textContent = "Fim da Jornada";
    Object.assign(title.style, {
      fontSize: "18px",
      marginBottom: "20px",
      textShadow: "1px 1px #fff"
    });

    const makeLine = (label, val) => {
      const p = document.createElement("p");
      p.textContent = `${label}: ${val}`;
      p.style.margin = "6px 0";
      p.style.fontSize = "14px";
      return p;
    };

    const scores = document.createElement("div");
    scores.appendChild(makeLine("Empatia", empatia));
    scores.appendChild(makeLine("Coragem", coragem));
    scores.appendChild(makeLine("Ambição", ambicao));
    scores.appendChild(makeLine("Equilíbrio", adapt));
    scores.appendChild(makeLine("Ética", etica));

    const hr = document.createElement("hr");
    Object.assign(hr.style, {
      border: "none",
      borderTop: "2px dashed #8b3a2b",
      margin: "14px 0"
    });

    const destaque = document.createElement("h3");
    destaque.style.fontSize = "14px";
    destaque.style.marginTop = "10px";

    let mensagemFinal = "";
    if (topKeys.length === 1) {
      const key = topKeys[0];
      destaque.textContent = `Você se destacou em: ${key.charAt(0).toUpperCase() + key.slice(1)}!`;
      mensagemFinal = frases[key] || "Você demonstrou grande virtude em sua jornada.";
    } else {
      const labelList = topKeys.map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(" + ");
      destaque.textContent = `Equilíbrio: ${labelList}`;
      mensagemFinal = frases["adapt"];
    }

    const fraseEl = document.createElement("p");
    fraseEl.textContent = mensagemFinal;
    Object.assign(fraseEl.style, {
      fontSize: "12px",
      lineHeight: "1.6",
      marginTop: "8px"
    });

    const btn = document.createElement("button");
    btn.textContent = "Reiniciar";
    Object.assign(btn.style, {
      marginTop: "20px",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "10px",
      padding: "6px 12px",
      border: "2px solid #3b1e06",
      borderRadius: "6px",
      background: "#d5b48c",
      color: "#3b1e06",
      cursor: "pointer"
    });
    btn.onmouseenter = () => (btn.style.background = "#f0cf9d");
    btn.onmouseleave = () => (btn.style.background = "#d5b48c");
    btn.onclick = () => location.reload();

    box.appendChild(title);
    box.appendChild(scores);
    box.appendChild(hr);
    box.appendChild(destaque);
    box.appendChild(fraseEl);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }
}
