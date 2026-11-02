document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const storeType = params.get("type");
  const container = document.getElementById("storesList");
  const locationButton = document.getElementById("allowLocationBtn");

  const storesData = {
    shopping: [{ id: 1, name: "Urban Fashion Store", address: "Banjara Hills, Hyderabad", lat: 17.4065, lng: 78.4772, reward: "10 pts / ₹100" }],
    food: [{ id: 2, name: "Urban Brew Café", address: "Jubilee Hills, Hyderabad", lat: 17.4326, lng: 78.4071, reward: "10 pts / ₹100" }],
    services: [{ id: 3, name: "FitZone Gym", address: "Gachibowli, Hyderabad", lat: 17.4401, lng: 78.3489, reward: "15 pts / ₹100" }],
    travel: [{ id: 4, name: "AURA Travel Partner", address: "Hitech City, Hyderabad", lat: 17.4483, lng: 78.3915, reward: "20 pts / ₹100" }]
  };

  const getDistanceKm = (a, b, c, d) => {
    const rad = n => n * Math.PI / 180;
    const x = Math.sin(rad(c - a) / 2) ** 2 +
      Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(rad(d - b) / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };

  function renderStores(userCoords = null) {
    if (!container) return;
    const stores = storesData[storeType] || Object.values(storesData).flat();
    container.replaceChildren();
    if (!stores.length) {
      container.textContent = "No partner stores found.";
      return;
    }
    stores.forEach(store => {
      const card = document.createElement("article");
      card.className = "card";
      const heading = document.createElement("h3");
      heading.textContent = store.name;
      const address = document.createElement("p");
      address.textContent = `Address: ${store.address}`;
      const reward = document.createElement("p");
      reward.textContent = `Rewards: ${store.reward}`;
      const distance = document.createElement("p");
      distance.textContent = userCoords
        ? `Distance: ${getDistanceKm(userCoords.latitude, userCoords.longitude, store.lat, store.lng).toFixed(2)} km`
        : "Distance unavailable — location permission not granted.";
      const link = document.createElement("a");
      link.className = "btn-outline";
      link.href = `store-details.html?id=${store.id}&type=${storeType || Object.keys(storesData).find(key => storesData[key].some(item => item.id === store.id))}`;
      link.textContent = "View Store";
      card.append(heading, address, reward, distance, link);
      container.append(card);
    });
  }

  renderStores();
  locationButton?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by this browser. Showing stores without distance.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => renderStores(position.coords),
      () => alert("Location permission was denied. You can still browse the listed stores."),
      { timeout: 8000 }
    );
  });
});
