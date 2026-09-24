import { LegalDoc, LegalTitle, LegalHeading, LegalText, LegalList, ExternalLink, SupportEmailLink } from "@/components/legal/LegalDoc";

export const PrivacyPolicyEs = () => (
  <LegalDoc>
    <LegalTitle>Política de Privacidad</LegalTitle>
    <LegalText>
      Esta política de privacidad se aplica a la aplicación Alma (en
      adelante, la "Aplicación") para dispositivos móviles, creada por
      Serhii Kushnir (en adelante, el "Proveedor del Servicio") como un
      servicio Freemium. Este servicio se ofrece "TAL CUAL".
    </LegalText>
    <LegalText>
      Alma es una aplicación de meditación y sonido ambiental para la
      relajación y la concentración. Te permite reproducir pistas de audio
      seleccionadas, mezclar capas ambientales y campanas, importar tu
      propio audio y guardar sesiones de sonido. No es un dispositivo médico
      y no proporciona asesoramiento médico.
    </LegalText>

    <LegalHeading>Recopilación y Uso de la Información</LegalHeading>
    <LegalText>
      La Aplicación recopila información cuando la descargas y la usas. Esta
      información puede incluir:
    </LegalText>
    <LegalList>
      <li>La dirección de Protocolo de Internet de tu dispositivo (por ejemplo, la dirección IP)</li>
      <li>
        Las pantallas de la Aplicación que visitas, la hora y la fecha de tu
        visita, y el tiempo que pasas en ellas
      </li>
      <li>El sistema operativo y el modelo de dispositivo que utilizas</li>
      <li>La versión de la Aplicación que estás ejecutando</li>
    </LegalList>
    <LegalText>
      La Aplicación no recopila información precisa sobre la ubicación de tu
      dispositivo móvil.
    </LegalText>
    <LegalText>
      Para una mejor experiencia, mientras usas la Aplicación, el Proveedor
      del Servicio puede solicitarte cierta información de identificación
      personal. La información recopilada y conservada incluye:
    </LegalText>
    <LegalList>
      <li>Información de la cuenta: nombre y dirección de correo electrónico (mediante registro por correo o Google Sign-In)</li>
      <li>Información de suscripción: token de compra, estado de la suscripción y fecha de renovación</li>
      <li>Tokens del dispositivo: token de notificaciones push, usado únicamente para enviar los recordatorios que hayas activado</li>
      <li>Preferencias de la aplicación: tema, idioma, ajustes de sesión y rituales guardados</li>
      <li>Analítica: datos de uso a través de Google Analytics para Firebase</li>
    </LegalList>
    <LegalText>
      La información que solicita el Proveedor del Servicio será conservada
      por él y utilizada según se describe en esta política de privacidad.
    </LegalText>

    <LegalHeading>El audio que importas permanece en tu dispositivo</LegalHeading>
    <LegalText>
      La Aplicación te permite importar tus propios archivos de audio desde
      tu dispositivo para usarlos en las sesiones. Estos archivos se copian
      únicamente al almacenamiento privado de la Aplicación en tu
      dispositivo. <em>No</em> se suben a los servidores del Proveedor del
      Servicio, no son accesibles para el Proveedor del Servicio y se
      eliminan cuando los borras en la Aplicación o desinstalas la
      Aplicación.
    </LegalText>
    <LegalText>
      La Aplicación solicita acceso a los archivos de tu dispositivo
      únicamente para que puedas seleccionar el audio que quieres importar.
      No escanea, indexa ni transmite ningún otro archivo.
    </LegalText>

    <LegalHeading>Micrófono</LegalHeading>
    <LegalText>
      La Aplicación declara los permisos de audio que requiere el sistema de
      reproducción de Android para una reproducción en segundo plano sin
      interrupciones. La Aplicación no graba audio ni transmite ninguna
      entrada de micrófono.
    </LegalText>

    <LegalHeading>Acceso de Terceros</LegalHeading>
    <LegalText>
      El Proveedor del Servicio puede compartir tu información con terceros
      según se describe en esta declaración de privacidad. Los datos
      analíticos (como patrones de uso y estadísticas de sesión) se
      transmiten de forma agregada y anonimizada para ayudar al Proveedor
      del Servicio a mejorar la Aplicación. Tu información nunca se vende ni
      se utiliza para publicidad.
    </LegalText>
    <LegalText>
      Ten en cuenta que la Aplicación utiliza servicios de terceros que
      tienen su propia Política de Privacidad sobre el tratamiento de datos.
      A continuación, los enlaces a las políticas de privacidad de los
      proveedores externos utilizados por la Aplicación:
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
          Google Analytics para Firebase
        </ExternalLink>
      </li>
      <li>
        <ExternalLink href="https://supabase.com/privacy">
          Supabase
        </ExternalLink>{" "}
        (base de datos de cuentas y autenticación)
      </li>
      <li>
        <ExternalLink href="https://www.revenuecat.com/privacy">
          RevenueCat
        </ExternalLink>{" "}
        (gestión de suscripciones)
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
        (distribución de la biblioteca de audio)
      </li>
    </LegalList>
    <LegalText>
      El Proveedor del Servicio puede divulgar la información proporcionada
      por el usuario y la recopilada automáticamente:
    </LegalText>
    <LegalList>
      <li>
        según lo exija la ley, por ejemplo para cumplir con una citación o
        un proceso legal similar;
      </li>
      <li>
        cuando considere de buena fe que la divulgación es necesaria para
        proteger sus derechos, proteger tu seguridad o la de otros,
        investigar fraudes o responder a una solicitud gubernamental;
      </li>
      <li>
        con proveedores de servicios de confianza que trabajan en su nombre,
        no hacen un uso independiente de la información divulgada y han
        aceptado cumplir con las normas establecidas en esta declaración de
        privacidad.
      </li>
    </LegalList>

    <LegalHeading>Derechos de Exclusión</LegalHeading>
    <LegalText>
      Puedes desactivar las notificaciones push en cualquier momento en los
      ajustes de la Aplicación o de tu dispositivo. Puedes detener toda la
      recopilación de datos desinstalando la Aplicación mediante el proceso
      de desinstalación estándar de tu dispositivo móvil o de la tienda de
      aplicaciones.
    </LegalText>

    <LegalHeading>Conservación y Eliminación de Datos</LegalHeading>
    <LegalText>
      El Proveedor del Servicio conservará los datos proporcionados por el
      usuario mientras utilices la Aplicación y durante un tiempo razonable
      después.
    </LegalText>
    <LegalText>
      Puedes eliminar tu cuenta en cualquier momento directamente en la
      Aplicación (Perfil → Ajustes → Eliminar cuenta). Puedes elegir entre
      dos opciones:
    </LegalText>
    <LegalList>
      <li>
        <strong>Eliminar después de 30 días</strong> — se cierra tu sesión
        de inmediato y tu cuenta se elimina permanentemente 30 días después.
        Si vuelves a iniciar sesión durante esos 30 días, la eliminación se
        cancela automáticamente y tu cuenta se restaura. Tu correo
        electrónico permanece reservado hasta que se complete la
        eliminación.
      </li>
      <li>
        <strong>Eliminar permanentemente ahora</strong> — tu cuenta y todos
        los datos asociados se borran de inmediato y no se pueden
        recuperar.
      </li>
    </LegalList>
    <LegalText>
      En ambos casos, los datos almacenados localmente en tu dispositivo
      (audio importado, ajustes en caché) se borran al confirmar.
      Encontrarás instrucciones y una alternativa por correo electrónico en{" "}
      <ExternalLink href="https://calmisu.com/alma/es/delete-account/" blank={false}>
        calmisu.com/alma/es/delete-account
      </ExternalLink>
      . Eliminar tu cuenta no cancela ni reembolsa automáticamente una
      suscripción activa — consulta los Términos de Uso.
    </LegalText>
    <LegalText>
      También puedes solicitar una copia de tus datos, o su corrección,
      escribiendo al Proveedor del Servicio a{" "}
      <SupportEmailLink />
      . Las solicitudes se responden en un plazo de 30 días.
    </LegalText>

    <LegalHeading>Menores</LegalHeading>
    <LegalText>
      El Proveedor del Servicio no utiliza la Aplicación para solicitar a
      sabiendas datos de menores de 13 años ni para dirigirse a ellos.
    </LegalText>
    <LegalText>
      La Aplicación no está dirigida a menores de 13 años. El Proveedor del
      Servicio no recopila conscientemente información de identificación
      personal de menores de 13 años. En caso de que descubra que un menor
      de 13 años ha proporcionado información personal, la eliminará
      inmediatamente de sus servidores. Si eres madre, padre o tutor y sabes
      que tu hijo o hija nos ha proporcionado información personal, contacta
      con el Proveedor del Servicio en{" "}
      <SupportEmailLink />{" "}
      para que pueda tomar las medidas necesarias.
    </LegalText>

    <LegalHeading>Seguridad</LegalHeading>
    <LegalText>
      El Proveedor del Servicio se preocupa por salvaguardar la
      confidencialidad de tu información y aplica medidas físicas,
      electrónicas y de procedimiento para proteger la información que
      procesa y mantiene. Todos los datos transmitidos entre la Aplicación y
      sus servidores se cifran en tránsito.
    </LegalText>

    <LegalHeading>Cambios</LegalHeading>
    <LegalText>
      Esta Política de Privacidad puede actualizarse en cualquier momento y
      por cualquier motivo. El Proveedor del Servicio te notificará
      cualquier cambio actualizando esta página con la nueva Política de
      Privacidad. Te recomendamos consultar esta Política de Privacidad
      periódicamente, ya que el uso continuado se considera aprobación de
      todos los cambios.
    </LegalText>
    <LegalText>Esta política de privacidad entra en vigor el 2026-07-28.</LegalText>

    <LegalHeading>Tu Consentimiento</LegalHeading>
    <LegalText>
      Al usar la Aplicación, aceptas el tratamiento de tu información según
      lo establecido en esta Política de Privacidad, tanto ahora como en sus
      futuras modificaciones.
    </LegalText>

    <LegalHeading>Contacto</LegalHeading>
    <LegalText>
      Si tienes alguna pregunta sobre la privacidad durante el uso de la
      Aplicación, o sobre estas prácticas, contacta con el Proveedor del
      Servicio por correo electrónico en{" "}
      <SupportEmailLink />.
    </LegalText>

    <LegalText className="mt-4 leading-snug text-sm text-muted-foreground">Última actualización: 28 de julio de 2026</LegalText>
  </LegalDoc>
);
