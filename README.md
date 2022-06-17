# Teflonhjerne 

Et enkelt "memory game" laget i vanilla Javascript. Demo her: https://teflonhjerne.netlify.app/

Jeg har ikke brukt noen rammeverk eller biblioteker, men valgte å bruke [Vite](https://vitejs.dev/) som "build tool".

## Oppdatert 17.6.2022:
- Skrevet om litt: Preloader nå alle ikoner/bilder for hvert spillekort for å unngå "lag" som av og til kan skje. 
- Ørlite refaktorering og litt TypeScript-fiksing


## Oppdatert 11.6.2022:
- Lagt til massevis av nye ikoner. Spilleren får 8 tilfeldige ikoner/spillekort
- Lagt til tastaturnavigasjon. Bruk piltaster og space/enter for å spille
- Lagt til lydeffekter og en mute-knapp
- Fikset litt på styling etc. 

## Oppdatert 14.5.2022:

- Gjort det vanskeligere å jukse ved å lagre spillekortene i et gameState-objekt i stedet for i DOM-en. Skrevet ny logikk for å sjekke hvilke kort som er klikket, om kortene matcher, osv.
- Skrevet om til TypeScript
- Laget modal som vises når spillet er slutt
- Litt finpuss

