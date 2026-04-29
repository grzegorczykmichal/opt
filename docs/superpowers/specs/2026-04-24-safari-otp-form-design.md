# Safari SMS Autofill OTP Form — Design Spec

**Date:** 2026-04-24

## Context

A simple, standalone `index.html` to be hosted on Netlify. The page presents a 6-digit OTP input that Safari on iOS can auto-fill from an incoming SMS message. No form submission is required — the page only needs to display the digits as they are filled in by autofill or manual entry.

## Requirements

- Single `index.html` file, no dependencies, no build step
- 6 visible digit boxes displaying one digit each
- Safari SMS OTP autofill via `autocomplete="one-time-code"`
- Works on iOS Safari (primary target); manual keyboard entry works on all other browsers
- No submit button, no form action

## Architecture

### Hidden input (autofill target)

```html
<input
  id="otp-hidden"
  type="text"
  inputmode="numeric"
  autocomplete="one-time-code"
  maxlength="6"
  aria-label="One-time passcode"
  style="position:absolute; opacity:0; pointer-events:none; overflow:hidden; width:1px; height:1px;"
/>
```

Safari reads the SMS, recognizes the OTP pattern (e.g. "Your code is 123456"), and fills this input. The `visually-hidden` technique keeps it in the DOM (required for autofill) while invisible to sighted users.

`pattern` is omitted — it only applies on form submission and there is none.

### 6 visible digit boxes

```html
<div class="otp-boxes" aria-hidden="true">
  <div class="otp-box" id="d0"></div>
  <div class="otp-box" id="d1"></div>
  <div class="otp-box" id="d2"></div>
  <div class="otp-box" id="d3"></div>
  <div class="otp-box" id="d4"></div>
  <div class="otp-box" id="d5"></div>
</div>
```

Read-only `<div>` elements styled as digit cells. `aria-hidden="true"` prevents screen readers from double-reading; the hidden input carries the accessible label.

### JS distribution logic

```js
function distributeDigits(value) {
  const digits = value.replace(/\D/g, '').slice(0, 6).split('');
  for (let i = 0; i < 6; i++) {
    const box = document.getElementById('d' + i);
    box.textContent = digits[i] ?? '';
    box.classList.toggle('filled', !!digits[i]);
  }
}

const hiddenInput = document.getElementById('otp-hidden');
hiddenInput.addEventListener('input', function () {
  distributeDigits(this.value);
});
// Also handle paste events explicitly
hiddenInput.addEventListener('paste', function (e) {
  e.preventDefault();
  const pasted = (e.clipboardData || window.clipboardData).getData('text');
  this.value = pasted.replace(/\D/g, '').slice(0, 6);
  distributeDigits(this.value);
});
```

Strips non-digits on every `input` and on `paste`. Safari autofill, manual typing, and clipboard paste all route through the same `distributeDigits` function.

### Manual entry fallback (non-iOS)

Clicking anywhere on the `.otp-boxes` container programmatically focuses the hidden input, so users on desktop or Android can click the box area and type:

```js
document.querySelector('.otp-boxes').addEventListener('click', function () {
  hiddenInput.focus();
});
```

No per-box click handling needed — clicking anywhere in the row focuses the hidden input.

### Post-fill behavior

Nothing happens automatically when all 6 digits are filled. The boxes simply display the code. No redirect, no clipboard copy, no auto-submit.

## Visual Design

- Page: full-height, vertically and horizontally centered, neutral background (`#f5f5f5`)
- Card: white, `border-radius: 12px`, `padding: 40px 32px`, `box-shadow` subtle
- Heading: "Enter verification code", centered, `font-size: 1.25rem`, dark gray
- 6 boxes in a flex row with `gap: 10px`, centered inside the card
- Each box: `width: 48px`, `height: 60px`, `border: 2px solid #ccc`, `border-radius: 8px`, centered digit, `font-size: 1.75rem`, `font-weight: 600`
- `.filled` box: `border-color: #007aff` (iOS blue), `color: #007aff`
- Responsive: on viewport < 380px, box width scales down to `40px` and font to `1.5rem`
- Font: system-ui / `-apple-system` stack (no external font loads)

## File Structure

```
index.html   (single file — all HTML, CSS, JS inline)
```

## Verification

1. Open `index.html` in Safari on iOS
2. Trigger an SMS containing a 6-digit code (e.g. "Your verification code is 482910")
3. Safari should display an autofill suggestion above the keyboard — tap it
4. All 6 digit boxes should populate with the correct digits and turn blue
5. On desktop: click the box area, type 6 digits manually — boxes should populate in sequence
6. Paste a code (e.g. "482910") while the hidden input is focused — boxes should populate

## Out of Scope

- Form submission or backend OTP validation
- ARIA live regions (out of scope for this simple demo)
- Multiple themes or styling variants
- Non-numeric OTP codes
