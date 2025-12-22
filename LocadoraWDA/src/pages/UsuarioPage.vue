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
              name="manage_accounts"
              size="32px"
              class="q-mr-sm"
              color="primary"
            />
            <span class="text-white text-weight-bold ellipsis">{{
              $t("UsersPage.title")
            }}</span>
          </div>
        </div>

        <div
          class="col-auto col-md-2 order-xs-3 order-md-2 q-ml-auto q-ml-md-none"
        >
          <q-btn
            class="CadastroBTN full-width"
            :label="$t('UsersPage.register_button')"
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
            :label="$t('UsersPage.search_placeholder')"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <q-table
      :rows="usuariosFiltrados"
      :columns="columns"
      row-key="id"
      :grid="$q.screen.lt.md"
      :hide-header="$q.screen.lt.md"
      :rows-per-page-options="[5, 10, 15, 0]"
      :pagination="{
        page: 1,
        rowsPerPage: $q.screen.lt.md ? 0 : 5,
      }"
      :hide-pagination="$q.screen.lt.md"
      :loading="loading"
    >
      <template v-slot:header="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props" class="linha-destacada">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th>{{ $t("UsersPage.actions_header") }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.name === 'role'">
              {{ roleMap[col.value] || col.value }}
            </span>
            <span v-else>
              {{ col.value }}
            </span>
          </q-td>
          <q-td>
            <q-btn
              dense
              flat
              icon="edit"
              color="primary"
              :tooltip="$t('UsersPage.tooltip_edit')"
              @click="editarUsuario(props.row)"
              :disable="userRole === 'USER'"
            />
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              :tooltip="$t('UsersPage.tooltip_delete')"
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
                  <span v-if="col.name === 'role'">
                    {{ roleMap[col.value] || col.value }}
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
                :tooltip="$t('UsersPage.tooltip_edit')"
                @click="editarUsuario(props.row)"
                :disable="userRole === 'USER'"
              />
              <q-btn
                dense
                flat
                icon="delete"
                color="negative"
                :tooltip="$t('UsersPage.tooltip_delete')"
                @click="confirmarExcluir(props.row)"
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
          :label="$t('UsersPage.loading_users')"
        />
      </template>
    </q-table>
    <q-dialog v-model="modalCadastro">
      <q-card class="modal">
        <q-form @submit.prevent="cadastrarUsuario">
          <q-card-section class="conteudoModal">
            <div class="tituloModal">
              {{ $t("UsersPage.modal_register_title") }}
            </div>
            <q-input
              class="inputModal"
              outlined
              v-model="novoUsuario.nome"
              :label="$t('UsersPage.input_name_label')"
              required
            />
            <q-input
              class="inputModal"
              outlined
              v-model="novoUsuario.email"
              :label="$t('UsersPage.input_email_label')"
              type="email"
              required
            />
            <q-input
              class="inputModal"
              outlined
              v-model="novoUsuario.senha"
              :label="$t('UsersPage.input_password_label')"
              type="password"
              required
            />
            <q-select
              class="inputModalSelect"
              outlined
              v-model="novoUsuario.tipo"
              :options="roleOptionsComputed"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :label="$t('UsersPage.input_role_label')"
              required
            />
          </q-card-section>
          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="$t('UsersPage.register_button')"
              color="primary"
              type="submit"
            />
            <q-btn
              class="modalBTN"
              :label="$t('UsersPage.cancel_button')"
              @click="modalCadastro = false"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalEditar">
      <q-card class="modal">
        <q-form @submit.prevent="atualizarUsuario">
          <q-card-section class="conteudoModal">
            <div class="tituloModal">
              {{ $t("UsersPage.modal_update_title") }}
            </div>
            <q-input
              class="inputModal"
              outlined
              v-model="usuarioEditar.nome"
              :label="$t('UsersPage.input_name_label')"
              required
            />
            <q-input
              class="inputModal"
              outlined
              v-model="usuarioEditar.email"
              :label="$t('UsersPage.input_email_label')"
              type="email"
              required
            />
            <q-input
              class="inputModal"
              outlined
              v-model="usuarioEditar.senha"
              :label="$t('UsersPage.input_new_password_label')"
              type="password"
            />
            <q-input
              class="inputModal"
              outlined
              v-model="usuarioEditar.confirmarSenha"
              :label="$t('UsersPage.input_confirm_password_label')"
              type="password"
            />
            <q-select
              class="inputModalSelect"
              outlined
              v-model="usuarioEditar.tipo"
              :options="roleOptionsComputed"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :label="$t('UsersPage.input_role_label')"
              required
            />
          </q-card-section>
          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="$t('UsersPage.update_button')"
              color="primary"
              type="submit"
            />
            <q-btn
              class="modalBTN"
              :label="$t('UsersPage.close_button')"
              @click="modalEditar = false"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalExcluir">
      <q-card class="modalCertificando" style="">
        <q-card-section class="conteudoModal text-center">
          <div class="text-h6 lt-sm:text-body1">
            {{ $t("UsersPage.confirm_delete_q1") }},
            {{ $t("UsersPage.confirm_delete_q2") }}
          </div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('UsersPage.delete_button')"
            color="negative"
            @click="excluirUsuario"
          />
          <q-btn
            class="modalBTN"
            :label="$t('UsersPage.back_button')"
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
import { usuarioService } from "src/services/usuarioService";

const $q = useQuasar();
const { t, locale } = useI18n();

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

const roleMap = computed(() => ({
  USER: t("UsersPage.role_user"),
  ADMIN: t("UsersPage.role_admin"),
}));

const roleOptionsComputed = computed(() => [
  { label: t("UsersPage.role_user"), value: "USER" },
  { label: t("UsersPage.role_admin"), value: "ADMIN" },
]);

const allUsers = ref([]);
const loading = ref(false);

const pesquisa = ref("");

const columns = computed(() => [
  {
    name: "name",
    label: t("UsersPage.column_name"),
    field: "userName", 
    sortable: true,
    align: "left",
  },
  {
    name: "email",
    label: t("UsersPage.column_email"),
    field: "userEmail", 
    sortable: true,
    align: "left",
  },
  {
    name: "role",
    label: t("UsersPage.column_role"),
    field: "role",
    sortable: true,
    align: "left",
  },
]);

const usuariosFiltrados = computed(() => {
  const term = pesquisa.value.toLowerCase();
  if (!term) {
    return allUsers.value;
  }
  return allUsers.value.filter(
    (user) =>
      user.userName?.toLowerCase().includes(term) || 
      user.userEmail?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term)
  );
});

