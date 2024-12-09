import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { teardownDatabase } from "../../prisma/teardownDatabase.js";
import { seedDatabase } from "../../prisma/seed.js";

const prisma = new PrismaClient();

describe("Positive Bookings Endpoints", () => {
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
   * Test voor het aanmaken van een nieuwe booking.
   * Verwacht een 201 statuscode en controleert of de bookingStatus correct is.
   */
  it("should create a new booking", async () => {
    const bookingData = {
      checkinDate: "2024-12-01T00:00:00.000Z",
      checkoutDate: "2024-12-10T00:00:00.000Z",
      numberOfGuests: 2,
      totalPrice: 1000,
      bookingStatus: "confirmed",
      userId: "user-id-1",
      propertyId: "property-id-1",
    };

    const res = await request(app)
      .post("/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send(bookingData);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("bookingStatus", "confirmed");
  });

  /**
   * Test voor het ophalen van een enkele booking op ID.
   * Verwacht een 200 statuscode en controleert of het ID correct is.
   */
  it("should get a single booking by ID", async () => {
    const res = await request(app)
      .get("/bookings/booking-id-0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", "booking-id-0");
  });

  /**
   * Test voor het bijwerken van een booking.
   * Verwacht een 200 statuscode en controleert of de bookingStatus correct is bijgewerkt.
   */
  it("should update a booking", async () => {
    const bookingData = {
      checkinDate: "2024-12-01T00:00:00.000Z",
      checkoutDate: "2024-12-10T00:00:00.000Z",
      numberOfGuests: 3,
      totalPrice: 1500,
      bookingStatus: "updated",
      userId: "user-id-1",
      propertyId: "property-id-1",
    };

    const res = await request(app)
      .put("/bookings/booking-id-0")
      .set("Authorization", `Bearer ${token}`)
      .send(bookingData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("bookingStatus", "updated");
  });

  /**
   * Test voor het verwijderen van een booking.
   * Verwacht een 204 statuscode.
   */
  it("should delete a booking", async () => {
    const res = await request(app)
      .delete("/bookings/booking-id-0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(204);
  });

  /**
   * Test voor het ophalen van alle bookings met geldige query parameters.
   * Verwacht een 200 statuscode en controleert of het resultaat een array is.
   */
  it("should get all bookings with valid query parameters", async () => {
    const res = await request(app)
      .get("/bookings")
      .set("Authorization", `Bearer ${token}`)
      .query({ bookingStatus: "confirmed" });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});
