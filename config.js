/**
 * R5WF · Configuração global do site
 * Ajuste telefone/mensagem do WhatsApp e cole o embed Visionmetrics quando disponível.
 */
window.R5WF_CONFIG = {
  whatsapp: {
    /** Número principal (Lojas Oficiais · Florianópolis) */
    phone: "5548984237072",
    defaultMessage: "Olá! Vim pelo site R5WF e gostaria de saber mais sobre películas.",
    /** Cole aqui a URL do script Visionmetrics quando receber do fornecedor */
    visionmetricsScriptUrl: "",
    label: "Fale conosco no WhatsApp",
  },
  contact: {
    phone0800: "0800 006 3330",
    phone0800Href: "tel:08000063330",
  },
  images: {
    logo: "Imagens/Logo R5WF.png",
    automotivaHero: "https://r5wf.com.br/wp-content/uploads/2024/12/automotivo.jpg",
    arquiteturaHero: "https://r5wf.com.br/wp-content/uploads/2024/12/arquitetura.jpg",
    visibilidade: "https://r5wf.com.br/wp-content/uploads/2023/06/site-r5.png",
  },
};


/** Produtos automotivos · textos e boletins do site oficial */
window.R5WF_PRODUTOS_AUTO = [
  {
    name: "SELECT",
    tier: "flagship",
    badges: ["UV + IR", "Garantia Permanente", "Tecnologia Coreana"],
    image: "https://r5wf.com.br/wp-content/uploads/2024/07/1.png",
    features: [
      { title: "Proteção UV e IR", text: "Proteção dos raios UV e Infravermelhos de verdade, promovendo altíssimo conforto térmico." },
      { title: "Tonalidade Exclusiva", text: "A melhor proteção e a mais única tonalidade do mercado." },
      { title: "Garantia de Fábrica", text: "Tudo isso com a melhor cobertura possível de garantia, que é permanente!" },
    ],
    boletim: "https://drive.google.com/file/d/1C8LWHb4hWJZMyh8qaAzcm1WGfSc506rx/view?usp=sharing",
  },
  {
    name: "DIAMOND HD PLUS",
    tier: "premium",
    badges: ["Nanocerâmica", "UV + IR", "Garantia Permanente"],
    image: "https://r5wf.com.br/wp-content/uploads/2024/07/3.png",
    features: [
      { title: "Proteção UV e IR", text: "Proteção dos raios UV e Infravermelhos de verdade, promovendo altíssimo conforto térmico." },
      { title: "Visibilidade Perfeita", text: "Alta visão sem ofuscamento com a privacidade que você precisa!" },
      { title: "Garantia de Fábrica", text: "Tudo isso com a melhor cobertura possível de garantia, que é permanente!" },
    ],
    boletim: "https://drive.google.com/file/d/1nG-SvkuCGcx04UykIbFH3fsQENv-gRMu/view?usp=sharing",
  },
  {
    name: "DIAMOND HD",
    tier: "premium",
    badges: ["Alta Visibilidade", "UV + IR", "Garantia Permanente"],
    image: "https://r5wf.com.br/wp-content/uploads/2024/07/4.png",
    features: [
      { title: "Proteção UV e IR", text: "Proteção dos raios UV e Infravermelhos de verdade, promovendo altíssimo conforto térmico." },
      { title: "Visibilidade Perfeita", text: "Alta visão sem ofuscamento e sem alterar o visual do seu carro!" },
      { title: "Garantia de Fábrica", text: "Tudo isso com a melhor cobertura possível de garantia, que é permanente!" },
    ],
    boletim: "https://drive.google.com/file/d/1WK0YevfU3usGoceecgb9eKIY7DxCDdu4/view?usp=sharing",
  },
  {
    name: "VISION BLACK / CLEAR",
    tier: "performance",
    badges: ["Nanocerâmica", "UV + IR", "Garantia Permanente"],
    image: "https://r5wf.com.br/wp-content/uploads/2024/07/5.png",
    features: [
      { title: "Proteção UV e IR", text: "Proteção dos raios UV e Infravermelhos de verdade, promovendo altíssimo conforto térmico." },
      { title: "Visibilidade Perfeita", text: "Alta visão sem ofuscamento e sem alterar o visual do seu carro!" },
      { title: "Garantia de Fábrica", text: "Tudo isso com a melhor cobertura possível de garantia, que é permanente!" },
    ],
    boletim: "https://drive.google.com/file/d/14zz1PwNpUaPpEKLH9I9zrKSrpMPTQhOd/view?usp=sharing",
  },
  {
    name: "NRI",
    tier: "performance",
    badges: ["Nanocarbono", "Privacidade", "Garantia Permanente"],
    image: "https://r5wf.com.br/wp-content/uploads/2024/07/2.png",
    features: [
      { title: "Nanocarbono", text: "Tecnologia de nanocarbono, que escurece os vidros de maneira elegante promovendo privacidade e proteção." },
      { title: "Privacidade e Conforto", text: "O conforto térmico com o escurecimento dos vidros garante privacidade e sensação agradável dentro do veículo." },
      { title: "Garantia de Fábrica", text: "Tudo isso com a melhor cobertura possível de garantia, que é permanente!" },
    ],
    boletim: "https://drive.google.com/file/d/1RCHqHnBNKRo798R30aO-LHEssUCPIDgQ/view?usp=sharing",
  },
  {
    name: "NR",
    tier: "entry",
    badges: ["Privacidade", "Custo-benefício", "1 ano de garantia"],
    image: "https://r5wf.com.br/wp-content/uploads/2024/07/6.png",
    features: [
      { title: "Privacidade", text: "Escurecimento dos vidros para sua privacidade!" },
      { title: "Para todos os Bolsos", text: "Acessível mas sem perder o charme, a linha NR garante proteção e um baixo custo!" },
      { title: "Garantia de Fábrica", text: "Tudo isso com 01 ano de garantia direto com a fabricante." },
    ],
    boletim: "https://drive.google.com/file/d/11L7Ap2hmVPolVsaHbsqG-UEcowNAYKib/view?usp=sharing",
  },
];

