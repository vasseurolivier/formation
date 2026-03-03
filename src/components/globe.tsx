"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function createCurve(start: THREE.Vector3, end: THREE.Vector3) {
  const distance = start.distanceTo(end);
  const mid = start.clone().lerp(end, 0.5);
  const midLength = mid.length();
  mid.normalize();
  mid.multiplyScalar(midLength + distance * 0.4);

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return curve;
}

export function Globe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Globe
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: 0x0b1a33,
      shininess: 10,
      transparent: true,
      opacity: 0.8,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Wireframe
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
    });
    const wireframe = new THREE.Mesh(globeGeometry, wireframeMaterial);
    globe.add(wireframe);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Points and Arcs
    const locations = {
        france: { lat: 46.2, lon: 2.2 }, // France
        china: { lat: 35.8, lon: 104.1 }, // China
        sea: { lat: 10.0, lon: 108.0 }, // Southeast Asia
    };

    const toVector3 = (lat: number, lon: number, radius = 1) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            -radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    };

    const franceVec = toVector3(locations.france.lat, locations.france.lon);
    const chinaVec = toVector3(locations.china.lat, locations.china.lon);
    const seaVec = toVector3(locations.sea.lat, locations.sea.lon);

    const points = [franceVec, chinaVec, seaVec];
    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    points.forEach(p => {
        const pointGeom = new THREE.SphereGeometry(0.015, 16, 16);
        const pointMesh = new THREE.Mesh(pointGeom, pointMaterial);
        pointMesh.position.copy(p);
        globe.add(pointMesh);
    });

    const arcMaterial = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.7 });
    
    const arcs = [
        createCurve(franceVec, chinaVec),
        createCurve(franceVec, seaVec),
        createCurve(chinaVec, seaVec),
    ];
    
    arcs.forEach(arc => {
        const tubeGeom = new THREE.TubeGeometry(arc, 64, 0.005, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeom, arcMaterial);
        globe.add(tubeMesh);
    });

    // Handle Resize
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
