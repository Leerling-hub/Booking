import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { teardownDatabase } from "../../prisma/teardownDatabase.js";
import { seedDatabase } from "../../prisma/seed.js";

const prisma = new PrismaClient();

describe("Positive Properties Endpoints", () => {
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
   * Test voor het aanmaken van een nieuwe property.
   * Verwacht een 201 statuscode en controleert of de title correct is.
   */
  it("should create a new property", async () => {
    const propertyData = {
      title: "New Property",
      description: "A beautiful new property",
      location: "123 Main St, Anytown, USA",
      pricePerNight: 100,
      bedroomCount: 3,
      bathroomCount: 2,
      maxGuestCount: 6,
      rating: 4.5,
      hostId: "host-id-4",
    };

    const res = await request(app)
      .post("/properties")
      .set("Authorization", `Bearer ${token}`)
      .send(propertyData);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("title", "New Property");
  });

  /**
   * Test voor het ophalen van een enkele property op ID.
   * Verwacht een 200 statuscode en controleert of het ID correct is.
   */
  it("should get a single property by ID", async () => {
    const res = await request(app)
      .get("/properties/property-id-0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", "property-id-0");
  });

  /**
   * Test voor het bijwerken van een property.
   * Verwacht een 200 statuscode en controleert of de title correct is bijgewerkt.
   */
  it("should update a property", async () => {
    const propertyData = {
      title: "Updated Property",
      description: "Updated description",
      location: "123 Main St, Anytown, USA",
      pricePerNight: 150,
      bedroomCount: 4,
      bathroomCount: 3,
      maxGuestCount: 8,
      rating: 4.8,
      hostId: "host-id-4",
    };

    const res = await request(app)
      .put("/properties/property-id-0")
      .set("Authorization", `Bearer ${token}`)
      .send(propertyData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("title", "Updated Property");
  });

  /**
   * Test voor het verwijderen van een property.
   * Verwacht een 204 statuscode.
   */
  it("should delete a property", async () => {
    const res = await request(app)
      .delete("/properties/property-id-0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(204);
  });

  /**
   * Test voor het ophalen van alle properties met geldige query parameters.
   * Verwacht een 200 statuscode en controleert of het resultaat een array is.
   */
  it("should get all properties with valid query parameters", async () => {
    const res = await request(app)
      .get("/properties")
      .set("Authorization", `Bearer ${token}`)
      .query({ location: "Anytown" });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});
