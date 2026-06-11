/* @ds-bundle: {"format":3,"namespace":"SwiftoDesignSystem_8a726e","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconCircle","sourcePath":"components/core/IconCircle.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"StarRating","sourcePath":"components/feedback/StarRating.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"DashboardTile","sourcePath":"components/product/DashboardTile.jsx"},{"name":"JobCard","sourcePath":"components/product/JobCard.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"d1d970da6e79","components/core/Badge.jsx":"b5bf8204274e","components/core/Card.jsx":"54acc25848ba","components/core/IconCircle.jsx":"0b20ddd9e4b9","components/feedback/Modal.jsx":"79970ca1210b","components/feedback/StarRating.jsx":"9eec61832f40","components/forms/Button.jsx":"05182e38abd2","components/forms/Checkbox.jsx":"1921f88591b4","components/forms/Input.jsx":"ed1f23b08efd","components/forms/Select.jsx":"8136bcdb541f","components/forms/Textarea.jsx":"b6a9de54f3d7","components/product/DashboardTile.jsx":"5d5134d113a9","components/product/JobCard.jsx":"fd5704e18b65","redesign/Browse.jsx":"e7eb9aad03df","redesign/Dashboard.jsx":"062871d806f8","redesign/Landing.jsx":"232b9e6d5471","redesign/Login.jsx":"b914ea100d63","redesign/Nav.jsx":"ed47c73405d3","redesign/app.jsx":"4db2aa48e93c","redesign/data.js":"eff9c9e31fcb","redesign/icons.js":"189242752b95","redesign/tweaks-panel.jsx":"6591467622ed","redesign/ui.jsx":"801d0269d0ba","ui_kits/swifto-marketplace/BrowseScreen.jsx":"b53286aafa33","ui_kits/swifto-marketplace/DashboardScreen.jsx":"8da5f32e95b7","ui_kits/swifto-marketplace/LandingScreen.jsx":"8f7af9711b0d","ui_kits/swifto-marketplace/LoginScreen.jsx":"3bc0a784cd0c","ui_kits/swifto-marketplace/SiteNav.jsx":"1cb1b3dbb3fe","ui_kits/swifto-marketplace/app.jsx":"3af8eceaa609","ui_kits/swifto-marketplace/icons.js":"59f1829135c2"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SwiftoDesignSystem_8a726e = window.SwiftoDesignSystem_8a726e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Swifto Avatar — circular user mark. Shows an image when `src` is given,
 * otherwise the person's initials on a primary/10 disc.
 */
function Avatar({
  name = '',
  src,
  size = 'md',
  style,
  ...rest
}) {
  const sizes = {
    xs: '1.75rem',
    sm: '2.25rem',
    md: '3rem',
    lg: '4rem'
  };
  const fontSizes = {
    xs: '0.7rem',
    sm: '0.8rem',
    md: '1rem',
    lg: '1.25rem'
  };
  const dim = sizes[size] ?? sizes.md;
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  const base = {
    width: dim,
    height: dim,
    flexShrink: 0,
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--primary-10)',
    color: 'var(--swifto-primary)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--weight-semibold)',
    fontSize: fontSizes[size] ?? fontSizes.md,
    ...style
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: base
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials || /*#__PURE__*/React.createElement("svg", {
    width: "60%",
    height: "60%",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  })));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Swifto Badge — a small rounded-full pill for statuses and tags.
 * Tones map to the product: success (Applied), warning (Urgent rebook),
 * neutral, brand, and danger.
 */
function Badge({
  children,
  tone = 'neutral',
  solid = false,
  style,
  ...rest
}) {
  const tones = {
    neutral: {
      bg: 'var(--ink-5)',
      fg: 'var(--text-body)',
      border: 'transparent'
    },
    brand: {
      bg: 'var(--primary-10)',
      fg: 'var(--swifto-primary)',
      border: 'transparent'
    },
    success: {
      bg: 'var(--success-bg)',
      fg: 'var(--success-fg)',
      border: 'var(--success-border)'
    },
    warning: {
      bg: 'var(--warning-bg)',
      fg: 'var(--warning-fg)',
      border: 'transparent'
    },
    danger: {
      bg: 'var(--danger-bg)',
      fg: 'var(--danger-fg)',
      border: 'var(--danger-border)'
    }
  };
  const t = tones[tone] || tones.neutral;
  const composed = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.2rem 0.625rem',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--weight-semibold)',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
    background: solid ? t.fg : t.bg,
    color: solid ? '#fff' : t.fg,
    border: solid ? '1px solid transparent' : `1px solid ${t.border}`,
    ...style
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: composed
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Swifto Card — white surface, hairline ink border, soft shadow, rounded-2xl.
 * Set `interactive` for the signature hover lift (scale + raise + blue border).
 */
function Card({
  children,
  interactive = false,
  padding = 'lg',
  as = 'div',
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const El = as;
  const pads = {
    none: '0',
    sm: '1rem',
    md: '1.25rem',
    lg: '1.5rem',
    xl: '2rem'
  };
  const base = {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-card)',
    borderRadius: 'var(--radius-2xl)',
    boxShadow: 'var(--shadow-sm)',
    padding: pads[padding] ?? pads.lg,
    transition: 'transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard)',
    ...(interactive && hover ? {
      transform: 'translateY(var(--hover-lift)) scale(var(--hover-scale))',
      boxShadow: 'var(--shadow-xl)',
      borderColor: 'var(--primary-50)',
      cursor: 'pointer'
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement(El, _extends({
    style: base,
    onMouseEnter: interactive ? () => setHover(true) : undefined,
    onMouseLeave: interactive ? () => setHover(false) : undefined
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconCircle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Swifto IconCircle — the recurring "trust" motif: a soft primary/10 disc
 * holding a brand-stroke icon. Pass an SVG/element as `children`.
 */
function IconCircle({
  children,
  size = 'md',
  tone = 'brand',
  style,
  ...rest
}) {
  const sizes = {
    sm: '2.5rem',
    md: '3rem',
    lg: '5rem'
  };
  const tones = {
    brand: {
      bg: 'var(--primary-10)',
      fg: 'var(--swifto-primary)'
    },
    onBrand: {
      bg: 'var(--on-primary-20)',
      fg: 'var(--on-primary)'
    },
    ink: {
      bg: 'var(--ink-5)',
      fg: 'var(--swifto-ink)'
    }
  };
  const t = tones[tone] || tones.brand;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: sizes[size] ?? sizes.md,
      height: sizes[size] ?? sizes.md,
      flexShrink: 0,
      borderRadius: 'var(--radius-full)',
      background: t.bg,
      color: t.fg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconCircle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconCircle.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
/**
 * Swifto Modal — centered dialog over a blurred dark scrim. On small screens
 * it becomes a bottom sheet (rounded top corners). Matches the apply/withdraw
 * modals.
 */
function Modal({
  open = true,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'md'
}) {
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && onClose) onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const widths = {
    sm: '28rem',
    md: '36rem',
    lg: '42rem'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: widths[width] ?? widths.md,
      maxHeight: '90vh',
      overflowY: 'auto',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-2xl)',
      padding: '1.75rem'
    }
  }, (title || onClose) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '1rem',
      marginBottom: subtitle ? '1.25rem' : '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--text-strong)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-base)',
      color: 'var(--text-muted)',
      marginTop: '0.25rem'
    }
  }, subtitle)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Close",
    style: {
      width: '2.5rem',
      height: '2.5rem',
      flexShrink: 0,
      borderRadius: 'var(--radius-full)',
      border: 'none',
      background: 'var(--ink-5)',
      color: 'var(--text-strong)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 18L18 6M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", null, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1.5rem',
      paddingTop: '1.25rem',
      borderTop: '1px solid var(--border-divider)',
      display: 'flex',
      gap: '0.75rem'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StarRating.jsx
try { (() => {
/**
 * Swifto StarRating. Read-only display by default; pass `onChange` to make it
 * an interactive input. Stars fill brand-blue; empties are ink/20.
 */
function StarRating({
  value = 0,
  max = 5,
  onChange,
  size = 'md',
  showValue = false,
  reviewCount,
  style
}) {
  const [hover, setHover] = React.useState(0);
  const interactive = typeof onChange === 'function';
  const px = {
    sm: 20,
    md: 32,
    lg: 40
  }[size] ?? 32;
  const shown = interactive && hover ? hover : value;
  const Star = ({
    filled
  }) => /*#__PURE__*/React.createElement("svg", {
    width: px,
    height: px,
    viewBox: "0 0 24 24",
    fill: filled ? 'var(--swifto-primary)' : 'var(--ink-20)',
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      gap: '0.25rem',
      alignItems: 'center',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: interactive ? '0.25rem' : '0.125rem'
    },
    role: interactive ? 'group' : 'img',
    "aria-label": `${value} out of ${max}`
  }, Array.from({
    length: max
  }, (_, i) => i + 1).map(star => interactive ? /*#__PURE__*/React.createElement("button", {
    key: star,
    type: "button",
    onClick: () => onChange(star),
    onMouseEnter: () => setHover(star),
    onMouseLeave: () => setHover(0),
    style: {
      padding: '0.25rem',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      borderRadius: 'var(--radius-lg)',
      lineHeight: 0
    },
    "aria-label": `${star} star${star === 1 ? '' : 's'}`
  }, /*#__PURE__*/React.createElement(Star, {
    filled: star <= shown
  })) : /*#__PURE__*/React.createElement(Star, {
    key: star,
    filled: star <= Math.round(shown)
  }))), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, reviewCount === 0 ? 'No reviews yet' : `${Number(value).toFixed(1)}${reviewCount != null ? ` · ${reviewCount} review${reviewCount === 1 ? '' : 's'}` : ''}`));
}
Object.assign(__ds_scope, { StarRating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StarRating.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Swifto Button — the primary call to action across the product.
 * Solid brand-blue by default; darkens to `secondary` on hover.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const sizes = {
    sm: {
      height: 'var(--control-h-sm)',
      padding: '0 1.25rem',
      fontSize: 'var(--text-sm)'
    },
    md: {
      height: 'var(--control-h)',
      padding: '0 2rem',
      fontSize: 'var(--text-base)'
    },
    lg: {
      height: '3.5rem',
      padding: '0 2.25rem',
      fontSize: 'var(--text-lg)'
    }
  };
  const palettes = {
    primary: {
      base: {
        background: 'var(--btn-primary-bg)',
        color: 'var(--on-primary)',
        border: '1px solid transparent'
      },
      hover: {
        background: 'var(--btn-primary-bg-hover)'
      }
    },
    white: {
      base: {
        background: 'var(--swifto-white)',
        color: 'var(--swifto-primary)',
        border: '1px solid transparent'
      },
      hover: {
        background: 'var(--swifto-canvas)'
      }
    },
    outlineWhite: {
      base: {
        background: 'transparent',
        color: 'var(--on-primary)',
        border: '2px solid var(--on-primary)'
      },
      hover: {
        background: 'var(--swifto-white)',
        color: 'var(--swifto-primary)'
      }
    },
    outline: {
      base: {
        background: 'transparent',
        color: 'var(--text-strong)',
        border: '1px solid var(--border-input)'
      },
      hover: {
        background: 'var(--ink-5)',
        borderColor: 'var(--swifto-primary)',
        color: 'var(--swifto-primary)'
      }
    },
    ghost: {
      base: {
        background: 'transparent',
        color: 'var(--swifto-primary)',
        border: '1px solid transparent'
      },
      hover: {
        background: 'var(--primary-10)'
      }
    }
  };
  const p = palettes[variant] || palettes.primary;
  const composed = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: fullWidth ? '100%' : 'auto',
    borderRadius: 'var(--radius-xl)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--weight-medium)',
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)',
    transform: active && !disabled ? 'scale(0.98)' : 'none',
    ...sizes[size],
    ...p.base,
    ...(hover && !disabled ? p.hover : null),
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: composed
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/**
 * Swifto checkbox. A custom-drawn box (brand-blue when checked) with an
 * adjacent label, matching the "Flexible (no specific deadline)" control.
 */
function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  id,
  style
}) {
  const fieldId = id || (label ? `cb-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const box = {
    width: '1.25rem',
    height: '1.25rem',
    flexShrink: 0,
    borderRadius: '0.375rem',
    border: checked ? '1px solid var(--swifto-primary)' : '1px solid var(--border-input)',
    background: checked ? 'var(--swifto-primary)' : 'var(--surface-card)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)'
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    id: fieldId,
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked, e),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: box,
    "aria-hidden": "true"
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--on-primary)",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      color: 'var(--text-strong)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Swifto text field. Pairs an optional label + helper/error text with a
 * 48px rounded input that shows a 2px brand focus ring.
 */
function Input({
  label,
  helper,
  error,
  id,
  type = 'text',
  prefix,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const field = {
    width: '100%',
    height: 'var(--control-h)',
    padding: prefix ? '0 1rem 0 1.75rem' : '0 1rem',
    borderRadius: 'var(--radius-xl)',
    border: `1px solid ${error ? 'var(--danger-fg)' : 'var(--border-input)'}`,
    background: 'var(--surface-card)',
    color: 'var(--text-strong)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-base)',
    outline: 'none',
    boxShadow: focus ? `0 0 0 var(--ring-width) var(--focus-ring)` : 'none',
    borderColor: focus ? 'transparent' : error ? 'var(--danger-fg)' : 'var(--border-input)',
    transition: 'box-shadow var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
    ...style
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-muted)',
      fontWeight: 'var(--weight-medium)',
      pointerEvents: 'none'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: type,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: field
  }, rest))), (helper || error) && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--danger-fg)' : 'var(--text-muted)',
      margin: 0
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Swifto select. A native <select> styled to match Input, with a brand
 * chevron. Options are passed as { value, label } objects or children.
 */
function Select({
  label,
  helper,
  options,
  id,
  value,
  onChange,
  placeholder,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || (label ? `sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const field = {
    width: '100%',
    height: 'var(--control-h)',
    padding: '0 2.75rem 0 1rem',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border-input)',
    background: 'var(--surface-card)',
    color: 'var(--text-strong)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-base)',
    appearance: 'none',
    WebkitAppearance: 'none',
    outline: 'none',
    cursor: 'pointer',
    boxShadow: focus ? `0 0 0 var(--ring-width) var(--focus-ring)` : 'none',
    borderColor: focus ? 'transparent' : 'var(--border-input)',
    transition: 'box-shadow var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
    ...style
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId,
    value: value,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: field
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), (options || []).map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-muted)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: 'absolute',
      right: '0.875rem',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }))), helper && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      margin: 0
    }
  }, helper));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Swifto multi-line text field. Same chrome as Input, taller and non-resizing
 * by default (matches the application-form textareas).
 */
