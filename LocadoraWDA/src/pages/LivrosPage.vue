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
              name="menu_book"
              size="32px"
              class="q-mr-sm"
              color="primary"
            />
            <span class="text-white text-weight-bold ellipsis">{{
              $t("BooksPage.title")
            }}</span>
          </div>
        </div>

        <div
          class="col-auto col-md-2 order-xs-3 order-md-2 q-ml-auto q-ml-md-none"
        >
          <q-btn
            class="CadastroBTN"
            :label="$t('BooksPage.register_button')"
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
            v-model="termoPesquisa"
            :label="$t('BooksPage.search_placeholder')"
            debounce="300"
            clearable
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <q-table
      :rows="livros"
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
      :loading="carregando"
      :filter="termoPesquisa"
    >
      <template v-slot:header="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props" class="linha-destacada">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th>{{ $t("BooksPage.actions_header") }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.name === 'bookLaunch'">{{
              col.format(col.value)
            }}</span>
            <span v-else>{{ col.value }}</span>
          </q-td>
          <q-td>
            <q-btn
              dense
              flat
              icon="edit"
              color="primary"
              @click="abrirModalEdicao(props.row)"
              :disable="userRole === 'USER'"
            />
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              @click="confirmarExclusao(props.row.id)"
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
                  <span v-if="col.name === 'bookLaunch'">
                    {{ col.format(col.value) }}
                  </span>
                  <span v-else>
                    {{ col.value }}
                  </span>
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
                @click="abrirModalEdicao(props.row)"
                :disable="userRole === 'USER'"
              />
              <q-btn
                dense
                flat
                icon="delete"
                color="negative"
                @click="confirmarExclusao(props.row.id)"
                :disable="userRole === 'USER'"
              />
            </q-card-actions>
          </q-card>
        </div>
      </template>
      <template v-slot:loading>
        <q-inner-loading
          showing
          color="primary"
          :label="$t('BooksPage.loading_books')"
        />
      </template>
    </q-table>
    <q-dialog v-model="modalAberto">
      <q-card class="modal">
        <q-form @submit.prevent="salvarLivro" style="width: 100%; height: 90%">
          <q-card-section class="conteudoModal">
            <div class="tituloModal">
              {{
                editando
                  ? $t("BooksPage.modal_update_title")
                  : $t("BooksPage.modal_register_title")
              }}
            </div>

            <q-input
              class="inputModal"
              outlined
              v-model="livroForm.bookTitle"
              :label="$t('BooksPage.input_title_label')"
              :error="errosCadastro.bookTitle"
              error-color="negative"
              @input="validarCampo('bookTitle')"
            />

            <q-input
              class="inputModal"
              outlined
              v-model="livroForm.bookAuthor"
              :label="$t('BooksPage.input_author_label')"
              :error="errosCadastro.bookAuthor"
              error-color="negative"
              @input="validarCampo('bookAuthor')"
            />

            <q-input
              class="inputModal"
              outlined
              v-model="livroForm.bookLaunch"
              :label="$t('BooksPage.input_launch_date_label')"
              type="date"
              stack-label
              :error="errosCadastro.bookLaunch"
              error-color="negative"
              @input="validarCampo('bookLaunch')"
            />

            <q-input
              class="inputModal"
              outlined
              v-model.number="livroForm.bookTotal"
              :label="$t('BooksPage.input_total_quantity_label')"
              type="number"
              min="1"
              step="1"
              :error="errosCadastro.bookTotal"
              error-color="negative"
              @input="validarCampo('bookTotal')"
            />

            <q-select
              class="inputModalSelect"
              outlined
              v-model="livroForm.publisherName"
              :options="opcoesEditoras"
              :label="$t('BooksPage.input_publisher_label')"
              :error="errosCadastro.publisherName"
              error-color="negative"
              @update:model-value="validarCampo('publisherName')"
            />
          </q-card-section>
          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="
                editando
                  ? $t('BooksPage.update_button')
                  : $t('BooksPage.register_button')
              "
              color="primary"
              type="submit"
              :loading="salvando"
            />
            <q-btn
              class="modalBTN"
              :label="$t('BooksPage.cancel_button')"
              @click="fecharModal"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="">
        <q-card-section class="conteudoModal text-center">
          <div class="text-h6 lt-sm:text-body1">
            {{ $t("BooksPage.confirm_delete_q1") }}
            {{ $t("BooksPage.confirm_delete_q2") }}
          </div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('BooksPage.delete_button')"
            color="negative"
            @click="deletarLivroConfirmado"
          />
          <q-btn
            class="modalBTN"
            :label="$t('BooksPage.back_button')"
            flat
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
import LivrosService from "src/services/livrosService";

