#let palette = (
  navy: rgb("#14213d"),
  slate: rgb("#334155"),
  accent: rgb("#0f766e"),
  ink: rgb("#111827"),
  line: rgb("#cbd5e1"),
  soft: rgb("#f8fafc"),
)

#set page(
  paper: "us-letter",
  margin: (top: 0.52in, bottom: 0.52in, left: 0.58in, right: 0.58in),
)

#set par(justify: true, leading: 0.72em)
#set text(font: "Libertinus Serif", size: 9.6pt, fill: palette.ink)
#set list(spacing: 0.34em)

#let heading-font = "Libertinus Serif"

#show heading.where(level: 1): it => {
  block(below: 0.45em)[
    #set text(font: heading-font, weight: "bold", size: 19pt, fill: palette.navy)
    #it.body
  ]
}

#show heading.where(level: 2): it => {
  block(above: 0.95em, below: 0.45em)[
    #set text(font: heading-font, weight: "bold", size: 10.2pt, fill: palette.accent)
    #upper(it.body)
    #v(0.18em)
    #line(length: 100%, stroke: 0.7pt + palette.line)
  ]
}

#let smallcaps(content) = text(font: heading-font, size: 8.2pt, fill: palette.slate, content)

#let header(name, title, contacts) = [
  #align(center)[
    #text(font: heading-font, weight: "bold", size: 23pt, fill: palette.navy)[#name]
    #v(0.18em)
    #text(font: heading-font, size: 10.3pt, fill: palette.accent)[#title]
    #v(0.32em)
    #smallcaps(contacts)
  ]
]

#let section(title, body) = [
  == #title
  #body
]

#let role(company, location, title, years, bullets) = [
  #block(above: 0.72em, below: 0.42em)[
    #grid(
      columns: (1.35fr, 1fr),
      column-gutter: 1.1em,
      align: (left, right),
      [
        #text(font: heading-font, weight: "bold", size: 10pt, fill: palette.navy)[#company]
        #h(0.28em)
        #text(size: 8.8pt, fill: palette.slate)[#location]
      ],
      [
        #align(right)[
          #text(font: heading-font, style: "italic", size: 8.9pt)[#title]
          #h(0.28em)
          #text(font: heading-font, size: 8.8pt, fill: palette.slate)[#years]
        ]
      ],
    )
  ]
  #set list(marker: [#text(fill: palette.accent)[-]], spacing: 0.42em)
  #list(..bullets.map(b => [#b]))
  #v(0.18em)
]

#let compact-role(line) = [
  #block(above: 0.34em, below: 0.12em)[#line]
]

#let skill_grid(items) = grid(
  columns: (1fr, 1fr),
  column-gutter: 0.9em,
  row-gutter: 0.35em,
  ..items.map(item => block(
    inset: (x: 0.38em, y: 0.28em),
    radius: 5pt,
    fill: palette.soft,
    stroke: 0.6pt + palette.line,
    [#item],
  )),
)

#let public_project(name, desc) = [
  #block(above: 0.2em, below: 0.14em)[
    #text(font: heading-font, weight: "bold", size: 9.4pt, fill: palette.navy)[#name]
  ]
  #desc
]
