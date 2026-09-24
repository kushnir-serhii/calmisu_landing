import { SupportEmailLink } from "@/components/legal/LegalDoc";
import { DeleteCard, DeleteHeader, DeleteSection, Divider, DeleteNote } from "@/components/legal/alma/DeleteAccountParts";

export const DeleteAccountEn = () => (
  <DeleteCard>
    <DeleteHeader
      title="Delete Your Account"
      subtitle="You can delete your Alma account and all associated data at any time."
    />

    <DeleteSection title="What will be deleted">
      <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
        <li>Your profile (name, email address)</li>
        <li>Saved rituals, sessions and mixer presets</li>
        <li>App preferences, reminders and notification history</li>
        <li>Listening history and progress</li>
        <li>Subscription records linked to your account</li>
        <li>Audio you imported, which is stored only on your device</li>
      </ul>
    </DeleteSection>

    <Divider />

    <DeleteSection title="Delete only some of your data (keep your account)">
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
        <SupportEmailLink />{" "}
        from your account's address describing what you want removed. We respond within 30 days.
      </p>
    </DeleteSection>

    <Divider />

    <DeleteSection title="What is kept, and for how long">
      <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
        <li>Deleted items are removed from our systems and your device immediately; we keep no copy once deletion completes.</li>
        <li>If you choose the 30-day option, your account data is retained for those 30 days so you can restore it, then permanently deleted.</li>
        <li>Payment and subscription transaction records are held by Google Play, not by us. Request those through Google Play.</li>
        <li>Anonymised, aggregated analytics that cannot identify you may be retained.</li>
      </ul>
    </DeleteSection>

    <Divider />

    <DeleteSection title="Delete your whole account — Option 1, in the app">
      <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
        <li>Open the Alma app and sign in.</li>
        <li>Go to <strong className="text-foreground">Profile</strong> → <strong className="text-foreground">Settings</strong>.</li>
        <li>Tap <strong className="text-foreground">Delete Account</strong>.</li>
        <li>Choose whether to keep the 30-day grace period or delete permanently now, then confirm.</li>
      </ol>
    </DeleteSection>

    <DeleteNote>
      <strong>Delete after 30 days</strong> (default) — you are signed out immediately and your account is
      permanently deleted 30 days later. Sign in again at any point during those 30 days and your account is
      restored automatically, with no extra steps. Your email address stays reserved until the deletion
      completes, so it cannot be used for a new account in the meantime.
    </DeleteNote>

    <DeleteNote variant="danger">
      <strong>Delete permanently now</strong> — your account and all data are erased immediately. This cannot
      be undone and nothing can be restored.
    </DeleteNote>

    <Divider />

    <DeleteNote>
      Deleting your account does <strong>not</strong> cancel an active subscription. Cancel it separately in{" "}
      <a href="https://play.google.com/store/account/subscriptions" target="_blank" rel="noopener noreferrer" className="underline">
        Google Play → Subscriptions
      </a>
      . Refunds are handled by Google Play.
    </DeleteNote>

    <Divider />

    <DeleteSection title="Delete your whole account — Option 2, by email">
      <p className="text-muted-foreground">
        If you cannot access the app, send a deletion request from the email address linked to your account to{" "}
        <SupportEmailLink />{" "}
        with the subject "Delete my Alma account". We will verify the request and process it within 30 days.
      </p>
    </DeleteSection>
  </DeleteCard>
);