function Textarea({
  label,
  helper,
  error,
  id,
  rows = 4,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || (label ? `ta-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const field = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-xl)',
    border: `1px solid ${error ? 'var(--danger-fg)' : 'var(--border-input)'}`,
    background: 'var(--surface-card)',
    color: 'var(--text-strong)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-base)',
    lineHeight: 'var(--leading-normal)',
    resize: 'none',
    outline: 'none',
    boxShadow: focus ? `0 0 0 var(--ring-width) var(--focus-ring)` : 'none',
    borderColor: focus ? 'transparent' : error ? 'var(--danger-fg)' : 'var(--border-input)',
    transition: 'box-shadow var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
    ...style
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    id: fieldId,
    rows: rows,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: field
  }, rest)), (helper || error) && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--danger-fg)' : 'var(--text-muted)',
      margin: 0
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/product/DashboardTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Swifto DashboardTile — the square, centered navigation tile used on the
 * student/lister dashboards. Large icon disc over a title + caption.
 */
function DashboardTile({
  icon,
  title,
  caption,
  highlight,
  onClick,
  square = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, _extends({
    interactive: !!onClick,
    onClick: onClick,
    style: {
      aspectRatio: square ? '1 / 1' : 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      textAlign: 'center',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.IconCircle, {
    size: "lg"
  }, icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)'
    }
  }, title), highlight && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--swifto-primary)',
      marginTop: '0.25rem'
    }
  }, highlight), caption && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      marginTop: '0.25rem'
    }
  }, caption)));
}
Object.assign(__ds_scope, { DashboardTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/DashboardTile.jsx", error: String((e && e.message) || e) }); }

// components/product/JobCard.jsx
try { (() => {
/**
 * Swifto JobCard — the emblematic job listing tile. Title + detail, pay in
 * brand-blue, and a map-pin location row. Lifts on hover like every Card.
 */
function JobCard({
  title,
  detail,
  pay,
  location,
  urgent = false,
  applied = false,
  onClick,
  actions,
  style
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    interactive: !!onClick,
    onClick: onClick,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      minHeight: '7.5rem',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)'
    }
  }, title), urgent && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "warning"
  }, "Urgent rebook"), applied && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "success"
  }, "Applied")), detail && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      marginTop: '0.25rem'
    }
  }, detail)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--swifto-primary)',
      whiteSpace: 'nowrap'
    }
  }, pay)), location && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
  })), /*#__PURE__*/React.createElement("span", null, location)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      justifyContent: 'flex-end',
      paddingTop: '0.75rem',
      borderTop: '1px solid var(--border-divider)'
    }
  }, actions));
}
Object.assign(__ds_scope, { JobCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/JobCard.jsx", error: String((e && e.message) || e) }); }

// redesign/Browse.jsx
try { (() => {
/* Swifto redesign — Browse + Apply modal (window.Browse) */
function Browse({
  go
}) {
  const {
    Button,
    Card,
    Badge,
    IconDisc,
    Field,
    Area,
    Photo
  } = window.UI;
  const {
    Icon,
    Stars
  } = window.SW;
  const D = window.DATA;
  const wrap = {
    maxWidth: 1160,
    margin: '0 auto',
    padding: '0 24px'
  };
  const [cat, setCat] = React.useState('All');
  const [q, setQ] = React.useState('');
  const [applied, setApplied] = React.useState(new Set());
  const [modal, setModal] = React.useState(null);
  const [form, setForm] = React.useState({
    name: '',
    exp: '',
    avail: ''
  });
  const list = D.jobs.filter(j => (cat === 'All' || j.cat === cat) && (!q || (j.name + j.area + j.cat).toLowerCase().includes(q.toLowerCase())));
  const earn = p => (p * 0.95).toFixed(2);
  const valid = form.name.trim() && form.exp.trim() && form.avail.trim();
  const submit = () => {
    setApplied(s => new Set(s).add(modal.id));
    setModal(null);
    setForm({
      name: '',
      exp: '',
      avail: ''
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      paddingTop: 48,
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    style: {
      marginBottom: 12
    }
  }, D.jobs.length, " open jobs in Auckland"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'clamp(32px, 4.4vw, 50px)'
    }
  }, "Find work that fits", /*#__PURE__*/React.createElement("br", null), "around your week."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--ink-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 19
  })), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search jobs, suburbs, categories\u2026",
    style: {
      width: '100%',
      height: 52,
      padding: '0 16px 0 46px',
      borderRadius: 'var(--r-btn)',
      border: '1.5px solid var(--line)',
      background: 'var(--card)',
      fontFamily: 'var(--font-body)',
      fontSize: 15.5,
      color: 'var(--ink)',
      outline: 'none'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: 'flex',
      gap: 9,
      flexWrap: 'wrap'
    }
  }, D.cats.map(c => {
    const on = cat === c;
    return /*#__PURE__*/React.createElement("button", {
      key: c,
      onClick: () => setCat(c),
      style: {
        padding: '8px 16px',
        borderRadius: 'var(--r-pill)',
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'var(--font-body)',
        border: `1.5px solid ${on ? 'transparent' : 'var(--line)'}`,
        background: on ? 'var(--ink)' : 'var(--card)',
        color: on ? '#fff' : 'var(--ink-2)',
        transition: 'all 0.18s var(--ease)'
      }
    }, c);
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      padding: '24px 24px 84px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--ink-3)',
      marginBottom: 16
    }
  }, list.length, " job", list.length !== 1 ? 's' : ''), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 18
    }
  }, list.map(j => {
    const isApplied = applied.has(j.id);
    return /*#__PURE__*/React.createElement(Card, {
      key: j.id,
      pad: 0,
      hover: true,
      style: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Photo, {
      src: j.photo,
      height: 142,
      radius: "0",
      alt: j.name,
      tint: false
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 12,
        left: 12
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      style: {
        background: 'rgba(255,255,255,0.92)',
        color: 'var(--ink)',
        backdropFilter: 'blur(4px)'
      }
    }, j.cat)), j.urgent && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 12,
        right: 12
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "warning",
      style: {
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(4px)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bolt",
      size: 12
    }), " Urgent"))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 17.5,
        fontWeight: 700
      }
    }, j.name), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13.5,
        color: 'var(--ink-3)',
        marginTop: 3
      }
    }, j.detail)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        color: 'var(--accent)',
        fontSize: 22
      }
    }, "$", j.pay)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        fontSize: 13,
        color: 'var(--ink-2)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 14
    }), " ", j.area), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 14
    }), " ", j.dur)), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: 'var(--ink-2)',
        background: 'var(--success-soft)',
        color: 'var(--success)',
        padding: '7px 10px',
        borderRadius: 'var(--r-sm)',
        fontWeight: 600
      }
    }, "You'll earn $", earn(j.pay), " after fees"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        paddingTop: 4
      }
    }, isApplied ? /*#__PURE__*/React.createElement(Button, {
      full: true,
      variant: "outline",
      disabled: true,
      style: {
        color: 'var(--success)',
        borderColor: 'color-mix(in srgb, var(--success) 40%, transparent)'
      },
      icon: "check"
    }, "Applied") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      full: true,
      size: "sm",
      onClick: () => setApplied(s => new Set(s).add(j.id))
    }, "Quick apply"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outline",
      onClick: () => setModal(j)
    }, "Details")))));
  }))), modal && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setModal(null),
    style: {
      position: 'absolute',
      inset: 0,
      background: 'color-mix(in srgb, var(--ink) 55%, transparent)',
      backdropFilter: 'blur(6px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 540,
      maxHeight: '92vh',
      overflowY: 'auto',
      background: 'var(--card)',
      borderRadius: 'var(--r-lg)',
      boxShadow: 'var(--shadow-pop)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: modal.photo,
    height: 150,
    radius: "0",
    alt: modal.name
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setModal(null),
    "aria-label": "Close",
    style: {
      position: 'absolute',
      top: 14,
      right: 14,
      width: 38,
      height: 38,
      borderRadius: '50%',
      border: 'none',
      background: 'rgba(255,255,255,0.95)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 14,
      left: 18,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    style: {
      background: 'rgba(255,255,255,0.92)',
      color: 'var(--ink)'
    }
  }, modal.cat), /*#__PURE__*/React.createElement("h2", {
    style: {
      color: '#fff',
      fontSize: 26,
      marginTop: 8
    }
  }, modal.name))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 10
    }
  }, [['Location', modal.area, 'map-pin'], ['Duration', modal.dur, 'clock'], ['When', modal.when.split(' · ')[0], 'calendar']].map(([l, v, ic]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      background: 'var(--paper)',
      borderRadius: 'var(--r-md)',
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 17
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11.5,
      color: 'var(--ink-3)',
      marginTop: 6
    }
  }, l), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      marginTop: 1
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'var(--accent-soft)',
      borderRadius: 'var(--r-md)',
      padding: '14px 18px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--ink-2)'
    }
  }, "You'll earn after fees"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 24,
      color: 'var(--accent-deep)'
    }
  }, "$", earn(modal.pay))), /*#__PURE__*/React.createElement(Field, {
    label: "Your name",
    value: form.name,
    onChange: e => setForm({
      ...form,
      name: e.target.value
    }),
    placeholder: "Jordan Williams"
  }), /*#__PURE__*/React.createElement(Area, {
    label: "Relevant experience",
    rows: 3,
    value: form.exp,
    onChange: e => setForm({
      ...form,
      exp: e.target.value
    }),
    placeholder: "Tell them why you're a good fit\u2026"
  }), /*#__PURE__*/React.createElement(Area, {
    label: "Your availability",
    rows: 2,
    value: form.avail,
    onChange: e => setForm({
      ...form,
      avail: e.target.value
    }),
    placeholder: `Confirm you're free ${modal.when}`
  }), /*#__PURE__*/React.createElement(Button, {
    full: true,
    size: "lg",
    disabled: !valid,
    onClick: submit,
    style: !valid ? {
      opacity: 0.5,
      cursor: 'not-allowed'
    } : null
  }, valid ? 'Send application' : 'Fill in all fields'), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--ink-3)',
      textAlign: 'center'
    }
  }, "Payment is held safely and released only when the job is confirmed complete.")))));
}
window.Browse = Browse;
})(); } catch (e) { __ds_ns.__errors.push({ path: "redesign/Browse.jsx", error: String((e && e.message) || e) }); }

