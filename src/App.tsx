import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';

const LOGIN_URL = 'https://rsdigitallab.com/rsconnect/login';
const CONTACT_URL = 'https://rsdigitallab.com';
const ASSET = '/assets/';

type IconName = 'arrow' | 'message' | 'users' | 'calendar' | 'robot' | 'layers' | 'chart' | 'zap' | 'check' | 'shield' | 'whatsapp' | 'menu' | 'x' | 'play' | 'lock';
function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return <svg aria-hidden="true" className={className}><use href={`#i-${name}`} /></svg>;
}
function Gradient({ children }: { children: ReactNode }) { return <span className="type-gradient">{children}</span>; }

const modules: { icon: IconName; title: string; body: string; foot: string }[] = [
  { icon: 'message', title: 'Atendimentos', body: 'Conversas centralizadas, continuidade por equipe e distribuição por setores.', foot: 'WhatsApp e equipe' },
  { icon: 'users', title: 'Clientes', body: 'Contatos, solicitações e histórico em uma experiência organizada.', foot: 'Relacionamento' },
  { icon: 'calendar', title: 'Agenda', body: 'Compromissos, disponibilidades e solicitações de agendamento.', foot: 'Gestão de horários' },
  { icon: 'chart', title: 'Comercial', body: 'Oportunidades, propostas, orçamentos e atividades em um funil visual.', foot: 'Oportunidades' },
  { icon: 'layers', title: 'CRM', body: 'Acompanhe a trajetória do cliente e visualize os próximos passos.', foot: 'Visão integrada' },
  { icon: 'zap', title: 'IA e automação', body: 'Regras por empresa e assistente, com supervisão e atendimento humano.', foot: 'Regras configuráveis' },
];

const journey = [
  { title: 'UMA CONVERSA', emphasis: 'COMEÇA.', description: 'O primeiro “olá” chega pelo WhatsApp. Em vez de desaparecer em uma caixa de mensagens isolada, a solicitação entra em uma operação organizada.', category: 'WHATSAPP · ATENDIMENTO' },
  { title: 'A INTELIGÊNCIA', emphasis: 'APOIA.', description: 'O assistente segue as configurações definidas pela empresa, enquanto a equipe mantém a supervisão e pode assumir o atendimento.', category: 'IA CONFIGURÁVEL · AUTOMAÇÃO' },
  { title: 'O RELACIONAMENTO', emphasis: 'AVANÇA.', description: 'Histórico, oportunidades, compromissos e tarefas ajudam a equipe a continuar a conversa sem perder o contexto.', category: 'CRM · AGENDA · COMERCIAL' },
];

const flow = [
  { icon: 'whatsapp' as IconName, short: 'A conversa começa', description: 'O cliente envia uma mensagem pelo canal conectado.', heading: 'O primeiro contato abre uma jornada.', detail: 'A conversa pode ser recebida e acompanhada pela equipe no ambiente de atendimento.' },
  { icon: 'users' as IconName, short: 'O contato ganha contexto', description: 'Informações e histórico ajudam a reconhecer cada cliente.', heading: 'Cada história tem o seu contexto.', detail: 'O cadastro e a conversa ficam associados para dar continuidade ao relacionamento.' },
  { icon: 'robot' as IconName, short: 'A IA apoia o atendimento', description: 'Políticas e regras configuráveis orientam respostas e repasses.', heading: 'Automatizar não é abrir mão do controle.', detail: 'O comportamento do assistente depende das regras e autorizações configuradas pela empresa.' },
  { icon: 'calendar' as IconName, short: 'A equipe vê o próximo passo', description: 'Agenda, tarefas e CRM organizam o acompanhamento.', heading: 'A próxima ação não fica esquecida.', detail: 'Solicitações e oportunidades podem ser tratadas por pessoas autorizadas.' },
];

