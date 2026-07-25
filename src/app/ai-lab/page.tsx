"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { usePageTransition } from "@/components/layout/PageTransition";
import CursorLightTrail from "@/components/ui/CursorLightTrail";

/* ───────────────────────────────────────────────
   Data
   ─────────────────────────────────────────────── */

const AGENT_NODES = [
  {
    id: "hermes",
    label: "Hermes",
    role: "AI 策略与研究",
    description:
      "核心智能引擎——多模态分析与规划中枢。负责理解用户意图、分解复杂任务、协调各代理协作，并维护跨会话上下文的连续性。通过深度研究综合与推理策略，驱动整个 AI-Brain 系统的高效运转。",
    capabilities: [
      "多模态分析与规划",
      "研究综合与文档编制",
      "跨会话上下文管理",
      "任务分解与编排",
    ],
    color: "rgba(160,195,255,",
  },
  {
    id: "denji",
    label: "电次",
    role: "远程微信助手(电次)",
    description:
      "远程微信智能助手——通过微信生态提供实时消息响应与自动化服务。能够并行执行多任务、调用系统工具、管理工作流管线，实现从文件操作到系统管理的全链路自动化。让你的微信真正「活」起来。",
    capabilities: [
      "微信消息实时响应",
      "并行任务执行",
      "工具调用自动化",
      "工作流管线管理",
    ],
    color: "rgba(180,170,250,",
  },
  {
    id: "qwen",
    label: "Qwen Vision",
    role: "视觉智能",
    description:
      "视觉理解与创作评估引擎——基于通义千问视觉大模型，对图像进行深度分析与美学评估。从视觉构图、色彩搭配到设计一致性，提供专业级视觉审查与创意建议，确保每个像素都符合最高标准。",
    capabilities: [
      "图像分析与描述",
      "视觉构图评估",
      "设计评论与建议",
      "素材审查与质量把控",
    ],
    color: "rgba(150,185,245,",
  },
  {
    id: "coder",
    label: "Coder Agent",
    role: "工程开发",
    description:
      "全栈工程开发引擎——从架构设计到生产部署的全链路代码生成器。擅长前端交互、后端服务、数据库设计与云原生部署，能够快速构建高质量、可维护的生产级应用。",
    capabilities: [
      "全栈代码生成",
      "架构设计与重构",
      "构建与部署自动化",
      "错误诊断与修复",
    ],
    color: "rgba(170,200,240,",
  },
  {
    id: "memory",
    label: "Memory System",
    role: "知识管理",
    description:
      "持久化知识中枢——跨会话的记忆与知识管理系统。通过技能库管理、知识图谱构建与上下文召回机制，让 AI 系统具备持续学习能力，每一次交互都比上一次更了解你的需求与偏好。",
    capabilities: [
      "会话持久化与检索",
      "技能库管理",
      "跨项目知识图谱",
      "意图与上下文召回",
    ],
    color: "rgba(140,175,245,",
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    role: "对话与推理 (OpenAI GPT-4o)",
    description:
      "OpenAI 旗舰多模态大模型——GPT-4o 提供顶尖的对话理解、逻辑推理与创意生成能力。支持文本、图像、音频多模态输入，在复杂推理、代码生成和创意写作方面表现卓越，是 AI-Brain 系统的核心推理引擎之一。",
    capabilities: [
      "多模态对话与推理",
      "创意内容生成",
      "复杂问题分析",
      "多语言自然交互",
    ],
    color: "rgba(120,210,180,",
  },
  {
    id: "codex",
    label: "Codex",
    role: "代码智能 (GitHub Copilot)",
    description:
      "GitHub 驱动的 AI 编程助手——基于 OpenAI Codex 模型，实时代码补全、函数生成与调试建议。深度集成开发环境，支持上百种编程语言，将开发效率提升数倍。",
    capabilities: [
      "实时代码补全",
      "函数与模块生成",
      "Bug 检测与修复",
      "多语言开发支持",
    ],
    color: "rgba(130,220,200,",
  },
  {
    id: "claude",
    label: "Claude Code",
    role: "编程与协作 (Anthropic)",
    description:
      "Anthropic 打造的下一代 AI 编程助手——以安全可靠为核心理念，在代码生成、架构设计与技术文档编写方面表现优异。擅长长上下文理解，能够处理大型代码库的复杂重构任务。",
    capabilities: [
      "深度代码分析",
      "架构设计建议",
      "技术文档生成",
      "大型重构执行",
    ],
    color: "rgba(200,170,230,",
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    role: "深度推理 (DeepSeek)",
    description:
      "国产顶尖推理大模型——在数学推理、逻辑分析和代码生成领域达到国际领先水平。以极致的推理能力和超长上下文支持著称，擅长处理需要深度思考的复杂技术问题。",
    capabilities: [
      "深度数学推理",
      "逻辑分析",
      "高级代码生成",
      "技术研究与探索",
    ],
    color: "rgba(160,220,190,",
  },
  {
    id: "dashscope",
    label: "Qwen",
    role: "通义大模型 (DashScope)",
    description:
      "阿里云通义千问系列大模型——通过 DashScope 平台提供一致的 API 接入体验。覆盖文本理解、内容生成、代码辅助等多场景，以优秀的性价比和中文理解能力为 AI-Brain 提供多样化模型支持。",
    capabilities: [
      "文本理解与生成",
      "多场景任务处理",
      "中文语义优化",
      "API 标准化接入",
    ],
    color: "rgba(150,185,245,",
  },
  {
    id: "flux",
    label: "FLUX",
    role: "图像生成",
    description:
      "前沿 AI 图像生成引擎——基于扩散模型技术，从文本描述生成高质感、高分辨率的视觉作品。支持风格迁移、图像编辑、条件生成等高级功能，为创意设计提供无限的视觉可能性。",
    capabilities: [
      "文本到图像生成",
      "风格迁移与编辑",
      "高分辨率渲染",
      "创意视觉探索",
    ],
    color: "rgba(220,160,200,",
  },
];

const WORKFLOW_STEPS = [
  {
    phase: "01",
    title: "创意构思",
    desc: "创意简报与概念开发。确定作品集的视觉叙事方向和技术需求。",
    icon: "○",
  },
  {
    phase: "02",
    title: "AI 研究",
    desc: "Hermes 分析设计模式、动画技术以及高端创意作品集中的毛玻璃实现方案。",
    icon: "◇",
  },
  {
    phase: "03",
    title: "视觉方向",
    desc: "Qwen Vision 评估参考图像与情绪板，生成了 Apple Vision Pro 风格的玻璃美学方向。",
    icon: "△",
  },
  {
    phase: "04",
    title: "代码开发",
    desc: "Coder Agent 与电次协作推进 Next.js 实现——GSAP 动效、粒子系统、页面过渡。",
    icon: "▽",
  },
  {
    phase: "05",
    title: "测试验证",
    desc: "跨浏览器视觉质量验证、性能分析、动效可访问性审核及响应式布局验证。",
    icon: "□",
  },
  {
    phase: "06",
    title: "最终发布",
    desc: "打磨完成的生产构建，包含电影级页面过渡、空间玻璃光影效果与优化交付。",
    icon: "◎",
  },
];

const EXPLORATIONS = [
  {
    title: "人机协作",
    desc: "探索人类创意总监与 AI 代理实时同步协作的工作流——真正的合作伙伴关系，而非工具使用。",
    tag: "研究进行中",
  },
  {
    title: "Agent 工作流",
    desc: "设计多代理编排模式，使专业 AI 代理能够交接上下文，并自主构建彼此的产出成果。",
    tag: "开发中",
  },
  {
    title: "创意自动化",
    desc: "构建自动化重复创意任务的管线——从素材生成到视觉质量审查——解放精力聚焦于高维度方向决策。",
    tag: "原型开发",
  },
  {
    title: "生成式设计",
    desc: "利用 AI 探索人类直觉之外的设计空间——生成变体、意外构图与全新视觉语言。",
    tag: "探索中",
  },
];

/* ───────────────────────────────────────────────
   Glass system — volumetric light layers
   ─────────────────────────────────────────────── */