// redesign/Dashboard.jsx
try { (() => {
/* Swifto redesign — Student dashboard (window.Dashboard) */
function Dashboard({
  go
}) {
  const {
    Button,
    Card,
    Badge,
    IconDisc,
    Photo
  } = window.UI;
  const {
    Icon,
    Stars
  } = window.SW;
  const D = window.DATA;
  const wrap = {
    maxWidth: 1160,
    margin: '0 auto',
    padding: '0 24px'
  };
  const stats = [{
    icon: 'briefcase',
    tone: 'brand',
    label: 'Active jobs',
    value: '3',
    sub: '2 awaiting confirmation'
  }, {
    icon: 'check-circle',
    tone: 'success',
    label: 'Completed',
    value: '27',
    sub: 'all-time'
  }, {
    icon: 'star',
    tone: 'accent',
    label: 'Rating',
    value: '4.9',
    sub: 'from 23 reviews'
  }];
  const active = [{
    ...D.jobs[0],
    status: 'In progress',
    tone: 'brand'
  }, {
    ...D.jobs[2],
    status: 'Awaiting confirm',
    tone: 'warning'
  }, {
    ...D.jobs[4],
    status: 'Scheduled',
    tone: 'neutral'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: '40px 24px 84px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 54,
      height: 54,
      borderRadius: '50%',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: D.photos.avatar1,
    radius: "50%",
    tint: false,
    style: {
      height: '100%'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--ink-3)'
    }
  }, "Welcome back,"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 28
    }
  }, "Mia Tipene"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 2fr',
      gap: 18,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Card, {
    pad: 0,
    style: {
      overflow: 'hidden',
      background: 'var(--hero-band)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 26,
      color: '#fff',
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(IconDisc, {
    name: "wallet",
    size: 40,
    style: {
      background: 'rgba(255,255,255,0.18)',
      color: '#fff'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'rgba(255,255,255,0.85)',
      fontWeight: 600
    }
  }, "Available balance")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 46,
      marginTop: 16,
      color: '#fff'
    }
  }, "$184.50"), /*#__PURE__*/React.createElement(Button, {
    variant: "white",
    full: true,
    style: {
      marginTop: 18
    },
    icon: "arrow-up-right"
  }, "Withdraw earnings")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: '50%',
      background: 'color-mix(in srgb, var(--accent) 45%, transparent)',
      filter: 'blur(36px)',
      right: -60,
      bottom: -70
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 18
    }
  }, stats.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.label,
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(IconDisc, {
    name: s.icon,
    tone: s.tone
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 34
    }
  }, s.value), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      marginTop: 2
    }
  }, s.label), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-3)',
      marginTop: 2
    }
  }, s.sub)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1.1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 20
    }
  }, "Active jobs"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    onClick: () => go('browse'),
    iconRight: "arrow-right"
  }, "Find more")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, active.map(j => /*#__PURE__*/React.createElement("div", {
    key: j.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: 12,
      borderRadius: 'var(--r-md)',
      border: '1px solid var(--line-card)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 'var(--r-sm)',
      overflow: 'hidden',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: j.photo,
    radius: "0",
    tint: false,
    style: {
      height: '100%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: 15.5
    }
  }, j.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--ink-3)',
      marginTop: 1
    }
  }, j.area, " \xB7 ", j.when.split(' · ')[0])), /*#__PURE__*/React.createElement(Badge, {
    tone: j.tone
  }, j.status), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      color: 'var(--accent)',
      fontSize: 18
    }
  }, "$", j.pay))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'var(--accent-soft)',
      border: '1px solid color-mix(in srgb, var(--accent) 22%, transparent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(IconDisc, {
    name: "trophy",
    tone: "accent",
    size: 48,
    style: {
      background: '#fff'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 800,
      fontSize: 16,
      color: 'var(--accent-deep)'
    }
  }, "Rising star"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--ink-2)',
      marginTop: 1
    }
  }, "3 more jobs to your next badge"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 99,
      background: 'rgba(255,255,255,0.6)',
      marginTop: 16,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '72%',
      height: '100%',
      background: 'var(--accent)',
      borderRadius: 99
    }
  }))), [['user', 'Edit profile'], ['wallet', 'Payment & payouts'], ['check-circle', 'Completed jobs'], ['trophy', 'Achievements']].map(([ic, label]) => /*#__PURE__*/React.createElement(Card, {
    key: label,
    hover: true,
    onClick: () => {},
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement(IconDisc, {
    name: ic,
    tone: "brand",
    size: 42
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 15
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      color: 'var(--ink-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 18
  })))))));
}
window.Dashboard = Dashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "redesign/Dashboard.jsx", error: String((e && e.message) || e) }); }

