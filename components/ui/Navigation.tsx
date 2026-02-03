'use client';

import { useState, type FocusEvent, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '@/shared/ui/Container';
import ButtonLink from '@/shared/ui/ButtonLink';
import { tokens, withAlpha } from '@/shared/constants/tokens';
import {
  IconPdf,
  IconImage,
  IconCalculator,
  IconMoney,
  IconChevronDown,
  IconMenu,
  IconX,
  IconCalendar,
  IconZap,
  IconShield,
} from '@/shared/ui/icons';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleMenuBlur = (menu: string) => (event: FocusEvent<HTMLElement>) => {
    if (openDropdown !== menu) {
      return;
    }
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }
    setOpenDropdown(null);
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      setOpenDropdown(null);
    }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1.0] as const,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
      },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      height: 'auto',
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0] as const,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border-light)] bg-[var(--surface-1)]/85 backdrop-blur-2xl shadow-[var(--shadow-medium)]"
      role="banner"
    >
      <Container className="flex flex-wrap items-center justify-between gap-3 py-4">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/"
            className={[
              'flex items-center gap-3 text-[var(--text-primary)] group',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] rounded-lg p-2',
            ].join(' ')}
          >
            <motion.span
              className="inline-flex h-10 w-10 items-center justify-center rounded-full shadow-[var(--shadow-medium)]"
              style={{
                backgroundColor: tokens.color.primary.DEFAULT,
                color: tokens.color.text.inverted,
              }}
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              aria-hidden="true"
            >
              <span className="text-sm font-bold">P</span>
            </motion.span>
            <span className="text-xl font-black text-[var(--text-primary)]">جعبه ابزار فارسی</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-2"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* PDF Tools Dropdown */}
          <div
            className="relative group"
            onFocusCapture={() => setOpenDropdown('pdf')}
            onBlurCapture={handleMenuBlur('pdf')}
          >
            <motion.button
              className="flex items-center gap-2 rounded-full border border-transparent px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] transition-all duration-[var(--motion-medium)] hover:border-[var(--border-light)] hover:bg-[var(--surface-1)]/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
              onMouseEnter={() => setOpenDropdown('pdf')}
              onMouseLeave={() => setOpenDropdown(null)}
              onKeyDown={handleMenuKeyDown}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-expanded={openDropdown === 'pdf'}
              aria-haspopup="true"
              aria-controls="pdf-dropdown-menu"
              id="pdf-dropdown-button"
            >
              <IconPdf className="h-4 w-4" />
              ابزارهای PDF
              <motion.div
                animate={{ rotate: openDropdown === 'pdf' ? 180 : 0 }}
                transition={{ duration: parseFloat(tokens.motion.duration.fast) }}
              >
                <IconChevronDown className="h-3 w-3" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {openDropdown === 'pdf' && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-full left-0 mt-2 w-80 rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-1)]/96 shadow-[var(--shadow-strong)] backdrop-blur-xl py-4 overflow-hidden"
                  onMouseEnter={() => setOpenDropdown('pdf')}
                  onMouseLeave={() => setOpenDropdown(null)}
                  role="menu"
                  aria-labelledby="pdf-dropdown-button"
                  id="pdf-dropdown-menu"
                >
                  <Link
                    href="/pdf-tools"
                    className="mx-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-[var(--motion-fast)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
                    onClick={closeMobileMenu}
                    role="menuitem"
                  >
                    <motion.div
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                      style={{ backgroundColor: withAlpha(tokens.color.statusRgb.danger, 0.2) }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = withAlpha(
                          tokens.color.statusRgb.danger,
                          0.3,
                        );
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = withAlpha(
                          tokens.color.statusRgb.danger,
                          0.2,
                        );
                      }}
                    >
                      <IconPdf className="h-4 w-4" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-bold">همه ابزارهای PDF</div>
                      <div className="text-xs" style={{ color: tokens.color.text.muted }}>
                        تبدیل، فشرده‌سازی، ادغام و...
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Image Tools Dropdown */}
          <div
            className="relative group"
            onFocusCapture={() => setOpenDropdown('image')}
            onBlurCapture={handleMenuBlur('image')}
          >
            <motion.button
              className="flex items-center gap-2 rounded-full border border-transparent px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] transition-all duration-[var(--motion-medium)] hover:border-[var(--border-light)] hover:bg-[var(--surface-1)]/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
              onMouseEnter={() => setOpenDropdown('image')}
              onMouseLeave={() => setOpenDropdown(null)}
              onKeyDown={handleMenuKeyDown}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-expanded={openDropdown === 'image'}
              aria-haspopup="true"
              aria-controls="image-dropdown-menu"
              id="image-dropdown-button"
            >
              <IconImage className="h-4 w-4" />
              ابزارهای تصویر
              <motion.div
                animate={{ rotate: openDropdown === 'image' ? 180 : 0 }}
                transition={{ duration: parseFloat(tokens.motion.duration.fast) }}
              >
                <IconChevronDown className="h-3 w-3" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {openDropdown === 'image' && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-full left-0 mt-2 w-80 rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-1)]/96 shadow-[var(--shadow-strong)] backdrop-blur-xl py-4 overflow-hidden"
                  onMouseEnter={() => setOpenDropdown('image')}
                  onMouseLeave={() => setOpenDropdown(null)}
                  role="menu"
                  aria-labelledby="image-dropdown-button"
                  id="image-dropdown-menu"
                >
                  <Link
                    href="/image-tools"
                    className="mx-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-[var(--motion-fast)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
                    onClick={closeMobileMenu}
                    role="menuitem"
                  >
                    <motion.div
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                      style={{ backgroundColor: withAlpha(tokens.color.statusRgb.info, 0.2) }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = withAlpha(
                          tokens.color.statusRgb.info,
                          0.3,
                        );
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = withAlpha(
                          tokens.color.statusRgb.info,
                          0.2,
                        );
                      }}
                    >
                      <IconImage className="h-4 w-4" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-bold">ابزارهای تصویر</div>
                      <div className="text-xs" style={{ color: tokens.color.text.muted }}>
                        فشرده‌سازی و بهینه‌سازی تصویر
                      </div>
                    </div>
                  </Link>
                  <div className="border-t border-[var(--border-light)]/50 my-2"></div>
                  <div
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider"
                    style={{ color: tokens.color.text.muted }}
                  >
                    ابزارهای دیگر
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-colors group cursor-not-allowed"
                    style={{ color: tokens.color.text.muted }}
                    disabled
                    aria-disabled="true"
                    role="menuitem"
                  >
                    <motion.div
                      className="flex items-center justify-center w-8 h-8 rounded-full"
                      style={{ backgroundColor: tokens.color.border.DEFAULT }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <IconImage className="h-4 w-4" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-bold">افزودن عکس به PDF</div>
                      <div className="text-xs" style={{ color: tokens.color.text.muted }}>
                        به زودی
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-colors group cursor-not-allowed"
                    style={{ color: tokens.color.text.muted }}
                    disabled
                    aria-disabled="true"
                    role="menuitem"
                  >
                    <motion.div
                      className="flex items-center justify-center w-8 h-8 rounded-full"
                      style={{ backgroundColor: tokens.color.border.DEFAULT }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <IconImage className="h-4 w-4" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-bold">تبدیل PDF به عکس</div>
                      <div className="text-xs" style={{ color: tokens.color.text.muted }}>
                        به زودی
                      </div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Financial Tools */}
          <div
            className="relative group"
            onFocusCapture={() => setOpenDropdown('financial')}
            onBlurCapture={handleMenuBlur('financial')}
          >
            <motion.button
              className="flex items-center gap-2 rounded-full border border-transparent px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] transition-all duration-[var(--motion-medium)] hover:border-[var(--border-light)] hover:bg-[var(--surface-1)]/85"
              onMouseEnter={() => setOpenDropdown('financial')}
              onMouseLeave={() => setOpenDropdown(null)}
              onKeyDown={handleMenuKeyDown}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-expanded={openDropdown === 'financial'}
              aria-haspopup="true"
              aria-controls="financial-dropdown-menu"
              id="financial-dropdown-button"
            >
              <IconCalculator className="h-4 w-4" />
              ابزارهای مالی
              <motion.div
                animate={{ rotate: openDropdown === 'financial' ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <IconChevronDown className="h-3 w-3" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {openDropdown === 'financial' && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-full left-0 mt-2 w-80 rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-1)]/96 shadow-[var(--shadow-strong)] backdrop-blur-xl py-4 overflow-hidden"
                  onMouseEnter={() => setOpenDropdown('financial')}
                  onMouseLeave={() => setOpenDropdown(null)}
                  role="menu"
                  aria-labelledby="financial-dropdown-button"
                  id="financial-dropdown-menu"
                >
                  <Link
                    href="/loan"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--color-primary)] transition-all duration-[var(--motion-fast)] group"
                    onClick={closeMobileMenu}
                    role="menuitem"
                  >
                    <motion.div
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                      style={{ backgroundColor: withAlpha(tokens.color.primaryRgb, 0.18) }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <IconCalculator className="h-4 w-4 text-[var(--color-primary)]" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-bold">محاسبه‌گر وام</div>
                      <div className="text-xs text-[var(--text-muted)]">محاسبه قسط و سود وام</div>
                    </div>
                  </Link>
                  <Link
                    href="/salary"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--color-primary)] transition-all duration-[var(--motion-fast)] group"
                    onClick={closeMobileMenu}
                    role="menuitem"
                  >
                    <motion.div
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                      style={{ backgroundColor: withAlpha(tokens.color.statusRgb.success, 0.18) }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <IconMoney className="h-4 w-4 text-[var(--color-success)]" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-bold">محاسبه‌گر حقوق</div>
                      <div className="text-xs text-[var(--text-muted)]">محاسبه حقوق و بیمه</div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Date Tools */}
          <div className="relative group">
            <Link
              href="/date-tools"
              className="flex items-center gap-2 rounded-full border border-transparent px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] transition-all duration-[var(--motion-medium)] hover:border-[var(--border-light)] hover:bg-[var(--surface-1)]/85"
            >
              <IconCalendar className="h-4 w-4" />
              ابزارهای تاریخ
            </Link>
          </div>

          {/* Text Tools */}
          <div className="relative group">
            <Link
              href="/text-tools"
              className="flex items-center gap-2 rounded-full border border-transparent px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] transition-all duration-[var(--motion-medium)] hover:border-[var(--border-light)] hover:bg-[var(--surface-1)]/85"
            >
              <IconZap className="h-4 w-4" />
              ابزارهای متنی
            </Link>
          </div>

          {/* Validation Tools */}
          <div className="relative group">
            <Link
              href="/validation-tools"
              className="flex items-center gap-2 rounded-full border border-transparent px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] transition-all duration-[var(--motion-medium)] hover:border-[var(--border-light)] hover:bg-[var(--surface-1)]/85"
            >
              <IconShield className="h-4 w-4" />
              ابزارهای اعتبارسنجی
            </Link>
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <ButtonLink href="/pdf-tools" size="sm" className="px-4">
            شروع سریع
          </ButtonLink>
          <ButtonLink href="/date-tools" size="sm" variant="secondary" className="px-4">
            ابزارهای تاریخ
          </ButtonLink>
          <ButtonLink href="/text-tools" size="sm" variant="tertiary" className="px-4">
            ابزارهای متنی
          </ButtonLink>
          <ButtonLink href="/validation-tools" size="sm" variant="tertiary" className="px-4">
            اعتبارسنجی
          </ButtonLink>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          data-testid="mobile-menu"
          className="lg:hidden flex items-center gap-2 text-[var(--text-primary)] p-2.5 rounded-full hover:bg-[var(--surface-1)]/85 transition-all duration-[var(--motion-fast)]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <IconX className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <IconMenu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden border-t border-[var(--border-light)] bg-[var(--surface-1)]/85 backdrop-blur-xl"
          >
            <Container className="py-4 space-y-2">
              {/* PDF Tools */}
              <div>
                <motion.button
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] rounded-full transition-all duration-[var(--motion-fast)]"
                  onClick={() => toggleDropdown('pdf')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconPdf className="h-4 w-4" />
                  ابزارهای PDF
                  <motion.div
                    animate={{ rotate: openDropdown === 'pdf' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="mr-auto"
                  >
                    <IconChevronDown className="h-3 w-3" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openDropdown === 'pdf' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mr-4 mt-2 space-y-1 overflow-hidden"
                    >
                      <Link
                        href="/pdf-tools"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] rounded-full transition-all duration-[var(--motion-fast)]"
                        onClick={closeMobileMenu}
                      >
                        <motion.div
                          className="flex items-center justify-center w-8 h-8 rounded-full"
                          style={{
                            backgroundColor: withAlpha(tokens.color.statusRgb.danger, 0.18),
                          }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <IconPdf className="h-4 w-4 text-[var(--color-danger)]" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-bold">همه ابزارهای PDF</div>
                          <div className="text-xs text-[var(--text-muted)]">
                            تبدیل، فشرده‌سازی، ادغام و...
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Image Tools */}
              <div>
                <motion.button
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] rounded-full transition-all duration-[var(--motion-fast)]"
                  onClick={() => toggleDropdown('image')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconImage className="h-4 w-4" />
                  ابزارهای تصویر
                  <motion.div
                    animate={{ rotate: openDropdown === 'image' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="mr-auto"
                  >
                    <IconChevronDown className="h-3 w-3" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openDropdown === 'image' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mr-4 mt-2 space-y-1 overflow-hidden"
                    >
                      <Link
                        href="/image-tools"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] rounded-full transition-all duration-[var(--motion-fast)]"
                        onClick={closeMobileMenu}
                      >
                        <motion.div
                          className="flex items-center justify-center w-8 h-8 rounded-full"
                          style={{ backgroundColor: withAlpha(tokens.color.statusRgb.info, 0.18) }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <IconImage className="h-4 w-4 text-[var(--color-info)]" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-bold">ابزارهای تصویر</div>
                          <div className="text-xs text-[var(--text-muted)]">
                            فشرده‌سازی و بهینه‌سازی
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-muted)] rounded-full">
                        <motion.div
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-subtle)]"
                          whileHover={{ scale: 1.1 }}
                        >
                          <IconImage className="h-4 w-4 text-[var(--text-muted)]" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-bold">تغییر اندازه عکس</div>
                          <div className="text-xs text-[var(--text-muted)]">به زودی</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Financial Tools */}
              <div>
                <motion.button
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] rounded-full transition-all duration-[var(--motion-fast)]"
                  onClick={() => toggleDropdown('financial')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconCalculator className="h-4 w-4" />
                  ابزارهای مالی
                  <motion.div
                    animate={{ rotate: openDropdown === 'financial' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="mr-auto"
                  >
                    <IconChevronDown className="h-3 w-3" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openDropdown === 'financial' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mr-4 mt-2 space-y-1 overflow-hidden"
                    >
                      <Link
                        href="/loan"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] rounded-full transition-all duration-[var(--motion-fast)]"
                        onClick={closeMobileMenu}
                      >
                        <motion.div
                          className="flex items-center justify-center w-8 h-8 rounded-full"
                          style={{ backgroundColor: withAlpha(tokens.color.primaryRgb, 0.18) }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <IconCalculator className="h-4 w-4 text-[var(--color-primary)]" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-bold">محاسبه‌گر وام</div>
                          <div className="text-xs text-[var(--text-muted)]">
                            محاسبه قسط و سود وام
                          </div>
                        </div>
                      </Link>
                      <Link
                        href="/salary"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] rounded-full transition-all duration-[var(--motion-fast)]"
                        onClick={closeMobileMenu}
                      >
                        <motion.div
                          className="flex items-center justify-center w-8 h-8 rounded-full"
                          style={{
                            backgroundColor: withAlpha(tokens.color.statusRgb.success, 0.18),
                          }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <IconMoney className="h-4 w-4 text-[var(--color-success)]" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-bold">محاسبه‌گر حقوق</div>
                          <div className="text-xs text-[var(--text-muted)]">محاسبه حقوق و بیمه</div>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Date Tools */}
              <div>
                <Link
                  href="/date-tools"
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] rounded-full transition-all duration-[var(--motion-fast)]"
                  onClick={closeMobileMenu}
                >
                  <motion.div
                    className="flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ backgroundColor: withAlpha(tokens.color.statusRgb.warning, 0.18) }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <IconCalendar className="h-4 w-4 text-[var(--color-warning)]" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="font-bold">ابزارهای تاریخ</div>
                    <div className="text-xs text-[var(--text-muted)]">تبدیل تاریخ، سن، اختلاف</div>
                  </div>
                </Link>
              </div>

              {/* Text Tools */}
              <div>
                <Link
                  href="/text-tools"
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] rounded-full transition-all duration-[var(--motion-fast)]"
                  onClick={closeMobileMenu}
                >
                  <motion.div
                    className="flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ backgroundColor: withAlpha(tokens.color.statusRgb.info, 0.16) }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <IconZap className="h-4 w-4 text-[var(--color-info)]" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="font-bold">ابزارهای متنی</div>
                    <div className="text-xs text-[var(--text-muted)]">
                      تبدیل عدد، تاریخ و شمارش کلمات
                    </div>
                  </div>
                </Link>
              </div>

              {/* Validation Tools */}
              <div>
                <Link
                  href="/validation-tools"
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] rounded-full transition-all duration-[var(--motion-fast)]"
                  onClick={closeMobileMenu}
                >
                  <motion.div
                    className="flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ backgroundColor: withAlpha(tokens.color.statusRgb.success, 0.16) }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <IconShield className="h-4 w-4 text-[var(--color-success)]" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="font-bold">اعتبارسنجی داده‌ها</div>
                    <div className="text-xs text-[var(--text-muted)]">
                      کد ملی، موبایل، شبا و پلاک
                    </div>
                  </div>
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
