type ProjectScreenshot = {
  label: string;
  src?: string;
};

type Project = {
  slug: string;
  img: string;
  cat: string;
  type: string;
  title: string;
  text: string;
  idea: string;
  tags: readonly string[];
  demo?: string;
  screenshots: readonly ProjectScreenshot[];
};

export const projects: readonly Project[] = [
  {
    slug: "contabilidade-tributaria",
    img: "contabilidade",
    cat: "Contabilidade",
    type: "Página de divulgação",
    title: "Contabilidade Tributária",
    text: "Uma página clara e profissional, feita para transmitir confiança e facilitar o contato de novos clientes.",
    idea:
      "Apresentar os serviços contábeis de forma simples e confiável, ajudando cada visitante a entender como o negócio pode apoiá-lo e a encontrar rapidamente um canal de contato.",
    tags: ["Mais contatos", "WhatsApp", "Celular"],
    demo: "/demos/contabilidade/",
    screenshots: [
      { label: "Apresentação", src: "/thumbs/contabilidade-apresentacao.png" },
      { label: "Serviços contábeis", src: "/thumbs/contabilidade-servicos.png" },
      { label: "Contato", src: "/thumbs/contabilidade-contato.png" },
    ],
  },
  {
    slug: "pericia-judicial",
    img: "pericia-judicial",
    cat: "Perícia Judicial",
    type: "Site profissional",
    title: "Vanusa Alves — Perícia Judicial",
    text: "Um site elegante e sério para explicar os serviços, a forma de trabalho e transmitir confiança.",
    idea:
      "Construir uma presença profissional que explique a atuação em perícia judicial e torne mais fácil compreender os serviços e a forma de trabalho.",
    tags: ["Confiança", "Serviços", "Google"],
    demo: "/demos/pericia/",
    screenshots: [
      { label: "Apresentação profissional", src: "/thumbs/pericia-apresentacao.png" },
      { label: "Áreas de atuação", src: "/thumbs/pericia-areas-de-atuacao.png" },
      { label: "Informações de contato", src: "/thumbs/pericia-contato.png" },
    ],
  },
  {
    slug: "nanook-fitness",
    img: "nanook-fitness",
    cat: "Fitness",
    type: "Sistema + página",
    title: "Nanook Fitness App",
    text: "Uma página para apresentar um sistema completo que ajuda academias a organizar alunos e pagamentos.",
    idea:
      "Apresentar a proposta do Nanook Fitness App e mostrar como um sistema pode apoiar a organização de alunos e pagamentos em academias.",
    tags: ["Sistema online", "Painel de controle", "Apresentação"],
    demo: "/demos/nanook/",
    screenshots: [
      { label: "Apresentação do sistema", src: "/thumbs/nanook-apresentacao.png" },
      { label: "Gestão de alunos", src: "/thumbs/nanook-gestao-de-alunos.png" },
      { label: "Pagamentos", src: "/thumbs/nanook-pagamentos.png" },
    ],
  },
  {
    slug: "atendimento-automatico",
    img: "atendimento-automatico",
    cat: "Automação",
    type: "Site + tarefas automáticas",
    title: "Atendimento Organizado e Automático",
    text: "Uma página que apresenta como o WhatsApp, o atendimento automático e a organização de pessoas interessadas podem trabalhar juntos.",
    idea:
      "Explicar de forma visual como WhatsApp, respostas automáticas e organização dos contatos podem fazer parte de um fluxo de atendimento mais claro.",
    tags: ["Tarefas automáticas", "Atendimento organizado", "WhatsApp"],
    demo: "/demos/rs-automacao/",
    screenshots: [
      { label: "Visão geral da solução", src: "/thumbs/rs-connect-apresentacao.png" },
      { label: "Fluxo de atendimento", src: "/thumbs/rs-connect-fluxo-atendimento.png" },
      { label: "Organização dos contatos", src: "/thumbs/rs-connect-organizacao-contatos.png" },
    ],
  },
  {
    slug: "cuidar-no-lar",
    img: "cuidar-no-lar",
    cat: "Cuidado no lar",
    type: "Site de serviço",
    title: "Cuidar no Lar",
    text: "Linguagem humana, visual acolhedor e apresentação simples para famílias que precisam de apoio.",
    idea:
      "Apresentar os serviços de cuidado no lar com acolhimento e clareza, ajudando famílias a entender as opções de apoio e dar o primeiro passo para conversar.",
    tags: ["Acolhimento", "Serviços", "Contato"],
    demo: "/demos/cuidar-no-lar-humanizada/",
    screenshots: [
      { label: "Apresentação do serviço", src: "/thumbs/cuidar-no-lar-apresentacao.png" },
      { label: "Cuidados oferecidos", src: "/thumbs/cuidar-no-lar-cuidados.png" },
      { label: "Contato para famílias", src: "/thumbs/cuidar-no-lar-contato.png" },
    ],
  },
  {
    slug: "psicologia-online",
    img: "mary-hellen-psicologia",
    cat: "Psicologia",
    type: "Página de divulgação",
    title: "Psicologia Online",
    text: "Textos acolhedores, informações claras e um caminho simples até o primeiro contato.",
    idea:
      "Criar uma apresentação acolhedora da psicologia online, com informações claras sobre o atendimento e um caminho acessível para iniciar o contato.",
    tags: ["Acolhimento", "Agenda", "Celular"],
    demo: "/demos/landing-mary-hellen/",
    screenshots: [
      { label: "Apresentação", src: "/thumbs/psicologia-apresentacao.png" },
      { label: "Atendimentos", src: "/thumbs/psicologia-atendimentos.png" },
      { label: "Agendamento e contato", src: "/thumbs/psicologia-contato.png" },
    ],
  },
] as const;

export function imgSrc(img: Project["img"]) {
  return img === "atendimento-automatico"
    ? "/thumbs/rs-connect-apresentacao.png"
    : `/thumbs/${img}.webp`;
}
