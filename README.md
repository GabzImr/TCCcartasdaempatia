# Cartas e Caminhos — Jogo de Teste de Personalidade
> **Habilidades de Vida no Ambiente de Trabalho:** O Impacto das Experiências Cotidianas e um Jogo como Ferramenta de Reflexão.
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#tecnologias-utilizadas)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#tecnologias-utilizadas)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#tecnologias-utilizadas)
 **Repositório:** [github.com/GabzImr/TCCcartasdaempatia](https://github.com/GabzImr/TCCcartasdaempatia)
---
##  Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Objetivo Acadêmico](#-objetivo-acadêmico)
- [Como Funciona o Jogo](#-como-funciona-o-jogo)
- [Habilidades Avaliadas](#-habilidades-avaliadas)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Controles](#-controles)
- [Documentos](#-proposta)
- [Telas](#-Prints)
  

## Sobre o Projeto

O presente Trabalho de Conclusão de Curso (TCC) tem como tema o desenvolvimento de um jogo de teste de personalidade ambientado na rotina de um carteiro em pixel art.
O projeto integra **narrativa interativa**, **gamificação** e **psicologia comportamental** para representar situações cotidianas que exigem habilidades socioemocionais aplicadas ao ambiente de trabalho.
Em um cenário profissional contemporâneo que exige competências como **empatia**, **adaptabilidade**, **ética**, **coragem** e **tomada de decisão sob pressão**, o jogo busca simular dilemas reais enfrentados por trabalhadores. As escolhas realizadas pelo jogador ao longo da gameplay refletem comportamentos alinhados a essas habilidades, permitindo a construção de um **perfil baseado em sua experiência interativa**.

##  Objetivo Acadêmico
O projeto propõe um sistema **lúdico, acessível e educativo** que une:
-  **Arte digital** (pixel art)
-  **Desenvolvimento front-end**
-  **Reflexão sobre vivências pessoais**
Reconhecendo que habilidades profissionais muitas vezes são desenvolvidas em **contextos não formais**, o jogo se estabelece como uma **ferramenta digital de autoconhecimento e sensibilização para o mundo do trabalho**.
---
##  Como Funciona o Jogo
O jogador assume o papel de um **carteiro** que percorre a cidade realizando entregas. Em cada cenário, uma **situação-dilema** é apresentada e o jogador deve escolher entre diferentes opções de ação.
```
 Cenário →  Dilema →  Escolha →  Perfil de Personalidade
```
### Exemplos de cenários:

 Cenário 
|
 Dilema 
|
|
 Casa sem número 
|
 O carteiro encontra uma casa sem número, mas o nome na carta parece familiar 
|
|
 2 
|
 Cachorro machucado 
|
 Um cachorro machucado está na calçada, parece ter dono 
|
|
 3 
|
 Criança triste 
|
 O vento levou a carta de uma criança antes de ser entregue 
|
|
 4 
|
 Carta misteriosa 
|
 Uma carta sem remetente, com o seu próprio nome escrito 
|
|
 5 
|
 Senhora com caixas 
|
 Uma senhora pede ajuda para carregar caixas até o portão 
|
|
 6 
|
 Entrega extra 
|
 Um jovem pede para entregar uma carta em outra cidade 
|
|
 7 
|
 Criança desastrada 
|
 Uma criança corre e quase derruba as cartas 
|
|
 8 
|
 Morador irritado 
|
 Um morador reclama de uma entrega atrasada 
|
|
 9 
|
 Carteira perdida 
|
 Você encontra uma carteira caída na rua 
|
|
 10 
|
 Tempestade 
|
 Uma tempestade forte começa durante as entregas 
|
|
 11 
|
 Idoso solitário 
|
 Um morador idoso convida o carteiro para tomar um café 
|
|
 12 
|
 Colega em apuros 
|
 Um colega carteiro com o carro quebrado no caminho 
|

##  Habilidades Avaliadas
Cada escolha no jogo pontua em **5 dimensões comportamentais**:
|
 Habilidade 
|
 Descrição 
| 

Empatia

|
 Capacidade de se colocar no lugar do outro e agir com compaixão 
|
|
  

Ambição

|
 Foco em metas, produtividade e resultados pessoais 
|
|
  

Coragem

|
 Disposição para enfrentar desafios e sair da zona de conforto 
|
|
 

Adaptabilidade

|
 Flexibilidade diante de situações inesperadas 
|
|

Ética
|
 Senso de justiça, honestidade e responsabilidade 
|
Ao final, o jogador recebe um **perfil de personalidade** baseado no conjunto de suas escolhas.


##  Funcionalidades
-  Tela de menu estilizada em pixel art com cenário de fundo animado
-  Navegação por teclado (setas ↑↓ e Enter) e mouse/toque
-  Modal de instruções acessível
-  12+ cenários com dilemas interativos
-  Sistema de pontuação em 5 habilidades socioemocionais
-  Efeitos visuais flutuantes (luzes, papéis, faíscas, símbolos)
-  Movimentação do personagem com teclas A/D
-  Arte pixel art original em todos os cenários
-  Resultado personalizado ao final do jogo
-  Funciona 100% no navegador — sem backend necessário

 ##  Tecnologias Utilizadas
|
 Tecnologia 
|
 Função 
|
**
HTML5
**
|
 Estrutura e semântica das páginas 
|
|
**
CSS3
**
|
 Estilização, animações e efeitos visuais 
|
|
**
JavaScript (ES6+)
**
|
 Lógica do jogo, navegação e interatividade 
|
|
**
Google Fonts
**
|
 Tipografia pixel (Press Start 2P) 
|
|
**
Pixel Art
**
|
 Arte visual original dos cenários e personagens 
|

##  Estrutura do Projeto
```
TCCcartasdaempatia/
├── index.html              # Tela de menu principal
├── style.css               # Estilos do menu e componentes gerais
├── script.js               # Lógica do menu, cenários e gameplay
├── effects-floating.js     # Efeitos visuais flutuantes (luzes, faíscas)
├── effects-floating.css    # Estilos dos efeitos flutuantes
├── README.md               # Documentação do projeto
└── img/                    # Assets visuais
    ├── cenario.png          # Cenário de fundo do menu
    ├── carta1.png           # Carta animada (menu)
    ├── carta2.png           # Carta animada (menu)
    ├── person1.png          # Personagem NPC
    ├── bg1.png              # Cenário 1 — Casa sem número
    ├── bg2.png              # Cenário 2 — Cachorro machucado
    ├── bg3.png              # Cenário 3 — Criança triste
    ├── bg4.png              # Cenário 4 — Carta misteriosa
    ├── bg5.png              # Cenário 5 — Senhora com caixas
    ├── bg6.png              # Cenário 6 — Entrega extra
    ├── bg7.png              # Cenário 7 — Criança desastrada
    ├── bg8.png              # Cenário 8 — Morador irritado
    ├── bg9.png              # Cenário 9 — Carteira perdida
    ├── bg10.png             # Cenário 10 — Tempestade
    ├── bg11.png             # Cenário 11 — Idoso solitário
    └── bg12.png             # Cenário 12 — Colega em apuros
```

 Controles
|
 Ação 
|
 Teclado 
|
 Mouse/Toque 
|
 Navegar no menu 
|
`↑`
`↓`
|
 Clique no botão 
|
 Selecionar opção 
|
`Enter`
|
 Clique no botão 
|
 Andar para a esquerda 
|
`A`
|
 — 
|
|
 Andar para a direita 
|
`D`
|
 — 
|

##  English Summary
**Life Skills in the Workplace: The Impact of Everyday Experiences and a Game as a Tool for Reflection.**
This Final Course Project focuses on the development of a personality test game set in the routine of a mail carrier in pixel art. The project integrates interactive narrative, gamification, and behavioral psychology to represent everyday situations that require socio-emotional skills applied to the workplace. Using HTML5, CSS3 and JavaScript, the game runs entirely in the browser, serving as a digital tool for self-knowledge and workplace awareness.


## Documentos e Proposta

[Documento Explicativo do Tcc- Cartas e Caminhos.docx](https://github.com/user-attachments/files/28430314/Documento.Explicativo.do.Tcc-.Cartas.e.Caminhos.docx)
[Pré projeto tcc (1) (2).docx](https://github.com/user-attachments/files/28430376/Pre.projeto.tcc.1.2.docx)


## Telas

Tela Inicial


<img width="1911" height="933" alt="screenshot-1780186236276" src="https://github.com/user-attachments/assets/25ba7950-d8e7-41e7-a956-54fbc9b1d4cb" />

Tutorial


<img width="1442" height="769" alt="Captura de tela_14-6-2026_112448_gabzimr github io" src="https://github.com/user-attachments/assets/ecce9290-fdf9-4c4f-abdc-8d6368ec397e" />

Lore


<img width="1647" height="848" alt="Captura de tela_30-5-2026_205046_gabzimr github io" src="https://github.com/user-attachments/assets/d77441a5-908a-4f51-853d-e95771c909da" />

Escolhas


<img width="1752" height="831" alt="Captura de tela_30-5-2026_20525_gabzimr github io" src="https://github.com/user-attachments/assets/a7c3f3f4-5ef6-4bb8-92c5-b9725f6db9db" />

Resultado


<img width="1701" height="786" alt="Captura de tela_30-5-2026_205310_gabzimr github io" src="https://github.com/user-attachments/assets/b84b4812-11c2-4e5a-8dfb-ded99949f468" />




<p align="center">
  Feito como Trabalho de Conclusão de Curso
</p>
