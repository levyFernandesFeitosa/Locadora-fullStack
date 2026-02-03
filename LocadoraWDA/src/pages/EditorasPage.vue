<template>
  <q-page class="q-pa-md" style="background-color: #edead0">
    <div
      class="q-pa-md"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm q-col-gutter-y-sm full-width">
        <!-- Título -->
        <div class="col-6 col-sm-auto">
          <div class="titulo flex items-center">
            <q-icon
              name="library_books"
              size="32px"
              class="q-mr-sm"
              color="primary"
            />
            <span class="text-white text-weight-bold ellipsis">{{
              $t("PublishersPage_title")
            }}</span>
          </div>
        </div>

        <!-- Espaçador no Desktop/Tablet Grande -->
        <q-space class="gt-xs" />

        <!-- Botão de Cadastrar -->
        <div class="col-6 col-sm-auto row justify-end">
          <q-btn
            v-if="userRole === 'ADMIN'"
            class="CadastroBTN no-wrap q-px-md q-mb-none"
            style="height: 40px"
            :label="$t('PublishersPage_register_button')"
            color="primary"
            @click="abrirModalCadastro"
            icon="add"
            no-caps
            unelevated
          />
        </div>

        <!-- Barra de Pesquisa -->
        <div class="col-12 col-sm-auto">
          <q-input
            class="pesquisaALL rounded-borders q-mt-none"
            outlined
            v-model="pesquisa"
            :label="$t('PublishersPage_search_placeholder')"
            debounce="300"
            clearable
            dense
            bg-color="white"
            hide-bottom-space
            style="height: 40px;"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <q-table
      :rows="editorasFiltradas"
      :columns="columns"
      row-key="id"
      :grid="$q.screen.lt.md"
      :hide-header="$q.screen.lt.md"
      :rows-per-page-options="[5, 10, 20, 0]"
      :pagination="{
        page: 1,
        rowsPerPage: $q.screen.lt.md ? 0 : 5,
      }"
      :hide-pagination="$q.screen.lt.md"
      flat
      bordered
      :loading="isLoading"
    >
      <template v-slot:header="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props" class="linha-destacada">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th v-if="userRole === 'ADMIN'">{{ $t("PublishersPage_actions_header") }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props" :class="col.name === 'site' ? 'break-url' : ''">
            {{ col.value }}
          </q-td>
          <q-td v-if="userRole === 'ADMIN'">
            <q-btn
              dense
              flat
              icon="edit"
              color="primary"
              @click="editarEditora(props.row)"
            />
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              @click="confirmarExcluir(props.row)"
            />
          </q-td>
        </q-tr>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6">
          <q-card class="q-mb-md card-mobile" style="background-color: #f5f5f5">
            <q-card-section>
              <div
                v-for="col in props.cols"
                :key="col.name"
                class="row q-mb-xs"
              >
                <div class="col-5 text-weight-bold text-grey-7">
                  {{ col.label }}:
                </div>
                <div class="col-7 text-black" :class="col.name === 'site' ? 'break-url' : ''">
                  {{ col.value }}
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right" v-if="userRole === 'ADMIN'">
              <q-btn
                dense
                flat
                icon="edit"
                color="primary"
                @click="editarEditora(props.row)"
              />
              <q-btn
                dense
                flat
                icon="delete"
                color="negative"
                @click="confirmarExcluir(props.row)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>
    
    <q-dialog v-model="modalAberto">
      <q-card class="modal column no-wrap" style="max-height: 90vh;">
        <div class="tituloModal">
          {{ editando ? $t("PublishersPage_modal_update_title") : $t("PublishersPage_modal_register_title") }}
        </div>
        <q-form ref="formEditora" @submit.prevent="salvarEditora" class="column no-wrap" style="width: 100%; height: 100%">
          <q-card-section class="conteudoModal scroll">

            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="editoraForm.nome"
                   :label="$t('PublishersPage_input_name_label') + $t('general_min_3_chars')"
                   :rules="[val => !!val || '', val => val.length >= 3 || '']"
                   lazy-rules
                   hide-bottom-space
                 />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="editoraForm.email"
                   :label="$t('PublishersPage_input_email_label') + $t('general_email_format')"
                   type="email"
                   :rules="[val => !!val || '', val => /.+@.+\..+/.test(val) || '']"
                   lazy-rules
                   hide-bottom-space
                 />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="editoraForm.telefone"
                   :label="$t('PublishersPage_input_phone_label') + $t('general_phone_format')"
                   mask="(##) #####-####"
                   :rules="[val => !!val || '', val => val.replace(/\D/g, '').length >= 10 || '']"
                   lazy-rules
                   hide-bottom-space
                 />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="editoraForm.site"
                   :label="$t('PublishersPage_input_website_label') + ' (URL)'"
                   :rules="[
                     val => !!val || '', 
                     val => val.length >= 3 || '',
                     val => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(val) || $t('error.validation.site_invalid_format')
                   ]"
                   lazy-rules
                   hide-bottom-space
                 />
              </div>
            </div>
          </q-card-section>
          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="editando ? $t('PublishersPage_update_button') : $t('PublishersPage_register_button')"
              color="primary"
              type="submit"
            />
            <q-btn
              class="modalBTN"
              :label="editando ? $t('PublishersPage_close_button') : $t('PublishersPage_cancel_button')"
              @click="modalAberto = false"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="">
        <q-card-section class="conteudoModal text-center">
          <div class="text-h6 lt-sm:text-body1">
            {{ $t("PublishersPage_confirm_delete_q1") }},
            {{ $t("PublishersPage_confirm_delete_q2") }}
          </div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('PublishersPage_delete_button')"
            color="negative"
            @click="executarExclusao"
          />
          <q-btn
            class="modalBTN"
            :label="$t('PublishersPage_back_button')"
            @click="modalExcluir = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import EditorasService from "src/services/editorasService";

