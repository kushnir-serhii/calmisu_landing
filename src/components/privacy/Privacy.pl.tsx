import { EMAIL_SUPPORT, GMAIL_COMPOSE_URL } from "@/components/constants/mail";

export const PrivacyPl = () => (
  <div className="max-w-xl mx-auto px-6 py-4 sm:px-12">
    <strong className="block font-bold">Polityka Prywatności</strong>
    <p className="mt-1 leading-snug text-sm">
      Niniejsza polityka prywatności dotyczy aplikacji Calmisu (zwanej dalej
      „Aplikacją") na urządzenia mobilne, stworzonej przez Serhii Kushnir
      (zwanego dalej „Dostawcą Usług") jako usługa Freemium. Usługa jest
      przeznaczona do użytku „W STANIE, W JAKIM JEST".
    </p>

    <strong className="block font-bold mt-4">Zbieranie i Wykorzystanie Informacji</strong>
    <p className="mt-1 leading-snug text-sm">
      Aplikacja zbiera informacje w momencie pobrania i korzystania z niej.
      Informacje te mogą obejmować:
    </p>
    <ul className="list-disc pl-6 mt-1 text-sm space-y-1">
      <li>Adres protokołu internetowego Twojego urządzenia (np. adres IP)</li>
      <li>
        Strony Aplikacji, które odwiedzasz, data i godzina wizyty oraz czas
        spędzony na tych stronach
      </li>
      <li>Czas spędzony w Aplikacji</li>
      <li>System operacyjny używany na Twoim urządzeniu mobilnym</li>
    </ul>
    <p className="mt-1 leading-snug text-sm">
      Aplikacja nie gromadzi precyzyjnych informacji o lokalizacji Twojego
      urządzenia mobilnego.
    </p>
    <p className="mt-1 leading-snug text-sm">
      Aplikacja wykorzystuje technologię Sztucznej Inteligencji (AI) do obsługi
      funkcji czatu. Twoje wiadomości są przetwarzane przez OpenAI w celu
      generowania odpowiedzi. Zapoznaj się z{" "}
      <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
        Polityką Prywatności OpenAI
      </a>{" "}
      aby dowiedzieć się, jak Twoje dane są przetwarzane podczas korzystania z AI.
    </p>
    <p className="mt-1 leading-snug text-sm">
      Dostawca Usług może wykorzystywać podane przez Ciebie informacje, aby
      kontaktować się z Tobą od czasu do czasu w celu przekazania ważnych
      informacji, wymaganych powiadomień i promocji marketingowych.
    </p>
    <p className="mt-1 leading-snug text-sm">
      Aby zapewnić lepsze korzystanie z Aplikacji, Dostawca Usług może wymagać
      podania pewnych danych osobowych. Zbierane i przechowywane informacje
      obejmują:
    </p>
    <ul className="list-disc pl-6 mt-1 text-sm space-y-1">
      <li>Dane konta: imię, adres e-mail</li>
      <li>Dane subskrypcji: token zakupu, data następnej płatności</li>
      <li>Tokeny urządzenia: token powiadomień push</li>
      <li>Analityka: dane o użytkowaniu za pośrednictwem Firebase Analytics i Google Analytics</li>
    </ul>
    <p className="mt-1 leading-snug text-sm">
      Informacje, o które prosi Dostawca Usług, będą przez niego przechowywane
      i wykorzystywane zgodnie z niniejszą polityką prywatności.
    </p>

    <strong className="block font-bold mt-4">Dostęp Stron Trzecich</strong>
    <p className="mt-1 leading-snug text-sm">
      Dostawca Usług może udostępniać Twoje informacje stronom trzecim w sposób
      opisany w niniejszym oświadczeniu o prywatności. Dane analityczne (takie
      jak wzorce użytkowania i statystyki sesji) są przekazywane w formie
      zagregowanej i zanonimizowanej, aby pomóc Dostawcy Usług w ulepszaniu
      Aplikacji. Wiadomości czatu wprowadzane przez użytkownika są przetwarzane
      przez OpenAI w ich oryginalnej formie wyłącznie w celu generowania
      odpowiedzi AI; nie są sprzedawane ani wykorzystywane do celów reklamowych.
    </p>
    <p className="mt-1 leading-snug text-sm">
      Należy pamiętać, że Aplikacja korzysta z usług zewnętrznych, które
      posiadają własną Politykę Prywatności dotyczącą przetwarzania danych.
      Poniżej znajdują się linki do Polityk Prywatności zewnętrznych
      dostawców usług używanych przez Aplikację:
    </p>
    <ul className="list-disc pl-6 mt-1 text-sm space-y-1">
      <li>
        <a href="https://www.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Google Play Services
        </a>
      </li>
      <li>
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Google Sign-In
        </a>
      </li>
      <li>
        <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Google Analytics for Firebase
        </a>
      </li>
      <li>
        <a href="https://expo.io/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Expo
        </a>
      </li>
      <li>
        <a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          RevenueCat
        </a>
      </li>
      <li>
        <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          OpenAI
        </a>
      </li>
    </ul>
    <p className="mt-1 leading-snug text-sm">
      Dostawca Usług może ujawniać Dane Dostarczone przez Użytkownika i
      Automatycznie Zebrane Informacje:
    </p>
    <ul className="list-disc pl-6 mt-1 text-sm space-y-1">
      <li>
        gdy jest to wymagane przez prawo, np. w celu zastosowania się do wezwania
        sądowego lub podobnego procesu prawnego;
      </li>
      <li>
        gdy w dobrej wierze uważa, że ujawnienie jest niezbędne do ochrony swoich
        praw, ochrony Twojego bezpieczeństwa lub bezpieczeństwa innych, zbadania
        oszustwa lub odpowiedzi na żądanie rządowe;
      </li>
      <li>
        ze swoimi zaufanymi dostawcami usług, którzy działają w jego imieniu, nie
        mają niezależnego użytku z ujawnionych informacji i zobowiązali się do
        przestrzegania zasad określonych w niniejszym oświadczeniu o prywatności.
      </li>
    </ul>

    <strong className="block font-bold mt-4">Prawo do Rezygnacji</strong>
    <p className="mt-1 leading-snug text-sm">
      Możesz w dowolnym momencie zrezygnować z gromadzenia danych analitycznych
      w ustawieniach prywatności aplikacji, bez konieczności jej odinstalowywania.
      Możesz również zatrzymać wszelkie zbieranie danych, odinstalowując Aplikację
      przy użyciu standardowych procesów dostępnych na Twoim urządzeniu mobilnym
      lub za pośrednictwem sklepu z aplikacjami.
    </p>

    <strong className="block font-bold mt-4">Polityka Przechowywania Danych</strong>
    <p className="mt-1 leading-snug text-sm">
      Dostawca Usług będzie przechowywać Dane Dostarczone przez Użytkownika tak
      długo, jak korzystasz z Aplikacji, oraz przez rozsądny czas po tym
      okresie. Możesz zażądać usunięcia swojego konta i wszystkich powiązanych
      danych w dowolnym momencie bezpośrednio w Aplikacji (Profil → Ustawienia
      → Usuń konto) lub za pomocą formularza na stronie calmisu.com/delete-account.
    </p>
    <p className="mt-1 leading-snug text-sm">
      Po usunięciu konta przez aplikację Twoje konto jest natychmiast
      dezaktywowane i zaplanowane do trwałego usunięcia po 30 dniach. W tym
      czasie możesz zalogować się ponownie, aby przywrócić konto i anulować
      usunięcie. Po 30 dniach konto i wszystkie powiązane dane są trwale i
      nieodwracalnie usuwane. Jeśli wymagasz natychmiastowego trwałego
      usunięcia, możesz wybrać tę opcję w aplikacji lub skorzystać z
      powyższego formularza.
    </p>
    <p className="mt-1 leading-snug text-sm">
      Alternatywnie prosimy o kontakt pod adresem{" "}
      <a href={`${GMAIL_COMPOSE_URL}${EMAIL_SUPPORT}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{EMAIL_SUPPORT}</a>,
      a Dostawca Usług odpowie w rozsądnym terminie.
    </p>

    <strong className="block font-bold mt-4">Dzieci</strong>
    <p className="mt-1 leading-snug text-sm">
      Dostawca Usług nie używa Aplikacji do świadomego pozyskiwania danych od
      dzieci poniżej 13 roku życia ani do ich marketingu.
    </p>
    <p className="mt-1 leading-snug text-sm">
      Aplikacja nie jest przeznaczona dla osób poniżej 13 roku życia. Dostawca
      Usług nie gromadzi świadomie danych osobowych od dzieci poniżej 13 roku
      życia. W przypadku odkrycia, że dziecko poniżej 13 roku życia podało
      informacje osobowe, Dostawca Usług niezwłocznie usunie je ze swoich
      serwerów. Jeśli jesteś rodzicem lub opiekunem i wiesz, że Twoje dziecko
      przekazało nam dane osobowe, prosimy o kontakt z Dostawcą Usług (
      <a href={`${GMAIL_COMPOSE_URL}${EMAIL_SUPPORT}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{EMAIL_SUPPORT}</a>),
      aby mógł podjąć niezbędne działania.
    </p>

    <strong className="block font-bold mt-4">Bezpieczeństwo</strong>
    <p className="mt-1 leading-snug text-sm">
      Dostawca Usług dba o ochronę poufności Twoich informacji. Dostawca Usług
      zapewnia fizyczne, elektroniczne i proceduralne zabezpieczenia chroniące
      przetwarzane i przechowywane przez niego informacje.
    </p>

    <strong className="block font-bold mt-4">Zmiany</strong>
    <p className="mt-1 leading-snug text-sm">
      Niniejsza Polityka Prywatności może być okresowo aktualizowana z różnych
      powodów. Dostawca Usług powiadomi Cię o wszelkich zmianach Polityki
      Prywatności poprzez aktualizację tej strony. Zaleca się regularne
      sprawdzanie niniejszej Polityki Prywatności pod kątem zmian, ponieważ
      dalsze korzystanie z Aplikacji jest równoznaczne z akceptacją wszelkich
      zmian.
    </p>
    <p className="mt-1 leading-snug text-sm">Niniejsza polityka prywatności obowiązuje od 2026-03-10</p>

    <strong className="block font-bold mt-4">Twoja Zgoda</strong>
    <p className="mt-1 leading-snug text-sm">
      Korzystając z Aplikacji, wyrażasz zgodę na przetwarzanie Twoich informacji
      zgodnie z niniejszą Polityką Prywatności w jej aktualnym brzmieniu oraz
      w brzmieniu zmienionym przez nas.
    </p>

    <strong className="block font-bold mt-4">Kontakt</strong>
    <p className="mt-1 leading-snug text-sm">
      Jeśli masz jakiekolwiek pytania dotyczące prywatności podczas korzystania
      z Aplikacji lub pytania dotyczące praktyk, prosimy o kontakt z Dostawcą
      Usług za pośrednictwem poczty elektronicznej:{" "}
      <a href={`${GMAIL_COMPOSE_URL}${EMAIL_SUPPORT}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{EMAIL_SUPPORT}</a>.
    </p>
  </div>
);
