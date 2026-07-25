export interface Project {
  id: string
  index: string
  category: "commercial" | "narrative" | "archive"
  brand: string
  brandCn?: string
  title: string
  role: string
  description: string
  images: {
    cover: {
      desktop: string
      desktop2x: string
      mobile: string
    }
    gallery: string[]
    stills: string[]
    bts: string[]
  }
  filmUrl?: string
  platform?: "weixin" | "xinpianchang" | "bilibili" | "official" | null
  assets: {
    heroImage?: string
    permissionStatus?: "cleared" | "pending" | "restricted"
  }
  buttonLabel: string
  color?: string
}

const rawProjects: Project[] = [
  // ============ Commercial (商业影像) ============
  {
    id: "maxrieny",
    index: "01",
    category: "commercial",
    brand: "MAXRIENY",
    brandCn: "未至之境",
    title: "The Way to Unknown",
    role: "Trinity（稳定器）",
    description:
      "MAXRIENY 2025 春夏 未至之境 The Way to Unknown 品牌影片",
    images: {
      cover: {
        desktop: "/images/projects/maxrieny/cover-desktop.webp",
        desktop2x: "/images/projects/maxrieny/cover-desktop.webp",
        mobile: "/images/projects/maxrieny/cover-desktop.webp",
      },
      gallery: [
        "/images/projects/maxrieny/gallery-01.webp",
        "/images/projects/maxrieny/gallery-02.webp",
        "/images/projects/maxrieny/gallery-03.webp",
      ],
      stills: [],
      bts: [],
    },
    filmUrl: "https://weixin.qq.com/sph/AsJNBmWM39",
    platform: "weixin",
    assets: { heroImage: "/images/hero/hero-desktop.webp", permissionStatus: "cleared" },
    buttonLabel: "Watch Film ▸",
  },
  {
    id: "arcteryx",
    index: "02",
    category: "commercial",
    brand: "ARC'TERYX × SONGTSAM",
    brandCn: "始祖鸟 × 松赞",
    title: "始祖鸟 × 松赞品牌影片",
    role: "摄影师",
    description:
      "始祖鸟 × 松赞 品牌影片",
    images: {
      cover: {
        desktop: "/images/projects/arcteryx/cover-desktop.webp",
        desktop2x: "/images/projects/arcteryx/cover-desktop.webp",
        mobile: "/images/projects/arcteryx/cover-desktop.webp",
      },
      gallery: [
        "/images/projects/arcteryx/gallery-01.webp",
        "/images/projects/arcteryx/gallery-02.webp",
        "/images/projects/arcteryx/gallery-03.webp",
      ],
      stills: [],
      bts: [],
    },
    filmUrl: "https://www.xinpianchang.com/a13099638",
    platform: "xinpianchang",
    assets: { permissionStatus: "cleared" },
    buttonLabel: "Watch Film ▸",
  },
  {
    id: "mercedes",
    index: "03",
    category: "commercial",
    brand: "Mercedes-Benz",
    brandCn: "奔驰",
    title: "奔驰品牌影像项目",
    role: "焦点员 (Focus Puller)",
    description:
      "梅赛德斯-奔驰 S级 品牌影片",
    images: {
      cover: {
        desktop: "/images/projects/mercedes/cover-desktop.webp",
        desktop2x: "/images/projects/mercedes/cover-desktop.webp",
        mobile: "/images/projects/mercedes/cover-desktop.webp",
      },
      gallery: [
        "/images/projects/mercedes/gallery-01.webp",
        "/images/projects/mercedes/gallery-02.webp",
      ],
      stills: [],
      bts: [],
    },
    filmUrl: "https://b23.tv/1R5gaga",
    platform: "bilibili",
    assets: { permissionStatus: "cleared" },
    buttonLabel: "Watch Film ▸",
  },
  {
    id: "jinjiang",
    index: "04",
    category: "commercial",
    brand: "锦江荟",
    title: "锦江荟 × 胡歌品牌形象片",
    role: "摄影师",
    description:
      "锦江荟 × 胡歌 品牌形象片",
    images: {
      cover: {
        desktop: "/images/projects/jinjiang/cover-desktop.webp",
        desktop2x: "/images/projects/jinjiang/cover-desktop.webp",
        mobile: "/images/projects/jinjiang/cover-desktop.webp",
      },
      gallery: [
        "/images/projects/jinjiang/gallery-01.webp",
        "/images/projects/jinjiang/gallery-02.webp",
      ],
      stills: [],
      bts: [],
    },
    filmUrl: "https://weixin.qq.com/sph/AfC7TuUk1p",
    platform: "weixin",
    assets: { permissionStatus: "cleared" },
    buttonLabel: "Watch Film ▸",
  },
  {
    id: "xiaomi-civi",
    index: "05",
    category: "commercial",
    brand: "小米 CIVI",
    title: "墨镜手机 产品影片",
    role: "摄影师",
    description:
      "小米 CIVI 墨镜手机 产品影片",
    images: {
      cover: {
        desktop: "/images/projects/xiaomi-civi/cover-desktop.webp",
        desktop2x: "/images/projects/xiaomi-civi/cover-desktop.webp",
        mobile: "/images/projects/xiaomi-civi/cover-desktop.webp",
      },
      gallery: [
        "/images/projects/xiaomi-civi/gallery-01.webp",
        "/images/projects/xiaomi-civi/gallery-02.webp",
        "/images/projects/xiaomi-civi/gallery-03.webp",
        "/images/projects/xiaomi-civi/gallery-04.webp",
      ],
      stills: [],
      bts: [],
    },
    filmUrl: "https://weixin.qq.com/sph/ACXtj0qZWP",
    platform: "weixin",
    assets: { permissionStatus: "cleared" },
    buttonLabel: "Watch Film ▸",
  },
  {
    id: "valorant",
    index: "06",
    category: "commercial",
    brand: "无畏契约",
    brandCn: "VALORANT",
    title: "无畏契约 · 电竞视觉",
    role: "摄影师",
    description:
      "无畏契约 VALORANT 电竞视觉",
    images: {
      cover: {
        desktop: "/images/projects/valorant/cover-desktop.webp",
        desktop2x: "/images/projects/valorant/cover-desktop.webp",
        mobile: "/images/projects/valorant/cover-desktop.webp",
      },
      gallery: [
        "/images/projects/valorant/gallery-01.webp",
        "/images/projects/valorant/gallery-02.webp",
      ],
      stills: [],
      bts: [],
    },
    assets: { permissionStatus: "cleared" },
    buttonLabel: "Watch Film ▸",
  },
  {
    id: "love-deepspace",
    index: "07",
    category: "commercial",
    brand: "恋与深空",
    brandCn: "Love and Deepspace",
    title: "游戏品牌影像",
    role: "摄影师",
    description:
      "恋与深空 游戏品牌影像",
    images: {
      cover: {
        desktop: "/images/projects/love-deepspace/cover-desktop.webp",
        desktop2x: "/images/projects/love-deepspace/cover-desktop.webp",
        mobile: "/images/projects/love-deepspace/cover-desktop.webp",
      },
      gallery: [
        "/images/projects/love-deepspace/gallery-01.webp",
        "/images/projects/love-deepspace/gallery-02.webp",
      ],
      stills: [],
      bts: [],
    },
    assets: { permissionStatus: "pending" },
    buttonLabel: "View Project ▸",
  },

  // ============ Narrative / Documentary (导演叙事) ============
  {
    id: "lol-charity",
    index: "08",
    category: "narrative",
    brand: "英雄联盟",
    brandCn: "英雄联盟",
    title: "13周年公益纪录片《天生冒险家》",
    role: "摄影师",
    description:
      "英雄联盟13周年公益纪录片 天生冒险家",
    images: {
      cover: {
        desktop: "/images/projects/lol-charity/cover-desktop.webp",
        desktop2x: "/images/projects/lol-charity/cover-desktop.webp",
        mobile: "/images/projects/lol-charity/cover-desktop.webp",
      },
      gallery: [
        "/images/projects/lol-charity/cover-desktop.webp",
        "/images/projects/lol-charity/gallery-01.webp",
      ],
      stills: [],
      bts: [],
    },
    filmUrl: "https://b23.tv/IOjAGTV",
    platform: "bilibili",
    assets: { permissionStatus: "cleared" },
    buttonLabel: "Watch Documentary ▸",
  },
  {
    id: "lol-player",
    index: "09",
    category: "narrative",
    brand: "英雄联盟",
    brandCn: "英雄联盟",
    title: "玩家短片《我，坚如磐石》",
    role: "摄影师",
    description:
      "英雄联盟玩家短片 我，坚如磐石",
    images: {
      cover: {
        desktop: "/images/projects/lol-player/cover-desktop.webp",
        desktop2x: "/images/projects/lol-player/cover-desktop.webp",
        mobile: "/images/projects/lol-player/cover-desktop.webp",
      },
      gallery: [
        "/images/projects/lol-player/cover-desktop.webp",
        "/images/projects/lol-player/gallery-01.webp",
      ],
      stills: [],
      bts: [],
    },
    filmUrl: "https://b23.tv/7pnf3UX",
    platform: "bilibili",
    assets: { permissionStatus: "cleared" },
    buttonLabel: "Watch Short Film ▸",
  },
  {
    id: "girl-egg-rocket",
    index: "10",
    category: "narrative",
    brand: "独立纪录片",
    title: "《女孩 鸡蛋 火箭》",
    role: "摄影 · 独立电影",
    description:
      "独立纪录片 女孩 鸡蛋 火箭",
    images: {
      cover: {
        desktop: "/images/projects/girl-egg-rocket/cover-desktop.webp",
        desktop2x: "/images/projects/girl-egg-rocket/cover-desktop.webp",
        mobile: "/images/projects/girl-egg-rocket/cover-desktop.webp",
      },
      gallery: [
        "/images/projects/girl-egg-rocket/gallery-01.webp",
        "/images/projects/girl-egg-rocket/gallery-02.webp",
      ],
      stills: [],
      bts: [],
    },
    assets: { permissionStatus: "pending" },
    buttonLabel: "View Project ▸",
  },
  {
    id: "helanyan",
    index: "11",
    category: "narrative",
    brand: "独立纪录片",
    title: "《贺兰砚》",
    role: "摄影 · 独立电影",
    description:
      "独立纪录片 贺兰砚",
    images: {
      cover: {
        desktop: "/images/projects/helanyan/cover-desktop.webp",
        desktop2x: "/images/projects/helanyan/cover-desktop.webp",
        mobile: "/images/projects/helanyan/cover-desktop.webp",
      },
      gallery: [
        "/images/projects/helanyan/gallery-01.webp",
        "/images/projects/helanyan/gallery-02.webp",
        "/images/projects/helanyan/gallery-03.webp",
      ],
      stills: [],
      bts: [],
    },
    assets: { permissionStatus: "pending" },
    buttonLabel: "View Project ▸",
  },
]

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
const assetPath = (path: string) => `${basePath}${path}`

const optimizedImagePath = (source: string) =>
  assetPath(source.replace(/^\/images\//, "/optimized-images/"))

export const projects: Project[] = rawProjects.map((project) => ({
  ...project,
  images: {
    cover: {
      desktop: optimizedImagePath(project.images.cover.desktop),
      desktop2x: optimizedImagePath(project.images.cover.desktop2x),
      mobile: optimizedImagePath(project.images.cover.mobile),
    },
    gallery: project.images.gallery.map(optimizedImagePath),
    stills: project.images.stills.map(optimizedImagePath),
    bts: project.images.bts.map(optimizedImagePath),
  },
  assets: {
    ...project.assets,
    heroImage: project.assets.heroImage
      ? optimizedImagePath(project.assets.heroImage)
      : undefined,
  },
}))

export const selectedWorks = projects.filter((p) => p.category === "commercial")
export const narrativeWorks = projects.filter((p) => p.category === "narrative")

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.id === slug)
}

export function getAdjacentProject(id: string): { prev: Project | null; next: Project | null } {
  const idx = projects.findIndex((p) => p.id === id)
  return {
    prev: idx > 0 ? projects[idx - 1] : null,
    next: idx < projects.length - 1 ? projects[idx + 1] : null,
  }
}