// Função para obter o papel do usuário (ADMIN/USER)
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

const errosCadastro = ref({});

const livros = ref([]);
const carregando = ref(true);
const termoPesquisa = ref("");
const opcoesEditoras = ref([]);

const livroForm = ref({
  id: null,
  bookTitle: "",
  bookAuthor: "",
  bookLaunch: "",
  bookTotal: null,
  bookInUse: 0,
  publisherName: "",
});

const modalAberto = ref(false);
const editando = ref(false);
const salvando = ref(false);
const modalExcluir = ref(false);
const livroParaDeletarId = ref(null);

const columns = computed(() => [
  {
    name: "bookTitle",
    label: t("BooksPage.column_title"),
    field: "bookTitle",
    align: "left",
    sortable: true,
  },
  {
    name: "bookAuthor",
    label: t("BooksPage.column_author"),
    field: "bookAuthor",
    align: "left",
    sortable: true,
  },
  {
    name: "bookLaunch",
    label: t("BooksPage.column_launch_date"),
    field: "bookLaunch",
    align: "center",
    sortable: true,
    format: (val) =>
      val ? val.substring(0, 10) : t("BooksPage.not_applicable"),
  },
  {
    name: "bookTotal",
    label: t("BooksPage.column_total"),
    field: "bookTotal",
    align: "center",
    sortable: true,
  },
  {
    name: "bookInUse",
    label: t("BooksPage.column_in_use"),
    field: "bookInUse",
    align: "center",
    sortable: true,
  },
  {
    name: "publisher",
    label: t("BooksPage.column_publisher"),
    field: (row) => row.publisher?.publishersName || t("BooksPage.not_applicable"),
    align: "left",
    sortable: true,
  },
]);

const validarCampo = (campo) => {
  const valor = livroForm.value[campo];

  if (!valor || (typeof valor === 'string' && valor.trim() === "") || (campo === "publisherName" && !valor)) {
    errosCadastro.value[campo] = true;
    return;
  }

  if (campo === "bookTotal") {
    if (isNaN(valor)) {
      errosCadastro.value[campo] = true;
      return;
    }
  }

  delete errosCadastro.value[campo];
};

const validarFormulario = () => {
  errosCadastro.value = {};

  const camposObrigatorios = [
    "bookTitle",
    "bookAuthor",
    "bookLaunch",
    "bookTotal",
    "publisherName",
  ];

  camposObrigatorios.forEach((campo) => {
    validarCampo(campo);
  });

  return Object.keys(errosCadastro.value).length === 0;
};

async function carregarOpcoesEditoras() {
  try {
    // Assumindo que LivrosService tem um método para buscar editoras
    // ou que você tem um serviço de editoras importado/mockado.
    // Para esta demonstração, estou usando um mock simples
    // ou assumindo que o endpoint de LivrosService.carregarEditorasMap() retorna
    // um array de objetos com a propriedade 'publishersName'.
    
    // Se LivrosService.carregarEditorasMap() retornar DTOs de editoras:
    const EditorasService = (await import("src/services/editorasService")).default;
    const editoras = await EditorasService.buscarTodas(); 
    opcoesEditoras.value = editoras.map((e) => e.publishersName); 

  } catch (error) {
    console.error("Falha ao carregar editoras:", error);
    $q.notify({
      type: "negative",
      message: t("BooksPage.error_load_publishers") || "Erro ao carregar editoras",
      caption: t("BooksPage.error_connection"),
    });
  }
}

async function carregarTudo() {
  carregando.value = true;
  try {
    await carregarOpcoesEditoras();
    livros.value = await LivrosService.buscarTodos();
  } catch (error) {
    console.error("Falha geral ao carregar dados:", error);
    $q.notify({
      type: "negative",
      message: error.message || t("BooksPage.error_load_default"),
      caption: error.response?.data?.message || t("BooksPage.error_connection"),
    });
    livros.value = [];
  } finally {
    carregando.value = false;
  }
}

