"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { User } from "@supabase/supabase-js";
import { LogIn, User as UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase/client";
import AuthModal from "@/components/auth/AuthModal";
import LogoutButton from "@/components/account/LogoutButton";

function getInitial(email: string | null | undefined) {
  return email?.trim().charAt(0).toUpperCase() || "?";
}

type DropdownPosition = { top: number; right: number };

export default function AccountMenu() {
  const t = useTranslations("AccountMenu");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const refreshAuthState = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUser(user);
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

  const updateDropdownPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 12,
      right: window.innerWidth - rect.right,
    });
  }, []);

  useEffect(() => {
    if (!showDropdown) return;

    updateDropdownPosition();

    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [showDropdown, updateDropdownPosition]);

  useEffect(() => {
    if (!showDropdown) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedInsideTrigger = menuRef.current?.contains(target);
      const clickedInsideDropdown = dropdownRef.current?.contains(target);

      if (!clickedInsideTrigger && !clickedInsideDropdown) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  if (!currentUser) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowAuthModal(true)}
          aria-label={t("login")}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/70 text-neutral-700 transition duration-300 hover:border-[#c88a45]/40 hover:text-neutral-950"
        >
          <LogIn className="h-4 w-4" />
        </button>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={refreshAuthState}
          initialMode="login"
        />
      </>
    );
  }

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setShowDropdown((prev) => !prev)}
        aria-label={t("accountLabel")}
        aria-expanded={showDropdown}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d9a15e]/30 bg-[linear-gradient(135deg,#f4d7a1,#c88a45)] text-sm font-semibold text-white shadow-[0_10px_30px_rgba(200,138,69,0.25)] transition duration-300 hover:scale-105"
      >
        {getInitial(currentUser.email) !== "?" ? (
          getInitial(currentUser.email)
        ) : (
          <UserIcon className="h-4 w-4" />
        )}
      </button>

      {showDropdown && dropdownPosition && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={dropdownRef}
              style={{ top: dropdownPosition.top, right: dropdownPosition.right }}
              className="fixed z-[999999] w-64 rounded-[1.5rem] border border-black/10 bg-white/95 p-2 shadow-[0_24px_70px_rgba(20,20,20,0.16)] backdrop-blur-2xl"
            >
              <div className="px-3 py-2.5">
                <p className="truncate text-sm font-medium text-neutral-900">
                  {currentUser.email}
                </p>
              </div>

              <div className="my-1 h-px bg-black/[0.06]" />

              <Link
                href="/mon-compte"
                onClick={() => setShowDropdown(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-[#f8f1e8] hover:text-neutral-950"
              >
                {t("dashboard")}
              </Link>

              <div className="mt-1 px-1">
                <LogoutButton />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
