/**
 * DADOS MOCK PARA TESTES - APENAS EM DESENVOLVIMENTO
 * 
 * Este arquivo contém postagens simuladas para facilitar
 * testes visuais do feed e stories.
 * 
 * ⚠️ ATENÇÃO: Estes dados são APENAS para desenvolvimento.
 * NÃO serão usados em produção.
 */

import { Post } from "./data-context";

// URLs de imagens estáveis (Unsplash Source - versão estável)
// Usando imagens temáticas relacionadas ao ambiente de trabalho
const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
];

// Textos realistas para postagens
const POST_TEXTS = {
  araripina: [
    "Ótimo dia de trabalho aqui na Araripina! Equipe empenhada e resultados positivos! 🌟",
    "Reunião de equipe muito produtiva hoje. Vamos continuar nesse ritmo! 💪",
    "Novo recorde de atendimentos esta semana. Parabéns a toda equipe! 🎉",
    "Troca de experiência com a unidade de Serra Talhada foi incrível! 👏",
    "Final de semana de planejamento. Projetos interessantes para o próximo mês! 📊",
    "Festa de aniversário da unidade foi um sucesso! Obrigada a todos! 🎂",
    "Agradecimento especial aos clientes que confiam no nosso trabalho! ❤️",
    "Treinamento de novas técnicas de atendimento. Aprendizado constante! 📚",
  ],
  serra: [
    "Excelente performance da equipe de Serra Talhada este mês! 🚀",
    "Inauguração da nova área de atendimento. Espaço incrível! ✨",
    "Workshop de vendas foi um sucesso. Muito conhecimento compartilhado! 💡",
    "Cliente satisfeito deixou depoimento positivo. Isso nos motiva! 😊",
    "Reunião estratégica para o próximo trimestre. Metas definidas! 🎯",
    "Parceria com fornecedores locais fortalecida. Crescimento conjunto! 🤝",
    "Celebração de resultados alcançados. Equipe de ouro! 🏆",
    "Novo sistema implementado com sucesso. Agilidade aumentada! ⚡",
  ],
  garanhuns: [
    "Tempo perfeito em Garanhuns para reuniões ao ar livre! 🌤️",
    "Equipe unida e focada em entregar o melhor serviço! 💼",
    "Destaque do mês: recorde de satisfação dos clientes! ⭐",
    "Evento de integração foi incrível! Momentos de descontração! 🎈",
    "Planejamento de ações especiais para o período de maior movimento! 📅",
    "Reconhecimento público de funcionário exemplar. Merecido! 👏",
    "Melhoria nas instalações concluída. Ambiente renovado! 🏗️",
    "Feedback positivo dos clientes nos enche de orgulho! ❤️",
  ],
  cajazeiras: [
    "Trabalho em equipe fazendo a diferença em Cajazeiras! 🤝",
    "Novas estratégias de atendimento implementadas. Resultados aparecendo! 📈",
    "Comemoração de metas alcançadas. Todos se dedicaram muito! 🎊",
    "Visita técnica muito proveitosa. Aprendizados importantes! 🔍",
    "Cliente novo aprovou nosso serviço. Recomendação garantida! ✨",
    "Reunião de alinhamento foi essencial. Todos na mesma página! 📋",
    "Atividades de team building fortaleceram o time! 🏃‍♀️",
    "Qualidade do atendimento em destaque. Continuem assim! 🌟",
  ],
  vitoria: [
    "Vitória continua entregando excelência no atendimento! 💎",
    "Nova estrutura de suporte ao cliente funcionando perfeitamente! ⚙️",
    "Encontro regional foi enriquecedor. Muitas ideias compartilhadas! 💭",
    "Processo de melhoria contínua em andamento. Evoluindo sempre! 📊",
    "Reconhecimento da gestão para a equipe dedicada! 🏅",
    "Cliente de longa data renovou contrato. Confiança conquistada! 🤝",
    "Treinamento sobre novas tecnologias. Time atualizado! 💻",
    "Celebração de aniversário da unidade com toda equipe! 🎉",
  ],
  livramento: [
    "Livramento com foco total na satisfação dos clientes! 🎯",
    "Resultados do mês superaram expectativas. Parabéns! 🎊",
    "Integração entre equipes das diferentes unidades foi excelente! 🌐",
    "Novo projeto piloto iniciado. Expectativas altas! 🚀",
    "Feedback dos clientes nos guia na busca por excelência! 📝",
    "Reunião de resultados mostrou crescimento constante! 📈",
    "Evento de networking ampliou nossos horizontes! 🌟",
    "Dedicação da equipe é o nosso maior diferencial! 💪",
  ],
  muriae: [
    "Muriaé em destaque com inovação e qualidade! ✨",
    "Nova metodologia de trabalho implementada com sucesso! 🔄",
    "Equipe motivada e resultados positivos. Siga assim! 👍",
    "Parcerias estratégicas fortalecendo nossa presença! 🤝",
    "Workshop interno agregou muito conhecimento! 🎓",
    "Reconhecimento de esforços individuais. Todos importam! ⭐",
    "Planejamento para crescimento sustentável. Visão de futuro! 🔮",
    "Celebração de conquistas coletivas. Trabalho em equipe! 🎈",
  ],
  vilhena: [
    "Vilhena expandindo horizontes com excelência! 🌄",
    "Novos projetos em desenvolvimento. Expectativas altas! 💼",
    "Reunião de alinhamento estratégico foi fundamental! 📋",
    "Cliente satisfeito é nossa maior conquista! ❤️",
    "Inovação e tradição caminhando juntas! 🚀",
    "Equipe engajada e resultados positivos! 💯",
    "Celebração de pequenas vitórias que fazem diferença! 🎉",
    "Feedback construtivo nos ajuda a crescer! 📊",
  ],
  corumba: [
    "Corumbá entregando qualidade e comprometimento! 🌊",
    "Novas oportunidades surgindo. Preparados para crescer! 📈",
    "Reunião de planejamento estratégico foi produtiva! 🎯",
    "Valorização do trabalho em equipe. Unidos somos mais fortes! 🤝",
    "Processos otimizados gerando resultados melhores! ⚡",
    "Reconhecimento de desempenho excepcional. Continue! 🏆",
    "Integração com outras unidades enriqueceu nosso conhecimento! 🌐",
    "Clientes satisfeitos são nossa motivação diária! 😊",
  ],
  fortaleza: [
    "Fortaleza brilhando com excelência no atendimento! 🌅",
    "Novo ciclo de treinamentos iniciado. Aprendizado constante! 📚",
    "Resultados positivos refletem o trabalho dedicado! 💎",
    "Evento de integração fortalecendo laços da equipe! 🎪",
    "Estratégias inovadoras gerando diferenciais competitivos! 💡",
    "Reconhecimento público da qualidade do nosso trabalho! 👏",
    "Parcerias estratégicas ampliando nossas possibilidades! 🌟",
    "Celebração de metas alcançadas. Equipe de ouro! 🥇",
  ],
  "macae-plaza": [
    "Macaé Plaza com foco em excelência e inovação! 🏢",
    "Novos processos implementados. Eficiência aumentada! ⚙️",
    "Equipe unida alcançando resultados excepcionais! 🎯",
    "Workshop de desenvolvimento pessoal foi transformador! 🌱",
    "Reconhecimento da gestão pelo trabalho impecável! ⭐",
    "Cliente satisfeito renovou contrato. Confiança conquistada! 🤝",
    "Integração entre equipes gerou sinergia incrível! 💫",
    "Celebração de conquistas individuais e coletivas! 🎊",
  ],
  "macae-centro": [
    "Macaé Centro entregando qualidade em cada atendimento! 🏙️",
    "Novas tecnologias implementadas. Modernização em curso! 💻",
    "Resultados do trimestre superaram todas as expectativas! 📊",
    "Evento de networking foi muito produtivo! 🌐",
    "Feedback positivo dos clientes nos enche de orgulho! ❤️",
    "Reunião estratégica definiu caminhos promissores! 🗺️",
    "Equipe comprometida com a excelência. Continuem! 💪",
    "Celebração de aniversário da unidade com toda família! 🎂",
  ],
};

