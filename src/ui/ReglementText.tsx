import { REGLEMENT } from '../content/reglement'

/** Renders the règlement intérieur articles. `headingLevel` keeps the outline correct where it is embedded. */
export function ReglementText({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <div className="space-y-5">
      {REGLEMENT.articles.map((article) => (
        <article key={article.title} className="space-y-1.5">
          <H className="text-lg font-semibold">{article.title}</H>
          {article.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
      ))}
    </div>
  )
}
