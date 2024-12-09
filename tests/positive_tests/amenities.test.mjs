import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { teardownDatabase } from "../../prisma/teardownDatabase.js";
import { seedDatabase } from "../../prisma/seed.js";

const prisma = new PrismaClient();

describe("Positive Amenities Endpoints", () => {
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
   * Test voor het aanmaken van een nieuwe amenity.
   * Verwacht een 201 statuscode en controleert of de naam correct is.
   */
  it("should create a new amenity", async () => {
    const amenityData = {
      name: "WiFi",
      description: "High-speed wireless internet",
    };

    const res = await request(app)
      .post("/amenities")
      .set("Authorization", `Bearer ${token}`)
      .send(amenityData);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("name", "WiFi");
  });

  /**
   * Test voor het ophalen van een enkele amenity op ID.
   * Verwacht een 200 statuscode en controleert of het ID correct is.
   */
  it("should get a single amenity by ID", async () => {
    const res = await request(app)
      .get("/amenities/amenity-id-0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", "amenity-id-0");
  });

  /**
   * Test voor het bijwerken van een amenity.
   * Verwacht een 200 statuscode en controleert of de naam correct is bijgewerkt.
   */
  it("should update an amenity", async () => {
    const amenityData = {
      name: "Updated WiFi",
      description: "Updated high-speed wireless internet",
    };

    const res = await request(app)
      .put("/amenities/amenity-id-0")
      .set("Authorization", `Bearer ${token}`)
      .send(amenityData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("name", "Updated WiFi");
  });

  /**
   * Test voor het verwijderen van een amenity.
   * Verwacht een 204 statuscode.
   */
  it("should delete an amenity", async () => {
    const res = await request(app)
      .delete("/amenities/amenity-id-0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(204);
  });

  /**
   * Test voor het ophalen van alle amenities met geldige query parameters.
   * Verwacht een 200 statuscode en controleert of het resultaat een array is.
   */
  it("should get all amenities with valid query parameters", async () => {
    const res = await request(app)
      .get("/amenities")
      .set("Authorization", `Bearer ${token}`)
      .query({ name: "WiFi" });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});
