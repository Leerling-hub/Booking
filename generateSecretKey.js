import crypto from "crypto";

/**
 * Genereert een geheime sleutel.
 *
 * Deze functie genereert een willekeurige geheime sleutel van 32 bytes en converteert deze naar een hexadecimale string.
 * De gegenereerde sleutel wordt vervolgens naar de console gelogd.
 */

// Genereer een geheime sleutel van 32 bytes en converteer deze naar een hexadecimale string
const secretKey = crypto.randomBytes(32).toString("hex");

// Log de gegenereerde geheime sleutel naar de console
console.log(secretKey);
