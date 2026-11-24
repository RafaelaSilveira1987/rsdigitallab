# RS Digital Lab — Redesign Tech / Cinema

Versão de revisão visual da página principal **partindo do ZIP `rs-digital-lab.zip` enviado pela cliente**. A estrutura React + TypeScript + TanStack Start + Tailwind CSS foi preservada. Não foi feita uma reconstrução em HTML estático.

## Direção de arte

- Logomarca **original** mantida em `public/logo.png`; a variante `public/logo-contrast.png` apenas clareia a palavra DIGITAL para melhorar a leitura sobre fundo escuro.
- Azul elétrico, ciano, violeta e azul-marinho profundo: identidade tecnológica da RS Digital Lab. O dourado da proposta anterior foi removido.
- Abertura cinematográfica com animação de texto, vídeo ambiente local, malha digital, auroras de luz, painéis e camadas de profundidade.
- Efeitos de **tilt** com o mouse, **parallax** no scroll, revelaçōes suaves, contadores, letreiro contínuo, hover de preto e branco para cor e menus responsivos.
- Respeito à configuração de acessibilidade `prefers-reduced-motion` (sem movimento automático quando ativada).
- Layout responsivo com atenção às larguras mais estreitas.

## Preservação do projeto

- **Preservados:** `src/components`, `src/lib`, `src/router.tsx`, `src/start.ts`, `src/server.ts`, TanStack, configuração Vite e testes de roteamento recebidos.
- **Redesenhados:** `src/routes/index.tsx`, `src/styles.css` e fonte / metadados em `src/routes/__root.tsx`.
- **Mantidos:** `public/logo.png`, `public/favicon.png` e as seis miniaturas do ZIP React; criada versão de contraste da mesma logo sem alterar o desenho.
- **Incluídas** as seis demonstrações completas extraídas do outro ZIP original (`landing-pages-main.zip`) disponibilizado na conversa, em `public/demos/`, sem alterar os projetos individualmente.
- **Incluídos:** vídeo/poster local em `public/media/`, metadados Open Graph e links de contato direto para WhatsApp.

## Testar localmente

Exige Node.js 22 ou superior e acesso à internet na primeira instalação de dependências.

```bash
npm install
npm run dev
```

Acesse o endereço local mostrado no terminal pelo Vite. Para preparar uma entrega de produção:

```bash
npm run build
npm run preview
```

Os botões **Explorar projeto** das seis cenas abrem as demonstrações locais em `/demos/.../` (incluídas). O contato abre `wa.me/5532987073537` com uma mensagem pré-preenchida, número já presente no site recebido anteriormente.

## EasyPanel / GitHub

A implantação agora é uma **aplicação React com build**, e **não** o mesmo container Nginx estático usado na versão HTML anterior. O `Dockerfile` incluído é uma proposta de build com Node.js 22 e TanStack/Nitro com porta 3000. **Homologue o build local e a execução do container antes de trocar o domínio atual.**

1. Crie uma branch e envie os arquivos completos deste projeto para o repositório.
2. Teste `npm install`, `npm run build` e os links de demonstrações.
3. No EasyPanel, selecione o projeto do repositório usando o `Dockerfile` na raiz.
4. Configure a porta interna `3000` e publique **primeiro em domínio temporário**.
5. Quando a versão estiver homologada, aponte o domínio principal para o serviço aprovado.

## Testes realizados e pendências

**Feitos nesta entrega:**

- Validação sintática/transpilação isolada do componente TSX via TypeScript.
- Verificação de seis cenas, seis caminhos locais de demonstração e presença dos recursos.
- Revisão de layout por renderização estática equivalente, com telas em 1440, 390 e 320 px, sem scroll horizontal ou erros na captura estática.
- Validação da existência das imagens e do vídeo de abertura.

**Não homologados neste ambiente:**

- A instalação de pacotes `npm install` falhou por indisponibilidade de DNS do registry (`EAI_AGAIN`), não por erro constatado no código do projeto.
- Portanto, o build TanStack, a hidratação React e a execução real no EasyPanel ainda precisam de testes no computador/deploy. A prévia visual não substitui estes testes.

## Homologação funcional sugerida

1. Abrir a home em desktop e celular; verificar abertura, marca e botões.
2. Rolar pela página; conferir contadores e as seis cenas com parallax / hover.
3. Abrir todas as demonstrações (01 a 06).
4. Testar menu mobile, CTA WhatsApp e botão de voltar ao topo.
5. Simular `prefers-reduced-motion: reduce` no navegador.
6. Validar build e container antes de atualizar o domínio de produção.
