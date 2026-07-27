<script setup lang="ts">
import DocPageHeader from '@/components/DocPageHeader.vue'
import DocCard from '@/components/DocCard.vue'
import MermaidDiagram from '@/components/MermaidDiagram.vue'

const estadoActualDiagram = `
flowchart TB
  subgraph S1["Sistema A"]
    A1["App / API A"] --> DBA[("BD_A<br/>T_USUARIO (usr, pwd, roles,<br/>idioma, país, TZ)")]
  end
  subgraph S2["Sistema B"]
    A2["App / API B"] --> DBB[("BD_B<br/>T_USUARIO (usr, pwd, roles,<br/>idioma, país, TZ)")]
  end
  subgraph S3["Sistema C"]
    A3["App / API C"] --> DBC[("BD_C<br/>T_USUARIO (usr, pwd, roles,<br/>idioma, país, TZ)")]
  end
  subgraph SN["Sistema N..."]
    A4["App / API N"] --> DBN[("BD_N<br/>T_USUARIO (usr, pwd, roles,<br/>idioma, país, TZ)")]
  end

  U(("Mismo usuario<br/>final")) -.registra credenciales.-> DBA
  U -.registra credenciales.-> DBB
  U -.registra credenciales.-> DBC
  U -.registra credenciales.-> DBN

  style U fill:#f43f5e,stroke:#be123c,color:#fff
`

const dolores = [
  {
    title: 'Contraseñas duplicadas',
    body: 'Un mismo usuario debe crear y recordar una credencial distinta por cada sistema, porque cada BD gestiona su propio hash de contraseña de forma aislada.',
  },
  {
    title: 'Inconsistencia de datos',
    body: 'El nombre, el idioma, el país o el estado "activo" de un usuario pueden divergir entre sistemas: se actualiza en uno y queda desactualizado en los demás.',
  },
  {
    title: 'Sin SSO entre sistemas',
    body: 'No existe una sesión compartida: cambiar de un sistema de negocio a otro implica loguearse de nuevo, aunque sea la misma persona.',
  },
  {
    title: '¿En qué BD vive el usuario?',
    body: 'Soporte y operaciones no tienen una forma directa de saber en cuáles de las N bases de datos existe una cuenta para un email dado, ni cuál es la fuente de verdad.',
  },
]
</script>

<template>
  <DocPageHeader
    eyebrow="01 · Contexto"
    title="El problema: N bases de datos, N esquemas de usuario"
    subtitle="Cada sistema de negocio nació con su propia tabla de usuarios. Con el tiempo, esa duplicación se volvió el mayor punto de fricción operativa y de seguridad del ecosistema."
  />

  <div class="prose-body max-w-3xl">
    <p>
      Hoy el ecosistema está compuesto por múltiples sistemas de negocio, cada uno con su propia
      base de datos. Todas ellas replican, de forma independiente, una tabla del estilo
      <code>T_USUARIO</code> con columnas como <code>username</code>, <code>password</code>,
      roles asignados, y catálogos propios de idioma, país y zona horaria.
    </p>
    <p>
      El resultado es que la identidad de una persona no es un concepto único: es una colección de
      filas parecidas pero independientes, repartidas entre bases de datos que no se comunican
      entre sí y que pueden divergir en cualquier momento.
    </p>
  </div>

  <MermaidDiagram
    :code="estadoActualDiagram"
    caption="Estado actual: cada sistema es una isla de identidad con su propio T_USUARIO."
  />

  <h2 class="mt-12 mb-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
    Los dolores concretos
  </h2>
  <div class="grid gap-4 sm:grid-cols-2">
    <DocCard v-for="dolor in dolores" :key="dolor.title" :title="dolor.title" tone="danger">
      {{ dolor.body }}
    </DocCard>
  </div>

  <div class="prose-body mt-10 max-w-3xl">
    <h2>¿Por qué ahora?</h2>
    <p>
      Cada sistema nuevo que se incorpora repite el mismo error: una tabla de usuarios más, un
      catálogo de idiomas más, una contraseña más que sincronizar manualmente. La propuesta de
      este documento es extraer la identidad de cada sistema de negocio y centralizarla en un
      único dominio de autenticación, apoyado en
      <strong>AWS Cognito</strong> y en una base de datos de autenticación (<code>BD_AUTH</code>)
      compartida. El resto de las secciones detalla la arquitectura, el modelo de datos y la
      estrategia de migración para llegar ahí sin interrumpir los sistemas actuales.
    </p>
  </div>
</template>
