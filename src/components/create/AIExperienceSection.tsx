"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CreditCard,
  Lamp,
  Loader2,
  Palette,
  RefreshCcw,
  Ruler,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useTranslations } from "next-intl";

import PromptPrefill from "@/components/create/PromptPrefill";
import {
  PANEL_COLOR,
  PANEL_DIRECTION,
  PANEL_FRAME_COLOR,
  PANEL_FRAME_MATERIAL,
  PANEL_LIGHT_DIFFUSION,
  PANEL_LIGHT_TYPE,
  PANEL_OBJECT_SIZE,
  PANEL_TEXTURE,
  PANEL_TYPE,
  type GeneratorPrefill,
} from "@/data/quiz/generator-params";
import { useRouter } from "@/i18n/navigation";
import {
  buildGenerationPrompt,
  type ColorId as ColorOption,
  type CreationType,
  type FrameColorId as FrameColor,
  type FrameMaterialId as FrameMaterial,
  type LightDiffusionId as LightDiffusion,
  type LightIntensityId as LightingIntensity,
  type LightTemperatureId as LightingTemperature,
  type LightTypeId as LightType,
  type ObjectFinishId as ObjectFinish,
  type ObjectSizeId,
  type ObjectUsageId as ObjectUsage,
  type StyleId as StylePresetId,
  type TextureId as Texture,
  type WallSizeId,
} from "@/lib/generator-prompt";
import { supabase } from "@/lib/supabase/client";
import { FREE_GENERATION_LIMIT } from "@/lib/generation-limits";
import AuthModal from "@/components/auth/AuthModal";
import ReferenceImageUpload from "./ReferenceImageUpload";

type GenerateImageResponse = {
  image?: string;
  imageId?: string;
  error?: string;
  referenceError?: "too_large" | "bad_type" | "corrupt";
  requiresPayment?: boolean;
  requiresSignup?: boolean;
  paidCreditsRemaining?: number;
  freeGenerationsRemaining?: number;
  imagesGenerated?: number;
  unlimited?: boolean;
};

type CheckoutSessionResponse = {
  url?: string;
  error?: string;
};

type UserCreditsResponse = {
  paidCredits?: number;
  freeRemaining?: number;
  freeLimit?: number;
  imagesGenerated?: number;
  paymentStatus?: string;
  unlimited?: boolean;
};

type WallSizeOption = {
  id: WallSizeId;
  label: string;
};

type ObjectSizeOption = {
  id: ObjectSizeId;
  label: string;
};

type StylePreset = {
  id: StylePresetId;
  label: string;
};

type SelectOption<T extends string> = {
  id: T;
  label: string;
};

const COLOR_SWATCH_BACKGROUNDS: Record<ColorOption, string> = {
  black: "#111111",
  white: "#ffffff",
  beige: "#e3d3b8",
  gold: "linear-gradient(135deg, #d4af37, #f4e5b2)",
  blue: "#2563eb",
  green: "#16a34a",
  yellow: "#f2c94c",
  red: "#dc2626",
  orange: "#e76f16",
  brown: "#7c4a2d",
  gray: "#808080",
  turquoise: "#40e0d0",
  pink: "#f4a6c6",
  multicolor:
    "conic-gradient(from 0deg, #ff5757, #ffb257, #fff157, #57ff8f, #57e3ff, #5779ff, #c957ff, #ff57b2, #ff5757)",
  gradient: "linear-gradient(135deg, #ff9f43, #e76f16, #c85100)",
};

function ColorSwatch({ colorId }: { colorId: ColorOption }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "inline-block h-3.5 w-3.5 shrink-0 rounded-full",
        colorId === "white" ? "border border-gray-300" : "",
      ].join(" ")}
      style={{ background: COLOR_SWATCH_BACKGROUNDS[colorId] }}
    />
  );
}