// redesign/Landing.jsx
try { (() => {
/* Swifto redesign — Landing (window.Landing) */
function Landing({
  go
}) {
  const {
    Button,
    Card,
    Badge,
    IconDisc,
    Photo
  } = window.UI;
  const {
    Icon,
    Stars
  } = window.SW;
  const D = window.DATA;
  const wrap = {
    maxWidth: 1160,
    margin: '0 auto',
    padding: '0 24px'
  };
  const trust = [{
    icon: 'shield-check',
    title: 'Verified students',
    body: 'Every student is ID-checked before they can apply.'
  }, {
    icon: 'lock',
    title: 'Money held safely',
    body: 'We hold payment and release it only when you confirm.'
  }, {
    icon: 'heart',
    title: 'Real accountability',
    body: 'Honest ratings and reviews on both sides, every time.'
  }];
  const steps = [{
    n: '01',
    icon: 'plus',
    title: 'Post your task',
    body: 'Tell us what you need and what it pays. Takes about a minute.'
  }, {
    n: '02',
    icon: 'users',
    title: 'Pick a student',
    body: 'Browse verified students nearby and choose who feels right.'
  }, {
    n: '03',
    icon: 'check-circle',
    title: 'Confirm & pay',
    body: 'Approve the finished work and payment releases automatically.'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: 56,
      alignItems: 'center',
      padding: '72px 24px 84px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 14
  }), " Made for students in Aotearoa"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'clamp(40px, 5.4vw, 66px)',
      lineHeight: 1.02
    }
  }, "A little help today,", /*#__PURE__*/React.createElement("br", null), "a lot less stress", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "this week.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--ink-2)',
      maxWidth: 460,
      marginTop: 22
    }
  }, "Swifto connects everyday tasks with verified local students. Post a job in minutes, pay securely, and confirm when it's done."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 30,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go('login'),
    iconRight: "arrow-right"
  }, "Post a job"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "outline",
    onClick: () => go('browse')
  }, "Find work")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginTop: 34
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, [D.photos.avatar1, D.photos.avatar2, D.photos.avatar3, D.photos.avatar4].map((a, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      overflow: 'hidden',
      border: '2.5px solid var(--paper)',
      marginLeft: i ? -12 : 0,
      background: 'var(--brand-soft)'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: a,
    radius: "50%",
    tint: false,
    style: {
      height: '100%'
    }
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Stars, {
    value: 5,
    size: 15
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: 'var(--ink-2)',
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--ink)'
    }
  }, "2,400+ jobs"), " done across Auckland")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: D.photos.hero,
    height: 460,
    radius: "var(--r-xl)",
    alt: "Students helping out",
    style: {
      boxShadow: 'var(--shadow-pop)'
    }
  }), /*#__PURE__*/React.createElement(Card, {
    pad: 16,
    style: {
      position: 'absolute',
      left: -26,
      bottom: 40,
      width: 246,
      boxShadow: 'var(--shadow-pop)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: 15
    }
  }, "Lawn mowing"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-3)',
      marginTop: 2
    }
  }, "Ponsonby \xB7 2 hrs")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      color: 'var(--accent)',
      fontSize: 20
    }
  }, "$45")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
      paddingTop: 12,
      borderTop: '1px solid var(--line-card)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: '50%',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: D.photos.avatar2,
    radius: "50%",
    tint: false,
    style: {
      height: '100%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--ink-2)'
    }
  }, "Mia applied \xB7 ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--success)'
    }
  }, "verified")))), /*#__PURE__*/React.createElement(Card, {
    pad: 14,
    style: {
      position: 'absolute',
      right: -18,
      top: 30,
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      boxShadow: 'var(--shadow-pop)'
    }
  }, /*#__PURE__*/React.createElement(IconDisc, {
    name: "wallet",
    tone: "success",
    size: 40
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11.5,
      color: 'var(--ink-3)',
      fontWeight: 600
    }
  }, "Paid out this week"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 18
    }
  }, "$184.50")))))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 18
    }
  }, trust.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.title,
    hover: true,
    style: {
      display: 'flex',
      gap: 15,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(IconDisc, {
    name: t.icon,
    tone: "brand"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 17,
      fontWeight: 700
    }
  }, t.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--ink-2)',
      marginTop: 5,
      lineHeight: 1.5
    }
  }, t.body)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      padding: '72px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "brand",
    style: {
      marginBottom: 14
    }
  }, "How it works"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(30px, 4vw, 44px)'
    }
  }, "Sorted in three simple steps")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement(Card, {
    key: s.n,
    pad: 28,
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 16,
      right: 20,
      fontFamily: 'var(--font-display)',
      fontSize: 52,
      fontWeight: 800,
      color: 'color-mix(in srgb, var(--brand) 9%, transparent)',
      lineHeight: 1
    }
  }, s.n), /*#__PURE__*/React.createElement(IconDisc, {
    name: s.icon,
    tone: i === 2 ? 'success' : 'accent',
    size: 56
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 21,
      fontWeight: 700,
      marginTop: 18
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--ink-2)',
      marginTop: 8,
      lineHeight: 1.6
    }
  }, s.body))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--hero-band)',
      color: 'var(--on-band)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: 56,
      alignItems: 'center',
      padding: '72px 24px'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: D.photos.community,
    height: 380,
    radius: "var(--r-xl)",
    alt: "Local community",
    style: {
      boxShadow: 'var(--shadow-pop)'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    style: {
      marginBottom: 18,
      background: 'rgba(255,255,255,0.16)',
      color: '#fff'
    }
  }, "Why we built Swifto"), /*#__PURE__*/React.createElement("h2", {
    style: {
      color: '#fff',
      fontSize: 'clamp(28px, 3.6vw, 40px)',
      lineHeight: 1.1
    }
  }, "We know what carrying money stress feels like."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.7,
      color: 'rgba(255,255,255,0.88)',
      marginTop: 18,
      maxWidth: 520
    }
  }, "Swifto was built from lived experience \u2014 so students can earn in a way that fits around study, and people who need a hand can find trusted, friendly help nearby. A way to make the week feel a little lighter."), /*#__PURE__*/React.createElement(Button, {
    variant: "white",
    size: "lg",
    style: {
      marginTop: 26
    },
    onClick: () => go('mission'),
    iconRight: "arrow-right"
  }, "Read our mission")))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      padding: '72px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 28,
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    style: {
      marginBottom: 12
    }
  }, "Open now"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(28px, 3.6vw, 40px)'
    }
  }, "Jobs near you today")), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => go('browse'),
    iconRight: "arrow-right"
  }, "See all jobs")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 18
    }
  }, D.jobs.slice(0, 3).map(j => /*#__PURE__*/React.createElement(Card, {
    key: j.id,
    hover: true,
    pad: 0,
    onClick: () => go('browse'),
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: j.photo,
    height: 150,
    radius: "0",
    alt: j.name,
    tint: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 17,
      fontWeight: 700
    }
  }, j.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      color: 'var(--accent)',
      fontSize: 19
    }
  }, "$", j.pay)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: 'var(--ink-3)',
      marginTop: 4,
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 14
  }), " ", j.area, " \xB7 ", j.dur)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      paddingBottom: 84
    }
  }, /*#__PURE__*/React.createElement(Card, {
    pad: 0,
    style: {
      background: 'var(--ink)',
      overflow: 'hidden',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '56px 48px',
      textAlign: 'center',
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: '#fff',
      fontSize: 'clamp(28px, 3.6vw, 42px)'
    }
  }, "Get something off your plate today."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,0.78)',
      fontSize: 17,
      marginTop: 14,
      maxWidth: 480,
      margin: '14px auto 0'
    }
  }, "Join thousands of locals and students already helping each other out."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      marginTop: 30,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go('login')
  }, "Post a job"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "outlineWhite",
    onClick: () => go('browse')
  }, "Find work"))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      width: 320,
      height: 320,
      borderRadius: '50%',
      background: 'color-mix(in srgb, var(--accent) 40%, transparent)',
      filter: 'blur(40px)',
      right: -80,
      top: -120
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      width: 280,
      height: 280,
      borderRadius: '50%',
      background: 'color-mix(in srgb, var(--brand) 55%, transparent)',
      filter: 'blur(50px)',
      left: -90,
      bottom: -130
    }
  }))), /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: '36px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: '-0.03em'
    }
  }, "Swifto"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--accent)',
      marginLeft: 2
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      fontSize: 14,
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Safety"), /*#__PURE__*/React.createElement("span", null, "Mission"), /*#__PURE__*/React.createElement("span", null, "Contact"), /*#__PURE__*/React.createElement("span", null, "Terms")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: 'var(--ink-3)'
    }
  }, "\xA9 Swifto \xB7 Auckland, NZ"))));
}
window.Landing = Landing;
})(); } catch (e) { __ds_ns.__errors.push({ path: "redesign/Landing.jsx", error: String((e && e.message) || e) }); }

// redesign/Login.jsx
try { (() => {
/* Swifto redesign — Login / sign up (window.Login) + Mission (window.Mission) */
function Login({
  onLogin
}) {
  const {
    Button,
    Field,
    Photo,
    Badge
  } = window.UI;
  const {
    Icon,
    Stars
  } = window.SW;
  const D = window.DATA;
  const [mode, setMode] = React.useState('login');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1160,
      margin: '0 auto',
      padding: '40px 24px 72px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 40,
      alignItems: 'center',
      minHeight: '74vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 400,
      width: '100%',
      justifySelf: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      fontWeight: 800,
      letterSpacing: '-0.03em'
    }
  }, "Swifto"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: 'var(--accent)',
      marginLeft: 3
    }
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 34
    }
  }, mode === 'login' ? 'Welcome back' : 'Create your account'), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: 'var(--ink-2)',
      marginTop: 8
    }
  }, mode === 'login' ? 'Log in to pick up where you left off.' : 'Join Swifto in under a minute — it\u2019s free.'), mode === 'signup' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 22
    }
  }, [['student', 'I want to earn'], ['lister', 'I need a hand']].map(([r, l], i) => /*#__PURE__*/React.createElement("button", {
    key: r,
    onClick: () => setMode('signup-' + r),
    style: {
      flex: 1,
      padding: '14px',
      borderRadius: 'var(--r-md)',
      cursor: 'pointer',
      border: '1.5px solid var(--line)',
      background: 'var(--card)',
      fontFamily: 'var(--font-body)',
      fontSize: 14.5,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, l))), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onLogin('student');
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      marginTop: 24
    }
  }, mode === 'signup' && /*#__PURE__*/React.createElement(Field, {
    label: "Full name",
    placeholder: "Jordan Williams",
    defaultValue: ""
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Email address",
    type: "email",
    defaultValue: "mia@student.ac.nz"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Password",
    type: "password",
    defaultValue: "password"
  }), /*#__PURE__*/React.createElement(Button, {
    full: true,
    size: "lg",
    type: "submit"
  }, mode === 'login' ? 'Log in' : 'Create account')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14.5,
      color: 'var(--ink-2)',
      marginTop: 18,
      textAlign: 'center'
    }
  }, mode === 'login' ? "New to Swifto? " : 'Already have an account? ', /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode(mode === 'login' ? 'signup' : 'login'),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--accent-deep)',
      fontWeight: 700,
      fontFamily: 'var(--font-body)',
      fontSize: 14.5
    }
  }, mode === 'login' ? 'Create an account' : 'Log in'))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: D.photos.heroSecond,
    height: 480,
    radius: "var(--r-xl)",
    alt: "Students",
    style: {
      boxShadow: 'var(--shadow-pop)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 'var(--r-xl)',
      background: 'linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--ink) 72%, transparent))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 28,
      left: 28,
      right: 28,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement(Stars, {
    value: 5,
    size: 18
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      fontWeight: 700,
      marginTop: 10,
      lineHeight: 1.3
    }
  }, "\"Swifto helped me cover rent without dropping a single class.\""), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.85)',
      marginTop: 8
    }
  }, "\u2014 Aroha, second-year student"))));
}
window.Login = Login;
function Mission({
  go
}) {
  const {
    Button,
    Card,
    Badge,
    IconDisc,
    Photo
  } = window.UI;
  const wrap = {
    maxWidth: 880,
    margin: '0 auto',
    padding: '0 24px'
  };
  const beliefs = ['People should be able to ask for help without feeling awkward or unsafe.', 'Students deserve a way to earn that doesn\u2019t punish them for being busy.', 'Small jobs can create real stability and breathing room.', 'Trust and dignity matter for everyone involved.'];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--hero-band)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: '72px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    style: {
      background: 'rgba(255,255,255,0.16)',
      color: '#fff',
      marginBottom: 18
    }
  }, "Our mission"), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: '#fff',
      fontSize: 'clamp(34px, 5vw, 56px)',
      lineHeight: 1.05
    }
  }, "Make the week feel", /*#__PURE__*/React.createElement("br", null), "a little lighter."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 19,
      color: 'rgba(255,255,255,0.88)',
      maxWidth: 560,
      margin: '20px auto 0',
      lineHeight: 1.6
    }
  }, "To reduce financial stress for students by making it simple and safe to earn through flexible local jobs \u2014 while giving everyday people a trusted way to get support when they need it."))), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      padding: '64px 24px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 30,
      marginBottom: 10
    }
  }, "Why we exist"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      color: 'var(--ink-2)',
      lineHeight: 1.7
    }
  }, "Being a student can feel like carrying two lives at once \u2014 study on one side, bills on the other. Swifto exists so students have a way to earn that fits around life, not the other way around. And for the people who need a hand, it makes asking for help feel safe, respectful, and simple."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 18,
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'var(--brand-soft)'
    }
  }, /*#__PURE__*/React.createElement(IconDisc, {
    name: "users",
    tone: "brand"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 22,
      marginTop: 16
    }
  }, "For students"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--ink-2)',
      marginTop: 8,
      lineHeight: 1.6
    }
  }, "Earn quickly, flexibly and safely \u2014 so you can focus on your future with a bit more breathing room.")), /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'var(--accent-soft)'
    }
  }, /*#__PURE__*/React.createElement(IconDisc, {
    name: "heart",
    tone: "accent"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 22,
      marginTop: 16
    }
  }, "For job posters"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--ink-2)',
      marginTop: 8,
      lineHeight: 1.6
    }
  }, "Find trusted help for everyday tasks, while knowing you\\u2019re supporting students in your community."))), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 30,
      marginTop: 56,
      marginBottom: 18
    }
  }, "What we believe"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, beliefs.map(b => /*#__PURE__*/React.createElement("div", {
    key: b,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      marginTop: 2,
      color: 'var(--success)'
    }
  }, /*#__PURE__*/React.createElement(window.SW.Icon, {
    name: "check-circle",
    size: 22
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16.5,
      color: 'var(--ink-2)',
      lineHeight: 1.5
    }
  }, b)))), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginTop: 48,
      textAlign: 'center',
      background: 'var(--ink)',
      padding: 44
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: '#fff',
      fontSize: 30
    }
  }, "Ready to lighten the load?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      marginTop: 22,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go('login')
  }, "Join Swifto"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "outlineWhite",
    onClick: () => go('browse')
  }, "Find work")))));
}
window.Mission = Mission;
})(); } catch (e) { __ds_ns.__errors.push({ path: "redesign/Login.jsx", error: String((e && e.message) || e) }); }