const conversations = [
  ['Olá! Gostaria de saber mais sobre o atendimento.', 'Olá! 👋 Como podemos ajudar você hoje?', 'Quero verificar um horário.'],
  ['Preciso falar sobre um orçamento.', 'Vamos organizar sua solicitação para a equipe.', 'Obrigado! Aguardo o retorno.'],
  ['Posso continuar um atendimento anterior?', 'Vamos consultar o contexto da sua solicitação.', 'Ótimo, era isso mesmo!'],
];

function useReducedMotion() {
  const [reduce, setReduce] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduce(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return reduce;
}

function usePageEffects() {
  useEffect(() => {
    const header = document.querySelector('.site-header');
    const progress = document.querySelector<HTMLElement>('.scroll-progress');
    const back = document.querySelector('.back-to-top');
    let request = 0;
    const update = () => {
      request = 0;
      const top = window.scrollY;
      const total = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      header?.classList.toggle('scrolled', top > 30);
      back?.classList.toggle('visible', top > 560);
      if (progress) progress.style.width = `${Math.min(100, (top / total) * 100)}%`;
      document.documentElement.style.setProperty('--page-progress', String(top / total));
    };
    const schedule = () => { if (!request) request = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();
    return () => { cancelAnimationFrame(request); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  useEffect(() => {
    const elements = [...document.querySelectorAll('.reveal')];
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(e => e.classList.add('in'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); } });
    }, { threshold: .10, rootMargin: '0px 0px -15px 0px' });
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function isVisible(selector: string) {
  const el = document.querySelector(selector);
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.top < innerHeight * .92 && r.bottom > innerHeight * .06;
}

function Header({ paused, reduce, onToggle }: { paused: boolean; reduce: boolean; onToggle: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const close = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  const nav = [['A solução','#solucao'],['Módulos','#modulos'],['Como funciona','#fluxo'],['CRM','#crm'],['Dúvidas','#duvidas']];
  return <>
    <div className="scroll-progress" aria-hidden="true" />
    <header className="site-header" id="topo">
      <div className="nav-shell container">
        <a className="brand" href="#inicio" aria-label="RS Connect — início" onClick={() => setMenuOpen(false)}><img src={`${ASSET}img/rs-connect-logo-clara.png`} width="210" height="64" alt="RS Connect" /></a>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} id="primaryNav" aria-label="Navegação principal">
          {nav.map(([text,url]) => <a key={text} href={url} onClick={() => setMenuOpen(false)}>{text}</a>)}
          <a className="mobile-nav-login" href={LOGIN_URL} target="_blank" rel="noreferrer">Acessar sistema</a>
        </nav>
        <div className="nav-actions"><a className="login-link" href={LOGIN_URL} target="_blank" rel="noreferrer">Acessar sistema</a><a className="btn btn-sm btn-primary nav-cta" href="#contato">Conhecer a RS Connect <Icon name="arrow" /></a></div>
        {!reduce && <button className="motion-top-control" type="button" aria-pressed={paused} title={paused ? 'Retomar animações' : 'Pausar animações'} onClick={onToggle}><span className="motion-top-dot" />{paused ? 'Retomar' : 'Pausar'} movimento</button>}
        <button className="menu-toggle" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-controls="primaryNav" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'x' : 'menu'} /></button>
      </div>
    </header>
  </>;
}

function DashboardPreview({ chatIndex, onPointerMove, onPointerLeave }: { chatIndex: number; onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void; onPointerLeave: () => void }) {
  const contacts = ['Mariana Costa', 'João Martins', 'Ana Beatriz', 'Lucas Almeida', 'Clara Ribeiro'];
  return <div className="hero-visual" id="heroVisual" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
    <div className="visual-aura" aria-hidden="true" />
    <div className="app-preview scene-tilt">
      <div className="preview-sidebar">
        <div className="preview-logo"><img src={`${ASSET}img/rs-connect-logo-clara.png`} alt="" /></div>
        {(['Atendimentos', 'Clientes', 'Agenda', 'Comercial', 'CRM', 'Automação'] as const).map((name,i) => <div key={name} className={`side-item${!i?' active':''}`}><Icon name={(['message','users','calendar','chart','layers','zap'] as IconName[])[i]} />{name}</div>)}
      </div>
      <div className="preview-content">
        <div className="preview-head"><div><span>VISÃO CONECTADA</span><strong>Atendimentos</strong></div><span className="preview-status"><b /> Demonstração</span></div>
        <div className="preview-list"><div className="preview-conversations">
          {contacts.map((name,i) => <div className={`p-contact${i===0?' selected':''}`} key={name}><div className="p-avatar">{name[0]}</div><span><b>{name}</b><small>{['Gostaria de saber mais','Preciso de um horário','Dúvida sobre serviços','Retorno programado','Solicitação registrada'][i]}</small></span><em /></div>)}
        </div>
        <div className="preview-chat" aria-label="Exemplo ilustrativo de conversa do WhatsApp"><span className="chat-label">SIMULAÇÃO DE CONVERSA</span><div key={`${chatIndex}-a`} className="bubble incoming">{conversations[chatIndex][0]}</div><div key={`${chatIndex}-b`} className="bubble outgoing">{conversations[chatIndex][1]}</div><div key={`${chatIndex}-c`} className="bubble incoming">{conversations[chatIndex][2]}</div><div className="chat-composer">Sua mensagem... <Icon name="message" /></div></div></div>
      </div>
    </div>
    <div className="float-tag tag-ai"><Icon name="robot" /> IA configurável</div>
    <div className="float-tag tag-agenda"><Icon name="calendar" /> Agenda integrada</div>
    <div className="floating-metric metric-a"><Icon name="layers" /><span><strong>CRM conectado</strong><small>Contexto em cada etapa</small></span></div>
    <div className="floating-metric metric-b"><Icon name="whatsapp" /><span><strong>WhatsApp</strong><small>Atendimento centralizado</small></span></div>
    <div className="hero-floor" aria-hidden="true" />
  </div>;
}

function Hero({ paused, reduce }: { paused: boolean; reduce: boolean }) {
  const film = useRef<HTMLVideoElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const [chatIndex, setChatIndex] = useState(0);
  useEffect(() => {
    if (paused || reduce) { film.current?.pause(); return; }
    const video = film.current;
    const start = () => { if (isVisible('.hero') && !document.hidden) video?.play().catch(() => undefined); else video?.pause(); };
    window.addEventListener('scroll', start, { passive: true });
    document.addEventListener('visibilitychange', start);
    start();
    return () => { window.removeEventListener('scroll', start); document.removeEventListener('visibilitychange', start); video?.pause(); };
  }, [paused, reduce]);
  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(() => {
      if (!document.hidden && isVisible('.hero')) setChatIndex(i => (i + 1) % conversations.length);
    }, 6200);
    return () => window.clearInterval(id);
  }, [paused, reduce]);
  const handlePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (paused || reduce || !window.matchMedia('(hover:hover) and (min-width:951px)').matches || !scene.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX / r.width - r.left / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    scene.current.style.transform = `rotateY(${-6 + x * 8}deg) rotateX(${3 - y * 6}deg)`;
  };
  return <section className="hero" aria-labelledby="hero-title">
    <div className="cinema-background" aria-hidden="true">
      <video className="hero-film" ref={film} autoPlay loop muted playsInline preload="metadata" poster={`${ASSET}img/rs-connect-logo-original.png`}><source src={`${ASSET}video/rs-connect-cinematic.mp4`} type="video/mp4" /></video>
      <span className="film-overlay" /><span className="cinema-beam b1" /><span className="cinema-beam b2" /><span className="cinema-beam b3" /><span className="cinema-orbit o1" /><span className="cinema-orbit o2" /><span className="cinema-grain" />
    </div>
    <div className="container hero-grid">
      <div className="hero-copy"><div className="hero-eyebrow eyebrow"><span className="eyebrow-dot" /> INTELIGÊNCIA PARA UMA OPERAÇÃO CONECTADA</div>
        <h1 className="hero-title" id="hero-title"><span className="cinema-line"><span>ATENDIMENTO</span></span><span className="cinema-line"><span>ORGANIZADO E</span></span><span className="cinema-line"><span className="type-gradient">AUTOMÁTICO.</span></span></h1>
        <p className="hero-lead"><strong>Sua operação conectada, em tempo real.</strong> WhatsApp, atendimento, agenda, clientes, CRM e automações trabalhando juntos em uma única experiência.</p>
        <div className="hero-cta"><a className="btn btn-primary" href="#experiencia">Viva a experiência <Icon name="arrow" /></a><a className="btn btn-outline" href="#modulos">Explore os módulos <Icon name="layers" /></a></div>
        <div className="hero-proof"><span className="mini-trace" />WHATSAPP <i /> IA CONFIGURÁVEL <i /> CRM <i /> AGENDA</div>
      </div>
      <div ref={scene} className="hero-visual-holder"><DashboardPreview chatIndex={chatIndex} onPointerMove={handlePointer} onPointerLeave={() => { if (scene.current) scene.current.style.transform=''; }} /></div>
    </div>
    <div className="scroll-hint"><span className="scroll-hint-line"/>ROLE PARA EXPLORAR</div>
  </section>;
}

function Journey({ paused, reduce }: { paused: boolean; reduce: boolean }) {
  const beats = useRef<HTMLDivElement>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  useEffect(() => {
    if (paused || reduce) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const items = [...(beats.current?.querySelectorAll<HTMLElement>('.journey-beat') || [])];
      if (!items.length) return;
      const focus = innerHeight * (innerWidth < 690 ? .77 : .5);
      let best = 0; let distance = Infinity;
      items.forEach((item,i) => { const box=item.getBoundingClientRect(); const d=Math.abs(box.top+box.height*.5-focus); if (d < distance) { distance=d; best=i; } });
      setSceneIndex(best);
    };
    const schedule=()=>{ if (!raf) raf=requestAnimationFrame(update); };
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);update();
    return ()=>{ cancelAnimationFrame(raf);removeEventListener('scroll',schedule);removeEventListener('resize',schedule); };
  }, [paused, reduce]);
  return <section id="experiencia" className="journey-section" aria-labelledby="journey-title">
    <div className="container journey-top reveal"><span className="eyebrow">UMA HISTÓRIA QUE ACOMPANHA CADA CONTATO</span><h2 id="journey-title">O ATENDIMENTO MUDA. <Gradient>A JORNADA CONTINUA.</Gradient></h2><p>Role a página para descobrir como conversas, automações e relacionamento fazem parte do mesmo fluxo.</p><div className="journey-scroll-cue"><span /> TRÊS CENAS · UMA OPERAÇÃO CONECTADA</div></div>
    <div className="container journey-grid">
      <div className="journey-beats" ref={beats}>
        {journey.map((item,i) => <article className={`journey-beat${i===sceneIndex?' active':''}`} key={item.emphasis} onClick={() => setSceneIndex(i)}><div className="journey-count">CENA 0{i+1} <span>/ 03</span></div><h3>{item.title} <em>{item.emphasis}</em></h3><p>{item.description}</p><span className="journey-category">{item.category}</span></article>)}
      </div>
      <div className="journey-visual" aria-label="Demonstração animada das etapas da plataforma">
        <div className="journey-glow" aria-hidden="true" />
        <div className="journey-viewer"><div className="journey-viewer-head"><span><i />RS CONNECT <b>/ VISÃO CONECTADA</b></span><span className="journey-viewer-count">0{sceneIndex+1} — 03</span></div>
          <div className={`journey-pane${sceneIndex===0?' active':''}`} aria-hidden={sceneIndex!==0}><div className="journey-chat-head"><Icon name="whatsapp"/><div><strong>Atendimento conectado</strong><small>WhatsApp · Exemplo ilustrativo</small></div><span>ONLINE</span></div><div className="journey-bubbles"><div className="journey-bubble from">Olá! Gostaria de conhecer os serviços.</div><div className="journey-bubble to">Olá! Vamos entender o que você precisa?</div><div className="journey-bubble from">Preciso de um atendimento.</div><div className="journey-typing" aria-hidden="true"><i/><i/><i/></div></div><div className="journey-footer-note"><span/> Conversa e histórico em um só lugar</div></div>
          <div className={`journey-pane${sceneIndex===1?' active':''}`} aria-hidden={sceneIndex!==1}><div className="journey-automation-title"><Icon name="robot"/><div><strong>Fluxo configurável</strong><small>Representação ilustrativa · não executa ações</small></div></div><div className="journey-automation-grid"><div className="automation-node"><Icon name="message"/><b>Mensagem</b><small>Recebida</small></div><span className="automation-link"/><div className="automation-node ai-node"><Icon name="robot"/><b>Assistente</b><small>Regra aplicada</small></div><span className="automation-link"/><div className="automation-node"><Icon name="users"/><b>Equipe</b><small>Supervisão</small></div></div><div className="journey-automation-info"><Icon name="shield"/><span><strong>Controle humano preservado</strong><small>O assistente respeita as políticas da empresa.</small></span></div></div>
          <div className={`journey-pane${sceneIndex===2?' active':''}`} aria-hidden={sceneIndex!==2}><div className="journey-crm-head"><Icon name="chart"/><div><strong>Pipeline comercial</strong><small>Visualização demonstrativa</small></div></div><div className="journey-crm-board">{[['Contato','Nova conversa','Atendimento iniciado'],['Qualificação','Interesse registrado','Próximo passo definido'],['Acompanhamento','Retorno previsto','Equipe informada']].map(([s,a,b])=><div className="journey-crm-col" key={s}><span>{s}</span><div className="journey-crm-ticket">{a}<small>{b}</small></div></div>)}</div><div className="journey-footer-note"><span/> Histórico, tarefas e agenda conectados</div></div>
          <div className="journey-stage-bar">{journey.map((s,i)=><span key={s.emphasis} className={i===sceneIndex?'active':''}/>)}</div>
        </div>
      </div>
    </div>
  </section>;
}

