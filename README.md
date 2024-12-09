# Bookings Project

Dit project bevat de startercode voor het Bookings project.

## Inhoudsopgave

- [Installatie]
- [Gebruik]
- [Environment Variables]
- [API Endpoints- [Login]
  - [Amenities]
  - [Users]
  - [Hosts]
  - [Properties]
  - [Bookings]
  - [Reviews]
- [Tests]
- [Projectstructuur]
- [Licentie]

## Installatie

Clone de repository en installeer de dependencies:

````sh
git clone <repository-url>
cd bookings-project
npm install

Gebruik
Start de application

npm run dev

Environment Variables
Maak een .env bestand in de root directory en voeg de volgende variabelen toe:

DATABASE_URL="file:./dev.db?connection_limit=1&timeout=30000"
JWT_SECRET=your_jwt_secret_here
TEST_TOKEN=your_test_token_here
PRISMA_CLIENT_ENGINE_TYPE=library

Je kunt ook het voorbeeld .env bestand gebruiken als referentie:

cp .env.example .env

Vul vervolgens de vereiste waarden in het `.env` bestand in.

### Uitleg van Environment Variables
- **DATABASE_URL**: De URL van de SQLite database die door de applicatie wordt gebruikt.
- **JWT_SECRET**: De geheime sleutel

 die

 wordt gebruikt voor het genereren van JWT-tokens.
- **TEST_TOKEN**: Een testtoken dat wordt gebruikt voor authenticatie tijdens het testen.
- **PRISMA_CLIENT_ENGINE_TYPE**: De Prisma client engine type instelling.

### Genereren van een Geheime Sleutel
Gebruik het script `generateSecretKey.js` om een geheime sleutel te genereren:

node [generateToken.js](http://_vscodecontentref_/7)

Dit zal een geheime sleutel genereren en naar de console loggen. Kopieer deze sleutel en plak deze in je `.env` bestand als de waarde voor `JWT_SECRET`.

### Genereren van een JWT-token
Gebruik het script `generateToken.js` om een JWT-token te genereren:

node [generateToken.js](http://_vscodecontentref_/7)

Dit zal een JWT-token genereren en naar de console loggen. Kopieer deze token en plak deze in je `.env` bestand als de waarde voor `TEST_TOKEN`.

### Opschonen van de Database
Voordat je nieuwe gegevens invoert in de Prisma studio database, kun je de database opschonen met het script `clearDatabase.js`. Dit script verwijdert alle records uit de tabellen: review, amenity, booking, property, host en user.
Houd rekening met de volgorden hoe je de gegevens invoerd in de modellen door de vele relaties die ze met elkaar hebben begin met de users,hosts,properties,bookings,reviews,amenities.

Gebruik het volgende commando om de database op te schonen:

node [clearDatabase.js](http://_vscodecontentref_/3)

Dit zal alle testdata uit de database verwijderen en ervoor zorgen dat je met een schone database begint.



## API Endpoints

### Login

**POST /login**

Authenticeer een gebruiker en retourneer een JWT-token.

Request:

{
  "username": "user0",
  "password": "password123"
}

Response:

{
  "token": "your_jwt_token_here"
}


### Amenities

**GET /amenities**

Haal een lijst van amenities op.

**POST /amenities**

Maak een nieuwe amenity aan.

**GET /amenities/:id**

Haal een enkele amenity op ID op.

**PUT /amenities/:id**

Werk een amenity bij op ID.

**DELETE /amenities/:id**

Verwijder een amenity op ID.

### Users

**GET /users**

Haal een lijst van users op.

**POST /users**

Maak een nieuwe user aan.

**GET /users/:id**

Haal een enkele user op ID op.

**PUT /users/:id**

Werk een user bij op ID.

**DELETE /users/:id**

Verwijder een user op ID.

### Hosts

**GET /hosts**

Haal een lijst van hosts op.

**POST /hosts**

Maak een nieuwe host aan.

**GET /hosts/:id**

Haal een enkele host op ID op.

**PUT /hosts/:id**

Werk een host bij op ID.

**DELETE /hosts/:id**

Verwijder een host op ID.

### Properties

**GET /properties**

Haal een lijst van properties op.

**POST /properties**

Maak een nieuwe property aan.

**GET /properties/:id**

Haal een enkele property op ID op.

**PUT /properties/:id**

Werk een property bij op ID.

**DELETE /properties/:id**

Verwijder een property op ID.

### Bookings

**GET /bookings**

Haal een lijst van bookings op.

**POST /bookings**

Maak een nieuwe booking aan.

**GET /bookings/:id**

Haal een enkele booking op ID op.

**PUT /bookings/:id**

Werk een booking bij op ID.

**DELETE /bookings/:id**

Verwijder een booking op ID.

### Reviews

**GET /reviews**

Haal een lijst van reviews op.

**POST /reviews**

Maak een nieuwe review aan.

**GET /reviews/:id**

Haal een enkele review op ID op.

**PUT /reviews/:id**

Werk een review bij op ID.

**DELETE /reviews/:id**

Verwijder een review op ID.

## Tests

Tests zijn gemaakt met Newman, een command-line tool die de uitvoering van Postman-tests kan automatiseren.

Start de server en voer de tests uit:

```sh
npm run test:api

newman run postman/collections/REST API - CRUD.postman_collection.json -e postman/environments/Local.postman_environment.json

### Bijwerken van de Postman Environment

Als de JWT-token verloopt, moet je deze bijwerken in de Postman environment. Volg deze stappen:

### Verkrijgen van een Nieuwe JWT-token

Je kunt een nieuwe JWT-token verkrijgen door een POST-verzoek naar de `/login` endpoint te sturen. Dit kan zowel via Postman als via de terminal.

#### Via Postman

1. Open Postman.
2. Maak een nieuw POST-verzoek aan.
3. Stel de URL in op `{{baseUrl}}/login`.
4. Voeg de volgende JSON-inhoud toe aan de body van het verzoek:
   ```json
   {
     "username": "user0",
     "password": "password123"
   }

5. Klik op "Send".
6. De respons bevat de JWT-token.
7. Sla het op in environment in postman exporteer het naar je project postman environmets

#### Via de Terminal met `curl`

curl -X POST http://localhost:3006/login -H "Content-Type: application/json" -d '{"username": "user0", "password": "password123"}'

De respons bevat de JWT-token.

#### Via de Terminal met `httpie`

http POST http://localhost:3006/login username=user0 password=password123

De respons bevat de JWT-token.

8. **Open de Postman Environment**:
   - Ga naar de `Local` environment in Postman.

9. **Update de JWT-token**:
   - Vervang de waarde van de `JWT_TOKEN` key met de nieuwe token.

10. **Sla de wijzigingen op**:
   - Klik op "Save" om de wijzigingen op te slaan.
11. **Importeer het Bijgewerkte Environment Bestand in Postman**:
   - Open Postman.
   - Ga naar de "Environments" sectie.
   - Klik op "Import" en selecteer het bijgewerkte environment bestand.
   - Dit zal de bestaande environment bijwerken met de nieuwe token.


Uitvoeren  van de Mocha Tests

Je kunt ook de Mocha tests uitvoeren met de volgende commando's:

Alle Tests

NPM EN Positieve en Negatieve Tests

Voer alle npm en positieve en negatieve tests uit met de volgende commando's. Voor deze tests is het niet nodig om de server te starten en de database word automatisch schoongemaakt en met data gegevens geseed.


npm test

npm run test:positive:full

npm run test:negative:full

### Wat Testen de NPM en Positieve en Negatieve Tests?

- **NPM Tests**: Testen of de API correct werkt met geldige invoer en hoe de API omgaat met ongeldige invoer en foutscenario's.
- **Positieve Tests**: Testen of de API correct werkt met geldige invoer.
- **Negatieve Tests**: Testen hoe de API omgaat met ongeldige invoer en foutscenario's.

### Database Opschonen

De database wordt automatisch opgeschoond voordat de tests worden uitgevoerd. Dit gebeurt door het `test:setup` script dat wordt uitgevoerd als onderdeel van de `test:positive:full` en `test:negative:full` scripts.

## Projectstructuur

Hier is een overzicht van de projectstructuur:

bookings-project/
├── .postman/
├── logs/
├── middleware/
├── node_modules/
├── postman/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   ├── seed.js
│   ├── teardownDatabase.js
├── routes/
│   ├── amenities.js
│   ├── login.js
├── src/
├── tests/
│   ├── amenities.test.mjs
│   ├── bookings.test.mjs
│   ├── hosts.test.mjs
│   ├── login.test.mjs
│   ├── properties.test.mjs
│   ├── reviews.test.mjs
│   ├── users.test.mjs
├── .env
├── .gitignore
├── [application.log](http://_vscodecontentref_/4)
├── [bcrypt.js](http://_vscodecontentref_/5)
├── [clearDatabase.js](http://_vscodecontentref_/6)
├── [combined.log](http://_vscodecontentref_/7)
├── [dev.db](http://_vscodecontentref_/8)
├── [generateSecretKey.js](http://_vscodecontentref_/9)
├── [generateToken.js](http://_vscodecontentref_/10)
├── [getDatabaseOverview.js](http://_vscodecontentref_/11)
├── [index.js](http://_vscodecontentref_/12)
├── [openapi.yaml](http://_vscodecontentref_/13)
├── [package.json](http://_vscodecontentref_/14)
├── [package-lock.json](http://_vscodecontentref_/15)
├── [README.md](http://_vscodecontentref_/16)
├── [resetDatabase.js](http://_vscodecontentref_/17)
├── [verify_password.js](http://_vscodecontentref_/18)


Dit project is gelicentieerd onder de MIT-licentie.Zie het LICENTIE bestand voor meer informatie

## Servers en Scripts

De beschikbare servers en scripts zijn te vinden in het `package.json` bestand. Hier zijn enkele belangrijke scripts:

- **Start de applicatie**: `npm run dev`
- **Uitvoeren van alle tests**: `npm test`

Bekijk het `package.json` bestand voor een volledige lijst van beschikbare scripts.

````
