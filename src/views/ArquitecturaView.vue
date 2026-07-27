<script setup lang="ts">
import DocPageHeader from '@/components/DocPageHeader.vue'
import MermaidDiagram from '@/components/MermaidDiagram.vue'
import DocTabs from '@/components/DocTabs.vue'
import DocAccordion from '@/components/DocAccordion.vue'
import DocCard from '@/components/DocCard.vue'

const architectureDiagram = `
flowchart TB
    Clients["Apps cliente<br/>(una por sistema de negocio)"]
    Clients -->|"Login vía Cognito Hosted UI"| Cognito

    subgraph CognitoBlock["AWS Cognito User Pool"]
        Cognito["Cognito User Pool<br/>credenciales · MFA · emisión de JWT<br/>1 App Client por sistema"]
        PostConfirm["Lambda: Post Confirmation<br/>crea el usuario en BD_AUTH"]
        PreToken["Lambda: Pre Token Generation<br/>agrega claims: rol, tenant_id,<br/>idioma, zona_horaria"]
    end

    Cognito -. "al registrarse" .-> PostConfirm
    Cognito -. "al generar el token" .-> PreToken
    PreToken -. "consulta vía" .-> AuthAPI

    Cognito -->|"JWT firmado"| Gateway

    Gateway["API Gateway<br/>+ Lambda Authorizer<br/>valida firma y expiración (JWKS)"]

    subgraph IdentidadBlock["Dominio de identidad"]
        AuthAPI["Servicio de Auth (API)"]
        BDAUTH[("BD_AUTH<br/>RDS / Aurora Postgres")]
        AuthAPI --> BDAUTH
    end

    subgraph NegocioBlock["Sistemas de negocio (N)"]
        BizAPI["Servicio de negocio<br/>usa claims del JWT ya validado"]
        BDBiz[("BD de negocio<br/>solo columna id_usuario")]
        BizAPI --> BDBiz
    end

    Gateway --> AuthAPI
    Gateway --> BizAPI
    PostConfirm -. "crea fila en" .-> BDAUTH
`

const lambdas = [
  {
    title: 'Post Confirmation',
    body: 'Se dispara cuando un usuario completa el registro (confirma su email/teléfono) en el User Pool. Su responsabilidad es crear la fila correspondiente en T_USUARIO de BD_AUTH, usando el sub de Cognito como id_cognito_sub. A partir de ahí, BD_AUTH es la fuente de verdad del perfil.',
  },
  {
    title: 'Pre Token Generation',
    body: 'Se dispara justo antes de que Cognito emita el JWT (en login o refresh). Consulta al Servicio de Auth (que a su vez lee BD_AUTH) para resolver el rol, tenant_id/id_cliente, idioma y zona_horaria del usuario para el sistema que está pidiendo el token, y los inyecta como claims personalizados dentro del JWT.',
  },
]
</script>

<template>
  <DocPageHeader
    eyebrow="02 · Solución propuesta"
    title="Arquitectura propuesta"
    subtitle="Cognito centraliza credenciales y emisión de tokens; una API Gateway con Lambda authorizer valida cada request; y un único dominio de identidad reemplaza los N esquemas de usuario dispersos."
  />

  <MermaidDiagram :code="architectureDiagram" caption="Arquitectura de autenticación centralizada, de arriba hacia abajo." />

  <div class="prose-body mt-10 max-w-3xl">
    <h2>Cómo se lee el diagrama</h2>
    <p>
      Cada sistema de negocio conserva su propia app cliente, pero todas delegan el login en la
      <strong>Cognito Hosted UI</strong>, usando un <strong>App Client</strong> distinto por
      sistema (mismo User Pool, distintas apps registradas). Cognito gestiona credenciales, MFA y
      la emisión del JWT — nadie más almacena contraseñas.
    </p>
    <p>
      Todo request hacia un servicio, sea de identidad o de negocio, pasa primero por
      <strong>API Gateway</strong>, donde un <strong>Lambda authorizer</strong> valida la firma y
      la expiración del token contra el JWKS público de Cognito. Si el token no es válido, el
      request se corta ahí — ni el servicio de auth ni los servicios de negocio vuelven a validar
      nada.
    </p>
  </div>

  <h2 class="mt-10 mb-4 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
    Dos ramas desde el Gateway
  </h2>
  <DocTabs :tabs="['Dominio de identidad', 'Sistemas de negocio (N)']">
    <template #tab-0>
      <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        El <strong>Servicio de Auth</strong> es el único componente con acceso de escritura a
        <code>BD_AUTH</code> (RDS/Aurora Postgres). Expone el perfil completo del usuario
        (nombre, email, foto, idioma, país, zona horaria, rol por sistema) tanto para las Lambdas
        de Cognito como para los servicios de negocio que necesiten datos que no vienen en el JWT.
      </p>
    </template>
    <template #tab-1>
      <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        Cada <strong>servicio de negocio</strong> confía en los claims del JWT ya validado por el
        Gateway (rol, tenant_id/id_cliente, idioma, zona_horaria) para resolver la request. Ya no
        necesita autenticar nada por su cuenta.
      </p>
    </template>
  </DocTabs>

  <DocCard title="Regla clave de la migración" tone="warning" class="mt-8 max-w-3xl">
    Cada sistema de negocio <strong>elimina su schema de usuario</strong>. Solo conserva
    <code>id_usuario</code> como referencia lógica al usuario en <code>BD_AUTH</code> — no existe
    (ni puede existir) una foreign key real entre motores de base de datos distintos, así que la
    integridad referencial se garantiza a nivel de aplicación, no del motor de BD.
  </DocCard>

  <h2 class="mt-12 mb-4 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
    Lambdas de Cognito
  </h2>
  <DocAccordion :items="lambdas" />
</template>
