import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import { PrismaClient } from "@prisma/client";
import { teardownDatabase } from "../../prisma/teardownDatabase.js";
import { seedDatabase } from "../../prisma/seed.js";

const prisma = new PrismaClient();

describe("Positive Login Endpoints", () => {
  let server;

  /**
   * Setup hook om de server te starten.
   */
  before(async () => {
    await prisma.$connect();

    // Start de server op een dynamische poort
    server = app.listen(0, () => {
      const port = server.address().port;
      console.log(`Test server running on port ${port}`);
    });
  });

  /**
   * Hook die wordt uitgevoerd voor elke test.
   * Verhoogt de timeout, ruimt de database op en vult deze met testdata.
   */
  beforeEach(async function () {
    this.timeout(60000); // Verhoog de timeout voor de beforeEach hook
    await teardownDatabase(); // Ruim de database op voordat elke test wordt uitgevoerd
    await seedDatabase(); // Vul de database met testdata
  });

  /**
   * Hook die wordt uitgevoerd na elke test.
   * Ruimt de database op.
   */
  afterEach(async () => {
    await teardownDatabase(); // Ruim de database op na elke test
  });

  /**
   * Hook die wordt uitgevoerd na alle tests.
   * Sluit de Prisma client verbinding en stopt de server.
   */
  after(async () => {
    await prisma.$disconnect();
    server.close();
  });

  /**
   * Test voor het inloggen met geldige inloggegevens.
   * Verwacht een 200 statuscode en een token in het antwoord.
   */
  it("should return 200 and a token if valid credentials are provided", async () => {
    const loginData = {
      username: "user0",
      password: "password123",
    };

    const res = await request(app).post("/login").send(loginData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
  });
});
