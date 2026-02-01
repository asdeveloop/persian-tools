import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Container from './Container';
import { tokens } from '../constants/tokens';
import {
  IconPdf,
  IconImage,
  IconCalculator,
  IconMoney,
  IconChevronDown,
  IconMenu,
  IconX,
} from './icons';

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
    <header className="sticky top-0 z-50 glass-strong border-b border-white/20 shadow-lg" role="banner">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className={[
              'flex items-center gap-3 text-black group',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
              'focus-visible:ring-offset-2 rounded-lg p-2',
            ].join(' ')}
          >
            <motion.span
              className="inline-flex h-10 w-10 items-center justify-center rounded-full shadow-lg"
              style={{ backgroundColor: tokens.color.primary.DEFAULT, color: tokens.color.text.inverted }}
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
            <span className="text-xl font-black text-black">جعبه ابزار فارسی</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2" role="navigation" aria-label="Main navigation">
          {/* PDF Tools Dropdown */}
          <div className="relative group">
            <motion.button
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              style={{
                color: tokens.color.text.DEFAULT,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={() => setOpenDropdown('pdf')}
              onMouseLeave={() => setOpenDropdown(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-expanded={openDropdown === 'pdf'}
              aria-haspopup="true"
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
                  className="absolute top-full left-0 mt-2 w-80 glass-strong rounded-2xl shadow-2xl border border-white/20 py-4 overflow-hidden"
                  onMouseEnter={() => setOpenDropdown('pdf')}
                  onMouseLeave={() => setOpenDropdown(null)}
                  role="menu"
                  aria-labelledby="pdf-dropdown-button"
                >
                  <Link
                    href="/pdf-tools"
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg mx-2"
                    style={{
                      color: tokens.color.text.DEFAULT,
                      backgroundColor: 'transparent',
                    }}
                    onClick={closeMobileMenu}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = tokens.color.primary.DEFAULT;
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = tokens.color.text.DEFAULT;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    role="menuitem"
                  >
                    <motion.div
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                      style={{ backgroundColor: `${tokens.color.status.danger }20` }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${tokens.color.status.danger }30`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${tokens.color.status.danger }20`;
                      }}
                    >
                      <IconPdf className="h-4 w-4" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-bold">همه ابزارهای PDF</div>
                      <div className="text-xs" style={{ color: tokens.color.text.muted }}>تبدیل، فشرده‌سازی، ادغام و...</div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Image Tools Dropdown */}
          <div className="relative group">
            <motion.button
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              style={{
                color: tokens.color.text.DEFAULT,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={() => setOpenDropdown('image')}
              onMouseLeave={() => setOpenDropdown(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
                  className="absolute top-full left-0 mt-2 w-80 glass-strong rounded-2xl shadow-2xl border border-white/20 py-4 overflow-hidden"
                  onMouseEnter={() => setOpenDropdown('image')}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href="/image-compress"
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg"
                    style={{
                      color: tokens.color.text.DEFAULT,
                      backgroundColor: 'transparent',
                    }}
                    onClick={closeMobileMenu}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = tokens.color.primary.DEFAULT;
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = tokens.color.text.DEFAULT;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <motion.div
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                      style={{ backgroundColor: '#9333ea20' }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#9333ea30';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#9333ea20';
                      }}
                    >
                      <IconImage className="h-4 w-4" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-bold">فشرده‌سازی عکس</div>
                      <div className="text-xs" style={{ color: tokens.color.text.muted }}>کاهش حجم عکس‌ها</div>
                    </div>
                  </Link>
                  <div className="border-t border-gray-200/50 my-2"></div>
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider" style={{ color: tokens.color.text.muted }}>
                    ابزارهای دیگر
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-colors group cursor-not-allowed"
                    style={{ color: tokens.color.text.muted }}
                    disabled
                    aria-disabled="true"
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
                      <div className="text-xs" style={{ color: tokens.color.text.muted }}>به زودی</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-colors group cursor-not-allowed"
                    style={{ color: tokens.color.text.muted }}
                    disabled
                    aria-disabled="true"
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
                      <div className="text-xs" style={{ color: tokens.color.text.muted }}>به زودی</div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Financial Tools */}
          <div className="relative group">
            <motion.button
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-700 hover:text-black hover:bg-black/5 rounded-full transition-all duration-300"
              onMouseEnter={() => setOpenDropdown('financial')}
              onMouseLeave={() => setOpenDropdown(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
                  className="absolute top-full left-0 mt-2 w-80 glass-strong rounded-2xl shadow-2xl border border-white/20 py-4 overflow-hidden"
                  onMouseEnter={() => setOpenDropdown('financial')}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href="/loan"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-black/5 hover:text-black transition-all duration-200 group"
                    onClick={closeMobileMenu}
                  >
                    <motion.div
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <IconCalculator className="h-4 w-4 text-blue-600" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-bold">محاسبه‌گر وام</div>
                      <div className="text-xs text-gray-500">محاسبه قسط و سود وام</div>
                    </div>
                  </Link>
                  <Link
                    href="/salary"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-black/5 hover:text-black transition-all duration-200 group"
                    onClick={closeMobileMenu}
                  >
                    <motion.div
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <IconMoney className="h-4 w-4 text-green-600" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-bold">محاسبه‌گر حقوق</div>
                      <div className="text-xs text-gray-500">محاسبه حقوق و بیمه</div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden flex items-center gap-2 text-gray-700 hover:text-black p-2.5 rounded-full hover:bg-black/5 transition-all duration-200"
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
            className="lg:hidden border-t border-white/20 glass-strong"
          >
            <Container className="py-4 space-y-2">
              {/* PDF Tools */}
              <div>
                <motion.button
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-gray-700 hover:bg-black/5 hover:text-black rounded-full transition-all duration-200"
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
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-black/5 hover:text-black rounded-full transition-all duration-200"
                        onClick={closeMobileMenu}
                      >
                        <motion.div
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100"
                          whileHover={{ scale: 1.1 }}
                        >
                          <IconPdf className="h-4 w-4 text-red-600" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-bold">همه ابزارهای PDF</div>
                          <div className="text-xs text-gray-500">تبدیل، فشرده‌سازی، ادغام و...</div>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Image Tools */}
              <div>
                <motion.button
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-gray-700 hover:bg-black/5 hover:text-black rounded-full transition-all duration-200"
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
                        href="/image-compress"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-black/5 hover:text-black rounded-full transition-all duration-200"
                        onClick={closeMobileMenu}
                      >
                        <motion.div
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100"
                          whileHover={{ scale: 1.1 }}
                        >
                          <IconImage className="h-4 w-4 text-purple-600" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-bold">فشرده‌سازی عکس</div>
                          <div className="text-xs text-gray-500">کاهش حجم عکس‌ها</div>
                        </div>
                      </Link>
                      <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 rounded-full">
                        <motion.div
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100"
                          whileHover={{ scale: 1.1 }}
                        >
                          <IconImage className="h-4 w-4 text-gray-400" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-bold">تغییر اندازه عکس</div>
                          <div className="text-xs text-gray-400">به زودی</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Financial Tools */}
              <div>
                <motion.button
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-gray-700 hover:bg-black/5 hover:text-black rounded-full transition-all duration-200"
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
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-black/5 hover:text-black rounded-full transition-all duration-200"
                        onClick={closeMobileMenu}
                      >
                        <motion.div
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100"
                          whileHover={{ scale: 1.1 }}
                        >
                          <IconCalculator className="h-4 w-4 text-blue-600" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-bold">محاسبه‌گر وام</div>
                          <div className="text-xs text-gray-500">محاسبه قسط و سود وام</div>
                        </div>
                      </Link>
                      <Link
                        href="/salary"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-black/5 hover:text-black rounded-full transition-all duration-200"
                        onClick={closeMobileMenu}
                      >
                        <motion.div
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100"
                          whileHover={{ scale: 1.1 }}
                        >
                          <IconMoney className="h-4 w-4 text-green-600" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-bold">محاسبه‌گر حقوق</div>
                          <div className="text-xs text-gray-500">محاسبه حقوق و بیمه</div>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
