<script setup lang="ts">
import DocPageHeader from '@/components/DocPageHeader.vue'
import DocCard from '@/components/DocCard.vue'
import DocTabs from '@/components/DocTabs.vue'
import MermaidDiagram from '@/components/MermaidDiagram.vue'

const migrationTriggerDiagram = `
flowchart TB
    Login["Usuario intenta login<br/>(aún no existe en Cognito)"] --> Trigger["Lambda: Migration Trigger<br/>(User Migration)"]
    Trigger -->|"valida user / password"| Legacy[("Sistema legado<br/>(BD de origen)")]
    Legacy -->|"credenciales válidas"| Create["Cognito crea el usuario<br/>con esas credenciales,<br/>sin pedir reset"]
    Create --> Token["Emite el JWT normalmente"]
    Legacy -->|"credenciales inválidas"| Reject["Login rechazado"]
`
</script>

<template>
  <DocPageHeader
    eyebrow="05 · Migración"
    title="Estrategia de migración"
    subtitle="Pasar de N esquemas de usuario a un dominio de identidad único sin forzar a los usuarios a resetear su contraseña ni cortar los sistemas actuales de golpe."
  />

  <div class="space-y-10">
    <section>
      <h2 class="mb-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        1. Consolidación de usuarios duplicados
      </h2>
      <div class="prose-body max-w-3xl">
        <p>
          El mismo email presente en distintas bases de datos de negocio se trata como el mismo
          usuario final. Antes de crear nada en <code>BD_AUTH</code>, se hace un cruce por email
          entre todas las BDs actuales para construir la lista canónica de usuarios únicos.
        </p>
        <ul>
          <li>
            Cuando el email coincide pero los datos personales difieren (nombre, teléfono, etc.),
            se define una regla de precedencia por sistema (ej. el sistema más reciente en
            <code>fch_modificacion</code> gana) para poblar <code>T_USUARIO</code>.
          </li>
          <li>
            Cada sistema de origen conserva un mapeo temporal <code>(cod_sistema, id_usuario_legado) → id_usuario</code>
            para poder trazar de dónde vino cada registro consolidado.
          </li>
          <li>
            Los roles que el usuario tenía en cada sistema se preservan como filas independientes
            en <code>T_USUARIO_SISTEMA</code> — consolidar el usuario no significa unificar su rol.
          </li>
        </ul>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        2. Migración de contraseñas sin fricción
      </h2>
      <div class="prose-body max-w-3xl">
        <p>
          En vez de forzar un reset masivo de contraseñas, se usa el
          <strong>Migration Trigger</strong> (User Migration Lambda) de Cognito. Cuando un usuario
          que todavía no existe en el User Pool intenta loguearse, Cognito invoca esta Lambda, que
          valida las credenciales contra el sistema viejo en tiempo real.
        </p>
      </div>
      <MermaidDiagram
        :code="migrationTriggerDiagram"
        caption="El primer login migra al usuario de forma transparente, sin pedirle que cambie su contraseña."
      />
      <DocCard title="Por qué importa" tone="success" class="mt-6 max-w-3xl">
        Si las credenciales son válidas, Cognito crea el usuario con esa misma contraseña de forma
        transparente. El usuario nota, a lo sumo, un login normal — no un reset forzado ni un
        correo de "recupera tu contraseña". La migración ocurre "just in time", un usuario a la vez,
        en su primer login post-corte.
      </DocCard>
    </section>

    <section>
      <h2 class="mb-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        3. Actualización de FKs lógicas en las tablas de negocio
      </h2>
      <div class="prose-body max-w-3xl">
        <p>
          Cada tabla de negocio que hoy referencia a un usuario por su ID local debe actualizar esa
          columna para apuntar al <code>id_usuario</code> unificado de <code>BD_AUTH</code>, usando
          el mapeo <code>(cod_sistema, id_usuario_legado) → id_usuario</code> generado en el paso 1.
        </p>
        <ul>
          <li>La actualización es un <code>UPDATE</code> masivo por lote, sistema por sistema, no una migración en vivo.</li>
          <li>
            Como no hay FK real entre motores de BD distintos, se agrega validación a nivel de
            aplicación (o un job de auditoría) que verifique que todo <code>id_usuario</code>
            huérfano se detecte antes del corte.
          </li>
          <li>Una vez migrada, la tabla de negocio elimina cualquier columna de credenciales o perfil que antes duplicaba.</li>
        </ul>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        4. Plan de corte
      </h2>
      <DocTabs :tabs="['Convivencia (dual-write)', 'Corte directo']">
        <template #tab-0>
          <p class="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Durante una ventana de tiempo, el sistema legado y BD_AUTH reciben las mismas
            escrituras de perfil (dual-write), mientras el login se corta a Cognito de inmediato
            vía el Migration Trigger.
          </p>
          <ul class="list-disc space-y-1.5 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>Menor riesgo: si algo falla, el sistema legado sigue teniendo datos frescos.</li>
            <li>Requiere mantener temporalmente lógica de escritura duplicada y monitoreo de divergencias.</li>
            <li>Recomendado cuando hay sistemas de negocio críticos que no pueden tener downtime.</li>
          </ul>
        </template>
        <template #tab-1>
          <p class="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Se define una fecha de corte: antes de esa fecha corre la consolidación batch completa
            (usuarios, roles, FKs); después de esa fecha, todo el tráfico de auth va exclusivamente
            a Cognito y BD_AUTH, y el login legado se apaga.
          </p>
          <ul class="list-disc space-y-1.5 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>Más simple de operar: no hay dos fuentes de verdad conviviendo.</li>
            <li>Mayor riesgo si la consolidación batch tiene errores no detectados a tiempo.</li>
            <li>Recomendado para sistemas de negocio secundarios o con ventanas de mantenimiento tolerables.</li>
          </ul>
        </template>
      </DocTabs>
    </section>
  </div>
</template>
