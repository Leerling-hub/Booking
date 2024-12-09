import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { teardownDatabase } from "../../prisma/teardownDatabase.js";
import { seedDatabase } from "../../prisma/seed.js";

const prisma = new PrismaClient();

describe("Positive Reviews Endpoints", () => {
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
   * Test voor het aanmaken van een nieuwe review.
   * Verwacht een 201 statuscode en controleert of de rating correct is.
   */
  it("should create a new review", async () => {
    const reviewData = {
      rating: 5,
      comment: "Great property!",
      userId: "user-id-1",
      propertyId: "property-id-2",
    };

    const res = await request(app)
      .post("/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send(reviewData);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("rating", 5);
  });

  /**
   * Test voor het ophalen van een enkele review op ID.
   * Verwacht een 200 statuscode en controleert of het ID correct is.
   */
  it("should get a single review by ID", async () => {
    const res = await request(app)
      .get("/reviews/review-id-0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", "review-id-0");
  });

  /**
   * Test voor het bijwerken van een review.
   * Verwacht een 200 statuscode en controleert of de rating correct is bijgewerkt.
   */
  it("should update a review", async () => {
    const reviewData = {
      rating: 4,
      comment: "Updated comment",
      userId: "user-id-2", // Gebruik een andere userId
      propertyId: "property-id-3", // Gebruik een andere propertyId
    };

    const res = await request(app)
      .put("/reviews/review-id-0")
      .set("Authorization", `Bearer ${token}`)
      .send(reviewData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("rating", 4);
  });

  /**
   * Test voor het verwijderen van een review.
   * Verwacht een 204 statuscode.
   */
  it("should delete a review", async () => {
    const res = await request(app)
      .delete("/reviews/review-id-0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(204);
  });

  /**
   * Test voor het ophalen van alle reviews met geldige query parameters.
   * Verwacht een 200 statuscode en controleert of het resultaat een array is.
   */
  it("should get all reviews with valid query parameters", async () => {
    const res = await request(app)
      .get("/reviews")
      .set("Authorization", `Bearer ${token}`)
      .query({ rating: 5 });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});
