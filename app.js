"use strict";

const button = document.querySelector(".input-block button");
const input = document.querySelector(".input-block input");
const inputBlock = document.querySelector(".input-block");
const inputErrorMessage = document.querySelector(".input-block span");

const ipToDisplay = document.getElementById("ip");
const locationToDisplay = document.getElementById("location");
const timezoneToDisplay = document.getElementById("timezone");
const ispToDisplay = document.getElementById("isp");

///////////////////////////////////////////
// display map
const myMap = L.map("map").setView([34.048967, -118.0948809], 14);
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
	attribution:
		'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: "mapbox/streets-v11",
	tileSize: 512,
	zoomOffset: -1,
	accessToken: "pk.eyJ1IjoiaXNhYWM5NyIsImEiOiJja3Z3Y3EwY3IxanZ6MnBtOWs0ajA5NWV4In0.jx-1Buc8TY2nKhlVDDAUyA",
}).addTo(myMap);

////////////////////////////////////////////
// styles map marker
let marker = L.marker([34.048967, -118.0948809]).addTo(myMap);
const markerShadow = document.querySelector(".leaflet-shadow-pane img");
const markerIcon = document.querySelector(".leaflet-marker-pane img");
const zoomContainer = document.querySelector(".leaflet-bar");

markerShadow.style.display = zoomContainer.style.display = "none";
markerIcon.src = "images/icon-location.svg";
markerIcon.style.height = "56px";
markerIcon.style.width = "46px";

//////////////////////////////////////////
// display either UI data
button.addEventListener("click", () => {
	const inputValue = input.value;
	/^[\d\.]+$/g.test(inputValue) ? setUIData(`&ipAddress=${inputValue}`) : setUIData(`&domain=${inputValue}`);
});

/////////////////////////////////////////
// remove error message when user changes input
input.addEventListener("input", () => {
	inputErrorMessage.classList.remove("message-error");
});
/////////////////////////////////////////
// functions

async function setUIData(string) {
	const response = await fetch(
		`https://geo.ipify.org/api/v2/country,city?apiKey=at_r35W5c0H7s81u6T3WH9Rot2HQ6SPa${string}`
	);
	if (!response.ok) {
		error(); // handles input error
		return;
	}
	const data = await response.json();
	const {
		ip,
		isp,
		location: { country, city, lat: latitude, lng: longitude, timezone },
	} = data;

	ipToDisplay.textContent = ip;
	ispToDisplay.textContent = isp;
	locationToDisplay.textContent = `${city}, ${country}`;
	timezoneToDisplay.textContent = `UTC ${timezone}`;

	myMap.setView([latitude, longitude], 14);

	marker.remove();
	marker = L.marker([latitude, longitude]).addTo(myMap);

	const markerShadow = document.querySelector(".leaflet-shadow-pane img:last-of-type");
	const markerIcon = document.querySelector(".leaflet-marker-pane img:last-of-type");

	markerShadow.style.display = "none";

	markerIcon.src = "images/icon-location.svg";
	markerIcon.style.height = "56px";
	markerIcon.style.width = "46px";
}

function error() {
	inputBlock.classList.add("input-block-error");

	setTimeout(() => {
		inputBlock.classList.remove("input-block-error");
		inputErrorMessage.classList.add("message-error");
	}, 2000);
}
