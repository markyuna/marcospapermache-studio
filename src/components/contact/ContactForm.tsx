"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

type FormState = {
  name: string;
  email: string;
  projectType: string;
  message: string;
  budget: string;
  timeline: string;
};

type ProjectTypeOption = {
  value: string;
  label: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  projectType: "",
  message: "",
  budget: "",
  timeline: "",
};

export default function ContactForm() {
  const t = useTranslations("ContactForm");

  const projectTypeOptions: ProjectTypeOption[] = [
    { value: "sculpture-sur-mesure", label: t("projectTypes.customSculpture") },
    { value: "piece-murale", label: t("projectTypes.wallPiece") },
    { value: "lampe-sculpturale", label: t("projectTypes.sculpturalLamp") },
    {
      value: "installation-artistique",
      label: t("projectTypes.artInstallation"),
    },
    { value: "collaboration", label: t("projectTypes.collaboration") },
  ];

  const [loading, setLoading] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);

  const projectMenuRef = useRef<HTMLDivElement | null>(null);

  const selectedProjectLabel = useMemo(() => {
    return (
      projectTypeOptions.find((option) => option.value === form.projectType)?.label ??
      ""
    );
  }, [form.projectType, projectTypeOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        projectMenuRef.current &&
        !projectMenuRef.current.contains(event.target as Node)
      ) {
        setIsProjectMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProjectMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProjectTypeSelect = (value: string) => {
    setForm((prev) => ({
      ...prev,
      projectType: value,
    }));
    setIsProjectMenuOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.projectType) {
      return;
    }

    setLoading(true);

    try {
      console.log("Contact form submitted:", form);
      await new Promise((resolve) => setTimeout(resolve, 900));
      setForm(initialState);
      setIsProjectMenuOpen(false);
    } catch (error) {
      console.error("Failed to submit contact form:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "w-full rounded-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-[#ff6a00]/40 focus:ring-2 focus:ring-[#ff6a00]/20";

  const textareaClassName =
    "w-full rounded-[1.5rem] border border-white/10 bg-transparent px-4 py-4 text-sm leading-7 text-white placeholder:text-neutral-500 outline-none transition resize-none focus:border-[#ff6a00]/40 focus:ring-2 focus:ring-[#ff6a00]/20";

  const dropdownButtonClassName =
    "flex w-full items-center justify-between rounded-full border border-white/10 bg-transparent px-4 py-3 text-left text-sm text-white outline-none transition hover:border-white/20 focus-visible:border-[#ff6a00]/40 focus-visible:ring-2 focus-visible:ring-[#ff6a00]/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm text-neutral-300">{t("intro.nameLabel")}</p>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder={t("intro.namePlaceholder")}
            className={inputClassName}
            required
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-neutral-300">{t("intro.emailLabel")}</p>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t("intro.emailPlaceholder")}
            className={inputClassName}
            required
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-neutral-300">{t("intro.projectLabel")}</p>

          <div ref={projectMenuRef} className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isProjectMenuOpen}
              className={dropdownButtonClassName}
              onClick={() => setIsProjectMenuOpen((prev) => !prev)}
            >
              <span
                className={
                  selectedProjectLabel ? "text-white" : "text-neutral-500"
                }
              >
                {selectedProjectLabel || t("intro.projectPlaceholder")}
              </span>

              <ChevronDown
                className={`h-4 w-4 shrink-0 text-neutral-500 transition duration-300 ${
                  isProjectMenuOpen
                    ? "rotate-180 text-[#ff6a00]"
                    : "rotate-0"
                }`}
              />
            </button>

            {isProjectMenuOpen ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-30 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111111]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <ul role="listbox" className="space-y-1">
                  {projectTypeOptions.map((option) => {
                    const isSelected = form.projectType === option.value;

                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-left text-sm text-white transition hover:bg-white/[0.06]"
                          onClick={() => handleProjectTypeSelect(option.value)}
                        >
                          <span>{option.label}</span>
                          {isSelected ? (
                            <Check className="h-4 w-4 text-[#ff6a00]" />
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            <input
              type="hidden"
              name="projectType"
              value={form.projectType}
              required
            />
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
          {t("message.eyebrow")}
        </p>

        <textarea
          id="message"
          name="message"
          rows={6}
          value={form.message}
          onChange={handleChange}
          placeholder={t("message.placeholder", {
            project: selectedProjectLabel || t("message.defaultProject"),
          })}
          className={textareaClassName}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          id="budget"
          name="budget"
          type="text"
          value={form.budget}
          onChange={handleChange}
          placeholder={t("budgetPlaceholder")}
          className={inputClassName}
        />

        <input
          id="timeline"
          name="timeline"
          type="text"
          value={form.timeline}
          onChange={handleChange}
          placeholder={t("timelinePlaceholder")}
          className={inputClassName}
        />
      </div>

      <Button
        type="submit"
        variant="default"
        size="lg"
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            {t("submit.loading")}
          </>
        ) : (
          <>
            {t("submit.default")}
            <ArrowRight data-icon="inline-end" />
          </>
        )}
      </Button>
    </form>
  );
}