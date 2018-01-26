/**
 * 定义飞机
 */
var AirPlane = function() {

	this.mesh = new THREE.Object3D();

	// 驾驶舱
	var geomCockpit = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
	var matCockpit = new THREE.MeshPhongMaterial({
		color: Colors.red,
		shading: THREE.FlatShading
	});
	// 我们可以通过访问形状中顶点数组中一组特定的顶点
	// 然后移动它的 x, y, z 属性:
	geomCockpit.vertices[4].y -= 10;
	geomCockpit.vertices[4].z += 20;
	geomCockpit.vertices[5].y -= 10;
	geomCockpit.vertices[5].z -= 20;
	geomCockpit.vertices[6].y += 30;
	geomCockpit.vertices[6].z += 20;
	geomCockpit.vertices[7].y += 30;
	geomCockpit.vertices[7].z -= 20;
	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	this.mesh.add(cockpit);
	// 创建引擎
	var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
	var matEngine = new THREE.MeshPhongMaterial({
		color: Colors.white,
		shading: THREE.FlatShading
	});
	var engine = new THREE.Mesh(geomEngine, matEngine);
	engine.position.x = 40;
	engine.castShadow = true;
	engine.receiveShadow = true;
	this.mesh.add(engine);
	
	// 创建机尾
	var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
	var matTailPlane = new THREE.MeshPhongMaterial({
		color: Colors.red,
		shading: THREE.FlatShading
	});
	var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
	tailPlane.position.set(-35, 25, 0);
	tailPlane.castShadow = true;
	tailPlane.receiveShadow = true;
	this.mesh.add(tailPlane);

	// 创建机翼
	var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
	var matSideWing = new THREE.MeshPhongMaterial({
		color: Colors.red,
		shading: THREE.FlatShading
	});
	var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
	sideWing.position.y += 15;
	//	sideWing.position.set(0,15,0);
	sideWing.castShadow = true;
	sideWing.receiveShadow = true;
	this.mesh.add(sideWing);

	//挡风玻璃
	var geomWindshield = new THREE.BoxGeometry(3, 15, 20, 1, 1, 1);
	var matWindshield = new THREE.MeshPhongMaterial({
		color: Colors.white,
		transparent: true,
		opacity: .3,
		shading: THREE.FlatShading
	});;
	var windshield = new THREE.Mesh(geomWindshield, matWindshield);
	windshield.position.set(15, 27, 0);

	windshield.castShadow = true;
	windshield.receiveShadow = true;

	this.mesh.add(windshield);

	// 创建螺旋桨
	var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
	geomPropeller.vertices[4].y -= 5;
	geomPropeller.vertices[4].z += 5;
	geomPropeller.vertices[5].y -= 5;
	geomPropeller.vertices[5].z -= 5;
	geomPropeller.vertices[6].y += 5;
	geomPropeller.vertices[6].z += 5;
	geomPropeller.vertices[7].y += 5;
	geomPropeller.vertices[7].z -= 5;
	var matPropeller = new THREE.MeshPhongMaterial({
		color: Colors.brown,
		shading: THREE.FlatShading
	});
	this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
	this.propeller.castShadow = true;
	this.propeller.receiveShadow = true;

	// 创建螺旋桨的桨叶
	var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
	var matBlade = new THREE.MeshPhongMaterial({
		color: Colors.brownDark,
		shading: THREE.FlatShading
	});
	var blade = new THREE.Mesh(geomBlade, matBlade);
	blade.position.set(8, 0, 0);
	blade.castShadow = true;
	blade.receiveShadow = true;
	this.propeller.add(blade);
	this.propeller.position.set(50, 0, 0);
	this.mesh.add(this.propeller);

	//造轮子-右
	var wheelProtecGeom = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1);
	var wheelProtecMat = new THREE.MeshPhongMaterial({
		color: Colors.red,
		shading: THREE.FlatShading
	});
	var wheelProtecR = new THREE.Mesh(wheelProtecGeom, wheelProtecMat);
	wheelProtecR.position.set(25, -20, 25);
	this.mesh.add(wheelProtecR);
	//轮胎-右
	var wheelTireGeom = new THREE.BoxGeometry(24, 24, 4);
	var wheelTireMat = new THREE.MeshPhongMaterial({
		color: Colors.brownDark,
		shading: THREE.FlatShading
	});
	var wheelTireR = new THREE.Mesh(wheelTireGeom, wheelTireMat);
	wheelTireR.position.set(25, -28, 25);

	//轮子轴
	var wheelAxisGeom = new THREE.BoxGeometry(10, 10, 6);
	var wheelAxisMat = new THREE.MeshPhongMaterial({
		color: Colors.brown,
		shading: THREE.FlatShading
	});
	var wheelAxis = new THREE.Mesh(wheelAxisGeom, wheelAxisMat);
	wheelTireR.add(wheelAxis);
	this.mesh.add(wheelTireR);

	//克隆造轮子-左
	var wheelProtecL = wheelProtecR.clone();
	wheelProtecL.position.z = -wheelProtecR.position.z;
	this.mesh.add(wheelProtecL);
	//克隆轮胎-左
	var wheelTireL = wheelTireR.clone();
	wheelTireL.position.z = -wheelTireR.position.z;
	this.mesh.add(wheelTireL);

	//尾轮
	var wheelTireB = wheelTireR.clone();
	wheelTireB.scale.set(.5, .5, .5);
	wheelTireB.position.set(-35, -5, 0);
	this.mesh.add(wheelTireB);
	//悬挂
	var suspensionGeom = new THREE.BoxGeometry(4, 20, 4);
	suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 10, 0))
	var suspensionMat = new THREE.MeshPhongMaterial({
		color: Colors.red,
		shading: THREE.FlatShading
	});
	var suspension = new THREE.Mesh(suspensionGeom, suspensionMat);
	suspension.position.set(-35, -5, 0);
	suspension.rotation.z = -.3;
	this.mesh.add(suspension);

	//创建飞行员
	this.pilot = new Pilot();
	this.pilot.mesh.position.y += 30;
	this.mesh.add(this.pilot.mesh);
};
//飞行员对象
var Pilot = function() {
	this.mesh = new THREE.Object3D();
	this.mesh.name = "pilot";

	// angleHairs是用于后面头发的动画的属性
	this.angleHairs = 0;

	// 飞行员的身体
	var bodyGeom = new THREE.BoxGeometry(15, 15, 15);
	var bodyMat = new THREE.MeshPhongMaterial({
		color: Colors.brown,
		shading: THREE.FlatShading
	});
	var body = new THREE.Mesh(bodyGeom, bodyMat);
	body.position.set(2, -12, 0);
	this.mesh.add(body);

	// 飞行员的脸部
	var faceGeom = new THREE.BoxGeometry(10, 10, 10);
	var faceMat = new THREE.MeshLambertMaterial({
		color: Colors.pink
	});
	var face = new THREE.Mesh(faceGeom, faceMat);
	this.mesh.add(face);

	// 飞行员的头发
	var hairGeom = new THREE.BoxGeometry(4, 4, 4);
	var hairMat = new THREE.MeshLambertMaterial({
		color: Colors.brown
	});
	var hair = new THREE.Mesh(hairGeom, hairMat);
	// 调整头发的形状至底部的边界，这将使它更容易扩展。
	hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));

	// 创建一个头发的容器
	var hairs = new THREE.Object3D();

	// 创建一个头发顶部的容器（这会有动画效果）
	this.hairsTop = new THREE.Object3D();

	// 创建头顶的头发并放置他们在一个3*4的网格中
	for(var i = 0; i < 12; i++) {
		var h = hair.clone();
		var col = i % 3;
		var row = Math.floor(i / 3);
		var startPosZ = -4;
		var startPosX = -4;
		h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
		this.hairsTop.add(h);
	}
	hairs.add(this.hairsTop);

	// 创建脸庞的头发
	var hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
	hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
	var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
	var hairSideL = hairSideR.clone();
	hairSideR.position.set(8, -2, 6);
	hairSideL.position.set(8, -2, -6);
	hairs.add(hairSideR);
	hairs.add(hairSideL);

	// 创建后脑勺的头发
	var hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
	var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
	hairBack.position.set(-1, -4, 0)
	hairs.add(hairBack);
	hairs.position.set(-5, 5, 0);
	this.mesh.add(hairs);

	//眼镜
	var glassGeom = new THREE.BoxGeometry(5, 5, 5);
	var glassMat = new THREE.MeshLambertMaterial({
		color: Colors.brown
	});
	var glassR = new THREE.Mesh(glassGeom, glassMat);
	glassR.position.set(6, 0, 3);
	var glassL = glassR.clone();
	glassL.position.z = -glassR.position.z;

	var glassAGeom = new THREE.BoxGeometry(11, 1, 11);
	var glassA = new THREE.Mesh(glassAGeom, glassMat);
	this.mesh.add(glassR);
	this.mesh.add(glassL);
	this.mesh.add(glassA);
	//耳朵
	var earGeom = new THREE.BoxGeometry(2, 3, 2);
	var earL = new THREE.Mesh(earGeom, faceMat);
	earL.position.set(0, 0, -6);
	var earR = earL.clone();
	earR.position.set(0, 0, 6);
	this.mesh.add(earL);
	this.mesh.add(earR);
}

// 移动头发
Pilot.prototype.updateHairs = function() {
	// 获得头发
	var hairs = this.hairsTop.children;

	// 根据 angleHairs 的角度更新头发
	var l = hairs.length;
	for(var i = 0; i < l; i++) {
		var h = hairs[i];
		// 每根头发将周期性的基础上原始大小的75%至100%之间作调整。
		h.scale.y = .75 + Math.cos(this.angleHairs + i / 3) * .25; //y轴等级
	}
	// 在下一帧增加角度
	this.angleHairs += .16;
}