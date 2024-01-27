import * as three from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

const pointsCount = 1000;

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
			user.diff = diff;
		}
		const smallestDiff = Math.min(...Object.keys(stages).map(a => parseInt(a))) + 1;

		for (const i in blackholeMap) {
			const user = blackholeMap[i];

			if (!user.diff) continue;
			const diff = stages[user.diff];
			diff.cur ||= 1;
			if (!diff.points) {
				diff.points = new three.EllipseCurve(0, 0, 2 + user.diff, 2 + user.diff).getPoints(pointsCount * user.diff);
				const line = new three.Line(new three.BufferGeometry().setFromPoints(diff.points), null);
				const geometry = new LineGeometry().fromLine(line);
				const material = new LineMaterial({
					color: 0xffffff,
					linewidth: 1,
				});
				if (user.diff == smallestDiff)
					material.linewidth = 5;
				diff.material = material;
				const ellipse = new Line2(geometry, material);

				scene.add(ellipse);
			}

			const map = loader.load(user.image);
			const material = new three.MeshBasicMaterial({ map });

			const geometry = new three.CircleGeometry(0.5, 64);
			const circle = new three.Mesh(geometry, material);

			circle.points = diff.points;
			circle.curveIndex = Math.min(diff.points.length - 2,
				parseInt((diff.points.length / diff.total) * diff.cur++));
			circles.push(circle);
			scene.add(circle);
		}

		camera.position.z = 15;

		let scrollY = 0;
		let previousMaterial;
		window.addEventListener("wheel", event => {
			scrollY += event.deltaY;

			let material = stages[parseInt(scrollY / 114)]?.material;
			if (material && previousMaterial)
				previousMaterial.linewidth = 1;
			if (material) {
				material.linewidth = 5;
				previousMaterial = material;
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