window.R5WF_PRODUTOS_ARQ = [
  { name: "Película Transparente Premium", line: "Diamond HD Plus", text: "Linha de películas com tecnologia de nanocerâmica premium em sua composição.", garantia: "10 anos vertical · 07 anos horizontal", boletim: "https://drive.google.com/file/d/1msHKaSkeirJKxIyHBcn-JKC9V_lLk8S0/view?usp=drive_link" },
  { name: "Película Prata com Fumê Premium", line: "DR Plus", text: "Película premium dual refletiva, espelhada para fora e fumê para dentro, com privacidade e requinte.", garantia: "10 anos vertical · 07 anos horizontal", boletim: "https://drive.google.com/file/d/1rW8JF8rAj3szZrLOo7ZDcAqGICGFrP92/view?usp=drive_link" },
  { name: "Película Espelhada Premium", line: "Silver Plus", text: "Brilho intenso e efeito espelhado exuberante. Rebate o calor do sol com privacidade e modernidade.", garantia: "10 anos vertical · 07 anos horizontal", boletim: "https://drive.google.com/file/d/1UWGmRkj9gOCDNZcZl0Hy6DfeINfT7Bb5/view?usp=drive_link" },
  { name: "Película Cobre Clara", line: "Rose Gold", text: "Solução estética e funcional que embeleza, protege contra raios UV e reduz o calor.", garantia: "10 anos vertical · 05 anos horizontal", boletim: "https://drive.google.com/file/d/1amvvIyDgQosMONJKgsWVxgbnjeoIziYo/view?usp=drive_link" },
  { name: "Película Prata com Fumê", line: "DR", text: "Dual refletiva, espelhada para fora e fumê para dentro. Privacidade e requinte aos vidros.", garantia: "05 anos vertical · 03 anos horizontal", boletim: "https://drive.google.com/file/d/1SoFnsdcOF5z13WUHZbntMwk5AsLTUW6p/view?usp=drive_link" },
  { name: "Película Espelho", line: "Silver", text: "Brilho intenso e efeito espelhado. Rebate o calor do sol com privacidade e modernidade.", garantia: "05 anos vertical · 03 anos horizontal", boletim: "https://drive.google.com/file/d/1-5Xezb080qbWe4HMPpGmzd7GJ2p-yzzx/view?usp=drive_link" },
  { name: "Película Fumê ou Transparente", line: "Diamond HD", text: "Tecnologia híbrida de nanocarbono e nanocerâmica. Conforto térmico e alta visibilidade em HD.", garantia: "10 anos vertical · 07 anos horizontal", boletim: "https://drive.google.com/file/d/10CK7y4RnlapSRoqKuhL5jIzq0O9A7DP1/view?usp=drive_link" },
  { name: "Película Transparente", line: "Vision", text: "Verdadeira tecnologia de nanocerâmica. Proteção UV e redução da energia solar em um só produto.", garantia: "05 anos vertical · 03 anos horizontal", boletim: "https://drive.google.com/file/d/1XThGPHOdE-xGoTc36PCrwKo2NXcqJVBX/view?usp=sharing" },
  { name: "Película Dourada", line: "Silver Gold", text: "Combina o melhor do dourado enquanto embeleza e protege contra os raios nocivos do sol.", garantia: "05 anos vertical · 03 anos horizontal", boletim: "https://drive.google.com/file/d/1wxDKa57DpVsRDRoOggIi7zrtUSkgRpXZ/view?usp=drive_link" },
  { name: "Película Bronze", line: "Silver Bronze", text: "Combina o melhor do bronze enquanto embeleza e protege contra os raios nocivos do sol.", garantia: "05 anos vertical · 03 anos horizontal", boletim: "https://drive.google.com/file/d/1PKRCYw0Bdo3qAbpugFt0_jO1fHLyN46d/view?usp=drive_link" },
  { name: "Azul Espelhada", line: "Silver Blue", text: "Efeito espelhado com azul. Ideal para decoração, privacidade e modernidade.", garantia: "05 anos vertical · 03 anos horizontal", boletim: "https://drive.google.com/file/d/1oStu3V8twppnhq6KlgH8cBp8CF_dzxft/view?usp=drive_link" },
  { name: "Verde Espelhada", line: "Silver Green", text: "Efeito espelhado com verde. Ideal para decoração, privacidade e modernidade.", garantia: "05 anos vertical · 03 anos horizontal", boletim: "https://drive.google.com/file/d/1U5N0UE546fnohPetHFyspLE5XD1Yqz-x/view?usp=drive_link" },
  { name: "Película de Segurança", line: "Security 100", text: "Escudo invisível contra raios UV e estilhaços. Contém fragmentos perigosos em caso de quebra.", garantia: "10 anos vertical · 07 anos horizontal", boletim: "https://drive.google.com/file/d/1H0Bff2AQAQ0dXtn1TXeYeMFP1aTw3a9r/view?usp=drive_link" },
];

