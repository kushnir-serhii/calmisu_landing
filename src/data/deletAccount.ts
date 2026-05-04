import { Lang } from "@/pages/DeleteAccountPage";

export const i18n: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    warning: string;
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
    title: "Delete your account",
    subtitle:
      "Enter your credentials to permanently delete your Calmisu account and all associated data.",
    warning: "⚠ This action is permanent and cannot be undone.",
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
    title: "Usuń swoje konto",
    subtitle:
      "Wprowadź swoje dane, aby trwale usunąć konto Calmisu i wszystkie powiązane dane.",
    warning: "⚠ Ta czynność jest nieodwracalna i nie można jej cofnąć.",
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
    title: "Видалити акаунт",
    subtitle:
      "Введи свої дані, щоб назавжди видалити акаунт Calmisu та всі пов'язані дані.",
    warning: "⚠ Ця дія є незворотною і не може бути скасована.",
    emailLabel: "Електронна пошта",
    passwordLabel: "Пароль",
    emailPlaceholder: "ти@example.com",
    submit: "Видалити мій акаунт",
    submitting: "Видалення…",
    successTitle: "Акаунт видалено",
    successBody: "Твій акаунт та всі пов'язані дані були назавжди видалені.",
  },
};