function getCurrentUserRole() {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const role = JSON.parse(userInfo).role;
      return role ? String(role).trim().toUpperCase() : null;
    } catch (e) {
      return null;
    }
  }
  return null;
}

const userRole = ref(getCurrentUserRole());

const $q = useQuasar();
const { t, locale } = useI18n();

const allEditoras = ref([]);
const pesquisa = ref("");
const isLoading = ref(true);
const formEditora = ref(null);

const modalAberto = ref(false);
const editando = ref(false);
const modalExcluir = ref(false);

const editoraForm = ref({
  id: null,
  nome: "",
  email: "",
  telefone: "",
  site: "",
});

const editoraParaExcluir = ref(null);

const columns = computed(() => [
  {
    name: "name",
    label: t("PublishersPage_column_name"),
    field: "publishersName",
    align: "left",
    sortable: true,
  },
  {
    name: "email",
    label: t("PublishersPage_column_email"),
    field: "publishersEmail",
    align: "left",
    sortable: true,
  },
  {
    name: "telephone",
    label: t("PublishersPage_column_phone"),
    field: "publishersTelephone",
    align: "left",
    sortable: true,
  },
  {
    name: "site",
    label: t("PublishersPage_column_website"),
    field: "publishersSite",
    align: "left",
    sortable: true,
  },
]);

const editorasFiltradas = computed(() => {
  if (!pesquisa.value) {
    return allEditoras.value;
  }
  const termo = pesquisa.value.toLowerCase();

  return allEditoras.value.filter((editora) => {
    return (
      editora.publishersName?.toLowerCase().includes(termo) ||
      editora.publishersEmail?.toLowerCase().includes(termo) ||
      editora.publishersTelephone?.toLowerCase().includes(termo) ||
      editora.publishersSite?.toLowerCase().includes(termo)
    );
  });
});

async function carregarEditoras() {
  isLoading.value = true;
  try {
    const data = await EditorasService.buscarTodas();
    allEditoras.value = Array.isArray(data) ? data : data ? [data] : [];
  } catch (error) {
    console.error("Falha ao carregar editoras:", error);
    $q.notify({
      type: "negative",
      message: t("PublishersPage_error_load_default"),
      caption:
        error.response?.data?.message || t("PublishersPage_error_connection"),
    });
  } finally {
    isLoading.value = false;
  }
}

function limparFormulario() {
  editoraForm.value = {
    id: null,
    nome: "",
    email: "",
    telefone: "",
    site: "",
  };
}

function abrirModalCadastro() {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general_error_permission_register"),
      timeout: 3000
    });
    return;
  }

  limparFormulario();
  editando.value = false;
  modalAberto.value = true;
}

function editarEditora(editora) {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general_error_permission_update"),
      timeout: 3000
    });
    return;
  }

  editoraForm.value = {
    id: editora.id,
    nome: editora.publishersName,
    email: editora.publishersEmail,
    telefone: editora.publishersTelephone,
    site: editora.publishersSite,
  };
  editando.value = true;
  modalAberto.value = true;
}