function GlassLayers({
  glassRef,
  edgeLightRef,
  scatterRef,
  glowRef,
}: {
  glassRef: React.RefObject<HTMLDivElement | null>;
  edgeLightRef: React.RefObject<HTMLDivElement | null>;
  scatterRef: React.RefObject<HTMLDivElement | null>;
  glowRef: React.RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    const glass = glassRef.current;
    const edge = edgeLightRef.current;
    const scatter = scatterRef.current;
    const glow = glowRef.current;
    if (!glass || !edge || !scatter || !glow) return;

    let rafId: number;
    let mx = 0.5,
      my = 0.5;
    let smoothMx = 0.5,
      smoothMy = 0.5;

    const tick = () => {
      smoothMx += (mx - smoothMx) * 0.035;
      smoothMy += (my - smoothMy) * 0.035;

      const px = smoothMx * 100;
      const py = smoothMy * 100;
      const edgeX = smoothMx < 0.5 ? smoothMx * 2 : (1 - smoothMx) * 2;
      const edgeY = smoothMy < 0.5 ? smoothMy * 2 : (1 - smoothMy) * 2;
      const edgeAngle = smoothMx < 0.5 ? 0 : 180;
      const vertAngle = smoothMy < 0.5 ? 270 : 90;

      edge.style.background = `
        linear-gradient(${edgeAngle}deg, 
          rgba(160,195,255,${0.14 * (1 - edgeX)}) 0%, 
          rgba(140,175,245,${0.06 * (1 - edgeX)}) 10%, 
          transparent 30%
        ),
        linear-gradient(${(edgeAngle + 180) % 360}deg, 
          rgba(160,195,255,${0.07 * edgeX}) 0%, 
          transparent 25%
        ),
        linear-gradient(${vertAngle}deg, 
          rgba(150,185,250,${0.09 * (1 - edgeY)}) 0%, 
          rgba(140,175,245,${0.04 * (1 - edgeY)}) 10%, 
          transparent 25%
        ),
        linear-gradient(${(vertAngle + 180) % 360}deg, 
          rgba(150,185,250,${0.05 * edgeY}) 0%, 
          transparent 20%
        )
      `;

      scatter.style.background = `
        radial-gradient(
          ellipse at ${px}% ${py}%, 
          rgba(160,195,255,${0.14 + 0.08 * (1 - edgeX)}) 0%, 
          rgba(130,165,240,${0.05 * (1 - edgeX)}) 15%, 
          rgba(110,145,230,${0.025}) 30%, 
          rgba(90,125,220,${0.012}) 50%, 
          transparent 70%
        ),
        radial-gradient(
          ellipse at ${100 - px}% ${100 - py}%, 
          rgba(130,160,240,${0.06}) 0%, 
          rgba(110,140,230,${0.02}) 25%, 
          transparent 50%
        ),
        radial-gradient(
          ellipse at ${50 + (smoothMx - 0.5) * 30}% ${50 + (smoothMy - 0.5) * 30}%, 
          rgba(160,195,255,${0.03}) 0%, 
          transparent 40%
        )
      `;

      glass.style.transform = `translate(${(smoothMx - 0.5) * 10}px, ${(smoothMy - 0.5) * 10}px)`;
      glass.style.background = `
        radial-gradient(circle at ${px}% ${py}%, rgba(160,195,255,0.035) 0%, transparent 50%)
      `;

      glow.style.transform = `translate3d(${smoothMx * window.innerWidth - 400}px, ${smoothMy * window.innerHeight - 400}px, 0)`;
    };

    const loop = () => {
      tick();
      rafId = requestAnimationFrame(loop);
    };

    const onMouse = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    loop();

    return () => {
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(rafId);
    };
  }, [glassRef, edgeLightRef, scatterRef, glowRef]);

  return (
    <>
      {/* Layer 1: Deep black base */}
      <div className="fixed inset-0 z-[1] pointer-events-none" />

      {/* Layer 2: Spatial glass panel */}
      <div
        ref={glassRef}
        className="fixed inset-0 z-[2] pointer-events-none will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(120,180,255,0.04) 0%, transparent 50%)",
        }}
      />

      {/* Layer 3: Edge light */}
      <div
        ref={edgeLightRef}
        className="fixed inset-0 z-[3] pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Layer 4: Volumetric scatter */}
      <div
        ref={scatterRef}
        className="fixed inset-0 z-[4] pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Layer 5: Noise texture */}
      <div
        className="fixed inset-0 z-[5] pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Layer 6: Mouse glow */}
      <div
        ref={glowRef}
        className="fixed pointer-events-none z-[6] will-change-transform"
        style={{
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(80,160,255,0.08) 0%, rgba(60,140,240,0.035) 30%, transparent 60%)",
          left: "0",
          top: "0",
          opacity: 0.5,
          animation: "glass-breathe 5s ease-in-out infinite",
        }}
      />
    </>
  );
}

/* ───────────────────────────────────────────────
   Node card — glass-morphism agent card
   ─────────────────────────────────────────────── */

