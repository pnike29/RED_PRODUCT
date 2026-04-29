async function afficherNombreHotels() {
  const res = await fetch("http://localhost:5000/api/hotels/count");
  const data = await res.json();

  document.getElementById("hotelCount").textContent = data.count;
}

afficherNombreHotels();
