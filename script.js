// ============ CONFIGURATION GLOBALE ============
const SCENES_CONFIG = {
    // Scène 1: Rayonnement Solaire
    'rayonnement-scene': {
        type: 'radiation',
        background: 0x0c2461,
        camera: { x: 0, y: 5, z: 15 }
    },
    // Scène 2: Photovoltaïque
    'photovoltaic-scene': {
        type: 'photovoltaic',
        background: 0x1a2980,
        camera: { x: 0, y: 0, z: 10 }
    },
    // Scène 3: Conversion
    'conversion-scene': {
        type: 'conversion',
        background: 0x0f0c29,
        camera: { x: 0, y: 5, z: 12 }
    },
    // Scène 4: Avantages
    'avantages-scene': {
        type: 'advantages',
        background: 0x1a2a6c,
        camera: { x: 0, y: 10, z: 20 }
    },
    // Scène 5: Défis
    'challenges-scene': {
        type: 'challenges',
        background: 0x000000,
        camera: { x: 0, y: 5, z: 10 }
    },
    // Scène 6: Carte Mondiale
    'world-map-scene': {
        type: 'worldMap',
        background: 0x0f2027,
        camera: { x: 0, y: 0, z: 8 }
    },
    // Scène 7: Technologies
    'tech1-scene': {
        type: 'tech1',
        background: 0x2c3e50,
        camera: { x: 0, y: 2, z: 8 }
    },
    'tech2-scene': {
        type: 'tech2',
        background: 0x34495e,
        camera: { x: 0, y: 3, z: 10 }
    },
    'tech3-scene': {
        type: 'tech3',
        background: 0x2c3e50,
        camera: { x: 0, y: 2, z: 8 }
    }
};

// Variables globales
let scenes = {};
let currentScenario = 'intermittence';
let currentTechSlide = 0;

// ============ FONCTIONS D'INITIALISATION ============

// Initialiser toutes les scènes 3D
function initAll3DScenes() {
    // Attendre que le DOM soit complètement chargé
    setTimeout(() => {
        for (const [containerId, config] of Object.entries(SCENES_CONFIG)) {
            try {
                const scene = init3DScene(containerId, config);
                if (scene) {
                    scenes[containerId] = scene;
                    console.log(`Scène ${containerId} initialisée avec succès`);
                }
            } catch (error) {
                console.error(`Erreur initialisation scène ${containerId}:`, error);
            }
        }
        
        // Masquer les écrans de chargement
        hideLoadingScreens();
    }, 100);
}

