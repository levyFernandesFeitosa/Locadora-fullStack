<template>
  <q-page class="q-pa-md" style="background-color: #edead0">
    <div
      class="q-pa-md example-row-column-width"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm flex-md-row flex-column">
        <div class="col-grow col-md-6 order-xs-2 order-md-1">
          <div class="titulo flex items-center">
            <q-icon name="people" size="32px" class="q-mr-sm" color="primary" />
            <span class=" text-white text-weight-bold ellipsis">{{
              $t("RentersPage_title")
            }}</span>
          </div>
        </div>

        <div
          v-if="userRole === 'ADMIN'"
          class="col-auto col-md-2 order-xs-3 order-md-2 q-ml-auto q-ml-md-none"
        >
          <q-btn
            class="CadastroBTN full-width"
            :label="$t('RentersPage_register_button')"
            color="primary"
            @click="abrirModalCadastro"
            icon="person_add"
          />
        </div>

        <div class="col-12 col-md-4 order-xs-1 order-md-3">
          <q-input
            class="pesquisaALL"
            standout
            v-model="pesquisa"
            :label="$t('RentersPage_search_placeholder')"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <q-table
      :rows="locatariosFiltrados"
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
    >
      <template v-slot:header="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props" class="linha-destacada">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th v-if="userRole === 'ADMIN'">{{ $t("RentersPage_actions_header") }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td v-if="userRole === 'ADMIN'">
            <q-btn
              dense
              flat
              icon="edit"
              color="primary"
              @click="editarLocatario(props.row)"
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
          <q-card class="q-mb-md card-mobile">
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

            <q-card-actions align="right" v-if="userRole === 'ADMIN'">
              <q-btn
                dense
                flat
                icon="edit"
                color="positive"
                @click="editarLocatario(props.row)"
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
      <template v-slot:loading>
        <q-inner-loading
          showing
          color="primary"
          :label="$t('RentersPage_loading_renters')"
        />
      </template>
    </q-table>

    <q-dialog v-model="modalCadastro">
      <q-card class="modal" id="modalGrande">
        <div class="tituloModal">
          {{ $t("RentersPage_modal_register_title") }}
        </div>
        <q-card-section class="conteudoModal">
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.nome"
            :label="$t('RentersPage_input_name_label')"
            :error="errosCadastro.nome"
            error-color="negative"
            @input="validarCampo('nome')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.email"
            :label="$t('RentersPage_input_email_label')"
            type="email"
            :error="errosCadastro.email"
            error-color="negative"
            @input="validarCampo('email')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.telefone"
            :label="$t('RentersPage_input_phone_label')"
            :error="errosCadastro.telefone"
            error-color="negative"
            @input="validarCampo('telefone')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.cpf"
            :label="$t('RentersPage_input_cpf_label')"
            :error="errosCadastro.cpf"
            error-color="negative"
            @input="validarCampo('cpf')"
            required
          />
          <q-input
            class="inputModal"
            outlined
            v-model="novoLocatario.endereco"
            :label="$t('RentersPage_input_address_label')"
            :error="errosCadastro.endereco"
            error-color="negative"
            @input="validarCampo('endereco')"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('RentersPage_register_button')"
            color="primary"
            @click="cadastrarLocatario"
            :disable="userRole === 'USER'"
          />
          <q-btn
            class="modalBTN"
            :label="$t('RentersPage_cancel_button')"
            @click="modalCadastro = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalEditar">
      <q-card class="modal" id="modalGrande">
        <div class="tituloModal">
          {{ $t("RentersPage_modal_update_title") }}
        </div>
        <q-card-section class="conteudoModal">
          <q-input
            class="inputModal"
            v-model="locatarioEditar.nome"
            :label="$t('RentersPage_input_name_label')"
            :color="errosCadastro.nome ? 'negative' : 'primary'"
            :error-message="$t('RentersPage_validation_required')"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.email"
            :label="$t('RentersPage_input_email_label')"
            type="email"
            :error="errosCadastro.email"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.telefone"
            :label="$t('RentersPage_input_phone_label')"
            :error="errosCadastro.telefone"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.cpf"
            :label="$t('RentersPage_input_cpf_label')"
            :error="errosCadastro.cpf"
            required
          />
          <q-input
            class="inputModal"
            v-model="locatarioEditar.endereco"
            :label="$t('RentersPage_input_address_label')"
            :error="errosCadastro.endereco"
            required
          />
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('RentersPage_update_button')"
            color="primary"
            @click="atualizarLocatario"
            :disable="userRole === 'USER'"
          />
          <q-btn
            class="modalBTN"
            :label="$t('RentersPage_close_button')"
            @click="modalEditar = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="">
        <q-card-section class="conteudoModal text-center">
          <div class="text-h6 lt-sm:text-body1">
            {{ $t("RentersPage_confirm_delete_q1") }}
            {{ $t("RentersPage_confirm_delete_q2") }}
          </div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('RentersPage_delete_button')"
            color="negative"
            @click="excluirLocatario"
            :disable="userRole === 'USER'"
          />
          <q-btn
            class="modalBTN"
            :label="$t('RentersPage_back_button')"
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
import { locatarioService } from "src/services/locatarioService";

const $q = useQuasar();
const { t, locale } = useI18n();

// Lógica de Permissão
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

// 1. Variáveis de Estado (Modais e Formulários)
const allLocatarios = ref([]);
const loading = ref(false);
const pesquisa = ref("");
const locatarioParaExcluir = ref(null);

const modalCadastro = ref(false);
const novoLocatario = ref({
  nome: "",
  email: "",
  telefone: "",
  cpf: "",
  endereco: "",
});
const errosCadastro = ref({});

const modalEditar = ref(false);
const locatarioEditar = ref({
  id: null,
  nome: "",
  email: "",
  telefone: "",
  cpf: "",
  endereco: "",
});
const modalExcluir = ref(false);

// 2. Colunas da Tabela
const columns = computed(() => [
  {
    name: "name",
    label: t("RentersPage_column_name"),
    field: "renterName",
    align: "left",
    sortable: true,
  },
  {
    name: "email",
    label: t("RentersPage_column_email"),
    field: "renterEmail",
    align: "left",
    sortable: true,
  },
  {
    name: "telephone",
    label: t("RentersPage_column_phone"),
    field: "renterTelephone",
    align: "left",
  },
  {
    name: "cpf",
    label: t("RentersPage_column_cpf"),
    field: "renterCpf",
    align: "left",
  },
  {
    name: "address",
    label: t("RentersPage_column_address"),
    field: "renterAddress",
    align: "left",
  },
]);

// --- 3. Funções de UI (Modais e Validação) ---

const validarCampo = (campo) => {
  if (campo === "nome" && !novoLocatario.value.nome) {
    errosCadastro.value.nome = true;
  } else {
    delete errosCadastro.value.nome;
  }

  if (campo === "email" && !novoLocatario.value.email) {
    errosCadastro.value.email = true;
  } else {
    delete errosCadastro.value.email;
  }

  if (campo === "telefone" && !novoLocatario.value.telefone) {
    errosCadastro.value.telefone = true;
  } else {
    delete errosCadastro.value.telefone;
  }

  if (campo === "cpf" && !novoLocatario.value.cpf) {
    errosCadastro.value.cpf = true;
  } else {
    delete errosCadastro.value.cpf;
  }

  if (campo === "endereco" && !novoLocatario.value.endereco) {
    errosCadastro.value.endereco = true;
  } else {
    delete errosCadastro.value.endereco;
  }
};

const validarFormulario = () => {
  errosCadastro.value = {};
  let valido = true;

  const camposObrigatorios = ["nome", "email", "telefone", "cpf", "endereco"];

  camposObrigatorios.forEach((campo) => {
    if (
      !novoLocatario.value[campo] ||
      novoLocatario.value[campo].trim() === ""
    ) {
      errosCadastro.value[campo] = true;
      valido = false;
    }
  });
  return valido;
};

const abrirModalCadastro = () => {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general_error_permission_register"),
      timeout: 3000
    });
    return;
  }

  novoLocatario.value = {
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    endereco: "",
  };
  errosCadastro.value = {};
  modalCadastro.value = true;
};

