const API = "https://hotels-backend-ogro.onrender.com/api/auth";

// REGISTER
async function register() {
  try {
    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!nom || !email || !password) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("email", email);
    formData.append("password", password);

    const res = await fetch(`${API}/register`, {
      method: "POST",
      body: formData, // ← pas de Content-Type, FormData le gère
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Compte créé");
      window.location.href = "index.html";
    } else {
      alert("❌ " + (data.message || data.error));
    }
  } catch (error) {
    alert("❌ SERVER ERROR : " + error.message);
  }
}

// LOGIN
async function login() {
  try {
    const email = document.getElementById("logEmail").value;
    const password = document.getElementById("logPassword").value;

    if (!email || !password) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "dashboard.html";
    } else {
      alert("❌ LOGIN ERROR : " + data.message);
    }
  } catch (error) {
    alert("❌ SERVER ERROR : " + error.message);
  }
}