export default function AIExperienceSection() {
  const t = useTranslations("AIExperience");
  const router = useRouter();

  const stylePresets: readonly StylePreset[] = useMemo(() => [
    { id: "organic", label: t("styles.organic.label") },
    { id: "minimal", label: t("styles.minimal.label") },
    { id: "oceanic", label: t("styles.oceanic.label") },
    { id: "luminous", label: t("styles.luminous.label") },
    { id: "origami", label: t("styles.origami.label") },
    { id: "abstract", label: t("styles.abstract.label") },
    { id: "geometric", label: t("styles.geometric.label") },
    { id: "botanical", label: t("styles.botanical.label") },
    { id: "figurative", label: t("styles.figurative.label") },
  ] as const, [t]);

  const wallSizeOptions: readonly WallSizeOption[] = useMemo(() => [
    { id: "30x40", label: t("sizes.wall.small") },
    { id: "50x70", label: t("sizes.wall.medium") },
    { id: "70x100", label: t("sizes.wall.large") },
  ] as const, [t]);

  const objectSizeOptions: readonly SelectOption<ObjectSizeOption["id"]>[] = useMemo(() => [
    { id: "small", label: t("sizes.object.small") },
    { id: "medium", label: t("sizes.object.medium") },
    { id: "large", label: t("sizes.object.large") },
  ] as const, [t]);

  const frameColors: readonly SelectOption<FrameColor>[] = useMemo(() => [
    { id: "black", label: t("frameColors.black") },
    { id: "white", label: t("frameColors.white") },
    { id: "gold", label: t("frameColors.gold") },
  ] as const, [t]);

  const frameMaterials: readonly SelectOption<FrameMaterial>[] = useMemo(() => [
    { id: "metal", label: t("frameMaterials.metal") },
    { id: "wood", label: t("frameMaterials.wood") },
  ] as const, [t]);

  const objectUsages: readonly SelectOption<ObjectUsage>[] = useMemo(() => [
    { id: "table", label: t("objectUsage.table") },
    { id: "shelf", label: t("objectUsage.shelf") },
    { id: "floor", label: t("objectUsage.floor") },
  ] as const, [t]);

  const objectFinishes: readonly SelectOption<ObjectFinish>[] = useMemo(() => [
    { id: "matte", label: t("objectFinish.matte") },
    { id: "glossy", label: t("objectFinish.glossy") },
    { id: "metallic", label: t("objectFinish.metallic") },
  ] as const, [t]);

  const lightTypes: readonly SelectOption<LightType>[] = useMemo(() => [
    { id: "tableLamp", label: t("lightTypes.tableLamp") },
    { id: "floorLamp", label: t("lightTypes.floorLamp") },
    { id: "wallLight", label: t("lightTypes.wallLight") },
    { id: "ceilingLight", label: t("lightTypes.ceilingLight") },
    { id: "lightSculpture", label: t("lightTypes.lightSculpture") },
  ] as const, [t]);

  const lightTemperatures: readonly SelectOption<LightingTemperature>[] = useMemo(() => [
    { id: "warm", label: t("lightTemperature.warm") },
    { id: "neutral", label: t("lightTemperature.neutral") },
    { id: "cool", label: t("lightTemperature.cool") },
  ] as const, [t]);

  const lightIntensities: readonly SelectOption<LightingIntensity>[] = useMemo(() => [
    { id: "subtle", label: t("lightIntensity.subtle") },
    { id: "medium", label: t("lightIntensity.medium") },
    { id: "strong", label: t("lightIntensity.strong") },
  ] as const, [t]);

  const lightDiffusions: readonly SelectOption<LightDiffusion>[] = useMemo(() => [
    { id: "inner", label: t("lightDiffusion.inner") },
    { id: "indirect", label: t("lightDiffusion.indirect") },
    { id: "cutouts", label: t("lightDiffusion.cutouts") },
  ] as const, [t]);

  const textures: readonly SelectOption<Texture>[] = useMemo(() => [
    { id: "stone", label: t("texture.stone") },
    { id: "smooth", label: t("texture.smooth") },
    { id: "relief", label: t("texture.relief") },
  ] as const, [t]);

  const colorOptions: readonly SelectOption<ColorOption>[] = useMemo(() => [
    { id: "black", label: t("colors.black") },
    { id: "white", label: t("colors.white") },
    { id: "beige", label: t("colors.beige") },
    { id: "gold", label: t("colors.gold") },
    { id: "blue", label: t("colors.blue") },
    { id: "green", label: t("colors.green") },
    { id: "yellow", label: t("colors.yellow") },
    { id: "red", label: t("colors.red") },
    { id: "orange", label: t("colors.orange") },
    { id: "brown", label: t("colors.brown") },
    { id: "gray", label: t("colors.gray") },
    { id: "turquoise", label: t("colors.turquoise") },
    { id: "pink", label: t("colors.pink") },
    { id: "multicolor", label: t("colors.multicolor") },
    { id: "gradient", label: t("colors.gradient") },
  ] as const, [t]);

  const [prompt, setPrompt] = useState("");
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [creationType, setCreationType] = useState<CreationType>("wall");
  const [selectedStyle, setSelectedStyle] = useState<StylePresetId | null>(null);

  const [selectedWallSize, setSelectedWallSize] =
    useState<WallSizeOption["id"]>("50x70");
  const [selectedObjectSize, setSelectedObjectSize] =
    useState<ObjectSizeOption["id"]>("medium");

  const [withFrame, setWithFrame] = useState(false);
  const [frameColor, setFrameColor] = useState<FrameColor>("black");
  const [frameMaterial, setFrameMaterial] = useState<FrameMaterial>("metal");

  const [selectedObjectUsage, setSelectedObjectUsage] =
    useState<ObjectUsage>("table");
  const [selectedObjectFinish, setSelectedObjectFinish] =
    useState<ObjectFinish>("matte");

  const [selectedLightType, setSelectedLightType] =
    useState<LightType>("tableLamp");
  const [selectedLightTemperature, setSelectedLightTemperature] =
    useState<LightingTemperature>("warm");
  const [selectedLightIntensity, setSelectedLightIntensity] =
    useState<LightingIntensity>("medium");
  // Optional: null (nothing selected) adds nothing to the prompt.
  const [selectedLightDiffusion, setSelectedLightDiffusion] =
    useState<LightDiffusion | null>(null);
  const [selectedTexture, setSelectedTexture] = useState<Texture | null>(null);

  const [selectedColors, setSelectedColors] = useState<ColorOption[]>([]);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedImageId, setGeneratedImageId] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userCredits, setUserCredits] = useState(0);
  const [freeRemaining, setFreeRemaining] = useState(FREE_GENERATION_LIMIT);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRedirectingToCheckout, setIsRedirectingToCheckout] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState("");

  const resultRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Prompt coming from a link (?prompt=, e.g. the quiz): fill the field and
  // bring the generator into view, without generating anything.
  const handlePrefill = useCallback((prefill: GeneratorPrefill) => {
    if (prefill.prompt) setPrompt(prefill.prompt);
    if (prefill.type) setCreationType(PANEL_TYPE[prefill.type]);
    if (prefill.direction) {
      setSelectedStyle(PANEL_DIRECTION[prefill.direction]);
    }

    if (prefill.colors) {
      const colors = prefill.colors.map((color) => PANEL_COLOR[color]);
      const baseCount = colors.filter((color) => color !== "gradient").length;
      // Same rule as toggleColor: gradient needs at least two other colors.
      setSelectedColors(
        baseCount >= 2 ? colors : colors.filter((color) => color !== "gradient"),
      );
    }

    // Wall pieces use the 30x40… formats; objects have three generic ones and
    // light sculptures have no size, so those are simply never read for them.
    if (prefill.size) {
      setSelectedWallSize(prefill.size);
      setSelectedObjectSize(PANEL_OBJECT_SIZE[prefill.size]);
    }

    // The frame only exists for wall pieces.
    if (prefill.frame !== undefined && (!prefill.type || prefill.type === "mural")) {
      setWithFrame(prefill.frame);
      if (prefill.frame && prefill.frameColor) {
        setFrameColor(PANEL_FRAME_COLOR[prefill.frameColor]);
      }
      if (prefill.frame && prefill.frameMaterial) {
        setFrameMaterial(PANEL_FRAME_MATERIAL[prefill.frameMaterial]);
      }
    }

    // Light placement and diffusion only exist for light sculptures.
    if (!prefill.type || prefill.type === "luminosa") {
      if (prefill.lightType) {
        setSelectedLightType(PANEL_LIGHT_TYPE[prefill.lightType]);
      }
      if (prefill.lightDiffusion) {
        setSelectedLightDiffusion(PANEL_LIGHT_DIFFUSION[prefill.lightDiffusion]);
      }
    }

    if (prefill.texture) setSelectedTexture(PANEL_TEXTURE[prefill.texture]);

    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const pendingAuthActionRef = useRef<(() => void) | null>(null);

  const refreshAuthState = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUser(user);

    if (!user) {
      setUserCredits(0);
      setFreeRemaining(FREE_GENERATION_LIMIT);
      setIsAdmin(false);
      return;
    }

    const response = await fetch("/api/user/credits");
    if (response.ok) {
      const data: UserCreditsResponse = await response.json();
      setIsAdmin(Boolean(data.unlimited));
      setUserCredits(data.paidCredits ?? 0);
      setFreeRemaining(data.unlimited ? FREE_GENERATION_LIMIT : data.freeRemaining ?? 0);
    }
  }, []);

  useEffect(() => {
    async function syncAuthState() {
      await refreshAuthState();
    }

    syncAuthState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      syncAuthState();
    });

    return () => subscription.unsubscribe();
  }, [refreshAuthState]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") !== "success") return;

    window.history.replaceState(null, "", window.location.pathname);

    const timeout = window.setTimeout(async () => {
      await refreshAuthState();
      setPaymentSuccessMessage(t("payment.successMessage"));
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [t, refreshAuthState]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isLoading) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLoading]);

  // Visible generation counter: signup pitch → free allowance → paid credits.
  const creditsLabel = !currentUser
    ? t("credits.signupPitch")
    : isAdmin
      ? `∞ ${t("credits.unlimited")}`
      : freeRemaining > 0
        ? t("credits.freeRemaining", { count: freeRemaining })
        : userCredits > 0
          ? t("credits.remaining", { count: userCredits })
          : t("credits.freeExhausted");

  // Signed-out visitors are not blocked — they get the signup modal on their
  // first generation, then the 2 free ones. The paywall only shows once an
  // account has burned its free allowance and holds no paid credits.
  const isBlocked =
    Boolean(currentUser) && !isAdmin && freeRemaining <= 0 && userCredits <= 0;

  const previewAspectClass = useMemo(() => {
    if (creationType === "wall") {
      switch (selectedWallSize) {
        case "30x40":
          return "aspect-[3/4]";
        case "50x70":
          return "aspect-[5/7]";
        case "70x100":
          return "aspect-[7/10]";
        default:
          return "aspect-[5/7]";
      }
    }

    if (creationType === "light" && selectedLightType === "ceilingLight") {
      return "aspect-[4/5]";
    }

    return "aspect-square";
  }, [creationType, selectedWallSize, selectedLightType]);

  const nonGradientSelectedColors = useMemo(
    () => selectedColors.filter((color) => color !== "gradient"),
    [selectedColors],
  );

  const canShowGradientOption = nonGradientSelectedColors.length >= 2;

  const visibleColorOptions = useMemo(() => {
    return colorOptions.filter(
      (option) => option.id !== "gradient" || canShowGradientOption,
    );
  }, [colorOptions, canShowGradientOption]);

  const selectedColorLabels = useMemo(() => {
    return colorOptions
      .filter((color) => selectedColors.includes(color.id))
      .map((color) => color.label);
  }, [colorOptions, selectedColors]);

  const fullPrompt = useMemo(
    () =>
      buildGenerationPrompt(
        {
          prompt,
          styleId: selectedStyle,
          colors: selectedColors,
          creationType,
          wallSize: selectedWallSize,
          withFrame,
          frameColor,
          frameMaterial,
          objectSize: selectedObjectSize,
          objectUsage: selectedObjectUsage,
          objectFinish: selectedObjectFinish,
          lightType: selectedLightType,
          lightTemperature: selectedLightTemperature,
          lightIntensity: selectedLightIntensity,
          lightDiffusion: selectedLightDiffusion,
          texture: selectedTexture,
        },
        {
          enrichedSuffix: t("promptEnrichedSuffix"),
          stylePrompt: (styleId) => t(`styles.${styleId}.prompt`),
        },
      ),
    [
      creationType,
      frameColor,
      frameMaterial,
      prompt,
      selectedColors,
      selectedLightDiffusion,
      selectedLightIntensity,
      selectedLightTemperature,
      selectedLightType,
      selectedObjectFinish,
      selectedObjectSize,
      selectedObjectUsage,
      selectedStyle,
      selectedTexture,
      selectedWallSize,
      t,
      withFrame,
    ],
  );

  function toggleColor(colorId: ColorOption) {
    setSelectedColors((current) => {
      const next = current.includes(colorId)
        ? current.filter((item) => item !== colorId)
        : [...current, colorId];

      const nonGradientCount = next.filter((item) => item !== "gradient").length;

      return nonGradientCount >= 2
        ? next
        : next.filter((item) => item !== "gradient");
    });
  }

  function scrollToResult(offset = 100) {
    if (!resultRef.current || typeof window === "undefined") return;

    const top =
      resultRef.current.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }

  async function handleGenerate() {
    if (!fullPrompt) {
      setError(t("errors.emptyPrompt"));
      return;
    }

    // No session yet: ask for an account first, then resume this generation.
    // runGeneration (not handleGenerate) is queued so the retry isn't blocked
    // by this render's stale `currentUser`.
    if (!currentUser) {
      pendingAuthActionRef.current = runGeneration;
      setShowAuthModal(true);
      return;
    }

    // Free allowance spent and no paid credits: the payment panel is already
    // on screen, so don't fire a request the server would reject with 402.
    if (isBlocked) {
      setError("");
      return;
    }

    await runGeneration();
  }

  async function runGeneration() {
    if (!fullPrompt) {
      setError(t("errors.emptyPrompt"));
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setGeneratedImage(null);

      requestAnimationFrame(() => {
        scrollToResult(90);
      });

      const frameFlag = creationType === "wall" ? withFrame : false;
      let requestInit: RequestInit;

      if (referenceFile) {
        // Multipart: the browser sets the Content-Type boundary itself.
        const formData = new FormData();
        formData.set("prompt", fullPrompt);
        formData.set("creationType", creationType);
        formData.set("withFrame", String(frameFlag));
        formData.set("reference", referenceFile);
        requestInit = { method: "POST", body: formData };
      } else {
        requestInit = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: fullPrompt,
            creationType,
            withFrame: frameFlag,
          }),
        };
      }

      const response = await fetch("/api/generate-image", requestInit);

      const data: GenerateImageResponse = await response.json();

      if (data.referenceError) {
        const referenceErrors = {
          too_large: "tooLarge",
          bad_type: "badType",
          corrupt: "unreadable",
        } as const;
        throw new Error(t(`reference.errors.${referenceErrors[data.referenceError]}`));
      }

      if (data.requiresSignup) {
        pendingAuthActionRef.current = runGeneration;
        setShowAuthModal(true);
        throw new Error(data.error || t("errors.generationFailed"));
      }

      if (data.requiresPayment) {
        // Server-side quota is the source of truth — sync so the payment
        // panel replaces the generate button.
        setFreeRemaining(0);
        setUserCredits(data.paidCreditsRemaining ?? 0);
        throw new Error(data.error || t("errors.generationFailed"));
      }

      if (!response.ok) {
        throw new Error(data.error || t("errors.generationFailed"));
      }

      if (!data.image) {
        throw new Error(t("errors.noImageReturned"));
      }

      setGeneratedImage(data.image);
      setGeneratedImageId(data.imageId ?? null);
      setLastPrompt(fullPrompt);

      if (data.unlimited) {
        setIsAdmin(true);
      } else {
        if (data.paidCreditsRemaining !== undefined) {
          setUserCredits(data.paidCreditsRemaining);
        }
        if (data.freeGenerationsRemaining !== undefined) {
          setFreeRemaining(data.freeGenerationsRemaining);
        }
      }

      setTimeout(() => {
        scrollToResult(90);
      }, 250);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("errors.unknown");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePayForCredits() {
    if (typeof window === "undefined") return;

    try {
      setIsRedirectingToCheckout(true);
      setError("");

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnPath: window.location.pathname }),
      });

      const data: CheckoutSessionResponse = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || t("errors.checkoutFailed"));
      }

      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : t("errors.unknown");
      setError(message);
      setIsRedirectingToCheckout(false);
    }
  }

  function handleReset() {
    setPrompt("");
    setReferenceFile(null);
    setCreationType("wall");
    setSelectedStyle(null);
    setSelectedWallSize("50x70");
    setSelectedObjectSize("medium");
    setWithFrame(false);
    setFrameColor("black");
    setFrameMaterial("metal");
    setSelectedObjectUsage("table");
    setSelectedObjectFinish("matte");
    setSelectedLightType("tableLamp");
    setSelectedLightTemperature("warm");
    setSelectedLightIntensity("medium");
    setSelectedLightDiffusion(null);
    setSelectedTexture(null);
    setSelectedColors([]);
    setGeneratedImage(null);
    setGeneratedImageId(null);
    setLastPrompt("");
    setError("");

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("generatedImage");
    }
  }

  function navigateToCommande() {
    if (generatedImage && typeof window !== "undefined") {
      sessionStorage.setItem("generatedImage", generatedImage);
    }

    router.push({
      pathname: "/commande",
      query: {
        ...(lastPrompt ? { prompt: lastPrompt } : {}),
        ...(generatedImageId ? { sourceAiImageId: generatedImageId } : {}),
      },
    });
  }

  function handleOrderIntent() {
    if (!currentUser) {
      pendingAuthActionRef.current = navigateToCommande;
      setShowAuthModal(true);
      return;
    }

    navigateToCommande();
  }

  function handleBuyCreditsIntent() {
    if (!currentUser) {
      pendingAuthActionRef.current = handlePayForCredits;
      setShowAuthModal(true);
      return;
    }

    handlePayForCredits();
  }

  function renderPillButton(
    label: string,
    isActive: boolean,
    onClick: () => void,
    disabled = false,
    icon?: ReactNode,
  ) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={[
          "inline-flex items-center justify-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition duration-300 disabled:cursor-not-allowed disabled:opacity-60",
          isActive
            ? "border-[#d9b08c] bg-[#d9b08c]/14 text-white shadow-[0_0_0_1px_rgba(217,176,140,0.22)]"
            : "border-white/10 bg-white/[0.05] text-neutral-300 hover:border-white/20 hover:bg-white/[0.09] hover:text-white",
        ].join(" ")}
      >
        {icon}
        {label}
      </button>
    );
  }

  function renderCardButton(
    label: string,
    isActive: boolean,
    onClick: () => void,
    disabled = false,
    icon?: ReactNode,
  ) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={[
          "flex items-center justify-center gap-2 rounded-[1.2rem] border px-3 py-2 text-sm transition duration-300 disabled:cursor-not-allowed disabled:opacity-60",
          isActive
            ? "border-[#d9b08c] bg-[#d9b08c]/14 text-white shadow-[0_0_0_1px_rgba(217,176,140,0.22)]"
            : "border-white/10 bg-white/[0.05] text-neutral-300 hover:border-white/20 hover:bg-white/[0.09] hover:text-white",
        ].join(" ")}
      >
        {icon}
        {label}
      </button>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative scroll-mt-24 rounded-[2.5rem] border border-white/10 bg-[#0b0b0d] p-5 text-white shadow-[0_30px_120px_rgba(0,0,0,0.38)] md:p-8"
    >
      <Suspense fallback={null}>
        <PromptPrefill onPrefill={handlePrefill} />
      </Suspense>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(205,164,124,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_24%)]" />

      <div className="relative grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.28em] text-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <Sparkles className="h-4 w-4" />
            {t("badge")}
          </p>

          <h1 className="mt-5 max-w-3xl bg-gradient-to-br from-white via-[#ffe7d1] to-[#d07a2d] bg-clip-text text-3xl font-semibold tracking-[-0.05em] text-transparent drop-shadow-[0_0_18px_rgba(208,122,45,0.16)] md:text-5xl">
            {t("title")}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-300">
            {t("description")}
          </p>

          <div className="mt-7 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-5">
            <div>
              <p className="text-sm font-medium text-neutral-200">
                {t("form.creationTypeLabel")}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {renderPillButton(
                  t("creationTypes.wall"),
                  creationType === "wall",
                  () => setCreationType("wall"),
                  isLoading,
                  <Sparkles className="h-4 w-4" />,
                )}
                {renderPillButton(
                  t("creationTypes.object"),
                  creationType === "object",
                  () => setCreationType("object"),
                  isLoading,
                  <Palette className="h-4 w-4" />,
                )}
                {renderPillButton(
                  t("creationTypes.light"),
                  creationType === "light",
                  () => setCreationType("light"),
                  isLoading,
                  <Lamp className="h-4 w-4" />,
                )}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-neutral-200">
                {t("form.styleLabel")}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {stylePresets.map((preset) => {
                  const isActive = selectedStyle === preset.id;

                  return (
                    <div key={preset.id}>
                      {renderPillButton(
                        preset.label,
                        isActive,
                        () =>
                          setSelectedStyle((current) =>
                            current === preset.id ? null : preset.id,
                          ),
                        isLoading,
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-neutral-200">
                {t("form.paletteLabel")}
              </p>

              <p className="mt-2 text-xs leading-6 text-neutral-400">
                {canShowGradientOption
                  ? t("form.paletteHelpGradientAvailable")
                  : t("form.paletteHelpGradientLocked")}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {visibleColorOptions.map((color) => (
                  <div key={color.id}>
                    {renderPillButton(
                      color.label,
                      selectedColors.includes(color.id),
                      () => toggleColor(color.id),
                      isLoading,
                      <ColorSwatch colorId={color.id} />,
                    )}
                  </div>
                ))}
              </div>

              {selectedColorLabels.length > 0 ? (
                <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-300">
                  <span className="font-medium text-white">
                    {t("form.selectedColors")}
                  </span>{" "}
                  {selectedColorLabels.join(", ")}
                </div>
              ) : null}
            </div>

            {creationType === "wall" ? (
              <>
                <div className="mt-5">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.sizeLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {wallSizeOptions.map((size) => (
                      <div key={size.id}>
                        {renderCardButton(
                          size.label,
                          selectedWallSize === size.id,
                          () => setSelectedWallSize(size.id),
                          isLoading,
                          <Ruler className="h-4 w-4" />,
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.optionsLabel")}
                  </p>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setWithFrame((prev) => !prev)}
                    className={[
                      "mt-4 flex w-full items-start gap-3 rounded-[1.35rem] border px-4 py-4 text-left transition duration-300 disabled:cursor-not-allowed disabled:opacity-60",
                      withFrame
                        ? "border-[#d9b08c] bg-[#d9b08c]/14 text-white shadow-[0_0_0_1px_rgba(217,176,140,0.22)]"
                        : "border-white/10 bg-white/[0.05] text-neutral-300 hover:border-white/20 hover:bg-white/[0.09] hover:text-white",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition duration-300",
                        withFrame
                          ? "border-[#e3bf9d] bg-[#e3bf9d] text-black"
                          : "border-white/20 bg-transparent text-transparent",
                      ].join(" ")}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>

                    <span className="flex-1">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <Sparkles className="h-4 w-4 text-[#e3bf9d]" />
                        {t("form.withFrame")}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-neutral-400">
                        {t("form.withFrameDescription")}
                      </span>
                    </span>
                  </button>
                </div>

                {withFrame ? (
                  <>
                    <div className="mt-5">
                      <p className="text-sm font-medium text-neutral-200">
                        {t("form.frameColor")}
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {frameColors.map((color) => (
                          <div key={color.id}>
                            {renderCardButton(
                              color.label,
                              frameColor === color.id,
                              () => setFrameColor(color.id),
                              isLoading,
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-medium text-neutral-200">
                        {t("form.frameMaterial")}
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {frameMaterials.map((material) => (
                          <div key={material.id}>
                            {renderCardButton(
                              material.label,
                              frameMaterial === material.id,
                              () => setFrameMaterial(material.id),
                              isLoading,
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </>
            ) : null}

            {creationType === "object" ? (
              <>
                <div className="mt-5">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.objectSizeLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {objectSizeOptions.map((size) => (
                      <div key={size.id}>
                        {renderCardButton(
                          size.label,
                          selectedObjectSize === size.id,
                          () => setSelectedObjectSize(size.id),
                          isLoading,
                          <Ruler className="h-4 w-4" />,
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.objectUsageLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {objectUsages.map((usage) => (
                      <div key={usage.id}>
                        {renderCardButton(
                          usage.label,
                          selectedObjectUsage === usage.id,
                          () => setSelectedObjectUsage(usage.id),
                          isLoading,
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.objectFinishLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {objectFinishes.map((finish) => (
                      <div key={finish.id}>
                        {renderCardButton(
                          finish.label,
                          selectedObjectFinish === finish.id,
                          () => setSelectedObjectFinish(finish.id),
                          isLoading,
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {creationType === "light" ? (
              <>
                <div className="mt-5">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.lightTypeLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {lightTypes.map((lightType) => (
                      <div key={lightType.id}>
                        {renderCardButton(
                          lightType.label,
                          selectedLightType === lightType.id,
                          () => setSelectedLightType(lightType.id),
                          isLoading,
                          <Lamp className="h-4 w-4" />,
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.lightTemperatureLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {lightTemperatures.map((temp) => (
                      <div key={temp.id}>
                        {renderCardButton(
                          temp.label,
                          selectedLightTemperature === temp.id,
                          () => setSelectedLightTemperature(temp.id),
                          isLoading,
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.lightIntensityLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {lightIntensities.map((intensity) => (
                      <div key={intensity.id}>
                        {renderCardButton(
                          intensity.label,
                          selectedLightIntensity === intensity.id,
                          () => setSelectedLightIntensity(intensity.id),
                          isLoading,
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-neutral-200">
                    {t("form.lightDiffusionLabel")}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {lightDiffusions.map((diffusion) => (
                      <div key={diffusion.id}>
                        {renderCardButton(
                          diffusion.label,
                          selectedLightDiffusion === diffusion.id,
                          // Optional: clicking the selected card clears it.
                          () =>
                            setSelectedLightDiffusion((current) =>
                              current === diffusion.id ? null : diffusion.id,
                            ),
                          isLoading,
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            <div className="mt-5">
              <p className="text-sm font-medium text-neutral-200">
                {t("form.textureLabel")}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {textures.map((texture) => (
                  <div key={texture.id}>
                    {renderCardButton(
                      texture.label,
                      selectedTexture === texture.id,
                      // Optional: clicking the selected card clears it.
                      () =>
                        setSelectedTexture((current) =>
                          current === texture.id ? null : texture.id,
                        ),
                      isLoading,
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="ai-prompt"
                className="text-sm font-medium text-neutral-200"
              >
                {t("form.label")}
              </label>

              <textarea
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t("form.placeholder")}
                disabled={isLoading}
                className="mt-3 min-h-[110px] w-full resize-y rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-white outline-none transition duration-300 placeholder:text-neutral-500 focus:border-[#caa27c] focus:bg-black/25 focus:ring-2 focus:ring-[#caa27c]/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <ReferenceImageUpload
              value={referenceFile}
              onChange={setReferenceFile}
              disabled={isLoading}
            />

            {fullPrompt ? (
              <div className="mt-4 rounded-[1.25rem] border border-[#d9b08c]/18 bg-gradient-to-br from-[#d9b08c]/10 to-transparent p-3 md:p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#e3bf9d]">
                  {t("promptEnrichedTitle")}
                </p>
                <p className="mt-2 max-h-24 overflow-y-auto text-xs leading-5 text-neutral-300">
                  {fullPrompt}
                </p>
              </div>
            ) : null}

            {paymentSuccessMessage ? (
              <div className="mt-6 flex items-start gap-3 rounded-[1.25rem] border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                <Check className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{paymentSuccessMessage}</span>
              </div>
            ) : null}

            {error ? (
              <div className="mt-6 flex items-start gap-3 rounded-[1.25rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            {isBlocked ? (
              <div className="mt-5 rounded-[1.5rem] border border-[#d9b08c]/25 bg-gradient-to-br from-[#d9b08c]/12 to-[#d9b08c]/5 p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d9b08c]/30 bg-[#d9b08c]/15">
                    <Sparkles className="h-4 w-4 text-[#e3bf9d]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{t("limit.title")}</p>
                    <p className="mt-1.5 text-xs leading-5 text-neutral-400">{t("limit.description")}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={handleBuyCreditsIntent}
                    disabled={isRedirectingToCheckout}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d9b08c] px-5 text-sm font-medium text-black transition duration-300 hover:bg-[#e5c4a6] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isRedirectingToCheckout ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                    {t("payment.payButton")}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="mx-auto flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-400 transition duration-300 hover:text-white"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    {t("buttons.reset")}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d9b08c]/20 bg-[#d9b08c]/10 px-4 py-2 text-xs font-medium text-[#e3bf9d]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {creditsLabel}
                </p>

                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition duration-300 hover:scale-[1.015] hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("buttons.generating")}
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        {t("buttons.generate")}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    {t("buttons.reset")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div ref={resultRef} className="flex flex-col">
          <div className="relative flex min-h-[360px] flex-1 items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:min-h-[440px] md:p-5 xl:p-6">
            {!generatedImage && !isLoading ? (
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                  <Sparkles className="h-7 w-7 text-[#e3bf9d]" />
                </div>

                <h2 className="mt-6 text-2xl font-semibold text-white">
                  {t("result.emptyTitle")}
                </h2>

                <p className="mt-4 text-sm leading-7 text-neutral-400">
                  {t("result.emptyDescription")}
                </p>
              </div>
            ) : null}

            {isLoading ? (
              <>
                <div className="flex h-full w-full items-center justify-center">
                  <div
                    className={`w-full max-w-[760px] ${previewAspectClass} rounded-[1.75rem] bg-white/10`}
                  />
                </div>

                <div
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-md"
                  aria-live="assertive"
                  aria-busy="true"
                >
                  <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center">
                    <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#d9b08c]/25 bg-[#d9b08c]/10">
                      <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full border border-[#d9b08c]/20" />
                      <Loader2 className="relative z-10 h-9 w-9 animate-spin text-[#e3bf9d]" />
                    </div>

                    <h3 className="text-xl font-semibold text-white">
                      {t("loading.title")}
                    </h3>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-neutral-300">
                      {t("loading.description")}
                    </p>

                    <div className="mt-5 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.22em] text-neutral-300">
                      {t("loading.notice")}
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {generatedImage ? (
              <div className="flex h-full w-full max-w-[780px] items-center justify-center select-none">
                <Image
                  src={generatedImage}
                  alt={t("result.imageAlt")}
                  width={1024}
                  height={1024}
                  sizes="(max-width: 1280px) 100vw, 50vw"
                  className="h-auto max-h-[760px] w-auto max-w-full object-contain"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ WebkitTouchCallout: "none" }}
                  priority
                />
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !lastPrompt || isBlocked}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCcw className="h-4 w-4" />
              {t("buttons.regenerate")}
            </button>

            <button
              type="button"
              onClick={handleOrderIntent}
              disabled={!generatedImage || isLoading}
              className={[
                "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition duration-300",
                generatedImage && !isLoading
                  ? "bg-[#d9b08c] text-black hover:scale-[1.015] hover:bg-[#e5c4a6]"
                  : "cursor-not-allowed bg-neutral-700 text-neutral-400",
              ].join(" ")}
            >
              {t("buttons.order")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <p className="text-sm leading-7 text-neutral-300">
              {t("footer.line1")}
            </p>
          </div>
        </div>
      </div>

      {!currentUser ? (
        <div className="absolute inset-0 z-30 rounded-[2.5rem]">
          <div className="sticky top-0 flex h-screen max-h-full items-center justify-center rounded-[2.5rem] bg-black/60 backdrop-blur-md">
            <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                <Sparkles className="h-7 w-7 text-[#e3bf9d]" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-white">
                {t("auth.gateTitle")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                {t("auth.gateDescription")}
              </p>
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition duration-300 hover:scale-[1.015] hover:bg-neutral-200"
              >
                {t("auth.gateButton")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={async () => {
          await refreshAuthState();
          pendingAuthActionRef.current?.();
          pendingAuthActionRef.current = null;
        }}
      />
    </section>
  );
}