function Intro() {
  const highlights: { icon: IconName; title: string; description: string }[] = [
    {icon:'message',title:'Converse com contexto',description:'Atendimento centralizado e histórico disponível para quem continua a conversa.'},
    {icon:'robot',title:'Automatize com critério',description:'Regras configuráveis que apoiam a operação e preservam o controle humano.'},
    {icon:'chart',title:'Enxergue o próximo passo',description:'Contatos, tarefas, agenda e oportunidades reunidos para a equipe agir.'},
  ];
  return <section id="solucao" className="section intro-section"><div className="container intro-grid"><div className="section-heading reveal"><span className="eyebrow">O QUE MUDA COM A RS CONNECT</span><h2>MENOS RUÍDO. <Gradient>MAIS CONEXÃO.</Gradient></h2></div><div className="intro-text reveal"><p>Uma conversa não deveria se perder entre abas, anotações e tarefas esquecidas. A RS Connect conecta a jornada do cliente — do primeiro contato ao acompanhamento.</p><a href="#modulos" className="text-link">Explore os recursos <Icon name="arrow" /></a></div></div><div className="container highlight-grid">{highlights.map((item,i)=><article key={item.title} className="highlight-card reveal"><div className="h-icon"><Icon name={item.icon}/></div><h3>{item.title}</h3><p>{item.description}</p><span className="h-number">0{i+1} / 03</span></article>)}</div></section>;
}

