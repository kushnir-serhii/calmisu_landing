import { EMAIL_SUPPORT, GMAIL_COMPOSE_URL } from "@/components/constants/mail";

export const DeleteAccountUk = () => (
  <div className="flex justify-center py-10">
    <div className="w-full max-w-md bg-background rounded-2xl shadow-sm border border-border p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl text-foreground">Видалення акаунта</h1>
        <p className="text-muted-foreground font-body text-sm">
          Ви можете будь-коли видалити свій акаунт Alma і всі пов'язані з ним дані.
        </p>
      </div>

      <div className="flex flex-col gap-1 text-sm font-body">
        <p className="font-medium text-foreground mb-1">Що буде видалено</p>
        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
          <li>Ваш профіль (ім'я, адреса електронної пошти)</li>
          <li>Збережені ритуали, сесії та пресети мікшера</li>
          <li>Налаштування застосунку, нагадування та історія сповіщень</li>
          <li>Історія прослуховування та прогрес</li>
          <li>Записи про підписку, пов'язані з вашим акаунтом</li>
          <li>Імпортоване вами аудіо, яке зберігається лише на вашому пристрої</li>
        </ul>
      </div>

      <hr className="border-border" />

      <div className="flex flex-col gap-1 text-sm font-body">
        <p className="font-medium text-foreground mb-1">
          Видалити лише частину даних (зберігши акаунт)
        </p>
        <p className="text-muted-foreground">
          Щоб видалити окремі дані, не обов'язково видаляти акаунт. У застосунку Alma ви можете:
        </p>
        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground mt-1">
          <li><strong className="text-foreground">Імпортоване аудіо</strong> — Сховище → відкрийте меню ⋯ файлу → Видалити. Файл зникає з пристрою.</li>
          <li><strong className="text-foreground">Збережені ритуали</strong> — Сховище → відкрийте меню ⋯ ритуалу → Видалити.</li>
          <li><strong className="text-foreground">Нагадування та історія сповіщень</strong> — Профіль → Налаштування → Сповіщення → вимкніть нагадування.</li>
          <li><strong className="text-foreground">Аналітика використання</strong> — Профіль → Налаштування → Приватність → вимкніть «Аналітика використання». Збір даних припиняється негайно.</li>
        </ul>
        <p className="text-muted-foreground mt-1">
          Щодо іншого напишіть на{" "}
          <a href={`${GMAIL_COMPOSE_URL}${EMAIL_SUPPORT}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{EMAIL_SUPPORT}</a>{" "}
          з адреси вашого акаунта, зазначивши, що саме потрібно видалити. Ми відповідаємо протягом 30 днів.
        </p>
      </div>

      <hr className="border-border" />

      <div className="flex flex-col gap-1 text-sm font-body">
        <p className="font-medium text-foreground mb-1">Що зберігається і як довго</p>
        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
          <li>Видалені елементи стираються з наших систем і вашого пристрою негайно; після завершення видалення ми не зберігаємо копій.</li>
          <li>Якщо ви обрали варіант із 30 днями, дані акаунта зберігаються протягом цього часу, щоб ви могли його відновити, а потім видаляються остаточно.</li>
          <li>Записи про платежі та підписки зберігає Google Play, а не ми. Запитуйте їх через Google Play.</li>
          <li>Знеособлені агреговані аналітичні дані, які не дозволяють вас ідентифікувати, можуть зберігатися.</li>
        </ul>
      </div>

      <hr className="border-border" />

      <div className="flex flex-col gap-1 text-sm font-body">
        <p className="font-medium text-foreground mb-1">Видалити акаунт повністю — Варіант 1, у застосунку</p>
        <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
          <li>Відкрийте застосунок Alma та увійдіть.</li>
          <li>Перейдіть до <strong className="text-foreground">Профіль</strong> → <strong className="text-foreground">Налаштування</strong>.</li>
          <li>Натисніть <strong className="text-foreground">Видалити акаунт</strong>.</li>
          <li>Оберіть, залишити 30-денний період очікування чи видалити назавжди зараз, і підтвердьте.</li>
        </ol>
      </div>

      <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
        <strong>Видалити через 30 днів</strong> (за замовчуванням) — вас одразу буде виведено з акаунта, а сам
        акаунт остаточно видалять через 30 днів. Якщо ви увійдете знову в будь-який момент протягом цих 30
        днів, ваш акаунт відновиться автоматично, без додаткових дій. Ваша адреса електронної пошти
        залишається зарезервованою до завершення видалення, тому її не можна використати для нового акаунта в
        цей час.
      </p>

      <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
        <strong>Видалити назавжди зараз</strong> — ваш акаунт і всі дані стираються негайно. Цю дію неможливо
        скасувати, і нічого не вдасться відновити.
      </p>

      <hr className="border-border" />

      <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
        Видалення акаунта <strong>не</strong> скасовує активну підписку. Скасуйте її окремо в{" "}
        <a href="https://play.google.com/store/account/subscriptions" target="_blank" rel="noopener noreferrer" className="underline">
          Google Play → Підписки
        </a>
        . Повернення коштів здійснює Google Play.
      </p>

      <hr className="border-border" />

      <div className="flex flex-col gap-1 text-sm font-body">
        <p className="font-medium text-foreground mb-1">Видалити акаунт повністю — Варіант 2, електронною поштою</p>
        <p className="text-muted-foreground">
          Якщо ви не маєте доступу до застосунку, надішліть запит на видалення з адреси електронної пошти,
          прив'язаної до вашого акаунта, на{" "}
          <a href={`${GMAIL_COMPOSE_URL}${EMAIL_SUPPORT}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{EMAIL_SUPPORT}</a>{" "}
          з темою «Видалити мій акаунт Alma». Ми перевіримо запит і опрацюємо його протягом 30 днів.
        </p>
      </div>
    </div>
  </div>
);
