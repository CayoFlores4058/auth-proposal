<script setup lang="ts">
import DocPageHeader from '@/components/DocPageHeader.vue'
import ProsCons from '@/components/ProsCons.vue'
import DocCard from '@/components/DocCard.vue'

const decisions = [
  {
    question: 'Un API Gateway único vs. uno por sistema',
    intro:
      'Define si el Lambda authorizer y la capa de entrada viven en un solo Gateway compartido por todos los sistemas, o si cada sistema de negocio tiene el suyo.',
    options: [
      {
        name: 'Gateway único (compartido)',
        pros: [
          'Un solo lugar para gestionar el Lambda authorizer, rate limiting y logging.',
          'Más fácil observar el tráfico de auth de todo el ecosistema en un solo dashboard.',
          'Menos infraestructura que mantener y versionar.',
        ],
        cons: [
          'Punto único de falla para todos los sistemas si el Gateway tiene un incidente.',
          'Cambios de configuración (rutas, throttling) requieren coordinación entre equipos.',
          'Cuotas de límite de requests compartidas entre sistemas con tráfico muy distinto.',
        ],
      },
      {
        name: 'Gateway por sistema',
        pros: [
          'Aislamiento de fallas: un incidente en un Gateway no afecta a los demás sistemas.',
          'Cada equipo ajusta throttling, caching y logging a sus propias necesidades.',
          'Despliegues independientes, sin coordinación cruzada.',
        ],
        cons: [
          'El Lambda authorizer se duplica y debe mantenerse sincronizado en N lugares.',
          'Observabilidad fragmentada: no hay una vista única del tráfico de autenticación.',
          'Más infraestructura y costo operativo a medida que crece N.',
        ],
      },
    ],
    recommendation:
      'Empezar con un Gateway único mientras N es manejable, y reevaluar separarlo por sistema solo si el tráfico o el ownership organizacional lo justifica.',
  },
  {
    question: 'Cacheo de claims en el JWT vs. consulta en vivo al servicio de auth',
    intro:
      'Para permisos críticos, ¿se confía en los claims que ya vienen en el token, o se vuelve a consultar el estado actual en BD_AUTH?',
    options: [
      {
        name: 'Confiar en los claims cacheados del JWT',
        pros: [
          'Cero latencia adicional: el servicio de negocio no depende de una llamada de red extra.',
          'El servicio de auth no se convierte en cuello de botella bajo alta concurrencia.',
          'Sigue funcionando aunque el servicio de auth tenga una degradación temporal.',
        ],
        cons: [
          'Los claims quedan "congelados" durante la vida del token: revocar un rol no tiene efecto inmediato.',
          'Requiere tokens de vida corta (o un mecanismo de revocación) para acotar la ventana de riesgo.',
        ],
      },
      {
        name: 'Consultar en vivo al servicio de auth',
        pros: [
          'Los permisos siempre reflejan el estado actual de BD_AUTH — revocar un rol tiene efecto inmediato.',
          'Recomendable para operaciones sensibles (borrar datos, aprobar pagos) donde un permiso desactualizado es costoso.',
        ],
        cons: [
          'Latencia y carga adicional en cada request sensible.',
          'El servicio de auth pasa a ser una dependencia crítica en el camino caliente de esas operaciones.',
        ],
      },
    ],
    recommendation:
      'Usar los claims cacheados para la mayoría de las decisiones de autorización, y reservar la consulta en vivo solo para operaciones críticas o irreversibles.',
  },
  {
    question: 'cod_sistema como texto libre vs. tabla catálogo M_SISTEMA',
    intro:
      'En T_USUARIO_SISTEMA, ¿cod_sistema es un string libre o una FK a una tabla catálogo dedicada?',
    options: [
      {
        name: 'cod_sistema como texto libre (string)',
        pros: [
          'Cero fricción para dar de alta un sistema nuevo: no requiere migrar un catálogo.',
          'Suficiente si el número de sistemas es pequeño y estable.',
        ],
        cons: [
          'Sin validación referencial: un typo crea silenciosamente un "sistema" inexistente.',
          'No hay un lugar central para guardar metadata del sistema (nombre visible, owner, ambiente).',
        ],
      },
      {
        name: 'Tabla catálogo M_SISTEMA',
        pros: [
          'Integridad referencial real vía FK dentro de BD_AUTH.',
          'Lugar natural para metadata (nombre, owner, URL del App Client de Cognito, estado activo).',
        ],
        cons: [
          'Un paso adicional (insertar en el catálogo) antes de poder usar un sistema nuevo.',
          'Costo de migración menor para los cod_sistema ya existentes como texto libre.',
        ],
      },
    ],
    recommendation:
      'Migrar a M_SISTEMA en cuanto el número de sistemas supere un puñado: el costo de mantenerlo es bajo y evita errores silenciosos de tipeo.',
  },
]
</script>

<template>
  <DocPageHeader
    eyebrow="06 · Trade-offs"
    title="Decisiones abiertas"
    subtitle="Puntos de diseño donde existe más de una respuesta razonable. Se documentan las opciones y una recomendación inicial, no una decisión cerrada."
  />

  <div class="space-y-14">
    <section v-for="decision in decisions" :key="decision.question">
      <h2 class="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {{ decision.question }}
      </h2>
      <p class="mt-2 mb-6 max-w-3xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {{ decision.intro }}
      </p>

      <div class="grid gap-6 lg:grid-cols-2">
        <div v-for="option in decision.options" :key="option.name">
          <h3 class="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{{ option.name }}</h3>
          <ProsCons :pros="option.pros" :cons="option.cons" />
        </div>
      </div>

      <DocCard title="Recomendación inicial" tone="warning" class="mt-6 max-w-3xl">
        {{ decision.recommendation }}
      </DocCard>
    </section>
  </div>
</template>