function AgentNode({
  agent,
  index,
  onHover,
  onLeave,
  isHovered,
}: {
  agent: (typeof AGENT_NODES)[number];
  index: number;
  onHover: (id: string) => void;
  onLeave: () => void;
  isHovered: boolean;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  // Per-node mouse parallax state (React state, no GSAP)
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const rafParallax = useRef(0);
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.4 + index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [index]);

  // Smooth parallax animation loop
  useEffect(() => {
    const animate = () => {
      currentOffset.current.x +=
        (targetOffset.current.x - currentOffset.current.x) * 0.1;
      currentOffset.current.y +=
        (targetOffset.current.y - currentOffset.current.y) * 0.1;
      setParallaxOffset({
        x: currentOffset.current.x,
        y: currentOffset.current.y,
      });
      rafParallax.current = requestAnimationFrame(animate);
    };
    rafParallax.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafParallax.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    // Clamp to +/- 4px offset
    targetOffset.current = {
      x: Math.max(-4, Math.min(4, dx * 4)),
      y: Math.max(-4, Math.min(4, dy * 4)),
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    onLeave();
    setExpanded(false);
    targetOffset.current = { x: 0, y: 0 };
  }, [onLeave]);

  return (
    <div
      ref={nodeRef}
      className="opacity-0"
      onMouseEnter={() => {
        onHover(agent.id);
        setExpanded(true);
      }}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="group relative cursor-default select-none"
        style={{ perspective: "1200px" }}
        onMouseMove={handleMouseMove}
      >
        <div
          className="relative overflow-hidden rounded-xl p-5 sm:p-6 transition-all duration-[400ms] ease-out will-change-transform"
          style={{
            background: "rgba(255,255,255,0.035)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: isHovered
              ? "1px solid rgba(160,195,255,0.25)"
              : "1px solid rgba(255,255,255,0.07)",
            boxShadow: isHovered
              ? "0 12px 56px rgba(80,140,255,0.14), inset 0 1px 0 rgba(255,255,255,0.14)"
              : "0 6px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
            transform: `translateY(${isHovered ? -4 : 0}px) scale(${isHovered ? 1.025 : 1}) translateX(${parallaxOffset.x}px) translateY(${parallaxOffset.y}px)`,
          }}
        >
          {/* Edge glow on hover — Apple style */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
            style={{
              background: `
                radial-gradient(circle at 50% 0%, rgba(160,195,255,0.12) 0%, transparent 60%),
                radial-gradient(circle at 25% 100%, rgba(160,195,255,0.05) 0%, transparent 50%),
                radial-gradient(circle at 75% 100%, rgba(160,195,255,0.05) 0%, transparent 50%)
              `,
            }}
          />

          {/* Shimmer sweep on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none rounded-xl overflow-hidden"
            style={{
              background:
                "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.05) 45%, transparent 55%)",
              transform: "translateX(-100%)",
            }}
          />

          {/* Glass highlight — top edge */}
          <div
            className="absolute top-0 left-[10%] right-[10%] h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            }}
          />

          {/* Label */}
          <p
            className="relative z-10 text-[9px] sm:text-[10px] tracking-[0.15em] mb-2 font-light transition-all duration-[400ms]"
            style={{
              color: isHovered
                ? "rgba(160,195,255,0.85)"
                : "var(--color-text-muted)",
            }}
          >
            {agent.role.toUpperCase()}
          </p>

          {/* Name — subtle glow on hover */}
          <h3
            className="relative z-10 text-base sm:text-lg md:text-xl font-medium tracking-tight mb-1 transition-all duration-[400ms]"
            style={{
              color: "var(--color-text)",
              textShadow: isHovered
                ? "0 0 20px rgba(160,195,255,0.15), 0 0 40px rgba(160,195,255,0.05)"
                : "none",
            }}
          >
            {agent.label}
          </h3>

          {/* Description — always visible */}
          <p
            className="relative z-10 text-xs sm:text-sm font-light leading-relaxed mt-2 max-w-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {agent.description}
          </p>

          {/* Expanded capabilities */}
          <div
            className="relative z-10 overflow-hidden transition-all duration-500"
            style={{
              maxHeight: expanded ? "180px" : "0",
              opacity: expanded ? 1 : 0,
            }}
          >
            <div
              className="mt-3 pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <ul className="space-y-1.5">
                {agent.capabilities.map((cap, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[11px] sm:text-xs font-light leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span
                      className="inline-block w-1 h-1 rounded-full mt-[5px] shrink-0"
                      style={{
                        background: agent.color.replace(",", "0.4)").replace("rgba(", ""),
                      }}
                    />
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Accent bar */}
          <div
            className="relative z-10 mt-3 h-px w-6 transition-all duration-500 group-hover:w-10"
            style={{
              background: isHovered
                ? "linear-gradient(90deg, rgba(160,195,255,0.3), transparent)"
                : "rgba(255,255,255,0.08)",
            }}
          />
        </div>
      </div>
    </div>
  );
  }

/* ───────────────────────────────────────────────
   Brain visualization — connected node graph
   ─────────────────────────────────────────────── */

function BrainVisualization() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Parallax on center
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(0);
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    const animate = () => {
      const { x: mx, y: my } = mousePos.current;
      const px = (mx - 0.5) * 10;
      const py = (my - 0.5) * 10;
      if (centerRef.current) {
        centerRef.current.style.transform = `translate3d(${px * 0.4}px, ${py * 0.4}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Radial layout parameters ──
  const N = AGENT_NODES.length; // 10
  // Angles: start from top (-90°), evenly spaced
  const angles = AGENT_NODES.map((_, i) => (i / N) * 360 - 90);

  // Radius as percentage of canvas size
  const RADIUS_PCT = 34;

  return (
    <section className="relative z-10 min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
      {/* Section label — moved to top center, constrained */}
      <div className="mb-8 md:mb-10 text-center max-w-[600px] w-full">
        <p
          className="text-[10px] sm:text-[11px] tracking-[0.15em] mb-2 font-light"
          style={{ color: "var(--color-text-muted)" }}
        >
          AI 大脑系统
        </p>
        <h2
          className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          系统架构
        </h2>
        <p
          className="text-xs sm:text-sm font-light mt-2 mx-auto leading-relaxed"
          style={{ color: "var(--color-text-secondary)", maxWidth: 480 }}
        >
          多代理智能系统——整合 {N} 个专业 AI 代理，以人类创意总监为核心决策者协同工作。
        </p>
      </div>

      {/* ── Canvas — viewport-centered diagram ── */}
      <div
        ref={canvasRef}
        className="relative w-full flex-1 flex items-center justify-center"
        style={{
          maxWidth: isMobile ? "100%" : "900px",
          maxHeight: isMobile ? "none" : "70vh",
          aspectRatio: isMobile ? "auto" : "1 / 1",
          transformOrigin: "center center",
        }}
      >
        {isMobile ? (
          /* ── MOBILE: vertical stack ── */
          <div className="w-full max-w-md mx-auto space-y-4 py-8">
            {/* Center node at top */}
            <div className="flex justify-center mb-4">
              <div
                ref={centerRef}
                className="relative text-center p-6 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                  border: "1px solid rgba(160,195,255,0.18)",
                  boxShadow: "0 16px 64px rgba(80,140,255,0.10), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              >
                <div
                  className="absolute -inset-3 rounded-2xl pointer-events-none opacity-40"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(160,195,255,0.08) 0%, transparent 70%)",
                    filter: "blur(16px)",
                  }}
                />
                <p className="text-[9px] tracking-[0.18em] mb-2 font-light" style={{ color: "var(--color-text-muted)" }}>人类创意总监</p>
                <h3 className="text-xl font-semibold tracking-tight" style={{ color: "var(--color-text)" }}>任政宇</h3>
              </div>
            </div>

            {/* Agent list */}
            <div className="space-y-3">
              {AGENT_NODES.map((agent, i) => (
                <div key={agent.id} data-agent-id={agent.id}>
                  <AgentNode
                    agent={agent}
                    index={i}
                    onHover={setHoveredId}
                    onLeave={() => setHoveredId(null)}
                    isHovered={hoveredId === agent.id}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── DESKTOP: radial layout ── */
          <div className="relative w-full h-full" style={{ minHeight: "500px" }}>
            {/* SVG connection lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 0 }}
              preserveAspectRatio="xMidYMid meet"
            >
              {angles.map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x2 = 50 + RADIUS_PCT * Math.cos(rad);
                const y2 = 50 + RADIUS_PCT * Math.sin(rad);
                return (
                  <g key={AGENT_NODES[i].id}>
                    {/* Glow line */}
                    <line
                      x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`}
                      stroke="rgba(160,195,255,0.04)"
                      strokeWidth="8"
                    />
                    {/* Dashed connection */}
                    <line
                      x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`}
                      stroke="rgba(160,195,255,0.12)"
                      strokeWidth="1"
                      strokeDasharray="3 4"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Center node — exact center of canvas */}
            <div
              ref={centerRef}
              className="absolute z-10"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="relative text-center p-6 md:p-8 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                  border: "1px solid rgba(160,195,255,0.18)",
                  boxShadow: "0 16px 64px rgba(80,140,255,0.10), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              >
                <div
                  className="absolute -inset-4 rounded-2xl pointer-events-none opacity-60"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(160,195,255,0.08) 0%, transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />
                <p className="text-[9px] sm:text-[10px] tracking-[0.18em] mb-2 font-light" style={{ color: "var(--color-text-muted)" }}>
                  人类创意总监
                </p>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: "var(--color-text)" }}>
                  任政宇
                </h3>
                <p className="text-[10px] sm:text-xs font-light mt-2 leading-relaxed max-w-[200px] mx-auto" style={{ color: "var(--color-text-secondary)" }}>
                  以创意愿景、战略判断与审美直觉驱动系统
                </p>
              </div>
            </div>

            {/* Agent nodes — positioned radially */}
            {AGENT_NODES.map((agent, i) => {
              const rad = (angles[i] * Math.PI) / 180;
              const left = 50 + RADIUS_PCT * Math.cos(rad);
              const top = 50 + RADIUS_PCT * Math.sin(rad);
              // Slightly offset each node so its center aligns with the line endpoint
              const offsetX = -50; // half of node width percentage
              const offsetY = -50; // half of node height percentage

              return (
                <div
                  key={agent.id}
                  data-agent-id={agent.id}
                  className="absolute z-10"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    transform: `translate(${offsetX}%, ${offsetY}%)`,
                    width: "clamp(160px, 16vw, 220px)",
                  }}
                >
                  <AgentNode
                    agent={agent}
                    index={i}
                    onHover={setHoveredId}
                    onLeave={() => setHoveredId(null)}
                    isHovered={hoveredId === agent.id}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────
   Workflow timeline
   ─────────────────────────────────────────────── */

function WorkflowTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const steps = el.querySelectorAll("[data-step]");
      steps.forEach((step, i) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Section label — centered */}
        <div className="mb-16 md:mb-20 opacity-0 text-center" data-animate="section-label">
          <p
            className="text-[11px] sm:text-xs tracking-[0.12em] mb-3 font-light"
            style={{ color: "var(--color-text-muted)" }}
          >
            AI 生产工作流
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight"
            style={{ color: "var(--color-text)" }}
          >
            创作工作流
          </h2>
          <p
            className="text-sm sm:text-base font-light mt-4 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            案例研究：搭建 任政宇 作品集网站——从概念构想到部署上线的多代理 AI 生产管线。
          </p>
        </div>

        {/* Centered timeline — vertical center line with alternating cards */}
        <div className="relative">
          {/* Central vertical line — centered */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px z-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(160,195,255,0.18) 0%, rgba(160,195,255,0.06) 50%, transparent 100%)",
            }}
          />

          <div className="relative z-10 space-y-12 sm:space-y-16">
            {WORKFLOW_STEPS.map((step, i) => (
              <div
                key={step.phase}
                data-step
                className="relative flex flex-col items-center opacity-0"
              >
                {/* Phase dot on center line */}
                <div
                  className="relative z-20 w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-full flex items-center justify-center text-base sm:text-lg mb-4"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(160,195,255,0.15)",
                    color: "rgba(160,195,255,0.7)",
                    boxShadow: "0 0 30px rgba(160,195,255,0.06)",
                  }}
                >
                  {step.icon}
                </div>

                {/* Centered content card */}
                <div className="w-full max-w-xl mx-auto">
                  <div
                    className="relative p-5 sm:p-6 md:p-7 rounded-xl overflow-hidden transition-all duration-[400ms] ease-out hover:scale-[1.01] text-center"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 0%, rgba(160,195,255,0.06) 0%, transparent 60%)",
                      }}
                    />

                    <div className="relative z-10">
                      <span
                        className="text-[10px] sm:text-xs tracking-[0.12em] font-light block mb-1"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        阶段 {step.phase}
                      </span>
                      <h3
                        className="text-base sm:text-lg md:text-xl font-medium tracking-tight transition-all duration-[400ms]"
                        style={{
                          color: "var(--color-text)",
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>

                    <p
                      className="relative z-10 text-xs sm:text-sm font-light leading-relaxed mt-3 max-w-lg mx-auto"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────
   Future Exploration
   ─────────────────────────────────────────────── */

function FutureExploration() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll("[data-explore-card]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section label — centered */}
        <div className="mb-16 md:mb-20 opacity-0 text-center" data-animate="section-label">
          <p
            className="text-[11px] sm:text-xs tracking-[0.12em] mb-3 font-light"
            style={{ color: "var(--color-text-muted)" }}
          >
            未来探索
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight"
            style={{ color: "var(--color-text)" }}
          >
            探索方向
          </h2>
          <p
            className="text-sm sm:text-base font-light mt-4 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            我正在积极探索的领域——人类创造力与人工智能的交汇之处。
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          {EXPLORATIONS.map((item, i) => (
            <div
              key={i}
              data-explore-card
              className="opacity-0 group"
            >
              <div
                className="relative p-5 sm:p-6 md:p-8 rounded-xl overflow-hidden h-full transition-all duration-[400ms] ease-out hover:scale-[1.015]"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 0%, rgba(160,195,255,0.07) 0%, transparent 65%)",
                  }}
                />

                {/* Tag */}
                <span
                  className="relative z-10 inline-block text-[9px] sm:text-[10px] tracking-[0.12em] font-light mb-4 px-3 py-1 rounded-full"
                  style={{
                    color: "rgba(160,195,255,0.6)",
                    background: "rgba(160,195,255,0.06)",
                    border: "1px solid rgba(160,195,255,0.08)",
                  }}
                >
                  {item.tag.toUpperCase()}
                </span>

                <h3
                  className="relative z-10 text-base sm:text-lg md:text-xl font-medium tracking-tight mb-3 transition-all duration-[400ms]"
                  style={{
                    color: "var(--color-text)",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="relative z-10 text-xs sm:text-sm font-light leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {item.desc}
                </p>

                {/* Accent line */}
                <div
                  className="relative z-10 mt-5 h-px w-6 transition-all duration-500 group-hover:w-12"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(160,195,255,0.15), transparent)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────
   AI-Brain 项目介绍
   ─────────────────────────────────────────────── */

const BUILD_PHASES = [
  {
    phase: "01",
    title: "起点：为什么需要AI大脑",
    desc: "作为摄影与影像创作者，每天面对大量素材管理、视觉分析、后期处理和重复性工作。市面上没有一套工具能真正理解我的创作逻辑——于是决定自己建一个。",
  },
  {
    phase: "02",
    title: "Hermes：核心智能引擎",
    desc: "从 Hermes Agent 开始——作为系统的中央智能，负责理解意图、分解任务、协调代理。让它学会我的工作方式，从简单的任务执行进化到主动策略规划。",
  },
  {
    phase: "03",
    title: "OpenClaw：微信端的远程大脑",
    desc: "接入 OpenClaw Gateway，让 AI 能通过微信与我随时交互。无论在哪里，发条消息就能让系统开始工作——查询资料、执行脚本、管理文件，真正实现远程协作。",
  },
  {
    phase: "04",
    title: "Qwen Vision：给AI一双眼睛",
    desc: "整合通义千问视觉模型，让系统能看懂图像。从素材分类到视觉审美评估，从构图分析到色彩建议——AI 开始理解什么是「好看」的影像。",
  },
  {
    phase: "05",
    title: "AI-Brain：从工具到伙伴",
    desc: "随着更多代理的加入——代码生成、知识管理、深度推理——系统不再是工具集合，而是一个真正理解我、辅助我创作的智能伙伴。从一个人战斗，到一个人 + 一个AI团队。",
  },
];

function AIBrainIntro() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll("[data-ab-card]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full py-20 md:py-28 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section label */}
        <div className="mb-12 md:mb-14 text-center">
          <p
            className="text-[11px] sm:text-xs tracking-[0.15em] mb-3 font-light"
            style={{ color: "var(--color-text-muted)" }}
          >
            项目 · AI-Brain
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight"
            style={{ color: "var(--color-text)" }}
          >
            为什么搭建AI大脑
          </h2>
          <p
            className="text-sm sm:text-base font-light mt-4 max-w-xl mx-auto leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            从一个人、一台相机，到一个AI智能系统——记录我如何用技术放大创作力的旅程。
          </p>
        </div>

        {/* Phase timeline — centered flow */}
        <div className="relative">
          {BUILD_PHASES.map((phase, i) => (
            <div
              key={phase.phase}
              data-ab-card
              className="opacity-0 mb-6 sm:mb-8 last:mb-0"
            >
              <div
                className="relative p-6 sm:p-7 md:p-8 rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 0%, rgba(160,195,255,0.06) 0%, transparent 60%)",
                  }}
                />

                <div className="relative z-10 flex items-start gap-4 sm:gap-6">
                  {/* Phase number — vertical badge */}
                  <div
                    className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-mono"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(160,195,255,0.12)",
                      color: "rgba(160,195,255,0.6)",
                    }}
                  >
                    {phase.phase}
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <h3
                      className="text-base sm:text-lg md:text-xl font-medium tracking-tight mb-2"
                      style={{ color: "var(--color-text)" }}
                    >
                      {phase.title}
                    </h3>
                    <p
                      className="text-xs sm:text-sm font-light leading-relaxed"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {phase.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className="relative z-10 mt-4 ml-14 sm:ml-16 h-px w-8"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(160,195,255,0.15), transparent)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────
   AI-OS — Creator Operating System
   ─────────────────────────────────────────────── */

const PORTALS = [
  { id: "brain", num: "01", label: "AI·BRAIN", desc: "我的第二大脑", detail: "Hermes · OpenClaw · Memory System · DeepSeek · Qwen Vision" },
  { id: "workflow", num: "02", label: "AI·WORKFLOW", desc: "我的AI创作流程", detail: "Idea → Research → Script → Visual → Code → Deploy" },
  { id: "agents", num: "03", label: "AI·AGENTS", desc: "我的AI团队", detail: "Hermes · Coder · Vision · Research · Memory" },
  { id: "toolchain", num: "04", label: "AI·TOOLCHAIN", desc: "我的AI工具生态", detail: "GPT · Claude · Gemini · DeepSeek · Qwen · Kimi · Cursor · Flux" },
];

// Vertical spine layout — nodes positioned along AI Spine
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  brain: { x: 50, y: 8 },
  workflow: { x: 50, y: 28 },
  agents: { x: 50, y: 72 },
  toolchain: { x: 50, y: 92 },
};

/* ── Spatial Transition Overlay ── */
function SpatialTransition({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const ctx = gsap.context(() => {
      gsap.timeline({ onComplete })
        .fromTo(overlay,
          { clipPath: "circle(0% at 50% 50%)" },
          { clipPath: "circle(150% at 50% 50%)", duration: 0.6, ease: "power3.in" }
        )
        .to(overlay, { opacity: 1, duration: 0.2 }, "-=0.3")
        .to(overlay, { opacity: 0.85, duration: 0.15 }, "-=0.1")
        .to(overlay, { opacity: 1, duration: 0.25 });
    });
    return () => ctx.revert();
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div ref={overlayRef} className="absolute inset-0" style={{ background: "#000", clipPath: "circle(0% at 50% 50%)" }} />
      <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(circle at 50% 50%, rgba(160,195,255,0.04) 0%, transparent 50%)", mixBlendMode: "screen" }} />
    </div>
  );
}

/* ── AI Spine — vertical glass structure with flowing light ── */
function AISpine({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number } | null> }) {
  const spineRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const flow = flowRef.current;
    if (!flow) return;
    let start = performance.now(), raf: number;
    const tick = (t: number) => {
      const dt = (t - start) / 1000;
      const y = (dt * 15) % 200 - 50;
      const mx = (mouseRef.current?.x ?? 0.5) - 0.5;
      flow.style.transform = `translateX(${mx * 8}px)`;
      flow.style.background = `linear-gradient(180deg, transparent 0%, rgba(160,195,255,${0.06 + 0.03 * Math.sin(dt * 0.5)}) ${y}%, rgba(200,220,255,${0.04 + 0.02 * Math.sin(dt * 0.7)}) ${y + 15}%, transparent ${y + 30}%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mouseRef]);

  return (
    <div ref={spineRef} className="fixed inset-0 z-[3] pointer-events-none" style={{ pointerEvents: "none" }}>
      {/* Main glass spine */}
      <div className="absolute left-1/2 top-0 bottom-0" style={{ width: "2px", transform: "translateX(-50%)", background: "linear-gradient(180deg, transparent 0%, rgba(160,195,255,0.04) 10%, rgba(160,195,255,0.06) 40%, rgba(160,195,255,0.02) 70%, transparent 100%)" }} />
      {/* Light flow inside spine */}
      <div ref={flowRef} className="absolute left-1/2" style={{ width: "4px", height: "60px", transform: "translateX(-50%)", filter: "blur(3px)", borderRadius: "2px" }} />
      {/* Glass refraction glow */}
      <div className="absolute left-1/2 top-0 bottom-0" style={{ width: "40px", transform: "translateX(-50%)", background: "linear-gradient(90deg, transparent 0%, rgba(160,195,255,0.01) 30%, rgba(160,195,255,0.02) 50%, rgba(160,195,255,0.01) 70%, transparent 100%)", filter: "blur(8px)" }} />
    </div>
  );
}

/* ── Boot Sequence ── */
function BootSequence({ onComplete }: { onComplete: () => void }) {
  const bootRef = useRef<HTMLDivElement>(null);
  const osRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const boot = bootRef.current;
    const os = osRef.current;
    const sub = subRef.current;
    if (!boot || !os || !sub) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete });

      // 0-2s: Pure black (stay black)
      // 2-4s: Ambient particles appear as opacity rises
      tl.to(boot, { opacity: 0.3, duration: 2, ease: "power1.out" }, "+=2")
        // 4-6s: Core glow starts
        .to(boot, { opacity: 0.6, duration: 1.5, ease: "power2.out" })
        // 6s: AI-OS text reveals
        .to(os, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }, "-=0.5")
        .to(sub, { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.6")
        .to(boot, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "+=0.5");
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={bootRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black" style={{ opacity: 1 }}>
      <div className="text-center">
        <h1 ref={osRef} className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight select-none" style={{ color: "#fff", opacity: 0, y: 20, filter: "blur(8px)" }}>
          AI-OS
        </h1>
        <p ref={subRef} className="text-xs sm:text-sm font-light mt-4 max-w-md mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", opacity: 0 }}>
          Creator Operating System powered by AI Agents
        </p>
      </div>
    </div>
  );
}

