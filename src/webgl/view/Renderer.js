import * as THREE from "three";
import { TweenMax, Power4 } from "gsap";

import MediatorFactory from "../MediatorFactory";
import ObjectPicker from "../view/ObjectPicker";

require("three/examples/js/controls/MapControls.js");

export default class Renderer {
  constructor({ controller, model }) {
    this.controller = controller;

    // scene, camera lights, etc
    this.ctx = this.createRenderingContext();

    // ocean mediator, the way to update components
    this.rootMediator = MediatorFactory.getMediator(model);
    this.objectPicker = new ObjectPicker(this.rootMediator, this.ctx);
  }

  createRenderingContext() {
    const width = window.innerWidth,
      height = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true,
      antialias: true
    });

    const controls = new THREE.MapControls(camera, renderer.domElement);
    // an animation loop is required when either damping or auto-rotation are enabled
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = camera.far / 5;
    controls.maxDistance = camera.far / 2;
    controls.maxPolarAngle = Math.PI / 2.3;

    camera.position.set(150, 0, 300);

    // const helper = new THREE.GridHelper( 10000,10 );
    // scene.add(helper);
    // const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    // const helper = new THREE.PlaneHelper( plane, 100, 0xffff00 );
    // scene.add( helper );

    renderer.setSize(width, height);
    renderer.localClippingEnabled = true;
    renderer.sortObjects = false;

    scene.add(new THREE.AmbientLight(0x333333));

    const light = new THREE.DirectionalLight(0xffffff, 1);

    light.position.set(15, 15, 15);
    scene.add(light);

    scene.fog = new THREE.Fog(0x111111);

    return { scene, camera, renderer, controls };
  }

  initialize(onAfterInit) {
    const scene = this.ctx.scene;
    const object3D = this.rootMediator.object3D;

    scene.add(object3D);

    this.objectPicker.initialize();
    this.objectPicker.addObserver("click", e =>
      this.controller.onClick(e.object)
    );
    this.objectPicker.addObserver("mousemove", e =>
      this.controller.onMouseMove(e.object)
    );

    window.addEventListener("resize", () => this.onWindowResize(), false);

    this.rootMediator.addObserver("BoatAddedToOcean", e => {
      const newPos = e.object3D.position;

      this.objectPicker.addTarget(e.object3D);

      TweenMax.to(this.ctx.controls.target, 1.5, {
        x: newPos.x,
        y: newPos.y,
        z: newPos.z,
        ease: Power4.easeInOut,
        onUpdate: () => {
          this.ctx.camera.updateProjectionMatrix();
          this.ctx.camera.lookAt(newPos);
        }
      });
    });

    this.render();

    onAfterInit(this.ctx);
  }

  worldToScreen({ point3d, cssFormat, offsetX, offsetY }) {
    const vector = new THREE.Vector3().copy(point3d);
    const hw = this.ctx.renderer.domElement.width / 2;
    const hh = this.ctx.renderer.domElement.height / 2;

    vector.project(this.ctx.camera);

    vector.x = vector.x * hw + hw;
    vector.y = -(vector.y * hh) + hh;

    let coord = { x: vector.x, y: vector.y };

    if (offsetX) {
      coord.x += offsetX;
    }
    if (offsetY) {
      coord.y += offsetY;
    }
    if (cssFormat) {
      coord = {
        left: Math.round(coord.x) + "px",
        top: Math.round(coord.y) + "px"
      };
    }

    return coord;
  }

  render() {
    // only required if controls.enableDamping = true, or if controls.autoRotate = true
    this.ctx.controls.update();

    requestAnimationFrame(() => this.render());

    // update components
    this.rootMediator.onAfterRender();

    // this.ctx.renderer.setRenderTarget(this.ctx.scene, this.ctx.camera)
    this.ctx.renderer.render(this.ctx.scene, this.ctx.camera);
  }

  onWindowResize() {
    this.ctx.camera.aspect = window.innerWidth / window.innerHeight;
    this.ctx.camera.updateProjectionMatrix();
    this.ctx.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