function limparFormulario() {
  livroForm.value = {
    id: null,
    bookTitle: "",
    bookAuthor: "",
    bookLaunch: "",
    bookTotal: null,
    bookInUse: 0,
    publisherName: "",
  };
  errosCadastro.value = {};
}

function fecharModal() {
  modalAberto.value = false;
  limparFormulario();
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

  editando.value = false;
  limparFormulario();
  modalAberto.value = true;
}

function abrirModalEdicao(livro) {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general.error_permission_update"),
      timeout: 3000
    });
    return;
  }

  editando.value = true;
  errosCadastro.value = {};
  const launchDateString = livro.bookLaunch
    ? livro.bookLaunch.substring(0, 10)
    : "";

  livroForm.value = {
    id: livro.id,
    bookTitle: livro.bookTitle,
    bookAuthor: livro.bookAuthor,
    bookLaunch: launchDateString,
    bookTotal: livro.bookTotal,
    bookInUse: livro.bookInUse,
    publisherName: livro.publisher?.publishersName || "",
  };
  modalAberto.value = true;
}

async function salvarLivro() {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general.error_permission_save"),
      timeout: 3000
    });
    return;
  }

  const isFormValid = validarFormulario();

  const isBookTotalInvalid = livroForm.value.bookTotal !== null && (isNaN(livroForm.value.bookTotal) || livroForm.value.bookTotal < 1);

  if (!isFormValid || isBookTotalInvalid) {

    // 1. Erro de quantidade total (<= 0 ou NaN)
    if (isBookTotalInvalid) {
      $q.notify({
        type: "negative",
        message: "A quantidade total deve ser um número inteiro maior que zero.",
      });
      return;
    }

    // 2. Erros de campos vazios
    if (!isFormValid) {
      $q.notify({
        type: "warning",
        message: t("BooksPage.validation_fill_all"),
      });
      return;
    }
    return; // Garante que não continua se houver erros.
  }

  // 3. Validação de lógica (bookTotal < bookInUse)
  if (editando.value && livroForm.value.bookTotal < livroForm.value.bookInUse) {
    $q.notify({
      type: "warning",
      message: `O total de livros (${livroForm.value.bookTotal}) não pode ser menor que a quantidade em uso (${livroForm.value.bookInUse}).`,
    });
    return;
  }

  salvando.value = true;

  try {
    if (editando.value) {
      await LivrosService.atualizar(livroForm.value.id, livroForm.value);
      $q.notify({ type: "positive", message: t("BooksPage.success_update") });
    } else {
      await LivrosService.cadastrar(livroForm.value);
      $q.notify({ type: "positive", message: t("BooksPage.success_register") });
    }

    await carregarTudo();
    fecharModal();
  } catch (error) {
    let errorMessage = t("BooksPage.error_save_default");

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message.includes("Erro de validação:")) {
        errorMessage = error.message;
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
    });
  } finally {
    salvando.value = false;
  }
}

function confirmarExclusao(id) {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general.error_permission_delete"),
      timeout: 3000
    });
    return;
  }
  
  livroParaDeletarId.value = id;
  modalExcluir.value = true;
}

async function deletarLivroConfirmado() {
  // A verificação de permissão é feita no confirmarExclusao(), mas a mantemos aqui por segurança.
  if (userRole.value === 'USER') {
    modalExcluir.value = false;
    $q.notify({
      type: "negative",
      message: t("general.error_permission_delete"),
      timeout: 3000
    });
    return;
  }

  modalExcluir.value = false;
  carregando.value = true;
  try {
    await LivrosService.deletar(livroParaDeletarId.value);
    $q.notify({ type: "positive", message: t("BooksPage.success_delete") });
    await carregarTudo();
  } catch (error) {
    let errorMessage = t("BooksPage.error_delete_default");

    if (error.response?.status === 400) {
      // Caso o livro esteja em uso
      errorMessage = t("BooksPage.error_delete_linked");
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
    });
  } finally {
    carregando.value = false;
  }
}

onMounted(() => {
  carregarTudo();
});

watch(locale, () => {
  $q.notify({
    type: "info",
    message: t("general.language_updated") || "Idioma atualizado",
    timeout: 1000,
  });
});
</script>