const modalCadastro = ref(false);
const modalEditar = ref(false);
const modalExcluir = ref(false);

const novoUsuario = ref({
  nome: "",
  email: "",
  senha: "",
  tipo: "USER", 
});

const usuarioEditar = ref({
  id: null,
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: "",
  tipo: "",
});

const usuarioParaExcluir = ref(null);

async function fetchUsers() {
  loading.value = true;
  try {
    const users = await usuarioService.listarUsuarios();
    allUsers.value = users;
  } catch (error) {
    $q.notify({
      type: "negative",
      message:
        t("UsersPage.error_load_default") +
        (error.response?.data?.message || t("UsersPage.error_network")),
    });
  } finally {
    loading.value = false;
  }
}

async function cadastrarUsuario() {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("UsersPage.error_permission_register"),
      timeout: 3000
    });
    return;
  }
  
  const { nome, email, senha, tipo } = novoUsuario.value;

  if (!nome || !email || !senha) {
    $q.notify({ type: "warning", message: t("UsersPage.validation_fill_all") });
    return;
  }

  try {
    const dados = {
      userName: nome,
      userEmail: email,
      userPassword: senha, 
      role: tipo.toUpperCase(),
    };

    await usuarioService.criarUsuario(dados);

    $q.notify({ type: "positive", message: t("UsersPage.success_register") });
    modalCadastro.value = false;
    resetNovoUsuario();
    await fetchUsers();
  } catch (error) {
    let errorMessage = t("UsersPage.error_register_default");
    if (error.response?.status === 403) {
      errorMessage = t("UsersPage.error_permission_register_backend"); 
    } else {
      errorMessage += error.response?.data?.message || t("UsersPage.error_check_console");
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
    });
  }
}

