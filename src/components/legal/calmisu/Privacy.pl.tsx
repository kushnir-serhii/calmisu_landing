import { LegalDoc, LegalTitle, LegalHeading, LegalText, LegalList, ExternalLink, SupportEmailLink } from "@/components/legal/LegalDoc";

export const PrivacyPl = () => (
  <LegalDoc>
    <LegalTitle>Polityka Prywatności</LegalTitle>
    <LegalText>
      Niniejsza polityka prywatności dotyczy aplikacji Calmisu (zwanej dalej
      „Aplikacją") na urządzenia mobilne, stworzonej przez Serhii Kushnir
      (zwanego dalej „Dostawcą Usług") jako usługa Freemium. Usługa jest
      przeznaczona do użytku „W STANIE, W JAKIM JEST". Dotyczy ona również
      strony internetowej calmisu.com, w tym opisanego poniżej quizu Calm
      Profile.
    </LegalText>

    <LegalHeading>Zbieranie i Wykorzystanie Informacji</LegalHeading>
    <LegalText>
      Aplikacja zbiera informacje w momencie pobrania i korzystania z niej.
      Informacje te mogą obejmować:
    </LegalText>
    <LegalList>
      <li>Adres protokołu internetowego Twojego urządzenia (np. adres IP)</li>
      <li>
        Strony Aplikacji, które odwiedzasz, data i godzina wizyty oraz czas
        spędzony na tych stronach
      </li>
      <li>Czas spędzony w Aplikacji</li>
      <li>System operacyjny używany na Twoim urządzeniu mobilnym</li>
    </LegalList>
    <LegalText>
      Aplikacja nie gromadzi precyzyjnych informacji o lokalizacji Twojego
      urządzenia mobilnego.
    </LegalText>
    <LegalText>
      Aplikacja wykorzystuje technologię Sztucznej Inteligencji (AI) do obsługi
      funkcji czatu. Twoje wiadomości są przetwarzane przez OpenAI w celu
      generowania odpowiedzi. Zapoznaj się z{" "}
      <ExternalLink href="https://openai.com/policies/privacy-policy">
        Polityką Prywatności OpenAI
      </ExternalLink>{" "}
      aby dowiedzieć się, jak Twoje dane są przetwarzane podczas korzystania z AI.
    </LegalText>
    <LegalText>
      Dostawca Usług może wykorzystywać podane przez Ciebie informacje, aby
      kontaktować się z Tobą od czasu do czasu w celu przekazania ważnych
      informacji, wymaganych powiadomień i promocji marketingowych.
    </LegalText>
    <LegalText>
      Aby zapewnić lepsze korzystanie z Aplikacji, Dostawca Usług może wymagać
      podania pewnych danych osobowych. Zbierane i przechowywane informacje
      obejmują:
    </LegalText>
    <LegalList>
      <li>Dane konta: imię, adres e-mail</li>
      <li>Dane subskrypcji: token zakupu, data następnej płatności</li>
      <li>Tokeny urządzenia: token powiadomień push</li>
      <li>Analityka: dane o użytkowaniu za pośrednictwem Firebase Analytics i Google Analytics</li>
    </LegalList>
    <LegalText>
      Informacje, o które prosi Dostawca Usług, będą przez niego przechowywane
      i wykorzystywane zgodnie z niniejszą polityką prywatności.
    </LegalText>

    <LegalHeading>Quiz Calm Profile (Strona internetowa)</LegalHeading>
    <LegalText>
      Strona calmisu.com udostępnia quiz "Calm Profile", który proponuje
      uspokajającą rutynę. Quiz służy wyłącznie do samodzielnej refleksji. Nie
      jest testem medycznym, nie generuje wyniku punktowego ani oceny nasilenia
      objawów i nie stanowi diagnozy ani zastępstwa dla profesjonalnej opieki.
    </LegalText>
    <LegalText>
      Twoje odpowiedzi w quizie — w tym pytania o odczucia ciała i o to, co
      dzieje się z Twoimi myślami — pozostają w Twojej przeglądarce. Są
      przechowywane na samej stronie i zakodowane w adresie strony z wynikiem,
      dzięki czemu Twój link nadal działa. Nigdy nie są wysyłane na serwery
      Usługodawcy i nie istnieje miejsce w bazie danych, które mogłoby je
      przechować.
    </LegalText>
    <LegalText>
      Jeśli poprosisz o 7-dniowy plan e-mailem, Usługodawca przechowuje
      wyłącznie:
    </LegalText>
    <LegalList>
      <li>Twój adres e-mail</li>
      <li>
        Nazwę uzyskanego profilu (pojedyncze słowo, np. "sleep" lub "anxiety")
        — nigdy poszczególnych odpowiedzi, które do niego doprowadziły
      </li>
      <li>
        Źródło zgłoszenia (quiz lub zapis na listę oczekujących w aplikacji)
        oraz jego język
      </li>
      <li>
        Wybraną przez Ciebie platformę telefonu (iPhone lub Android) — wybór
        należy do Ciebie i służy do ustalenia, czy przysługuje Ci kod
        promocyjny
      </li>
      <li>Fakt wyrażenia zgody oraz jej datę</li>
      <li>
        Na co dokładnie wyraziłeś/-aś zgodę — na otrzymywanie planu i
        okazjonalnych wskazówek albo na jedno powiadomienie o dostępności w
        App Store, w zależności od sposobu zgłoszenia
      </li>
      <li>Jednorazowy kod promocyjny wydany Tobie oraz datę jego ważności</li>
    </LegalList>
    <LegalText>
      Adres e-mail służy do wysłania Ci planu oraz okazjonalnych wskazówek
      dotyczących lęku. Z każdej takiej wiadomości możesz zrezygnować jednym
      kliknięciem lub poprosić o usunięcie swojego adresu, pisząc na{" "}
      <SupportEmailLink />.
      Twój adres nigdy nie jest sprzedawany. Podanie adresu e-mail jest
      dobrowolne — wynik profilu zobaczysz niezależnie od tego, czy go podasz.
    </LegalText>
    <LegalText>
      Pamięć lokalna przeglądarki służy do zapamiętania — wyłącznie na Twoim
      urządzeniu — że plan został odblokowany oraz jaki kod promocyjny
      otrzymujesz, abyś mógł później ponownie otworzyć swój plan. Wyczyszczenie
      danych przeglądarki usuwa te informacje. Zdarzenia analityczne strony
      (takie jak rozpoczęcie lub ukończenie quizu) zapisują wyłącznie nazwę
      profilu, nigdy Twoje odpowiedzi, i są zbierane dopiero po zaakceptowaniu
      banera dotyczącego plików cookie.
    </LegalText>

    <LegalHeading>Dostęp Stron Trzecich</LegalHeading>
    <LegalText>
      Dostawca Usług może udostępniać Twoje informacje stronom trzecim w sposób
      opisany w niniejszym oświadczeniu o prywatności. Dane analityczne (takie
      jak wzorce użytkowania i statystyki sesji) są przekazywane w formie
      zagregowanej i zanonimizowanej, aby pomóc Dostawcy Usług w ulepszaniu
      Aplikacji. Wiadomości czatu wprowadzane przez użytkownika są przetwarzane
      przez OpenAI w ich oryginalnej formie wyłącznie w celu generowania
      odpowiedzi AI; nie są sprzedawane ani wykorzystywane do celów reklamowych.
    </LegalText>
    <LegalText>
      Należy pamiętać, że Aplikacja korzysta z usług zewnętrznych, które
      posiadają własną Politykę Prywatności dotyczącą przetwarzania danych.
      Poniżej znajdują się linki do Polityk Prywatności zewnętrznych
      dostawców usług używanych przez Aplikację:
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
        <ExternalLink href="https://expo.io/privacy">
          Expo
        </ExternalLink>
      </li>
      <li>
        <ExternalLink href="https://www.revenuecat.com/privacy">
          RevenueCat
        </ExternalLink>
      </li>
      <li>
        <ExternalLink href="https://openai.com/policies/privacy-policy">
          OpenAI
        </ExternalLink>
      </li>
    </LegalList>
    <LegalText>
      Dostawca Usług może ujawniać Dane Dostarczone przez Użytkownika i
      Automatycznie Zebrane Informacje:
    </LegalText>
    <LegalList>
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
    </LegalList>

    <LegalHeading>Prawo do Rezygnacji</LegalHeading>
    <LegalText>
      Możesz w dowolnym momencie zrezygnować z gromadzenia danych analitycznych
      w ustawieniach prywatności aplikacji, bez konieczności jej odinstalowywania.
      Możesz również zatrzymać wszelkie zbieranie danych, odinstalowując Aplikację
      przy użyciu standardowych procesów dostępnych na Twoim urządzeniu mobilnym
      lub za pośrednictwem sklepu z aplikacjami.
    </LegalText>

    <LegalHeading>Polityka Przechowywania Danych</LegalHeading>
    <LegalText>
      Dostawca Usług będzie przechowywać Dane Dostarczone przez Użytkownika tak
      długo, jak korzystasz z Aplikacji, oraz przez rozsądny czas po tym
      okresie. Możesz zażądać usunięcia swojego konta i wszystkich powiązanych
      danych w dowolnym momencie bezpośrednio w Aplikacji (Profil → Ustawienia
      → Usuń konto) lub za pomocą formularza na stronie calmisu.com/delete-account.
    </LegalText>
    <LegalText>
      Po usunięciu konta przez aplikację Twoje konto jest natychmiast
      dezaktywowane i zaplanowane do trwałego usunięcia po 30 dniach. W tym
      czasie możesz zalogować się ponownie, aby przywrócić konto i anulować
      usunięcie. Po 30 dniach konto i wszystkie powiązane dane są trwale i
      nieodwracalnie usuwane. Jeśli wymagasz natychmiastowego trwałego
      usunięcia, możesz wybrać tę opcję w aplikacji lub skorzystać z
      powyższego formularza.
    </LegalText>
    <LegalText>
      Alternatywnie prosimy o kontakt pod adresem{" "}
      <SupportEmailLink />,
      a Dostawca Usług odpowie w rozsądnym terminie.
    </LegalText>

    <LegalHeading>Dzieci</LegalHeading>
    <LegalText>
      Dostawca Usług nie używa Aplikacji do świadomego pozyskiwania danych od
      dzieci poniżej 13 roku życia ani do ich marketingu.
    </LegalText>
    <LegalText>
      Aplikacja nie jest przeznaczona dla osób poniżej 13 roku życia. Dostawca
      Usług nie gromadzi świadomie danych osobowych od dzieci poniżej 13 roku
      życia. W przypadku odkrycia, że dziecko poniżej 13 roku życia podało
      informacje osobowe, Dostawca Usług niezwłocznie usunie je ze swoich
      serwerów. Jeśli jesteś rodzicem lub opiekunem i wiesz, że Twoje dziecko
      przekazało nam dane osobowe, prosimy o kontakt z Dostawcą Usług (
      <SupportEmailLink />),
      aby mógł podjąć niezbędne działania.
    </LegalText>

    <LegalHeading>Bezpieczeństwo</LegalHeading>
    <LegalText>
      Dostawca Usług dba o ochronę poufności Twoich informacji. Dostawca Usług
      zapewnia fizyczne, elektroniczne i proceduralne zabezpieczenia chroniące
      przetwarzane i przechowywane przez niego informacje.
    </LegalText>

    <LegalHeading>Zmiany</LegalHeading>
    <LegalText>
      Niniejsza Polityka Prywatności może być okresowo aktualizowana z różnych
      powodów. Dostawca Usług powiadomi Cię o wszelkich zmianach Polityki
      Prywatności poprzez aktualizację tej strony. Zaleca się regularne
      sprawdzanie niniejszej Polityki Prywatności pod kątem zmian, ponieważ
      dalsze korzystanie z Aplikacji jest równoznaczne z akceptacją wszelkich
      zmian.
    </LegalText>
    <LegalText>Niniejsza polityka prywatności obowiązuje od 2026-09-22</LegalText>

    <LegalHeading>Twoja Zgoda</LegalHeading>
    <LegalText>
      Korzystając z Aplikacji, wyrażasz zgodę na przetwarzanie Twoich informacji
      zgodnie z niniejszą Polityką Prywatności w jej aktualnym brzmieniu oraz
      w brzmieniu zmienionym przez nas.
    </LegalText>

    <LegalHeading>Kontakt</LegalHeading>
    <LegalText>
      Jeśli masz jakiekolwiek pytania dotyczące prywatności podczas korzystania
      z Aplikacji lub pytania dotyczące praktyk, prosimy o kontakt z Dostawcą
      Usług za pośrednictwem poczty elektronicznej:{" "}
      <SupportEmailLink />.
    </LegalText>
  </LegalDoc>
);
