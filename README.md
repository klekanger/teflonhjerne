# Teflonhjerne 

Et enkelt "memory game" laget i vanilla Javascript. Demo her: https://teflonhjerne.netlify.app/

Jeg har ikke brukt noen rammeverk eller biblioteker, men valgte å bruke Vite til å opprette prosjektet. I sin nåværende enkle form trengs det ikke, men Vite har en del nyttige funksjoner som kan være kjekt å ha hvis jeg skulle finne på å gjøre noe mer avansert i fremtiden. 

## Mangler foreløpig:
- **Accessibility**: Det bør være mulig å bruke tastatur. Og så må selvfølgelig ikke bildene på hvert kort avsløres av evt. skjermlesere el.l. før kortet er snudd
- **Styling**: Spillebrettet, spesielt tittel, scoreboard etc. bør gjøres litt penere. Kanskje en "Teflonhjerne"-logo. 
- **Responsiv design**: Spillet fungerer noenlunde ok på ulike skjermstørrelser, men dette bør testes litt grundigere. Trenger kanskje noen media queries og litt finpuss.
- **Modal**: Det bør lages en modal som vises når spillet er over. Havner over spillebrettet, viser hvor mange forsøk du trengte, spør om du vil prøve én gang til.
- **Lyd**: Noen lydeffekter hadde gjort seg
- **Animasjon**: Spillet trenger kanskje noen morsomme animasjoner el.l. F.eks. på figurene på kortene, kanskje kortene kan "ramle" ned på skjermen ved oppstart, el.l.
- **Lagre state i localstorage el.l.**: Du mister fremgangen i spillet hvis du refresher. Kan unngås ved å lagre game state i localstorage el.l.

