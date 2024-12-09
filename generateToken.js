import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Zorg ervoor dat je dotenv hebt geïnstalleerd en geïmporteerd

export default function generateToken(username) {
  const payload = { username }; // Gebruik de username variabele in de payload
  const secret = process.env.JWT_SECRET; // Haal de geheime sleutel uit je .env bestand
  const options = { expiresIn: "8d" }; // Token vervalt na 8 dagen

  const token = jwt.sign(payload, secret, options);
  return token;
}

// Voorbeeldgebruik
const username = "user0"; // Gebruik een bestaande username uit je database
const token = generateToken(username);
console.log("Generated JWT:", token);
