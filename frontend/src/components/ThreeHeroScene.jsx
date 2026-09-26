import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useUIStore } from '../store/useUIStore';

export default function ThreeHeroScene({ className = '', style = {} }) {
  const mountRef = useRef(null);
  const { theme } = useUIStore();
  const sceneRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // 1. Core 3D Geometry: Multi-faceted Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const wireframeGeo = new THREE.WireframeGeometry(coreGeo);

    const wireColor = isLight ? 0x6366f1 : 0xc026d3;
    const coreWireMat = new THREE.LineBasicMaterial({
      color: wireColor,
      transparent: true,
      opacity: isLight ? 0.75 : 0.65,
      linewidth: 1.5,
    });
    const wireMesh = new THREE.LineSegments(wireframeGeo, coreWireMat);
    scene.add(wireMesh);

    // Inner Glowing Translucent Core Sphere
    const innerGeo = new THREE.IcosahedronGeometry(0.9, 2);
    const innerMat = new THREE.MeshPhongMaterial({
      color: isLight ? 0x7c3aed : 0xec4899,
      emissive: isLight ? 0x4338ca : 0x7c3aed,
      emissiveIntensity: isLight ? 0.4 : 0.8,
      transparent: true,
      opacity: isLight ? 0.25 : 0.35,
      wireframe: true,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // 2. Vertex Floating Node Points
    const pointsMat = new THREE.PointsMaterial({
      color: isLight ? 0x0284c7 : 0x06b6d4,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
    });
    const pointsMesh = new THREE.Points(coreGeo, pointsMat);
    scene.add(pointsMesh);

    // 3. Orbiting Rings (3D Gyroscope Effect)
    const ringGeo1 = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: isLight ? 0x8b5cf6 : 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.35, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: isLight ? 0xec4899 : 0xf472b6,
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 4. Background Particle Constellation
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isLight ? 0x9333ea : 0xc084fc,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xc026d3, 2, 50);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 1.5, 50);
    pointLight2.position.set(-3, -3, 2);
    scene.add(pointLight2);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) * 0.001;
      mouseY = (event.clientY - windowHalfY) * 0.001;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop with Smooth Damping
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Lerp mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotate Wireframe Core
      wireMesh.rotation.x += 0.003;
      wireMesh.rotation.y += 0.004;
      pointsMesh.rotation.x = wireMesh.rotation.x;
      pointsMesh.rotation.y = wireMesh.rotation.y;

      innerMesh.rotation.x -= 0.004;
      innerMesh.rotation.z += 0.003;

      // Orbiting rings rotation
      ring1.rotation.z += 0.006;
      ring1.rotation.y += 0.003;
      ring2.rotation.z -= 0.005;
      ring2.rotation.x += 0.004;

      // Subtle particle float
      particleSystem.rotation.y += 0.0008;

      // Camera parallax tilt
      camera.position.x = targetX * 1.5;
      camera.position.y = -targetY * 1.5;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose resources
      coreGeo.dispose();
      wireframeGeo.dispose();
      innerGeo.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      particleGeo.dispose();
      coreWireMat.dispose();
      innerMat.dispose();
      pointsMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
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
        minHeight: '360px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}
