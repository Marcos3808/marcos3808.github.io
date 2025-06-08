let menuClickSound, clickSound, clickSoundRestart, badEndSound, goodEndSound, mediumEndSound;
try {
  menuClickSound = new Howl({
    src: ['/assets/sounds/som7.mp3'],
    volume: 0.3,
    preload: true,
    onloaderror: () => console.warn('Erro ao carregar som7.mp3')
  });
  clickSound = new Howl({
    src: ['/assets/sounds/click2mod.mp3'],
    volume: 0.3,
    preload: true,
    onloaderror: () => console.warn('Erro ao carregar som2mod.mp3')
  });
  clickSoundRestart = new Howl({
    src: ['/assets/sounds/som4.mp3'],
    volume: 0.3,
    preload: true,
    onloaderror: () => console.warn('Erro ao carregar som4.mp3')
  });
  badEndSound = new Howl({
    src: ['/assets/sounds/somruim.mp3'],
    volume: 0.3,
    preload: true,
    onloaderror: () => console.warn('Erro ao carregar clickmeme4.mp3')
  });
  goodEndSound = new Howl({
    src: ['/assets/sounds/sombom.mp3'],
    volume: 0.3,
    preload: true,
    onloaderror: () => console.warn('Erro ao carregar clickmeme6.mp3')
  });
  mediumEndSound = new Howl({
    src: ['/assets/sounds/sommedio.mp3'],
    volume: 0.3,
    preload: true,
    onloaderror: () => console.warn('Erro ao carregar clickmeme1.mp3')
  });
} catch (e) {
  console.warn('Erro áudio', e);
}

let currentStoryParts = {};
let currentPart = "";
let cumulativeScore = 0;
let lastFeedback = "";

