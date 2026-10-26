# AJEMS — site officiel

Site de l'Alliance des Jeunes Entrepreneurs de Mermoz-Sacré-Cœur (Dakar).

## Démarrage

```bash
nvm use            # Node 22 (voir .nvmrc)
npm install
cp .env.example .env
npm run dev
```

| Script | Rôle |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` | vérification TypeScript + build de production |
| `npm test` | tests Vitest |
| `npm run lint` | lint (oxlint) |

La documentation complète (Supabase, déploiement, mise en production) sera ajoutée au fil de la V1.