async function salvarEditora() {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: editando.value ? t("general_error_permission_update") : t("general_error_permission_register"),
      timeout: 3000
    });
    return;
  }

  const errors = [];
  if (!editoraForm.value.nome || editoraForm.value.nome.length < 3) errors.push(t("error.validation.publisher_name_required"));
  if (!editoraForm.value.email || !/.+@.+\..+/.test(editoraForm.value.email)) errors.push(t("error.validation.email_invalid"));
  if (!editoraForm.value.telefone || editoraForm.value.telefone.replace(/\D/g, '').length < 10) errors.push(t("error.validation.phone_invalid"));
  if (!editoraForm.value.site || editoraForm.value.site.length < 3) errors.push(t("error.validation.site_invalid"));

  if (errors.length > 0) {
    errors.forEach(msg => $q.notify({ type: "negative", message: msg, position: "top", timeout: 4000 }));
    return;
  }

  const success = await formEditora.value.validate();
  if (!success) return;

  try {
    const dataToSend = {
      publishersName: editoraForm.value.nome,
      publishersEmail: editoraForm.value.email,
      publishersTelephone: editoraForm.value.telefone,
      publishersSite: editoraForm.value.site,
    };

    if (editando.value) {
      await EditorasService.atualizar(editoraForm.value.id, dataToSend);
      $q.notify({
        type: "positive",
        message: t("PublishersPage_success_update"),
        position: "top"
      });
    } else {
      await EditorasService.criar(dataToSend);
      $q.notify({
        type: "positive",
        message: t("PublishersPage_success_register"),
        position: "top"
      });
    }

    modalAberto.value = false;
    carregarEditoras();
  } catch (error) {
    console.log("Erro ao salvar editora:", error.response?.data);
    const apiMsg = error.response?.data?.message;
    const errorMessage = apiMsg ? t(apiMsg) : (editando.value ? t("PublishersPage_error_update_default") : t("PublishersPage_error_register_default"));
    
    $q.notify({
      type: "negative",
      message: errorMessage,
      position: "top",
      timeout: 5000,
    });
  }
}

function confirmarExcluir(editora) {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general_error_permission_delete"),
      timeout: 3000
    });
    return;
  }
  editoraParaExcluir.value = editora;
  modalExcluir.value = true;
}

async function executarExclusao() {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general_error_permission_delete"),
      timeout: 3000
    });
    return;
  }

  try {
    await EditorasService.deletar(editoraParaExcluir.value.id);

    $q.notify({
      type: "positive",
      message: t("PublishersPage_success_delete"),
    });
    modalExcluir.value = false;
    carregarEditoras();
  } catch (error) {
    console.log("Erro na exclusão de editora:", error.response?.data);
    let errorMessage = error.response?.data?.message || t("PublishersPage_error_delete_default");
    if (error.response?.status === 409 || (errorMessage && errorMessage.includes("linked"))) {
      errorMessage = t("error.resource_linked");
    } else if (errorMessage === "error.conflict_site") {
      errorMessage = t("error.conflict_site");
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
      position: "top",
      timeout: 7000,
    });
  }
}

onMounted(() => {
  console.log('Role atual (EditorasPage):', userRole.value);
  carregarEditoras();
});

watch(locale, () => {
  $q.notify({
    type: "info",
    message: t("general_language_updated") || "Idioma atualizado",
    timeout: 1000,
  });
});
</script>

<style scoped>
.break-url {
  word-break: break-all;
  white-space: normal;
}

/* Força o alinhamento central absoluto e altura igual */
.CadastroBTN,
.pesquisaALL {
  height: 40px !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center !important;
}

/* Remove a margem interna que o Quasar coloca no controle do input */
:deep(.pesquisaALL .q-field__control) {
  height: 40px !important;
  margin-top: 0 !important;
}

/* Ajusta o texto do botão para não cortar */
.CadastroBTN {
  white-space: nowrap !important;
  min-width: fit-content !important;
}

.pesquisaALL :deep(.q-field__native),
.pesquisaALL :deep(.q-field__prefix),
.pesquisaALL :deep(.q-field__suffix),
.pesquisaALL :deep(.q-field__input) {
  min-height: 40px !important;
}

@media (max-width: 599px) {
  .row.items-center.q-col-gutter-y-sm.full-width {
    gap: 10px 0; /* Espaçamento entre as linhas no mobile */
  }
}
</style>
