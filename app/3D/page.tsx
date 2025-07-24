"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";


function AnimatedDevice() {
  const { scene } = useGLTF("/model.glb");
  const ref = useRef();
  
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });
  
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.metalness = 0.7;
            child.material.roughness = 0.3;
          }
        }
      });
    }
  }, [scene]);
  
  return <primitive object={scene} ref={ref} scale={[1.5, 1.5, 1.5]} position={[0, -0.2, 0]} />;
}


function ModelAnchors() {
  const anchors = [
    { id: "processor", pos: [-0.8, 0.4, -0.3] },
    { id: "specs", pos: [0.8, 0.4, -0.3] },
    { id: "threat", pos: [-0.8, -0.6, 0.3] },
    { id: "intelligence", pos: [0.8, -0.6, 0.3] }
  ];

  return (
    <>
      {anchors.map((anchor) => (
        <Html
          key={anchor.id}
          position={anchor.pos}
          zIndexRange={[12, 20]}
          transform
          occlude={false}
          distanceFactor={10}
          style={{ opacity: 0 }}
        >
          <div 
            id={`anchor-${anchor.id}`} 
            className="relative"
          >
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg relative z-10"
              style={{ 
                boxShadow: '0 0 20px rgba(234, 179, 8, 0.8), 0 0 40px rgba(234, 179, 8, 0.4)'
              }}
            />
            <div className="absolute inset-0 w-6 h-6 bg-yellow-400 rounded-full opacity-20 animate-ping -top-1 -left-1"></div>
          </div>
        </Html>
      ))}
    </>
  );
}


function LineConnector({ start, end }) {
  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 15
      }}>
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(234, 179, 8, 0.8)" />
          <stop offset="50%" stopColor="rgba(234, 179, 8, 0.4)" />
          <stop offset="100%" stopColor="rgba(234, 179, 8, 0.1)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <line
        x1={start[0]}
        y1={start[1]}
        x2={end[0]}
        y2={end[1]}
        stroke="url(#lineGradient)"
        strokeWidth="2"
        opacity="0.8"
        filter="url(#glow)"
        strokeDasharray="5,5"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;10"
          dur="1s"
          repeatCount="indefinite"
        />
      </line>
    </svg>
  );
}


