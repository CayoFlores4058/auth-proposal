<script setup lang="ts">
import DocPageHeader from '@/components/DocPageHeader.vue'
import DocSteps from '@/components/DocSteps.vue'
import MermaidDiagram from '@/components/MermaidDiagram.vue'

const steps = [
  {
    title: 'Login en la app',
    tag: 'Cognito',
    body: 'El usuario ingresa sus credenciales en la Cognito Hosted UI de la app cliente correspondiente. Cognito valida usuario y contraseña (y el segundo factor, si tiene MFA activo) contra el User Pool.',
  },
  {
    title: 'El JWT se enriquece con claims',
    tag: 'Lambda Pre Token Generation',
    body: 'Antes de emitir el token, Cognito dispara la Lambda Pre Token Generation, que consulta al Servicio de Auth (y este a BD_AUTH) para resolver rol, tenant_id/id_cliente, idioma y zona_horaria del usuario para ese sistema. Cognito devuelve un JWT ya enriquecido con esos claims.',
  },
  {
    title: 'La app llama al servicio de negocio',
    tag: 'App cliente',
    body: 'La app incluye el JWT recibido en el header Authorization: Bearer <JWT> de cada request hacia el sistema de negocio.',
  },
  {
    title: 'API Gateway valida el token',
    tag: 'Gateway + Authorizer',
    body: 'El Lambda authorizer verifica la firma del JWT contra el JWKS público de Cognito y su expiración. Si la validación falla, el request se corta aquí mismo con un 401 — el servicio de negocio nunca lo recibe.',
  },
  {
    title: 'El servicio de negocio resuelve la request',
    tag: 'Servicio de negocio',
    body: 'Con el token ya validado, el servicio lee los claims (rol, tenant_id, idioma, zona_horaria, id_usuario) y resuelve la request contra su propia base de datos, usando id_usuario como una columna normal — sin tabla de usuario propia ni validación de credenciales.',
  },
  {
    title: 'Datos que no vienen en el token',
    tag: 'Servicio de auth (en vivo)',
    body: 'Si el servicio de negocio necesita un dato que no viaja en el JWT (por ejemplo, la foto de perfil o el nombre completo actualizado), llama en vivo al Servicio de Auth en lugar de esperar a que ese dato se agregue como claim.',
  },
]

const sequenceDiagram = `
sequenceDiagram
    autonumber
    actor U as Usuario
    participant App as App cliente
    participant Cog as Cognito User Pool
    participant PreToken as Lambda Pre Token Gen
    participant Auth as Servicio de Auth
    participant BDA as BD_AUTH
    participant GW as API Gateway
    participant Biz as Servicio de negocio
    participant BDB as BD de negocio

    U->>App: Ingresa credenciales
    App->>Cog: Login (Hosted UI)
    Cog->>Cog: Valida credenciales
    Cog->>PreToken: Trigger Pre Token Generation
    PreToken->>Auth: Solicita rol, tenant_id, idioma, zona_horaria
    Auth->>BDA: Consulta T_USUARIO / T_USUARIO_SISTEMA
    BDA-->>Auth: Datos del usuario
    Auth-->>PreToken: Claims resueltos
    PreToken-->>Cog: Claims para inyectar
    Cog-->>App: JWT enriquecido
    App->>GW: Request + Authorization Bearer JWT
    GW->>GW: Valida firma y expiración (JWKS)
    alt Token inválido
        GW-->>App: 401 Unauthorized
    else Token válido
        GW->>Biz: Request + claims validados
        Biz->>BDB: Query usando id_usuario
        BDB-->>Biz: Datos de negocio
        opt Falta un dato que no viene en el JWT
            Biz->>Auth: Solicita perfil (ej. foto, nombre completo)
            Auth-->>Biz: Datos de perfil
        end
        Biz-->>App: Respuesta
    end
`
</script>

<template>
  <DocPageHeader
    eyebrow="04 · Flujo"
    title="Flujo de autenticación"
    subtitle="Desde el login hasta la respuesta del servicio de negocio: dónde se valida cada cosa y qué pasa cuando falta un dato en el token."
  />

  <DocSteps :steps="steps" />

  <h2 class="mt-12 mb-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
    El mismo flujo, como diagrama de secuencia
  </h2>
  <MermaidDiagram :code="sequenceDiagram" caption="Secuencia completa: login, enriquecimiento del JWT, validación y resolución de la request." />
</template>
