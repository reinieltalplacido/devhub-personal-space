
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function AnimatedPoints() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random points
  const [positions] = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return [positions];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.1;
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
      
      // Add scroll-based animation
      const scrollY = window.scrollY;
      ref.current.rotation.z = scrollY * 0.0001;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color="#8b5cf6"
        size={0.02}
        sizeAttenuation={true}
      />
    </points>
  );
}

function FloatingCubes() {
  const cubes = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cubes.current) {
      cubes.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      cubes.current.rotation.y = state.clock.elapsedTime * 0.1;
      
      // Scroll-based movement
      const scrollY = window.scrollY;
      cubes.current.position.y = scrollY * 0.001;
    }
  });

  return (
    <group ref={cubes}>
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 2) * 3,
            Math.cos(i * 2) * 2,
            Math.sin(i) * 2
          ]}
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial 
            color={`hsl(${250 + i * 20}, 70%, 60%)`}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

const ThreeScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <AnimatedPoints />
      <FloatingCubes />
    </Canvas>
  );
};

export default ThreeScene;
