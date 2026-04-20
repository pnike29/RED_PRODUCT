const API = "http://localhost:5000/api/auth";

// ✅ REGISTER
async function register() {
  try {
    const nom = document.getElementById("Nom").value;
    const email = document.getElementById("Email").value;
    const password = document.getElementById("Password").value;

    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nom, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ REGISTER OK : " + data.message);
      // 🔥 REDIRECTION ICI
      window.location.href = "index.html";
    } else {
      alert("❌ REGISTER ERROR : " + data.message);
    }
  } catch (error) {
    alert("❌ SERVER ERROR : " + error.message);
  }
}

// ✅ LOGIN
async function login() {
  try {
    const email = document.getElementById("logEmail").value;
    const password = document.getElementById("logPassword").value;

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ LOGIN OK : " + data.message);

      // 🔥 REDIRECTION ICI
      window.location.href = "dashboard.html";
    } else {
      alert("❌ LOGIN ERROR : " + data.message);
    }
  } catch (error) {
    alert("❌ SERVER ERROR : " + error.message);
  }
}
