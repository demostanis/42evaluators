let currentPopup;
const handleNewImages = () => {
	document.querySelectorAll("image").forEach(image => {
		image.addEventListener("mouseover", () => {
			if (!image.href.baseVal) return;
			if (currentPopup
				&& !currentPopup.hovered) currentPopup.remove();

			const login = clusterMap[image.id];
			const bbox = image.getBoundingClientRect();
			const popup = document.createElement("card");
			popup.classList.add("card", "card-side",
				"h-32", "bg-base-300", "shadow-2xl");

			const popupImage = document.createElement("figure");
			popupImage.classList.add("w-full", "h-full");
			const popupImageImage = document.createElement("img");
			popupImageImage.classList.add("w-full", "h-full");
			popupImageImage.src = image.href.baseVal;
			popupImage.appendChild(popupImageImage);

			const popupTitle = document.createElement("h2");
			const popupTitleTitle = document.createElement("a");
			popupTitle.classList.add("popup-title", "text-center");
			popupTitleTitle.href = "https://profile.intra.42.fr/users/" + login;
			popupTitleTitle.textContent = login;
			popupTitle.appendChild(popupTitleTitle);

			const popupBodyBody = document.createElement("p");
			popupBodyBody.classList.add("text-center");
			popupBodyBody.textContent = image.id;
			const popupBody = document.createElement("div");
			popupBody.classList.add("popup-body", "m-auto", "p-5");
			popupBody.appendChild(popupTitle);
			popupBody.appendChild(popupBodyBody);

			popup.appendChild(popupImage);
			popup.appendChild(popupBody);

			document.body.appendChild(popup);
			currentPopup = popup;

			let id = setInterval(() => {
				if (popup.getBoundingClientRect().height != 0) {
					clearInterval(id);
					popup.style.position = "absolute";
					popup.style.left = bbox.x + bbox.width + "px";
					popup.style.top = bbox.y
						- (popup.getBoundingClientRect().height
							- bbox.height) / 2 + "px";
				}
			});
		});
		document.body.addEventListener("mouseover", event => {
			if (currentPopup
				&& ["svg", "card"].indexOf(event.target.nodeName) >= 0)
				currentPopup.remove();
		});
	});
}

const secure = window.location.protocol == "https:";
const ws = new WebSocket((secure ? "wss://" : "ws://")
	+ window.location.host
	+ window.location.pathname.substr(0, window.location.pathname.length-1) // remove trailing /
	+ ".live");

ws.onopen = () => {
	ws.send(JSON.stringify({
		cluster: parseInt(new URLSearchParams(window.location.search).get("cluster")),
	}));
	handleNewImages();
}

ws.onerror = () => {
	// I guess we should do something. We don't handle
	// network errors in the blackhole map either (yet).
	// The error handling of this app sucks.
}

const clusterMap = {};
ws.onmessage = message => {
	const data = JSON.parse(message.data);
	// We cannot use getElementById since we need the second element
	// and we cannot use querySelector since IDs might start with a number
	// (I hate those SVGs)
	const elem = document.all[data.host]?.[1];
	if (elem) {
		clusterMap[data.host] = data.login;

		if (data.left) {
			elem.setAttribute("href", "");
			elem.style.display = "none";
			elem.style.display = "block";
		}
		else
			elem.setAttribute("href", data.image);
	}
}