const emailStoryParts = {
  "start": {
    text: "Você recebe uma mensagem no WhatsApp de João, um amigo que não fala há meses. Ele pede R$500 urgentemente para uma emergência médica dizendo que pode pagar depois, a transferência via Pix. O que você faz agora?",
    image: "/assets/images/whatsapp_urgent_message.jpg",
    options: [
      { id: "callFriend", text: "Ligar para João para confirmar", next: "verify1", points: 2, feedback: "Ligar é uma ótima ideia! Contatos falsos são comuns em golpes." },
      { id: "sendMoney", text: "Responder pedindo mais detalhes", next: "click1", points: 0, feedback: "Cuidado! Interagir com mensagens suspeitas pode ser perigoso." },
      { id: "ignoreMessage", text: "Ignorar a mensagem", next: "ignore1", points: 1, feedback: "Ignorar pode evitar riscos, mas o golpe pode continuar." }
    ]
  },
  "ignore1": {
    text: "Você ignora a mensagem, mas outra chega do mesmo número, agora com uma foto do pai do João em uma cama de hospital. A mensagem insiste: 'Se quiser prova ta aqui, olha ele no hospital, por favor, ajuda!'. A foto parece genérica. O que você faz agora?",
    image: "/assets/images/whatsapp_hospital_photo.jpg",
    options: [
      { id: "blockNumber", text: "Bloquear o número", next: "ignore_report", points: 2, feedback: "Bloquear impede novas mensagens, mas o golpe pode persistir." },
      { id: "replyMessage", text: "Responder pedindo mais detalhes", next: "ignore2", points: 0, feedback: "Responder confirmou que você está ativo, permitindo que o golpista intensifique o ataque." },
      { id: "doNothing", text: "Continuar ignorando", next: "endIgnore", points: 0, feedback: "Ignorar pode não resolver, já que o golpista pode usar outros meios." }
    ]
  },
  "ignore_report": {
    text: "Você bloqueia o número, mas recebe uma nova mensagem de um número desconhecido, dizendo ser seu tio Edson, afirmando que trocou de de numero e pedindo R$500 pra ajuda. O número não está salvo. Como você reage?",
    image: "/assets/images/whatsapp_new_number.jpg",
    options: [
      { id: "verifyIdentity", text: "Fazer uma chamada de vídeo para confirmar a identidade", next: "ignore_expert", points: 2, feedback: "Chamadas de vídeo são uma forma segura de verificar identidades." },
      { id: "searchOnline", text: "Pesquisar sobre golpes de WhatsApp", next: "endInformation", points: 1, feedback: "Pesquisar pode revelar táticas comuns de golpistas." },
      { id: "replyAgain", text: "Responder para esclarecer", next: "endIgnore2", points: 0, feedback: "Responder a um número falso expôs você a mais riscos." }
    ]
  },
  "ignore2": {
    text: "Você responde pedindo mais detalhes, e o número do João envia uma imagem de um QR code. Isso pode ser uma armadilha para roubar seu dinheiro! O que você faz agora?",
    image: "/assets/images/whatsapp_qr_code.jpg",
    options: [
      { id: "reportSpam", text: "Denunciar como spam no WhatsApp", next: "endClickSafe", points: 1, feedback: "Denunciar ajuda a proteger outros usuários, mas sua conta ainda precisa de proteção." },
      { id: "secureAccount", text: "Ativar verificação em duas etapas", next: "ignore3", points: 2, feedback: "A verificação em duas etapas adiciona uma camada de segurança à sua conta." },
      { id: "ignoreAgain", text: "Ignorar e não responder", next: "endIgnore2", points: 0, feedback: "Ignorar pode não evitar tentativas futuras de golpe." }
    ]
  },
  "ignore3": {
    text: "Você ativa a verificação em duas etapas. As mensagens param, mas o WhatsApp notifica uma tentativa de login de um dispositivo desconhecido. Sua conta está em risco! O que você faz agora?",
    image: "/assets/images/whatsapp_login_alert.jpg",
    options: [
      { id: "changePin", text: "Alterar o PIN de verificação", next: "endBetterIgnore", points: 2, feedback: "Alterar o PIN bloqueia tentativas de acesso não autorizado." },
      { id: "monitorActivity", text: "Verificar sessões ativas no aplicativo", next: "endMonitor", points: 1, feedback: "Verificar sessões ajuda a identificar intrusos, mas é preciso agir." },
      { id: "ignoreAlert", text: "Ignorar o alerta", next: "endRelax", points: 0, feedback: "Ignorar alertas deixa sua conta vulnerável a ataques." }
    ]
  },
  "click1": {
    text: "Você responde pedindo mais detalhes, e o número desconhecido envia uma imagem de um QR code, dizendo: 'Escaneie para enviar o Pix de R$500, João precisa agora! 🏥'. O número não está salvo, e o QR code parece genérico. Isso pode ser uma armadilha! O que você faz agora?",
    image: "/assets/images/whatsapp_qr_code.jpg",
    options: [
      { id: "changePin", text: "Denunciar e bloquear o número", next: "endClickSafe", points: 2, feedback: "Denunciar e bloquear protege sua conta e ajuda outros usuários." },
      { id: "monitorActivity", text: "Ignorar a partir dali", next: "endClickIgnore", points: 1, feedback: "Ignorar evita riscos imediatos, mas o golpista pode tentar novamente." },
      { id: "ignoreAlert", text: "Escanear o QR code", next: "click2", points: 0, feedback: "Nunca escaneie QR codes de números desconhecidos! Isso pode roubar seu dinheiro." }
    ]
  },
  "click2": {
    text: "Você escaneia o QR code e é redirecionado a uma página falsa que rouba R$500 do seu Pix! Nunca escaneie QR codes de contatos desconhecidos. Contate seu banco em https://www.bcb.gov.br/ e denuncie o golpe no WhatsApp.",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "endClickSafe": {
    text: "Denunciar e bloquear o número protegeu sua conta! O WhatsApp removeu o contato suspeito. Dica: evite responder a mensagens de números não salvos.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "endClickIgnore": {
    text: "Você ignora a mensagem, mas o golpista envia mais QR codes a outros contatos usando seu nome. Sempre denuncie contatos suspeitos! Proteja sua conta em https://faq.whatsapp.com/.",
    image: "/assets/images/medium_end.jpg",
    options: []
  },
  "ignore_expert": {
    text: "A chamada de vídeo revela que o contato não é sua prima Ana, confirmando o golpe. Sua ação protegeu suas finanças! Dica: 90% dos golpes no WhatsApp usam contatos falsos. Continue usando chamadas de vídeo para verificar identidades.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "endIgnore": {
    text: "Você ignorou as mensagens suspeitas, mas dias depois, seus amigos te alertam sobre mensagens estranhas enviadas do seu WhatsApp, pedindo R$1000 via Pix. O golpista clonou sua conta ao enganar você anteriormente com um código de verificação enviado por SMS que você não notou. Acesse https://faq.whatsapp.com/ para recuperar sua conta e avise seus contatos sobre o golpe!",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "endIgnore2": {
    text: "Ignorar o QR code não evitou uma tentativa de login. Os golpistas acessaram sua conta e enviaram mensagens falsas. Denuncie mensagens suspeitas no WhatsApp e contate o suporte em https://faq.whatsapp.com/.",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "endMonitor": {
    text: "Você verifica as sessões ativas e encontra um dispositivo desconhecido, mas sem alterar o PIN, os golpistas continuam tentando acessar sua conta. Ative a verificação em duas etapas e desconecte dispositivos suspeitos nas configurações.",
    image: "/assets/images/medium_end.jpg",
    options: []
  },
  "endRelax": {
    text: "Ignorar o alerta permitiu que os golpistas clonassem sua conta. Seus contatos recebem mensagens falsas pedindo dinheiro. Sempre reaja a alertas de login! Contate o suporte do WhatsApp em https://faq.whatsapp.com/ para recuperar sua conta.",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "endBetterIgnore": {
    text: "Parabéns! Alterar o PIN e ativar a verificação em duas etapas bloqueou os golpistas. Sua conta está segura! Dica: revise suas senhas a cada 3 meses e use chamadas para verificar contatos suspeitos.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "verify1": {
    text: "Você liga para João, que explica que o número dele foi clonado. Os golpistas usaram uma foto antiga que ele tinha no perfil do WhatsApp para se passar por ele, enviando mensagens pedindo dinheiro aos contatos dele, como a que você recebeu. Sua conta está em risco. O que você faz agora?",
    image: "/assets/images/whatsapp_message_friend.jpg",
    options: [
      { id: "secureAccount", text: "Ativar verificação em duas etapas", next: "verify2", points: 2, feedback: "A verificação em duas etapas é uma barreira eficaz contra invasões." },
      { id: "contactSupport", text: "Denunciar ao suporte do WhatsApp", next: "endVerifyConsult", points: 1, feedback: "Denunciar ao suporte ajuda, mas proteger sua conta é essencial." },
      { id: "ignoreAlert", text: "Ignorar o alerta", next: "endVerifyIgnore", points: 0, feedback: "Ignorar alertas de login pode expor sua conta a riscos." }
    ]
  },
  "verify2": {
    text: "Com a verificação em duas etapas ativada, você recebe um SMS de um número desconhecido, apresentado como 'WhatsApp'. Em vez de um código de verificação, a mensagem um link, a URL parece estranha. Isso pode ser uma tentativa de roubar seu código! O que você faz agora?",
    image: "/assets/images/whatsapp_code_request.jpg",
    options: [
      { id: "reportMessage", text: "Denunciar o SMS como spam", next: "endVerifySoftUpdate", points: 2, feedback: "Denunciar mensagens suspeitas protege você e outros usuários." },
      { id: "shareCode", text: "Pesquisar sobre a mensagem", next: "endInformation", points: 2, feedback: "Pesquisar a mensagem ajudou a identificar o golpe." },
      { id: "checkSettings", text: "Verificar configurações de segurança", next: "verify2a", points: 1, feedback: "Verificar configurações é um bom passo, mas ação imediata é necessária." }
    ]
  },
  "verify2a": {
    text: "Você confirma que a verificação em duas etapas está ativa, mas as mensagens continuam, agora com tom ameaçador. O golpista parece saber que você está ativo. O que você faz agora?",
    image: "/assets/images/whatsapp_settings.jpg",
    options: [
      { id: "blockNumber", text: "Bloquear o número", next: "endVerifySoftUpdate", points: 2, feedback: "Bloquear impede novas mensagens e protege sua conta." },
      { id: "monitorActivity", text: "Verificar sessões ativas", next: "endVerifyMonitor", points: 1, feedback: "Verificar sessões ajuda a identificar intrusos, mas é preciso agir." },
      { id: "doNothing", text: "Ignorar as mensagens", next: "endVerifyIgnore", points: 0, feedback: "Ignorar mensagens pode permitir que o golpe continue." }
    ]
  },
  "verify2b": {
    text: "Usando uma ferramenta como o Google, você descobre que o número é falso. O WhatsApp alerta sobre outra tentativa de login de um dispositivo desconhecido. Sua conta está em risco! Qual é o próximo passo?",
    image: "/assets/images/whatsapp_login_alert.jpg",
    options: [
      { id: "changePin", text: "Alterar o PIN de verificação", next: "endVerifyReset", points: 2, feedback: "Alterar o PIN bloqueia tentativas de acesso não autorizado." },
      { id: "contactSupport", text: "Contatar o suporte do WhatsApp", next: "endVerifyConsult", points: 1, feedback: "O suporte pode ajudar, mas proteger sua conta agora é crucial." },
      { id: "ignoreSigns", text: "Ignorar os alertas", next: "endVerifyIgnore", points: 0, feedback: "Ignorar alertas deixa sua conta vulnerável." }
    ]
  },
  "endVerifyDelete": {
    text: "Ignorar as mensagens pareceu resolver, but os golpistas clonaram sua conta usando respostas anteriores. Seus contatos recebem mensagens falsas. Sempre confirme identidades! Recupere sua conta em https://faq.whatsapp.com/.",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "endVerifyIgnore": {
    text: "Ignorar os alertas permitiu que os golpistas acessassem sua conta e enviassem mensagens falsas. Seus amigos estão confusos! Sempre reaja a alertas de login. Contate o suporte em https://faq.whatsapp.com/.",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "endVerifyMonitor": {
    text: "Você verifica as sessões ativas e nota um dispositivo estranho, but sem medidas adicionais, sua conta permanece vulnerável. Ative a verificação em duas etapas e desconecte dispositivos suspeitos nas configurações.",
    image: "/assets/images/medium_end.jpg",
    options: []
  },
  "endVerifySoftUpdate": {
    text: "Denunciar e bloquear o número protegeu sua conta! O WhatsApp removeu o contato suspeito. Dica: limite quem pode ver seu status e revise suas configurações de privacidade regularmente.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "endVerifyConsult": {
    text: "O suporte do WhatsApp confirmou o golpe e bloqueou o número falso. Sua conta está segura! Dica: ative notificações de segurança e verifique contatos suspeitos por chamada de vídeo.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "endVerifyReset": {
    text: "Alterar o PIN bloqueou os golpistas, e sua conta está segura! Dica: 90% dos golpes no WhatsApp são evitados com senhas fortes e verificação em duas etapas. Continue revisando suas senhas regularmente.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "endInformation": {
    text: "Parabéns! Pesquisar online foi uma escolha inteligente e ajudou a identificar o golpe. Você evitou cair em armadilhas! Dica: Continue verificando informações em fontes confiáveis como sites oficiais ou artigos de notícias para se proteger no futuro.",
    image: "/assets/images/information_end.jpg",
    options: []
  }
};

const instagramStoryParts = {
  "start": {
    text: "Você vê um Story no Instagram de um perfil chamado 'M & M' anunciando um sorteio de um Kit de Skin Care de luxo. O Story contém um link que leva a um formulário para participar do sorteio, but algo na postagem como o texto genérico, a falta de detalhes claros. O que você faz agora?",
    image: "/assets/images/instagram_story.jpg",
    options: [
      { id: "checkProfile", text: "Verificar o perfil da marca", next: "i_verify1", points: 2, feedback: "Verificar o perfil é uma boa prática para identificar contas falsas." },
      { id: "clickLink", text: "Clicar no link do Story", next: "i_click1", points: 0, feedback: "Cuidado! Links em Stories podem levar a sites maliciosos." },
      { id: "ignoreStory", text: "Ignorar o Story", next: "i_ignore1", points: 1, feedback: "Ignorar evita riscos imediatos, but o golpe pode continuar." }
    ]
  },
  "i_ignore1": {
    text: "Você decide ignorar o Story, but recebe uma DM da mesma conta, afirmando que você foi selecionado para o sorteio, apesar do entusiasmo e da promessa, a falta de detalhes, a urgência e a ausência de um selo de verificação no perfil confirmam a tentativa de golpe. O que você faz agora?",
    image: "/assets/images/instagram_dm.jpg",
    options: [
      { id: "reportProfile", text: "Denunciar o perfil como falso", next: "i_ignore_report", points: 2, feedback: "Denunciar perfis falsos ajuda a proteger a comunidade." },
      { id: "checkDM", text: "Denunciar a DM como spam", next: "i_ignore_support", points: 1, feedback: "Denunciar a DM como spam é um passo útil para alertar a plataforma sobre atividades suspeitas." },
      { id: "ignoreDM", text: "Ignorar a mensagem", next: "i_endIgnore", points: 0, feedback: "Ignorar pode não evitar tentativas futuras de golpe." }
    ]
  },
  "i_ignore_report": {
    text: "Você denuncia o perfil, but outro Story aparece de uma conta similar, 'SpectraShop', oferecendo um sorteio de placa de video, com o mesmo layout da pagina que você acabou de bloquear. Como você reage?",
    image: "/assets/images/instagram_new_story.jpg",
    options: [
      { id: "checkOfficial", text: "Olhar configurações de segurança", next: "i_ignoreSettings", points: 3, feedback: "Verificar as configurações de segurança do Instagram ajuda a proteger sua conta contra tentativas de golpe." },
      { id: "blockAccount", text: "Bloquear e denunciar a nova conta", next: "i_click3", points: 2, feedback: "Bloquear impede novas mensagens e denunciar pode ajudar a derrubar a conta." },
      { id: "clickNewLink", text: "Clicar no link do novo Story", next: "i_website", points: 0, feedback: "Clicar em links de Stories suspeitos pode levar a sites falsos." }
    ]
  },
  "i_ignore3": {
    text: "Com o 2FA ativo, você bloqueia uma tentativa de login. Outro Story aparece, pedindo dados de pagamento para 'taxas de envio' do sorteio. O que você faz agora?",
    image: "/assets/images/instagram_payment.jpg",
    options: [
      { id: "updateInfo", text: "Atualizar as informações", next: "i_endIgnore2", points: 0, feedback: "Nunca insira dados pessoais em links suspeitos." },
      { id: "ignoreStory", text: "Ignorar o Story", next: "i_endBetterIgnore", points: 2, feedback: "Ignorar Stories suspeitos evita riscos adicionais." },
      { id: "checkSettings", text: "Verificar configurações de segurança", next: "i_ignoreSettings", points: 1, feedback: "Verificar configurações ajuda, but ação imediata é necessária." }
    ]
  },
  "i_ignoreSettings": {
    text: "Ao verificar as configurações, você recebe um alerta sobre uma tentativa de login bloqueada de um aparelho desconhecido em outro país. Qual é a melhor ação a tomar agora?",
    image: "/assets/images/instagram_login_alert.jpg",
    options: [
      { id: "contactSupport", text: "Alterar apenas a senha", next: "i_ignore_password", points: 1, feedback: "Alterar a senha é um passo inicial, but não protege completamente contra novas tentativas de invasão." },
      { id: "ignoreEmail", text: "Alterar senha e ativar 2FA", next: "i_endVerifyRefresh", points: 5, feedback: "Alterar a senha e ativar o 2FA são medidas para proteger sua conta contra acessos não autorizados." },
      { id: "disable2FA", text: "Não alterar nada", next: "i_endModerateIgnore", points: 0, feedback: "Não tomar nenhuma ação urgente torna sua conta exposta a novas tentativas de invasão." }
    ]
  },
  "i_website": {
    text: "Durante uma investigação online você descobre o site, ao acessá-lo, percebe que é uma página extremamente simplificada. informações básicas, seções incompletas, links que não funcionam, textos genéricos e ausência de detalhes. A sensação é de que o site foi criado para parecer verdadeiro. Diante disso, o que você faz agora?",
    image: "/assets/images/instagram_website.jpg",
    options: [
      { id: "enable2FA", text: "Ativar 2FA e mudar senha", next: "i_endVerifyRefresh", points: 5, feedback: "Ativar 2FA e mudar a senha protege sua conta imediatamente." },
      { id: "reportDM", text: "Denunciar a mensagem DM", next: "i_ignore_support", points: 1, feedback: "Denunciar é útil, but proteger sua conta é essencial." },
      { id: "ignoreDM", text: "Ignorar todos os alertas", next: "i_endModerateIgnore", points: 0, feedback: "Ignorar todos os alertas deixa sua conta vulnerável, permitindo que o golpe continue." }
    ]
  },
  "i_ignore_password": {
    text: "Você alterou sua senha, e sua conta está segura por enquanto! No entanto, tentativas de login suspeitas podem ocorrer novamente. Dica: ative a autenticação de dois fatores (2FA) e limite quem pode enviar DMs para reforçar sua segurança.",
    image: "/assets/images/medium_end.jpg",
    options: []
  },
  "i_ignore_support": {
    text: "Você denunciou a mensagem suspeita, ajudando a manter o Instagram mais seguro! Lembre-se sempre ative a autenticação de dois fatores (2FA) e restrinja quem pode enviar DMs para proteger sua conta contra futuras ameaças.",
    image: "/assets/images/medium_end.jpg",
    options: []
  },
  "i_endIgnore": {
    text: "Ignorar as mensagens permitiu que os golpistas continuassem enviando links falsos. Sempre denuncie contas suspeitas! Recupere sua conta em https://help.instagram.com/.",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "i_endIgnore2": {
    text: "Clicar no link comprometeu sua conta. Os golpistas postaram Stories falsos em seu nome. Verifique atividades suspeitas! Contate o suporte em https://help.instagram.com/.",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "i_endBetterIgnore": {
    text: "Parabéns! Ignorar Stories suspeitos e manter o 2FA ativo protegeu sua conta. Dica: 80% dos golpes no Instagram usam links falsos. Continue verificando perfis antes de interagir.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "i_endModerateIgnore": {
    text: "Desprezar os alertas não elimina o perigo; ao contrário, ele só cresce, comprometendo seus dados e custando sua conta.",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "i_click1": {
    text: "Clicar no link leva a uma página falsa que pede nome, telefone e endereço para o 'sorteio'. A URL parece estranha (ex.: nike-promo.xyz). O que você faz agora?",
    image: "/assets/images/instagram_fake_form.jpg",
    options: [
      { id: "closeForm", text: "Fechar o formulário e denunciar", next: "i_click3", points: 2, feedback: "Fechar e denunciar evita que seus dados sejam roubados." },
      { id: "fillForm", text: "Preencher o formulário", next: "i_click4", points: 0, feedback: "Preencher formulários em links suspeitos pode expor seus dados." },
      { id: "checkSettings", text: "Verificar configurações de segurança", next: "i_click2", points: 1, feedback: "Verificar configurações é um bom passo, but ação imediata é necessária." }
    ]
  },
  "i_click2": {
    text: "Você verifica as configurações e nota uma tentativa de login de um dispositivo desconhecido. A conta falsa continua enviando DMs com links. O que você faz agora?",
    image: "/assets/images/instagram_login_alert.jpg",
    options: [
      { id: "enable2FA", text: "Ativar 2FA e mudar senha", next: "i_endVerifyRefresh", points: 5, feedback: "Ativar 2FA e mudar a senha protege sua conta imediatamente." },
      { id: "blockAccount", text: "Bloquear a conta", next: "i_click3", points: 1, feedback: "Bloquear impede novas mensagens, but sua conta precisa de proteção." },
      { id: "ignoreDMs", text: "Ignorar as DMs", next: "i_endIgnore", points: 0, feedback: "Ignorar mensagens pode permitir que o golpe continue." }
    ]
  },
  "i_click3": {
    text: "Denunciar o perfil evitou o golpe, e o Instagram removeu a conta falsa. Sua conta está segura! Dica: sempre verifique o selo de verificação antes de clicar em Stories.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "i_click4": {
    text: "Preencher o formulário comprometeu seus dados pessoais. Os golpistas agora têm seu nome e telefone! Nunca insira informações em links suspeitos. Contate o suporte em https://help.instagram.com/.",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "i_verify1": {
    text: "Você analisa o perfil 'M & M' no Instagram e percebe que ele não possui selo de verificação, as fotos dos produtos são genéricas e os comentários nas postagens parecem automatizados. Ao verificar os seguidores, você nota que sua melhor amiga segue a página. O que você faz agora?",
    image: "/assets/images/instagram_fake_profile.jpg",
    options: [
      { id: "reportProfile", text: "Denunciar e bloquear o perfil", next: "i_verify2", points: 2, feedback: "Denunciar e bloquear é uma ação eficaz contra perfis falsos." },
      { id: "checkWebsite", text: "Pesquisar por essa loja no Google", next: "i_verify3", points: 1, feedback: "Consultar o Google ajuda a confirmar se a loja é legítima." },
      { id: "contactSupport", text: "Perguntar para melhor amiga", next: "i_verify4", points: 2, feedback: "Perguntar à amiga pode esclarecer e ajudar caso ela tenha caido no golpe." }
    ]
  },
  "i_verify2": {
    text: "Denunciar o perfil evitou o golpe, e o Instagram removeu a conta falsa. Sua conta está segura! Dica: limite quem pode ver seus Stories para evitar novos golpes.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "i_verify3": {
    text: "Você pesquisa o site mencionado no Story, but, exceto referências ao famoso doce, não encontra nada relevante. De volta ao Instagram, o que você faz agora?",
    image: "/assets/images/instagram_search.jpg",
    options: [
      { id: "enable2FA", text: "Ativar 2FA e mudar senha", next: "i_endVerifyRefresh", points: 5, feedback: "Ativar 2FA e mudar a senha protege sua conta imediatamente." },
      { id: "reportDM", text: "Denunciar a mensagem DM", next: "i_ignore_support", points: 1, feedback: "Denunciar é útil, but proteger sua conta é essencial." },
      { id: "ignoreDM", text: "Ignorar todos os alertas", next: "i_endModerateIgnore", points: 0, feedback: "Ignorar evita riscos imediatos, but não resolve o golpe." }
    ]
  },
  "i_verify4": {
    text: "Você decide conversar com sua melhor amiga sobre o perfil. Durante um bate-papo, você menciona o sorteio anunciado no Story. Ela responde que achou tentador e começou a seguir a página só por causa dele, but não sabe nada sobre a marca e nunca participou de outros sorteios deles. O que você faz agora?",
    image: "/assets/images/instagram_bestfriend.jpg",
    options: [
      { id: "monitor", text: "Pesquisar na internet sobre a marca", next: "i_endInformation", points: 5, feedback: "Pesquisar a reputação da marca em fontes confiáveis é a melhor proteção." },
      { id: "enable2FA", text: "Denunciar e alertar sua amiga", next: "i_endReportAlert", points: 2, feedback: "Denunciar perfis suspeitos e alertar amigos é a melhor proteção." },
      { id: "ignore", text: "Investigar o link do sorteio", next: "i_endInvestigateLink", points: 1, feedback: "Investigar o link pode ser arriscado; sempre use um ambiente seguro e evite inserir dados pessoais." }
    ]
  },
  "i_endVerifyRefresh": {
    text: "Ativar 2FA e mudar a senha protegeu sua conta! Dica: 70% dos golpes no TikTok usam desafios falsos. Continue verificando perfis e limite quem pode marcar você.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "i_endInvestigateLink": {
    text: "Ao investigar o link do sorteio, você descobriu que ele levava a um site falso que pedia dados pessoais. Sua cautela evitou um golpe, but o perfil continuou ativo. Sempre verifique links com atenção! Saiba mais sobre segurança em https://help.instagram.com/.",
    image: "/assets/images/medium_end.jpg",
    options: []
  },
  "i_endReportAlert": {
    text: "Denunciar o perfil e alertar sua amiga impediu que ela caísse no golpe, but outros seguidores ainda podem ser enganados. Continue vigilante e reporte atividades suspeitas! Veja como se proteger em https://help.instagram.com/.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "i_endInformation": {
    text: "Parabéns! Pesquisar online foi uma escolha inteligente e ajudou a identificar o golpe. Você evitou cair em armadilhas! Dica: Continue verificando informações em fontes confiáveis como sites oficiais ou artigos de notícias para se proteger no futuro.",
    image: "/assets/images/information_end.jpg",
    options: []
  }
};

const tiktokStoryParts = {
  "start": {
    text: "Você recebe uma DM no TikTok de um perfil viral, 'TrendMaster', convidando você para um 'desafio' que promete 10 mil seguidores. Eles pedem um vídeo enviado por um link. O perfil tem muitos likes, but parece suspeito. O que você faz agora?",
    image: "/assets/images/tiktok_challenge.jpg",
    options: [
      { id: "verifyProfile", text: "Verificar o perfil que enviou a DM", next: "t_verify1", points: 2, feedback: "Verificar o perfil é uma ótima forma de identificar contas falsas." },
      { id: "recordVideo", text: "Gravar e enviar o vídeo", next: "t_click1", points: 0, feedback: "Cuidado! Enviar vídeos por links suspeitos pode comprometer seus dados." },
      { id: "ignoreMessage", text: "Ignorar a mensagem", next: "t_ignore1", points: 1, feedback: "Ignorar evita riscos imediatos, but o golpe pode continuar." }
    ]
  },
  "t_ignore1": {
    text: "Você ignora a DM, but o perfil posta um vídeo marcando você, pedindo participação no desafio com emojis de fogo 🔥. Os comentários parecem entusiasmados, but genéricos. O que você faz agora?",
    image: "/assets/images/tiktok_viral_video.jpg",
    options: [
      { id: "reportVideo", text: "Denunciar o vídeo como spam", next: "t_ignore_report", points: 2, feedback: "Denunciar vídeos suspeitos protege você e outros usuários." },
      { id: "checkVideo", text: "Verificar os comentários do vídeo", next: "t_ignore2", points: 1, feedback: "Verificar comentários pode revelar pistas de golpes." },
      { id: "ignoreVideo", text: "Ignorar o vídeo", next: "t_endIgnore", points: 0, feedback: "Ignorar a mensagem permite que os golpistas continuem tentando enganar você ou outros. Denunciar é uma ação mais segura." }
    ]
  },
  "t_ignore_report": {
    text: "Você denuncia o vídeo, but outra DM chega de um perfil chamado 'ViralNow', insistindo no desafio com um novo link. O perfil não parece confiável. Como você reage?",
    image: "/assets/images/tiktok_new_dm.jpg",
    options: [
      { id: "checkSettings", text: "Verificar configurações de segurança", next: "t_ignore2", points: 1, feedback: "Verificar configurações ajuda a identificar riscos." },
      { id: "contactSupport", text: "Contatar o suporte do TikTok", next: "t_ignore_support", points: 2, feedback: "O suporte pode confirmar o golpe e proteger sua conta." },
      { id: "clickLink", text: "Clicar no novo link", next: "t_endIgnore2", points: 0, feedback: "Links suspeitos podem roubar seus dados. Evite clicar!" }
    ]
  },
  "t_ignore2": {
    text: "Você verifica os comentários e vê usuários alertando que o desafio é um golpe. O TikTok notifica uma tentativa de login de um dispositivo estranho. Sua conta está em risco! O que você faz agora?",
    image: "/assets/images/tiktok_login_alert.jpg",
    options: [
      { id: "changePassword", text: "Mudar a senha imediatamente", next: "t_ignore3", points: 2, feedback: "Mudar a senha bloqueia tentativas de acesso não autorizado." },
      { id: "checkComments", text: "Continuar investigando comentários", next: "t_ignore_support", points: 1, feedback: "Investigar ajuda, but proteger sua conta é essencial." },
      { id: "ignoreAlerts", text: "Ignorar o alerta", next: "t_endIgnore2", points: 0, feedback: "Ignorar alertas de login pode comprometer sua conta." }
    ]
  },
  "t_ignore3": {
    text: "Você muda a senha, but outro vídeo marcando você aparece, pedindo dados pessoais via link para 'completar o desafio'. O que você faz agora?",
    image: "/assets/images/tiktok_new_video.jpg",
    options: [
      { id: "enable2FA", text: "Ativar autenticação de dois fatores", next: "t_ignore4", points: 2, feedback: "O 2FA adiciona uma camada extra de segurança." },
      { id: "reportVideo", text: "Denunciar o novo vídeo", next: "t_verify2", points: 1, feedback: "Denunciar é útil, but sua conta precisa de proteção." },
      { id: "ignoreVideo", text: "Ignorar o vídeo", next: "t_end_verify_moderate", points: 1, feedback: "Ignorar evita riscos, but não resolve o golpe." }
    ]
  },
  "t_ignore4": {
    text: "Com o 2FA ativo, você bloqueia uma tentativa de login. Um email 'do TikTok' pede para desativar o 2FA, alegando 'atualização de conta'. O que você faz agora?",
    image: "/assets/images/tiktok_email.jpg",
    options: [
      { id: "ignoreEmail", text: "Ignorar o email", next: "t_endVerifyRefresh", points: 2, feedback: "Ignorar emails suspeitos é seguro, já que o TikTok nunca pede isso." },
      { id: "contactSupport", text: "Contatar o suporte do TikTok", next: "t_ignore_support", points: 1, feedback: "O suporte pode confirmar o golpe, but sua conta já está segura." },
      { id: "disable2FA", text: "Desativar o 2FA", next: "t_endIgnore2", points: 0, feedback: "Desativar o 2FA deixa sua conta vulnerável." }
    ]
  },
  "t_ignore_support": {
    text: "Você descobre um artigo da BBC dizendo que 60% dos desafios no TikTok são golpes para roubar dados. Sua conta está segura! Dica: limite quem pode marcar você em vídeos e verifique perfis suspeitos.",
    image: "/assets/images/medium_end.jpg",
    options: []
  },
  "t_endIgnore": {
    text: "Ignorar o vídeo permitiu que os golpistas continuassem marcando você, enganando seus seguidores com links falsos. Sempre denuncie conteúdo suspeito! Recupere sua conta em https://www.tiktok.com/support/.",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "t_endIgnore2": {
    text: "Clicar no link ou ignorar alertas comprometeu sua conta. Os golpistas postaram vídeos falsos em seu nome. Verifique atividades suspeitas! Contate o suporte em https://www.tiktok.com/support/.",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "t_endBetterIgnore": {
    text: "Parabéns! Denunciar o vídeo e proteger sua conta evitou o golpe! Dica: 70% dos golpes no TikTok usam desafios falsos. Continue verificando perfis antes de participar.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "t_click1": {
    text: "Enviar o vídeo pelo link levou a um site que roubou suas credenciais. Os golpistas acessaram sua conta! Nunca envie vídeos por links suspeitos. Contate o suporte em https://www.tiktok.com/support/.",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "t_click2": {
    text: "Você interage com o perfil, que pede mais vídeos para 'validar' sua participação. A DM usa emojis de urgência 🚨. O que você faz agora?",
    image: "/assets/images/tiktok_new_video.jpg",
    options: [
      { id: "stopInteraction", text: "Parar de interagir e denunciar", next: "t_verify2", points: 2, feedback: "Parar e denunciar evita que o golpe avance." },
      { id: "sendMore", text: "Enviar outro vídeo", next: "t_click1", points: 0, feedback: "Enviar mais vídeos pode expor seus dados." },
      { id: "checkSettings", text: "Verificar configurações de segurança", next: "t_click3", points: 1, feedback: "Verificar configurações ajuda, but ação imediata é necessária." }
    ]
  },
  "t_click3": {
    text: "Você verifica as configurações e nota tentativas de login de dispositivos estranhos. O perfil continua enviando DMs. O que você faz agora?",
    image: "/assets/images/tiktok_login_alert.jpg",
    options: [
      { id: "enable2FA", text: "Ativar 2FA e mudar senha", next: "t_endVerifyRefresh", points: 2, feedback: "Ativar 2FA e mudar a senha protege sua conta imediatamente." },
      { id: "monitor", text: "Verificar sessões ativas da conta", next: "t_end_verify_moderate", points: 1, feedback: "Verificar sessões ajuda, but é preciso mais proteção." },
      { id: "ignore", text: "Ignorar as mensagens", next: "t_endVerify", points: 0, feedback: "Ignorar mensagens pode permitir que o golpe continue." }
    ]
  },
  "t_verify1": {
    text: "Você verifica o perfil e nota vídeos genéricos e comentários automatizados, como 'Amei o desafio!'. O perfil não parece confiável. O que você faz agora?",
    image: "/assets/images/tiktok_fake_profile.jpg",
    options: [
      { id: "reportProfile", text: "Denunciar e bloquear o perfil", next: "t_verify2", points: 2, feedback: "Denunciar e bloquear é uma ação eficaz contra perfis falsos." },
      { id: "checkSettings", text: "Verificar configurações de segurança", next: "t_verify3", points: 1, feedback: "Verificar configurações ajuda a proteger sua conta." },
      { id: "contactFriend", text: "Avisar amigos sobre o perfil", next: "t_verify4", points: 2, feedback: "Avisar amigos ajuda a proteger a comunidade." }
    ]
  },
  "t_verify2": {
    text: "Denunciar o perfil evitou o golpe, e o TikTok removeu a conta falsa. Sua conta está segura! Dica: limite quem pode marcar você em vídeos para evitar novos golpes.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "t_verify3": {
    text: "Você verifica as configurações e confirma que sua senha está segura. Outro vídeo marca você, pedindo dados pessoais via link. O que você faz agora?",
    image: "/assets/images/tiktok_new_video.jpg",
    options: [
      { id: "enable2FA", text: "Ativar 2FA e mudar senha", next: "t_endVerifyRefresh", points: 2, feedback: "Ativar 2FA e mudar a senha protege sua conta imediatamente." },
      { id: "reportVideo", text: "Denunciar o vídeo", next: "t_ignore_support", points: 1, feedback: "Denunciar é útil, but sua conta precisa de proteção." },
      { id: "ignoreVideo", text: "Ignorar o vídeo", next: "t_endVerify", points: 0, feedback: "Ignorar pode permitir que o golpe continue." }
    ]
  },
  "t_verify4": {
    text: "Você avisa seus amigos, que confirmam receber DMs suspeitas do mesmo perfil. Como proteger sua conta agora?",
    image: "/assets/images/tiktok_settings.jpg",
    options: [
      { id: "enable2FA", text: "Ativar 2FA e mudar senha", next: "t_endVerifyRefresh", points: 2, feedback: "Ativar 2FA e mudar a senha é a melhor proteção." },
      { id: "monitor", text: "Verificar sessões ativas da conta", next: "t_end_verify_moderate", points: 1, feedback: "Verificar sessões ajuda, but é preciso mais proteção." },
      { id: "ignore", text: "Ignorar e continuar normalmente", next: "t_endVerify", points: 0, feedback: "Ignorar deixa sua conta vulnerável a novos golpes." }
    ]
  },
  "t_endVerifyRefresh": {
    text: "Ativar 2FA e mudar a senha protegeu sua conta! Dica: 70% dos golpes no TikTok usam desafios falsos. Continue verificando perfis e limite quem pode marcar você.",
    image: "/assets/images/good_end.jpg",
    options: []
  },
  "t_endVerify": {
    text: "Ignorar os sinais permitiu que os golpistas acessassem sua conta e postassem vídeos falsos. Sempre verifique atividades suspeitas! Contate o suporte em https://www.tiktok.com/support/.",
    image: "/assets/images/bad_end.jpg",
    options: []
  },
  "t_end_verify_moderate": {
    text: "Verificar sessões ativas ajudou a detectar o golpe, but sem 2FA, sua conta permanece vulnerável. Ative a autenticação de dois fatores e revise suas configurações.",
    image: "/assets/images/medium_end.jpg",
    options: []
  }
};

function menuItemClick(storyKey) {
  if (menuClickSound) menuClickSound.play();
  startStory(storyKey);
}

function startStory(storyKey) {
  cumulativeScore = 0;
  currentPart = "start";
  lastFeedback = "";
  if (storyKey === "story1") {
    currentStoryParts = emailStoryParts;
  } else if (storyKey === "story2") {
    currentStoryParts = instagramStoryParts;
  } else if (storyKey === "story3") {
    currentStoryParts = tiktokStoryParts;
  } else {
    console.warn('História inválida:', storyKey);
    return;
  }
  document.getElementById("menu-container").style.display = "none";
  document.getElementById("scenario-container").style.display = "block";
  document.body.style.backgroundImage = "url('/assets/images/imageHD.jpg')";
  loadPart();
}

function loadPart() {
  const part = currentStoryParts[currentPart];
  if (!part) {
    console.warn('Parte do cenário não encontrado:', currentPart);
    document.getElementById("score-display").innerHTML = "";
    document.getElementById("scenario-description").innerHTML = "<p>Erro: Cenário não encontrado.</p>";
    document.getElementById("feedback-message").innerHTML = "";
    document.getElementById("image-container").innerHTML = "";
    document.getElementById("options").innerHTML = "";
    document.getElementById("restartBtn").style.display = "block";
    return;
  }

  document.getElementById("scenario-description").innerHTML = `<p>${part.text}</p>`;
  if (part.options.length === 0) {
    document.getElementById("score-display").innerHTML = `<p>Pontuação Final: ${cumulativeScore} pontos</p>`;
    document.getElementById("feedback-message").innerHTML = lastFeedback ? `<p id="feedback-message">${lastFeedback}</p>` : "";
    // Reproduzir áudio com base no tipo de final
    if (part.image === "/assets/images/bad_end.jpg" && badEndSound) {
      badEndSound.play();
    } else if (part.image === "/assets/images/good_end.jpg" && goodEndSound) {
      goodEndSound.play();
    } else if (part.image === "/assets/images/medium_end.jpg" && mediumEndSound) {
      mediumEndSound.play();
    }
  } else {
    document.getElementById("score-display").innerHTML = "";
    document.getElementById("feedback-message").innerHTML = lastFeedback ? `<p id="feedback-message">${lastFeedback}</p>` : "";
  }

  document.getElementById("image-container").innerHTML = part.image
    ? `<img src="${part.image}" alt="Imagem do cenário" onerror="this.src='/assets/images/medium_end.jpg'">`
    : "";

  // Definir fundo com base na imagem do cenário
  if (part.image === "/assets/images/bad_end.jpg") {
    document.body.style.backgroundImage = "url('/assets/images/image2.jpg')";
  } else if (part.image === "/assets/images/good_end.jpg") {
    document.body.style.backgroundImage = "url('/assets/images/image3.jpg')";
  } else if (part.image === "/assets/images/medium_end.jpg") {
    document.body.style.backgroundImage = "url('/assets/images/image4.jpg')";
  } else if (part.image === "/assets/images/information_end.jpg") {
    document.body.style.backgroundImage = "url('/assets/images/imageHD.jpg')";
  } else {
    document.body.style.backgroundImage = "url('/assets/images/imageHD.jpg')";
  }

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";
  if (part.options.length === 0) {
    document.getElementById("restartBtn").style.display = "block";
  } else {
    document.getElementById("restartBtn").style.display = "none";
    part.options.forEach(option => {
      let btn = document.createElement("button");
      btn.className = "option";
      btn.innerText = option.text;
      btn.setAttribute("aria-label", `Opção: ${option.text}`);
      btn.addEventListener("click", function() {
        if (clickSound) clickSound.play();
        cumulativeScore += option.points;
        lastFeedback = option.feedback || "";
        currentPart = option.next;
        loadPart();
      });
      optionsContainer.appendChild(btn);
    });
  }
}

function restartGame() {
  if (clickSoundRestart) clickSoundRestart.play();
  document.getElementById("scenario-container").style.display = "none";
  document.getElementById("menu-container").style.display = "block";
  document.getElementById("score-display").innerHTML = "";
  document.getElementById("scenario-description").textContent = "";
  document.getElementById("feedback-message").innerHTML = "";
  document.getElementById("image-container").innerHTML = "";
  document.body.style.backgroundImage = "url('/assets/images/imageHD.jpg')";
  cumulativeScore = 0;
  currentPart = "";
  lastFeedback = "";
  currentStoryParts = {};
}