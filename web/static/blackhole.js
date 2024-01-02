import * as three from 'three';
import { Line2 } from 'three/addons/Line2.js';
import { LineMaterial } from 'three/addons/LineMaterial.js';
import { LineGeometry } from 'three/addons/LineGeometry.js';
import { GLTFLoader } from 'three/addons/GLTFLoader.js';

const pointsCount = 1000;
const lucky = Math.random() > 0.995;
const navbarHeight = document.querySelector(".navbar").getBoundingClientRect().height;

let rendererHeight = innerHeight - navbarHeight;
function resizeBlackholes(rendererHeight) {
	if (window.innerWidth >= 1024)
		document.querySelector("#blackholes").style.height = rendererHeight + "px";
	else
		document.querySelector("#blackholes").style.height = "160px";
}
resizeBlackholes(rendererHeight)

const createUserElem = user => {
	const cardImage = document.createElement("figure");
	const cardImageImage = document.createElement("img");
	cardImageImage.classList.add("w-44", "object-contain");
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
	userElem.classList.add("card", "card-side",
		"pt-1", "pl-1", "h-32");
	userElem.appendChild(cardImage);
	userElem.appendChild(cardBody);

	return userElem;
}

const showBlackholes = stage => {
	const blackholes = document.querySelector("#blackholes");
	blackholes.innerHTML = "";

	const weeks = document.createElement("p");
	weeks.classList.add("uppercase", "font-bold",
		"ml-3", "mt-1");
	weeks.textContent = `in ${stage.diff} weeks`;
	if (stage.blackholed)
		weeks.textContent = `blackholed`;
	if (stage.diff == 1)
		weeks.textContent = `next week`;
	if (stage.diff == 0)
		weeks.textContent = `this week`;
	blackholes.appendChild(weeks);

	const users = stage.users.slice();
	if (!stage.blackholed)
		users.reverse();
	for (const user of users) {
		blackholes.appendChild(createUserElem(user));
	}
}