function Modules() {
  return <section id="modulos" className="section modules-section"><div className="container"><div className="section-heading center reveal"><span className="eyebrow">UM ECOSSISTEMA, VÁRIAS POSSIBILIDADES</span><h2>SEIS FRENTES. <Gradient>UM SÓ FLUXO.</Gradient></h2><p>Os módulos trabalham juntos para transformar a maneira de atender, organizar e acompanhar.</p></div><div className="modules-grid">{modules.map((mod,i)=><article key={mod.title} className="module-card reveal"><span className="module-no">0{i+1}</span><div className="module-icon"><Icon name={mod.icon}/></div><h3>{mod.title}</h3><p>{mod.body}</p><span className="module-foot">{mod.foot}</span></article>)}</div></div></section>;
}

function Flow({ paused, reduce }: { paused: boolean; reduce: boolean }) {
  const [selected,setSelected] = useState(0);
  const [localPaused,setLocalPaused] = useState(false);
  const manual = useRef(0);
  useEffect(()=>{
    if (paused || reduce || localPaused) return;
    const id = window.setInterval(()=>{ if (!document.hidden && isVisible('#fluxo') && Date.now()>manual.current) setSelected(v=>(v+1)%flow.length); },4600);
    return ()=>window.clearInterval(id);
  },[paused,reduce,localPaused]);
  const change=(index:number)=>{manual.current=Date.now()+11500;setSelected(index);};
  const onKey=(e:KeyboardEvent<HTMLButtonElement>,i:number)=>{
    if (!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key)) return;
    e.preventDefault();
    const index=e.key==='Home'?0:e.key==='End'?flow.length-1:(i+(e.key==='ArrowRight'||e.key==='ArrowDown'?1:-1)+flow.length)%flow.length;
    change(index);document.getElementById(`flow-step-${index}`)?.focus();
  };
  return <section id="fluxo" className="section flow-section"><div className="container"><div className="section-heading reveal"><span className="eyebrow">DO PRIMEIRO OLÁ À PRÓXIMA AÇÃO</span><h2>A CONVERSA AVANÇA. <Gradient>O CONTEXTO FICA.</Gradient></h2><p>Um percurso visual interativo que demonstra como os recursos podem trabalhar juntos.</p></div><div className="flow-layout"><div className="flow-steps reveal" role="tablist" aria-label="Etapas do fluxo de atendimento">{flow.map((item,i)=><button className={`flow-step${i===selected?' active':''}`} key={item.short} id={`flow-step-${i}`} type="button" role="tab" aria-selected={selected===i} tabIndex={selected===i?0:-1} onClick={()=>change(i)} onKeyDown={(e:KeyboardEvent<HTMLButtonElement>)=>onKey(e,i)}><span className="step-n">0{i+1}</span><span><b>{item.short}</b><small>{item.description}</small></span></button>)}</div>
    <div className="flow-stage reveal" role="tabpanel" aria-live="polite"><div className="flow-stage-top"><span className="small-label">FLUXO EM MOVIMENTO</span><span className="live-dot">CENÁRIO ILUSTRATIVO</span>{!reduce&&<button type="button" className="flow-play-toggle" aria-pressed={localPaused} onClick={()=>setLocalPaused(p=>!p)}>{localPaused?'Reproduzir':'Pausar'} sequência <span aria-hidden="true">{localPaused?'▶':'Ⅱ'}</span></button>}</div><div className="flow-graphic"><div className="flow-orbit"/><div className="flow-center" key={selected}><Icon name={flow[selected].icon} /></div><div className="flow-small f-one"><Icon name="users" /></div><div className="flow-small f-two"><Icon name="robot" /></div><div className="flow-small f-three"><Icon name="calendar" /></div></div><h3 key={`h-${selected}`}>{flow[selected].heading}</h3><p key={`p-${selected}`}>{flow[selected].detail}</p><div className="flow-dots" aria-hidden="true">{flow.map((item,i)=><span key={item.short} className={selected===i?'on':''}/>)}</div></div></div></div></section>;
}

