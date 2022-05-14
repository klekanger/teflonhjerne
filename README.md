# Teflonhjerne 

Et enkelt "memory game" laget i vanilla Javascript. Demo her: https://teflonhjerne.netlify.app/

Jeg har ikke brukt noen rammeverk eller biblioteker, men valgte å bruke Vite til å opprette prosjektet. I sin nåværende enkle form trengs det ikke, men Vite har en del nyttige funksjoner som kan være kjekt å ha hvis jeg skulle finne på å gjøre noe mer avansert i fremtiden. 

## Oppdatert 14.5.2022:

- Gjort det vanskeligere å jukse ved å lagre spillekortene i et gameState-objekt i stedet for i DOM-en. Skrevet ny logikk for å sjekke hvilke kort som er klikket, om kortene matcher, osv.
- Skrevet om til TypeScript
- Laget modal som vises når spillet er slutt
- Litt finpuss

## Mangler foreløpig:
- **Accessibility**: Det bør være mulig å bruke tastatur. Og så må selvfølgelig ikke bildene på hvert kort avsløres av evt. skjermlesere el.l. før kortet er snudd
- **Lyd**: Noen lydeffekter hadde gjort seg
- **Animasjon**: Spillet trenger kanskje noen morsomme animasjoner el.l. F.eks. på figurene på kortene, kanskje kortene kan "ramle" ned på skjermen ved oppstart, el.l.
- **Lagre state i localstorage el.l.**: Du mister fremgangen i spillet hvis du refresher. Kan unngås ved å lagre game state i localstorage el.l.
- **Highscore?** Lagre beste antall forsøk (beste mulige = 8)

