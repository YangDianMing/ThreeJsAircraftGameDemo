importScripts('./js/models/Sea.js'); //大海
importScripts('./js/models/Sky.js'); //天空
importScripts('./js/models/AirPlane.js'); //飞机
importScripts('./js/build/DeviceOrientationControls.js'); //<!-- 控制陀螺仪 （DeviceOrientationControls.js） -->
importScripts('./js/build/OrbitControls.js'); //<!-- 鼠标控制 （OrbitControls.js） -->
importScripts('./js/build/StereoEffect.js'); //双屏立体
importScripts('./js/build/VREffect.js'); //双屏立体
importScripts('./js/build/VRControls.js'); //双屏立体
//调色板
var Colors = {
	red: 0xf25346,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0
};

window.addEventListener('load', init, false);
//初始化
function init() {
	// 创建场景，相机和渲染器
	createScene();
	// 添加光源
	createLights();
	// 添加对象
	createSea(); //海
	createSky(); //天空
	createPlane(); //飞机

	initDevices(); //陀螺仪
	initControls(); //控制器
	initEffect(); //立体

	//添加监听器
	document.addEventListener('mousemove', handleMouseMove, false); //鼠标移动
	// 调用循环函数，在每帧更新对象的位置和渲染场景
	loop();
	// 渲染场景
	//	renderer.render(scene, camera);

}

function loop() {
	// 使螺旋桨旋转并转动大海和云
	// airplane.propeller.rotation.x += .2;
	sea.mesh.rotation.z += 0.005;
	sky.mesh.rotation.z += 0.005;

	updatePlane(); // 更新每帧的飞机
	sea.moveWaves(); //浪

	Devices.update(); //更新陀螺仪
	Controls.update(); //更新控制器
	

	// airplane.mesh.rotation.y = Math.PI * 1.0; //逆时针旋转270
	// sea.mesh.rotation.x = Math.PI/2;//旋转大海

	// 渲染场景
	renderer.render(scene, camera);
	//	Effect.render(scene, camera);

	// 重新调用 render() 函数
	requestAnimationFrame(loop);
	//	 setTimeout(loop,160.6);
}

var Controls, Devices;
// 初始化控制器
function initControls() {
	Controls = new THREE.OrbitControls(camera, renderer.domElement);

	//	Controls.autoRotate = true;

	//	控制焦距
	Controls.target.set(
		camera.position.x + 0.01,
		camera.position.y,
		camera.position.z
	);
}
// 初始化陀螺仪
function initDevices() {
	Devices = new THREE.DeviceOrientationControls(camera);
}
//立体效果-vr双屏
var Effect;

function initEffect() {
	Effect = new THREE.StereoEffect(renderer);
	Effect.setSize(WIDTH, HEIGHT);
}

//创建场景、相机、渲染器
var scene, camera, fieldOfView, aspectRatio, nearPlane,
	farPlane, HEIGHT, WIDTH, renderer, container;

function createScene() {
	// 获得屏幕的宽和高，
	// 用它们设置相机的纵横比
	// 还有渲染器的大小
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	// 创建场景
	scene = new THREE.Scene();
	// 在场景中添加雾的效果；样式上使用和背景一样的颜色
	// scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

	// 创建相机
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	/**
	 * PerspectiveCamera 透视相机
	 * @param fieldOfView 视角
	 * @param aspectRatio 纵横比
	 * @param nearPlane 近平面
	 * @param farPlane 远平面
	 */
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);

	// 设置相机的位置
	camera.position.x = -30;
	camera.position.z = 50;
	camera.position.y = 130;
	camera.rotation.y -= Math.PI / 2;

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({
		// 在 css 中设置背景色透明显示渐变色
		alpha: true,
		// 开启抗锯齿，但这样会降低性能。
		// 不过，由于我们的项目基于低多边形的，那还好 :)
		antialias: true
	});

	// 定义渲染器的尺寸；在这里它会填满整个屏幕
	renderer.setSize(WIDTH, HEIGHT);
	// 打开渲染器的阴影地图
	renderer.shadowMap.enabled = true;
	// 在 HTML 创建的容器中添加渲染器的 DOM 元素
	container = document.getElementById('world');
	container.appendChild(renderer.domElement);
	// 监听屏幕，缩放屏幕更新相机和渲染器的尺寸
	window.addEventListener('resize', handleWindowResize, false);
	//生成一个坐标轴，辅助线
	var axes = new THREE.AxisHelper(200);
	scene.add(axes);
	//网格辅助
	var gridHelper = new THREE.GridHelper(100, 1);
	//	scene.add(gridHelper);
}
//更新屏幕比例
function handleWindowResize() {
	// 更新渲染器的高度和宽度以及相机的纵横比
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
	Effect.setSize(WIDTH, HEIGHT);
}

