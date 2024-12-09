import bcrypt from "bcrypt";

const hashedPassword =
  "$2b$10$9Wpr6aJU/bz09RyesPHb6eIXqGPiOmoKiuK0VyGb2LYmaY3zwyCVi"; // Vervang dit door je gehashte wachtwoord
const password = "myPlainPassword"; // Vervang dit door het wachtwoord dat je wilt verifiëren

bcrypt.compare(password, hashedPassword, (err, result) => {
  if (err) {
    console.error("Error comparing password:", err);
    return;
  }

  console.log("Password match:", result); // True als het wachtwoord overeenkomt, anders false
});
