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
              $t("BooksPage_title")
            }}</span>
          </div>
        </div>

        <div
          v-if="userRole === 'ADMIN'"
          class="col-auto col-md-2 order-xs-3 order-md-2 q-ml-auto q-ml-md-none"
        >
          <q-btn
            class="CadastroBTN"
            :label="$t('BooksPage_register_button')"
            color="primary"
            @click="abrirModalCadastro"
            icon="person_add"
          />
        </div>

        <div class="col-12 col-md-4 order-xs-1 order-md-3">
          <q-input
            class="pesquisaALL"
            standout
            v-model="termoPesquisa"
            :label="$t('BooksPage_search_placeholder')"
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
          <q-th v-if="userRole === 'ADMIN'">{{ $t("BooksPage_actions_header") }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.name === 'bookLaunch'">{{
              formatarDataExibicao(props.row.bookLaunch)
            }}</span>
            <span v-else>{{ col.value }}</span>
          </q-td>
          <q-td v-if="userRole === 'ADMIN'">
            <q-btn
              dense
              flat
              icon="edit"
              color="primary"
              @click="abrirModalEdicao(props.row)"
            />
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              @click="confirmarExclusao(props.row.id)"
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
                    {{ formatarDataExibicao(props.row.bookLaunch) }}
                  </span>
                  <span v-else>
                    {{ col.value }}
                  </span>
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
                @click="abrirModalEdicao(props.row)"
              />
              <q-btn
                dense
                flat
                icon="delete"
                color="negative"
                @click="confirmarExclusao(props.row.id)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </template>
      <template v-slot:loading>
        <q-inner-loading
          showing
          color="primary"
          :label="$t('BooksPage_loading_books')"
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
                  ? $t("BooksPage_modal_update_title")
                  : $t("BooksPage_modal_register_title")
              }}
            </div>

            <q-input
              class="inputModal"
              outlined
              v-model="livroForm.bookTitle"
              :label="$t('BooksPage_input_title_label')"
              :error="errosCadastro.bookTitle"
              error-color="negative"
              @input="validarCampo('bookTitle')"
            />

            <q-input
              class="inputModal"
              outlined
              v-model="livroForm.bookAuthor"
              :label="$t('BooksPage_input_author_label')"
              :error="errosCadastro.bookAuthor"
              error-color="negative"
              @input="validarCampo('bookAuthor')"
            />

            <q-input
              class="inputModal"
              outlined
              :model-value="formattedLaunchDate"
              readonly
              :label="$t('BooksPage_input_launch_date_label')"
              :error="errosCadastro.bookLaunch"
              error-color="negative"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="livroForm.bookLaunch"
                      mask="YYYY-MM-DD"
                      color="primary"
                      today-btn
                      @update:model-value="validarCampo('bookLaunch')"
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup :label="t('RentersPage_close_button')" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              class="inputModal"
              outlined
              v-model.number="livroForm.bookTotal"
              :label="$t('BooksPage_input_total_quantity_label')"
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
              :label="$t('BooksPage_input_publisher_label')"
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
                  ? $t('BooksPage_update_button')
                  : $t('BooksPage_register_button')
              "
              color="primary"
              type="submit"
              :loading="salvando"
            />
            <q-btn
              class="modalBTN"
              :label="$t('BooksPage_cancel_button')"
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
            {{ $t("BooksPage_confirm_delete_q1") }}
            {{ $t("BooksPage_confirm_delete_q2") }}
          </div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('BooksPage_delete_button')"
            color="negative"
            @click="deletarLivroConfirmado"
          />
          <q-btn
            class="modalBTN"
            :label="$t('BooksPage_back_button')"
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
import { useQuasar, date } from "quasar";
import { useI18n } from "vue-i18n";
import LivrosService from "src/services/livrosService";

// Função para obter o papel do usuário (ADMIN/USER)
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

const formatarDataExibicao = (val) => {
  if (!val) return "";
  
  const dateStr = String(val).substring(0, 10);
  if (dateStr === "undefined" || dateStr === "null" || dateStr === "") {
    return "";
  }

  // Divide a string YYYY-MM-DD para evitar que o JS interprete como UTC
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);

  const format = locale.value.startsWith("en") ? "MM/DD/YYYY" : "DD/MM/YYYY";
  return date.formatDate(dateObj, format);
};

const formattedLaunchDate = computed(() => {
  return livroForm.value.bookLaunch ? formatarDataExibicao(livroForm.value.bookLaunch) : "";
});

const columns = computed(() => [
  {
    name: "bookTitle",
    label: t("BooksPage_column_title"),
    field: "bookTitle",
    align: "left",
    sortable: true,
  },
  {
    name: "bookAuthor",
    label: t("BooksPage_column_author"),
    field: "bookAuthor",
    align: "left",
    sortable: true,
  },
  {
    name: "bookLaunch",
    label: t("BooksPage_column_launch_date"),
    field: "bookLaunch",
    align: "center",
    sortable: true,
  },
  {
    name: "bookTotal",
    label: t("BooksPage_column_total"),
    field: "bookTotal",
    align: "center",
    sortable: true,
  },
  {
    name: "bookInUse",
    label: t("BooksPage_column_in_use"),
    field: "bookInUse",
    align: "center",
    sortable: true,
  },
  {
    name: "publisher",
    label: t("BooksPage_column_publisher"),
    field: (row) => row.publisher?.publishersName || t("BooksPage_not_applicable"),
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
    // Chama o método do serviço de livros que carrega e popula o mapa de editoras
    const editoras = await LivrosService.carregarEditorasMap();
    opcoesEditoras.value = editoras.map((e) => e.publishersName); 

  } catch (error) {
    console.error("Falha ao carregar editoras:", error);
    $q.notify({
      type: "negative",
      message: t("BooksPage_error_load_publishers") || "Erro ao carregar editoras",
      caption: t("BooksPage_error_connection"),
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
      message: error.message || t("BooksPage_error_load_default"),
      caption: error.response?.data?.message || t("BooksPage_error_connection"),
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
      message: t("general_error_permission_register"),
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
      message: t("general_error_permission_update"),
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
      message: t("general_error_permission_save"),
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
        message: t("BooksPage_validation_fill_all"),
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
      $q.notify({ type: "positive", message: t("BooksPage_success_update") });
    } else {
      await LivrosService.cadastrar(livroForm.value);
      $q.notify({ type: "positive", message: t("BooksPage_success_register") });
    }

    await carregarTudo();
    fecharModal();
  } catch (error) {
    let errorMessage = t("BooksPage_error_save_default");

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
      message: t("general_error_permission_delete"),
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
      message: t("general_error_permission_delete"),
      timeout: 3000
    });
    return;
  }

  modalExcluir.value = false;
  carregando.value = true;
  try {
    await LivrosService.deletar(livroParaDeletarId.value);
    $q.notify({ type: "positive", message: t("BooksPage_success_delete") });
    await carregarTudo();
  } catch (error) {
    let errorMessage = t("BooksPage_error_delete_default");

    if (error.response?.status === 400) {
      // Caso o livro esteja em uso
      errorMessage = t("BooksPage_error_delete_linked");
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
  console.log('Role atual (LivrosPage):', userRole.value);
  carregarTudo();
});

watch(locale, () => {
  $q.notify({
    type: "info",
    message: t("general_language_updated") || "Idioma atualizado",
    timeout: 1000,
  });
});
</script>