import * as three from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

const pointsCount = 1000;
const lucky = Math.random() > 0.995;

const showBlackholes = stage => {
	const blackholes = document.querySelector("#blackholes");
	blackholes.innerHTML = "";
	const weeks = document.createElement("p");
	weeks.classList.add("uppercase");
	weeks.classList.add("font-bold");
	weeks.classList.add("m-3");

	weeks.textContent = `in ${stage.diff} weeks`;
	if (stage.diff == 1)
		weeks.textContent = `next week`;
	if (stage.diff == 0)
		weeks.textContent = `this week`;
	blackholes.appendChild(weeks);

	for (const user of stage.users) {
		const cardImage = document.createElement("figure");
		const cardImageImage = document.createElement("img");
		cardImageImage.classList.add("w-44");
		cardImageImage.classList.add("object-contain");
		cardImageImage.src = user.image;
		cardImage.appendChild(cardImageImage);

		const cardTitle = document.createElement("h2");
		const cardTitleTitle = document.createElement("a");
		cardTitle.classList.add("card-title");
		cardTitleTitle.href = "https://profile.intra.42.fr/users/" + user.login;
		cardTitleTitle.textContent = user.login;
		cardTitle.appendChild(cardTitleTitle);
		const cardBodyBody = document.createElement("p");
		cardBodyBody.textContent = user.date.toDateString();
		const cardBody = document.createElement("div");
		cardBody.classList.add("card-body");
		cardBody.appendChild(cardTitle);
		cardBody.appendChild(cardBodyBody);

		const userElem = document.createElement("div");
		userElem.classList.add("card");
		userElem.classList.add("card-side");
		userElem.classList.add("pt-1");
		userElem.classList.add("pl-1");
		userElem.classList.add("h-32");
		userElem.appendChild(cardImage);
		userElem.appendChild(cardBody);

		blackholes.appendChild(userElem);
	}
}

fetch("/blackhole.json").
	then(res => res.json().
	then(blackholeMap => {
		blackholeMap.
			forEach(a => { a.date = new Date(a.date); });
		blackholeMap = blackholeMap.
			sort((a, b) => b.date - a.date);

		const circles = [];

		const scene = new three.Scene();
		const camera = new three.PerspectiveCamera(50, innerWidth/innerHeight, 0.1, 1000);
		const renderer = new three.WebGLRenderer({ antialias: true });
		const loader = new three.TextureLoader();

		const materials = [];

		const stages = {};
		for (const user of blackholeMap) {
			const diff = parseInt((user.date - Date.now()) / (24*3600*1000*7));
			if (diff < 0) continue; // blackholed
			stages[diff] ||= { total: 0 };
			stages[diff].total++;
			stages[diff].diff = diff;
			stages[diff].users ||= [];
			stages[diff].users.push(user);

			user.diff = diff;
		}
		const smallestDiff = Math.min(...Object.keys(stages).map(a => parseInt(a)));

		for (const i in blackholeMap) {
			const user = blackholeMap[i];

			if (user.diff == undefined) continue;
			const diff = stages[user.diff];
			diff.cur ||= 1;
			if (!diff.points) {
				diff.points = new three.EllipseCurve(0, 0, 3 + user.diff, 3 + user.diff).getPoints(pointsCount * (user.diff + 1));
				const line = new three.Line(new three.BufferGeometry().setFromPoints(diff.points), null);
				const geometry = new LineGeometry().fromLine(line);
				const material = new LineMaterial({
					color: 0xffffff,
					linewidth: 1,
				});
				if (user.diff == smallestDiff) {
					material.linewidth = 5;
					showBlackholes(diff);
				}
				diff.material = material;
				const ellipse = new Line2(geometry, material);

				scene.add(ellipse);
			}

			const map = loader.load(user.image);
			const material = new three.MeshBasicMaterial({ map });

			let geometry;
			if (lucky)
				geometry = new three.SphereGeometry(0.5, 64, 64);
			else
				geometry = new three.CircleGeometry(0.5, 64);
			const circle = new three.Mesh(geometry, material);
			if (lucky)
				circle.rotation.y = 5;

			circle.points = diff.points;
			circle.curveIndex = Math.min(diff.points.length - 2,
				parseInt((diff.points.length / diff.total) * diff.cur++));
			circles.push(circle);
			scene.add(circle);
		}

		camera.position.z = 15;

		let scrollY = 0;
		let previousMaterial = stages[0].material;
		window.addEventListener("wheel", event => {
			if (document.querySelector("#blackholes:hover")) return;

			scrollY += event.deltaY;

			const stage = stages[parseInt(scrollY / 114)];
			const material = stage?.material;
			if (material && previousMaterial)
				previousMaterial.linewidth = 1;
			if (material) {
				material.linewidth = 5;
				previousMaterial = material;
				showBlackholes(stage);
			}

			camera.position.z += event.deltaY / 50;
		});

		renderer.setSize(innerWidth, innerHeight);
		document.body.appendChild(renderer.domElement);

		function render() {
			requestAnimationFrame(render);
			for (const i in circles) {
				const circle = circles[i];

				circle.position.x = circle.points[circle.curveIndex].x;
				circle.position.y = circle.points[circle.curveIndex].y;
				//circle.rotation.y -= 0.01;

				circle.curveIndex++;
				if (circle.curveIndex == circle.points.length - 1)
					circle.curveIndex = 0;
			}
			for (const stage of Object.keys(stages))
				stages[stage].material?.resolution.set(innerWidth, innerHeight);

			renderer.render(scene, camera);
		}
		render();
}));
