# GeoRank Frontend

Site público e fluxo de entrada do GeoRank. Nesta versão de portfólio, dá para explorar as páginas de produto, a troca de idioma e as prévias interativas antes de entrar no Dashboard.

![Página pública do GeoRank capturada em execução local. A prévia de indicadores do site é ilustrativa.](docs/preview.webp)

<sub>Página pública do GeoRank capturada em execução local. A prévia de indicadores do site é ilustrativa.</sub>

[GeoRank Dashboard](https://github.com/c7bc/georank-dashboard) · [Estudo de caso](https://www.danielneri.pro/pt/work/georank)

## O que revisar em cinco minutos

- **Páginas públicas:** layout responsivo, páginas de recursos e preços com Next.js App Router.
- **Prévia interativa:** componentes React na landing page para explorar indicadores de exemplo.
- **Entrada na conta:** formulários com React Hook Form, Zod e integração com a API.
- **Idiomas e acessibilidade:** troca de idioma, menu mobile e retorno de foco ao fechar a navegação.

| Área | Código |
| --- | --- |
| Composição da landing page | [Rota pública](app/%28public%29/page.tsx) e [prévia do painel](components/landing/dashboard-preview.tsx) |
| Autenticação | [Ações](app/actions/auth.ts) e [destino pós-login](lib/utils/login-destination.ts) |
| Integração com a API | [Cliente HTTP](lib/api/client.ts) e [proxy](proxy.ts) |
| Internacionalização | [Configuração](i18n/request.ts) e [dicionários](dictionaries/) |

## Executar

Com Node.js 22 ou 24:

~~~sh
npm ci
npm run dev
~~~

Abra [localhost:3000](http://localhost:3000). As páginas públicas funcionam sem credenciais. Autenticação, convites e outras ações de conta dependem da API separada. Use [.env.example](.env.example) para configurar o ambiente local e o endereço do Dashboard.

## Verificações

~~~sh
npm run check
npm run build
npx playwright install chromium
npm run test:preview
~~~

A suíte de prévia cobre páginas públicas, navegação mobile e troca de idioma. Os testes de integração com contas usam um ambiente de testes que precisa ser provisionado à parte.
