import * as three from 'three';

const pointsCount = 500;

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
		const renderer = new three.WebGLRenderer();
		const loader = new three.TextureLoader();

		const stages = {};
		let i = 0;
		for (const user of blackholeMap) {
			if (i >= 10) break
			const diff = parseInt((user.date - Date.now()) / (24*3600*1000*7));
			if (diff < 0) continue;
			stages[diff] ||= 0;
			stages[diff]++;

			const points = new three.EllipseCurve(0, 0, 2 + diff, 2 + diff).getPoints(pointsCount);

			const map = loader.load(user.image);
			const material = new three.MeshBasicMaterial({ map });

			const geometry = new three.CircleGeometry(0.5, 64);
			const circle = new three.Mesh(geometry, material);

			circle.points = points;
			circle.curveIndex = Math.min(stages[diff], 5) * (pointsCount / 10 - 1);
			console.log(stages[diff], circle.curveIndex);
			circles.push(circle);
			scene.add(circle);
		}

		camera.position.z = 20;

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
				if (circle.curveIndex == pointsCount)
					circle.curveIndex = 0;
			}
			renderer.render(scene, camera);
		}
		render();
}));
