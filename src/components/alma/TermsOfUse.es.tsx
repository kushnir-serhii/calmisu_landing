import { EMAIL_SUPPORT, GMAIL_COMPOSE_URL } from "@/components/constants/mail";

export const TermsOfUseEs = () => (
  <div className="max-w-xl mx-auto px-6 py-4 sm:px-12">
    <strong className="block font-bold">Términos de Uso</strong>
    <p className="mt-1 leading-snug text-sm">
      Estos Términos de Uso ("Términos") rigen tu uso de la aplicación móvil
      Alma ("Aplicación"), proporcionada por Serhii Kushnir ("Proveedor del
      Servicio"). Al descargar, instalar o usar la Aplicación, aceptas
      estos Términos. Si no estás de acuerdo, no uses la Aplicación.
    </p>

    <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
      <strong className="block font-bold">Aviso sobre la salud</strong>
      <p className="mt-1 leading-snug text-sm">
        Alma ofrece sonido, música y audio de meditación para la relajación
        y la concentración. <em>No</em> es un dispositivo médico y no
        proporciona asesoramiento, diagnóstico ni tratamiento médico,
        psicológico o terapéutico, ni sustituye la atención profesional.
      </p>
      <p className="mt-1 leading-snug text-sm">
        No uses Alma en situaciones que requieran toda tu atención, como
        conducir o manejar maquinaria: las sesiones están diseñadas para
        reducir el estado de alerta y pueden provocar somnolencia o sueño.
        Escucha a un volumen moderado para proteger tu audición,
        especialmente con auriculares. Si tienes una afección que pueda
        verse afectada por audio sostenido o rítmico, como epilepsia
        fotosensible o audiógena, tinnitus o una afección psiquiátrica,
        consulta a un profesional sanitario cualificado antes de usarla.
        Deja de usarla de inmediato si te sientes mal.
      </p>
    </div>

    <strong className="block font-bold mt-4">Licencia</strong>
    <p className="mt-1 leading-snug text-sm">
      El Proveedor del Servicio te concede una licencia personal, no
      exclusiva, intransferible y revocable para usar la Aplicación en
      dispositivos de tu propiedad o bajo tu control, para tu uso personal
      no comercial, de acuerdo con estos Términos y los Términos de
      Servicio de Google Play.
    </p>

    <strong className="block font-bold mt-4">Tu cuenta</strong>
    <p className="mt-1 leading-snug text-sm">
      Algunas funciones requieren una cuenta. Aceptas proporcionar
      información veraz, mantener la confidencialidad de tus credenciales y
      ser responsable de toda la actividad realizada con tu cuenta. Debes
      tener al menos 13 años para crear una cuenta. El Proveedor del
      Servicio puede suspender o cerrar las cuentas que infrinjan estos
      Términos.
    </p>

    <strong className="block font-bold mt-4">Suscripciones y pagos</strong>
    <ul className="list-disc pl-6 mt-1 text-sm space-y-1">
      <li>La Aplicación es gratuita y ofrece suscripciones de pago opcionales ("Alma Premium") que desbloquean funciones y contenido adicionales.</li>
      <li>Todas las compras se procesan a través de Google Play. El Proveedor del Servicio no recibe ni almacena los datos de tu tarjeta de pago.</li>
      <li>Las suscripciones se renuevan automáticamente al final de cada período de facturación, salvo que se cancelen al menos 24 horas antes de la fecha de renovación. El precio mostrado en el momento de la compra se aplica a cada período de renovación hasta que cambie, con previo aviso, conforme a las normas de Google Play.</li>
      <li>Puedes gestionar o cancelar una suscripción en cualquier momento en Google Play → Suscripciones. La cancelación detiene las renovaciones futuras; el acceso continúa hasta el final del período pagado.</li>
      <li>Los reembolsos los gestiona Google Play conforme a su política. Eliminar tu cuenta <em>no</em> cancela ni reembolsa una suscripción activa — cancélala por separado en Google Play.</li>
      <li>Cualquier prueba gratuita se convierte en una suscripción de pago salvo que se cancele antes de que finalice.</li>
    </ul>

    <strong className="block font-bold mt-4">Contenido y propiedad intelectual</strong>
    <p className="mt-1 leading-snug text-sm">
      Todo el audio, las ilustraciones, los textos, el software y demás
      materiales incluidos en la Aplicación son propiedad del Proveedor del
      Servicio o de sus licenciantes y están protegidos por las leyes de
      derechos de autor y otras normas. No puedes copiar, extraer,
      redistribuir, vender, ejecutar públicamente ni crear obras derivadas
      del contenido de la Aplicación, ni usarlo como componente de otro
      producto o servicio, sin permiso previo por escrito.
    </p>

    <strong className="block font-bold mt-4">Audio que importas</strong>
    <p className="mt-1 leading-snug text-sm">
      La Aplicación te permite importar archivos de audio desde tu propio
      dispositivo. Eres el único responsable de asegurarte de que tienes
      derecho a usar cualquier archivo que importes. Los archivos
      importados permanecen en tu dispositivo y no se suben a los
      servidores del Proveedor del Servicio. Solo puedes usar el contenido
      importado para escucha personal y privada.
    </p>

    <strong className="block font-bold mt-4">Uso aceptable</strong>
    <p className="mt-1 leading-snug text-sm">Aceptas no:</p>
    <ul className="list-disc pl-6 mt-1 text-sm space-y-1">
      <li>aplicar ingeniería inversa, descompilar o intentar extraer el código fuente o los recursos de audio de la Aplicación, salvo en la medida permitida por la ley aplicable;</li>
      <li>interferir, sobrecargar o intentar acceder sin autorización a la Aplicación o a sus servidores;</li>
      <li>usar la Aplicación con fines ilícitos o infringiendo cualquier ley aplicable;</li>
      <li>eludir, desactivar o manipular los mecanismos de suscripción, licencia o seguridad.</li>
    </ul>

    <strong className="block font-bold mt-4">Disponibilidad y cambios</strong>
    <p className="mt-1 leading-snug text-sm">
      El Proveedor del Servicio puede modificar, suspender o discontinuar
      la Aplicación o cualquiera de sus funciones en cualquier momento.
      Algunas funciones requieren conexión a internet, y el Proveedor del
      Servicio no es responsable de problemas derivados de tu dispositivo,
      la disponibilidad de la red o los cargos de datos de tu operador
      móvil. La Aplicación puede actualizarse periódicamente; conviene
      aceptar las actualizaciones para seguir recibiendo soporte.
    </p>

    <strong className="block font-bold mt-4">Exención de garantías</strong>
    <p className="mt-1 leading-snug text-sm">
      La Aplicación se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD", sin
      garantías de ningún tipo, expresas o implícitas, incluidas, entre
      otras, las de comerciabilidad, idoneidad para un fin determinado y no
      infracción. El Proveedor del Servicio no garantiza que la Aplicación
      funcione sin interrupciones, sin errores o libre de componentes
      dañinos.
    </p>

    <strong className="block font-bold mt-4">Limitación de responsabilidad</strong>
    <p className="mt-1 leading-snug text-sm">
      En la máxima medida permitida por la ley aplicable, el Proveedor del
      Servicio no será responsable de daños indirectos, incidentales,
      especiales, consecuentes o punitivos, ni de la pérdida de datos,
      beneficios o reputación, derivados de o relacionados con tu uso de la
      Aplicación. Nada en estos Términos excluye o limita la
      responsabilidad que no pueda excluirse o limitarse conforme a la ley
      aplicable, incluidos tus derechos legales como consumidor.
    </p>

    <strong className="block font-bold mt-4">Terminación</strong>
    <p className="mt-1 leading-snug text-sm">
      Puedes dejar de usar la Aplicación en cualquier momento y eliminar tu
      cuenta como se describe en{" "}
      <a href="https://calmisu.com/alma/es/delete-account/" className="text-blue-600 underline">
        calmisu.com/alma/es/delete-account
      </a>
      . El Proveedor del Servicio puede cancelar o restringir tu acceso si
      incumples estos Términos. Las disposiciones sobre propiedad
      intelectual, exenciones de garantía y limitación de responsabilidad
      seguirán vigentes tras la terminación.
    </p>

    <strong className="block font-bold mt-4">Privacidad</strong>
    <p className="mt-1 leading-snug text-sm">
      Tu uso de la Aplicación también se rige por la{" "}
      <a href="/alma/es/privacy-policy/" className="text-blue-600 underline">
        Política de Privacidad
      </a>
      , que forma parte de estos Términos.
    </p>

    <strong className="block font-bold mt-4">Cambios en estos Términos</strong>
    <p className="mt-1 leading-snug text-sm">
      Estos Términos pueden actualizarse periódicamente. El Proveedor del
      Servicio publicará los Términos revisados en esta página y
      actualizará la fecha indicada abajo. El uso continuado de la
      Aplicación tras la entrada en vigor de los cambios constituye la
      aceptación de los Términos revisados.
    </p>

    <strong className="block font-bold mt-4">Ley aplicable</strong>
    <p className="mt-1 leading-snug text-sm">
      Estos Términos se rigen por las leyes del país en el que está
      establecido el Proveedor del Servicio, sin atender a las normas sobre
      conflicto de leyes. Si eres consumidor, también te amparan las
      protecciones imperativas de la legislación de tu país de residencia.
    </p>

    <strong className="block font-bold mt-4">Contacto</strong>
    <p className="mt-1 leading-snug text-sm">
      Las preguntas sobre estos Términos pueden enviarse a{" "}
      <a href={`${GMAIL_COMPOSE_URL}${EMAIL_SUPPORT}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{EMAIL_SUPPORT}</a>.
    </p>

    <p className="mt-4 leading-snug text-sm text-muted-foreground">Fecha de entrada en vigor: 28 de julio de 2026</p>
  </div>
);
