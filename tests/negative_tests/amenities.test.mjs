import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { teardownDatabase } from "../../prisma/teardownDatabase.js";
import { seedDatabase } from "../../prisma/seed.js";
import { logger } from "../../middleware/logger.js"; // Voeg de logger toe

const prisma = new PrismaClient();

describe("Negative Amenities Endpoints", () => {
  let server;
  let token;

  /**
   * Setup hook om de server te starten en een JWT-token te genereren.
   */
  before(async () => {
    const payload = { username: "user0" };
    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    await prisma.$connect();

    // Start de server op een dynamische poort
    server = app.listen(0, () => {
      const port = server.address().port;
      logger.info(`Test server running on port ${port}`);
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
   * Test voor het aanmaken van een amenity zonder verplichte velden.
   * Verwacht een 422 statuscode en een foutmelding.
   */
  it("should return 422 if required fields are missing when creating an amenity", async () => {
    const amenityData = {
      // name and description are missing
    };

    logger.info("Testing missing fields for creating an amenity");

    const res = await request(app)
      .post("/amenities")
      .set("Authorization", `Bearer ${token}`)
      .send(amenityData);

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(422);
    expect(res.body.error).to.equal("Name and description are required");
  });

  /**
   * Test voor het ophalen van een niet-bestaande amenity.
   * Verwacht een 404 statuscode en een foutmelding.
   */
  it("should return 404 if the amenity is not found when fetching", async () => {
    logger.info("Testing fetching a non-existent amenity");

    const res = await request(app)
      .get("/amenities/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error", "Amenity not found");
  });

  /**
   * Test voor het bijwerken van een niet-bestaande amenity.
   * Verwacht een 404 statuscode en een foutmelding.
   */
  it("should return 404 if the amenity is not found when updating", async () => {
    const amenityData = {
      name: "WiFi",
      description: "High-speed internet access",
    };

    logger.info("Testing updating a non-existent amenity");

    const res = await request(app)
      .put("/amenities/invalid-id")
      .set("Authorization", `Bearer ${token}`)
      .send(amenityData);

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error", "Amenity not found");
  });

  /**
   * Test voor het verwijderen van een niet-bestaande amenity.
   * Verwacht een 404 statuscode en een foutmelding.
   */
  it("should return 404 if the amenity is not found when deleting", async () => {
    logger.info("Testing deleting a non-existent amenity");

    const res = await request(app)
      .delete("/amenities/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error", "Amenity not found");
  });

  /**
   * Test voor het ophalen van amenities met ongeldige query parameters.
   * Verwacht een 422 statuscode en een foutmelding.
   */
  it("should return 422 if query parameters are invalid when fetching amenities", async () => {
    logger.info("Testing invalid query parameters for fetching amenities");

    const res = await request(app)
      .get("/amenities")
      .set("Authorization", `Bearer ${token}`)
      .query({ invalidParam: "invalid" });

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(422);
    expect(res.body).to.have.property("error", "Invalid query parameters");
  });
});
