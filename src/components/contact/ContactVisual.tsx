"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type ContactVisualProps = {
  mobile?: boolean;
};

export default function ContactVisual({
  mobile = false,
}: ContactVisualProps) {
  const t = useTranslations("ContactVisual");

  return (
    <div
      className={
        mobile
          ? "relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b] lg:hidden"
          : "relative hidden min-h-[760px] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#0b0b0b] lg:flex lg:items-center lg:justify-center"
      }
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className={
            mobile
              ? "absolute left-1/2 top-[42%] h-[300px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5dcc8]/14 blur-[85px]"
              : "absolute left-1/2 top-[46%] h-[420px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5dcc8]/14 blur-[110px]"
          }
        />

        <div
          className={
            mobile
              ? "absolute left-1/2 top-[48%] h-[220px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff8a3d]/14 blur-[80px]"
              : "absolute left-1/2 top-[50%] h-[320px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff8a3d]/14 blur-[100px]"
          }
        />

        <div
          className={
            mobile
              ? "absolute bottom-10 left-8 h-[220px] w-[120px] rounded-full bg-[#f4d2b8]/8 blur-[70px]"
              : "absolute bottom-16 left-16 h-[280px] w-[180px] rounded-full bg-[#f4d2b8]/8 blur-[90px]"
          }
        />

        <div
          className={
            mobile
              ? "absolute right-8 top-16 h-[90px] w-[90px] rounded-full bg-white/[0.04] blur-[55px]"
              : "absolute right-12 top-24 h-[140px] w-[140px] rounded-full bg-white/[0.04] blur-[70px]"
          }
        />

        <div
          className={
            mobile
              ? "absolute inset-x-[18%] top-[28%] h-[180px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_45%,transparent_75%)] blur-[45px]"
              : "absolute inset-x-[22%] top-[26%] h-[240px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_45%,transparent_75%)] blur-[55px]"
          }
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent_22%,transparent_78%,rgba(255,255,255,0.015))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.24)_100%)]" />
      </div>

      <div
        className={
          mobile
            ? "relative z-10 flex h-full w-full flex-col justify-between p-6"
            : "relative z-10 flex h-full w-full flex-col justify-between p-10 xl:p-14"
        }
      >
        <div className={mobile ? "max-w-xs" : "max-w-sm"}>
          <p className="text-[11px] uppercase tracking-[0.34em] text-neutral-400">
            {t("eyebrow")}
          </p>

          <h2
            className={
              mobile
                ? "mt-4 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white"
                : "mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white xl:text-4xl"
            }
          >
            {t("title.line1")}
            <span className="block bg-gradient-to-r from-white via-[#f5d6bf] to-[#ff8a3d] bg-clip-text text-transparent">
              {t("title.line2")}
            </span>
          </h2>
        </div>

        <div
          className={
            mobile
              ? "relative flex flex-1 items-center justify-center py-6"
              : "relative flex flex-1 items-center justify-center"
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [0, -1.2, 0.8, 0],
              }}
              transition={{
                duration: 7.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div
                className={
                  mobile
                    ? "absolute inset-x-6 bottom-2 h-10 rounded-full bg-[#ff6a00]/20 blur-3xl"
                    : "absolute inset-x-10 bottom-3 h-12 rounded-full bg-[#ff6a00]/20 blur-3xl"
                }
              />

              <div
                className={
                  mobile
                    ? "absolute left-1/2 top-1/2 z-[1] h-[270px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,214,191,0.16)_0%,rgba(255,138,61,0.09)_42%,rgba(255,255,255,0.03)_65%,transparent_100%)] blur-[14px]"
                    : "absolute left-1/2 top-1/2 z-[1] h-[460px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,214,191,0.16)_0%,rgba(255,138,61,0.09)_42%,rgba(255,255,255,0.03)_65%,transparent_100%)] blur-[18px]"
                }
              />

              <div
                className={
                  mobile
                    ? "absolute left-1/2 top-1/2 z-[2] h-[245px] w-[185px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/6 bg-white/[0.015] blur-[2px]"
                    : "absolute left-1/2 top-1/2 z-[2] h-[425px] w-[295px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/6 bg-white/[0.015] blur-[2px]"
                }
              />

              <div
                className={
                  mobile
                    ? "absolute left-1/2 top-[46%] z-[3] h-[180px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-[55px]"
                    : "absolute left-1/2 top-[45%] z-[3] h-[250px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-[70px]"
                }
              />

              <Image
                src="/contact-sculpture.png"
                alt={t("imageAlt")}
                width={680}
                height={880}
                priority
                className={
                  mobile
                    ? "relative z-10 h-auto w-[220px] object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.72)]"
                    : "relative z-10 h-auto w-[400px] object-contain drop-shadow-[0_36px_90px_rgba(0,0,0,0.72)] xl:w-[520px]"
                }
              />
            </motion.div>
          </motion.div>
        </div>

        <div
          className={
            mobile
              ? "grid gap-4 border-t border-white/10 pt-5 text-sm text-neutral-300"
              : "flex items-center justify-between gap-6 border-t border-white/10 pt-6"
          }
        >
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">
              {t("footer.directionLabel")}
            </p>
            <p className="mt-2 text-sm text-neutral-300">
              {t("footer.directionValue")}
            </p>
          </div>

          {!mobile ? <div className="h-10 w-px bg-white/10" /> : null}

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">
              {t("footer.universeLabel")}
            </p>
            <p className="mt-2 text-sm text-neutral-300">
              {t("footer.universeValue")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}