import { LineSegments2 } from 'three/addons/LineSegments2.js';
import { LineGeometry } from 'three/addons/LineGeometry.js';
import { LineMaterial } from 'three/addons/LineMaterial.js';

class Line2 extends LineSegments2 {

	constructor( geometry = new LineGeometry(), material = new LineMaterial( { color: Math.random() * 0xffffff } ) ) {

		super( geometry, material );

		this.isLine2 = true;

		this.type = 'Line2';

	}

}

export { Line2 };