function CRM({ paused, reduce }: { paused: boolean; reduce: boolean }) {
  const [active,setActive]=useState(0);
  const columns = [
    {title:'Novos contatos',tone:'blue',tickets:[['Contato A','Primeiro atendimento'],['Contato B','Solicitou informações']]},
    {title:'Em análise',tone:'cyan',tickets:[['Oportunidade C','Em qualificação'],['Oportunidade D','Retorno programado']]},
    {title:'Proposta',tone:'purple',tickets:[['Oportunidade E','Em análise']]},
    {title:'Conclusão',tone:'green',tickets:[['Oportunidade F','Etapa concluída']]},
  ];
  useEffect(()=>{
    if(paused||reduce)return;
    const id=setInterval(()=>{if(!document.hidden&&isVisible('#crm'))setActive(i=>(i+1)%columns.length);},2600);
    return()=>clearInterval(id);
  },[paused,reduce,columns.length]);
  return <section id="crm" className="section crm-section"><div className="container crm-layout"><div className="crm-copy reveal"><span className="eyebrow">RELACIONAMENTO QUE GERA CONTINUIDADE</span><h2>DO CONTATO À <Gradient>OPORTUNIDADE.</Gradient></h2><p>Um CRM conectado ao atendimento ajuda a visualizar oportunidades, organizar tarefas e acompanhar as próximas ações de cada relacionamento.</p><div className="crm-points">{['Pipeline comercial','Histórico e contexto','Atividades e retornos','Visão por etapa'].map(text=><span key={text}><Icon name="check" /> {text}</span>)}</div><a href="#contato" className="btn btn-outline">Conhecer as possibilidades <Icon name="arrow" /></a></div>
    <div className="kanban-wrap reveal"><div className="kanban-head"><strong>RS CONNECT <span>/ Comercial</span></strong><span className="kanban-badge">VISUALIZAÇÃO ILUSTRATIVA</span></div><div className="kanban-cols">{columns.map((column,i)=><div className={`kanban-col${active===i&&!paused&&!reduce?' is-journey-active':''}`} key={column.title}><span className={`col-h ${column.tone}`}>{column.title}<b>{column.tickets.length}</b></span>{column.tickets.map(([name,detail],j)=><div className={`kanban-ticket${active===i&&j===0&&!paused&&!reduce?' is-journey-active':''}`} key={name}><span>{name}</span><small>{detail}</small><i className={`circle ${column.tone}`}/></div>)}</div>)}</div></div></div></section>;
}