// Initialiser une scène 3D spécifique
function init3DScene(containerId, config) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Conteneur ${containerId} non trouvé`);
        return null;
    }
    
    // Créer la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.background);
    
    // Créer la caméra
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(config.camera.x, config.camera.y, config.camera.z);
    
    // Créer le rendu
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Ajouter les contrôles OrbitControls si nécessaire
    let controls = null;
    if (config.type === 'worldMap') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI;
        controls.minDistance = 5;
        controls.maxDistance = 20;
    }
    
    // Configurer selon le type
    switch(config.type) {
        case 'radiation':
            setupRadiationScene(scene, camera);
            break;
        case 'photovoltaic':
            setupPhotovoltaicScene(scene, camera);
            break;
        case 'conversion':
            setupConversionScene(scene, camera);
            break;
        case 'advantages':
            setupAdvantagesScene(scene, camera);
            break;
        case 'challenges':
            setupChallengesScene(scene, camera);
            break;
        case 'worldMap':
            setupWorldMapScene(scene, camera);
            break;
        case 'tech1':
            setupTech1Scene(scene, camera);
            break;
        case 'tech2':
            setupTech2Scene(scene, camera);
            break;
        case 'tech3':
            setupTech3Scene(scene, camera);
            break;
    }
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        // Mettre à jour les contrôles si ils existent
        if (controls) {
            controls.update();
        }
        
        // Mettre à jour la scène selon son type
        updateScene(containerId, scene);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Gérer le redimensionnement
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    return {
        scene: scene,
        camera: camera,
        renderer: renderer,
        controls: controls
    };
}

// Masquer tous les écrans de chargement
function hideLoadingScreens() {
    document.querySelectorAll('.scene-loading').forEach(loading => {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    });
}

// ============ CONFIGURATION DES SCÈNES ============

// Scène 1: Rayonnement Solaire
function setupRadiationScene(scene, camera) {
    // Lumière directionnelle (soleil)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    scene.add(sunLight);
    
    // Lumière ambiante
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    // Soleil
    const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF9800,
        emissive: 0xFF5722,
        emissiveIntensity: 0.5
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(-8, 0, 0);
    scene.add(sun);
    
    // Terre
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2196F3,
        shininess: 30
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(8, 0, 0);
    scene.add(earth);
    
    // Rayons de lumière
    const rays = new THREE.Group();
    for (let i = 0; i < 20; i++) {
        const rayGeometry = new THREE.ConeGeometry(0.05, 2, 4);
        const rayMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFEB3B,
            transparent: true,
            opacity: 0.7
        });
        const ray = new THREE.Mesh(rayGeometry, rayMaterial);
        ray.position.set(-8, 0, 0);
        ray.lookAt(earth.position);
        ray.position.add(
            new THREE.Vector3(1, 0, 0).applyAxisAngle(
                new THREE.Vector3(0, 1, 0),
                (i / 20) * Math.PI * 2
            ).multiplyScalar(1.6)
        );
        rays.add(ray);
    }
    scene.add(rays);
    
    // Stocker les objets pour l'animation
    scene.userData = {
        sun: sun,
        earth: earth,
        rays: rays,
        time: 0
    };
}

// Scène 2: Effet Photovoltaïque
function setupPhotovoltaicScene(scene, camera) {
    // Lumière
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));
    
    // Cellule photovoltaïque
    const cellGroup = new THREE.Group();
    
    // Base de silicium
    const siliconGeometry = new THREE.BoxGeometry(4, 0.5, 3);
    const siliconMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xC0C0C0,
        shininess: 100
    });
    const silicon = new THREE.Mesh(siliconGeometry, siliconMaterial);
    cellGroup.add(silicon);
    
    // Électrons
    const electrons = new THREE.Group();
    for (let i = 0; i < 15; i++) {
        const electronGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const electronMaterial = new THREE.MeshBasicMaterial({
            color: 0x00FF00,
            transparent: true,
            opacity: 0.8
        });
        const electron = new THREE.Mesh(electronGeometry, electronMaterial);
        electron.position.set(
            (Math.random() - 0.5) * 3,
            0.3,
            (Math.random() - 0.5) * 2
        );
        electrons.add(electron);
    }
    cellGroup.add(electrons);
    
    // Photons (particules de lumière)
    const photons = new THREE.Group();
    for (let i = 0; i < 10; i++) {
        const photonGeometry = new THREE.SphereGeometry(0.08, 6, 6);
        const photonMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFF00,
            transparent: true,
            opacity: 0.9
        });
        const photon = new THREE.Mesh(photonGeometry, photonMaterial);
        photon.position.set(
            (Math.random() - 0.5) * 8,
            3,
            (Math.random() - 0.5) * 2
        );
        photons.add(photon);
    }
    scene.add(photons);
    
    scene.add(cellGroup);
    
    // Stocker les objets pour l'animation
    scene.userData = {
        cellGroup: cellGroup,
        electrons: electrons,
        photons: photons
    };
}

// Scène 3: Conversion
function setupConversionScene(scene, camera) {
    // Lumière
    scene.add(new THREE.AmbientLight(0x404040));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    
    // Onduleur
    const inverterGroup = new THREE.Group();
    
    const inverterGeometry = new THREE.BoxGeometry(2, 1, 1.5);
    const inverterMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333,
        shininess: 30
    });
    const inverter = new THREE.Mesh(inverterGeometry, inverterMaterial);
    inverterGroup.add(inverter);
    
    // Lumières de l'onduleur
    const lights = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const lightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const lightMaterial = new THREE.MeshBasicMaterial({
            color: 0x00FF00,
            emissive: 0x00FF00,
            emissiveIntensity: 0.5
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set((i - 1) * 0.5, 0.6, 0.7);
        lights.add(light);
    }
    inverterGroup.add(lights);
    
    // Courant alternatif (AC) sortant
    const acGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const acGeometry = new THREE.TorusGeometry(0.8, 0.05, 8, 20);
        const acMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            transparent: true,
            opacity: 0.7
        });
        const acRing = new THREE.Mesh(acGeometry, acMaterial);
        acRing.position.set(3, 0, 0);
        acRing.rotation.x = Math.PI / 2;
        acRing.scale.set(1, 1, 1 + Math.sin(i * 0.5) * 0.2);
        acGroup.add(acRing);
    }
    
    scene.add(inverterGroup);
    scene.add(acGroup);
    
    // Stocker les objets pour l'animation
    scene.userData = {
        inverterGroup: inverterGroup,
        acGroup: acGroup,
        lights: lights,
        time: 0
    };
}

// Scène 4: Avantages
function setupAdvantagesScene(scene, camera) {
    // Lumière
    scene.add(new THREE.AmbientLight(0x404040));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);
    
    // Forêt d'arbres
    const forest = new THREE.Group();
    
    for (let i = 0; i < 20; i++) {
        const tree = createTree();
        tree.position.set(
            (Math.random() - 0.5) * 30,
            0,
            (Math.random() - 0.5) * 30
        );
        forest.add(tree);
    }
    scene.add(forest);
    
    // Particules de CO2 absorbées
    const co2Particles = new THREE.Group();
    for (let i = 0; i < 50; i++) {
        const particle = createCO2Particle();
        co2Particles.add(particle);
    }
    scene.add(co2Particles);
    
    // Stocker les objets pour l'animation
    scene.userData = {
        forest: forest,
        co2Particles: co2Particles,
        time: 0
    };
}

// Scène 5: Défis
function setupChallengesScene(scene, camera) {
    // Lumière
    scene.add(new THREE.AmbientLight(0x404040, 0.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    
    // Scénario d'intermittence
    const scenarioGroup = new THREE.Group();
    
    // Soleil
    const sun = createSun();
    sun.position.set(-5, 5, 0);
    scenarioGroup.add(sun);
    
    // Nuages
    const clouds = createClouds();
    scenarioGroup.add(clouds);
    
    // Panneau solaire
    const solarPanel = createSolarPanel();
    solarPanel.position.set(0, 0, 0);
    scenarioGroup.add(solarPanel);
    
    // Batterie de stockage
    const battery = createBattery();
    battery.position.set(5, 0, 0);
    scenarioGroup.add(battery);
    
    scene.add(scenarioGroup);
    
    // Stocker les objets pour l'animation
    scene.userData = {
        scenarioGroup: scenarioGroup,
        sun: sun,
        clouds: clouds,
        solarPanel: solarPanel,
        battery: battery,
        scenario: 'intermittence',
        time: 0
    };
}

// Scène 6: Carte Mondiale
function setupWorldMapScene(scene, camera) {
    // Lumière
    scene.add(new THREE.AmbientLight(0x404040));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    // Globe
    const globeGeometry = new THREE.SphereGeometry(3, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
        color: 0x1E90FF,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);
    
    // Points de production solaire
    const productionPoints = new THREE.Group();
    
    // Positions des principaux pays producteurs
    const countries = [
        { name: 'Chine', lat: 35, lon: 105, size: 0.4 },
        { name: 'USA', lat: 39, lon: -95, size: 0.3 },
        { name: 'Japon', lat: 36, lon: 138, size: 0.2 },
        { name: 'Allemagne', lat: 51, lon: 10, size: 0.25 },
        { name: 'Inde', lat: 20, lon: 77, size: 0.25 },
        { name: 'France', lat: 46, lon: 2, size: 0.15 },
        { name: 'Espagne', lat: 40, lon: -4, size: 0.15 }
    ];
    
    countries.forEach(country => {
        const point = createProductionPoint(country.size);
        const position = latLonToVector3(country.lat, country.lon, 3.2);
        point.position.copy(position);
        productionPoints.add(point);
    });
    
    scene.add(productionPoints);
    
    // Stocker les objets pour l'animation
    scene.userData = {
        globe: globe,
        productionPoints: productionPoints
    };
}

// Scène 7: Technologies 1 (Peinture Solaire)
function setupTech1Scene(scene, camera) {
    // Lumière
    scene.add(new THREE.AmbientLight(0x404040));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    
    // Mur avec peinture solaire
    const wallGroup = new THREE.Group();
    
    // Mur
    const wallGeometry = new THREE.BoxGeometry(4, 3, 0.2);
    const wallMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xF5F5DC,
        shininess: 30
    });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wallGroup.add(wall);
    
    // Nanoparticules dans la peinture
    const particles = new THREE.Group();
    for (let i = 0; i < 100; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: 0x1E90FF,
            transparent: true,
            opacity: 0.8
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(
            (Math.random() - 0.5) * 3.8,
            (Math.random() - 0.5) * 2.8,
            0.1
        );
        particles.add(particle);
    }
    wallGroup.add(particles);
    
    scene.add(wallGroup);
    
    // Stocker les objets pour l'animation
    scene.userData = {
        wallGroup: wallGroup,
        particles: particles,
        time: 0
    };
}

// Scène 8: Technologies 2 (Routes Solaires)
function setupTech2Scene(scene, camera) {
    // Lumière
    scene.add(new THREE.AmbientLight(0x404040));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    
    // Route solaire
    const roadGroup = new THREE.Group();
    
    // Route
    const roadGeometry = new THREE.PlaneGeometry(6, 3);
    const roadMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333,
        shininess: 10,
        side: THREE.DoubleSide
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    roadGroup.add(road);
    
    // Cellules dans la route
    const cells = new THREE.Group();
    for (let x = 0; x < 6; x++) {
        for (let z = 0; z < 3; z++) {
            const cellGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.4);
            const cellMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x1E90FF,
                emissive: 0x1a237e,
                emissiveIntensity: 0.1
            });
            const cell = new THREE.Mesh(cellGeometry, cellMaterial);
            cell.position.set(
                x - 2.5,
                0.05,
                z - 1
            );
            cells.add(cell);
        }
    }
    roadGroup.add(cells);
    
    // Véhicule
    const carGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.8);
    const carMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFF0000,
        shininess: 100
    });
    const car = new THREE.Mesh(carGeometry, carMaterial);
    car.position.y = 0.25;
    car.position.x = -3;
    roadGroup.add(car);
    
    scene.add(roadGroup);
    
    // Stocker les objets pour l'animation
    scene.userData = {
        roadGroup: roadGroup,
        cells: cells,
        car: car,
        carDirection: 1,
        time: 0
    };
}

// Scène 9: Technologies 3 (Satellites Solaires)
function setupTech3Scene(scene, camera) {
    // Lumière
    scene.add(new THREE.AmbientLight(0x404040));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    
    // Terre
    const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2196F3,
        shininess: 30
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    
    // Satellite solaire
    const satelliteGroup = new THREE.Group();
    
    // Corps du satellite
    const bodyGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333,
        shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    satelliteGroup.add(body);
    
    // Panneaux solaires
    const panelGeometry = new THREE.BoxGeometry(3, 0.1, 1.5);
    const panelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1E90FF,
        emissive: 0x1a237e,
        emissiveIntensity: 0.3
    });
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.set(-1.5, 0, 0);
    satelliteGroup.add(leftPanel);
    
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.set(1.5, 0, 0);
    satelliteGroup.add(rightPanel);
    
    // Positionner le satellite en orbite
    satelliteGroup.position.set(5, 0, 0);
    scene.add(satelliteGroup);
    
    // Rayon d'énergie vers la Terre
    const energyBeam = new THREE.Group();
    const beamGeometry = new THREE.CylinderGeometry(0.1, 0.3, 5, 8);
    const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
        transparent: true,
        opacity: 0.6
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.rotation.x = Math.PI / 2;
    beam.position.set(2.5, 0, 0);
    energyBeam.add(beam);
    scene.add(energyBeam);
    
    // Stocker les objets pour l'animation
    scene.userData = {
        earth: earth,
        satelliteGroup: satelliteGroup,
        energyBeam: energyBeam,
        time: 0
    };
}

// ============ FONCTIONS D'ANIMATION ============

// Mettre à jour une scène spécifique
function updateScene(containerId, scene) {
    const userData = scene.userData;
    if (!userData) return;
    
    switch(containerId) {
        case 'rayonnement-scene':
            updateRadiationScene(userData);
            break;
        case 'photovoltaic-scene':
            updatePhotovoltaicScene(userData);
            break;
        case 'conversion-scene':
            updateConversionScene(userData);
            break;
        case 'avantages-scene':
            updateAdvantagesScene(userData);
            break;
        case 'challenges-scene':
            updateChallengesScene(userData);
            break;
        case 'world-map-scene':
            updateWorldMapScene(userData);
            break;
        case 'tech1-scene':
            updateTech1Scene(userData);
            break;
        case 'tech2-scene':
            updateTech2Scene(userData);
            break;
        case 'tech3-scene':
            updateTech3Scene(userData);
            break;
    }
    
    // Incrémenter le temps
    if (userData.time !== undefined) {
        userData.time += 0.01;
    }
}

// Animation de la scène rayonnement
function updateRadiationScene(userData) {
    userData.sun.rotation.y += 0.01;
    userData.earth.rotation.y += 0.005;
    userData.rays.rotation.y += 0.01;
    
    // Animation des rayons
    userData.rays.children.forEach((ray, i) => {
        ray.scale.y = 1 + 0.2 * Math.sin(userData.time + i);
    });
}

// Animation de la scène photovoltaïque
function updatePhotovoltaicScene(userData) {
    userData.cellGroup.rotation.y += 0.002;
    
    // Animation des électrons
    userData.electrons.children.forEach((electron, i) => {
        electron.position.y += 0.03;
        electron.rotation.x += 0.1;
        
        if (electron.position.y > 1.5) {
            electron.position.y = 0.3;
            electron.position.x = (Math.random() - 0.5) * 3;
        }
    });
    
    // Animation des photons
    userData.photons.children.forEach((photon, i) => {
        photon.position.y -= 0.05;
        photon.rotation.x += 0.05;
        
        if (photon.position.y < -0.5) {
            photon.position.y = 3;
            photon.position.x = (Math.random() - 0.5) * 8;
        }
    });
}

// Animation de la scène conversion
function updateConversionScene(userData) {
    userData.inverterGroup.rotation.y += 0.005;
    userData.acGroup.rotation.y += 0.02;
    
    // Animation des lumières
    userData.lights.children.forEach((light, i) => {
        light.material.emissiveIntensity = 0.3 + 0.2 * Math.sin(userData.time + i);
    });
    
    // Animation des anneaux AC
    userData.acGroup.children.forEach((ring, i) => {
        ring.scale.z = 1 + Math.sin(userData.time + i) * 0.3;
        ring.position.x = 3 + Math.sin(userData.time * 2 + i) * 0.2;
    });
}

// Animation de la scène avantages
function updateAdvantagesScene(userData) {
    userData.forest.rotation.y += 0.001;
    
    // Animation des particules CO2
    userData.co2Particles.children.forEach((particle, i) => {
        particle.position.y += 0.02;
        particle.rotation.x += 0.01;
        
        if (particle.position.y > 10) {
            particle.position.y = -5;
            particle.position.x = (Math.random() - 0.5) * 15;
            particle.position.z = (Math.random() - 0.5) * 15;
        }
    });
}

// Animation de la scène défis
function updateChallengesScene(userData) {
    userData.scenarioGroup.rotation.y += 0.001;
    userData.sun.rotation.y += 0.005;
    
    if (userData.scenario === 'intermittence') {
        // Animation nuages passant devant le soleil
        userData.clouds.position.x += 0.01;
        if (userData.clouds.position.x > 10) userData.clouds.position.x = -10;
        
        // Réduire l'intensité lumineuse quand les nuages passent
        const distance = Math.abs(userData.clouds.position.x);
        const intensity = distance > 5 ? 1 : 0.3;
        userData.sun.material.emissiveIntensity = intensity;
    } else if (userData.scenario === 'storage') {
        // Animation de charge/décharge batterie
        userData.battery.rotation.y += 0.01;
        const charge = 0.5 + 0.3 * Math.sin(userData.time);
        userData.battery.scale.y = 1 + charge * 0.5;
    }
}

// Animation de la scène carte mondiale
function updateWorldMapScene(userData) {
    userData.globe.rotation.y += 0.001;
    userData.productionPoints.rotation.y += 0.001;
    
    // Animation des points
    userData.productionPoints.children.forEach((point, i) => {
        const scale = 1 + 0.2 * Math.sin(userData.time + i);
        point.scale.setScalar(scale);
    });
}

// Animation de la scène tech1
function updateTech1Scene(userData) {
    userData.wallGroup.rotation.y += 0.005;
    
    // Animation des particules
    userData.particles.children.forEach((particle, i) => {
        particle.material.opacity = 0.5 + 0.3 * Math.sin(userData.time + i);
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
    });
}

// Animation de la scène tech2
function updateTech2Scene(userData) {
    userData.roadGroup.rotation.y += 0.002;
    
    // Animation de la voiture
    userData.car.position.x += userData.carDirection * 0.05;
    
    if (userData.car.position.x > 3) {
        userData.carDirection = -1;
        userData.car.rotation.y = Math.PI;
    } else if (userData.car.position.x < -3) {
        userData.carDirection = 1;
        userData.car.rotation.y = 0;
    }
    
    // Animation des cellules sous la voiture
    userData.cells.children.forEach((cell, i) => {
        const distance = Math.abs(cell.position.x - userData.car.position.x);
        if (distance < 0.5) {
            cell.material.emissiveIntensity = 0.5;
            cell.material.color.setHex(0xFFD700);
        } else {
            cell.material.emissiveIntensity = 0.1;
            cell.material.color.setHex(0x1E90FF);
        }
    });
}

// Animation de la scène tech3
function updateTech3Scene(userData) {
    userData.earth.rotation.y += 0.005;
    userData.satelliteGroup.rotation.y += 0.01;
    
    // Rotation orbitale du satellite autour de la Terre
    const orbitRadius = 5;
    userData.satelliteGroup.position.x = Math.cos(userData.time) * orbitRadius;
    userData.satelliteGroup.position.z = Math.sin(userData.time) * orbitRadius;
    
    // Orienter les panneaux vers le soleil (direction X positive)
    userData.satelliteGroup.children.forEach(child => {
        if (child.type === 'Mesh' && child.geometry.type === 'BoxGeometry') {
            child.lookAt(new THREE.Vector3(10, 0, 0));
        }
    });
    
    // Animation du rayon d'énergie
    userData.energyBeam.position.copy(userData.satelliteGroup.position);
    userData.energyBeam.lookAt(userData.earth.position);
    
    const beam = userData.energyBeam.children[0];
    const distance = userData.satelliteGroup.position.distanceTo(userData.earth.position);
    beam.scale.y = distance / 5;
    beam.material.opacity = 0.3 + 0.3 * Math.sin(userData.time * 5);
}

// ============ FONCTIONS UTILITAIRES ============

// Créer un arbre
function createTree() {
    const group = new THREE.Group();
    
    // Tronc
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    group.add(trunk);
    
    // Feuillage
    const leavesGeometry = new THREE.ConeGeometry(1.5, 3, 8);
    const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 2.5;
    group.add(leaves);
    
    return group;
}

// Créer une particule CO2
function createCO2Particle() {
    const geometry = new THREE.SphereGeometry(0.2, 8, 8);
    const material = new THREE.MeshBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.7
    });
    const particle = new THREE.Mesh(geometry, material);
    particle.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 5 - 5,
        (Math.random() - 0.5) * 20
    );
    return particle;
}

// Créer un soleil
function createSun() {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0xFF9800,
        emissive: 0xFF5722,
        emissiveIntensity: 0.5
    });
    return new THREE.Mesh(geometry, material);
}

// Créer des nuages
function createClouds() {
    const group = new THREE.Group();
    
    for (let i = 0; i < 3; i++) {
        const cloud = createCloud();
        cloud.position.set(i * 4, Math.random() * 2, 0);
        group.add(cloud);
    }
    
    return group;
}

// Créer un nuage
function createCloud() {
    const group = new THREE.Group();
    
    for (let j = 0; j < 4; j++) {
        const sphere = new THREE.SphereGeometry(0.5 + Math.random() * 0.3, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8
        });
        const mesh = new THREE.Mesh(sphere, material);
        mesh.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 1,
            (Math.random() - 0.5) * 1
        );
        group.add(mesh);
    }
    
    return group;
}

// Créer un panneau solaire
function createSolarPanel() {
    const group = new THREE.Group();
    
    const panelGeometry = new THREE.BoxGeometry(2, 0.1, 1);
    const panelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1E90FF,
        emissive: 0x1a237e,
        emissiveIntensity: 0.1
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.rotation.x = Math.PI / 6; // Inclinaison à 30°
    group.add(panel);
    
    return group;
}

// Créer une batterie
function createBattery() {
    const group = new THREE.Group();
    
    const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    const terminalGeometry = new THREE.BoxGeometry(0.5, 0.2, 1.2);
    const terminalMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
    const terminal = new THREE.Mesh(terminalGeometry, terminalMaterial);
    terminal.position.y = 1.1;
    group.add(terminal);
    
    return group;
}

// Créer un point de production
function createProductionPoint(size) {
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshBasicMaterial({
        color: 0xFF9800,
        emissive: 0xFF5722,
        emissiveIntensity: 0.3
    });
    return new THREE.Mesh(geometry, material);
}

// Convertir latitude/longitude en position 3D
function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return new THREE.Vector3(x, y, z);
}

// ============ INTERACTIONS UTILISATEUR ============

// Changer l'intensité du rayonnement
function changeRadiationIntensity() {
    alert("L'intensité du rayonnement solaire a été modifiée!");
}

// Basculer l'animation du rayonnement
function toggleRadiationAnimation() {
    alert("Animation du rayonnement solaire basculée!");
}

// Réinitialiser la vue du rayonnement
function resetRadiationView() {
    alert("Vue du rayonnement réinitialisée!");
}

// Lancer la simulation complète
function runFullSimulation() {
    // Récupérer les valeurs des contrôles
    const intensity = document.getElementById('sun-intensity').value;
    const angle = document.getElementById('panel-angle').value;
    const temperature = document.getElementById('temperature').value;
    
    // Mettre à jour les valeurs affichées
    document.getElementById('intensity-value').textContent = `${intensity}%`;
    document.getElementById('angle-value').textContent = `${angle}°`;
    document.getElementById('temp-value').textContent = `${temperature}°C`;
    
    // Calculer les résultats simulés
    const energy = Math.round((intensity / 100) * 500 * (angle / 45));
    const efficiency = 15 + (intensity / 100) * 10;
    const co2Saved = Math.round(energy * 0.5);
    
    // Mettre à jour les résultats
    document.getElementById('energy-output-sim').textContent = `${energy} W`;
    document.getElementById('efficiency-sim').textContent = `${efficiency.toFixed(1)}%`;
    document.getElementById('co2-saved-sim').textContent = `${co2Saved} kg`;
    
    // Animation visuelle
    const simulationScene = scenes['process-simulation-scene'];
    if (simulationScene) {
        // Modifier l'animation en fonction des paramètres
        simulationScene.userData.intensity = intensity / 100;
        simulationScene.userData.angle = angle;
    }
    
    // Feedback utilisateur
    showNotification(`Simulation lancée avec Intensité: ${intensity}%, Angle: ${angle}°`);
}

// Réinitialiser la simulation
function resetSimulation() {
    // Réinitialiser les contrôles
    document.getElementById('sun-intensity').value = 70;
    document.getElementById('panel-angle').value = 30;
    document.getElementById('temperature').value = 25;
    
    // Réinitialiser les valeurs affichées
    document.getElementById('intensity-value').textContent = '70%';
    document.getElementById('angle-value').textContent = '30°';
    document.getElementById('temp-value').textContent = '25°C';
    document.getElementById('energy-output-sim').textContent = '0 W';
    document.getElementById('efficiency-sim').textContent = '0%';
    document.getElementById('co2-saved-sim').textContent = '0 kg';
    
    showNotification('Simulation réinitialisée');
}

// Calculer l'impact positif
function calculatePositiveImpact() {
    // Calculs fictifs basés sur une installation de 3 kW
    const installationSize = 3; // kW
    const hoursPerDay = 4; // heures d'ensoleillement moyen
    const daysPerYear = 365;
    
    // Calculs
    const annualProduction = installationSize * hoursPerDay * daysPerYear; // kWh/an
    const treesEquivalent = Math.round(annualProduction / 1000); // 1 arbre = 1000 kWh
    const carsRemoved = Math.round(annualProduction / 1500); // 1500 km/an par voiture
    const homesPowered = Math.round(annualProduction / 4000); // 4000 kWh/an par maison
    
    // Mettre à jour les métriques
    document.getElementById('trees-equivalent').textContent = treesEquivalent;
    document.getElementById('cars-removed').textContent = carsRemoved;
    document.getElementById('homes-powered').textContent = homesPowered;
    
    showNotification(`Impact calculé pour une installation de ${installationSize} kW`);
}

// Réinitialiser l'impact
function resetImpact() {
    document.getElementById('trees-equivalent').textContent = '0';
    document.getElementById('cars-removed').textContent = '0';
    document.getElementById('homes-powered').textContent = '0';
    showNotification('Impact réinitialisé');
}

// Changer de scénario dans la section défis
function changeScenario(scenario) {
    currentScenario = scenario;
    
    // Mettre à jour les boutons
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.scenario === scenario) {
            btn.classList.add('active');
        }
    });
    
    // Mettre à jour les informations
    const infoElement = document.getElementById('scenario-info');
    const stats = {
        intermittence: { production: '65%', lost: '35%', solution: '85%' },
        storage: { production: '92%', lost: '8%', solution: '95%' },
        recycling: { production: '98%', lost: '2%', solution: '90%' }
    };
    
    if (infoElement) {
        infoElement.innerHTML = `
            <p><strong>Scénario : ${scenario.charAt(0).toUpperCase() + scenario.slice(1)}</strong></p>
            <p>Visualisation des solutions pour optimiser la production solaire</p>
        `;
    }
    
    // Mettre à jour les statistiques
    document.getElementById('actual-production').textContent = stats[scenario].production;
    document.getElementById('lost-potential').textContent = stats[scenario].lost;
    document.getElementById('solution-efficiency').textContent = stats[scenario].solution;
    
    // Mettre à jour la scène 3D
    const challengeScene = scenes['challenges-scene'];
    if (challengeScene && challengeScene.scene.userData) {
        challengeScene.scene.userData.scenario = scenario;
    }
    
    showNotification(`Scénario changé : ${scenario}`);
}

// Voler vers un pays sur la carte
function flyToCountry() {
    const select = document.getElementById('country-select');
    const selectedCountry = select.value;
    
    if (!selectedCountry) {
        showNotification('Veuillez sélectionner un pays');
        return;
    }
    
    const countryData = {
        china: { name: 'Chine', capacity: '392 GW', share: '30% mondial' },
        usa: { name: 'États-Unis', capacity: '149 GW', share: '11% mondial' },
        japan: { name: 'Japon', capacity: '84 GW', share: '6% mondial' },
        germany: { name: 'Allemagne', capacity: '68 GW', share: '5% mondial' },
        india: { name: 'Inde', capacity: '66 GW', share: '5% mondial' },
        france: { name: 'France', capacity: '18 GW', share: '1.4% mondial' },
        spain: { name: 'Espagne', capacity: '27 GW', share: '2% mondial' },
        australia: { name: 'Australie', capacity: '29 GW', share: '2.2% mondial' }
    };
    
    const data = countryData[selectedCountry];
    const infoElement = document.getElementById('country-info');
    
    if (infoElement && data) {
        infoElement.innerHTML = `
            <h5><i class="fas fa-info-circle"></i> ${data.name}</h5>
            <p><strong>Capacité installée :</strong> ${data.capacity}</p>
            <p><strong>Part mondiale :</strong> ${data.share}</p>
            <p><strong>Croissance annuelle :</strong> +10-15%</p>
            <p><strong>Objectif 2030 :</strong> Doublement prévu</p>
        `;
    }
    
    showNotification(`Navigation vers ${data.name}`);
}

// Changer de slide dans le carrousel des technologies
function changeTechSlide(direction) {
    const slides = document.querySelectorAll('.tech-slide');
    const dots = document.querySelectorAll('.dot');
    
    // Masquer la slide actuelle
    slides[currentTechSlide].classList.remove('active');
    dots[currentTechSlide].classList.remove('active');
    
    // Calculer la nouvelle slide
    if (direction === 'next') {
        currentTechSlide = (currentTechSlide + 1) % slides.length;
    } else if (direction === 'prev') {
        currentTechSlide = (currentTechSlide - 1 + slides.length) % slides.length;
    } else {
        currentTechSlide = direction;
    }
    
    // Afficher la nouvelle slide
    slides[currentTechSlide].classList.add('active');
    dots[currentTechSlide].classList.add('active');
    
    showNotification(`Technologie ${currentTechSlide + 1} sur ${slides.length}`);
}

// ============ INITIALISATION DE L'INTERFACE ============

// Initialiser la navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fermer le menu au clic sur un lien
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Initialiser les écouteurs d'événements pour les scénarios
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            changeScenario(this.dataset.scenario);
        });
    });
    
    // Initialiser le sélecteur de pays
    const countrySelect = document.getElementById('country-select');
    const flyBtn = document.getElementById('fly-to-country');
    
    if (countrySelect && flyBtn) {
        flyBtn.addEventListener('click', flyToCountry);
        countrySelect.addEventListener('change', function() {
            if (this.value) {
                flyBtn.disabled = false;
            } else {
                flyBtn.disabled = true;
            }
        });
    }
    
    // Initialiser le carrousel des technologies
    const prevBtn = document.querySelector('.tech-nav.prev');
    const nextBtn = document.querySelector('.tech-nav.next');
    const techDots = document.querySelectorAll('.dot');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => changeTechSlide('prev'));
        nextBtn.addEventListener('click', () => changeTechSlide('next'));
    }
    
    if (techDots) {
        techDots.forEach((dot, index) => {
            dot.addEventListener('click', () => changeTechSlide(index));
        });
    }
}

// Initialiser les animations de nombres
function animateNumbers() {
    const numberElements = document.querySelectorAll('.stat-value[data-count], .data-number[data-count]');
    
    numberElements.forEach(element => {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 secondes
        const steps = 60; // Nombre d'étapes
        const increment = target / steps;
        let current = 0;
        let step = 0;
        
        const updateNumber = () => {
            if (step < steps) {
                current += increment;
                step++;
                
                // Formater le nombre
                let displayValue;
                if (target >= 1000) {
                    displayValue = Math.floor(current).toLocaleString();
                } else if (target % 1 !== 0) {
                    displayValue = current.toFixed(1);
                } else {
                    displayValue = Math.floor(current);
                }
                
                element.textContent = displayValue;
                setTimeout(updateNumber, duration / steps);
            } else {
                // Assurer la valeur finale exacte
                if (target >= 1000) {
                    element.textContent = target.toLocaleString();
                } else if (target % 1 !== 0) {
                    element.textContent = target.toFixed(1);
                } else {
                    element.textContent = target;
                }
            }
        };
        
        // Observer pour déclencher l'animation quand l'élément est visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateNumber();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
}

// Afficher une notification
function showNotification(message) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    // Styles CSS pour la notification
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius-sm);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        box-shadow: var(--shadow-md);
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Ajouter au document
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ============ INITIALISATION AU CHARGEMENT ============

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser AOS (Animation On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
    
    // Initialiser l'interface
    initNavigation();
    animateNumbers();
    
    // Démarrer les scènes 3D avec un délai pour éviter les conflits
    setTimeout(() => {
        initAll3DScenes();
    }, 500);
    
    // Optimiser les performances sur mobile
    if (window.innerWidth < 768) {
        document.querySelectorAll('canvas').forEach(canvas => {
            canvas.style.maxWidth = '100%';
        });
    }
    
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        // Réinitialiser les scènes si la fenêtre est redimensionnée
        Object.values(scenes).forEach(scene => {
            if (scene && scene.renderer) {
                const container = scene.renderer.domElement.parentElement;
                if (container) {
                    scene.camera.aspect = container.clientWidth / container.clientHeight;
                    scene.camera.updateProjectionMatrix();
                    scene.renderer.setSize(container.clientWidth, container.clientHeight);
                }
            }
        });
    });
});

// Fonction pour montrer les sources (à compléter)
function showSources() {
    showNotification('Les sources seront affichées dans une future mise à jour.');
}

// Fonction pour montrer l'équipe (à compléter)
function showTeam() {
    showNotification('Information sur l\'équipe disponible prochainement.');
}