// redesign/Nav.jsx
try { (() => {
/* Swifto redesign — top navigation (window.Nav) */
function Nav({
  route,
  go,
  authed,
  role,
  logout
}) {
  const {
    Button
  } = window.UI;
  const link = (key, label) => /*#__PURE__*/React.createElement("button", {
    onClick: () => go(key),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '6px 2px',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      fontWeight: route === key ? 700 : 500,
      color: route === key ? 'var(--ink)' : 'var(--ink-2)',
      position: 'relative',
      whiteSpace: 'nowrap'
    }
  }, label, route === key && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 2,
      right: 2,
      bottom: -2,
      height: 2.5,
      borderRadius: 2,
      background: 'var(--accent)'
    }
  }));
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'color-mix(in srgb, var(--paper) 82%, transparent)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      maxWidth: 1160,
      margin: '0 auto',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go('home'),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 27,
      fontWeight: 800,
      letterSpacing: '-0.03em',
      color: 'var(--ink)'
    }
  }, "Swifto"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: 'var(--accent)',
      marginLeft: 3,
      display: 'inline-block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 26
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22
    }
  }, link('home', 'Home'), link('browse', 'Find work'), link('mission', 'Our mission')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, authed ? /*#__PURE__*/React.createElement(React.Fragment, null, link('dashboard', 'Dashboard'), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    onClick: logout
  }, "Log out"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go(role === 'lister' ? 'browse' : 'browse')
  }, role === 'lister' ? 'Post a job' : 'Find work')) : /*#__PURE__*/React.createElement(React.Fragment, null, link('login', 'Log in'), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go('login')
  }, "Get started"))))));
}
window.Nav = Nav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "redesign/Nav.jsx", error: String((e && e.message) || e) }); }

// redesign/app.jsx
try { (() => {
/* Swifto redesign — app shell, router + Tweaks (window.App) */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "coral",
  "font": "bricolage",
  "radius": "soft",
  "imagery": true
} /*EDITMODE-END*/;
function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState('home');
  const [authed, setAuthed] = React.useState(false);
  const [role, setRole] = React.useState('student');

  // apply tweaks to <html>
  React.useEffect(() => {
    const r = document.documentElement;
    r.dataset.theme = t.theme;
    r.dataset.font = t.font;
    r.dataset.radius = t.radius;
    r.dataset.imagery = t.imagery ? 'on' : 'off';
  }, [t.theme, t.font, t.radius, t.imagery]);
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' in window ? 'instant' : 'auto'
    });
  }, [route]);
  const go = key => {
    if (key === 'dashboard' && !authed) {
      setRoute('login');
      return;
    }
    setRoute(key);
  };
  const login = r => {
    setRole(r);
    setAuthed(true);
    setRoute('dashboard');
  };
  const logout = () => {
    setAuthed(false);
    setRoute('home');
  };
  let screen;
  if (route === 'browse') screen = /*#__PURE__*/React.createElement(window.Browse, {
    go: go
  });else if (route === 'login') screen = /*#__PURE__*/React.createElement(window.Login, {
    onLogin: login
  });else if (route === 'dashboard') screen = /*#__PURE__*/React.createElement(window.Dashboard, {
    go: go
  });else if (route === 'mission') screen = /*#__PURE__*/React.createElement(window.Mission, {
    go: go
  });else screen = /*#__PURE__*/React.createElement(window.Landing, {
    go: go
  });
  const {
    TweaksPanel,
    TweakSection,
    TweakRadio,
    TweakToggle
  } = window;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement(window.Nav, {
    route: route,
    go: go,
    authed: authed,
    role: role,
    logout: logout
  }), screen, /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Direction"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Palette",
    value: t.theme,
    options: [{
      value: 'coral',
      label: 'Coral'
    }, {
      value: 'blue',
      label: 'Blue'
    }, {
      value: 'green',
      label: 'Green'
    }],
    onChange: v => setTweak('theme', v)
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Headline font",
    value: t.font,
    options: [{
      value: 'bricolage',
      label: 'Bricolage'
    }, {
      value: 'inter',
      label: 'Inter'
    }, {
      value: 'space',
      label: 'Space'
    }],
    onChange: v => setTweak('font', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Shape & imagery"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Corners",
    value: t.radius,
    options: [{
      value: 'soft',
      label: 'Soft'
    }, {
      value: 'pill',
      label: 'Pill'
    }, {
      value: 'sharp',
      label: 'Sharp'
    }],
    onChange: v => setTweak('radius', v)
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Photography",
    value: t.imagery,
    onChange: v => setTweak('imagery', v)
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "redesign/app.jsx", error: String((e && e.message) || e) }); }