/* ── Cursor-Reactive Spatial Node ── */
function SpatialNode({ portal, position, index, booted, onClick }: {
  portal: typeof PORTALS[number]; position: { x: number; y: number }; index: number; booted: boolean; onClick: () => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const el = nodeRef.current;
    if (!el || !booted) return;
    gsap.fromTo(el, { opacity: 0, scale: 0.5, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 1.2, delay: 0.3 + index * 0.2, ease: "power3.out" });
  }, [booted, index]);
  useEffect(() => {
    const el = nodeRef.current; if (!el) return;
    let start = performance.now(), raf: number;
    const tick = (t: number) => {
      const dt = (t - start) / 1000;
      el.style.transform = hovered ? `translate(-50%, -50%) scale(1.15) translateY(-6px)` : `translate(calc(-50% + ${Math.cos(dt * 0.1 + index * 2.3) * 2}px), calc(-50% + ${Math.sin(dt * 0.12 + index * 1.8) * 3}px))`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, hovered]);
  return (
    <div ref={nodeRef} className="absolute z-10 cursor-pointer select-none" style={{ left: `${position.x}%`, top: `${position.y}%`, opacity: 0 }}
      onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}>
      <div className="flex flex-col items-center gap-2.5 transition-all duration-700" style={{ filter: hovered ? "brightness(1.4)" : "brightness(0.6)" }}>
        <div className="relative flex items-center justify-center rounded-full transition-all duration-700"
          style={{ width: hovered ? "68px" : "50px", height: hovered ? "68px" : "50px",
            background: hovered ? "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.12), rgba(160,195,255,0.06) 50%, transparent 80%)" : "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.04), rgba(160,195,255,0.02) 50%, transparent 80%)",
            backdropFilter: "blur(24px)", border: hovered ? "1px solid rgba(160,195,255,0.3)" : "1px solid rgba(255,255,255,0.06)",
            boxShadow: hovered ? "0 0 50px rgba(160,195,255,0.10)" : "0 0 8px rgba(255,255,255,0.01)" }}>
          <span className="font-mono font-light select-none transition-all duration-500"
            style={{ fontSize: hovered ? "15px" : "10px", color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)" }}>{portal.num}</span>
        </div>
        <p className="text-[9px] font-light tracking-[0.08em] select-none transition-all duration-500"
          style={{ color: hovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)" }}>{portal.label}</p>
      </div>
    </div>
  );
}

/* ── AI Core — neural network structure ── */
function AICore({ coreRef, mouseRef }: { coreRef: React.RefObject<HTMLDivElement | null>; mouseRef: React.RefObject<{ x: number; y: number } | null> }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const inner = innerRef.current, r1 = ring1Ref.current, r2 = ring2Ref.current;
    if (!inner) return;
    let start = performance.now(), raf: number;
    const tick = (t: number) => {
      const dt = (t - start) / 1000;
      const pulse = 0.8 + 0.2 * Math.sin(dt * 0.3);
      const mx = (mouseRef.current?.x ?? 0.5) - 0.5, my = (mouseRef.current?.y ?? 0.5) - 0.5;
      inner.style.transform = `scale(${pulse}) translate(${mx * 4}px, ${my * 3}px)`;
      if (r1) r1.style.transform = `rotate(${dt * 6}deg) translate(${mx * 8}px, ${my * 5}px)`;
      if (r2) r2.style.transform = `rotate(${-dt * 4}deg) translate(${mx * 5}px, ${my * 8}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mouseRef]);
  return (
    <div ref={coreRef} className="absolute z-10 pointer-events-none select-none" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", opacity: 0 }}>
      <div className="absolute" style={{ width: "clamp(200px, 25vw, 400px)", height: "clamp(200px, 25vw, 400px)", borderRadius: "50%", left: "50%", top: "50%", transform: "translate(-50%, -50%)", background: "radial-gradient(circle at 50% 50%, rgba(160,195,255,0.04), transparent 60%)", filter: "blur(40px)" }} />
      <div ref={ring1Ref} className="absolute" style={{ width: "clamp(160px, 18vw, 260px)", height: "clamp(160px, 18vw, 260px)", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
        <div style={{ position: "absolute", inset: "0", borderRadius: "50%", border: "1px solid rgba(160,195,255,0.04)" }} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (<div key={i} className="absolute" style={{ left: "50%", top: "0", width: "3px", height: "3px", borderRadius: "50%", background: "rgba(160,195,255,0.15)", transform: `translateX(-50%) rotate(${i * 45}deg)`, transformOrigin: "50% 130px" }} />))}
      </div>
      <div ref={ring2Ref} className="absolute" style={{ width: "clamp(200px, 22vw, 320px)", height: "clamp(200px, 22vw, 320px)", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
        <div style={{ position: "absolute", inset: "0", borderRadius: "50%", border: "1px solid rgba(180,210,255,0.03)" }} />
        {[0, 1, 2, 3, 4, 5].map(i => (<div key={i} className="absolute" style={{ left: "0", top: "50%", width: "4px", height: "4px", borderRadius: "50%", background: "rgba(180,210,255,0.1)", transform: `translateY(-50%) rotate(${i * 60}deg)`, transformOrigin: "160px 50%" }} />))}
      </div>
      <div ref={innerRef} className="relative mx-auto" style={{ width: "clamp(80px, 10vw, 140px)", height: "clamp(80px, 10vw, 140px)", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.05), rgba(160,195,255,0.02) 40%, transparent 70%)", backdropFilter: "blur(4px)" }}>
        <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 50% 50%, rgba(180,210,255,0.03), transparent 60%)", animation: "core-breathe 4s ease-in-out infinite" }} />
      </div>
      <p className="text-[9px] font-light tracking-[0.25em] mt-4 text-center" style={{ color: "rgba(255,255,255,0.15)" }}>AI·CORE</p>
    </div>
  );
}

/* ── 4 AI-OS Narrative Chapters — scroll-revealed ── */
const CHAPTER_NODES = [
  {
    id: "understanding-ai-agents", route: "/ai-lab/understanding-ai-agents",
    num: "01", category: "THEORY", title: "AI / AGENT",
    subtitle: "从工具到协作者", desc: "我如何理解智能、代理与人的新关系。",
    x: -16, y: -24,
  },
  {
    id: "ai-brain", route: "/ai-lab/ai-brain",
    num: "02", category: "SYSTEM", title: "AI-BRAIN",
    subtitle: "随身携带的多Agent办公室", desc: "记忆、人格、任务与多个Agent的协作系统。",
    x: 28, y: -25,
  },
  {
    id: "built-with-ai", route: "/ai-lab/built-with-ai",
    num: "03", category: "PROCESS", title: "BUILT WITH AI",
    subtitle: "我如何与AI一起完成这个网站", desc: "一次持续试错、判断与共同创造的过程。",
    x: -14, y: 16,
  },
  {
    id: "future-of-agents", route: "/ai-lab/future-of-agents",
    num: "04", category: "FUTURE", title: "BEYOND AGENTS",
    subtitle: "Agent之后，还能发生什么", desc: "关于未来工作、创造与数字生活的想象。",
    x: 30, y: 18,
  },
];

function SpaceProjectNodes({ scrollProgress, stageProgress, hoveredChapter, onHover }: { scrollProgress: number; stageProgress: number; hoveredChapter: string | null; onHover: (id: string | null) => void }) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="absolute inset-0 z-15 pointer-events-none select-none">
      {CHAPTER_NODES.map((node, i) => {
        // Stage-driven entry: uses stageProgress for dramatic entry + scrollProgress for sustained
        const s = Math.max(stageProgress, Math.max(0, Math.min(1, (scrollProgress - 0.06) / 0.42)));
        const opacity = s;
        const scaleVal = 0.95 + 0.05 * s;
        const blurVal = Math.max(0, 7 * (1 - s));

        // Exit after 0.66 — DISABLED, using screen-space CSS transform on stage wrapper
        const exitY = 0;

        // Shorter entry distance
        const angle = Math.atan2(node.y, node.x);
        const dist = 60;
        const xOff = Math.cos(angle) * dist * (1 - s);
        const yOff = Math.sin(angle) * dist * (1 - s);

        const isHovered = hoveredChapter === node.id;
        const hScale = isHovered ? scaleVal * 1.025 : scaleVal;
        const hX = isHovered ? node.x * 0.015 : 0;
        const hY = isHovered ? node.y * 0.015 : 0;

        const left = isMobile ? "50%" : `calc(50% + ${node.x - 10 + hX + xOff}%)`;
        const top = isMobile
          ? `calc(50% + ${(i - 1.5) * 24 + 10}%)`
          : `calc(50% + ${node.y + hY + yOff + exitY}%)`;

        return (
          <div
            key={node.id}
            onClick={() => router.push(node.route)}
            onMouseEnter={(e) => { onHover(node.id); }}
            onMouseLeave={(e) => { onHover(null); }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.style.setProperty("--lx", String(x));
              e.currentTarget.style.setProperty("--ly", String(y));
            }}
            className="pointer-events-auto cursor-pointer"
            style={{
              position: "absolute",
              left,
              top,
              transform: `translate(-50%, -50%) scale(${hScale})`,
              opacity,
              filter: `blur(${blurVal}px)`,
              transition: "transform 0.4s ease, opacity 0.3s ease",
              willChange: "transform, opacity, filter",
              pointerEvents: s > 0.6 ? "auto" : "none" as any,
              width: isMobile ? "min(84vw, 340px)" : "clamp(390px, 25vw, 490px)",
            }}
          >
            {/* Glass frame */}
            <div style={{
              position: "relative",
              width: "100%",
              borderRadius: 22,
              padding: "18px 22px",
              background: isHovered
                ? "linear-gradient(135deg, rgba(236,248,255,0.27), rgba(157,197,220,0.16))"
                : "linear-gradient(135deg, rgba(236,248,255,0.20), rgba(157,197,220,0.10))",
              backdropFilter: `blur(${isHovered ? 22 : 16}px)`,
              WebkitBackdropFilter: `blur(${isHovered ? 22 : 16}px)`,
              border: isHovered
                ? "1px solid rgba(240,250,255,0.55)"
                : "1px solid rgba(240,250,255,0.38)",
              boxShadow: isHovered
                ? "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(45,91,120,0.2), 0 24px 56px rgba(17,49,70,0.22), 0 8px 20px rgba(17,49,70,0.12)"
                : "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(45,91,120,0.14), 0 18px 42px rgba(17,49,70,0.14), 0 6px 14px rgba(17,49,70,0.08)",
              transition: "all 0.35s ease",
              color: isHovered ? "rgba(245,251,255,0.95)" : "rgba(235,248,255,0.8)",
            }}>
              {/* Line 1: Number / Category */}
              <div style={{
                fontSize: 9,
                fontWeight: 300,
                letterSpacing: "0.18em",
                fontFamily: "var(--font-inter)",
                opacity: s,
                marginBottom: 4,
                color: "rgba(210,235,250,0.6)",
              }}>
                {node.num} / {node.category}
              </div>
              {/* Line 2: English Title */}
              <div style={{
                fontSize: "clamp(15px, 1.5vw, 19px)",
                fontWeight: isHovered ? 400 : 300,
                letterSpacing: "0.04em",
                fontFamily: "var(--font-inter)",
                whiteSpace: "nowrap",
                opacity: s,
                transition: "font-weight 0.35s ease",
                color: "rgba(245,251,255,0.92)",
              }}>
                {node.title}
              </div>
              {/* Line 3: Chinese Subtitle */}
              <div style={{
                fontSize: "clamp(12px, 1vw, 14px)",
                fontWeight: 300,
                letterSpacing: "0.06em",
                fontFamily: "var(--font-noto-serif-sc)",
                opacity: s * (isHovered ? 0.88 : 0.7),
                transition: "opacity 0.35s ease",
                marginTop: 1,
                color: "rgba(235,247,255,0.82)",
              }}>
                {node.subtitle}
              </div>
              {/* Line 4: Description */}
              <div style={{
                fontSize: "clamp(10px, 0.75vw, 11px)",
                fontWeight: 300,
                letterSpacing: "0.04em",
                fontFamily: "var(--font-inter)",
                opacity: s * (isHovered ? 0.72 : 0.58),
                transition: "opacity 0.35s ease",
                marginTop: 3,
                color: "rgba(225,241,250,0.65)",
              }}>
                {node.desc}
              </div>
              {/* Line 5: Arrow */}
              <div style={{
                fontSize: 9,
                opacity: s * (isHovered ? 0.6 : 0),
                transform: isHovered ? "translateX(0)" : "translateX(-4px)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
                marginTop: 4,
                color: "rgba(210,235,255,0.6)",
              }}>
                ENTER →
              </div>

              {/* Top edge highlight — glass reflection */}
              {isHovered && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: "10%",
                  width: "80%",
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                }} />
              )}
              {/* Hover light — follows mouse within card */}
              <div style={{ position: "absolute", inset: 0, borderRadius: 22, pointerEvents: "none", overflow: "hidden", opacity: isHovered ? 1 : 0, transition: "opacity 0.3s ease", background: "radial-gradient(circle at var(--lx, 50%) var(--ly, 50%), rgba(245,252,255,0.45) 0%, rgba(206,235,249,0.22) 22%, rgba(166,211,234,0.08) 48%, transparent 70%)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── AI-OS Back Button ── */
function MobileHubView({ onEnterPortal }: { onEnterPortal: (id: string) => void }) {
  const portalByChapter: Record<string, string> = {
    "understanding-ai-agents": "agents",
    "ai-brain": "brain",
    "built-with-ai": "workflow",
    "future-of-agents": "toolchain",
  };

  return (
    <div
      className="relative min-h-[100svh] overflow-x-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 12%, rgba(202,229,243,0.34) 0%, rgba(119,169,198,0.18) 34%, transparent 62%), linear-gradient(180deg, #789fb7 0%, #365c74 42%, #10283a 72%, #07131e 100%)",
      }}
    >
      <AiOsBackButton />

      <section className="relative h-[82svh] min-h-[620px] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transform: "scale(0.64)", transformOrigin: "50% 44%" }}
        >
          <AISpace scrollProgress={0} hoveredChapter={null} stageProgress={0} />
        </div>

        <div className="absolute inset-x-6 bottom-14 z-20 text-center">
          <p className="text-[10px] font-light leading-relaxed tracking-[0.16em]" style={{ color: "rgba(242,250,255,0.58)" }}>
            AN EVOLVING CREATIVE OPERATING SYSTEM BUILT WITH AI
          </p>
          <div className="mx-auto mt-5 h-px w-12" style={{ background: "linear-gradient(90deg, transparent, rgba(235,248,255,0.65), transparent)" }} />
          <p className="mt-3 text-[9px] tracking-[0.2em]" style={{ color: "rgba(235,248,255,0.38)" }}>
            EXPLORE THE SYSTEM
          </p>
        </div>
      </section>

      <section className="relative z-20 px-4 pb-24">
        <div className="mx-auto flex w-full max-w-md flex-col gap-4">
          {CHAPTER_NODES.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() => onEnterPortal(portalByChapter[node.id])}
              className="w-full rounded-[22px] p-5 text-left"
              style={{
                minHeight: 148,
                color: "rgba(245,251,255,0.94)",
                background: "linear-gradient(135deg, rgba(236,248,255,0.20), rgba(157,197,220,0.11))",
                border: "1px solid rgba(240,250,255,0.38)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.32), 0 18px 42px rgba(7,30,45,0.14)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              <span className="block text-[9px] font-light tracking-[0.2em]" style={{ color: "rgba(220,240,252,0.62)" }}>
                {node.num} / {node.category}
              </span>
              <span className="mt-3 block text-xl font-light tracking-[0.04em]">{node.title}</span>
              <span className="mt-1 block text-sm font-light tracking-[0.04em]" style={{ color: "rgba(236,247,255,0.78)" }}>
                {node.subtitle}
              </span>
              <span className="mt-2 block text-xs font-light leading-relaxed" style={{ color: "rgba(225,241,250,0.62)" }}>
                {node.desc}
              </span>
              <span className="mt-4 block text-[9px] tracking-[0.18em]" style={{ color: "rgba(225,242,255,0.55)" }}>
                ENTER →
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function AiOsBackButton({ visible = true }: { visible?: boolean }) {
  const { goBackWithTransition } = usePageTransition();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const goBack = () => goBackWithTransition();

  return (
    <button
      onClick={goBack}
      className="fixed z-[9997] pointer-events-auto select-none flex items-center gap-2.5 transition-all duration-500"
      style={{
        left: "clamp(20px, 3.5vw, 40px)",
        top: "clamp(20px, 3.5vw, 36px)",
        opacity: show && visible ? 0.85 : 0,
        color: "rgba(200,225,245,0.8)",
        fontSize: "clamp(15px, 1.6vw, 20px)",
        letterSpacing: "0.08em",
        background: "rgba(220,240,255,0.04)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        padding: "10px 18px 10px 14px",
        borderRadius: 30,
        border: "1px solid rgba(220,240,255,0.12)",
        cursor: "pointer",
        fontFamily: "var(--font-inter)",
        transition: "opacity 0.5s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(230,245,255,0.95)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(200,225,245,0.8)"; }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      <span>BACK</span>
    </button>
  );
}

/* ── AI-OS 3D Space Engine ── */
import AISpace from "@/components/spatial/AISpace";

function HubView({ onEnterPortal }: { onEnterPortal: (id: string) => void }) {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const smooth = useRef({ x: -100, y: -100 });
  const prevPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef(0);
  const [show, setShow] = useState(false);
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);
  const [stageProgress, setStageProgress] = useState(0);
  const [clusterExitY, setClusterExitY] = useState(0);
  const [finalReveal, setFinalReveal] = useState(0);
  const [backVisible, setBackVisible] = useState(true);
  const [projectsReady, setProjectsReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const sp = Math.min(1, Math.max(0, window.scrollY / max));
      setScrollProgress(sp);
      if (!projectsReady) setProjectsReady(true);

      // Stage progress — smooth, fully reversible, directly from scroll
      const stageRaw = Math.max(0, Math.min(1, (sp - 0.02) / 0.28));
      const stageEased = stageRaw * stageRaw * (3 - 2 * stageRaw);
      setStageProgress(stageEased);

      // Cluster exit Y — screen-space CSS transform on stage wrapper (0.50 → 0.80)
      const exitClamp = Math.max(0, Math.min(1, (sp - 0.50) / 0.30));
      const easedExit = exitClamp * exitClamp * (3 - 2 * exitClamp);
      const vh = window.innerHeight;
      setClusterExitY(-easedExit * vh);

      // Final statement reveal — only after cluster is gone (0.84 → 0.96)
      const revealClamp = Math.max(0, Math.min(1, (sp - 0.84) / 0.12));
      setFinalReveal(revealClamp * revealClamp * (3 - 2 * revealClamp));

      // Back button fade in final stage
      setBackVisible(sp < 0.78);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cursor dot (ring) only — DOM trail replaced by Canvas CursorLightTrail
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches === false) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let leaveTimer: ReturnType<typeof setTimeout>;

    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setShow(true);
      clearTimeout(leaveTimer);
    };
    const onLeave = () => { leaveTimer = setTimeout(() => setShow(false), 300); };
    const onEnter = () => { clearTimeout(leaveTimer); setShow(true); };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    const tick = () => {
      const dot = dotRef.current;
      if (!dot) { rafRef.current = requestAnimationFrame(tick); return; }
      const sx = smooth.current.x + (pos.current.x - smooth.current.x) * 0.28;
      const sy = smooth.current.y + (pos.current.y - smooth.current.y) * 0.28;
      smooth.current.x = sx;
      smooth.current.y = sy;
      dot.style.transform = `translate3d(${sx - 7.5}px, ${sy - 7.5}px, 0)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(leaveTimer);
    };
  }, []);

  if (isMobile) return <MobileHubView onEnterPortal={onEnterPortal} />;

  return (
    <div className="relative" style={{ height: "300vh" }}>
      {/* Full-page glass background — fixed, behind everything */}
      <div className="fixed inset-0 pointer-events-none" style={{
        zIndex: 0,
        background: `
          radial-gradient(ellipse at 50% 35%, rgba(198,224,239,0.28) 0%, rgba(145,190,216,0.18) 30%, rgba(64,106,134,0.12) 58%, rgba(10,25,38,0.88) 100%),
          linear-gradient(135deg, #a9cadb 0%, #789fb7 25%, #365c74 55%, #10283a 80%, #07131e 100%)
        `,
      }}>
        {/* Glass blur overlay */}
        <div className="absolute inset-0" style={{
          backdropFilter: "blur(16px) saturate(110%) brightness(1.03)",
          WebkitBackdropFilter: "blur(16px) saturate(110%) brightness(1.03)",
          background: "rgba(218,235,245,0.025)",
        }} />
        {/* Oversized soft light from upper-left */}
        <div className="absolute pointer-events-none" style={{
          top: "-20vh",
          left: "-20vw",
          width: "140vw",
          height: "130vh",
          background: "radial-gradient(ellipse at 45% 40%, rgba(225,243,252,0.20) 0%, rgba(184,218,237,0.10) 30%, rgba(112,165,197,0.04) 55%, transparent 75%)",
        }} />
        {/* Secondary softer light from right */}
        <div className="absolute pointer-events-none" style={{
          top: "-10vh",
          right: "-30vw",
          width: "120vw",
          height: "100vh",
          background: "radial-gradient(ellipse at center, rgba(200,228,245,0.08) 0%, rgba(150,195,220,0.04) 35%, transparent 65%)",
        }} />
      </div>

      {/* Back button — outside stage wrapper so it doesn't exit */}
      <AiOsBackButton visible={backVisible} />

      {/* Stage wrapper — Canvas + project nodes move together via CSS transform */}
      <div className="sticky top-0 w-full h-screen overflow-hidden" style={{ transform: `translateY(${clusterExitY}px)`, willChange: "transform" }}>
        <AISpace scrollProgress={scrollProgress} hoveredChapter={hoveredChapter} stageProgress={stageProgress} />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 3) }}>
          <p className="text-xs sm:text-sm font-light max-w-md text-center leading-relaxed tracking-[0.05em]"
            style={{ color: "rgba(255,255,255,0.3)" }}>
            An evolving creative operating system built with AI
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 5) }}>
          <p className="text-[10px] font-light tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.12)" }}>
            SCROLL TO EXPLORE
          </p>
        </div>

        {/* ── 4 Project Nodes (hidden until first scroll to prevent FOUC) ── */}
        <div style={{ opacity: projectsReady ? 1 : 0, visibility: projectsReady ? "visible" : "hidden", transition: "none" }}>
          <SpaceProjectNodes scrollProgress={scrollProgress} stageProgress={stageProgress} hoveredChapter={hoveredChapter} onHover={setHoveredChapter} />
        </div>
      </div>

      {/* ── Final Statement ── */}
      <div className="fixed inset-0 pointer-events-none select-none flex items-center justify-center" style={{ zIndex: 5 }}>
        <div className="text-center" style={{
          opacity: finalReveal,
          filter: `blur(${(1 - finalReveal) * 24}px)`,
          transform: `translateY(${(1 - finalReveal) * 35}px) scale(${0.96 + 0.04 * finalReveal})`,
          transition: "none",
        }}>
          <h1 className="font-light tracking-[0.12em] mb-4" style={{
            fontSize: "clamp(48px, 6vw, 96px)",
            color: "rgba(210,232,250,0.78)",
            fontFamily: "var(--font-inter)",
          }}>
            THANKS FOR LOOKING.
          </h1>
          <p className="text-xs tracking-[0.15em]" style={{
            color: "rgba(180,215,240,0.55)",
            fontFamily: "var(--font-inter)",
            opacity: Math.max(0, Math.min(1, (finalReveal - 0.3) / 0.7)),
          }}>
            Designed, researched and built independently.
          </p>
        </div>
      </div>

      {/* Glass micro-ring cursor — replaces solid dot */}
      <CursorLightTrail />
      <div
        ref={dotRef}
        className="pointer-events-none select-none"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          border: "1px solid rgba(210,228,245,0.55)",
          background: "rgba(175,205,235,0.025)",
          boxShadow: "0 0 5px rgba(195,225,255,0.18), inset 0 0 3px rgba(225,240,255,0.12)",
          opacity: show ? 0.75 : 0,
          transition: "opacity 0.25s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background 0.2s ease",
          transform: "translate3d(-100px, -100px, 0)",
          willChange: "transform",
          zIndex: 99999,
        }}
        onMouseDown={(e) => { const el = e.currentTarget; el.style.transform = `translate3d(${smooth.current.x - 7.5}px, ${smooth.current.y - 7.5}px, 0) scale(0.9)`; el.style.transition = "transform 0.1s ease, opacity 0.25s ease, width 0.2s ease, height 0.2s ease"; }}
        onMouseUp={(e) => { const el = e.currentTarget; el.style.transform = `translate3d(${smooth.current.x - 7.5}px, ${smooth.current.y - 7.5}px, 0) scale(1)`; }}
      >
        <div style={{ position: "absolute", top: "1px", right: "1px", width: "3px", height: "3px", borderRadius: "50%", background: "rgba(225,240,255,0.55)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "2px", left: "2px", width: "2px", height: "2px", borderRadius: "50%", background: "rgba(195,220,245,0.15)", pointerEvents: "none" }} />
      </div>

    </div>
  );
}