const editarLocatario = (locatario) => {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general_error_permission_update"),
      timeout: 3000
    });
    return;
  }

  locatarioEditar.value = {
    id: locatario.id,
    nome: locatario.renterName,
    email: locatario.renterEmail,
    telefone: locatario.renterTelephone,
    cpf: locatario.renterCpf,
    endereco: locatario.renterAddress,
  };
  errosCadastro.value = {};
  modalEditar.value = true;
};

const confirmarExcluir = (locatario) => {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general_error_permission_delete"),
      timeout: 3000
    });
    return;
  }
  locatarioParaExcluir.value = locatario;
  modalExcluir.value = true;
};

// --- 4. Lógica CRUD (Chama o Service) ---

const fetchLocatarios = async () => {
  loading.value = true;
  try {
    const data = await locatarioService.getAll();
    allLocatarios.value = data;
  } catch (error) {
    const fallbackMsg = t("RentersPage_error_load_default") + (error.response?.data?.message || error.message || t("RentersPage_error_connection"));
    $q.notify({
      type: "negative",
      message: fallbackMsg,
      timeout: 5000,
    });
  } finally {
    loading.value = false;
  }
};

const cadastrarLocatario = async () => {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general_error_permission_register"),
      timeout: 3000
    });
    return;
  }

  if (!validarFormulario()) {
    $q.notify({
      type: "warning",
      message: t("RentersPage_validation_fill_all"),
    });
    return;
  }

  const dataAPI = {
    renterName: novoLocatario.value.nome,
    renterEmail: novoLocatario.value.email,
    renterTelephone: novoLocatario.value.telefone,
    renterCpf: novoLocatario.value.cpf,
    renterAddress: novoLocatario.value.endereco,
  };

  try {
    await locatarioService.create(dataAPI);
    $q.notify({ type: "positive", message: t("RentersPage_success_register") });
    modalCadastro.value = false;
    fetchLocatarios();
  } catch (error) {
    let errorMessage = t("RentersPage_error_unknown");
    if (error.response?.status === 403) {
      errorMessage = t("RentersPage_error_permission_register_backend");
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = error.message || t("RentersPage_error_connection");
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
      timeout: 5000,
    });
  }
};

