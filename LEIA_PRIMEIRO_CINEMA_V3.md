# RS Digital Lab — Cinema V3 | Entrega para homologação

## O que foi corrigido

A versão anterior ficou aquém do roteiro original. Esta revisão recria de verdade:

1. **Vídeo no hero:** `public/cinema/assets/abertura-studio.mp4` (11 segundos, reprodução local contínua, sem som). O vídeo contém um movimento de câmera por um cenário de teclado e telas, produzido a partir de uma imagem base; não é uma gravação de mãos realmente digitando. Há efeito adicional de câmera CSS, sem dependência de provedores externos.
2. **Títulos cinematográficos:** linhas separadas com atrasos de 0,45s / 0,92s / 1,36s. Entram com deslocamento e desfoque; não ficam estáticas.
3. **Marca:** logotipo RS Digital Lab preservado, fundo profundo, azul-ciano e violeta, grão discreto e vinheta.
4. **Seis projetos como cenas:** cenas de tela inteira, uma por rolagem; foto em escala, filtro preto e branco que ganha cor ao passar o mouse, parallax e holofote seguindo o cursor.
5. **Contadores e créditos:** 06 projetos e 05+ segmentos (valores consolidados), contador progressivo visível quando o bloco entra na tela, letreiro infinito com movimento.
6. **Três atos:** entender, imaginar, realizar com imagens e transições.
7. **Final:** "O próximo projeto pode ser o seu", apenas um CTA principal de WhatsApp.

## TESTE IMEDIATO SEM NPM — recomendado primeiro

Descompacte o ZIP e **abra `public/cinema/index.html` no Chrome**. A página roda localmente sem build. Ela compartilha o mesmo HTML visual, CSS e JavaScript que a versão React. O vídeo e as 6 demos ficam dentro do pacote. Não é necessário iniciar o WAMP.

Para verificar: (1) recarregue a página e veja as três linhas entrarem sucessivamente; (2) observe o fundo em movimento; (3) role devagar pelos 6 projetos; (4) passe o mouse nas imagens para ver a cor retornar; (5) veja os números e o letreiro; (6) clique em "Explorar este projeto" e confira a demonstração; (7) role até a cena final.

## TESTE REACT/TANSTACK (mesmos efeitos)

Abra PowerShell na pasta raiz do projeto (onde fica `package.json`):

```powershell
npm install
npm run dev
```

Acesse a URL local exibida (normalmente `http://localhost:5173/`). O componente em `src/routes/index.tsx` integra a cena de `src/cinemaMarkup.ts`, carregando os mesmos arquivos `public/cinema/assets/site.css` e `app.js`. Componentes e arquivos restantes do projeto React foram mantidos.

**Atenção:** neste ambiente de criação o acesso ao registro npm falhou. Portanto, a compilação final React (`npm run build`) **não foi validada** aqui; não publicar a variante React sem validar esse comando em sua máquina. A prévia estática foi executada em Chromium com testes de animações.

## PUBLICAÇÃO NO EASYPANEL — versão estática, sem npm

O `Dockerfile.cinema` usa Nginx e publica a mesma experiência estática testada.

- Aponte o deploy do repositório para **`Dockerfile.cinema`**, na raiz.
- Porta HTTP **80** no container.
- Faça deploy inicialmente em domínio temporário e teste os 6 links em `/demos/` antes de trocar o domínio principal.
- `Dockerfile` sem sufixo continua para o deploy React/TanStack, caso deseje validar essa versão separadamente.

## Validação realizada

- Chromium: 1440px, 390px e 320px; sem rolagem horizontal, sem exceções JavaScript nos testes.
- Vídeo: `currentTime` avançou e `paused=false` nos três tamanhos.
- Texto da abertura: opacidade das três linhas mudou em instantes diferentes (200ms, 1050ms, 3000ms).
- Contadores após animação: `06` e `05+`.
- Interseção: todas as cinco partes da primeira cena reveladas ao rolar.
- Hover: filtro mudou de `grayscale(1)` para `grayscale(0)` no desktop.
- Seis cenas e seis arquivos `index.html` das demonstrações presentes.
- Menu mobile abre e fecha; modo acessibilidade “reduzir movimento” pausa o vídeo e exibe conteúdo.

**Limitação:** por política de rede do ambiente, a renderização automatizada usou uma cópia *autocontida* do mesmo HTML/CSS/JS e mídias embutidas. Isso comprova os efeitos do navegador, mas não substitui teste final do projeto React e do container Nginx publicado.

## Rastreabilidade / preservação

- `src/routes/index.tsx`: principal arquivo React redesenhado.
- `src/cinemaMarkup.ts`: HTML da página, equivalente ao conteúdo de `public/cinema/index.html`.
- `public/cinema/assets/site.css`: visual, animações, breakpoints.
- `public/cinema/assets/app.js`: IntersectionObserver, contadores, parallax, vídeo, menu.
- `public/demos/`: seis demos originais e suas imagens/códigos.
- `referencias/index-original-lovable.tsx.txt`: rota de entrada do ZIP Lovable original, guardada como referência para auditoria.

## Verificações antes de publicar

O link do WhatsApp está configurado com o número usado na versão anterior: `55 32 98707-3537`. **Confirme esse número** antes de publicar. Revise também textos, nomes dos projetos e imagens de apresentação com o titular de cada projeto.
