import bcrypt from "bcrypt";

const password = "yourPlainPassword"; // Vervang dit door het wachtwoord dat je wilt hashen
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }

  console.log("Hashed password:", hash);
});
