const secure = window.location.protocol == "https";
const ws = new WebSocket((secure ? "wss://" : "ws://")
	+ window.location.host
	+ window.location.pathname
	+ ".live");

ws.onopen = () => {
	ws.send(JSON.stringify({
		cluster: parseInt(new URLSearchParams(window.location.search).get("cluster")),
	}));
}
htmx.on("htmx:afterRequest", ws.onopen);

ws.onerror = () => {
	// I guess we should do something. We don't handle
	// network errors in the blackhole map either (yet).
	// The error handling of this app sucks.
}

ws.onmessage = message => {
	const data = JSON.parse(message.data);
	const elem = document.getElementById(data.host);
	if (elem) {
		elem.//TODO: do something
	}
}
