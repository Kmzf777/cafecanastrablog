"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import {
  ShoppingBag,
  Package,
  Tag,
  Globe,
  BookOpen,
  Landmark,
  Instagram,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

type PrimaryLink = {
  icon: LucideIcon
  label: string
  href: string
}

const PRIMARY_LINKS: PrimaryLink[] = [
  { icon: ShoppingBag, label: "Loja Online", href: "https://loja.cafecanastra.com" },
  {
    icon: Package,
    label: "Comprar no Atacado",
    href: "https://atacado.cafecanastra.com/cafeatacado",
  },
  {
    icon: Tag,
    label: "Monte sua Própria Marca",
    href: "https://atacado.cafecanastra.com/terceirizacaocafe",
  },
]

/* -------------------------------------------------------------------------- */
/*  Background layer — gradient, grain, drifting accents                       */
/* -------------------------------------------------------------------------- */

function BeanShape({ className }: { className?: string }) {
  // A simple coffee-bean glyph: an ellipse with a curved crease.
  return (
    <svg
      viewBox="0 0 100 140"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse
        cx="50"
        cy="70"
        rx="42"
        ry="64"
        transform="rotate(-18 50 70)"
        fill="currentColor"
      />
      <path
        d="M38 16 C 58 50, 58 90, 28 124"
        stroke="rgba(67,48,43,0.55)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function LeafShape({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M14 106 C 18 50, 60 16, 108 14 C 110 62, 72 102, 16 108 Z"
        fill="currentColor"
      />
      <path
        d="M22 100 C 52 72, 78 46, 102 22"
        stroke="rgba(74,57,46,0.45)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function BioBackground({ reduce }: { reduce: boolean }) {
  const drift = (id: number) =>
    reduce
      ? {}
      : {
          y: [0, -22, 0],
          x: [0, id % 2 === 0 ? 14 : -14, 0],
          rotate: [0, id % 2 === 0 ? 8 : -8, 0],
        }

  const ease = "easeInOut" as const

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* warm cream -> soft coffee vertical gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-coffee-50 via-coffee-100 to-earth-200" />

      {/* radial warmth pooling at the top behind the logo */}
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(60%_55%_at_50%_0%,rgba(251,191,36,0.20),transparent_70%)]" />

      {/* drifting bean / leaf accents */}
      <motion.div
        className="absolute left-[-3rem] top-[12%] h-40 w-28 text-coffee-700/15"
        animate={drift(0)}
        transition={{ duration: 16, repeat: Infinity, ease }}
      >
        <BeanShape className="h-full w-full" />
      </motion.div>

      <motion.div
        className="absolute right-[-2.5rem] top-[34%] h-36 w-36 text-earth-500/12"
        animate={drift(1)}
        transition={{ duration: 20, repeat: Infinity, ease, delay: 1.5 }}
      >
        <LeafShape className="h-full w-full" />
      </motion.div>

      <motion.div
        className="absolute bottom-[8%] left-[8%] h-32 w-24 text-coffee-800/12"
        animate={drift(2)}
        transition={{ duration: 18, repeat: Infinity, ease, delay: 0.8 }}
      >
        <BeanShape className="h-full w-full" />
      </motion.div>

      {/* fine paper grain / noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.5] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
        }}
      />

      {/* soft vignette to ground the composition */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_55%,rgba(74,57,46,0.18))]" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Motion variants                                                            */
/* -------------------------------------------------------------------------- */

function buildVariants(reduce: boolean) {
  const container: Variants = {
    hidden: {},
    show: {
      transition: reduce
        ? {}
        : { staggerChildren: 0.09, delayChildren: 0.08 },
    },
  }

  const item: Variants = reduce
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 22 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      }

  return { container, item }
}

/* -------------------------------------------------------------------------- */
/*  Header                                                                      */
/* -------------------------------------------------------------------------- */