function editarUsuario(user) {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("UsersPage.error_permission_update"),
      timeout: 3000
    });
    return;
  }
  
  usuarioEditar.value = {
    id: user.id,
    nome: user.userName, 
    email: user.userEmail, 
    tipo: user.role,
    senha: "", 
    confirmarSenha: "",
  };
  modalEditar.value = true;
}

async function atualizarUsuario() {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("UsersPage.error_permission_update"),
      timeout: 3000
    });
    return;
  }

  const { id, nome, email, senha, confirmarSenha, tipo } = usuarioEditar.value;

  if (senha && senha !== confirmarSenha) {
    $q.notify({
      type: "warning",
      message: t("UsersPage.validation_password_mismatch"),
    });
    return;
  }
  if (!nome || !email) {
    $q.notify({
      type: "warning",
      message: t("UsersPage.validation_name_email_required"),
    });
    return;
  }

  try {
    const dadosAtualizados = {
      userName: nome,
      userEmail: email,
      role: tipo.toUpperCase(),
    };

    if (senha) {
      dadosAtualizados.userPassword = senha; 
    }

    await usuarioService.atualizarUsuario(id, dadosAtualizados);

    $q.notify({ type: "positive", message: t("UsersPage.success_update") });
    modalEditar.value = false;

    const index = allUsers.value.findIndex((u) => u.id === id);
    if (index !== -1) {
      allUsers.value[index].userName = dadosAtualizados.userName; 
      allUsers.value[index].userEmail = dadosAtualizados.userEmail; 
      allUsers.value[index].role = dadosAtualizados.role;
      allUsers.value = [...allUsers.value];
    }
  } catch (error) {
    let errorMessage = t("UsersPage.error_update_default");
    if (error.response?.status === 403) {
      errorMessage = t("UsersPage.error_permission_update_backend"); 
    } else {
      errorMessage += error.response?.data?.message || t("UsersPage.error_check_console");
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
    });
  }
}

function confirmarExcluir(user) {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("UsersPage.error_permission_delete"),
      timeout: 3000
    });
    return;
  }
  
  usuarioParaExcluir.value = user;
  modalExcluir.value = true;
}

async function excluirUsuario() {
  if (userRole.value === 'USER') {
    modalExcluir.value = false;
    $q.notify({
      type: "negative",
      message: t("UsersPage.error_permission_delete"), 
      timeout: 3000
    });
    return;
  }
  
  const user = usuarioParaExcluir.value;

  try {
    await usuarioService.deletarUsuario(user.id);

    $q.notify({ type: "positive", message: t("UsersPage.success_delete") });
    modalExcluir.value = false;
    usuarioParaExcluir.value = null;

    allUsers.value = allUsers.value.filter((u) => u.id !== user.id);
  } catch (error) {
    let errorMessage = t("UsersPage.error_delete_default");
    if (error.response?.status === 403) {
      errorMessage = t("UsersPage.error_permission_delete_backend"); 
    } else {
      errorMessage += error.response?.data?.message || t("UsersPage.error_check_console");
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
    });
  }
}

function abrirModalCadastro() {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("UsersPage.error_permission_register"),
      timeout: 3000
    });
    return;
  }
  resetNovoUsuario();
  modalCadastro.value = true;
}

function resetNovoUsuario() {
  novoUsuario.value = {
    nome: "",
    email: "",
    senha: "",
    tipo: "USER",
  };
}

onMounted(() => {
  fetchUsers();
});

watch(locale, () => {
  fetchUsers();
  $q.notify({
    type: "info",
    message: t("general.language_updated"),
    timeout: 1000,
  });
});
</script>