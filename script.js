let count = 0;

function addNotif() {
  count++;
  document.getElementById("badge").innerText = count;
}

const modal = document.getElementById("modal");
const fermerModal = document.getElementById("fermerModal");
const modalContent = document.getElementById("modalContent");
function button(num) {
  const cont1 = document.getElementById("cont1");
  const cont2 = document.getElementById("cont2");
  if (num === 1) {
    cont1.classList.remove("hidden");
    cont2.classList.add("hidden");
  } else {
    cont1.classList.add("hidden");
    cont2.classList.remove("hidden");
  }
  function change() {
    const metre = document.getElementById("choix");
    if (num === 2) {
      metre.innerHTML =
        "<h1 class='font-bold text-[12px] sm:text-2xl md:text-2xl lg:text-2xl'>Liste des hotels</h1>";
    } else {
      metre.innerHTML =
        "<h1 class='font-bold text-[12px] sm:text-2xl md:text-2xl lg:text-2xl'>Dashboard</h1>";
    }
  }
  change();
}
button(1);
modal.addEventListener("click", () => {
  modalContent.classList.remove("hidden");
});
fermerModal.addEventListener("click", () => {
  modalContent.classList.add("hidden");
});

const toogleModal = document.getElementById("toogleModal");
const modalToogle = document.getElementById("modalToogle");
const closerModal = document.getElementById("closerModal");

toogleModal.addEventListener("click", () => {
  modalToogle.classList.remove("hidden");
});
closerModal.addEventListener("click", () => {
  modalToogle.classList.add("hidden");
});

const hotels = [];

const nomInput = document.getElementById("nom");
const adresseInpute = document.getElementById("adresse");
const emailInpute = document.getElementById("email");
const numeroInpute = document.getElementById("numero");
const prixInpute = document.getElementById("prix");
const deviseInpute = document.getElementById("devise");
const imageInpute = document.getElementById("image");
const saveButon = document.getElementById("save");
const erreur = document.getElementById("erreur");

const form = document.getElementById("formHotel");
const liste = document.getElementById("listeHotels");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const nom = nomInput.value;
  const adresse = adresseInpute.value;
  const email = emailInpute.value;
  const numero = numeroInpute.value;
  const prix = prixInpute.value;
  const devise = deviseInpute.value;
  const image = imageInpute.value;

  const file = imageInpute.files[0];

  if (!nom || !adresse || !email || !numero || !prix || !devise || !image) {
    erreur.textContent = "veillez remplire les champ";
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    const hotel = {
      nom,
      adresse,
      email,
      numero,
      prix,
      devise,
      image: reader.result,
    };

    // 👉 ajouter dans le tableau
    hotels.push(hotel);
    modalContent.classList.add("hidden");
    // 👉 afficher
    afficherHotels();
  };

  reader.readAsDataURL(file);

  form.reset();
});

// ✅ afficher les hôtels
function afficherHotels() {
  liste.innerHTML = "";

  hotels.forEach((hotel) => {
    const card = `
     

        <div class="bg-white  rounded-[14px] overflow-hidden h-[250px]">
         <img class="w-full h-[165px]" src="${hotel.image}" alt="">
          <div class="ml-2">
           <p class="text-red-400 text-[11px] pt-3">${hotel.adresse}</p>
           <h3 class="font-bold">${hotel.nom},</h3>
             <p class="text-[13px]">${hotel.prix},${hotel.devise}</p>
                </div>
                 </div>
    `;

    liste.innerHTML += card;
  });
}
const buttons = document.querySelectorAll("button");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("bg-white", "text-[#494C4F]"));
    btn.classList.add("bg-white", "text-[#494C4F]");
  });
});