function BioHeader({
  item,
  reduce,
}: {
  item: Variants
  reduce: boolean
}) {
  return (
    <motion.header variants={item} className="flex flex-col items-center text-center">
      <motion.div
        className="relative"
        animate={
          reduce
            ? undefined
            : { y: [0, -8, 0], rotate: [0, 1.5, 0, -1.5, 0] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* soft gold glow behind the logo ring */}
        <div className="absolute inset-0 -z-10 rounded-full bg-gold-400/30 blur-2xl" />
        <div className="rounded-full bg-gradient-to-br from-gold-200 to-gold-500 p-[3px] shadow-[0_10px_30px_-8px_rgba(180,83,9,0.55)]">
          <div className="rounded-full bg-coffee-50 p-1.5">
            <Image
              src="/logo-canastra.png"
              alt="Logotipo Café Canastra"
              width={96}
              height={96}
              priority
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
        </div>
      </motion.div>

      <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight text-coffee-900">
        Café Canastra
      </h1>
      <p className="mt-2 max-w-xs text-balance text-sm leading-relaxed text-earth-700">
        Cafés especiais da Serra da Canastra
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-wider text-coffee-700/80">
        <span>Fazenda própria</span>
        <span aria-hidden="true" className="text-gold-600">
          ·
        </span>
        <span>Micro-torrefação</span>
        <span aria-hidden="true" className="text-gold-600">
          ·
        </span>
        <span>Minas Gerais</span>
      </div>
    </motion.header>
  )
}

/* -------------------------------------------------------------------------- */
/*  Primary link button                                                         */
/* -------------------------------------------------------------------------- */

function BioLinkButton({
  icon: Icon,
  label,
  href,
}: PrimaryLink) {
  return (
    <Button
      asChild
      className={cn(
        "group relative h-14 w-full justify-start gap-4 overflow-hidden rounded-2xl px-5",
        "bg-gradient-to-br from-coffee-800 to-coffee-900 text-coffee-50",
        "border border-coffee-900/40 shadow-[0_8px_22px_-10px_rgba(67,48,43,0.7)]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_16px_34px_-10px_rgba(180,83,9,0.55)]",
        "hover:from-coffee-700 hover:to-coffee-900",
        "focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-coffee-100"
      )}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {/* gold sheen sweep on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-300/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold-400/15 text-gold-300 ring-1 ring-gold-300/25">
          <Icon className="!h-[18px] !w-[18px]" aria-hidden="true" />
        </span>
        <span className="flex-1 text-left font-serif text-base font-semibold tracking-tight">
          {label}
        </span>
        <ChevronRight
          className="!h-5 !w-5 shrink-0 text-gold-300 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </a>
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Divider                                                                     */
/* -------------------------------------------------------------------------- */

function BioDivider({ item }: { item: Variants }) {
  return (
    <motion.div variants={item} className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-coffee-400/50" />
      <span className="font-serif text-xs uppercase tracking-[0.25em] text-coffee-600">
        conheça mais
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-coffee-400/50" />
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Secondary links                                                             */
/* -------------------------------------------------------------------------- */

type SecondaryItem = {
  icon: LucideIcon
  label: string
  href: string
  external: boolean
}

const SECONDARY_LINKS: SecondaryItem[] = [
  { icon: Globe, label: "Site", href: "https://cafecanastra.com", external: true },
  { icon: BookOpen, label: "Blog", href: "/blog", external: false },
  { icon: Landmark, label: "História", href: "/historia", external: false },
]

function BioSecondaryLinks({ item }: { item: Variants }) {
  const baseClass = cn(
    "group flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-3",
    "border border-coffee-300/60 bg-coffee-50/60 backdrop-blur-sm",
    "text-coffee-800 shadow-sm transition-all duration-200",
    "hover:-translate-y-0.5 hover:border-gold-400 hover:bg-coffee-50 hover:text-coffee-900",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-coffee-100"
  )

  return (
    <motion.nav
      variants={item}
      aria-label="Links secundários"
      className="grid grid-cols-3 gap-3"
    >
      {SECONDARY_LINKS.map(({ icon: Icon, label, href, external }) =>
        external ? (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClass}
          >
            <Icon
              className="h-5 w-5 text-coffee-600 transition-colors group-hover:text-gold-600"
              aria-hidden="true"
            />
            <span className="text-xs font-medium tracking-wide">{label}</span>
          </a>
        ) : (
          <Link key={label} href={href} className={baseClass}>
            <Icon
              className="h-5 w-5 text-coffee-600 transition-colors group-hover:text-gold-600"
              aria-hidden="true"
            />
            <span className="text-xs font-medium tracking-wide">{label}</span>
          </Link>
        )
      )}
    </motion.nav>
  )
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                      */
/* -------------------------------------------------------------------------- */

function BioFooter({ item, year }: { item: Variants; year: number }) {
  return (
    <motion.footer
      variants={item}
      className="flex flex-col items-center gap-2 pt-2 text-center"
    >
      <a
        href="https://www.instagram.com/cafecanastra"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram @cafecanastra (abre em nova aba)"
        className="group inline-flex items-center gap-2 rounded-full border border-coffee-300/60 bg-coffee-50/70 px-4 py-1.5 text-sm font-medium text-coffee-800 backdrop-blur-sm transition-colors hover:border-gold-400 hover:text-coffee-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-coffee-100"
      >
        <Instagram
          className="h-4 w-4 text-gold-600 transition-transform group-hover:scale-110"
          aria-hidden="true"
        />
        @cafecanastra
      </a>
      <p className="text-xs text-coffee-600">
        © Café Canastra {year}
      </p>
    </motion.footer>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page shell                                                                  */
/* -------------------------------------------------------------------------- */

export default function BioClient({ year }: { year: number }) {
  const prefersReduced = useReducedMotion()
  const reduce = !!prefersReduced
  const { container, item } = buildVariants(reduce)

  return (
    <main className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-10 text-coffee-900 antialiased sm:py-14">
      <BioBackground reduce={reduce} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-md flex-col gap-7"
      >
        <BioHeader item={item} reduce={reduce} />

        <motion.div variants={item} className="flex flex-col gap-3.5">
          {PRIMARY_LINKS.map((link) => (
            <BioLinkButton key={link.href} {...link} />
          ))}
        </motion.div>

        <BioDivider item={item} />

        <BioSecondaryLinks item={item} />

        <BioFooter item={item} year={year} />
      </motion.div>
    </main>
  )
}
