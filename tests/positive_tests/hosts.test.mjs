import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // Voeg bcrypt import toe
import { PrismaClient } from "@prisma/client";
import { teardownDatabase } from "../../prisma/teardownDatabase.js";
import { seedDatabase } from "../../prisma/seed.js";

const prisma = new PrismaClient();

describe("Positive Hosts Endpoints", () => {
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
  it("should create a new host", async () => {
    const hostData = {
      username: "newhost",
      password: "password123",
      name: "New Host",
      email: "newhost@example.com",
      phoneNumber: "1234567890",
      profilePicture: "newhost.jpg",
      aboutMe: "About New Host",
      userId: "user-id-1",
    };

    const res = await request(app)
      .post("/hosts")
      .set("Authorization", `Bearer ${token}`)
      .send(hostData);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("username", "newhost");
  });

  /**
   * Test voor het ophalen van een enkele booking op ID.
   * Verwacht een 200 statuscode en controleert of het ID correct is.
   */
  it("should get a single host by ID", async () => {
    const res = await request(app)
      .get("/hosts/host-id-0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", "host-id-0");
  });

  /**
   * Test voor het bijwerken van een booking.
   * Verwacht een 200 statuscode en controleert of de bookingStatus correct is bijgewerkt.
   */
  it("should update a host", async () => {
    const hostData = {
      username: "updatedhost",
      password: "newpassword123",
      name: "Updated Host",
      email: "updatedhost@example.com",
      phoneNumber: "987-654-3210",
      profilePicture: "updatedhost.jpg",
      aboutMe: "Updated About Me",
    };

    const res = await request(app)
      .put("/hosts/host-id-0")
      .set("Authorization", `Bearer ${token}`)
      .send(hostData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("username", "updatedhost");
  });

  /**
   * Test voor het verwijderen van een booking.
   * Verwacht een 204 statuscode.
   */
  it("should delete a host", async () => {
    const res = await request(app)
      .delete("/hosts/host-id-0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(204);
  });

  /**
   * Test voor het ophalen van alle bookings met geldige query parameters.
   * Verwacht een 200 statuscode en controleert of het resultaat een array is.
   */
  it("should get all hosts with valid query parameters", async () => {
    const res = await request(app)
      .get("/hosts")
      .set("Authorization", `Bearer ${token}`)
      .query({ name: "Host" });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});
