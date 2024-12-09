import request from "supertest";
import { expect } from "chai";
import app from "../../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // Voeg bcrypt import toe
import { PrismaClient } from "@prisma/client";
import { teardownDatabase } from "../../prisma/teardownDatabase.js";
import { seedDatabase } from "../../prisma/seed.js";

const prisma = new PrismaClient();

describe("Positive Users Endpoints", () => {
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
   * Test voor het aanmaken van een nieuwe user.
   * Verwacht een 201 statuscode en controleert of de username correct is.
   */
  it("should create a new user", async () => {
    const userData = {
      username: "newuser",
      password: "password123",
      name: "New User",
      email: "newuser@example.com",
      phoneNumber: "1234567890",
      profilePicture: "newuser.jpg",
    };

    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send(userData);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("username", "newuser");
  });

  /**
   * Test voor het ophalen van een enkele user op ID.
   * Verwacht een 200 statuscode en controleert of het ID correct is.
   */
  it("should get a single user by ID", async () => {
    const res = await request(app)
      .get("/users/user-id-0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", "user-id-0");
  });

  /**
   * Test voor het bijwerken van een user.
   * Verwacht een 200 statuscode en controleert of de username correct is bijgewerkt.
   */
  it("should update a user", async () => {
    const userData = {
      username: "updateduser",
      password: "newpassword123",
      name: "Updated User",
      email: "updateduser@example.com",
      phoneNumber: "987-654-3210",
      profilePicture: "updateduser.jpg",
    };

    const res = await request(app)
      .put("/users/user-id-0")
      .set("Authorization", `Bearer ${token}`)
      .send(userData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("username", "updateduser");
  });

  /**
   * Test voor het verwijderen van een user.
   * Verwacht een 204 statuscode.
   */
  it("should delete a user", async () => {
    const res = await request(app)
      .delete("/users/user-id-0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(204);
  });

  /**
   * Test voor het ophalen van alle users met geldige query parameters.
   * Verwacht een 200 statuscode en controleert of het resultaat een array is.
   */
  it("should get all users with valid query parameters", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .query({ username: "user" });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});
