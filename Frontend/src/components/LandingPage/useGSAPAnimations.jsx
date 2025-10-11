import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useGSAPAnimations(rootRef, threeContainerRef) {
  useEffect(() => {
    let ctx; // Declare ctx here so it's accessible in cleanup
    const timer = setTimeout(() => {
      ctx = gsap.context(() => { // Assign to the declared variable
        // Hero animations
        const heroTitle = document.querySelector(".hero-title");
        const heroSub = document.querySelector(".hero-sub");
        const ctaButton = document.getElementById("cta-button");

        if (heroTitle) {
          gsap.fromTo(
            heroTitle,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
          );
          gsap.to(heroTitle, {
            y: -2,
            repeat: -1,
            yoyo: true,
            duration: 1.8,
            ease: "sine.inOut",
          });
          gsap.to(heroTitle, {
            textShadow: "4px 4px 0 #000, 0 0 10px rgba(255,77,77,0.35)",
            repeat: -1,
            yoyo: true,
            duration: 1.6,
            ease: "sine.inOut",
          });
        }

        if (heroSub) {
          gsap.fromTo(
            heroSub,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.4 }
          );
        }

        if (ctaButton) {
          gsap.fromTo(
            ctaButton,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "back.out(1.8)",
              delay: 0.6,
            }
          );
        }

        // Particle animations
        const pixelParticles = gsap.utils.toArray(".pixel-particle");
        if (pixelParticles.length > 0) {
          pixelParticles.forEach((el, i) => {
            gsap.to(el, {
              y: gsap.utils.random(-30, -60),
              x: gsap.utils.random(-20, 20),
              repeat: -1,
              yoyo: true,
              duration: gsap.utils.random(2, 4),
              ease: "sine.inOut",
              delay: i * 0.05,
            });
            gsap.to(el, {
              opacity: gsap.utils.random(0.4, 0.9),
              repeat: -1,
              yoyo: true,
              duration: gsap.utils.random(1.2, 2.4),
              ease: "sine.inOut",
            });
          });
        }

        const floatIcons = gsap.utils.toArray(".float-icon");
        if (floatIcons.length > 0) {
          floatIcons.forEach((el, i) => {
            gsap.to(el, {
              y: -10,
              rotate: 8,
              repeat: -1,
              yoyo: true,
              duration: 2 + i * 0.3,
              ease: "sine.inOut",
            });
          });
        }

        // Battleground animations
        const pokemonLeft = document.getElementById("pokemon-left");
        const pokemonRight = document.getElementById("pokemon-right");
        const heatShimmer = document.getElementById("heat-shimmer");

        if (pokemonLeft) {
          gsap.to(pokemonLeft, {
            y: -8,
            repeat: -1,
            yoyo: true,
            duration: 1.6,
            ease: "sine.inOut",
          });
          gsap.to(pokemonLeft, {
            filter: "drop-shadow(0 0 12px rgba(255,77,77,0.4))",
            repeat: -1,
            yoyo: true,
            duration: 1.4,
            ease: "sine.inOut",
          });
        }

        if (pokemonRight) {
          gsap.to(pokemonRight, {
            y: -8,
            repeat: -1,
            yoyo: true,
            duration: 1.9,
            ease: "sine.inOut",
          });
          gsap.to(pokemonRight, {
            filter: "drop-shadow(0 0 12px rgba(255,77,77,0.4))",
            repeat: -1,
            yoyo: true,
            duration: 1.4,
            ease: "sine.inOut",
            delay: 0.2,
          });
        }

        const emberElements = gsap.utils.toArray("#bg-embers .ember");
        if (emberElements.length > 0) {
          emberElements.forEach((el) => {
            gsap.fromTo(
              el,
              { y: 0, opacity: gsap.utils.random(0.4, 0.9) },
              {
                y: -200 - Math.random() * 200,
                opacity: 0,
                duration: 3 + Math.random() * 3,
                repeat: -1,
                ease: "none",
                delay: Math.random() * 2,
              }
            );
          });
        }

        if (heatShimmer) {
          gsap.to(heatShimmer, {
            opacity: 0.25,
            repeat: -1,
            yoyo: true,
            duration: 1.2,
            ease: "sine.inOut",
          });
        }

        // Battle timeline
        if (pokemonLeft && pokemonRight) {
          const battleTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
          battleTl
            .addLabel("leftAttack")
            .to(
              pokemonLeft,
              { x: 14, duration: 0.18, ease: "power2.in" },
              "leftAttack"
            )
            .to(pokemonLeft, { x: 0, duration: 0.22, ease: "power2.out" })
            .to(
              pokemonRight,
              {
                x: 6,
                yoyo: true,
                repeat: 4,
                duration: 0.05,
                ease: "power1.inOut",
              },
              "leftAttack+=0.18"
            )
            .addLabel("rightAttack", "+=0.8")
            .to(
              pokemonRight,
              { x: -14, duration: 0.18, ease: "power2.in" },
              "rightAttack"
            )
            .to(pokemonRight, { x: 0, duration: 0.22, ease: "power2.out" })
            .to(
              pokemonLeft,
              {
                x: -6,
                yoyo: true,
                repeat: 4,
                duration: 0.05,
                ease: "power1.inOut",
              },
              "rightAttack+=0.18"
            );
        }

        // Parallax on mouse
        const onMouse = (e) => {
          const parallaxElements = gsap.utils.toArray("[data-parallax]");
          if (parallaxElements.length === 0) return;

          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(parallaxElements, {
            x: (i, t) =>
              x * 20 * (parseFloat(t.getAttribute("data-parallax")) || 1),
            y: (i, t) =>
              y * 12 * (parseFloat(t.getAttribute("data-parallax")) || 1),
            duration: 0.6,
            ease: "power2.out",
          });
        };
        window.addEventListener("mousemove", onMouse);

        // Scroll reveal
        const revealElements = gsap.utils.toArray(".reveal");
        if (revealElements.length > 0) {
          revealElements.forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 85%" },
              }
            );
          });
        }

        // Desktop nav links hover
        const navLinks = gsap.utils.toArray("nav.desktop-nav a");
        if (navLinks.length > 0) {
          navLinks.forEach((link) => {
            const hover = gsap.to(link, {
              y: -2,
              color: "#ef4444",
              textShadow: "0 0 10px rgba(239,68,68,0.35)",
              duration: 0.22,
              paused: true,
              ease: "power2.out",
            });
            link.addEventListener("mouseenter", () => hover.play());
            link.addEventListener("mouseleave", () => hover.reverse());
          });
        }

        // Practice button animations
        const practiceButton = document.getElementById("practice-button");
        if (practiceButton) {
          gsap.to(practiceButton, {
            y: -3,
            repeat: -1,
            yoyo: true,
            duration: 1.6,
            ease: "sine.inOut",
          });
          
          const enter = () => {
            gsap.to(practiceButton, {
              scale: 1.04,
              duration: 0.18,
              ease: "power2.out",
            });
            gsap.to(practiceButton.querySelectorAll(".sparkle"), {
              opacity: 1,
              scale: 1.2,
              duration: 0.3,
              ease: "back.out(1.7)",
            });
          };
          
          const leave = () => {
            gsap.to(practiceButton, {
              scale: 1.0,
              duration: 0.18,
              ease: "power2.in",
            });
            gsap.to(practiceButton.querySelectorAll(".sparkle"), {
              opacity: 0,
              scale: 0.8,
              duration: 0.2,
              ease: "power2.in",
            });
          };
          
          const click = () => {
            gsap.to(rootRef.current, {
              x: 3,
              yoyo: true,
              repeat: 3,
              duration: 0.05,
              ease: "power1.inOut",
            });
          };
          
          practiceButton.addEventListener("mouseenter", enter);
          practiceButton.addEventListener("mouseleave", leave);
          practiceButton.addEventListener("click", click);
          
          // Add cleanup for event listeners
          ctx.add(() => {
            practiceButton.removeEventListener("mouseenter", enter);
            practiceButton.removeEventListener("mouseleave", leave);
            practiceButton.removeEventListener("click", click);
          });
        }

        // Fire/flame GIF animations
        const flameElements = gsap.utils.toArray(".flame-gif");
        if (flameElements.length > 0) {
          flameElements.forEach((el, i) => {
            gsap.to(el, {
              y: -8,
              repeat: -1,
              yoyo: true,
              duration: 1.2 + i * 0.3,
              ease: "sine.inOut",
            });
            gsap.to(el, {
              opacity: gsap.utils.random(0.6, 0.9),
              repeat: -1,
              yoyo: true,
              duration: 0.8 + i * 0.2,
              ease: "sine.inOut",
            });
          });
        }

        // Three.js background
        (async () => {
          try {
            const container = threeContainerRef.current;
            if (!container) return;
            
            const [
              {
                Scene,
                PerspectiveCamera,
                WebGLRenderer,
                Color,
                Fog,
                SphereGeometry,
                MeshStandardMaterial,
                Mesh,
                AmbientLight,
                PointLight,
                Vector2,
                AdditiveBlending,
                BufferGeometry,
                Float32BufferAttribute,
                Points,
                Clock,
              },
              THREE,
            ] = await Promise.all([import("three"), import("three")]);

            const pixelationFactor = 4;

            const scene = new Scene();
            scene.background = new Color("#1a0808");
            scene.fog = new Fog("#0d0404", 50, 180);

            const camera = new PerspectiveCamera(
              60,
              container.clientWidth / container.clientHeight,
              0.1,
              1000
            );
            camera.position.set(0, 0, 60);

            const renderer = new WebGLRenderer({
              antialias: false,
              alpha: true,
            });
            renderer.setSize(
              container.clientWidth / pixelationFactor,
              container.clientHeight / pixelationFactor
            );
            renderer.setPixelRatio(1);
            renderer.outputColorSpace = "srgb";

            container.appendChild(renderer.domElement);
            renderer.domElement.style.width = "100%";
            renderer.domElement.style.height = "100%";
            renderer.domElement.style.imageRendering = "pixelated";

            const ambient = new AmbientLight(0xff8844, 0.8);
            const point = new PointLight(0xff4411, 2.2, 200);
            point.position.set(20, 20, 20);
            scene.add(ambient, point);

            const orbGeo = new SphereGeometry(3, 16, 16);
            const orbMat = new MeshStandardMaterial({
              color: "#b30000",
              emissive: "#ff1a1a",
              emissiveIntensity: 0.5,
              roughness: 0.4,
              metalness: 0.2,
            });
            const orbs = [];
            for (let i = 0; i < 6; i++) {
              const orb = new Mesh(orbGeo, orbMat);
              orb.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 30,
                -20 - Math.random() * 40
              );
              scene.add(orb);
              orbs.push(orb);
            }

            const particlesCount = 400;
            const positions = new Float32BufferAttribute(particlesCount * 3, 3);
            for (let i = 0; i < particlesCount; i++) {
              positions.setXYZ(
                i,
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 120,
                -50 - Math.random() * 200
              );
            }
            const pGeo = new BufferGeometry();
            pGeo.setAttribute("position", positions);
            const pMat = new THREE.PointsMaterial({
              color: 0xff6633,
              size: 1.4,
              sizeAttenuation: true,
              blending: AdditiveBlending,
              transparent: true,
              opacity: 0.8,
            });
            const points = new Points(pGeo, pMat);
            scene.add(points);

            const mouse = new Vector2(0, 0);
            const onResize = () => {
              if (!container) return;
              camera.aspect = container.clientWidth / container.clientHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(
                container.clientWidth / pixelationFactor,
                container.clientHeight / pixelationFactor
              );
            };
            const onMove = (e) => {
              mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
              mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
            };
            window.addEventListener("resize", onResize);
            window.addEventListener("mousemove", onMove);

            const clock = new Clock();
            let rafId;
            const animate = () => {
              const t = clock.getElapsedTime();
              orbs.forEach((o, i) => {
                o.position.y += Math.sin(t * 0.8 + i) * 0.02;
                o.position.x += Math.cos(t * 0.5 + i) * 0.015;
              });
              points.rotation.y += 0.0008;
              camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
              camera.position.y += (-mouse.y * 3 - camera.position.y) * 0.05;
              camera.lookAt(0, 0, -40);
              renderer.render(scene, camera);
              rafId = requestAnimationFrame(animate);
            };
            animate();

            ctx.add(() => {
              cancelAnimationFrame(rafId);
              window.removeEventListener("resize", onResize);
              window.removeEventListener("mousemove", onMove);
              renderer.dispose();
              if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
              }
            });
          } catch (e) {
            console.error("Three.js failed to load:", e);
          }
        })();
      }, rootRef);
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (ctx) {
        ctx.revert();
      }
    };
  }, [rootRef, threeContainerRef]); // Added dependencies
}