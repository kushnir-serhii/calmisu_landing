import { EMAIL_SUPPORT, GMAIL_COMPOSE_URL } from "@/components/constants/mail";

export const DeleteAccountEn = () => (
  <div className="flex justify-center py-10">
    <div className="w-full max-w-md bg-background rounded-2xl shadow-sm border border-border p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl text-foreground">Delete Your Account</h1>
        <p className="text-muted-foreground font-body text-sm">
          You can delete your Alma account and all associated data at any time.
        </p>
      </div>

      <div className="flex flex-col gap-1 text-sm font-body">
        <p className="font-medium text-foreground mb-1">What will be deleted</p>
        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
          <li>Your profile (name, email address)</li>
          <li>Saved rituals, sessions and mixer presets</li>
          <li>App preferences, reminders and notification history</li>
          <li>Listening history and progress</li>
          <li>Subscription records linked to your account</li>
          <li>Audio you imported, which is stored only on your device</li>
        </ul>
      </div>

      <hr className="border-border" />

      <div className="flex flex-col gap-1 text-sm font-body">
        <p className="font-medium text-foreground mb-1">
          Delete only some of your data (keep your account)
        </p>
        <p className="text-muted-foreground">
          You do not have to delete your account to remove individual data. In the Alma app you can:
        </p>
        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground mt-1">
          <li><strong className="text-foreground">Imported audio</strong> — Vault → open the ⋯ menu on a file → Delete. Removes the file from your device.</li>
          <li><strong className="text-foreground">Saved rituals</strong> — Vault → open the ⋯ menu on a ritual → Delete.</li>
          <li><strong className="text-foreground">Reminders and notification history</strong> — Profile → Settings → Notifications → turn reminders off.</li>
          <li><strong className="text-foreground">Usage analytics</strong> — Profile → Settings → Privacy → turn off Usage analytics. This stops collection immediately.</li>
        </ul>
        <p className="text-muted-foreground mt-1">
          For anything else, email{" "}
          <a href={`${GMAIL_COMPOSE_URL}${EMAIL_SUPPORT}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{EMAIL_SUPPORT}</a>{" "}
          from your account's address describing what you want removed. We respond within 30 days.
        </p>
      </div>

      <hr className="border-border" />

      <div className="flex flex-col gap-1 text-sm font-body">
        <p className="font-medium text-foreground mb-1">What is kept, and for how long</p>
        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
          <li>Deleted items are removed from our systems and your device immediately; we keep no copy once deletion completes.</li>
          <li>If you choose the 30-day option, your account data is retained for those 30 days so you can restore it, then permanently deleted.</li>
          <li>Payment and subscription transaction records are held by Google Play, not by us. Request those through Google Play.</li>
          <li>Anonymised, aggregated analytics that cannot identify you may be retained.</li>
        </ul>
      </div>

      <hr className="border-border" />

      <div className="flex flex-col gap-1 text-sm font-body">
        <p className="font-medium text-foreground mb-1">Delete your whole account — Option 1, in the app</p>
        <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
          <li>Open the Alma app and sign in.</li>
          <li>Go to <strong className="text-foreground">Profile</strong> → <strong className="text-foreground">Settings</strong>.</li>
          <li>Tap <strong className="text-foreground">Delete Account</strong>.</li>
          <li>Choose whether to keep the 30-day grace period or delete permanently now, then confirm.</li>
        </ol>
      </div>

      <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
        <strong>Delete after 30 days</strong> (default) — you are signed out immediately and your account is
        permanently deleted 30 days later. Sign in again at any point during those 30 days and your account is
        restored automatically, with no extra steps. Your email address stays reserved until the deletion
        completes, so it cannot be used for a new account in the meantime.
      </p>

      <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
        <strong>Delete permanently now</strong> — your account and all data are erased immediately. This cannot
        be undone and nothing can be restored.
      </p>

      <hr className="border-border" />

      <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
        Deleting your account does <strong>not</strong> cancel an active subscription. Cancel it separately in{" "}
        <a href="https://play.google.com/store/account/subscriptions" target="_blank" rel="noopener noreferrer" className="underline">
          Google Play → Subscriptions
        </a>
        . Refunds are handled by Google Play.
      </p>

      <hr className="border-border" />

      <div className="flex flex-col gap-1 text-sm font-body">
        <p className="font-medium text-foreground mb-1">Delete your whole account — Option 2, by email</p>
        <p className="text-muted-foreground">
          If you cannot access the app, send a deletion request from the email address linked to your account to{" "}
          <a href={`${GMAIL_COMPOSE_URL}${EMAIL_SUPPORT}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{EMAIL_SUPPORT}</a>{" "}
          with the subject "Delete my Alma account". We will verify the request and process it within 30 days.
        </p>
      </div>
    </div>
  </div>
);
