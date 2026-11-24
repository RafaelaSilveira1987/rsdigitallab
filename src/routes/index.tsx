import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUp, ArrowUpRight, Instagram, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { imgSrc, projects } from "@/lib/projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RS Digital Lab | Sites e sistemas com visual cinematográfico" },
      { name: "description", content: "Criamos sites e sistemas que ajudam sua empresa a ser entendida e lembrada." },
      { property: "og:title", content: "RS Digital Lab" },
      { property: "og:description", content: "Criamos sites e sistemas que ajudam sua empresa a ser entendida e lembrada." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WHATS = "https://wa.me/5532987073537";

const audiences = ["Profissionais de saúde", "Prestadores de serviço", "Consultorias", "Academias", "Negócios locais", "Negócios que atendem online"];

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setIn(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, inView } = useReveal<HTMLSpanElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let f = 0;
    const id = setInterval(() => { f++; setN(Math.round((to * f) / 40)); if (f >= 40) clearInterval(id); }, 40);
    return () => clearInterval(id);
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Scene({ p, i }: { p: (typeof projects)[number]; i: number }) {
  const { ref, inView } = useReveal<HTMLElement>();
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current, img = imgRef.current;
      if (!el || !img) return;
      const r = el.getBoundingClientRect();
      const prog = 1 - (r.top + r.height) / (window.innerHeight + r.height);
      img.style.transform = `scale(${1.2 - prog * 0.15}) translateY(${(prog - 0.5) * -40}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
  const flip = i % 2 === 1;
  return (
    <section ref={ref} className="group relative flex min-h-screen items-end overflow-hidden md:items-center">
      <div className="absolute inset-0 overflow-hidden">
        <img ref={imgRef} src={imgSrc(p.img)} alt={p.title} loading="lazy"
          className="h-full w-full object-cover object-top opacity-60 grayscale transition-[filter,opacity] duration-1000 group-hover:opacity-80 group-hover:grayscale-0" />
        <div className={`absolute inset-0 ${flip ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-background via-background/70 to-transparent`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </div>
      <div className={`reveal ${inView ? "in" : ""} relative mx-auto w-full max-w-6xl px-6 pb-20 md:pb-0 ${flip ? "md:text-right" : ""}`}>
        <div className={`max-w-xl ${flip ? "md:ml-auto" : ""}`}>
          <p className="text-xs uppercase tracking-[0.5em] text-gold">Cena {String(i + 1).padStart(2, "0")} — {p.cat}</p>
          <h3 className="mt-4 font-display text-6xl leading-[0.9] tracking-wide md:text-8xl">{p.title}</h3>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">{p.type}</p>
          <p className="mt-6 text-lg font-light leading-relaxed text-foreground/80">{p.text}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">{p.tags.join("  ·  ")}</p>
          <Link
            to="/projetos/$slug"
            params={{ slug: p.slug }}
            className="mt-8 inline-block border-b border-gold pb-1 text-sm uppercase tracking-[0.3em] text-gold transition-all hover:tracking-[0.45em]"
          >
            Ver projeto →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Index() {
  const stats = [
    { n: 6, s: "", l: "projetos em destaque" },
    { n: 5, s: "+", l: "tipos de negócio atendidos" },
    { n: 100, s: "%", l: "pensado para celular" },
    { n: 1, s: "", l: "caminho claro para contato" },
  ];
  return (
    <main id="topo" className="grain relative bg-background font-sans text-foreground">
      <header className="fadein absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 md:px-12" style={{ animationDelay: "2.4s" }}>
        <img src="/logo.png" alt="RS Digital Lab" className="h-8 w-auto md:h-10" />
        <a href={WHATS} className="border border-gold/60 px-5 py-2 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-foreground">Solicitar orçamento</a>
      </header>

      {/* Abertura */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-25" style={{ animation: "kenburns 12s ease-out forwards" }}>
          {projects.map((p) => <img key={p.img} src={imgSrc(p.img)} alt="" className="h-full w-full object-cover object-top grayscale" />)}
        </div>
        <div className="vignette absolute inset-0" />
        <div className="absolute inset-0 bg-background/50" />
        <div className="absolute inset-x-0 top-0 h-[8vh] bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-[8vh] bg-background" />
        <div className="relative px-6 text-center">
          <p className="rise text-xs uppercase tracking-[0.6em] text-gold" style={{ animationDelay: ".3s" }}>RS Digital Lab apresenta</p>
          <h1 className="mt-8 font-display text-[16vw] leading-[0.85] tracking-wide md:text-[9vw]">
            <span className="rise block" style={{ animationDelay: ".9s" }}>Seu negócio</span>
            <span className="rise block text-brand-gradient" style={{ animationDelay: "1.5s" }}>merece ser lembrado.</span>
          </h1>
          <p className="rise mx-auto mt-8 max-w-xl text-base font-light text-muted-foreground md:text-lg" style={{ animationDelay: "2.1s" }}>
            Sites, páginas de divulgação e sistemas com visual profissional — e um caminho claro para o cliente falar com você.
          </p>
          <div className="rise mt-10 flex flex-wrap justify-center gap-4" style={{ animationDelay: "2.6s" }}>
            <a href="#cenas" className="bg-brand-gradient px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-foreground transition hover:opacity-90">Ver projetos reais</a>
            <a href={WHATS} className="border border-foreground/30 px-8 py-4 text-xs uppercase tracking-[0.3em] transition hover:border-gold hover:text-gold">Falar sobre meu projeto</a>
          </div>
        </div>
        <div className="fadein absolute bottom-[10vh] left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em] text-muted-foreground" style={{ animationDelay: "3.2s" }}>Role ↓</div>
      </section>

      {/* Números */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-y-12 px-6 py-24 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-display text-7xl text-gold md:text-8xl"><Counter to={s.n} suffix={s.s} /></div>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </section>

      {/* Letreiro */}
      <div className="overflow-hidden border-y border-foreground/10 py-6">
        <div className="marquee flex w-max gap-12 whitespace-nowrap font-display text-3xl tracking-[0.2em] text-foreground/40">
          {[...audiences, ...audiences].map((a, i) => <span key={i}>{a} <span className="text-gold">✦</span></span>)}
        </div>
      </div>

      {/* Projetos */}
      <section id="cenas" className="px-6 pb-12 pt-32 text-center">
        <p className="text-xs uppercase tracking-[0.6em] text-gold">Projetos realizados</p>
        <h2 className="mx-auto mt-6 max-w-4xl font-display text-5xl leading-none tracking-wide md:text-7xl">Cada negócio pede uma linguagem própria.</h2>
        <p className="mx-auto mt-6 max-w-xl font-light text-muted-foreground">Não trocamos apenas a foto de um modelo pronto. Organizamos textos, cores e botões de contato para cada negócio.</p>
      </section>
      {projects.map((p, i) => <Scene key={p.img} p={p} i={i} />)}

      {/* Final */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="vignette absolute inset-0" />
        <p className="relative text-xs uppercase tracking-[0.6em] text-gold">Próxima cena</p>
        <h2 className="relative mt-6 font-display text-[14vw] leading-[0.85] md:text-[8vw]">O próximo projeto<br /><span className="text-brand-gradient">pode ser o seu.</span></h2>
        <a href={WHATS} className="relative mt-12 bg-brand-gradient px-10 py-5 text-xs font-semibold uppercase tracking-[0.3em] text-foreground transition hover:opacity-90">Quero tirar minha ideia do papel</a>
      </section>

      <footer className="relative overflow-hidden border-t border-foreground/10 px-6 pb-8 pt-16 md:px-12 md:pt-20">
        <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-12 border-b border-foreground/10 pb-12 md:grid-cols-[1.4fr_0.8fr_1fr] md:gap-16 md:pb-16">
            <div>
              <a
                href="#topo"
                aria-label="RS Digital Lab — voltar ao início"
                className="inline-flex"
              >
                <img src="/logo.png" alt="RS Digital Lab" className="h-10 w-auto md:h-12" />
              </a>
              <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-muted-foreground">
                Sites e sistemas feitos para apresentar o seu negócio com clareza e transformar
                visitas em conversas.
              </p>
              <a
                href={WHATS}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 border border-gold/40 px-4 py-3 text-xs uppercase tracking-[0.18em] text-gold transition hover:border-gold hover:bg-gold/10"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Vamos conversar
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            </div>

            <nav aria-label="Navegação do rodapé">
              <h2 className="text-xs uppercase tracking-[0.35em] text-gold">Explore</h2>
              <ul className="mt-5 space-y-3 text-sm font-light text-muted-foreground">
                <li>
                  <a href="#cenas" className="transition hover:text-foreground">
                    Projetos
                  </a>
                </li>
                <li>
                  <a href="#topo" className="transition hover:text-foreground">
                    Início
                  </a>
                </li>
              </ul>
            </nav>

            <div>
              <h2 className="text-xs uppercase tracking-[0.35em] text-gold">Conecte-se</h2>
              <ul className="mt-5 space-y-4 text-sm font-light text-muted-foreground">
                <li>
                  <a
                    href={WHATS}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 transition hover:text-foreground"
                  >
                    <MessageCircle aria-hidden="true" className="h-4 w-4 text-gold" />
                    <span>(32) 98707-3537</span>
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/rs_digitallab"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 transition hover:text-foreground"
                  >
                    <Instagram aria-hidden="true" className="h-4 w-4 text-gold" />
                    <span>@rs_digitallab</span>
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-7 text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} RS Digital Lab · Todos os direitos reservados</p>
            <a href="#topo" className="inline-flex items-center gap-2 transition hover:text-gold">
              Voltar ao topo
              <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
