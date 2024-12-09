import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { teardownDatabase } from "../../prisma/teardownDatabase.js";
import { seedDatabase } from "../../prisma/seed.js";
import { logger } from "../../middleware/logger.js"; // Voeg de logger toe

const prisma = new PrismaClient();

describe("Negative Bookings Endpoints", () => {
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
   * Test voor het aanmaken van een booking zonder verplichte velden.
   * Verwacht een 422 statuscode en een foutmelding.
   */
  it("should return 422 if required fields are missing when creating a booking", async () => {
    const bookingData = {
      // checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus, userId, and propertyId are missing
    };

    logger.info("Testing missing fields for creating a booking");

    const res = await request(app)
      .post("/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send(bookingData);

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(422);
    expect(res.body.error).to.equal("All fields are required");
  });

  /**
   * Test voor het ophalen van een niet-bestaande booking.
   * Verwacht een 404 statuscode en een foutmelding.
   */
  it("should return 404 if the booking is not found when fetching", async () => {
    logger.info("Testing fetching a non-existent booking");

    const res = await request(app)
      .get("/bookings/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error", "Booking not found");
  });

  /**
   * Test voor het bijwerken van een niet-bestaande booking.
   * Verwacht een 404 statuscode en een foutmelding.
   */
  it("should return 404 if the booking is not found when updating", async () => {
    const bookingData = {
      checkinDate: "2024-12-01T00:00:00.000Z",
      checkoutDate: "2024-12-10T00:00:00.000Z",
      numberOfGuests: 2,
      totalPrice: 500,
      bookingStatus: "confirmed",
      userId: "user-id-1",
      propertyId: "property-id-1",
    };

    logger.info("Testing updating a non-existent booking");

    const res = await request(app)
      .put("/bookings/invalid-id")
      .set("Authorization", `Bearer ${token}`)
      .send(bookingData);

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error", "Booking not found");
  });

  /**
   * Test voor het verwijderen van een niet-bestaande booking.
   * Verwacht een 404 statuscode en een foutmelding.
   */
  it("should return 404 if the booking is not found when deleting", async () => {
    logger.info("Testing deleting a non-existent booking");

    const res = await request(app)
      .delete("/bookings/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error", "Booking not found");
  });

  /**
   * Test voor het ophalen van bookings met ongeldige query parameters.
   * Verwacht een 422 statuscode en een foutmelding.
   */
  it("should return 422 if query parameters are invalid when fetching bookings", async () => {
    logger.info("Testing invalid query parameters for fetching bookings");

    const res = await request(app)
      .get("/bookings")
      .set("Authorization", `Bearer ${token}`)
      .query({ invalidParam: "invalid" });

    logger.info(`Response status: ${res.status}`);
    logger.info(`Response body: ${JSON.stringify(res.body)}`);

    expect(res.status).to.equal(422);
    expect(res.body).to.have.property("error", "Invalid query parameters");
  });
});
