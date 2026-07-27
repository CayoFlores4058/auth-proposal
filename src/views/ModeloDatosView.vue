<script setup lang="ts">
import DocPageHeader from '@/components/DocPageHeader.vue'
import MermaidDiagram from '@/components/MermaidDiagram.vue'
import DocCard from '@/components/DocCard.vue'

const erDiagram = `
erDiagram
    T_USUARIO ||--o{ T_USUARIO_SISTEMA : accede
    T_USUARIO }o--|| M_IDIOMA : habla
    T_USUARIO }o--|| M_PAIS : reside
    T_USUARIO }o--|| M_ZONA_HORARIA : usa
    T_USUARIO ||--o{ T_USUARIO_GRUPO : pertenece
    T_GRUPO ||--o{ T_USUARIO_GRUPO : agrupa
    T_USUARIO_SISTEMA }o--|| M_ROL : tiene
    T_USUARIO_SISTEMA }o--|| M_CLIENTE : bajo

    T_USUARIO {
        uuid id_usuario PK
        string id_cognito_sub UK
        string dsc_email UK
        string dsc_nombres
        string dsc_apellidos
        string dsc_telefono
        string dsc_ciudad
        string dsc_sitio_web
        string dsc_img_profile
        int id_idioma FK
        int id_pais FK
        int id_zona_horaria FK
        numeric flg_activo
        date fch_creacion
        date fch_modificacion
        date fch_last_login
    }

    T_USUARIO_SISTEMA {
        uuid id_usuario_sistema PK
        uuid id_usuario FK
        string cod_sistema
        int id_cliente FK
        int id_rol FK
        numeric flg_activo
        date fch_asignacion
    }

    M_ROL {
        int id_rol PK
        string dsc_descripcion
        numeric flg_activo
    }

    M_CLIENTE {
        int id_cliente PK
        string dsc_nombre
        numeric flg_activo
    }

    T_GRUPO {
        int id_grupo PK
        string description
        numeric flg_active
    }

    T_USUARIO_GRUPO {
        uuid id_usuario FK
        int id_grupo FK
    }

    M_IDIOMA {
        int id_idioma PK
        string dsc_descripcion
        numeric flg_activo
    }

    M_PAIS {
        int id_pais PK
        string dsc_descripcion
        numeric flg_activo
    }

    M_ZONA_HORARIA {
        int id_zona_horaria PK
        string dsc_descripcion
        string time_zone
        numeric flg_activo
    }
`

const entities = [
  {
    name: 'T_USUARIO',
    purpose:
      'Perfil único del usuario en todo el ecosistema: identidad (id_cognito_sub, email), datos personales y preferencias de localización. Una fila por persona, sin importar cuántos sistemas use.',
  },
  {
    name: 'T_USUARIO_SISTEMA',
    purpose:
      'Tabla puente entre el usuario y cada sistema de negocio en el que participa. Es la pieza que permite que el mismo usuario tenga un rol distinto en cada sistema, y bajo un cliente/tenant distinto en cada uno.',
    highlight: true,
  },
  {
    name: 'M_ROL',
    purpose: 'Catálogo de roles disponibles. Un mismo rol puede reutilizarse entre distintos sistemas.',
  },
  {
    name: 'M_CLIENTE',
    purpose: 'Catálogo de clientes/tenants. Permite modelar escenarios multi-tenant dentro de un mismo sistema.',
  },
  {
    name: 'T_GRUPO / T_USUARIO_GRUPO',
    purpose: 'Agrupación transversal de usuarios (equipos, áreas, cuentas) independiente de los sistemas, vía relación muchos-a-muchos.',
  },
  {
    name: 'M_IDIOMA / M_PAIS / M_ZONA_HORARIA',
    purpose: 'Catálogos de localización, ahora únicos y compartidos por todo el ecosistema — ya no un catálogo distinto duplicado en cada BD de negocio.',
  },
]
</script>

<template>
  <DocPageHeader
    eyebrow="03 · Modelo de datos"
    title="Modelo de datos de BD_AUTH"
    subtitle="Un único esquema relacional reemplaza los N esquemas de usuario duplicados. T_USUARIO_SISTEMA es la pieza que hace posible que la misma persona tenga distintos roles en distintos sistemas."
  />

  <MermaidDiagram :code="erDiagram" caption="Modelo entidad-relación de BD_AUTH (RDS / Aurora Postgres)." />

  <h2 class="mt-12 mb-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
    Propósito de cada entidad
  </h2>

  <div class="grid gap-4 sm:grid-cols-2">
    <DocCard
      v-for="entity in entities"
      :key="entity.name"
      :title="entity.name"
      :tone="entity.highlight ? 'success' : 'default'"
      :class="entity.highlight ? 'sm:col-span-2' : ''"
    >
      {{ entity.purpose }}
    </DocCard>
  </div>

  <DocCard title="Por qué T_USUARIO_SISTEMA importa" tone="success" class="mt-6 max-w-3xl">
    Sin esta tabla, el rol tendría que vivir en <code>T_USUARIO</code>, forzando a que un usuario
    tenga un único rol global. Con <code>T_USUARIO_SISTEMA</code>, la misma persona puede ser
    <em>admin</em> en el Sistema A bajo el Cliente 1, y <em>lector</em> en el Sistema B bajo el
    Cliente 2 — cada fila de esta tabla es la combinación (usuario, sistema, cliente) que resuelve
    el rol efectivo, y es exactamente lo que consulta la Lambda Pre Token Generation al construir
    los claims del JWT.
  </DocCard>
</template>
