// Dados dos projetos. Renderizados por modules/render.js (sem HTML cru).
// Cada projeto: id, título, descrição {pt,en}, stack[], imagem webp e links.
export const projects = [
  {
    id: "sistema-chamados",
    title: "Sistema de Chamados",
    description: {
      pt: "Aplicativo de gerenciamento de chamados de suporte: usuários criam chamados, acompanham o status e recebem atendimento personalizado.",
      en: "Support ticket management app: users open tickets, track their status and get personalized assistance.",
    },
    stack: ["ReactJS", "Firebase", "Vercel"],
    image: "assets/images/projects/sistema-chamados.webp",
    links: {
      repo: "https://github.com/mauricioc08/sistema-de-chamados-reactjs",
      live: "https://sistema-de-chamados-reactjs.vercel.app/",
    },
  },
  {
    id: "tarefas",
    title: "Lista de Tarefas",
    description: {
      pt: "Sistema web para cadastro e gerenciamento de tarefas: adicionar, editar, excluir e reordenar, com persistência em tempo real.",
      en: "Web app to create and manage tasks: add, edit, delete and reorder, with real-time persistence.",
    },
    stack: ["NextJS", "Firebase", "Vercel"],
    image: "assets/images/projects/tarefas.webp",
    links: {
      repo: "https://github.com/mauricioc08/sistema_tarefas",
      live: "https://sistema-tarefas.vercel.app/",
    },
  },
  {
    id: "buscador-cep",
    title: "Buscador de CEP",
    description: {
      pt: "Pesquise qualquer endereço a partir do CEP. Integração com a API ViaCEP e estados de carregamento e erro tratados.",
      en: "Look up any address from a Brazilian postal code (CEP). Integrated with the ViaCEP API, with loading and error states.",
    },
    stack: ["ReactJS", "API ViaCEP", "Vercel"],
    image: "assets/images/projects/buscadorCep.webp",
    links: {
      repo: "https://github.com/mauricioc08/cepSearch_react",
      live: "https://cep-search-react.vercel.app/",
    },
  },
  {
    id: "sirrus",
    title: "Sirrus — Sistemas Empresariais",
    description: {
      pt: "Site institucional da Sirrus, fornecedora de sistemas empresariais (mobile, desktop e online), com CMS para gestão de conteúdo.",
      en: "Corporate website for Sirrus, a business-software vendor (mobile, desktop and online), with a CMS for content management.",
    },
    stack: ["NodeJS", "MongoDB", "NextJS", "CMS"],
    image: "assets/images/projects/sirrus.webp",
    links: {
      live: "https://sirrus.com.br/",
    },
  },
  {
    id: "aprovei",
    title: "Aprovei Concursos",
    description: {
      pt: "Plataforma de assinatura de cursos com simulados e questões para concursos públicos. Pagamentos integrados via Pagar.me.",
      en: "Subscription platform for exam-prep courses with mock tests and question banks. Payments integrated via Pagar.me.",
    },
    stack: ["PHP", "MySQL", "API", "AWS"],
    image: "assets/images/projects/aprovei.webp",
    links: {
      live: "https://csp.aprovei.com.br/",
    },
  },
  {
    id: "gasolina-etanol",
    title: "Gasolina vs Etanol",
    description: {
      pt: "Calculadora que indica o combustível mais vantajoso conforme os preços do dia, usando a regra dos 70%.",
      en: "Calculator that tells which fuel is cheaper based on the day's prices, using the 70% rule.",
    },
    stack: ["HTML", "CSS", "JavaScript", "jQuery"],
    image: "assets/images/projects/gasVsEtan.webp",
    links: {
      repo: "https://github.com/mauricioc08/gasolineVsEtanol",
      live: "https://mauricioc08.github.io/gasolineVsEtanol/",
    },
  },
];
