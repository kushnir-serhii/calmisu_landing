import { LegalDoc, LegalTitle, LegalHeading, LegalText, LegalList, ExternalLink, SupportEmailLink } from "@/components/legal/LegalDoc";

export const PrivacyPolicyEn = () => (
  <LegalDoc>
    <LegalTitle>Privacy Policy</LegalTitle>
    <LegalText>
      This privacy policy applies to the Alma app (hereby referred to as
      "Application") for mobile devices that was created by Serhii Kushnir
      (hereby referred to as "Service Provider") as a Freemium service. This
      service is intended for use "AS IS".
    </LegalText>
    <LegalText>
      Alma is a meditation and ambient sound application for relaxation and
      focus. It lets you play curated audio tracks, mix ambient layers and
      chimes, import your own audio, and save sound sessions. It is not a
      medical device and does not provide medical advice.
    </LegalText>

    <LegalHeading>Information Collection and Use</LegalHeading>
    <LegalText>
      The Application collects information when you download and use it.
      This information may include:
    </LegalText>
    <LegalList>
      <li>Your device's Internet Protocol address (e.g. IP address)</li>
      <li>
        The screens of the Application that you visit, the time and date of
        your visit, and the time spent on them
      </li>
      <li>The operating system and device model you use on your mobile device</li>
      <li>The version of the Application you are running</li>
    </LegalList>
    <LegalText>
      The Application does not gather precise information about the location
      of your mobile device.
    </LegalText>
    <LegalText>
      For a better experience, while using the Application, the Service
      Provider may require you to provide certain personally identifiable
      information. The information collected and retained includes:
    </LegalText>
    <LegalList>
      <li>Account information: name and email address (via email sign-up or Google Sign-In)</li>
      <li>Subscription information: purchase token, subscription status and renewal date</li>
      <li>Device tokens: push notification token, used only to deliver reminders you have enabled</li>
      <li>App preferences: theme, language, session settings and saved rituals</li>
      <li>Analytics: usage data via Google Analytics for Firebase</li>
    </LegalList>
    <LegalText>
      The information that the Service Provider requests will be retained by
      them and used as described in this privacy policy.
    </LegalText>

    <LegalHeading>Audio You Import Stays on Your Device</LegalHeading>
    <LegalText>
      The Application allows you to import your own audio files from your
      device to use in sessions. These files are copied into the
      Application's private storage on your device only. They are{" "}
      <em>not</em> uploaded to the Service Provider's servers, are not
      accessible to the Service Provider, and are removed when you delete
      them in the Application or uninstall the Application.
    </LegalText>
    <LegalText>
      The Application requests access to your device's files solely so that
      you can select audio to import. It does not scan, index, or transmit
      any other files.
    </LegalText>

    <LegalHeading>Microphone</LegalHeading>
    <LegalText>
      The Application declares audio permissions required by the Android
      audio playback system for uninterrupted background playback. The
      Application does not record audio and does not transmit any microphone
      input.
    </LegalText>

    <LegalHeading>Third Party Access</LegalHeading>
    <LegalText>
      The Service Provider may share your information with third parties in
      the ways described in this privacy statement. Analytics data (such as
      usage patterns and session statistics) is transmitted in aggregated,
      anonymized form to help the Service Provider improve the Application.
      Your information is never sold and is never used for advertising.
    </LegalText>
    <LegalText>
      Please note that the Application utilizes third-party services that
      have their own Privacy Policy about handling data. Below are the links
      to the Privacy Policy of the third-party service providers used by the
      Application:
    </LegalText>
    <LegalList>
      <li>
        <ExternalLink href="https://www.google.com/policies/privacy/">
          Google Play Services
        </ExternalLink>
      </li>
      <li>
        <ExternalLink href="https://policies.google.com/privacy">
          Google Sign-In
        </ExternalLink>
      </li>
      <li>
        <ExternalLink href="https://firebase.google.com/support/privacy">
          Google Analytics for Firebase
        </ExternalLink>
      </li>
      <li>
        <ExternalLink href="https://supabase.com/privacy">
          Supabase
        </ExternalLink>{" "}
        (account database and authentication)
      </li>
      <li>
        <ExternalLink href="https://www.revenuecat.com/privacy">
          RevenueCat
        </ExternalLink>{" "}
        (subscription management)
      </li>
      <li>
        <ExternalLink href="https://expo.io/privacy">
          Expo
        </ExternalLink>
      </li>
      <li>
        <ExternalLink href="https://www.cloudflare.com/privacypolicy/">
          Cloudflare
        </ExternalLink>{" "}
        (delivery of the audio library)
      </li>
    </LegalList>
    <LegalText>
      The Service Provider may disclose User Provided and Automatically
      Collected Information:
    </LegalText>
    <LegalList>
      <li>
        as required by law, such as to comply with a subpoena, or similar
        legal process;
      </li>
      <li>
        when they believe in good faith that disclosure is necessary to
        protect their rights, protect your safety or the safety of others,
        investigate fraud, or respond to a government request;
      </li>
      <li>
        with their trusted service providers who work on their behalf, do
        not have an independent use of the information disclosed to them,
        and have agreed to adhere to the rules set forth in this privacy
        statement.
      </li>
    </LegalList>

    <LegalHeading>Opt-Out Rights</LegalHeading>
    <LegalText>
      You can turn off push notifications at any time in the Application's
      settings or in your device settings. You can stop all data collection
      by uninstalling the Application using the standard uninstall process
      available on your mobile device or via the mobile application
      marketplace.
    </LegalText>

    <LegalHeading>Data Retention and Deletion</LegalHeading>
    <LegalText>
      The Service Provider will retain User Provided data for as long as you
      use the Application and for a reasonable time thereafter.
    </LegalText>
    <LegalText>
      You can delete your account at any time directly within the
      Application (Profile → Settings → Delete Account). You choose between
      two options:
    </LegalText>
    <LegalList>
      <li>
        <strong>Delete after 30 days</strong> — you are signed out
        immediately and your account is permanently deleted 30 days later.
        If you sign in again during those 30 days, the deletion is cancelled
        automatically and your account is restored. Your email address stays
        reserved until the deletion completes.
      </li>
      <li>
        <strong>Delete permanently now</strong> — your account and all
        associated data are erased immediately and cannot be recovered.
      </li>
    </LegalList>
    <LegalText>
      In both cases, data stored locally on your device (imported audio,
      cached settings) is cleared when you confirm. Instructions and an
      email-based alternative are available at{" "}
      <ExternalLink href="https://calmisu.com/alma/en/delete-account/" blank={false}>
        calmisu.com/alma/en/delete-account
      </ExternalLink>
      . Deleting your account does not automatically cancel or refund an
      active subscription — see the Terms of Use.
    </LegalText>
    <LegalText>
      You may also request a copy of your data, or correction of it, by
      contacting the Service Provider at{" "}
      <SupportEmailLink />
      . Requests are answered within 30 days.
    </LegalText>

    <LegalHeading>Children</LegalHeading>
    <LegalText>
      The Service Provider does not use the Application to knowingly solicit
      data from or market to children under the age of 13.
    </LegalText>
    <LegalText>
      The Application does not address anyone under the age of 13. The
      Service Provider does not knowingly collect personally identifiable
      information from children under 13 years of age. In the case the
      Service Provider discovers that a child under 13 has provided personal
      information, the Service Provider will immediately delete this from
      their servers. If you are a parent or guardian and you are aware that
      your child has provided us with personal information, please contact
      the Service Provider at{" "}
      <SupportEmailLink />{" "}
      so that they will be able to take the necessary actions.
    </LegalText>

    <LegalHeading>Security</LegalHeading>
    <LegalText>
      The Service Provider is concerned about safeguarding the
      confidentiality of your information, and provides physical,
      electronic, and procedural safeguards to protect the information it
      processes and maintains. All data transmitted between the Application
      and its servers is encrypted in transit.
    </LegalText>

    <LegalHeading>Changes</LegalHeading>
    <LegalText>
      This Privacy Policy may be updated from time to time for any reason.
      The Service Provider will notify you of any changes by updating this
      page with the new Privacy Policy. You are advised to consult this
      Privacy Policy regularly for any changes, as continued use is deemed
      approval of all changes.
    </LegalText>
    <LegalText>This privacy policy is effective as of 2026-07-28.</LegalText>

    <LegalHeading>Your Consent</LegalHeading>
    <LegalText>
      By using the Application, you are consenting to the processing of your
      information as set forth in this Privacy Policy now and as amended by
      us.
    </LegalText>

    <LegalHeading>Contact Us</LegalHeading>
    <LegalText>
      If you have any questions regarding privacy while using the
      Application, or have questions about these practices, please contact
      the Service Provider via email at{" "}
      <SupportEmailLink />.
    </LegalText>

    <LegalText className="mt-4 leading-snug text-sm text-muted-foreground">Last updated: 28 July 2026</LegalText>
  </LegalDoc>
);
