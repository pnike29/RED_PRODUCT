const API = "https://hotels-backend-ogro.onrender.com/api";

let allHotels = [];
let editingHotelId = null;
let currentHotelId = null;
let count = 0;

// IMAGE URL HELPER
function imageUrl(path) {
  if (!path) return "img/logo.png";
  if (path.startsWith("http")) return path;
  return "https://hotels-backend-ogro.onrender.com/" + path;
}

// TOAST
function showToast(message, color = "bg-green-500") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `fixed bottom-5 right-5 ${color} text-white px-5 py-3 rounded-lg shadow-lg transition opacity-100`;
  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 2000);
}

// NOTIFICATIONS
function addNotif() {
  ouvrirNotifications();
}

async function ouvrirNotifications() {
  document.getElementById("notifModal").classList.remove("hidden");
  const token = localStorage.getItem("token");
  let total = 0;

  try {
    const res = await fetch(`${API}/hotels`);
    const hotels = await res.json();
    const derniers = hotels.slice(-5).reverse();
    total += derniers.length;
    const container = document.getElementById("notifHotels");
    container.innerHTML =
      derniers.length === 0
        ? "<p class='text-xs text-gray-400'>Aucun hôtel</p>"
        : derniers
            .map(
              (h) => `
          <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
            <img src="${imageUrl(h.image)}" class="w-10 h-10 rounded-lg object-cover" onerror="this.src='img/logo.png'" />
            <div>
              <p class="text-sm font-bold">${h.name}</p>
              <p class="text-xs text-gray-400">${h.location} — ${h.price} CFA</p>
            </div>
          </div>`,
            )
            .join("");
  } catch (e) {
    console.error(e);
  }

  try {
    const res = await fetch(`${API}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const users = await res.json();
    total += users.length;
    const container = document.getElementById("notifUsers");
    container.innerHTML =
      users.length === 0
        ? "<p class='text-xs text-gray-400'>Aucun utilisateur</p>"
        : users
            .map(
              (u) => `
          <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
            <img src="${imageUrl(u.photo)}" class="w-10 h-10 rounded-full object-cover" onerror="this.src='img/logo.png'" />
            <div>
              <p class="text-sm font-bold">${u.nom}</p>
              <p class="text-xs text-gray-400">${u.email}</p>
            </div>
          </div>`,
            )
            .join("");
  } catch (e) {
    console.error(e);
  }

  document.getElementById("badge").textContent = total;
}

// NAVIGATION
function button(num) {
  const cont1 = document.getElementById("cont1");
  const cont2 = document.getElementById("cont2");
  const metre = document.getElementById("choix");
  if (num === 1) {
    cont1.classList.remove("hidden");
    cont2.classList.add("hidden");
    metre.innerHTML =
      "<h1 class='font-bold text-[12px] sm:text-2xl'>Dashboard</h1>";
  } else {
    cont1.classList.add("hidden");
    cont2.classList.remove("hidden");
    metre.innerHTML =
      "<h1 class='font-bold text-[12px] sm:text-2xl'>Liste des hotels</h1>";
    afficherHotels();
  }
}

// AFFICHER UTILISATEUR
function afficherUtilisateur() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  let user = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw && raw !== "undefined") user = JSON.parse(raw);
  } catch (e) {
    console.warn("user invalide dans localStorage");
  }

  try {
    if (user) {
      document.getElementById("sidebarName").textContent = user.nom;
      document.getElementById("headerName").textContent =
        "Bienvenue, " + user.nom + " ";

      setTimeout(() => {
        document.getElementById("headerName").textContent = "";
      }, 2000); // disparaît après 3 secondes
      document.getElementById("userPhoto").src = imageUrl(user.photo);
      document.getElementById("sidebarPhoto").src = imageUrl(user.photo);
      document.getElementById("status").textContent = "En ligne";
    } else {
      const payload = JSON.parse(atob(token.split(".")[1]));
      document.getElementById("sidebarName").textContent = payload.nom;
      document.getElementById("headerName").textContent =
        "Bienvenue, " + payload.nom + " ";

      setTimeout(() => {
        document.getElementById("headerName").textContent = "";
      }, 2000); // disparaît après 3 secondes
      document.getElementById("userPhoto").src = "img/logo.png";
      document.getElementById("sidebarPhoto").src = "img/logo.png";
      document.getElementById("status").textContent = "En ligne";
    }
  } catch (e) {
    console.error("Token corrompu:", e);
    window.location.href = "index.html";
  }
}

// AFFICHER HOTELS
async function afficherHotels() {
  try {
    const res = await fetch(`${API}/hotels`);
    const hotels = await res.json();
    console.log("Hotels reçus:", hotels.length);
    allHotels = hotels;
    afficherListe(hotels);
    document.getElementById("hotelCount").textContent = hotels.length;
  } catch (error) {
    console.error("Erreur afficherHotels:", error);
  }
}

// AFFICHER LISTE
function afficherListe(hotels) {
  const container = document.getElementById("listeHotels");
  container.innerHTML = "";
  if (hotels.length === 0) {
    container.innerHTML =
      "<p class='text-gray-400 col-span-4 text-center'>Aucun hôtel trouvé</p>";
    return;
  }
  hotels.forEach((hotel) => {
    const card = document.createElement("div");
    card.className =
      "bg-white shadow-md rounded-xl overflow-hidden w-[250px] cursor-pointer hover:shadow-lg transition";
    card.innerHTML = `
      <img src="${imageUrl(hotel.image)}" class="w-full h-[150px] object-cover" onerror="this.src='img/logo.png'" />
      <div class="p-3">
        <h2 class="text-red-500 text-[11px] font-bold">${hotel.name}</h2>
        <p class="font-bold text-sm">${hotel.location}</p>
        <p class="text-[13px]">${hotel.price || 0} ${hotel.devise?.toUpperCase() || "CFA"}</p>
      </div>`;
    card.addEventListener("click", () => ouvrirDetailHotel(hotel._id));
    container.appendChild(card);
  });
}

// OUVRIR MODAL DETAIL
function ouvrirDetailHotel(id) {
  const hotel = allHotels.find((h) => h._id === id);
  if (!hotel) return;
  currentHotelId = id;
  document.getElementById("detailImage").src = imageUrl(hotel.image);
  document.getElementById("detailNom").textContent = hotel.name;
  document.getElementById("detailAdresse").textContent = hotel.location;
  document.getElementById("detailPrix").textContent =
    (hotel.price || 0) + " " + (hotel.devise?.toUpperCase() || "CFA");
  document.getElementById("detailEmail").textContent = hotel.email || "—";
  document.getElementById("detailTel").textContent = hotel.telephone || "—";
  document.getElementById("detailDevise").textContent =
    hotel.devise?.toUpperCase() || "CFA";
  document.getElementById("hotelDetailModal").classList.remove("hidden");
}

// SUPPRIMER HOTEL
async function supprimerHotel(id) {
  if (!confirm("Voulez-vous vraiment supprimer cet hôtel ?")) return;
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API}/hotels/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      showToast("Hôtel supprimé ", "bg-red-500");
      afficherHotels();
    }
  } catch (error) {
    console.error(error);
  }
}

// STATS DYNAMIQUES
async function afficherStats() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API}/hotels`);
    const hotels = await res.json();
    document.getElementById("statHotels").textContent = hotels.length;
    const today = new Date().toDateString();
    const entresAujourdhui = hotels.filter(
      (h) => new Date(h.createdAt).toDateString() === today,
    ).length;
    document.getElementById("statEntrees").textContent = entresAujourdhui;
  } catch (e) {
    console.error(e);
  }

  try {
    const res = await fetch(`${API}/auth/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    document.getElementById("statUsers").textContent = data.count;
  } catch (e) {
    console.error(e);
  }
}

// AU CHARGEMENT
document.addEventListener("DOMContentLoaded", () => {
  button(1);
  afficherUtilisateur();
  afficherStats();

  // MODAL HOTEL
  const modal = document.getElementById("modal");
  const fermerModal = document.getElementById("fermerModal");
  const modalContent = document.getElementById("modalContent");

  modal.addEventListener("click", () => {
    editingHotelId = null;
    document.getElementById("formHotel").reset();
    document.getElementById("erreur").textContent = "";
    document.querySelector("#formHotel button[type='submit']").textContent =
      "Enregistrer";
    modalContent.classList.remove("hidden");
  });
  fermerModal.addEventListener("click", () =>
    modalContent.classList.add("hidden"),
  );

  // MODAL DETAIL
  const hotelDetailModal = document.getElementById("hotelDetailModal");
  document
    .getElementById("fermerDetailModal")
    .addEventListener("click", () => hotelDetailModal.classList.add("hidden"));
  hotelDetailModal.addEventListener("click", (e) => {
    if (e.target === hotelDetailModal) hotelDetailModal.classList.add("hidden");
  });

  document.getElementById("btnModifierDetail").addEventListener("click", () => {
    hotelDetailModal.classList.add("hidden");
    const hotel = allHotels.find((h) => h._id === currentHotelId);
    if (!hotel) return;
    editingHotelId = hotel._id;
    document.getElementById("nom").value = hotel.name;
    document.getElementById("adresse").value = hotel.location;
    document.getElementById("prix").value = hotel.price;
    document.getElementById("email").value = hotel.email || "";
    document.getElementById("numero").value = hotel.telephone || "";
    document.getElementById("devise").value = hotel.devise || "cfa";
    document.getElementById("erreur").textContent = "";
    document.querySelector("#formHotel button[type='submit']").textContent =
      "Modifier";
    modalContent.classList.remove("hidden");
  });

  document
    .getElementById("btnSupprimerDetail")
    .addEventListener("click", () => {
      supprimerHotel(currentHotelId);
      hotelDetailModal.classList.add("hidden");
    });

  // SIDEBAR MOBILE
  document
    .getElementById("toogleModal")
    .addEventListener("click", () =>
      document.getElementById("modalToogle").classList.remove("hidden"),
    );
  document
    .getElementById("closerModal")
    .addEventListener("click", () =>
      document.getElementById("modalToogle").classList.add("hidden"),
    );

  // LOGOUT
  const logoutModal = document.getElementById("logoutModal");
  document.getElementById("logoutBtn").addEventListener("click", () => {
    logoutModal.classList.remove("hidden");
    logoutModal.classList.add("flex");
  });
  document.getElementById("cancelLogout").addEventListener("click", () => {
    logoutModal.classList.add("hidden");
    logoutModal.classList.remove("flex");
  });
  logoutModal.addEventListener("click", (e) => {
    if (e.target === logoutModal) {
      logoutModal.classList.add("hidden");
      logoutModal.classList.remove("flex");
    }
  });
  document.getElementById("confirmLogout").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showToast("Déconnecté avec succès ");
    setTimeout(() => (window.location.href = "index.html"), 1500);
  });

  // FERMER NOTIF
  document
    .getElementById("fermerNotif")
    .addEventListener("click", () =>
      document.getElementById("notifModal").classList.add("hidden"),
    );

  // PHOTO PROFIL
  const photoModal = document.getElementById("photoModal");
  const photoUpload = document.getElementById("photoUpload");
  const photoPreview = document.getElementById("photoPreview");

  document.getElementById("userPhotoWrapper").addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    photoPreview.src = imageUrl(user?.photo);
    photoModal.classList.remove("hidden");
  });
  document.getElementById("sidebarPhoto").addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    photoPreview.src = imageUrl(user?.photo);
    photoModal.classList.remove("hidden");
  });
  photoUpload.addEventListener("change", () => {
    const file = photoUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => (photoPreview.src = e.target.result);
      reader.readAsDataURL(file);
    }
  });
  document.getElementById("annulerPhoto").addEventListener("click", () => {
    photoModal.classList.add("hidden");
    photoUpload.value = "";
  });
  document
    .getElementById("sauvegarderPhoto")
    .addEventListener("click", async () => {
      const file = photoUpload.files[0];
      if (!file) {
        showToast("Choisissez une photo d'abord", "bg-red-500");
        return;
      }
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", file);
      try {
        const res = await fetch(`${API}/auth/update-photo`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          showToast("Erreur lors de l'upload", "bg-red-500");
          return;
        }
        const user = JSON.parse(localStorage.getItem("user"));
        user.photo = data.photo;
        localStorage.setItem("user", JSON.stringify(user));
        document.getElementById("userPhoto").src = data.photo;
        document.getElementById("sidebarPhoto").src = data.photo;
        document.getElementById("photoPreview").src = data.photo;
        photoModal.classList.add("hidden");
        photoUpload.value = "";
        showToast("Photo mise à jour ");
      } catch (e) {
        console.error(e);
        showToast("Erreur serveur", "bg-red-500");
      }
    });

  // FORM HOTEL
  const form = document.getElementById("formHotel");
  const erreurDiv = document.getElementById("erreur");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("nom").value;
    const location = document.getElementById("adresse").value;
    const price = document.getElementById("prix").value;
    const email = document.getElementById("email").value;
    const telephone = document.getElementById("numero").value;
    const devise = document.getElementById("devise").value;
    const image = document.getElementById("image").files[0];
    const token = localStorage.getItem("token");

    if (!name || !location || !price) {
      erreurDiv.textContent = "Nom, adresse et prix sont obligatoires";
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("email", email);
    formData.append("telephone", telephone);
    formData.append("devise", devise);
    if (image) formData.append("image", image);

    try {
      let res;
      if (editingHotelId) {
        res = await fetch(`${API}/hotels/${editingHotelId}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        if (!image) {
          erreurDiv.textContent = "L'image est obligatoire";
          return;
        }
        res = await fetch(`${API}/hotels`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }
      const data = await res.json();
      if (!res.ok) {
        erreurDiv.textContent = data.message || "Erreur";
        return;
      }
      erreurDiv.textContent = "";
      const msg = editingHotelId ? "Hôtel modifié " : "Hôtel ajouté ";
      editingHotelId = null;
      form.reset();
      modalContent.classList.add("hidden");
      showToast(msg);
      afficherHotels();
    } catch (error) {
      console.error(error);
      erreurDiv.textContent = "Erreur serveur";
    }
  });

  // RECHERCHE
  document.getElementById("searchInput").addEventListener("input", async () => {
    const value = document
      .getElementById("searchInput")
      .value.trim()
      .toLowerCase();
    if (!value) {
      afficherListe(allHotels);
      return;
    }
    try {
      const res = await fetch(`${API}/hotels/search?q=${value}`);
      if (res.ok) {
        afficherListe(await res.json());
      } else {
        throw new Error();
      }
    } catch {
      afficherListe(
        allHotels.filter(
          (h) =>
            h.name.toLowerCase().includes(value) ||
            h.location.toLowerCase().includes(value),
        ),
      );
    }
  });
});