function TrustAndFAQ(){
  const questions=[
    ['A RS Connect funciona com WhatsApp?','A plataforma tem recursos de conexão com WhatsApp e gestão das conversas. A ativação depende das configurações e da integração disponível.'],
    ['Posso personalizar o assistente de inteligência artificial?','Sim. Existem configurações para abordagem, informações coletadas, regras de agenda e encaminhamentos, conforme os recursos e permissões habilitados.'],
    ['A equipe pode assumir o atendimento?','O sistema prevê atribuições, transferências e intervenção humana, respeitando as regras e as permissões da empresa.'],
    ['Agenda e CRM trabalham juntos?','A RS Connect reúne clientes, agenda, atividades, oportunidades e histórico em uma experiência integrada. Automação e agendamento dependem das configurações.'],
  ];
  return <>
    <section className="section trust-section"><div className="container trust-layout reveal"><div className="trust-icon"><Icon name="shield"/></div><div><span className="eyebrow">TECNOLOGIA + SUPERVISÃO</span><h2>AUTOMAÇÃO COM <Gradient>CONTROLE HUMANO.</Gradient></h2><p>Os assistentes seguem as regras do negócio. O time participa das decisões e acompanha o atendimento de acordo com as permissões definidas.</p></div><a className="text-link" href="#duvidas">Tire suas dúvidas <Icon name="arrow"/></a></div></section>
    <section id="duvidas" className="section faq-section"><div className="container faq-layout"><div className="reveal"><span className="eyebrow">PERGUNTAS FREQUENTES</span><h2>O QUE VOCÊ <Gradient>PRECISA SABER.</Gradient></h2><p>As funcionalidades disponíveis variam conforme módulos, integrações e configurações da empresa.</p></div><div className="faq-list reveal">{questions.map(([question,answer])=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
  </>;
}

function Footer() {return <>
  <section id="contato" className="final-section"><div className="container final-card reveal"><div className="final-glow" /><span className="eyebrow">PRONTO PARA CONECTAR SUA OPERAÇÃO?</span><h2>MENOS SISTEMAS SOLTOS. <Gradient>MAIS POSSIBILIDADES.</Gradient></h2><p>Conheça a RS Connect e descubra como organizar atendimento, relacionamento e operação em uma experiência conectada.</p><div className="final-actions"><a href={CONTACT_URL} className="btn btn-primary" target="_blank" rel="noreferrer">Conhecer a RS Automação Digital <Icon name="arrow" /></a><a href={LOGIN_URL} className="btn btn-outline" target="_blank" rel="noreferrer">Acessar a plataforma <Icon name="arrow" /></a></div><p className="contact-note">Para solicitar uma apresentação comercial, utilize os canais oficiais do site da RS Automação Digital.</p></div></section>
  <footer className="footer"><div className="container footer-grid"><a href="#inicio" aria-label="Voltar ao topo"><img src={`${ASSET}img/rs-connect-logo-clara.png`} alt="RS Connect" width="195" height="60" /></a><p>Atendimento inteligente. Conversas que geram resultados.</p><div className="footer-links"><a href="#modulos">Módulos</a><a href="#duvidas">Dúvidas</a><a href={LOGIN_URL} target="_blank" rel="noreferrer">Login</a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} RS Connect. Todos os direitos reservados.</span><span>Uma solução RS Automação Digital</span></div></footer>
</>}

export default function App() {
  const reduce = useReducedMotion();
  const [paused,setPaused]=useState(false);
  usePageEffects();
  useEffect(()=>{ document.documentElement.classList.toggle('motion-paused', paused || reduce); return()=>document.documentElement.classList.remove('motion-paused'); },[paused,reduce]);
  const activePause = paused || reduce;
  return <>
    <a href="#inicio" className="skip-link">Pular para o conteúdo</a>
    <Header paused={activePause} reduce={reduce} onToggle={()=>setPaused(p=>!p)} />
    <main id="inicio">
      <Hero paused={activePause} reduce={reduce}/>
      <div className="marquee" aria-label="Recursos integrados"><div className="marquee-track">{[0,1].map(n=><span className="marquee-group" key={n}>{['ATENDIMENTO INTELIGENTE','IA CONFIGURÁVEL','CRM COMPLETO','AGENDA INTEGRADA','AUTOMAÇÕES','CONTROLE HUMANO'].map(text=><span key={text}><b>✦</b>{text}</span>)}</span>)}</div></div>
      <Journey paused={activePause} reduce={reduce}/>
      <Intro/><Modules/><Flow paused={activePause} reduce={reduce}/><CRM paused={activePause} reduce={reduce}/><TrustAndFAQ/><Footer/>
    </main>
    <button type="button" className="back-to-top" onClick={()=>window.scrollTo({top:0,behavior:reduce?'instant':'smooth'})} aria-label="Voltar ao início"><Icon name="arrow"/></button>
    <div className="cinematic-cursor-glow" aria-hidden="true" style={{'--cursor-alpha': activePause ? '0' : '.12'} as CSSProperties} />
  </>;
}
