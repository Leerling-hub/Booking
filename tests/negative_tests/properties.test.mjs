import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { teardownDatabase } from "../../prisma/teardownDatabase.js";
import { seedDatabase } from "../../prisma/seed.js";
import { logger } from "../../middleware/logger.js"; // Voeg de logger toe

const prisma = new PrismaClient();

describe("Negative Properties Endpoints", () => {
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
   * Test voor het aanmaken van een property zonder verplichte velden.
   * Verwacht een 422 statuscode en een foutmelding.
   */
  it("should return 422 if required fields are missing when creating a property", async () => {
    const propertyData = {
      // title, description, location, pricePerNight, bedroomCount, bathroomCount, maxGuestCount, and rating are missing
    };

    logger.info("Testing missing fields for creating a property");

    const res = await request(app)
      .post("/properties")
      .set("Authorization", `Bearer ${token}`)
      .send(propertyData);

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(422);
    expect(res.body.error).to.equal("All fields are required");
  });

  /**
   * Test voor het ophalen van een niet-bestaande property.
   * Verwacht een 404 statuscode en een foutmelding.
   */
  it("should return 404 if the property is not found when fetching", async () => {
    logger.info("Testing fetching a non-existent property");

    const res = await request(app)
      .get("/properties/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error", "Property not found");
  });

  /**
   * Test voor het bijwerken van een niet-bestaande property.
   * Verwacht een 404 statuscode en een foutmelding.
   */
  it("should return 404 if the property is not found when updating", async () => {
    const propertyData = {
      title: "Updated Property",
      description: "Updated description",
      location: "Updated location",
      pricePerNight: 100,
      bedroomCount: 2,
      bathroomCount: 1,
      maxGuestCount: 4,
      rating: 4.5,
    };

    logger.info("Testing updating a non-existent property");

    const res = await request(app)
      .put("/properties/invalid-id")
      .set("Authorization", `Bearer ${token}`)
      .send(propertyData);

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error", "Property not found");
  });

  /**
   * Test voor het verwijderen van een niet-bestaande property.
   * Verwacht een 404 statuscode en een foutmelding.
   */
  it("should return 404 if the property is not found when deleting", async () => {
    logger.info("Testing deleting a non-existent property");

    const res = await request(app)
      .delete("/properties/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error", "Property not found");
  });

  /**
   * Test voor het ophalen van properties met ongeldige query parameters.
   * Verwacht een 422 statuscode en een foutmelding.
   */
  it("should return 422 if query parameters are invalid when fetching properties", async () => {
    logger.info("Testing invalid query parameters for fetching properties");

    const res = await request(app)
      .get("/properties")
      .set("Authorization", `Bearer ${token}`)
      .query({ invalidParam: "invalid" });

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(422);
    expect(res.body).to.have.property("error", "Invalid query parameters");
  });
});