// redesign/data.js
try { (() => {
/* Swifto redesign — shared mock data + imagery (window.DATA) */
(function () {
  const img = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80${h ? `&h=${h}` : ''}`;
  window.DATA = {
    photos: {
      hero: img('1522202176988-66273c2fd55f', 1200),
      // friendly young people / students
      heroSecond: img('1529156069898-49953e39b3ac', 900),
      // group of students
      poster: img('1600880292203-757bb62b4baf', 900),
      // person helping / handshake
      community: img('1521737711867-e3b97375f902', 1100),
      // people working together
      avatar1: img('1494790108377-be9c29b29330', 200, 200),
      avatar2: img('1500648767791-00dcc994a43e', 200, 200),
      avatar3: img('1438761681033-6461ffad8d80', 200, 200),
      avatar4: img('1507003211169-0a1dd7228f2d', 200, 200)
    },
    jobs: [{
      id: 1,
      name: 'Lawn mowing',
      cat: 'Yard work',
      detail: 'Backyard, about 50 sqm',
      area: 'Ponsonby',
      when: 'Sat 14 Jun · morning',
      dur: '2 hrs',
      pay: 45,
      urgent: false,
      photo: img('1592420114436-2f6f1c3e6f0a', 600)
    }, {
      id: 2,
      name: 'Help moving boxes',
      cat: 'Moving',
      detail: '2-bedroom flat, ground floor',
      area: 'Newmarket',
      when: 'Sun 15 Jun · afternoon',
      dur: '4 hrs',
      pay: 120,
      urgent: true,
      photo: img('1530124566582-a618bc2615dc', 600)
    }, {
      id: 3,
      name: 'Weekly vacuuming',
      cat: 'Cleaning',
      detail: 'One-bedroom apartment',
      area: 'Grey Lynn',
      when: 'Flexible',
      dur: '1 hr',
      pay: 30,
      urgent: false,
      photo: img('1581578731548-c64695cc6952', 600)
    }, {
      id: 4,
      name: 'Dog sitting',
      cat: 'Pet care',
      detail: 'Two friendly labradors',
      area: 'Parnell',
      when: 'Sat–Sun',
      dur: 'Weekend',
      pay: 80,
      urgent: false,
      photo: img('1450778869180-41d0601e046e', 600)
    }, {
      id: 5,
      name: 'Flat-pack assembly',
      cat: 'Assembly',
      detail: 'Wardrobe + desk',
      area: 'Mt Eden',
      when: 'Fri 13 Jun · evening',
      dur: '3 hrs',
      pay: 95,
      urgent: false,
      photo: img('1581992652564-44c42f5ad3ad', 600)
    }, {
      id: 6,
      name: 'Grocery run & unpack',
      cat: 'Delivery',
      detail: 'Weekly shop for two',
      area: 'Kingsland',
      when: 'Thu 12 Jun',
      dur: '1.5 hrs',
      pay: 35,
      urgent: false,
      photo: img('1542838132-92c53300491e', 600)
    }],
    cats: ['All', 'Moving', 'Cleaning', 'Yard work', 'Pet care', 'Assembly', 'Delivery']
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "redesign/data.js", error: String((e && e.message) || e) }); }

// redesign/icons.js
try { (() => {
/* Swifto redesign — icon set (Heroicons outline, 2px). window.SW.Icon */
(function () {
  const P = {
    'map-pin': ['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', 'M15 11a3 3 0 11-6 0 3 3 0 016 0z'],
    'shield-check': ['M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'],
    'lock': ['M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'],
    'search': ['M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'],
    'user': ['M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'],
    'users': ['M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6-3a3 3 0 10-2.8-4', 'M9 11a3 3 0 100-6 3 3 0 000 6z'],
    'briefcase': ['M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'],
    'check-circle': ['M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'],
    'check': ['M5 13l4 4L19 7'],
    'wallet': ['M21 12V7H5a2 2 0 010-4h14v4', 'M3 5v14a2 2 0 002 2h16v-5', 'M18 12a2 2 0 000 4h4v-4h-4z'],
    'sparkles': ['M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'],
    'bolt': ['M13 10V3L4 14h7v7l9-11h-7z'],
    'heart': ['M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'],
    'star': ['M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'],
    'clock': ['M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'],
    'arrow-right': ['M13 7l5 5m0 0l-5 5m5-5H6'],
    'arrow-up-right': ['M7 17L17 7m0 0H8m9 0v9'],
    'chevron-down': ['M6 9l6 6 6-6'],
    'close': ['M6 18L18 6M6 6l12 12'],
    'menu': ['M4 6h16M4 12h16M4 18h16'],
    'plus': ['M12 5v14M5 12h14'],
    'calendar': ['M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'],
    'trophy': ['M8 21h8m-4-4v4m7-17H5v2a7 7 0 0014 0V4z', 'M5 4H3v3a3 3 0 003 3m13-6h2v3a3 3 0 01-3 3']
  };
  function Icon({
    name,
    size = 24,
    stroke = 'currentColor',
    strokeWidth = 1.9,
    fill = 'none',
    style,
    className
  }) {
    const d = P[name] || [];
    return React.createElement('svg', {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill,
      stroke,
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      style,
      className,
      'aria-hidden': true
    }, d.map((p, i) => React.createElement('path', {
      key: i,
      d: p
    })));
  }
  function Stars({
    value = 5,
    size = 16
  }) {
    return React.createElement('span', {
      style: {
        display: 'inline-flex',
        gap: 1,
        color: 'var(--accent)'
      }
    }, [1, 2, 3, 4, 5].map(s => React.createElement('svg', {
      key: s,
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: s <= Math.round(value) ? 'currentColor' : 'var(--line)',
      'aria-hidden': true
    }, React.createElement('path', {
      d: P['star'][0]
    }))));
  }
  window.SW = {
    Icon,
    Stars
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "redesign/icons.js", error: String((e && e.message) || e) }); }

// redesign/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "redesign/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// redesign/ui.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Swifto redesign — UI primitives (window.UI). Styled via redesign/styles.css vars. */
(function () {
  const {
    Icon
  } = window.SW;
  function Button({
    children,
    variant = 'accent',
    size = 'md',
    full,
    onClick,
    type = 'button',
    icon,
    iconRight,
    style,
    ...rest
  }) {
    const [h, setH] = React.useState(false);
    const [d, setD] = React.useState(false);
    const sizes = {
      sm: {
        height: 40,
        padding: '0 16px',
        fontSize: 14
      },
      md: {
        height: 50,
        padding: '0 22px',
        fontSize: 15.5
      },
      lg: {
        height: 58,
        padding: '0 30px',
        fontSize: 17
      }
    };
    const v = {
      accent: {
        background: h ? 'var(--accent-deep)' : 'var(--accent)',
        color: '#fff',
        border: '1px solid transparent',
        shadow: '0 8px 20px -8px var(--accent)'
      },
      brand: {
        background: h ? 'var(--brand-deep)' : 'var(--brand)',
        color: '#fff',
        border: '1px solid transparent',
        shadow: '0 8px 20px -10px var(--brand)'
      },
      white: {
        background: h ? '#fff' : 'rgba(255,255,255,0.95)',
        color: 'var(--brand-deep)',
        border: '1px solid transparent',
        shadow: '0 8px 22px -10px rgba(0,0,0,0.4)'
      },
      outline: {
        background: h ? 'var(--brand-soft)' : 'transparent',
        color: 'var(--brand)',
        border: '1.5px solid color-mix(in srgb, var(--brand) 35%, transparent)',
        shadow: 'none'
      },
      outlineWhite: {
        background: h ? 'rgba(255,255,255,0.14)' : 'transparent',
        color: '#fff',
        border: '1.5px solid rgba(255,255,255,0.6)',
        shadow: 'none'
      },
      ghost: {
        background: h ? 'var(--brand-soft)' : 'transparent',
        color: 'var(--brand)',
        border: '1px solid transparent',
        shadow: 'none'
      }
    }[variant];
    return /*#__PURE__*/React.createElement("button", _extends({
      type: type,
      onClick: onClick,
      onMouseEnter: () => setH(true),
      onMouseLeave: () => {
        setH(false);
        setD(false);
      },
      onMouseDown: () => setD(true),
      onMouseUp: () => setD(false),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: full ? '100%' : 'auto',
        borderRadius: 'var(--r-btn)',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        lineHeight: 1,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        background: v.background,
        color: v.color,
        border: v.border,
        boxShadow: h ? v.shadow : 'none',
        transform: d ? 'scale(0.97)' : h ? 'translateY(-1px)' : 'none',
        transition: 'all 0.18s var(--ease)',
        ...sizes[size],
        ...style
      }
    }, rest), icon && /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: size === 'lg' ? 20 : 18
    }), children, iconRight && /*#__PURE__*/React.createElement(Icon, {
      name: iconRight,
      size: size === 'lg' ? 20 : 18
    }));
  }
  function Card({
    children,
    hover,
    pad = 24,
    style,
    onClick,
    ...rest
  }) {
    const [h, setH] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", _extends({
      onClick: onClick,
      onMouseEnter: hover ? () => setH(true) : undefined,
      onMouseLeave: hover ? () => setH(false) : undefined,
      style: {
        background: 'var(--card)',
        border: '1px solid var(--line-card)',
        borderRadius: 'var(--r-lg)',
        boxShadow: h ? 'var(--shadow-lift)' : 'var(--shadow-card)',
        padding: pad,
        transform: h ? 'translateY(-4px)' : 'none',
        transition: 'all 0.3s var(--ease)',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }
    }, rest), children);
  }
  function Badge({
    children,
    tone = 'brand',
    style
  }) {
    const t = {
      brand: {
        bg: 'var(--brand-soft)',
        fg: 'var(--brand-deep)'
      },
      accent: {
        bg: 'var(--accent-soft)',
        fg: 'var(--accent-deep)'
      },
      success: {
        bg: 'var(--success-soft)',
        fg: 'var(--success)'
      },
      warning: {
        bg: 'var(--warning-soft)',
        fg: 'var(--warning)'
      },
      neutral: {
        bg: 'color-mix(in srgb, var(--ink) 7%, transparent)',
        fg: 'var(--ink-2)'
      }
    }[tone];
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 11px',
        borderRadius: 'var(--r-pill)',
        fontSize: 12.5,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        background: t.bg,
        color: t.fg,
        ...style
      }
    }, children);
  }
  function IconDisc({
    name,
    size = 52,
    tone = 'brand',
    iconSize,
    style
  }) {
    const t = {
      brand: {
        bg: 'var(--brand-soft)',
        fg: 'var(--brand)'
      },
      accent: {
        bg: 'var(--accent-soft)',
        fg: 'var(--accent-deep)'
      },
      success: {
        bg: 'var(--success-soft)',
        fg: 'var(--success)'
      }
    }[tone];
    return /*#__PURE__*/React.createElement("span", {
      style: {
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 'var(--r-md)',
        background: t.bg,
        color: t.fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: name,
      size: iconSize || Math.round(size * 0.46)
    }));
  }
  function Field({
    label,
    prefix,
    hint,
    style,
    inputStyle,
    ...rest
  }) {
    const [f, setF] = React.useState(false);
    return /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7,
        ...style
      }
    }, label && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: 'var(--ink-2)'
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }
    }, prefix && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 16,
        color: 'var(--ink-3)',
        fontWeight: 600,
        pointerEvents: 'none'
      }
    }, prefix), /*#__PURE__*/React.createElement("input", _extends({
      onFocus: () => setF(true),
      onBlur: () => setF(false),
      style: {
        width: '100%',
        height: 50,
        padding: prefix ? '0 16px 0 28px' : '0 16px',
        borderRadius: 'var(--r-btn)',
        border: `1.5px solid ${f ? 'var(--brand)' : 'var(--line)'}`,
        background: 'var(--card)',
        color: 'var(--ink)',
        fontFamily: 'var(--font-body)',
        fontSize: 15.5,
        outline: 'none',
        boxShadow: f ? '0 0 0 4px color-mix(in srgb, var(--brand) 14%, transparent)' : 'none',
        transition: 'all 0.18s var(--ease)',
        ...inputStyle
      }
    }, rest))), hint && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--ink-3)'
      }
    }, hint));
  }
  function Area({
    label,
    rows = 3,
    style,
    ...rest
  }) {
    const [f, setF] = React.useState(false);
    return /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7,
        ...style
      }
    }, label && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: 'var(--ink-2)'
      }
    }, label), /*#__PURE__*/React.createElement("textarea", _extends({
      rows: rows,
      onFocus: () => setF(true),
      onBlur: () => setF(false),
      style: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: 'var(--r-btn)',
        resize: 'none',
        border: `1.5px solid ${f ? 'var(--brand)' : 'var(--line)'}`,
        background: 'var(--card)',
        color: 'var(--ink)',
        fontFamily: 'var(--font-body)',
        fontSize: 15.5,
        lineHeight: 1.5,
        outline: 'none',
        boxShadow: f ? '0 0 0 4px color-mix(in srgb, var(--brand) 14%, transparent)' : 'none',
        transition: 'all 0.18s var(--ease)'
      }
    }, rest)));
  }

  /* Photo: real image with a branded gradient fallback (and imagery-off support) */
  function Photo({
    src,
    alt = '',
    radius = 'var(--r-lg)',
    height,
    tint = true,
    style,
    className = ''
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        borderRadius: radius,
        overflow: 'hidden',
        height,
        width: '100%',
        background: 'var(--hero-band)',
        ...style
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "photo-fallback",
      style: {
        position: 'absolute',
        inset: 0,
        background: 'var(--hero-band)'
      }
    }), /*#__PURE__*/React.createElement("img", {
      className: `photo ${className}`,
      src: src,
      alt: alt,
      loading: "lazy",
      onError: e => {
        e.target.style.display = 'none';
      },
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }
    }), tint && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'var(--photo-tint)',
        mixBlendMode: 'multiply'
      }
    }));
  }
  window.UI = {
    Button,
    Card,
    Badge,
    IconDisc,
    Field,
    Area,
    Photo
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "redesign/ui.jsx", error: String((e && e.message) || e) }); }

// ui_kits/swifto-marketplace/BrowseScreen.jsx
try { (() => {
/* Swifto Browse — search/filter bar + job rows with apply flow & modal. */
function BrowseScreen({
  onNavigate
}) {
  const {
    Button,
    Card,
    Badge,
    Input,
    Select,
    Textarea,
    Modal
  } = window.SwiftoDesignSystem_8a726e;
  const {
    Icon
  } = window.SwiftoIcons;
  const ALL = [{
    id: 1,
    name: 'Lawn mowing',
    area: 'Ponsonby, Auckland',
    date: 'Sat 14 Jun',
    time: 'Morning',
    duration: '2 hours',
    pay: 45,
    urgent: false
  }, {
    id: 2,
    name: 'Moving boxes',
    area: 'Newmarket, Auckland',
    date: 'Sun 15 Jun',
    time: 'Afternoon',
    duration: '4 hours',
    pay: 120,
    urgent: true
  }, {
    id: 3,
    name: 'Vacuuming',
    area: 'Grey Lynn, Auckland',
    date: 'Flexible',
    time: 'Any time',
    duration: '1 hour',
    pay: 30,
    urgent: false
  }, {
    id: 4,
    name: 'Dog sitting',
    area: 'Parnell, Auckland',
    date: 'Sat–Sun',
    time: 'Weekend',
    duration: 'Weekend',
    pay: 80,
    urgent: false
  }, {
    id: 5,
    name: 'Furniture assembly',
    area: 'Mt Eden, Auckland',
    date: 'Fri 13 Jun',
    time: 'Evening',
    duration: '3 hours',
    pay: 95,
    urgent: false
  }];
  const [query, setQuery] = React.useState('');
  const [cat, setCat] = React.useState('');
  const [applied, setApplied] = React.useState(new Set());
  const [modalJob, setModalJob] = React.useState(null);
  const [form, setForm] = React.useState({
    name: '',
    experience: '',
    availability: ''
  });
  const wrap = {
    maxWidth: 'var(--container-prose)',
    margin: '0 auto',
    padding: '0 2rem'
  };
  const list = ALL.filter(j => !query || j.name.toLowerCase().includes(query.toLowerCase()) || j.area.toLowerCase().includes(query.toLowerCase()));
  const quickApply = id => setApplied(s => new Set(s).add(id));
  const submit = () => {
    setApplied(s => new Set(s).add(modalJob.id));
    setModalJob(null);
    setForm({
      name: '',
      experience: '',
      availability: ''
    });
  };
  const earn = pay => (pay * 0.95).toFixed(2);
  const valid = form.name.trim() && form.experience.trim() && form.availability.trim();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-brand)',
      padding: '3.5rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-5xl)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--on-primary)',
      textAlign: 'center'
    }
  }, "Browse Jobs"))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-page)',
      padding: '2.5rem 0 4rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      minWidth: 220
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-placeholder)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 20
  })), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "Search jobs by name, category, area\u2026",
    style: {
      width: '100%',
      height: 'var(--control-h)',
      padding: '0 1rem 0 2.75rem',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-input)',
      background: 'var(--surface-card)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-strong)',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 200
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: cat,
    onChange: e => setCat(e.target.value),
    placeholder: "All categories",
    options: [{
      value: 'moving',
      label: 'Moving'
    }, {
      value: 'cleaning',
      label: 'Cleaning'
    }, {
      value: 'yard-work',
      label: 'Yard Work'
    }, {
      value: 'pet-care',
      label: 'Pet Care'
    }]
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      marginBottom: '1.5rem'
    }
  }, "Showing ", list.length, " of ", ALL.length, " jobs"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }
  }, list.map(j => {
    const isApplied = applied.has(j.id);
    return /*#__PURE__*/React.createElement(Card, {
      key: j.id,
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-xl)',
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--text-strong)'
      }
    }, j.name), j.urgent && /*#__PURE__*/React.createElement(Badge, {
      tone: "warning"
    }, "Urgent rebook")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-base)',
        color: 'var(--text-muted)',
        marginTop: '0.25rem'
      }
    }, j.area), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '0.75rem',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: '0.25rem'
      }
    }, /*#__PURE__*/React.createElement("span", null, j.date), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, j.time))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.25rem'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, "Time: ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--text-strong)',
        fontWeight: 'var(--weight-medium)'
      }
    }, j.duration)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, "Pay: ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--swifto-primary)',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--weight-semibold)'
      }
    }, "$", j.pay)))), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      }
    }, "You'll earn ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--swifto-primary)'
      }
    }, "$", earn(j.pay)), " after fees \xB7 released after both parties verify completion."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'flex-end',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-divider)'
      }
    }, isApplied ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      style: {
        padding: '0.5rem 1.25rem',
        fontSize: 'var(--text-sm)',
        border: '2px solid var(--success-border)'
      }
    }, "Applied") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => quickApply(j.id)
    }, "Quick Apply"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outline",
      onClick: () => setModalJob(j)
    }, "Apply")))));
  })))), /*#__PURE__*/React.createElement(Modal, {
    open: !!modalJob,
    onClose: () => setModalJob(null),
    title: "Apply for Job",
    subtitle: modalJob ? `${modalJob.name} · ${modalJob.area}` : '',
    footer: /*#__PURE__*/React.createElement(Button, {
      fullWidth: true,
      disabled: !valid,
      onClick: submit
    }, valid ? 'Submit Application' : 'Fill all fields to apply')
  }, modalJob && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-soft)',
      borderRadius: 'var(--radius-xl)',
      padding: '1rem',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.75rem',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Duration"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-strong)'
    }
  }, modalJob.duration)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Pay"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--swifto-primary)'
    }
  }, "$", modalJob.pay))), /*#__PURE__*/React.createElement(Input, {
    label: "Name *",
    value: form.name,
    onChange: e => setForm({
      ...form,
      name: e.target.value
    }),
    placeholder: "Enter your full name"
  }), /*#__PURE__*/React.createElement(Textarea, {
    label: "Experience *",
    rows: 3,
    value: form.experience,
    onChange: e => setForm({
      ...form,
      experience: e.target.value
    }),
    placeholder: "Tell us about your relevant experience\u2026"
  }), /*#__PURE__*/React.createElement(Textarea, {
    label: "Availability *",
    rows: 2,
    value: form.availability,
    onChange: e => setForm({
      ...form,
      availability: e.target.value
    }),
    placeholder: "Confirm your availability for this time slot\u2026"
  }))));
}
window.BrowseScreen = BrowseScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/swifto-marketplace/BrowseScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/swifto-marketplace/DashboardScreen.jsx
try { (() => {
/* Swifto Student Dashboard — balance, welcome, and tile grid. */
function DashboardScreen({
  onNavigate,
  onLogout
}) {
  const {
    Button,
    DashboardTile
  } = window.SwiftoDesignSystem_8a726e;
  const {
    Icon
  } = window.SwiftoIcons;
  const wrap = {
    maxWidth: 'var(--container-max)',
    margin: '0 auto',
    padding: '0 2rem'
  };
  const tiles = [{
    icon: 'user',
    title: 'Profile',
    caption: 'View and edit your profile',
    go: 'dashboard'
  }, {
    icon: 'dollar',
    title: 'Withdraw',
    caption: 'Withdraw your earnings',
    go: 'dashboard'
  }, {
    icon: 'search',
    title: 'Browse Jobs',
    caption: 'Search and find available jobs',
    go: 'browse'
  }, {
    icon: 'briefcase',
    title: 'Active Jobs',
    highlight: '3 active',
    caption: '2 pending',
    go: 'dashboard'
  }, {
    icon: 'check-circle',
    title: 'Jobs Completed',
    caption: 'View your completed jobs',
    go: 'dashboard'
  }, {
    icon: 'sparkles',
    title: 'Achievements',
    caption: 'View your milestones',
    go: 'dashboard'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-brand)',
      minHeight: '80vh',
      padding: '4rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '0.5rem',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-lg)',
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '3rem',
      height: '3rem',
      borderRadius: 'var(--radius-full)',
      background: 'var(--primary-10)',
      color: 'var(--swifto-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "dollar",
    size: 26
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-xs)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)',
      color: 'var(--text-muted)',
      fontWeight: 'var(--weight-medium)'
    }
  }, "Available Balance"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--text-strong)'
    }
  }, "$184.50"))), /*#__PURE__*/React.createElement(Button, {
    variant: "white",
    onClick: () => {}
  }, "Withdraw Earnings")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      marginBottom: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: 'var(--on-primary)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: 'var(--text-2xl)'
    }
  }, "Welcome back, Maia!")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem'
    }
  }, tiles.map(t => /*#__PURE__*/React.createElement(DashboardTile, {
    key: t.title,
    title: t.title,
    highlight: t.highlight,
    caption: t.caption,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 40
    }),
    onClick: () => onNavigate(t.go)
  })))));
}
window.DashboardScreen = DashboardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/swifto-marketplace/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/swifto-marketplace/LandingScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Swifto Landing — hero, trust strip, how-it-works, why-Swifto. */
function LandingScreen({
  onNavigate
}) {
  const {
    Button,
    Card,
    IconCircle,
    JobCard
  } = window.SwiftoDesignSystem_8a726e;
  const {
    Icon
  } = window.SwiftoIcons;
  const wrap = {
    maxWidth: 'var(--container-max)',
    margin: '0 auto',
    padding: '0 2rem'
  };
  const previews = [{
    title: 'Lawn mowing',
    detail: 'Backyard, ~50 sq m',
    pay: '$45',
    location: 'Ponsonby, Auckland'
  }, {
    title: 'Moving boxes',
    detail: '2-bedroom flat',
    pay: '$120',
    location: 'Newmarket, Auckland'
  }, {
    title: 'Dog sitting',
    detail: 'Weekend, 2 dogs',
    pay: '$80',
    location: 'Grey Lynn, Auckland'
  }];
  const trust = [{
    icon: 'shield-check',
    title: 'Verified users',
    sub: 'All students are verified'
  }, {
    icon: 'lock',
    title: 'Secure payments',
    sub: 'Protected transactions'
  }, {
    icon: 'star',
    title: 'Ratings & accountability',
    sub: 'Built-in reviews'
  }];
  const steps = [{
    n: '1',
    title: 'Post a job',
    body: 'Describe your task, set a budget, and post it to the Swifto community.'
  }, {
    n: '2',
    title: 'Choose a student',
    body: 'Review profiles and proposals from verified students in your area.'
  }, {
    n: '3',
    title: 'Confirm — payment released',
    body: 'Once you confirm the work is done, payment is automatically released.'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-brand)',
      padding: '5rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '3rem',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-6xl)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-tight)',
      lineHeight: 1.05,
      color: 'var(--on-primary)'
    }
  }, "Get trusted help fast \u2014 from verified students."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-lg)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--on-primary-90)',
      maxWidth: '34ch'
    }
  }, "Post a task in minutes. Pay securely. Confirm when it's done."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "white",
    size: "lg",
    onClick: () => onNavigate('login')
  }, "Post a job"), /*#__PURE__*/React.createElement(Button, {
    variant: "outlineWhite",
    size: "lg",
    onClick: () => onNavigate('browse')
  }, "Find jobs")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--on-primary-90)'
    }
  }, "Verified users \xB7 Secure payments \xB7 Ratings")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }
  }, previews.map(p => /*#__PURE__*/React.createElement(JobCard, _extends({
    key: p.title
  }, p, {
    onClick: () => onNavigate('browse')
  })))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-card)',
      padding: '3rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2rem'
    }
  }, trust.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.title,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement(IconCircle, null, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)'
    }
  }, t.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      marginTop: '0.125rem'
    }
  }, t.sub)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '5rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-4xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--text-strong)',
      textAlign: 'center',
      marginBottom: '3rem'
    }
  }, "How it works"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2rem'
    }
  }, steps.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.n,
    padding: "xl",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '3rem',
      height: '3rem',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--swifto-primary)',
      color: 'var(--on-primary)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: 'var(--text-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, s.n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)'
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--text-body)'
    }
  }, s.body)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-brand)',
      padding: '4rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: '1fr 1.2fr',
      gap: '3rem',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-4xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--on-primary)'
    }
  }, "Why Swifto"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }
  }, [['Trust who you hire', 'Every profile is verified, so you can book with confidence.'], ['Get it sorted fast', 'Post once, pick the right student, and confirm without back and forth.'], ['Know the price upfront', 'Clear costs before you commit, with no surprises.'], ['Protected payments', 'Held securely and released only when the job is confirmed complete.']].map(([t, b]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: 'var(--radius-full)',
      background: 'var(--on-primary-20)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '0.25rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: 'var(--radius-full)',
      background: 'var(--on-primary)'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--on-primary)',
      marginBottom: '0.25rem'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--on-primary-90)'
    }
  }, b))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ink)',
      padding: '5rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-3xl)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--on-primary)',
      marginBottom: '2rem'
    }
  }, "Ready to get something done today?"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => onNavigate('login')
  }, "Post a job"))), /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface-page)',
      padding: '2.5rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1.5rem',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-strong)'
    }
  }, "Safety"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-strong)'
    }
  }, "Contact")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, "\xA9 Swifto"))));
}
window.LandingScreen = LandingScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/swifto-marketplace/LandingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/swifto-marketplace/LoginScreen.jsx
try { (() => {
/* Swifto Login — centered card on a brand band; logs the user in (fake). */
function LoginScreen({
  onLogin
}) {
  const {
    Button,
    Input
  } = window.SwiftoDesignSystem_8a726e;
  const [email, setEmail] = React.useState('maia@student.ac.nz');
  const [password, setPassword] = React.useState('••••••••');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-brand)',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-2xl)',
      border: '1px solid var(--border-card)',
      boxShadow: 'var(--shadow-sm)',
      padding: '2.5rem',
      width: '100%',
      maxWidth: '24rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-3xl)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--text-strong)'
    }
  }, "Welcome back"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-base)',
      color: 'var(--text-body)',
      marginTop: '0.5rem'
    }
  }, "Log in to your Swifto account")), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onLogin('student');
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email address",
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    type: "password",
    value: password,
    onChange: e => setPassword(e.target.value)
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    fullWidth: true,
    onClick: () => onLogin('student')
  }, "Log in")), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, "Don't have an account? ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--swifto-primary)',
      fontWeight: 'var(--weight-medium)',
      cursor: 'pointer'
    },
    onClick: () => onLogin('lister')
  }, "Sign up"))));
}
window.LoginScreen = LoginScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/swifto-marketplace/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/swifto-marketplace/SiteNav.jsx
try { (() => {
/* Swifto SiteNav — sticky top bar with wordmark, links, and auth actions. */
function SiteNav({
  route,
  onNavigate,
  authed,
  role,
  onLogout
}) {
  const {
    Button
  } = window.SwiftoDesignSystem_8a726e;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const link = (key, label) => /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onNavigate(key);
      setMenuOpen(false);
    },
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.25rem 0',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: route === key ? 'var(--swifto-primary)' : 'var(--text-strong)',
      fontWeight: route === key ? 'var(--weight-semibold)' : 'var(--weight-regular)'
    }
  }, label);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-divider)'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0.875rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('home'),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--swifto-ink)',
      letterSpacing: '-0.02em',
      padding: 0
    }
  }, "Swifto"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem'
    }
  }, link('home', 'Home'), link('mission', 'Our Mission'), link('browse', 'Browse'), authed ? /*#__PURE__*/React.createElement(React.Fragment, null, link('dashboard', 'Dashboard'), role === 'lister' ? /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => onNavigate('post')
  }, "Post a Job") : /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => onNavigate('browse')
  }, "Find a Job"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: onLogout
  }, "Log out")) : /*#__PURE__*/React.createElement(React.Fragment, null, link('login', 'Log in'), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => onNavigate('login')
  }, "Sign up")))));
}
window.SiteNav = SiteNav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/swifto-marketplace/SiteNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/swifto-marketplace/app.jsx
try { (() => {
/* Swifto marketplace — interactive shell tying the screens together. */
function App() {
  const [route, setRoute] = React.useState('home');
  const [authed, setAuthed] = React.useState(false);
  const [role, setRole] = React.useState('student');
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);
  const navigate = key => {
    if ((key === 'dashboard' || key === 'post') && !authed) {
      setRoute('login');
      return;
    }
    setRoute(key);
  };
  const login = r => {
    setRole(r);
    setAuthed(true);
    setRoute('dashboard');
  };
  const logout = () => {
    setAuthed(false);
    setRoute('home');
  };
  let screen;
  if (route === 'browse') screen = /*#__PURE__*/React.createElement(BrowseScreen, {
    onNavigate: navigate
  });else if (route === 'login') screen = /*#__PURE__*/React.createElement(LoginScreen, {
    onLogin: login
  });else if (route === 'dashboard') screen = /*#__PURE__*/React.createElement(DashboardScreen, {
    onNavigate: navigate,
    onLogout: logout
  });else if (route === 'mission') screen = /*#__PURE__*/React.createElement(MissionScreen, {
    onNavigate: navigate
  });else screen = /*#__PURE__*/React.createElement(LandingScreen, {
    onNavigate: navigate
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement(SiteNav, {
    route: route,
    onNavigate: navigate,
    authed: authed,
    role: role,
    onLogout: logout
  }), screen);
}

/* Minimal Mission screen — mission-driven prose, reused from product copy. */
function MissionScreen() {
  const wrap = {
    maxWidth: 'var(--container-prose)',
    margin: '0 auto',
    padding: '0 2rem'
  };
  const {
    Card
  } = window.SwiftoDesignSystem_8a726e;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-brand)',
      padding: '5rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-6xl)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--on-primary)'
    }
  }, "Our Mission"))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-card)',
      padding: '4rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-2xl)',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--text-body)',
      marginBottom: '3rem'
    }
  }, "Swifto is built for real life, when money feels tight, time feels short, and asking for help can feel harder than it should."), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-3xl)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)',
      marginBottom: '1rem'
    }
  }, "Mission"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-lg)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--text-body)',
      marginBottom: '3rem'
    }
  }, "To reduce financial stress for students by making it simple and safe to earn through flexible local jobs, while giving everyday people a trusted way to get support when they need it."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "xl",
    style: {
      background: 'var(--surface-soft)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)',
      marginBottom: '0.75rem'
    }
  }, "Students"), /*#__PURE__*/React.createElement("p", {
    style: {
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--text-body)'
    }
  }, "A way to earn quickly, flexibly, and safely \u2014 so you can focus on your future with a bit more breathing room.")), /*#__PURE__*/React.createElement(Card, {
    padding: "xl",
    style: {
      background: 'var(--surface-soft)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)',
      marginBottom: '0.75rem'
    }
  }, "Job posters"), /*#__PURE__*/React.createElement("p", {
    style: {
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--text-body)'
    }
  }, "Find trusted help for everyday tasks, while knowing you're also supporting students in your local community."))))));
}
window.MissionScreen = MissionScreen;
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/swifto-marketplace/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/swifto-marketplace/icons.js
try { (() => {
/* Swifto icon set — Heroicons (outline) paths used across the product.
   Exposes window.SwiftoIcons.Icon, a 2px-stroke SVG renderer. */
(function () {
  const PATHS = {
    'map-pin': ['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', 'M15 11a3 3 0 11-6 0 3 3 0 016 0z'],
    'shield-check': ['M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'],
    'lock': ['M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'],
    'star': ['M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'],
    'search': ['M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'],
    'user': ['M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'],
    'briefcase': ['M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'],
    'check-circle': ['M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'],
    'dollar': ['M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'],
    'sparkles': ['M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'],
    'menu': ['M4 6h16M4 12h16M4 18h16'],
    'close': ['M6 18L18 6M6 6l12 12'],
    'clock': ['M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'],
    'arrow-right': ['M14 5l7 7m0 0l-7 7m7-7H3']
  };
  function Icon({
    name,
    size = 24,
    stroke = 'currentColor',
    strokeWidth = 2,
    style
  }) {
    const d = PATHS[name] || [];
    return React.createElement('svg', {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke,
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      style,
      'aria-hidden': true
    }, d.map((p, i) => React.createElement('path', {
      key: i,
      d: p
    })));
  }
  window.SwiftoIcons = {
    Icon,
    PATHS
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/swifto-marketplace/icons.js", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconCircle = __ds_scope.IconCircle;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.StarRating = __ds_scope.StarRating;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.DashboardTile = __ds_scope.DashboardTile;

__ds_ns.JobCard = __ds_scope.JobCard;

})();
