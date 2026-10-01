import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useUIStore } from '../store/useUIStore';

export default function ThreeHeroScene({ className = '', style = {} }) {
  const mountRef = useRef(null);
  const { theme } = useUIStore();
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    // 1. Scene, Camera, High-Fidelity WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.6);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // 2. Multi-point Dynamic Studio Lighting
    const ambientLight = new THREE.AmbientLight(isLight ? 0xffffff : 0x1e1b4b, isLight ? 1.6 : 1.2);
    scene.add(ambientLight);

    // Dynamic Tracking Key Light (Neon Violet)
    const keyLight = new THREE.PointLight(isLight ? 0x8b5cf6 : 0xa855f7, 4.5, 45);
    keyLight.position.set(3.5, 3.5, 4);
    scene.add(keyLight);

    // High-energy Cool Rim Light (Electric Cyan)
    const rimLight = new THREE.PointLight(isLight ? 0x0284c7 : 0x06b6d4, 4.0, 45);
    rimLight.position.set(-4, -2.5, 3.5);
    scene.add(rimLight);

    // Warm Magenta Accent Light (Neon Fuchsia)
    const accentLight = new THREE.PointLight(isLight ? 0xec4899 : 0xf43f5e, 3.2, 35);
    accentLight.position.set(0, -4, -2.5);
    scene.add(accentLight);

    // Backfill Ethereal Light (Soft Emerald / Topaz)
    const backLight = new THREE.PointLight(isLight ? 0x10b981 : 0x34d399, 2.5, 30);
    backLight.position.set(0, 4.5, -3);
    scene.add(backLight);

    // 3. Central Refractive Crystalline Faceted Diamond Core
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // A. Outer Optical Glass Faceted Icosahedron (Physical Refraction)
    const glassGeo = new THREE.IcosahedronGeometry(1.35, 0); // Faceted jewel cut
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: isLight ? 0xf8fafc : 0xffffff,
      transmission: isLight ? 0.88 : 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.06,
      ior: 1.55, // Optical crown glass
      thickness: 1.6,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      attenuationColor: isLight ? new THREE.Color(0x9333ea) : new THREE.Color(0xa855f7),
      attenuationDistance: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      flatShading: true,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    coreGroup.add(glassMesh);

    // B. Inner Glowing Polyhedral Plasma Gem
    const innerGemGeo = new THREE.OctahedronGeometry(0.78, 0);
    const innerGemMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x7c3aed : 0x06b6d4,
      emissive: isLight ? 0x6d28d9 : 0x0891b2,
      emissiveIntensity: 1.6,
      roughness: 0.2,
      metalness: 0.85,
      flatShading: true,
    });
    const innerGem = new THREE.Mesh(innerGemGeo, innerGemMat);
    coreGroup.add(innerGem);

    // C. Outer Cyber Wireframe Lattice with Glowing Edge Highlights
    const latticeGeo = new THREE.IcosahedronGeometry(1.52, 1);
    const wireframeGeo = new THREE.WireframeGeometry(latticeGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: isLight ? 0x6366f1 : 0xec4899,
      transparent: true,
      opacity: isLight ? 0.75 : 0.65,
      linewidth: 2,
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);
    coreGroup.add(wireframeMesh);

    // D. Vertex Hologram Node Points
    const nodePointsMat = new THREE.PointsMaterial({
      color: isLight ? 0x06b6d4 : 0x38bdf8,
      size: 0.09,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const nodePoints = new THREE.Points(latticeGeo, nodePointsMat);
    coreGroup.add(nodePoints);

    // 4. Triple-Axis Kinetic Gyroscope Orbit Rings (Scrolltide 3D signature)
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    // Ring 1 (Primary Cyan/Electric Ring)
    const ringGeo1 = new THREE.TorusGeometry(2.18, 0.022, 16, 140);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: isLight ? 0x7c3aed : 0x06b6d4,
      emissive: isLight ? 0x6d28d9 : 0x0891b2,
      emissiveIntensity: 1.1,
      roughness: 0.18,
      metalness: 0.95,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const satGeo1 = new THREE.SphereGeometry(0.1, 16, 16);
    const satMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const satellite1 = new THREE.Mesh(satGeo1, satMat1);
    ringGroup.add(satellite1);

    // Ring 2 (Secondary Fuchsia/Pink Ring)
    const ringGeo2 = new THREE.TorusGeometry(2.52, 0.018, 16, 140);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: isLight ? 0xdb2777 : 0xec4899,
      emissive: isLight ? 0xbe185d : 0xc026d3,
      emissiveIntensity: 0.9,
      roughness: 0.18,
      metalness: 0.95,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 3.6;
    ringGroup.add(ring2);

    const satGeo2 = new THREE.SphereGeometry(0.085, 16, 16);
    const satMat2 = new THREE.MeshBasicMaterial({ color: 0xf472b6 });
    const satellite2 = new THREE.Mesh(satGeo2, satMat2);
    ringGroup.add(satellite2);

    // Ring 3 (Outer Emerald/Teal Orbit Ring)
    const ringGeo3 = new THREE.TorusGeometry(2.85, 0.014, 16, 140);
    const ringMat3 = new THREE.MeshStandardMaterial({
      color: isLight ? 0x059669 : 0x10b981,
      emissive: isLight ? 0x047857 : 0x059669,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.9,
    });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.z = Math.PI / 4;
    ring3.rotation.x = -Math.PI / 5;
    ringGroup.add(ring3);

    const satGeo3 = new THREE.SphereGeometry(0.075, 16, 16);
    const satMat3 = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const satellite3 = new THREE.Mesh(satGeo3, satMat3);
    ringGroup.add(satellite3);

    // 5. Ambient 3D Particle Galaxy (Space Dust Nebula with Wave Dynamics)
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);
    const initialCoords = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particleCoords[idx] = (Math.random() - 0.5) * 11;
      particleCoords[idx + 1] = (Math.random() - 0.5) * 10;
      particleCoords[idx + 2] = (Math.random() - 0.5) * 8;

      initialCoords[idx] = particleCoords[idx];
      initialCoords[idx + 1] = particleCoords[idx + 1];
      initialCoords[idx + 2] = particleCoords[idx + 2];
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isLight ? 0x8b5cf6 : 0xc084fc,
      size: 0.065,
      transparent: true,
      opacity: isLight ? 0.8 : 0.9,
      blending: THREE.AdditiveBlending,
    });
    const particleGalaxy = new THREE.Points(particleGeo, particleMat);
    scene.add(particleGalaxy);

    // 6. Interactive Cursor Tracking & Drag Momentum Physics
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollBoost = 0;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (clientX - halfW) / halfW;
      mouseY = (clientY - halfH) / halfH;

      if (isDragging) {
        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;

        coreGroup.rotation.y += deltaX * 0.015;
        coreGroup.rotation.x += deltaY * 0.015;
        ringGroup.rotation.y += deltaX * 0.01;

        dragVelocity = { x: deltaX * 0.008, y: deltaY * 0.008 };
        previousMousePosition = { x: clientX, y: clientY };
      }
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = Math.abs(currentScroll - lastScrollY);
      scrollBoost = Math.min(scrollBoost + delta * 0.002, 0.06);
      lastScrollY = currentScroll;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('mousedown', handleMouseDown);

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 7. Render Animation Loop with Harmonic Oscillations
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Elastic Spring Damping towards mouse
      targetX += (mouseX - targetX) * 0.055;
      targetY += (mouseY - targetY) * 0.055;

      // Inertial decay from drag
      dragVelocity.x *= 0.95;
      dragVelocity.y *= 0.95;
      coreGroup.rotation.y += dragVelocity.x;
      coreGroup.rotation.x += dragVelocity.y;

      // Scroll speed decay
      scrollBoost *= 0.93;
      const currentSpeed = 0.006 + scrollBoost;

      // Continuous rotation of central faceted glass crystal
      coreGroup.rotation.y += currentSpeed;
      if (!isDragging) {
        coreGroup.rotation.x = THREE.MathUtils.lerp(coreGroup.rotation.x, targetY * 0.45, 0.05);
        coreGroup.rotation.z = THREE.MathUtils.lerp(coreGroup.rotation.z, -targetX * 0.45, 0.05);
      }

      // Counter-rotation of inner gem
      innerGem.rotation.y -= currentSpeed * 1.5;
      innerGem.rotation.z += 0.004;

      // Harmonic breathing of inner plasma core
      const pulse = 1 + Math.sin(elapsedTime * 2.8) * 0.08;
      innerGem.scale.set(pulse, pulse, pulse);

      // Counter-rotating Gyroscope Rings
      ring1.rotation.z += 0.009 + scrollBoost;
      ring1.rotation.y += 0.004;
      ring2.rotation.z -= 0.007 + scrollBoost;
      ring2.rotation.x += 0.006;
      ring3.rotation.y += 0.005 + scrollBoost;
      ring3.rotation.z += 0.005;

      // Update Orbiting Satellites on Ring Trajectories
      const satAngle1 = elapsedTime * 1.6;
      satellite1.position.set(
        Math.cos(satAngle1) * 2.18,
        Math.sin(satAngle1) * 2.18 * Math.sin(Math.PI / 3),
        Math.sin(satAngle1) * 2.18 * Math.cos(Math.PI / 3)
      );

      const satAngle2 = -elapsedTime * 1.25;
      satellite2.position.set(
        Math.cos(satAngle2) * 2.52 * Math.cos(Math.PI / 3.6),
        Math.sin(satAngle2) * 2.52,
        Math.cos(satAngle2) * 2.52 * Math.sin(Math.PI / 3.6)
      );

      const satAngle3 = elapsedTime * 0.95;
      satellite3.position.set(
        Math.cos(satAngle3) * 2.85 * Math.cos(Math.PI / 4),
        Math.sin(satAngle3) * 2.85 * Math.sin(Math.PI / 4),
        Math.sin(satAngle3) * 2.85 * Math.cos(-Math.PI / 5)
      );

      // Particle Nebula Wave Dispersion
      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const initY = initialCoords[idx + 1];
        const wave = Math.sin(elapsedTime * 1.4 + initialCoords[idx] * 0.8) * 0.22;
        posAttr.setY(i, initY + wave);
      }
      posAttr.needsUpdate = true;
      particleGalaxy.rotation.y += 0.0008;

      // Dynamic Studio Light Orbiting
      keyLight.position.x = 3.5 + Math.cos(elapsedTime * 0.8) * 1.5 + targetX * 2.0;
      keyLight.position.y = 3.5 + Math.sin(elapsedTime * 0.8) * 1.5 - targetY * 2.0;

      rimLight.position.x = -4.0 + Math.sin(elapsedTime * 0.7) * 1.5;
      rimLight.position.y = -2.5 + Math.cos(elapsedTime * 0.7) * 1.5;

      // Responsive 3D Camera Pan
      camera.position.x = targetX * 1.4;
      camera.position.y = -targetY * 1.0;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 8. Memory Management & WebGL Context Teardown
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      glassGeo.dispose();
      glassMat.dispose();
      innerGemGeo.dispose();
      innerGemMat.dispose();
      latticeGeo.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      nodePointsMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      satGeo1.dispose();
      satMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      satGeo2.dispose();
      satMat2.dispose();
      ringGeo3.dispose();
      ringMat3.dispose();
      satGeo3.dispose();
      satMat3.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className={`three-hero-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '460px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: isInteracting ? 'grabbing' : 'grab',
        ...style,
      }}
      title="Click and drag to rotate the 3D Cyber Core"
    />
  );
}