function renderBlackholeMap(blackholeMap) {
	const circles = [];

	const scene = new three.Scene();
	const camera = new three.PerspectiveCamera(50, innerWidth/rendererHeight);
	camera.position.z = 15;
	const renderer = new three.WebGLRenderer({
		powerPreference: "high-performance",
		antialias: true,
		stencil: false,
		depth: false,
	});
	renderer.outputColorSpace = three.SRGBColorSpace;
	const loader = new three.TextureLoader();
	const materials = [];
	const stages = {};
	const blackholed = [];

	let blackholeModel;
	let spaceModel;
	const gltfLoader = new GLTFLoader();
	gltfLoader.load("../static/assets/blackhole/blackhole.glb", gltf => {
		blackholeModel = gltf.scene;
		blackholeModel.rotation.x = -5;
		blackholeModel.scale.set(0.7, 0.7, 0.7);
		scene.add(blackholeModel);
	});

	for (const user of blackholeMap) {
		let diff = parseInt((user.date - Date.now()) / (24*3600*1000*7));
		if (user.date < Date.now() || diff < 0) {
			blackholed.push({ diff, user });
			continue;
		}

		stages[diff] ||= { total: 0 };
		stages[diff].total++;
		stages[diff].diff = diff;
		stages[diff].users ||= [];
		stages[diff].users.push(user);

		user.stage = stages[diff];
	}
	const smallestDiff = Math.min(
		...Object.keys(stages).map(a => parseInt(a)));

	for (const i in blackholeMap) {
		const user = blackholeMap[i];
		if (user.stage == undefined) continue;
		const stage = user.stage;

		stage.cur ||= 1;
		if (!stage.points) {
			stage.points = new three.
				EllipseCurve(0, 0, 3 + stage.diff, 3 + stage.diff).
				getPoints(pointsCount * (stage.diff + 1));
			const line = new three.Line(
				new three.BufferGeometry().
					setFromPoints(stage.points), null);
			const geometry = new LineGeometry().fromLine(line);
			const material = new LineMaterial({ color: 0xffffff });
			if (stage.diff == smallestDiff) {
				material.linewidth = 5;
				showBlackholes(stage);
			}
			stage.material = material;
			scene.add(new Line2(geometry, material));
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

		circle.user = user;
		circle.points = stage.points;
		circle.curveIndex = Math.min(stage.points.length - 2,
			parseInt((stage.points.length / stage.total) * stage.cur++));
		circles.push(circle);
		scene.add(circle);
	}

	for (const { user, diff } of blackholed) {
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

		circle.renderOrder = diff;
		circle.position.x = Math.random() * 8 - 5;
		circle.position.y = Math.random() * 8 - 5;
		circle.position.z = diff - 100;
		circle.visible = false;

		user.circle = circle;
		circle.user = user;
		circles.push(circle);
		scene.add(circle);
	}

	let startY = 0;
	window.addEventListener("touchstart", function(event) {
		startY = event.touches[0].pageY;
	});

	const searchInput = document.querySelector("#search");
	searchInput.addEventListener("input", event => {
		const search = event.target.value;

		if (search == "") {
			scrollY = previousScrollY;
			// yup yup yup...
			camera.position.z = 114 / 50 * (scrollY/114) + 15;
			gotoStage(parseInt(scrollY / 114), false);
			return;
		}

		a: for (const i of Object.keys(stages)) {
			const stage = stages[i];
			for (const user of stage.users) {
				if (user.login.includes(search.toLowerCase())) {
					scrollY = parseInt(i)*114;
					camera.position.z = 114 / 50 * (scrollY/114) + 15;
					gotoStage(parseInt(i), false);

					const userElem = [].__proto__.slice.call(
						document.querySelector("#blackholes").
							querySelectorAll("a")).
							find(a =>
								a.textContent.includes(search.toLowerCase()));
					userElem.parentNode.parentNode.classList.add("bg-blue-900");
					userElem.scrollIntoView();

					break a;
				}
			}
		}
	});

	const gotoStage = (stageIndex, changeCamera) => {
		let stage = stages[stageIndex];

		const farthestStage = Object.keys(stages)[Object.keys(stages).length-1];
		const nearestStage = Object.keys(stages)[0];
		if (!stage && stageIndex < nearestStage)
			stage = stages[nearestStage];
		if (!stage && stageIndex > farthestStage)
			stage = stages[farthestStage];
		const material = stage?.material;
		if (material && previousMaterial)
			previousMaterial.linewidth = 1;
		if (material && stage) {
			material.linewidth = 5;
			previousMaterial = material;
			showBlackholes(stage);
		} else if (stageIndex >= -900/114 && stageIndex < 300/114) {
			showBlackholes(stages[0]);
		}

		if (stageIndex < -900/114) {
			showBlackholes({
				users: blackholed.map(b => b.user),
				blackholed: true
			});
			for (const { user, diff } of blackholed) {
				user.circle.visible = true;
			}
			camera.far = 100;
		} else {
			for (const { user, diff } of blackholed) {
				user.circle.visible = false;
			}
			camera.far = 2000;
		}

		camera.updateProjectionMatrix();

		if (changeCamera)
			camera.position.z += (scrollY < previousScrollY ? -114 : 114) / 50;
	}

	let scrollY = 0;
	let previousScrollY = 0;
	let previousMaterial = stages[smallestDiff].material;
	const handleScroll = event => {
		if (document.querySelector("#blackholes:hover")) return;

		if (!event.deltaY)
			event.deltaY = (startY - event.touches[0].pageY) < 0 ? -114 : 114;
		previousScrollY = scrollY;
		scrollY += event.deltaY;

		gotoStage(parseInt(scrollY / 114), true);
	}

	window.addEventListener("wheel", handleScroll);
	window.addEventListener("touchmove", handleScroll);

	let previousTarget;
	let currentTarget;
	let lastButtons;
	const raycaster = new three.Raycaster();
	const mouse = new three.Vector2();
	const handleMouse = event => {
		event.preventDefault();

		mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
		mouse.y = - ((event.clientY - navbarHeight) / renderer.domElement.clientHeight) * 2 + 1;

		if (currentTarget && event.buttons == 0) {
			if (lastButtons == 4) {
				const a = document.createElement("a");
				a.href = "https://profile.intra.42.fr/users/"
					+ currentTarget.object.user.login;
				a.target = "_blank";
				a.click();
			} else if (lastButtons == 1) {
				window.location.href = "https://profile.intra.42.fr/users/"
					+ currentTarget.object.user.login;
			}
		}

		lastButtons = event.buttons;
	}
	renderer.domElement.addEventListener("mousemove", handleMouse);
	renderer.domElement.addEventListener("mousedown", handleMouse);
	renderer.domElement.addEventListener("mouseup", handleMouse);

	const processObjectsAtMouse = () => {
		raycaster.setFromCamera(mouse, camera);

		const [target] = raycaster.intersectObjects(circles);
		currentTarget = target;
		if (previousTarget && target != previousTarget) {
			previousTarget.object.scale.set(1, 1, 1);
			previousTarget.object.renderOrder = 1;
		}
		if (target) {
			const stage = parseInt(scrollY / 114) / 3 + 1;
			if (stage < 1) return;
			target.object.scale.set(stage, stage, stage);
			target.object.renderOrder = 2;
			previousTarget = target;
		}
	}

	window.addEventListener("resize", () => {
		rendererHeight = innerHeight - navbarHeight;
		camera.aspect = window.innerWidth / rendererHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(innerWidth, rendererHeight);
		resizeBlackholes(rendererHeight);
		mouse.x = -1;
		mouse.y = -1;
	});

	renderer.setSize(innerWidth, rendererHeight);
	document.body.appendChild(renderer.domElement);

	function render() {
		requestAnimationFrame(render);
		for (const i in circles) {
			const circle = circles[i];
			if (!circle.points) continue;

			circle.position.x = circle.points[circle.curveIndex].x;
			circle.position.y = circle.points[circle.curveIndex].y;

			circle.curveIndex--;
			if (circle.curveIndex == 0)
				circle.curveIndex = circle.points.length - 1;
		}
		for (const stage of Object.keys(stages))
			stages[stage].material?.resolution.set(innerWidth, rendererHeight);
		if (blackholeModel)
			blackholeModel.rotation.y -= 0.01;

		processObjectsAtMouse();

		renderer.render(scene, camera);
	}
	render();
}

const campusId = new URLSearchParams(location.search).get("campus")
let params = `?campus=${campusId}`;
if (!campusId)
	params = "";
fetch(`../blackhole.json${params}`).
	then(res => res.json().
	then(blackholeMap => {
		blackholeMap.
			forEach(a => { a.date = new Date(a.date); });
		blackholeMap = blackholeMap.
			sort((a, b) => b.date - a.date);

		renderBlackholeMap(blackholeMap);
}));