//创建光源
var ambientLight, hemisphereLight, shadowLight;

function createLights() {

	// 半球光就是渐变的光；
	// 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

	// 方向光是从一个特定的方向的照射
	// 类似太阳，即所有光源是平行的
	// 第一个参数是关系颜色，第二个参数是光源强度
	shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

	// 环境光源修改场景中的全局颜色和使阴影更加柔和
	ambientLight = new THREE.AmbientLight(0xdc8874, .5);

	// 设置光源的方向。
	// 位置不同，方向光作用于物体的面也不同，看到的颜色也不同
	shadowLight.position.set(150, 350, 350);
	// 开启光源投影
	shadowLight.castShadow = true;
	// 定义可见域的投射阴影
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;
	// 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	// 为了使这些光源呈现效果，只需要将它们添加到场景中
	scene.add(hemisphereLight);
	scene.add(shadowLight);
	scene.add(ambientLight);
}

//实例化大海对象，并添加至场景
var sea;

function createSea() {
	sea = new Sea();
	// 在场景底部，稍微推挤一下
	sea.mesh.position.y = -600;
	// 添加大海的网格至场景
	scene.add(sea.mesh);
}

// 现在我们实例化天空对象，而且将它放置在屏幕中间稍微偏下的位置。
var sky;

function createSky() {
	sky = new Sky();
	sky.mesh.position.y = -600;
	scene.add(sky.mesh);
}

//创建飞机
var airplane;

function createPlane() {
	//创建飞机
	airplane = new AirPlane();
	airplane.mesh.scale.set(.25, .25, .25);
	airplane.mesh.position.y = 100;
	//加入场景
	scene.add(airplane.mesh);
}
var mousePos = {
	x: 0,
	y: 0
};

// mousemove 事件处理函数
function handleMouseMove(event) {
	// 这里我把接收到的鼠标位置的值转换成归一化值，在-1与1之间变化
	// 这是x轴的公式:
	var tx = -1 + (event.clientX / WIDTH) * 2;

	// 对于 y 轴，我们需要一个逆公式
	// 因为 2D 的 y 轴与 3D 的 y 轴方向相反
	var ty = 1 - (event.clientY / HEIGHT) * 2;
	mousePos = {
		x: tx,
		y: ty
	};
}

//更新飞机位置
function updatePlane() {

	// 让我们在x轴上-100至100之间和y轴25至175之间移动飞机
	// 根据鼠标的位置在-1与1之间的范围，我们使用的 normalize 函数实现（如下）
	//var targetX = normalize(mousePos.x, -1, 1, -100, 100);
	//var targetY = normalize(mousePos.y, -1, 1, 25, 175);
	//
	//// 在每帧通过添加剩余距离的一小部分的值移动飞机
	//airplane.mesh.position.y += (targetY - airplane.mesh.position.y) * 0.1;
	//// 剩余的距离按比例转动飞机
	//airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y) * 0.0128;
	//airplane.mesh.rotation.x = (airplane.mesh.position.y - targetY) * 0.0064;
	//
	//// 更新飞机的位置
	//airplane.mesh.position.x = targetX;
	//airplane.mesh.position.y = targetY;
	airplane.propeller.rotation.x += 0.3; //螺旋桨

	airplane.pilot.updateHairs(); //秀发
}

function normalize(v, vmin, vmax, tmin, tmax) {
	var nv = Math.max(Math.min(v, vmax), vmin);
	var dv = vmax - vmin;
	var pc = (nv - vmin) / dv;
	var dt = tmax - tmin;
	var tv = tmin + (pc * dt);
	// tv = tmin+((v-vmin)/(vmax-vmin)*(tmax-tmin));//推导公式
	return tv;
}