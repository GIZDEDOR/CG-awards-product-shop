gsap.registerPlugin(ScrollTrigger);

/* ============================= */
/* LENIS + SCROLLTRIGGER FIX */
/* ============================= */

const lenis = new Lenis({
    smooth: true
});

let currentScroll = 0;

lenis.on("scroll", (e) => {
    currentScroll = e.scroll;
    ScrollTrigger.update();
});

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
        if (arguments.length) {
            lenis.scrollTo(value);
        }
        return currentScroll;
    },
    getBoundingClientRect() {
        return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
});

ScrollTrigger.addEventListener("refresh", () => lenis.resize());
ScrollTrigger.refresh();

/* ============================= */
/* THREE SCENE */
/* ============================= */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfefdfd);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5;

document.querySelector(".model").appendChild(renderer.domElement);

/* ============================= */
/* LIGHTS */
/* ============================= */

scene.add(new THREE.AmbientLight(0xffffff, 3));

const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(5, 10, 7.5);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 3);
fillLight.position.set(-5, 0, -5);
scene.add(fillLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
hemiLight.position.set(0, 25, 0);
scene.add(hemiLight);

/* ============================= */
/* MODEL LOAD */
/* ============================= */

let model;
let isFloating = true;
let scannerPosition = window.innerHeight;

const loader = new THREE.GLTFLoader();

loader.load("./assets/josta.glb", (gltf) => {

    model = gltf.scene;

    model.traverse((node) => {
        if (node.isMesh) {
            if (node.material) {
                node.material.metalness = 0.3;
                node.material.roughness = 0.4;
                node.material.envMapIntensity = 1.5;
                node.material.side = THREE.FrontSide; // защита от "внутри"
            }
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    model.position.sub(center);
    scene.add(model);

    /* ВАЖНО — ТВОЯ КАМЕРА НЕ ТРОНУТА */

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 2.5;

    camera.position.set(0, 0, cameraZ);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    playInitialAnimation();
});

/* ============================= */
/* ANIMATION */
/* ============================= */

const floatAmplitude = 0.2;
const floatSpeed = 1.5;

function animate() {

    if (model) {

        const scrollProgress = Math.min(currentScroll / scannerPosition, 1);

        /* FLOAT */
        if (isFloating) {
            const floatOffset =
                Math.sin(Date.now() * 0.001 * floatSpeed) * floatAmplitude;

            model.position.y = floatOffset;
        }

        /* ТВОЁ БАЗОВОЕ ВРАЩЕНИЕ */
        model.rotation.y += 0.01;

        /* ДОБАВИЛ СКРОЛЛ АНИМАЦИЮ (БЕЗ ЛОМА) */

        // лёгкий наклон (НЕ 360°, чтобы не залезать внутрь)
        model.rotation.x = scrollProgress * Math.PI * 0.15;

        // лёгкое ускорение вращения от скролла
        model.rotation.y += scrollProgress * 0.02;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

/* ============================= */
/* SCANNER SECTION */
/* ============================= */

const scannerSection = document.querySelector(".scanner");
const scanContainer = document.querySelector(".scan-container");
const scanSound = new Audio("./assets/scanner.mp3");

if (scanContainer) {
    gsap.set(scanContainer, { scale: 0 });
}

function playInitialAnimation() {

    if (model) {
        gsap.to(model.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1,
            ease: "power2.out"
        });
    }

    if (scanContainer) {
        gsap.to(scanContainer, {
            scale: 1,
            duration: 1,
            ease: "power2.out"
        });
    }
}

/* ============================= */
/* SCANNER ANIMATION */
/* ============================= */

if (scannerSection) {

    ScrollTrigger.create({
        trigger: scannerSection,
        start: "top top",
        end: () => window.innerHeight,
        pin: true,

        onEnter: () => {

            if (!model) return;

            isFloating = false;
            model.position.y = 0;

            setTimeout(() => {
                scanSound.currentTime = 0;
                scanSound.play();
            }, 500);

            gsap.to(model.rotation, {
                y: model.rotation.y + Math.PI * 2,
                duration: 1,
                ease: "power2.inOut",
                onComplete: () => {

                    gsap.to(model.scale, {
                        x: 0,
                        y: 0,
                        z: 0,
                        duration: 0.5,
                        ease: "power2.in",
                        onComplete: () => {

                            if (scanContainer) {
                                gsap.to(scanContainer, {
                                    scale: 0,
                                    duration: 0.5,
                                    ease: "power2.in"
                                });
                            }
                        }
                    });
                }
            });
        },

        onLeaveBack: () => {

            if (scanContainer) {
                gsap.set(scanContainer, { scale: 0 });

                gsap.to(scanContainer, {
                    scale: 1,
                    duration: 1,
                    ease: "power2.out"
                });
            }

            if (model) {
                gsap.to(model.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 1,
                    ease: "power2.out"
                });
            }

            isFloating = true;
        }
    });
}

/* ============================= */
/* RESIZE */
/* ============================= */

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    scannerPosition = window.innerHeight;

});