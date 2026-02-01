# UI Components and Patterns

## Table of Contents
- [Buttons](#buttons)
- [Inputs and Forms](#inputs-and-forms)
- [Cards](#cards)
- [Modals/Dialogs](#modalsdialogs)
- [Toast/Notifications](#toastnotifications)
- [Navigation/Layout](#navigationlayout)
- [Tables and Lists](#tables-and-lists)
- [Loading States](#loading-states)
- [Empty States](#empty-states)
- [Error States](#error-states)

## Buttons

### 🎯 **Types (Variants)**

#### Primary Button
- **Usage**: Main action (CTA), most important action on page
- **Style**: Solid background with primary color
- **Examples**: "Submit", "Save", "Continue"

#### Secondary Button
- **Usage**: Secondary actions, alternative options
- **Style**: Outline or subtle background
- **Examples**: "Cancel", "Back", "Skip"

#### Tertiary/Ghost Button
- **Usage**: Less important actions, inside cards or panels
- **Style**: Minimal styling, hover state only
- **Examples**: "Learn More", "View Details"

#### Danger Button
- **Usage**: Destructive operations
- **Style**: Red/danger color scheme
- **Examples**: "Delete", "Remove", "Clear"

### 📏 **Sizes**

#### Small (sm)
- **Height**: 32px
- **Usage**: Table tools, compact areas
- **Padding**: 8px 12px

#### Medium (md)
- **Height**: 40px
- **Usage**: Default size, most common
- **Padding**: 12px 16px

#### Large (lg)
- **Height**: 48px
- **Usage**: Mobile CTAs, important actions
- **Padding**: 16px 24px

### 🎮 **Behavior Rules**

#### CTA Hierarchy
- **One main CTA** per page (unless specified)
- **Visual hierarchy**: Primary > Secondary > Tertiary
- **Strategic placement**: Above the fold, logical flow

#### State Management
- **Disabled state**: Clear visual indication (color + cursor + aria)
- **Loading state**: 
  - Text remains constant or replaced with spinner
  - Button width stays constant to prevent UI shift
  - Disable interaction during loading

#### Focus Management
- **Visible focus-visible** state for keyboard navigation
- **Focus trapping** in modals and dialogs
- **Logical tab order** following visual hierarchy

### 💡 **Implementation Example**
```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button--primary {
  background: var(--color-primary);
  color: var(--color-text-inverted);
}

.button--primary:hover {
  background: var(--color-primary-hover);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

## Inputs and Forms

### 📝 **General Rules**

#### Label Requirements
- **Always include a label** (placeholder is not a label)
- **Proper association**: `for` attribute or `aria-labelledby`
- **Clear and concise**: Describe the input purpose
- **Required indicators**: Show which fields are required

#### Validation and Error Handling
- **Short, useful error messages**
- **Inline validation** when possible
- **Clear error states**: Color + icon + message
- **Accessibility**: ARIA attributes for screen readers

#### Input States
- **Default**: Ready for input
- **Focus**: Highlighted, ready for typing
- **Error**: Validation failed, show error message
- **Disabled**: Not editable, visually distinct
- **Success**: Valid input, positive feedback

### 🔍 **Special Input Types**

#### Long Selectors
- **Search functionality**: Filter options as user types
- **Virtual scrolling**: For large datasets
- **Multi-select**: Clear selection management
- **Keyboard navigation**: Arrow keys, type-ahead

#### File Upload
- **Drag and drop**: Modern upload experience
- **Progress indicators**: Show upload progress
- **File type validation**: Client-side checks
- **Multiple files**: Support batch uploads

### 📋 **Form Layout**

#### Organization
- **Logical grouping**: Related fields together
- **Single column**: Better for mobile and RTL
- **Progressive disclosure**: Show fields as needed
- **Clear flow**: Top to bottom, left to right (RTL aware)

#### Validation Strategy
- **Real-time validation**: Immediate feedback
- **Submit validation**: Final check before submission
- **Error summary**: List all errors at the top
- **Recovery guidance**: Help users fix errors

## Cards

### 🃏 **Card Standards**

#### Structure
- **Standard padding**: Consistent internal spacing
- **Clear surface**: Visual separation from background
- **Subtle hover**: Interactive feedback
- **Proper hierarchy**: Title, content, actions

#### Interactivity
- **Clickable cards**: Entire card should be clickable
- **Visual feedback**: Hover and active states
- **Accessibility**: Proper link/button semantics
- **Keyboard support**: Tab and enter activation

### 🎨 **Card Variants**

#### Basic Card
- **Content**: Title, description, optional image
- **Actions**: Primary and secondary actions
- **Layout**: Flexible content arrangement

#### Media Card
- **Image/Media**: Prominent visual content
- **Overlay**: Text on image with proper contrast
- **Metadata**: Date, author, category information

#### Action Card
- **Primary action**: Clear call-to-action
- **Secondary actions**: Additional options
- **Progress**: Status indicators if applicable

## Modals/Dialogs

### 🪟 **Modal Standards**

#### Focus Management
- **Focus trapping**: Keep focus within modal
- **Initial focus**: First interactive element
- **Restore focus**: Return to trigger element
- **Skip links**: Allow keyboard navigation to content

#### User Control
- **Escape key**: Close modal functionality
- **Close button**: Clear, accessible close option
- **Overlay click**: Close on backdrop click (optional)
- **Prevent closing**: For critical actions

### ⚠️ **Special Modal Types**

#### Confirmation Modals
- **Clear message**: What action will be taken
- **Consequences**: What will happen
- **Actions**: Confirm and cancel options
- **Destructive actions**: Special styling for danger

#### Form Modals
- **Validation**: Proper form validation
- **Saving state**: Show progress during save
- **Error handling**: Clear error messages
- **Success feedback**: Confirmation of completion

## Toast/Notifications

### 🔔 **Notification Standards**

#### Content Guidelines
- **Clear and short messages**: Concise text
- **Appropriate display time**: 3–5s for success, longer for errors
- **No stack traces**: User-friendly error messages
- **Actionable**: Include relevant actions when needed

#### Types and Styling
- **Success**: Green styling, checkmark icon
- **Error**: Red styling, error icon
- **Warning**: Yellow styling, warning icon
- **Info**: Blue styling, info icon

#### Behavior
- **Positioning**: Consistent placement (top-right, bottom-center)
- **Stacking**: Multiple notifications should stack properly
- **Dismissal**: Auto-dismiss and manual close options
- **Accessibility**: Screen reader announcements

## Navigation/Layout

### 🧭 **Navigation Patterns**

#### Responsive Navigation
- **Mobile**: Bottom navigation or hamburger menu
- **Tablet**: Combination of patterns
- **Desktop**: Fixed sidebar or top navigation
- **RTL awareness**: Proper direction handling

#### Breadcrumb Navigation
- **Deep pages**: Show navigation path
- **Clickable**: All levels except current
- **Clear hierarchy**: Visual separation of levels
- **Mobile friendly**: Collapsible on small screens

### 📱 **Layout Standards**

#### Container Structure
- **Consistent padding**: Responsive spacing
- **Max width**: Readable content width (1200–1280px)
- **Centered content**: Proper alignment
- **Responsive grids**: Flexible layouts

#### Header and Footer
- **Sticky header**: For easy navigation access
- **Clear branding**: Logo and site name
- **Search functionality**: When applicable
- **Footer links**: Important pages and legal info

## Tables and Lists

### 📊 **Table Standards**

#### Structure and Behavior
- **Fixed header**: When scrolling is needed
- **Accessible filters**: Keyboard-navigable sorting/filtering
- **Empty states**: Clear messaging for no data
- **Loading states**: Progress indicators during data fetch

#### Responsive Design
- **Horizontal scroll**: For wide tables on mobile
- **Card view**: Alternative layout for small screens
- **Priority columns**: Show most important data first
- **Expandable rows**: For additional information

### 📝 **List Standards**

#### Data Lists
- **Virtualization**: For large datasets
- **Infinite scroll**: With proper loading states
- **Search and filter**: Easy data discovery
- **Batch operations**: Select multiple items

#### Mobile Considerations
- **Card view**: Better touch targets
- **Compact rows**: More data per screen
- **Swipe actions**: Common actions on swipe
- **Pull to refresh**: Modern mobile pattern

## Loading States

### ⏳ **Loading Patterns**

#### Skeleton Loading
- **Content structure**: Match final layout
- **Smooth animations**: Subtle movement
- **Progressive reveal**: Load content in sections
- **Accessibility**: Screen reader announcements

#### Progress Indicators
- **Deterministic**: Show actual progress when possible
- **Indeterminate**: Spinning animation for unknown duration
- **Contextual**: Match the content being loaded
- **Cancellable**: Allow user cancellation when appropriate

## Empty States

### 📭 **Empty State Design**

#### Content Guidelines
- **Clear messaging**: Explain why there's no data
- **Helpful actions**: What user can do next
- **Visual interest**: Appropriate illustrations or icons
- **Consistent styling**: Match overall design

#### Common Scenarios
- **No search results**: Refine search options
- **No data**: First-time user experience
- **Error state**: Recovery options
- **Filtered results**: Clear filters option

## Error States

### 🚨 **Error Handling Standards**

#### User-Friendly Messages
- **Plain language**: Avoid technical jargon
- **Specific causes**: What went wrong
- **Solutions**: How to fix the problem
- **Contact info**: When to ask for help

#### Visual Design
- **Clear indication**: Error colors and icons
- **Proper placement**: Near the related content
- **Recovery options**: Clear next steps
- **Accessibility**: Screen reader friendly

### 🔄 **Recovery Patterns**

#### Inline Errors
- **Field-level**: Specific to input validation
- **Immediate feedback**: Real-time validation
- **Clear instructions**: How to fix
- **Non-blocking**: Allow continued interaction

#### Page-Level Errors
- **Error boundaries**: Catch unexpected errors
- **Retry options**: Try failed actions again
- **Fallback content**: Alternative when possible
- **Error logging**: For debugging purposes

## Implementation Examples

### 🎨 **CSS Component Examples**

#### Button Component
```css
.button {
  /* Base styles */
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Accessibility */
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  /* States */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.button--primary {
  background: var(--color-primary);
  color: var(--color-text-inverted);
  
  &:hover:not(:disabled) {
    background: var(--color-primary-hover);
  }
}
```

#### Card Component
```css
.card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--color-border-strong);
    box-shadow: var(--shadow-md);
  }
  
  &.card--interactive {
    cursor: pointer;
    
    &:active {
      transform: translateY(1px);
    }
  }
}

.card__header {
  margin-bottom: var(--space-4);
}

.card__title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.card__content {
  color: var(--color-text-muted);
  line-height: 1.6;
}
```

### 🔧 **React Component Examples**

#### Accessible Button
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  ...props
}) => {
  const baseClasses = 'button';
  const variantClass = `${baseClasses}--${variant}`;
  const sizeClass = `${baseClasses}--${size}`;
  const classes = [baseClasses, variantClass, sizeClass].join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-disabled={disabled || loading}
      aria-describedby={loading ? 'loading-description' : undefined}
      {...props}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      <span>{children}</span>
      {loading && (
        <span id="loading-description" className="sr-only">
          Loading, please wait
        </span>
      )}
    </button>
  );
};
```

#### Form Input with Validation
```tsx
interface InputProps {
  label: string;
  error?: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  required = false,
  type = 'text',
  value,
  onChange,
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="form-group">
      <label 
        htmlFor={inputId}
        className="form-label"
        aria-required={required}
      >
        {label}
        {required && <span className="required-indicator" aria-label="required">*</span>}
      </label>
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input ${error ? 'form-input--error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={errorId}
      />
      
      {error && (
        <div id={errorId} className="form-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
```
