import { SupportEmailLink } from "@/components/legal/LegalDoc";
import { DeleteCard, DeleteHeader, DeleteSection, Divider, DeleteNote } from "@/components/legal/alma/DeleteAccountParts";

export const DeleteAccountEs = () => (
  <DeleteCard>
    <DeleteHeader
      title="Eliminar tu cuenta"
      subtitle="Puedes eliminar tu cuenta de Alma y todos los datos asociados en cualquier momento."
    />

    <DeleteSection title="Qué se eliminará">
      <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
        <li>Tu perfil (nombre, dirección de correo electrónico)</li>
        <li>Rituales guardados, sesiones y ajustes del mezclador</li>
        <li>Preferencias de la app, recordatorios e historial de notificaciones</li>
        <li>Historial de escucha y progreso</li>
        <li>Registros de suscripción vinculados a tu cuenta</li>
        <li>El audio que importaste, que se guarda únicamente en tu dispositivo</li>
      </ul>
    </DeleteSection>

    <Divider />

    <DeleteSection title="Eliminar solo parte de tus datos (conservando la cuenta)">
      <p className="text-muted-foreground">
        No necesitas eliminar tu cuenta para borrar datos concretos. En la app de Alma puedes:
      </p>
      <ul className="list-disc list-inside space-y-0.5 text-muted-foreground mt-1">
        <li><strong className="text-foreground">Audio importado</strong> — Bóveda → abre el menú ⋯ de un archivo → Eliminar. Se borra de tu dispositivo.</li>
        <li><strong className="text-foreground">Rituales guardados</strong> — Bóveda → abre el menú ⋯ de un ritual → Eliminar.</li>
        <li><strong className="text-foreground">Recordatorios e historial de notificaciones</strong> — Perfil → Ajustes → Notificaciones → desactiva los recordatorios.</li>
        <li><strong className="text-foreground">Analítica de uso</strong> — Perfil → Ajustes → Privacidad → desactiva Analítica de uso. La recopilación se detiene de inmediato.</li>
      </ul>
      <p className="text-muted-foreground mt-1">
        Para cualquier otra cosa, escribe a{" "}
        <SupportEmailLink />{" "}
        desde la dirección de tu cuenta indicando qué quieres eliminar. Respondemos en un plazo de 30 días.
      </p>
    </DeleteSection>

    <Divider />

    <DeleteSection title="Qué se conserva y durante cuánto tiempo">
      <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
        <li>Los elementos eliminados se borran de nuestros sistemas y de tu dispositivo de inmediato; no conservamos ninguna copia una vez completada la eliminación.</li>
        <li>Si eliges la opción de 30 días, los datos de tu cuenta se conservan durante ese periodo para que puedas restaurarla, y después se eliminan permanentemente.</li>
        <li>Los registros de pagos y suscripciones los conserva Google Play, no nosotros. Solicítalos a través de Google Play.</li>
        <li>Podemos conservar datos analíticos anonimizados y agregados que no permiten identificarte.</li>
      </ul>
    </DeleteSection>

    <Divider />

    <DeleteSection title="Eliminar toda tu cuenta — Opción 1, desde la app">
      <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
        <li>Abre la app de Alma e inicia sesión.</li>
        <li>Ve a <strong className="text-foreground">Perfil</strong> → <strong className="text-foreground">Ajustes</strong>.</li>
        <li>Toca <strong className="text-foreground">Eliminar cuenta</strong>.</li>
        <li>Elige si quieres mantener el período de gracia de 30 días o eliminarla permanentemente ahora, y confirma.</li>
      </ol>
    </DeleteSection>

    <DeleteNote>
      <strong>Eliminar después de 30 días</strong> (predeterminado) — se cierra tu sesión de inmediato y tu
      cuenta se elimina permanentemente 30 días después. Si vuelves a iniciar sesión en cualquier momento
      durante esos 30 días, tu cuenta se restaura automáticamente, sin pasos adicionales. Tu dirección de
      correo permanece reservada hasta que se complete la eliminación, por lo que no puede usarse para una
      cuenta nueva mientras tanto.
    </DeleteNote>

    <DeleteNote variant="danger">
      <strong>Eliminar permanentemente ahora</strong> — tu cuenta y todos los datos se borran de inmediato.
      Esta acción no se puede deshacer y nada podrá restaurarse.
    </DeleteNote>

    <Divider />

    <DeleteNote>
      Eliminar tu cuenta <strong>no</strong> cancela una suscripción activa. Cancélala por separado en{" "}
      <a href="https://play.google.com/store/account/subscriptions" target="_blank" rel="noopener noreferrer" className="underline">
        Google Play → Suscripciones
      </a>
      . Los reembolsos los gestiona Google Play.
    </DeleteNote>

    <Divider />

    <DeleteSection title="Eliminar toda tu cuenta — Opción 2, por correo electrónico">
      <p className="text-muted-foreground">
        Si no puedes acceder a la app, envía una solicitud de eliminación desde la dirección de correo
        vinculada a tu cuenta a{" "}
        <SupportEmailLink />{" "}
        con el asunto "Eliminar mi cuenta de Alma". Verificaremos la solicitud y la procesaremos en un plazo
        de 30 días.
      </p>
    </DeleteSection>
  </DeleteCard>
);