window.R5WF_BLOG = [
  { title: "A R5WF Brilha no Shark Tank: José Carlos Semenzato Investe R$ 10 Milhões na Empresa!", date: "15 de janeiro de 2025", category: "R5WF", excerpt: "A R5WF alcançou um marco histórico ao garantir um investimento de R$ 10 milhões no programa Shark Tank Brasil." },
  { title: "Legislação de Películas em 2025", date: "2 de janeiro de 2025", category: "Dicas", excerpt: "A legislação de películas passou por alterações e novas mudanças. Entenda o que vale hoje." },
  { title: "Ofuscamento no trânsito: como o sol aumenta o risco de acidentes ao dirigir", date: "24 de março de 2026", category: "CALOR", excerpt: "O ofuscamento causado pelo sol pode influenciar diretamente a segurança ao dirigir." },
  { title: "Liderança e governança com Ney Moraes em Florianópolis", date: "24 de outubro de 2025", category: "Team", excerpt: "Ney Moraes participou de roda de conversa promovida pela ORA – Laboratório de Governança." },
  { title: "Tecnologia Certificada e Confiança Comprovada", date: "23 de outubro de 2025", category: "Produtos R5WF", excerpt: "Mais de 10 certificações internacionais que validam a excelência das películas R5WF." },
];
