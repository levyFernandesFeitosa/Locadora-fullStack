<template>
  <q-page class="q-pa-md" style="background-color: #edead0">
    <div
      class="q-pa-md example-row-column-width"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm flex-md-row flex-column">
        <div class="col-grow col-md-6 order-xs-2 order-md-1">
          <div class="titulo flex items-center">
            <q-icon
              name="library_books"
              size="32px"
              class="q-mr-sm"
              color="primary"
            />
            <span class="text-white text-weight-bold ellipsis">{{
              $t("PublishersPage.title")
            }}</span>
          </div>
        </div>

        <div
          class="col-auto col-md-2 order-xs-3 order-md-2 q-ml-auto q-ml-md-none"
        >
          <q-btn
            class="CadastroBTN full-width"
            :label="$t('PublishersPage.register_button')"
            color="primary"
            @click="abrirModalCadastro"
            icon="person_add"
            :disable="userRole === 'USER'"
          />
        </div>

        <div class="col-12 col-md-4 order-xs-1 order-md-3">
          <q-input
            class="pesquisaALL"
            standout
            v-model="pesquisa"
            :label="$t('PublishersPage.search_placeholder')"
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
          <q-th>{{ $t("PublishersPage.actions_header") }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td>
            <q-btn
              dense
              flat
              icon="edit"
              color="primary"
              @click="editarEditora(props.row)"
              :disable="userRole === 'USER'"
            />
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              @click="confirmarExcluir(props.row)"
              :disable="userRole === 'USER'"
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
                <div class="col-7 text-black">
                  {{ col.value }}
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                dense
                flat
                icon="edit"
                color="primary"
                @click="editarEditora(props.row)"
                :disable="userRole === 'USER'"
              />
              <q-btn
                dense
                flat
                icon="delete"
                color="negative"
                @click="confirmarExcluir(props.row)"
                :disable="userRole === 'USER'"
              />
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="modalCadastro">
      <q-card class="modal" style="max-height: 80%; width: 100%">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">
            {{ $t("PublishersPage.modal_register_title") }}
          </div>

          <q-input
            class="inputModal"
            outlined
            v-model="novaEditora.nome"
            :label="$t('PublishersPage.input_name_label')"
            :error="errosCadastro.nome"
            error-color="negative"
            @input="validarCampo('nome')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novaEditora.email"
            :label="$t('PublishersPage.input_email_label')"
            type="email"
            :error="errosCadastro.email"
            error-color="negative"
            @input="validarCampo('email')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novaEditora.telefone"
            :label="$t('PublishersPage.input_phone_label')"
            :error="errosCadastro.telefone"
            error-color="negative"
            @input="validarCampo('telefone')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novaEditora.site"
            :label="$t('PublishersPage.input_website_label')"
            :error="errosCadastro.site"
            error-color="negative"
            @input="validarCampo('site')"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('PublishersPage.register_button')"
            color="primary"
            @click="cadastrarEditora"
          />
          <q-btn
            class="modalBTN"
            :label="$t('PublishersPage.cancel_button')"
            @click="modalCadastro = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalEditar">
      <q-card class="modal" style="max-height: 80%; width: 100%">
        <q-card-section class="conteudoModal">
          <div class="tituloModal">
            {{ $t("PublishersPage.modal_update_title") }}
          </div>

          <q-input
            class="inputModal"
            v-model="editoraEditar.nome"
            :label="$t('PublishersPage.input_name_label')"
            :error="errosEdicao.nome"
            :error-message="
              errosEdicao.nome ? $t('PublishersPage.validation_required') : ''
            "
            @input="validarCampo('nome', 'edicao')"
            required
          />
          <q-input
            class="inputModal"
            v-model="editoraEditar.email"
            :label="$t('PublishersPage.input_email_label')"
            type="email"
            :error="errosEdicao.email"
            :error-message="
              errosEdicao.email ? $t('PublishersPage.validation_required') : ''
            "
            @input="validarCampo('email', 'edicao')"
            required
          />
          <q-input
            class="inputModal"
            v-model="editoraEditar.telefone"
            :label="$t('PublishersPage.input_phone_label')"
            :error="errosEdicao.telefone"
            :error-message="
              errosEdicao.telefone
                ? $t('PublishersPage.validation_required')
                : ''
            "
            @input="validarCampo('telefone', 'edicao')"
            required
          />
          <q-input
            class="inputModal"
            v-model="editoraEditar.site"
            :label="$t('PublishersPage.input_website_label')"
            :error="errosEdicao.site"
            :error-message="
              errosEdicao.site ? $t('PublishersPage.validation_required') : ''
            "
            @input="validarCampo('site', 'edicao')"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('PublishersPage.update_button')"
            color="primary"
            @click="atualizarEditora"
          />
          <q-btn
            class="modalBTN"
            :label="$t('PublishersPage.close_button')"
            @click="modalEditar = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="">
        <q-card-section class="conteudoModal text-center">
          <div class="text-h6 lt-sm:text-body1">
            {{ $t("PublishersPage.confirm_delete_q1") }},
            {{ $t("PublishersPage.confirm_delete_q2") }}
          </div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('PublishersPage.delete_button')"
            color="negative"
            @click="excluirEditora"
          />
          <q-btn
            class="modalBTN"
            :label="$t('PublishersPage.back_button')"
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
      return JSON.parse(userInfo).role;
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

const modalCadastro = ref(false);
const modalEditar = ref(false);
const modalExcluir = ref(false);

const novaEditora = ref({
  nome: "",
  email: "",
  telefone: "",
  site: "",
});

const editoraEditar = ref({});
const editoraExcluir = ref({});

const errosCadastro = ref({
  nome: false,
  email: false,
  telefone: false,
  site: false,
});

const errosEdicao = ref({
  nome: false,
  email: false,
  telefone: false,
  site: false,
});

const columns = computed(() => [
  {
    name: "name",
    label: t("PublishersPage.column_name"),
    field: "publishersName",
    align: "left",
    sortable: true,
  },
  {
    name: "email",
    label: t("PublishersPage.column_email"),
    field: "publishersEmail",
    align: "left",
    sortable: true,
  },
  {
    name: "telephone",
    label: t("PublishersPage.column_phone"),
    field: "publishersTelephone",
    align: "left",
    sortable: true,
  },
  {
    name: "site",
    label: t("PublishersPage.column_website"),
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

function validarCampo(campo, tipo = "cadastro") {
  if (tipo === "cadastro") {
    errosCadastro.value[campo] = false;
  } else {
    errosEdicao.value[campo] = false;
  }
}

function validarFormularioCadastro() {
  let valido = true;
  const campos = ["nome", "email", "telefone", "site"];

  campos.forEach((campo) => {
    if (!novaEditora.value[campo] || novaEditora.value[campo].trim() === "") {
      errosCadastro.value[campo] = true;
      valido = false;
    } else {
      errosCadastro.value[campo] = false;
    }
  });

  return valido;
}

function validarFormularioEdicao() {
  let valido = true;
  const campos = ["nome", "email", "telefone"];

  campos.forEach((campo) => {
    if (
      !editoraEditar.value[campo] ||
      editoraEditar.value[campo].trim() === ""
    ) {
      errosEdicao.value[campo] = true;
      valido = false;
    } else {
      errosEdicao.value[campo] = false;
    }
  });

  return valido;
}

async function carregarEditoras() {
  isLoading.value = true;
  try {
    const data = await EditorasService.buscarTodas();
    allEditoras.value = Array.isArray(data) ? data : data ? [data] : [];
  } catch (error) {
    console.error("Falha ao carregar editoras:", error);
    $q.notify({
      type: "negative",
      message: t("PublishersPage.error_load_default"),
      caption:
        error.response?.data?.message || t("PublishersPage.error_connection"),
    });
  } finally {
    isLoading.value = false;
  }
}

function abrirModalCadastro() {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general.error_permission_register"),
      timeout: 3000
    });
    return;
  }

  novaEditora.value = { nome: "", email: "", telefone: "", site: "" };
  errosCadastro.value = {
    nome: false,
    email: false,
    telefone: false,
    site: false,
  };
  modalCadastro.value = true;
}

async function cadastrarEditora() {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general.error_permission_register"),
      timeout: 3000
    });
    return;
  }

  if (!validarFormularioCadastro()) {
    $q.notify({
      type: "negative",
      message: t("PublishersPage.validation_fill_all"),
    });
    return;
  }

  try {
    const dataToSend = {
      publishersName: novaEditora.value.nome,
      publishersEmail: novaEditora.value.email,
      publishersTelephone: novaEditora.value.telefone,
      publishersSite: novaEditora.value.site,
    };

    await EditorasService.criar(dataToSend);

    $q.notify({
      type: "positive",
      message: t("PublishersPage.success_register"),
    });
    modalCadastro.value = false;
    carregarEditoras();
  } catch (error) {
    console.error("Erro no cadastro:", error);
    $q.notify({
      type: "negative",
      message:
        error.response?.data?.message ||
        t("PublishersPage.error_register_default"),
    });
  }
}

