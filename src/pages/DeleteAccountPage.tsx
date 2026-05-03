import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { API_BASE_URL } from "@/lib/api";

type Lang = "en" | "pl" | "uk";

const i18n: Record<Lang, {
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
}> = {
  en: {
    title: "Delete your account",
    subtitle: "Enter your credentials to permanently delete your Calmisu account and all associated data.",
    warning: "⚠ This action is permanent and cannot be undone.",
    emailLabel: "Email",
    passwordLabel: "Password",
    emailPlaceholder: "you@example.com",
    submit: "Delete my account",
    submitting: "Deleting…",
    successTitle: "Account deleted",
    successBody: "Your account and all associated data have been permanently removed.",
  },
  pl: {
    title: "Usuń swoje konto",
    subtitle: "Wprowadź swoje dane, aby trwale usunąć konto Calmisu i wszystkie powiązane dane.",
    warning: "⚠ Ta czynność jest nieodwracalna i nie można jej cofnąć.",
    emailLabel: "Email",
    passwordLabel: "Hasło",
    emailPlaceholder: "ty@example.com",
    submit: "Usuń moje konto",
    submitting: "Usuwanie…",
    successTitle: "Konto usunięte",
    successBody: "Twoje konto i wszystkie powiązane dane zostały trwale usunięte.",
  },
  uk: {
    title: "Видалити акаунт",
    subtitle: "Введи свої дані, щоб назавжди видалити акаунт Calmisu та всі пов'язані дані.",
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

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function DeleteAccountPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [deleted, setDeleted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const t = i18n[lang];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/delete-account-web`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setDeleted(true);
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="flex flex-col px-2 lg:px-36">
      <div className="ml-auto mt-10">
        <LanguageSwitcher lang={lang} onLangChange={(l) => setLang(l as Lang)} />
      </div>

      <div className="flex justify-center py-10">
        <div className="w-full max-w-md bg-background rounded-2xl shadow-sm border border-border p-8 flex flex-col gap-6">
          {deleted ? (
            <div className="flex flex-col items-center gap-4 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                ✓
              </div>
              <h1 className="font-display text-2xl text-foreground">
                {t.successTitle}
              </h1>
              <p className="text-muted-foreground font-body">{t.successBody}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <h1 className="font-display text-2xl text-foreground">
                  {t.title}
                </h1>
                <p className="text-muted-foreground font-body text-sm">
                  {t.subtitle}
                </p>
              </div>

              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                <p className="text-sm text-destructive font-body font-medium">
                  {t.warning}
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">{t.emailLabel}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t.emailPlaceholder}
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">{t.passwordLabel}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              autoComplete="current-password"
                              className="pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    variant="destructive"
                    className="w-full mt-2"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? t.submitting : t.submit}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
