# Superando Obstáculos — Website Oficial

**Status: Production v1.0**

Site one-page oficial do livro **Superando Obstáculos**, de Carlos Alexandre Marques Junior. Hub digital das campanhas de crowdfunding (PPL e Catarse) e ponto central de tráfego vindo de LinkedIn, Instagram, WhatsApp, QR Codes e outras ações de divulgação.

**HTML/CSS/JS puro, sem build step, sem backend.** Publicado gratuitamente via GitHub Pages.

Checklist de produção — todos os itens confirmados nesta versão:

- [x] URL definitiva da campanha PPL configurada (`https://ppl.pt/SuperandoObstaculos`)
- [x] URL definitiva da campanha Catarse configurada (`https://www.catarse.com.br/superando-obsta`)
- [x] URL definitiva do LinkedIn configurada (`https://www.linkedin.com/in/carlos-alexandre-marques-junior/`)
- [x] URL definitiva do Instagram configurada (`https://www.instagram.com/descomplicagpagil/`)
- [x] WhatsApp Portugal configurado (+351 913 820 958)
- [x] WhatsApp Brasil configurado (+55 11 91094-0909)
- [x] Contacto de privacidade confirmado em `privacidade.html` (`carlosalexandrejunior@gmail.com`)
- [x] Bateria de testes funcionais executada
- [x] Zero placeholders operacionais restantes

## Estrutura do projeto

```
superando-obstaculos/
├── index.html              # página principal (one-page)
├── privacidade.html         # política de privacidade (RGPD)
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.ico
├── apple-touch-icon.png
├── .nojekyll                # impede o Jekyll de processar o site no GitHub Pages
└── assets/
    ├── css/styles.css       # design system completo (cores, tipografia, componentes)
    ├── js/
    │   ├── analytics.js     # GA4 + Google Consent Mode v2
    │   └── main.js          # config de links, UTM, menu, cookies, eventos
    └── img/                 # capa, foto do autor, OG image, favicons, recompensas
```

## Como atualizar os links (PPL, Catarse, LinkedIn, Instagram, WhatsApp)

Edite **apenas** o objeto `CONFIG.links` no topo do arquivo `assets/js/main.js`:

```js
var CONFIG = {
  links: {
    ppl: "https://ppl.pt/SuperandoObstaculos",
    catarse: "https://www.catarse.com.br/superando-obsta",
    linkedin: "https://www.linkedin.com/in/carlos-alexandre-marques-junior/",
    instagram: "https://www.instagram.com/descomplicagpagil/",
    whatsappPortugal: "https://wa.me/351913820958?text=...",
    whatsappBrasil: "https://wa.me/5511910940909?text=..."
  }
  ...
};
```

Os dois números de WhatsApp já estão configurados com a mensagem inicial oficial. Para trocar apenas o número, edite `whatsappPortugal` / `whatsappBrasil`; para trocar a mensagem pré-preenchida, edite a constante `WHATSAPP_MESSAGE` logo acima do objeto `CONFIG`.

Todos os botões e links do site (incluindo os do rodapé) são preenchidos automaticamente a partir desse objeto — não é necessário editar o HTML.

## Como testar localmente

Não é preciso instalar nada além de um servidor estático simples:

```bash
cd superando-obstaculos
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Como publicar no GitHub Pages

O repositório já existe: **`camjr1985/superando-obstaculos`**. Todas as URLs absolutas do projeto (canonical, Open Graph, JSON-LD, `robots.txt`, `sitemap.xml`) já estão configuradas para `https://camjr1985.github.io/superando-obstaculos/`.

Passos para publicar (a partir desta pasta):

```bash
cd superando-obstaculos
git init
git add .
git commit -m "Site oficial one-page de Superando Obstáculos"
git branch -M main
git remote add origin https://github.com/camjr1985/superando-obstaculos.git
git push -u origin main
```

Use o método de autenticação que preferir no momento do push (GitHub CLI `gh auth login`, credential manager, chave SSH, ou um token gerado e usado apenas localmente — sem colar em nenhum chat).

Depois do push:
1. No repositório, vá em **Settings → Pages**.
2. Em "Build and deployment", escolha **Source: Deploy from a branch**, branch **main**, pasta **/ (root)**.
3. Aguarde alguns minutos. O site ficará disponível em:
   `https://camjr1985.github.io/superando-obstaculos/`

Se no futuro o repositório mudar de nome ou de usuário, atualize as URLs absolutas em `index.html`, `privacidade.html`, `robots.txt` e `sitemap.xml` (todas usam `camjr1985.github.io/superando-obstaculos` — um "buscar e substituir" resolve).

## Domínio próprio (futuro)

O site já está preparado para migrar para um domínio próprio (ex: `superandoobstaculos.com`) sem alterações estruturais: basta apontar o domínio no GitHub Pages (Settings → Pages → Custom domain) e atualizar as mesmas URLs absolutas citadas acima.

## Google Analytics 4

- Measurement ID: `G-J3Y1PNFT3M`
- Implementado com **Google Consent Mode v2**: nenhum script do Google é carregado, e nenhum cookie de analytics é criado, até o visitante clicar em "Aceitar" no aviso de cookies (ou ativar a categoria "Analíticos" em "Gerir preferências").
- Eventos disparados: `click_ppl`, `click_catarse`, `click_zenodo`, `click_linkedin`, `click_instagram`, `click_whatsapp`, `click_support`, `scroll_50`, `scroll_90`.
- `click_whatsapp` é o mesmo evento para os dois canais (Portugal e Brasil) — não foram criados eventos novos. Cada clique carrega os parâmetros adicionais `whatsapp_region` (`portugal` ou `brasil`) e `destination: "whatsapp"`, permitindo segmentar os dois canais no GA4 sem fragmentar a estrutura de eventos.
- Parâmetros de UTM (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) são capturados da URL, persistidos por até 90 dias em `localStorage` e anexados a todos os eventos de clique para permitir atribuição de campanha.

## Links de campanha (UTM) sugeridos

```
/?utm_source=linkedin&utm_medium=social&utm_campaign=superando_obstaculos
/?utm_source=instagram&utm_medium=social&utm_campaign=superando_obstaculos
/?utm_source=whatsapp&utm_medium=direct&utm_campaign=superando_obstaculos
/?utm_source=email&utm_medium=email&utm_campaign=superando_obstaculos
/?utm_source=qr&utm_medium=offline&utm_campaign=superando_obstaculos
```

## Direitos autorais

**Licença do repositório: No License (todos os direitos reservados).**

© 2026 Carlos Alexandre Marques Junior. Todos os direitos reservados.

O conteúdo editorial, textos, identidade visual, imagens, materiais relacionados ao livro "Superando Obstáculos" e o código deste projeto não possuem licença de reutilização, distribuição ou exploração comercial, salvo autorização expressa do titular dos direitos.
