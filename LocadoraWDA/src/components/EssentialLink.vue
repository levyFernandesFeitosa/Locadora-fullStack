<template>
  <q-item
    clickable
    v-ripple
    tag="router-link"
    :to="props.link"
    exact-active-class="active-link"
  >
    <!-- Ícone (opcional) -->
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>

    <!-- Título e legenda -->
    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineOptions({
  name: 'EssentialLink'
})

const props = defineProps({
  title: { type: String, required: true },
  caption: { type: String, default: '' },
  link: { type: String, default: '#' },
  icon: { type: String, default: '' }
})
</script>

<style scoped>
/* Cor fixa para o item da página ativa */
.active-link {
  background-color: #274e55 !important; /* cor de fundo quando ativo */
  color: rgba(159, 252, 255, 1);             /* cor do texto quando ativo */
}

/* Cor do hover (quando passa o mouse) */
.q-item:hover {
  background-color: #00bfa6 !important;; /* escolhe a cor que quiser */
  color: black;              /* mantém texto visível */
}
</style>