function InfoCard({ id, title, items, position, anchor }) {
  const [lineCoords, setLineCoords] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    function updateLine() {
      const anchorEl = document.getElementById(`anchor-${anchor}`);
      const cardEl = document.getElementById(`card-${id}`);
      if (anchorEl && cardEl) {
        const a = anchorEl.getBoundingClientRect();
        const c = cardEl.getBoundingClientRect();
        setLineCoords({
          start: [a.left + a.width / 2, a.top + a.height / 2],
          end: [c.left + c.width / 2, c.top + c.height / 2]
        });
      }
    }
    
    updateLine();
    const interval = setInterval(updateLine, 100);
    return () => clearInterval(interval);
  }, [anchor, id]);

  return (
    <>
      {lineCoords && <LineConnector start={lineCoords.start} end={lineCoords.end} />}
      <div
        id={`card-${id}`}
        className={`absolute text-white shadow-2xl backdrop-blur-lg transition-all duration-300 transform ${
          isHovered ? 'scale-105 shadow-yellow-500/20' : ''
        }`}
        style={{
          ...position,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          borderLeft: '5px solid #eab308',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(234, 179, 8, 0.1)',
          padding: '24px'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              {title}
            </h3>
          </div>
          <div className="h-px bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent mb-5"></div>
          
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm group">
                <div className="mt-1.5">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full group-hover:bg-yellow-300 transition-colors duration-200"></div>
                </div>
                <span className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-200">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          
          
          <div className="absolute top-0 right-0 w-8 h-8 opacity-20">
            <div className="absolute top-2 right-2 w-4 h-px bg-yellow-400 transform rotate-45"></div>
            <div className="absolute top-2 right-2 w-px h-4 bg-yellow-400 transform rotate-45"></div>
          </div>
        </div>
      </div>
    </>
  );
}

function FeatureGrid() {
  const features = [
    {
      icon: "🛡️",
      title: "Bullet-Proof Weapon Detection",
      desc: "MandlacX is trained to detect firearms, knives, and other sharp threats with precision—no internet required."
    },
    {
      icon: "📊",
      title: "Bandwidth You Can Actually Afford",
      desc: "No continuous streaming. No heavy uploads. Just efficient edge computing that saves your network and your budget."
    },
    {
      icon: "🔒",
      title: "Privacy by Design",
      desc: "Your footage stays on-site. No cloud syncs, no external servers—just full control over your data."
    },
    {
      icon: "⚡",
      title: "Future-Proof AI Stack",
      desc: "With modular AI models and local firmware updates, MandlacX is built to evolve with your needs—no dependency on cloud upgrades."
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-6 mt-8">
      {features.map((feature, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-2xl mb-3">{feature.icon}</div>
          <h4 className="text-white font-bold text-lg mb-3">{feature.title}</h4>
          <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default function MandlacX3DPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <div className="text-center py-8">
        <div className="text-yellow-500 text-sm font-semibold tracking-widest uppercase mb-4">
          THE FUTURE OF ON-SITE AI SURVEILLANCE
        </div>
        <h1 className="text-6xl font-bold mb-2">
          MandlacX Edge <span className="italic text-yellow-500">Processor</span>
        </h1>
      </div>

      {/* Main 3D Section */}
      <div className="relative h-screen">
        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [3, 2, 4], fov: 50 }}
          style={{ width: "100%", height: "100%", position: "absolute", zIndex: 10 }}
          shadows
        >
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -5]} intensity={0.3} />
          
          <Environment preset="city" background={false} />
          
          <Suspense fallback={null}>
            <AnimatedDevice />
            <ModelAnchors />
          </Suspense>
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            target={[0, 0, 0]}
            minDistance={4}
            maxDistance={10}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>

        {/* Info Cards */}
        <InfoCard
          id="processor"
          title="MandlacX Edge Processor"
          items={[
            "A multi-domain, first-generation AI-powered device designed for real-time threat detection."
          ]}
          position={{ top: "15%", left: "5%", width: "300px", zIndex: 30 }}
          anchor="processor"
        />

        <InfoCard
          id="specs"
          title="Key Specifications"
          items={[
            "USB 3.0 Support",
            "16 GB RAM",
            "A7 Cortex Processor", 
            "Three multi-axis surveillance lenses"
          ]}
          position={{ top: "15%", right: "5%", width: "300px", zIndex: 30 }}
          anchor="specs"
        />

        <InfoCard
          id="threat"
          title="Real-Time Threat Detection"
          items={[
            "Intrusions",
            "Firearms & Sharp Objects",
            "Human Falls",
            "Unusual or Aggressive Motion"
          ]}
          position={{ bottom: "25%", left: "5%", width: "300px", zIndex: 30 }}
          anchor="threat"
        />

        <InfoCard
          id="intelligence"
          title="On-Device Intelligence"
          items={[
            "Engineered to deliver intelligent surveillance without relying on the cloud, it gives you control, speed, and reliability right where you need it."
          ]}
          position={{ bottom: "25%", right: "5%", width: "300px", zIndex: 30 }}
          anchor="intelligence"
        />
      </div>

      {/* Bottom Section */}
      <div className="px-8 py-16">
        {/* MandlacX Over Cloud-Only Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-left">
            MandlacX Over<br />
            Cloud-Only<br />
            Video Analytics
          </h2>

          <FeatureGrid />
        </div>

        {/* Final Section */}
        <div className="max-w-6xl mx-auto mt-16 flex items-center justify-between">
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
              <div className="text-yellow-500 text-2xl mb-3">⚡</div>
              <h4 className="text-white font-bold text-lg mb-3">
                Latency That Saves Seconds—and Lives
              </h4>
              <p className="text-gray-400 text-sm">
                Instant on-device processing means faster alerts and quicker interventions during critical moments.
              </p>
            </div>
          </div>
          
          <div className="flex-1 text-center px-8">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
              <Canvas
                camera={{ position: [2, 1, 2], fov: 45 }}
                style={{ width: "200px", height: "150px", margin: "0 auto" }}
              >
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <Suspense fallback={null}>
                  <AnimatedDevice />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
              </Canvas>
            </div>
          </div>
          
          <div className="flex-1 text-right">
            <h3 className="text-4xl font-bold mb-4 italic">
              Built for Speed.<br />
              Designed for<br />
              Action.
            </h3>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @media (max-width: 1200px) {
          .absolute[style*="width: 300px"] {
            width: 280px !important;
          }
        }

        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
          
          .absolute[style*="width: 300px"] {
            position: static !important;
            width: 100% !important;
            margin: 20px auto !important;
            max-width: 350px !important;
          }
          
          .text-6xl {
            font-size: 3rem !important;
          }
          
          .flex-1 {
            flex: none !important;
            width: 100% !important;
            margin-bottom: 2rem !important;
          }
          
          .max-w-6xl.mx-auto.mt-16.flex {
            flex-direction: column !important;
          }
        }

        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
}