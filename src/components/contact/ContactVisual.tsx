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
              ? "absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(245,220,200,0.12),transparent_20%),radial-gradient(circle_at_50%_52%,rgba(255,138,61,0.10),transparent_18%),radial-gradient(circle_at_18%_82%,rgba(244,210,184,0.06),transparent_20%),radial-gradient(circle_at_84%_16%,rgba(255,255,255,0.04),transparent_12%)]"
              : "absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(245,220,200,0.12),transparent_22%),radial-gradient(circle_at_50%_54%,rgba(255,138,61,0.10),transparent_18%),radial-gradient(circle_at_16%_82%,rgba(244,210,184,0.06),transparent_22%),radial-gradient(circle_at_86%_18%,rgba(255,255,255,0.04),transparent_12%)]"
          }
        />

        <div
          className={
            mobile
              ? "absolute inset-x-[14%] top-[24%] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.018)_45%,transparent_74%)] blur-[48px]"
              : "absolute inset-x-[18%] top-[22%] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.018)_45%,transparent_74%)] blur-[56px]"
          }
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent_22%,transparent_78%,rgba(255,255,255,0.015))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_34%,rgba(0,0,0,0.28)_100%)]" />
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
            initial={{ opacity: 0, y: 24, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center"
          >
            <div
              className={
                mobile
                  ? "relative flex items-center justify-center [mask-image:radial-gradient(circle_at_center,white_44%,white_58%,rgba(255,255,255,0.82)_70%,transparent_100%)]"
                  : "relative flex items-center justify-center [mask-image:radial-gradient(circle_at_center,white_46%,white_60%,rgba(255,255,255,0.82)_72%,transparent_100%)]"
              }
            >
              <motion.div
                animate={{
                  x: [0, 4, -3, 0],
                  y: [0, -10, 0],
                  opacity: [0.72, 0.9, 0.76, 0.72],
                  scale: [1, 1.03, 0.99, 1],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={
                  mobile
                    ? "absolute left-1/2 top-1/2 z-[1] h-[250px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,214,191,0.14)_0%,rgba(255,138,61,0.08)_40%,rgba(255,255,255,0.025)_64%,transparent_100%)] blur-[22px]"
                    : "absolute left-1/2 top-1/2 z-[1] h-[420px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,214,191,0.14)_0%,rgba(255,138,61,0.08)_40%,rgba(255,255,255,0.025)_64%,transparent_100%)] blur-[28px]"
                }
              />

              <motion.div
                animate={{
                  x: [0, -2, 2, 0],
                  y: [0, -6, 0],
                  opacity: [0.24, 0.34, 0.26, 0.24],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={
                  mobile
                    ? "absolute left-1/2 top-[45%] z-[2] h-[170px] w-[110px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-[62px]"
                    : "absolute left-1/2 top-[44%] z-[2] h-[240px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-[78px]"
                }
              />

              <div
                className={
                  mobile
                    ? "absolute inset-x-8 bottom-4 z-[1] h-10 rounded-full bg-[#ff6a00]/16 blur-3xl"
                    : "absolute inset-x-12 bottom-5 z-[1] h-14 rounded-full bg-[#ff6a00]/16 blur-3xl"
                }
              />

              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, -1, 0.8, 0],
                }}
                transition={{
                  duration: 7.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 will-change-transform"
                style={{ transformOrigin: "50% 55%" }}
              >
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
            </div>
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