const atualizarLocatario = async () => {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general_error_permission_update"),
      timeout: 3000
    });
    return;
  }

  // NOTE: Validação do formulário de edição foi removida no código original,
  // mas deve ser reintroduzida em um ambiente de produção.
  // if (!validarFormularioEdicao()) {
  //   $q.notify({ type: "warning", message: t("RentersPage.validation_fill_all") });
  //   return;
  // }


  const dataAPI = {
    renterName: locatarioEditar.value.nome,
    renterEmail: locatarioEditar.value.email,
    renterTelephone: locatarioEditar.value.telefone,
    renterCpf: locatarioEditar.value.cpf,
    renterAddress: locatarioEditar.value.endereco,
  };

  try {
    await locatarioService.update(locatarioEditar.value.id, dataAPI);
    $q.notify({ type: "positive", message: t("RentersPage_success_update") });
    modalEditar.value = false;

    // Atualização local da linha da tabela
    const index = allLocatarios.value.findIndex(r => r.id === locatarioEditar.value.id);
    if (index !== -1) {
      allLocatarios.value[index].renterName = dataAPI.renterName;
      allLocatarios.value[index].renterEmail = dataAPI.renterEmail;
      allLocatarios.value[index].renterTelephone = dataAPI.renterTelephone;
      allLocatarios.value[index].renterCpf = dataAPI.renterCpf;
      allLocatarios.value[index].renterAddress = dataAPI.renterAddress;
      allLocatarios.value = [...allLocatarios.value]; // Gatilho de reatividade
    }

  } catch (error) {
    let errorMessage = t("RentersPage_error_update_default");
    if (error.response?.status === 403) {
      errorMessage = t("RentersPage_error_permission_update_backend");
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = error.message || t("RentersPage_error_unexpected");
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
      timeout: 5000,
    });
  }
};

const excluirLocatario = async () => {
  if (userRole.value === 'USER') {
    modalExcluir.value = false;
    $q.notify({
      type: "negative",
      message: t("general_error_permission_delete"),
      timeout: 3000
    });
    return;
  }

  if (!locatarioParaExcluir.value) return;

  try {
    await locatarioService.delete(locatarioParaExcluir.value.id);
    $q.notify({ type: "positive", message: t("RentersPage_success_delete") });
    modalExcluir.value = false;

    // Remoção local do locatário
    allLocatarios.value = allLocatarios.value.filter(r => r.id !== locatarioParaExcluir.value.id);
    locatarioParaExcluir.value = null;

  } catch (error) {
    let errorMessage = t("RentersPage_error_delete_default");

    if (error.response?.status === 403) {
      errorMessage = t("RentersPage_error_permission_delete_backend");
    } else if (error.response?.status === 400) {
      const apiMessage = error.response.data?.message;
      if (apiMessage && typeof apiMessage === "string" && apiMessage.includes('vinculado')) {
        errorMessage = t("RentersPage_error_delete_linked"); // Locatário com aluguel ativo
      } else {
        errorMessage = t("RentersPage_error_delete_linked");
      }
    } else {
      errorMessage = error.message || t("RentersPage_error_unexpected");
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
      timeout: 7000,
    });
  }
};

// 5. Computed Properties (Filtragem/Pesquisa)
const locatariosFiltrados = computed(() => {
  const termo = pesquisa.value.toLowerCase();
  if (!termo) return allLocatarios.value;

  return allLocatarios.value.filter(
    (locatario) =>
      locatario.renterName?.toLowerCase().includes(termo) ||
      locatario.renterEmail?.toLowerCase().includes(termo) ||
      locatario.renterCpf?.includes(termo)
  );
});

onMounted(() => {
  console.log('Role atual (LocatarioPage):', userRole.value);
  fetchLocatarios();
});

// Watcher para reatividade do idioma (mantido)
watch(locale, () => {
  $q.notify({
    type: "info",
    message: t("general_language_updated") || "Idioma atualizado",
    timeout: 1000,
  });
});
</script>