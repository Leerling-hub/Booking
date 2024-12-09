import express from "express";
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/auth.js";
import { requestLogger, logger } from "./middleware/logger.js";
import loginRoute from "./routes/login.js";
import userRoutes from "./routes/users.js";
import hostRoutes from "./routes/hosts.js";
import propertyRoutes from "./routes/properties.js";
import reviewRoutes from "./routes/reviews.js";
import bookingRoutes from "./routes/bookings.js";
import amenityRoutes from "./routes/amenities.js";

dotenv.config(); // Laad de .env variabelen

const app = express();
app.use(express.json()); // Gebruik express.json() in plaats van body-parser

// Gebruik de requestLogger middleware
app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/login", loginRoute); // Login route

// Beschermde routes
app.use("/users", authenticateToken, userRoutes);
app.use("/hosts", authenticateToken, hostRoutes);
app.use("/properties", authenticateToken, propertyRoutes);
app.use("/reviews", authenticateToken, reviewRoutes);
app.use("/bookings", authenticateToken, bookingRoutes);
app.use("/amenities", authenticateToken, amenityRoutes);

// Voeg een algemene error handler toe
app.use((err, req, res, next) => {
  logger.error(err.stack); // Log de fout met de logger
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

// Start de server alleen als het niet in een testomgeving draait en niet tijdens het resetten van de database
if (
  process.env.NODE_ENV !== "test" &&
  process.argv[1].indexOf("resetDatabase.js") === -1
) {
  const port = process.env.PORT || 3006; // Gebruik een andere poort, bijvoorbeeld 3006
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

export default app;