/* ── Floating Glass Pane ── */
function FloatingGlassPane({ index, mouseRef }: { index: number; mouseRef: React.RefObject<{ x: number; y: number } | null> }) {
  const paneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = paneRef.current; if (!el) return;
    let start = performance.now(), raf: number;
    const tick = (t: number) => {
      const dt = (t - start) / 1000;
      const fx = Math.sin(dt * 0.08 + index * 2.1) * 8;
      const fy = Math.cos(dt * 0.06 + index * 1.7) * 6;
      const mx = (mouseRef.current?.x ?? 0.5) - 0.5;
      const my = (mouseRef.current?.y ?? 0.5) - 0.5;
      el.style.transform = `translate(calc(-50% + ${fx}px + ${mx * 20}px), calc(-50% + ${fy}px + ${my * 15}px)) rotate(${Math.sin(dt * 0.03 + index) * 1.5}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, mouseRef]);
  const shapes = ["polygon(0% 10%, 100% 0%, 95% 90%, 5% 100%)", "polygon(5% 5%, 95% 15%, 90% 85%, 10% 95%)", "polygon(10% 0%, 100% 5%, 90% 100%, 0% 90%)"];
  const positions = [{ left: "15%", top: "20%", w: "45%", h: "55%" }, { left: "50%", top: "40%", w: "50%", h: "40%" }, { left: "30%", top: "60%", w: "40%", h: "45%" }];
  return (
    <div ref={paneRef} className="fixed z-[3] pointer-events-none"
      style={{ left: positions[index].left, top: positions[index].top, width: positions[index].w, height: positions[index].h, clipPath: shapes[index], background: "rgba(255,255,255,0.008)", backdropFilter: "blur(60px)", WebkitBackdropFilter: "blur(60px)", border: "1px solid rgba(255,255,255,0.03)", animation: `glass-pane-pulse ${12 + index * 3}s ease-in-out ${[0, 2.5, 5][index]}s infinite` }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 30%, rgba(160,195,255,0.01) 60%, rgba(255,255,255,0.02) 100%)" }} />
    </div>
  );
}

/* ── Vertical Volumetric Light ── */
function VerticalLightBeam({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number } | null> }) {
  const beamRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = beamRef.current; if (!el) return; let raf: number;
    const tick = () => {
      const mx = mouseRef.current?.x ?? 0.5;
      el.style.left = `${20 + mx * 60}%`;
      el.style.opacity = String(0.4 + 0.3 * (1 - Math.abs(mx - 0.5) * 2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mouseRef]);
  return (
    <div className="fixed inset-0 z-[4] pointer-events-none" style={{ mixBlendMode: "screen" }}>
      <div ref={beamRef} className="absolute top-0 bottom-0 w-[15%]"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(180,210,255,0.02) 15%, rgba(160,195,255,0.03) 35%, rgba(200,220,255,0.04) 50%, rgba(160,195,255,0.03) 65%, rgba(180,210,255,0.02) 85%, transparent 100%)", transform: "skewX(-2deg)", transition: "left 0.8s ease-out, opacity 0.8s ease-out" }} />
      <div className="absolute top-[20%] bottom-[20%] w-[40%]" style={{ left: "30%", background: "linear-gradient(90deg, transparent 0%, rgba(160,195,255,0.008) 30%, rgba(160,195,255,0.012) 50%, rgba(160,195,255,0.008) 70%, transparent 100%)", animation: "beam-breathe 5s ease-in-out infinite" }} />
    </div>
  );
}

/* ── Neural Particle Field ── */
function NeuralParticleField({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number } | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let w = window.innerWidth, h = window.innerHeight;
    const resize = () => { w = window.innerWidth; h = window.innerHeight; canvas!.width = w; canvas!.height = h; };
    resize(); window.addEventListener("resize", resize);
    const N = 28;
    const particles = Array.from({ length: N }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.08, vy: (Math.random() - 0.5) * 0.08, size: 1 + Math.random() * 2, opacity: 0.08 + Math.random() * 0.15, phase: Math.random() * Math.PI * 2 }));
    let raf: number;
    const tick = () => {
      ctx!.clearRect(0, 0, w, h);
      const mx = mouseRef.current?.x ?? 0.5, my = mouseRef.current?.y ?? 0.5;
      const mpx = mx * w, mpy = my * h;
      ctx!.lineWidth = 0.5;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.15;
            ctx!.beginPath(); ctx!.moveTo(particles[i].x, particles[i].y); ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(160,195,255,${alpha})`; ctx!.stroke();
          }
        }
      }
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const dx = p.x - mpx, dy = p.y - mpy, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) { const force = (250 - dist) / 250 * 0.15; p.x += (dx / dist) * force; p.y += (dy / dist) * force; }
        const pulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.0008 + p.phase);
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(180,210,255,${p.opacity * pulse})`; ctx!.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [mouseRef]);
  return <canvas ref={canvasRef} className="fixed inset-0 z-[8] pointer-events-none" />;
}

/* ── Portal Content View ── */
function PortalView({ portalId, onBack }: { portalId: string; onBack: () => void }) {
  return (
    <div className="relative min-h-screen">
      {/* Back button */}
      <button
        onClick={onBack}
        className="group fixed top-6 left-4 md:top-8 md:left-8 z-30 flex items-center gap-2 text-sm md:text-base tracking-[0.08em] font-light transition-all duration-300 cursor-pointer py-2.5 px-3.5"
        style={{ color: "var(--color-text-muted)", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "8px" }}
      >
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5">←</span>
        <span>实验室</span>
      </button>

      {portalId === "brain" && (
        <>
          <div className="pt-20"><AIBrainSection /></div>
          <BrainVisualization />
        </>
      )}
      {portalId === "workflow" && <WorkflowTimeline />}
      {portalId === "agents" && <AIAssistantContent />}
      {portalId === "toolchain" && (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-xl">
            <p className="text-[10px] sm:text-xs tracking-[0.15em] mb-4 font-light animate-breathe" style={{ color: "var(--color-text-muted)" }}>04 · 工具生态</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4" style={{ color: "var(--color-text)" }}>AI·TOOLCHAIN</h2>
            <p className="text-sm sm:text-base font-light leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              我的AI工具生态——GPT · Claude · Gemini · DeepSeek · Qwen · Kimi · Cursor · Flux，围绕AI Core协同运作。正在构建中。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── AI-Brain content bundle ── */
function AIBrainSection() {
  return (
    <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-16">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <p className="text-[10px] sm:text-xs tracking-[0.15em] mb-4 font-light animate-breathe" style={{ color: "var(--color-text-muted)" }}>01 · Personal Intelligence System</p>
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.0]" style={{ color: "var(--color-text)" }}>AI·BRAIN</h2>
        <p className="text-sm sm:text-base font-light mt-5 max-w-lg mx-auto leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          只要这个文件夹还在，任何一台电脑、任何一个设备上，我都能无缝衔接我的个人AI办公室。不是工具，是我的数字分身。
        </p>
      </div>
      <AIBrainIntro />
    </section>
  );
}

/* ── AI Assistant — Personal AI Team ── */
function AIAssistantContent() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll("[data-agent-card]");
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, delay: i * 0.12, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" } }
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const TEAM = [
    { name: "Hermes", role: "核心智能引擎", desc: "负责理解意图、分解复杂任务、协调各代理协作，维护跨会话上下文的连续性——AI-Brain 的中枢大脑。" },
    { name: "电次", role: "远程微信助手", desc: "通过微信生态提供实时消息响应与自动化服务。无论在哪里，发条消息就能让系统开始工作。" },
    { name: "Qwen Vision", role: "视觉智能", desc: "基于通义千问视觉大模型，对图像进行深度分析与美学评估——从构图到色彩，理解什么是好的影像。" },
    { name: "Coder Agent", role: "工程开发", desc: "全栈代码生成引擎——从架构设计到生产部署，快速构建高质量、可维护的生产级应用。" },
    { name: "Memory System", role: "知识管理", desc: "跨会话的记忆与知识管理系统，让 AI 具备持续学习能力，每一次交互都比上一次更了解我。" },
  ];

  return (
    <section ref={sectionRef} className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <p className="text-[10px] sm:text-xs tracking-[0.15em] mb-4 font-light animate-breathe" style={{ color: "var(--color-text-muted)" }}>03 · A Personal AI Team</p>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight leading-[1.0]" style={{ color: "var(--color-text)" }}>AI·ASSISTANT</h2>
        <p className="text-sm sm:text-base font-light mt-4 max-w-lg mx-auto leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          我的个人AI团队——5个专业代理、24小时在线、无缝协作。从策略规划到代码执行、从视觉审美到知识管理，覆盖创作的每一个环节。
        </p>
      </div>

      <div className="w-full max-w-2xl mx-auto space-y-4">
        {TEAM.map((member, i) => (
          <div key={member.name} data-agent-card className="opacity-0">
            <div className="relative p-5 sm:p-6 rounded-xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.025)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="relative z-10 flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ background: "rgba(160,195,255,0.08)", border: "1px solid rgba(160,195,255,0.12)", color: "rgba(160,195,255,0.7)" }}>
                  {member.name[0]}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-medium tracking-tight" style={{ color: "var(--color-text)" }}>{member.name}</h3>
                  <p className="text-[11px] sm:text-xs font-light mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{member.role}</p>
                  <p className="text-xs sm:text-sm font-light mt-1.5 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{member.desc}</p>
                </div>
              </div>
              <div className="relative z-10 mt-3 ml-14 h-px w-6"
                style={{ background: "linear-gradient(90deg, rgba(160,195,255,0.12), transparent)" }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AILabPage() {
  const [view, setView] = useState<"hub" | "brain" | "workflow" | "agents" | "toolchain">("hub");
  const [transitionActive, setTransitionActive] = useState(false);

  const enterPortal = (id: string) => {
    setTransitionActive(true);
    setTimeout(() => {
      setView(id as typeof view);
      setTransitionActive(false);
    }, 1000);
  };

  const backToHub = () => {
    setTransitionActive(true);
    setTimeout(() => {
      setView("hub");
      setTransitionActive(false);
    }, 800);
  };

  return (
    <>
      <SpatialTransition active={transitionActive} onComplete={() => {}} />
      {view === "hub" ? (
        <HubView onEnterPortal={enterPortal} />
      ) : (
        <PortalView portalId={view} onBack={backToHub} />
      )}
    </>
  );
}
