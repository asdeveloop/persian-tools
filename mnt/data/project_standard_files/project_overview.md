# Project Overview

## Table of Contents
- [Domain and Audience](#domain-and-audience)
- [Non-negotiable Principles](#non-negotiable-principles)
- [Locality and Persian Support](#locality-persian-language-support-and-compliance-with-sanctions)
- [Technical Requirements](#technical-requirements)
- [Development Workflow](#development-workflow)

## Domain and Audience

This document is intended for:
- **UI/UX Designers**: For design system implementation and pattern adherence
- **Developers**: For coding standards and technical requirements
- **Document Maintainers**: For keeping documentation current and accurate
- **Wrapper Package Developers** (React/Vue/etc.): For consistent API design
- **QA Engineers**: For testing standards and accessibility requirements
- **Project Managers**: For understanding technical constraints and requirements

### Goals
1. **Consistent UI behavior** and user experience across all dependencies
2. **Accessible, coherent experience** that adheres to global standards
3. **Scalable, maintainable, and testable** project development
4. **Persian-first design** with RTL support and cultural considerations

## Non-negotiable Principles

These principles are **laws** and must be followed across all packages, websites, and documentation:

### 🌐 **UI Language and Content in Persian**
- All pages, documents, and components must fully support **Persian/RTL**
- Use proper Persian typography and half-space rules
- Numbers, dates, and formatting must be Persian-appropriate

### 🏠 **Local-first Architecture**
- **No runtime dependency** on external services (CDNs, APIs)
- All critical functionality must work offline
- External services only for non-critical features with fallbacks

### ♿ **Accessibility Standards**
- Minimum **WCAG AA** compliance for all main paths
- Keyboard navigation support
- Screen reader compatibility
- High contrast modes

### �� **Code Quality Standards**
- **TypeScript** with `strict: true` enabled
- **No `any` types** unless explicitly justified with ticket reference
- Proper error handling and logging
- Comprehensive test coverage

### 🧪 **Testing Requirements**
- Every vital section (utilities, validations, components) must have reliable tests
- Unit tests for business logic
- Integration tests for component interactions
- E2E tests for critical user journeys

### ⚡ **Performance Standards**
- Tools and UI should be **lightweight and fast**
- **No heavy packages** without justification
- Lazy loading for non-critical resources
- Optimized bundle sizes

## Locality, Persian Language Support, and Compliance with Sanctions

### Language and Content

#### 📝 **UI Language**
- **Primary**: Persian (فارسی)
- **Fallback**: English for technical terms when necessary
- **Documentation**: Bilingual (Persian first, English second)

#### 🔤 **Typography**
- **Font**: Only use **IRANSansX**, embedded in the project
- **Fallback**: System fonts only when IRANSansX unavailable
- **Direction**: All pages and components are **RTL**
- **Half-space**: Proper use according to Persian language rules

#### 🔢 **Number and Date Formatting**
- **Numbers**: Display using Persian numerals (۰–۹)
- **Separators**: Use Persian thousand separators
- **Dates**: Specify **Shamsi/Gregorian**, preferably support **Shamsi**
- **Time**: 24-hour format with Persian AM/PM equivalents

### No External Dependencies Policy

#### ❌ **Prohibited External Dependencies**
- **CDN** for JS/CSS/Font/Icons
- **Google Fonts** or any remote fonts
- **External analytics** (unless self-hosted)
- **External APIs** for core functionality
- **Cloud services** for critical data storage

#### ✅ **Allowed Dependencies**
- **npm packages** that are bundled locally
- **Self-hosted services** under project control
- **Local fonts and assets**
- **Offline-capable libraries**

### Sanctions Compatibility

#### 🚫 **Sanction Risk Mitigation**
- Features must work even if international service access is restricted
- Design for **offline-first** operation
- Local alternatives for all critical functionality

#### 🏳️ **External Service Requirements**
If an external service must be used, it must:
1. **Have a local replacement** ready
2. **Be behind a Feature Flag** for quick disabling
3. **Be documented** with "Sanction Risk" warning
4. **Have graceful degradation** when unavailable

## Technical Requirements

### 🏗️ **Architecture Standards**
- **Modular design** with clear separation of concerns
- **Dependency injection** for testability
- **Event-driven architecture** where appropriate
- **State management** with proper patterns

### 🔧 **Development Environment**
- **Node.js** with specified version range
- **pnpm** for package management
- **TypeScript** with strict configuration
- **ESLint/Prettier** for code formatting

### �� **Build and Deployment**
- **Static site generation** where possible
- **Docker containers** for consistent environments
- **CI/CD pipeline** with automated testing
- **Rolling deployments** with zero downtime

## Development Workflow

### 🔄 **Code Review Process**
- **Pull requests** required for all changes
- **Automated checks** must pass
- **Peer review** for all code changes
- **Security review** for sensitive changes

### 📋 **Quality Gates**
- **All tests must pass**
- **Coverage thresholds** met
- **Type checking** with no errors
- **Linting** with no warnings
- **Accessibility** audit passed

### 🚀 **Release Process**
- **Semantic versioning** for releases
- **Changelog** with detailed changes
- **Migration guides** for breaking changes
- **Rollback plan** for each release