// Função para gerar posts mock com datas variadas
function generateMockPosts(): Post[] {
  const now = new Date();
  const mockPosts: Post[] = [];
  let postId = 1000000; // IDs altos para evitar conflito com posts reais

  // Criar posts para cada unidade
  Object.entries(POST_TEXTS).forEach(([category, texts]) => {
    texts.forEach((text, index) => {
      // Datas espaçadas: do mais antigo (7 dias atrás) até hoje
      // Cada post tem uma data diferente para simular linha do tempo
      const daysAgo = texts.length - 1 - index;
      const hoursOffset = Math.floor(Math.random() * 12); // Variação de horas
      const createdAt = new Date(now);
      createdAt.setDate(createdAt.getDate() - daysAgo);
      createdAt.setHours(createdAt.getHours() - hoursOffset);
      createdAt.setMinutes(Math.floor(Math.random() * 60));

      // Escolher imagem (alguns posts com imagem, outros sem)
      const hasImage = Math.random() > 0.3; // 70% dos posts têm imagem
      const imageUrl = hasImage ? IMAGE_URLS[Math.floor(Math.random() * IMAGE_URLS.length)] : undefined;

      // Gerar likes e comentários realistas (baixos para simular início)
      const likes = Math.floor(Math.random() * 15);
      const comments = Math.floor(Math.random() * 5);

      // Autor simulado (varia entre alguns nomes)
      const authorNames = [
        "Equipe " + category.charAt(0).toUpperCase() + category.slice(1),
        "Gerente " + category,
        "Coordenador",
        "Supervisor",
      ];
      const authorName = authorNames[Math.floor(Math.random() * authorNames.length)];

      mockPosts.push({
        id: postId++,
        authorId: 999, // ID especial para mock (não conflita com usuários reais)
        authorName,
        authorRole: Math.random() > 0.5 ? "Gerente" : "Consultora",
        authorUnit: category,
        authorAvatar: undefined,
        content: text,
        imageUrl,
        category,
        likes,
        comments,
        isLiked: false,
        createdAt,
      });
    });
  });

  // Ordenar por data (mais recentes primeiro, como no feed real)
  return mockPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Retorna posts mock para uso em desenvolvimento
 * ⚠️ APENAS para ambiente de desenvolvimento
 */
export function getMockPosts(): Post[] {
  return generateMockPosts();
}
