import React from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon, X } from 'lucide-react';
import { playNotificationSound } from './notificationSound';

/**
 * Toast theme styles matching the rounded pastel pill notification cards:
 * 1. Green pill (Success): CheckCircle2 icon, dark green title, soft green text, light mint pastel bg
 * 2. Amber/Yellow pill (Warning): AlertTriangle icon, dark amber title, amber text, light yellow pastel bg
 * 3. Blue pill (Info): Info circle icon, dark blue title, blue text, light periwinkle pastel bg
 * 4. Coral/Red pill (Error): AlertOctagon icon, dark red title, crimson text, light coral pastel bg
 */
const TOAST_THEMES = {
  success: {
    container: 'bg-[#eafaf1] border-[#86efac]/90 text-[#166534] shadow-[0_12px_32px_rgba(22,101,52,0.15)]',
    icon: <CheckCircle2 className="w-5 h-5 text-[#16a34a] stroke-[2.2]" />,
    title: 'text-[#166534]',
    message: 'text-[#15803d]',
    close: 'text-[#16a34a]/70 hover:text-[#166534] hover:bg-[#16a34a]/10',
    defaultTitle: 'Success',
  },
  warning: {
    container: 'bg-[#fef9c3] border-[#fde047]/90 text-[#854d0e] shadow-[0_12px_32px_rgba(161,98,7,0.15)]',
    icon: <AlertTriangle className="w-5 h-5 text-[#ca8a04] stroke-[2.2]" />,
    title: 'text-[#854d0e]',
    message: 'text-[#a16207]',
    close: 'text-[#ca8a04]/70 hover:text-[#854d0e] hover:bg-[#ca8a04]/10',
    defaultTitle: 'Notice',
  },
  info: {
    container: 'bg-[#eff6ff] border-[#93c5fd]/90 text-[#1e40af] shadow-[0_12px_32px_rgba(37,99,235,0.15)]',
    icon: <Info className="w-5 h-5 text-[#2563eb] stroke-[2.2]" />,
    title: 'text-[#1e40af]',
    message: 'text-[#2563eb]',
    close: 'text-[#2563eb]/70 hover:text-[#1e40af] hover:bg-[#2563eb]/10',
    defaultTitle: 'Information',
  },
  error: {
    container: 'bg-[#fef2f2] border-[#fca5a5]/90 text-[#991b1b] shadow-[0_12px_32px_rgba(220,38,38,0.15)]',
    icon: <AlertOctagon className="w-5 h-5 text-[#dc2626] stroke-[2.2]" />,
    title: 'text-[#991b1b]',
    message: 'text-[#b91c1c]',
    close: 'text-[#dc2626]/70 hover:text-[#991b1b] hover:bg-[#dc2626]/10',
    defaultTitle: 'Something went wrong',
  },
};

/**
 * Custom Toast Pill Component rendered with react-hot-toast
 */
function PillToast({ t, type, title, message }) {
  const theme = TOAST_THEMES[type] || TOAST_THEMES.info;

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3.5 px-5 py-3.5 rounded-full md:rounded-[32px] border backdrop-blur-md transition-all duration-300 transform select-none max-w-md min-w-[280px] sm:min-w-[340px] ${
        theme.container
      } ${
        t.visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
      }`}
      role="alert"
    >
      {/* Leading Icon */}
      <div className="shrink-0 flex items-center justify-center">
        {theme.icon}
      </div>

      {/* Title & Message */}
      <div className="flex-1 min-w-0 pr-1">
        <h4 className={`text-[13.5px] font-bold tracking-tight leading-tight truncate ${theme.title}`}>
          {title}
        </h4>
        {message && (
          <p className={`text-[12px] font-medium mt-0.5 leading-snug truncate ${theme.message}`}>
            {message}
          </p>
        )}
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={() => toast.dismiss(t.id)}
        className={`shrink-0 p-1 -mr-1 rounded-full transition-colors cursor-pointer ${theme.close}`}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Dispatch toast notification with soft sound
 */
function showToast(type, firstArg, secondArg, customOptions = {}) {
  let title = firstArg;
  let message = secondArg;
  let options = customOptions;

  // Handle call signatures:
  // notify.success("Message") -> default title, single message
  // notify.success("Title", "Message") -> title + subtitle
  // notify.success("Title", { duration: 5000 })
  if (typeof secondArg === 'object' && secondArg !== null && !options.duration && !options.id) {
    options = secondArg;
    message = undefined;
  }

  const theme = TOAST_THEMES[type] || TOAST_THEMES.info;

  if (!message) {
    if (typeof title === 'string' && title.length > 25) {
      message = title;
      title = theme.defaultTitle;
    }
  }

  // Play soft synthesized notification chime unless explicitly opted out
  if (options.playSound !== false) {
    playNotificationSound(type);
  }

  return toast.custom(
    (t) => (
      <PillToast
        t={t}
        type={type}
        title={title || theme.defaultTitle}
        message={message}
      />
    ),
    {
      duration: options.duration || 4000,
      position: options.position || 'top-right',
      id: options.id,
    }
  );
}

export const notify = {
  success: (title, message, options) => showToast('success', title, message, options),
  error: (title, message, options) => showToast('error', title, message, options),
  warning: (title, message, options) => showToast('warning', title, message, options),
  info: (title, message, options) => showToast('info', title, message, options),
  dismiss: (toastId) => toast.dismiss(toastId),
};

export default notify;
