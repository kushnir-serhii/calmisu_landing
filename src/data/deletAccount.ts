import { Lang } from "@/pages/DeleteAccountPage";

export const i18n: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    warning: string;
    dataDeletedTitle: string;
    dataDeletedItems: string[];
    dataRetainedTitle: string;
    dataRetainedItems: string[];
    deletionTimeline: string;
    emailLabel: string;
    passwordLabel: string;
    emailPlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
  }
> = {
  en: {
    title: "Delete your Calmisu account",
    subtitle:
      "Enter your credentials to permanently delete your Calmisu account and all associated data.",
    warning: "⚠ This action is permanent and cannot be undone.",
    dataDeletedTitle: "Data that will be permanently deleted:",
    dataDeletedItems: [
      "Account profile (name, email address)",
      "Subscription and billing status",
      "Meditation & flow session history",
      "Weekly check-in streaks",
      "Chat usage history",
    ],
    dataRetainedTitle: "Data that will not be affected:",
    dataRetainedItems: [
      "Anonymous feedback submissions (not linked to your account)",
    ],
    deletionTimeline:
      "Your account and all associated data are permanently deleted immediately upon confirmation.",
    emailLabel: "Email",
    passwordLabel: "Password",
    emailPlaceholder: "you@example.com",
    submit: "Delete my account",
    submitting: "Deleting…",
    successTitle: "Account deleted",
    successBody:
      "Your account and all associated data have been permanently removed.",
  },
  pl: {
    title: "Usuń swoje konto Calmisu",
    subtitle:
      "Wprowadź swoje dane, aby trwale usunąć konto Calmisu i wszystkie powiązane dane.",
    warning: "⚠ Ta czynność jest nieodwracalna i nie można jej cofnąć.",
    dataDeletedTitle: "Dane, które zostaną trwale usunięte:",
    dataDeletedItems: [
      "Profil konta (imię, adres e-mail)",
      "Status subskrypcji i płatności",
      "Historia sesji medytacyjnych i flow",
      "Tygodniowe serie aktywności",
      "Historia korzystania z czatu",
    ],
    dataRetainedTitle: "Dane, których nie dotyczy usunięcie:",
    dataRetainedItems: [
      "Anonimowe opinie (niepowiązane z kontem)",
    ],
    deletionTimeline:
      "Twoje konto i wszystkie powiązane dane są trwale usuwane natychmiast po potwierdzeniu.",
    emailLabel: "Email",
    passwordLabel: "Hasło",
    emailPlaceholder: "ty@example.com",
    submit: "Usuń moje konto",
    submitting: "Usuwanie…",
    successTitle: "Konto usunięte",
    successBody:
      "Twoje konto i wszystkie powiązane dane zostały trwale usunięte.",
  },
  uk: {
    title: "Видалити акаунт Calmisu",
    subtitle:
      "Введи свої дані, щоб назавжди видалити акаунт Calmisu та всі пов'язані дані.",
    warning: "⚠ Ця дія є незворотною і не може бути скасована.",
    dataDeletedTitle: "Дані, які буде назавжди видалено:",
    dataDeletedItems: [
      "Профіль акаунту (ім'я, адреса електронної пошти)",
      "Статус підписки та оплати",
      "Історія сесій медитації та флоу",
      "Тижневі серії відвідувань",
      "Історія використання чату",
    ],
    dataRetainedTitle: "Дані, яких видалення не стосується:",
    dataRetainedItems: [
      "Анонімні відгуки (не пов'язані з акаунтом)",
    ],
    deletionTimeline:
      "Твій акаунт та всі пов'язані дані будуть назавжди видалені одразу після підтвердження.",
    emailLabel: "Електронна пошта",
    passwordLabel: "Пароль",
    emailPlaceholder: "ти@example.com",
    submit: "Видалити мій акаунт",
    submitting: "Видалення…",
    successTitle: "Акаунт видалено",
    successBody: "Твій акаунт та всі пов'язані дані були назавжди видалені.",
  },
};
