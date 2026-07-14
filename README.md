# R5WF — Site Premium (Rebranding)

Site estático multi-página baseado no conteúdo oficial de [r5wf.com.br](https://r5wf.com.br/).

## Estrutura

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Home premium (12 seções) |
| `automotiva.html` | Linha automotiva + boletins técnicos |
| `arquitetura.html` | Linha arquitetônica + boletins |
| `sobre.html` | História, Shark Tank, pilares |
| `lojas-oficiais.html` | **Lojas R5WF** — 89 lojas com mapa, telefone e Instagram |
| `blog.html` | Posts do blog oficial |
| `data/lojas.js` | Base de lojas (gerada do site oficial) |
| `config.js` | Produtos, WhatsApp/Visionmetrics |
| `style.css` | Design system |
| `script.js` | Animações, slider, FAQ, lojas + mapa |

## Lojas R5WF

A página `lojas-oficiais.html` importa **89 lojas** de [r5wf.com.br/onde-encontrar/](https://r5wf.com.br/onde-encontrar/) com:

- Filtro por estado e cidade
- Busca por nome/endereço/código
- Telefone, Instagram, site
- Mapa integrado (atualiza ao clicar na loja)
- Link “Como chegar” (Google Maps)

Para atualizar a lista:

```bash
node tools/scrape-lojas.mjs
```

## WhatsApp / Visionmetrics

Edite `config.js` → `whatsapp.phone` e `visionmetricsScriptUrl`.

## Rodar localmente

```bash
npx serve .
```
