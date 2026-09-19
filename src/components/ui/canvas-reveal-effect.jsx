import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

/**
 * High-performance WebGL Shader for the Dot Matrix Reveal Effect
 */
export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[16, 185, 129]], // Default emerald
  containerClassName,
  dotSize = 3,
  showGradient = true,
}) => {
  return (
    <div className={cn("h-full relative w-full overflow-hidden", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors}
          dotSize={dotSize}
          opacities={opacities}
          animationSpeed={animationSpeed}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
};

const DotMatrix = ({
  colors = [[16, 185, 129]],
  opacities = [0.08, 0.08, 0.12, 0.15, 0.2, 0.3, 0.4, 0.6, 0.8, 1],
  totalSize = 4,
  dotSize = 2,
  animationSpeed = 0.4,
  center = ["x", "y"],
}) => {
  const uniforms = useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length >= 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }

    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
      u_speed: {
        value: animationSpeed,
        type: "uniform1f",
      },
    };
  }, [colors, opacities, totalSize, dotSize, animationSpeed]);

  return (
    <Shader
      uniforms={uniforms}
      maxFps={60}
      center={center}
    />
  );
};

const ShaderMaterial = ({ uniforms, maxFps = 60, center = ["x", "y"] }) => {
  const { size } = useThree();
  const ref = useRef();
  let lastFrameTime = 0;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    if (timestamp - lastFrameTime < 1 / maxFps) {
      return;
    }
    lastFrameTime = timestamp;

    if (ref.current.material && ref.current.material.uniforms.u_time) {
      ref.current.material.uniforms.u_time.value = timestamp;
    }
  });

  const getUniforms = () => {
    const preparedUniforms = {};

    for (const uniformName in uniforms) {
      const uniform = uniforms[uniformName];
      if (uniform.type === "uniform1f") {
        preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
      } else if (uniform.type === "uniform1fv") {
        preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
      } else if (uniform.type === "uniform3fv") {
        preparedUniforms[uniformName] = {
          value: uniform.value.map((v) => new THREE.Vector3().fromArray(v)),
          type: "3fv",
        };
      }
    }

    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    };
    return preparedUniforms;
  };

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        precision mediump float;
        in vec2 coordinates;
        uniform vec2 u_resolution;
        out vec2 fragCoord;
        void main(){
          gl_Position = vec4(position.x, position.y, 0.0, 1.0);
          fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
          fragCoord.y = u_resolution.y - fragCoord.y;
        }
      `,
      fragmentShader: `
        precision mediump float;
        in vec2 fragCoord;
        uniform float u_time;
        uniform float u_speed;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
          return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }

        void main() {
          vec2 st = fragCoord.xy;
          ${center.includes("x") ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));" : ""}
          ${center.includes("y") ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));" : ""}
          
          float opacity = step(0.0, st.x) * step(0.0, st.y);
          vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

          float frequency = 3.0;
          float show_offset = random(st2);
          float rand = random(st2 * floor((u_time * u_speed / frequency) + show_offset + frequency) + 1.0);
          opacity *= u_opacities[int(clamp(rand * 10.0, 0.0, 9.0))];
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

          vec3 color = u_colors[int(clamp(show_offset * 6.0, 0.0, 5.0))];
          fragColor = vec4(color, opacity);
          fragColor.rgb *= fragColor.a;
        }
      `,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
      transparent: true,
    });
  }, [size.width, size.height, uniforms, center]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader = ({ uniforms, maxFps = 60, center }) => {
  return (
    <Canvas 
      className="absolute inset-0 h-full w-full pointer-events-none"
      gl={{ alpha: true, antialias: false }}
    >
      <ShaderMaterial uniforms={uniforms} maxFps={maxFps} center={center} />
    </Canvas>
  );
};

export const CornerIcon = ({ className, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

/**
 * Interactive Lead Card with Canvas Reveal Effect
 */
export const LeadCard = ({
  title,
  role,
  icon,
  badge,
  bullets = [],
  actionLabel,
  onAction,
  children,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-emerald-500/30 group/canvas-card flex flex-col justify-between bg-[#022c22]/80 backdrop-blur-xl rounded-2xl max-w-sm w-full mx-auto p-6 relative min-h-[32rem] transition-all duration-300 hover:border-emerald-400/70 shadow-2xl overflow-hidden cursor-pointer"
    >
      <CornerIcon className="absolute h-5 w-5 -top-2.5 -left-2.5 text-emerald-400 z-30" />
      <CornerIcon className="absolute h-5 w-5 -bottom-2.5 -left-2.5 text-emerald-400 z-30" />
      <CornerIcon className="absolute h-5 w-5 -top-2.5 -right-2.5 text-emerald-400 z-30" />
      <CornerIcon className="absolute h-5 w-5 -bottom-2.5 -right-2.5 text-emerald-400 z-30" />

      {/* Canvas Reveal Shader Background on Hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full absolute inset-0 z-10"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Tag */}
      <div className="relative z-20 flex items-center justify-between">
        <span className="font-mono text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-500/40 text-emerald-300">
          {badge}
        </span>
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Center Icon (Static state) */}
      <div className="relative z-20 my-auto text-center transition-all duration-300 group-hover/canvas-card:-translate-y-2">
        <div className="mx-auto flex items-center justify-center p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 w-20 h-20 shadow-inner group-hover/canvas-card:border-yellow-400 transition-colors">
          {icon}
        </div>
        <div className="mt-4 font-mono text-xs font-bold text-yellow-400 tracking-wider uppercase">
          {role}
        </div>
        <h3 className="text-2xl font-black text-white mt-1 group-hover/canvas-card:text-emerald-200 transition-colors">
          {title}
        </h3>
      </div>

      {/* Detailed Spec Bullets (Always readable, highlighted on hover) */}
      <div className="relative z-20 space-y-2 pt-4 border-t border-emerald-500/20 bg-[#022c22]/90 p-3 rounded-xl backdrop-blur-md">
        {bullets.map((bullet, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs font-mono text-emerald-100/90">
            <span className="text-yellow-400 font-bold mt-0.5">▶</span>
            <span>{bullet}</span>
          </div>
        ))}

        {actionLabel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onAction) onAction();
            }}
            className="w-full mt-3 py-2 px-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
