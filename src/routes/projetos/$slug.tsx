import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Image as ImageIcon } from "lucide-react";
import { projects, imgSrc } from "@/lib/projects";

const WHATS = "https://wa.me/5532987073537";

export const Route = createFileRoute("/projetos/$slug")({
  loader: ({ params }) => {
    const project = projects.find((item) => item.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ params }) => {
    const project = projects.find((item) => item.slug === params.slug);
    return {
      meta: [
        { title: `${project?.title ?? "Projeto"} | RS Digital Lab` },
        ...(project ? [{ name: "description", content: project.idea }] : []),
      ],
    };
  },
  component: ProjectPage,
});

function ProjectPage() {
  const { project } = Route.useLoaderData();
  const hasAllScreenshots = project.screenshots.every((screenshot) => Boolean(screenshot.src));

  return (
    <main className="grain min-h-screen bg-background font-sans text-foreground">
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Link to="/" aria-label="Voltar para a página inicial">
          <img src="/logo.png" alt="RS Digital Lab" className="h-8 w-auto md:h-10" />
        </Link>
        <Link
          to="/"
          hash="cenas"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-gold"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          <span>Todos os projetos</span>
        </Link>
      </header>

      <section className="relative flex min-h-[70vh] items-end overflow-hidden px-6 pb-16 pt-24 md:items-center md:py-24">
        <img
          src={imgSrc(project.img)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        <div className="relative mx-auto w-full max-w-6xl">
          <p className="text-xs uppercase tracking-[0.5em] text-gold">
            Projeto — {project.cat}
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[0.9] tracking-wide md:text-8xl">
            {project.title}
          </h1>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {project.type}
          </p>
          <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-foreground/80">
            {project.text}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1fr_1.2fr] md:gap-20 md:py-28">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-gold">Ideia central</p>
          <h2 className="mt-5 font-display text-5xl leading-none md:text-6xl">
            Uma presença digital com intenção.
          </h2>
        </div>
        <div>
          <p className="text-lg font-light leading-relaxed text-foreground/80">
            {project.idea}
          </p>
          <p className="mt-8 text-xs uppercase leading-loose tracking-[0.2em] text-muted-foreground">
            {project.tags.join("  ·  ")}
          </p>
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 border-b border-gold pb-2 text-xs uppercase tracking-[0.25em] text-gold transition hover:tracking-[0.35em]"
            >
              Abrir demonstração ao vivo
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          ) : null}
          <a
            href={WHATS}
            target="_blank"
            rel="noreferrer"
            className="mt-8 ml-6 inline-block border-b border-gold pb-2 text-xs uppercase tracking-[0.25em] text-gold transition hover:tracking-[0.35em]"
          >
            Conversar sobre um projeto parecido →
          </a>
        </div>
      </section>

      <section id="telas" className="border-y border-foreground/10 bg-foreground/[0.02] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.5em] text-gold">Galeria do projeto</p>
          <h2 className="mt-5 font-display text-5xl leading-none md:text-7xl">
            Telas do projeto.
          </h2>
          <p className="mt-5 max-w-2xl font-light leading-relaxed text-muted-foreground">
            {hasAllScreenshots
              ? `Capturas da landing page: ${project.screenshots.map((screenshot) => screenshot.label.toLowerCase()).join(", ")}.`
              : "Áreas reservadas para adicionar as capturas reais da página e das telas deste projeto."}
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {project.screenshots.map((screenshot) => (
              <figure key={screenshot.label}>
                {screenshot.src ? (
                  <img
                    src={screenshot.src}
                    alt={`${project.title} — ${screenshot.label}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full border border-foreground/10 object-cover"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={`Espaço reservado para captura: ${screenshot.label}`}
                    className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden border border-dashed border-foreground/20 bg-background/70 p-6 text-center"
                  >
                    <div className="absolute inset-3 border border-foreground/5" />
                    <ImageIcon aria-hidden="true" className="relative h-8 w-8 text-gold/70" />
                    <span className="relative mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Captura de tela em breve
                    </span>
                  </div>
                )}
                <figcaption className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {screenshot.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" hash="cenas" className="transition hover:text-gold">
          ← Voltar para todos os projetos
        </Link>
        <span>© 2026 RS Digital Lab</span>
      </footer>
    </main>
  );
}