function editarEditora(editora) {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general.error_permission_update"),
      timeout: 3000
    });
    return;
  }

  editoraEditar.value = {
    id: editora.id,
    nome: editora.publishersName,
    email: editora.publishersEmail,
    telefone: editora.publishersTelephone,
    site: editora.publishersSite,
  };
  errosEdicao.value = {
    nome: false,
    email: false,
    telefone: false,
    site: false,
  };
  modalEditar.value = true;
}

async function atualizarEditora() {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general.error_permission_update"),
      timeout: 3000
    });
    return;
  }

  if (!validarFormularioEdicao()) {
    $q.notify({
      type: "negative",
      message: t("PublishersPage.validation_fill_all"),
    });
    return;
  }

  try {
    const dataToSend = {
      publishersName: editoraEditar.value.nome,
      publishersEmail: editoraEditar.value.email,
      publishersTelephone: editoraEditar.value.telefone,
      publishersSite: editoraEditar.value.site,
    };

    await EditorasService.atualizar(editoraEditar.value.id, dataToSend);

    $q.notify({
      type: "positive",
      message: t("PublishersPage.success_update"),
    });
    modalEditar.value = false;
    carregarEditoras();
  } catch (error) {
    console.error("Erro na atualização:", error);
    $q.notify({
      type: "negative",
      message:
        error.response?.data?.message ||
        t("PublishersPage.error_update_default"),
    });
  }
}

function confirmarExcluir(editora) {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general.error_permission_delete"),
      timeout: 3000
    });
    return;
  }
  editoraExcluir.value = editora;
  modalExcluir.value = true;
}

async function excluirEditora() {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general.error_permission_delete"),
      timeout: 3000
    });
    return;
  }

  try {
    await EditorasService.deletar(editoraExcluir.value.id);

    $q.notify({
      type: "positive",
      message: t("PublishersPage.success_delete"),
    });
    modalExcluir.value = false;
    carregarEditoras();
  } catch (error) {
    console.error("Erro na exclusão:", error);
    let errorMessage = t("PublishersPage.error_delete_default");

    if (error.response?.status === 400) {
      errorMessage = t("PublishersPage.error_delete_linked");
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
      timeout: 7000,
    });
  }
}

onMounted(() => {
  carregarEditoras();
});

watch(locale, () => {
  $q.notify({
    type: "info",
    message: t("general.language_updated") || "Idioma atualizado",
    timeout: 1000,
  });
});
</script>