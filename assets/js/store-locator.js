// Renderiza el mapa y busca la ubicación del usuario
document.addEventListener("DOMContentLoaded", function () {
	if (typeof google === "undefined") return;

	const mapEl = document.getElementById("map");
	if (!mapEl) return;

	navigator.geolocation.getCurrentPosition((position) => {
		const userLocation = {
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		};

		const map = new google.maps.Map(mapEl, {
			center: userLocation,
			zoom: 13,
		});

		new google.maps.Marker({
			position: userLocation,
			map,
			title: "Tu ubicación",
		});
	});
});
