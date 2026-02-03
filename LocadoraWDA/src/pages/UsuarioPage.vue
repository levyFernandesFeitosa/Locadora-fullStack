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
              name="manage_accounts"
              size="32px"
              class="q-mr-sm"
              color="primary"
            />
            <span class="text-white text-weight-bold ellipsis">{{
              $t("UsersPage_title")
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
            :label="$t('UsersPage_register_button')"
            color="primary"
            @click="abrirModalCadastro"
            icon="person_add"
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
            :label="$t('UsersPage_search_placeholder')"
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
          <q-th v-if="userRole === 'ADMIN'">{{ $t("UsersPage_actions_header") }}</q-th>
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
          <q-td v-if="userRole === 'ADMIN'">
            <q-btn
              v-if="props.row.userEmail !== 'admin@admin.com'"
              dense
              flat
              icon="edit"
              color="primary"
              :tooltip="$t('UsersPage_tooltip_edit')"
              @click="editarUsuario(props.row)"
            />
            <q-btn
              v-if="props.row.userEmail !== currentUserEmail && props.row.userEmail !== 'admin@admin.com'"
              dense
              flat
              icon="delete"
              color="negative"
              :tooltip="$t('UsersPage_tooltip_delete')"
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

            <q-card-actions align="right" v-if="userRole === 'ADMIN'">
              <q-btn
                v-if="props.row.userEmail !== 'admin@admin.com'"
                dense
                flat
                icon="edit"
                color="primary"
                :tooltip="$t('UsersPage_tooltip_edit')"
                @click="editarUsuario(props.row)"
              />
              <q-btn
                v-if="props.row.userEmail !== currentUserEmail && props.row.userEmail !== 'admin@admin.com'"
                dense
                flat
                icon="delete"
                color="negative"
                :tooltip="$t('UsersPage_tooltip_delete')"
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
          :label="$t('UsersPage_loading_users')"
        />
      </template>
    </q-table>
    <q-dialog v-model="modalCadastro">
      <q-card class="modal column no-wrap" style="max-height: 90vh;">
        <q-form ref="formCadastroRef" @submit.prevent="cadastrarUsuario" class="column no-wrap" style="width: 100%; height: 100%">
          <q-card-section class="conteudoModal scroll">
            <div class="tituloModal">
              {{ $t("UsersPage_modal_register_title") }}
            </div>
            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="novoUsuario.nome"
                  :label="$t('UsersPage_input_name_label') + $t('general_min_3_chars')"
                  :rules="[val => !!val || '', val => val.length >= 3 || '']"
                  hide-bottom-space
                />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="novoUsuario.email"
                  :label="$t('UsersPage_input_email_label') + $t('general_email_format')"
                  type="email"
                  :rules="[val => !!val || '', val => /.+@.+\..+/.test(val) || '']"
                  hide-bottom-space
                />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                   v-model="novoUsuario.senha"
                    :label="$t('UsersPage_input_password_label') + $t('general_min_3_chars').replace('3', '8')"
                    type="password"
                   :rules="[val => !!val || '', val => val.length >= 8 || '']"
                   hide-bottom-space
                 />
              </div>
              <div class="col-12">
                <q-select
                  class="inputModalSelect"
                  outlined
                  v-model="novoUsuario.tipo"
                  :options="roleOptionsComputed"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  :label="$t('UsersPage_input_role_label') + $t('general_select')"
                  :rules="[val => !!val || '']"
                  hide-bottom-space
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="$t('UsersPage_register_button')"
              color="primary"
              type="submit"
            />
            <q-btn
              class="modalBTN"
              :label="$t('UsersPage_cancel_button')"
              @click="modalCadastro = false"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalEditar">
      <q-card class="modal column no-wrap" style="max-height: 90vh;">
        <q-form ref="formEditarRef" @submit.prevent="atualizarUsuario" class="column no-wrap" style="width: 100%; height: 100%">
          <q-card-section class="conteudoModal scroll">
            <div class="tituloModal">
              {{ $t("UsersPage_modal_update_title") }}
            </div>
            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="usuarioEditar.nome"
                  :label="$t('UsersPage_input_name_label') + $t('general_min_3_chars')"
                  :rules="[val => !!val || '', val => val.length >= 3 || '']"
                  hide-bottom-space
                />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="usuarioEditar.email"
                  :label="$t('UsersPage_input_email_label') + $t('general_email_format')"
                  type="email"
                  :rules="[val => !!val || '', val => /.+@.+\..+/.test(val) || '']"
                  hide-bottom-space
                />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                   v-model="usuarioEditar.senha"
                    :label="$t('UsersPage_input_new_password_label') + $t('general_min_3_chars').replace('3', '8')"
                    type="password"
                   :rules="[val => !val || val.length >= 8 || '']"
                   hide-bottom-space
                 />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="usuarioEditar.confirmarSenha"
                   :label="$t('UsersPage_input_confirm_password_label')"
                   type="password"
                   hide-bottom-space
                 />
              </div>
              <div class="col-12">
                <q-select
                  class="inputModalSelect"
                  outlined
                  v-model="usuarioEditar.tipo"
                  :options="roleOptionsComputed"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  :label="$t('UsersPage_input_role_label') + $t('general_select')"
                  :rules="[val => !!val || '']"
                  hide-bottom-space
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="$t('UsersPage_update_button')"
              color="primary"
              type="submit"
            />
            <q-btn
              class="modalBTN"
              :label="$t('UsersPage_close_button')"
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
            {{ $t("UsersPage_confirm_delete_q1") }},
            {{ $t("UsersPage_confirm_delete_q2") }}
          </div>
        </q-card-section>
        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('UsersPage_delete_button')"
            color="negative"
            @click="excluirUsuario"
          />
          <q-btn
            class="modalBTN"
            :label="$t('UsersPage_back_button')"
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
 
const currentUserEmail = computed(() => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      return JSON.parse(userInfo).email;
    } catch (e) {
      return null;
    }
  }
  return null;
});

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

const roleMap = computed(() => ({
  USER: t("UsersPage_role_user"),
  ADMIN: t("UsersPage_role_admin"),
}));

const roleOptionsComputed = computed(() => [
  { label: t("UsersPage_role_user"), value: "USER" },
  { label: t("UsersPage_role_admin"), value: "ADMIN" },
]);

const allUsers = ref([]);
const formCadastroRef = ref(null);
const formEditarRef = ref(null);
const loading = ref(false);

const pesquisa = ref("");

const columns = computed(() => [
  {
    name: "name",
    label: t("UsersPage_column_name"),
    field: "userName", 
    sortable: true,
    align: "left",
  },
  {
    name: "email",
    label: t("UsersPage_column_email"),
    field: "userEmail", 
    sortable: true,
    align: "left",
  },
  {
    name: "role",
    label: t("UsersPage_column_role"),
    field: "role",
    sortable: true,
    align: "left",
  },
]);

const usuariosFiltrados = computed(() => {
  const term = pesquisa.value?.toLowerCase() || "";
  if (!term) return allUsers.value;

  return allUsers.value.filter(user => {
    const roleLabel = roleMap.value[user.role] || user.role;
    const fieldsToSearch = [
      user.userName,
      user.userEmail,
      user.role,
      roleLabel
    ];

    return fieldsToSearch.some(field => 
      field?.toString().toLowerCase().includes(term)
    );
  });
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
    const errorMsg = error.response?.data?.message || error.message || t("UsersPage_error_load_default");
    $q.notify({
      type: "negative",
      message: errorMsg,
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
  
  const errors = [];
  if (!novoUsuario.value.nome || novoUsuario.value.nome.length < 3) errors.push(t("error.validation.name_size_3_100"));
  if (!novoUsuario.value.email || !/.+@.+\..+/.test(novoUsuario.value.email)) errors.push(t("error.validation.email_invalid"));
  if (!novoUsuario.value.senha || novoUsuario.value.senha.length < 8) errors.push(t("error.validation.password_size_8"));
  if (!novoUsuario.value.tipo) errors.push(t("error.validation.role_required"));

  if (errors.length > 0) {
    errors.forEach(msg => $q.notify({ type: "negative", message: msg, position: "top", timeout: 4000 }));
    return;
  }

  const success = await formCadastroRef.value.validate();
  if (!success) return;

  const { nome, email, senha, tipo } = novoUsuario.value;

  if (!nome || !email || !senha) {
    $q.notify({ type: "warning", message: t("UsersPage_validation_fill_all") });
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

    $q.notify({ type: "positive", message: t("UsersPage_success_register"), position: "top" });
    modalCadastro.value = false;
    resetNovoUsuario();
    await fetchUsers();
  } catch (error) {
    console.log("Erro ao cadastrar usuário:", error.response?.data);
    let apiMsg = error.response?.data?.message;
    const errorMessage = apiMsg ? t(apiMsg) : t("UsersPage_error_register_default");

    $q.notify({
      type: "negative",
      message: errorMessage,
      position: "top",
      timeout: 5000,
    });
  }
}

function editarUsuario(user) {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("UsersPage_error_permission_update"),
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
      message: t("UsersPage_error_permission_update"),
      timeout: 3000
    });
    return;
  }

  const { id, nome, email, senha, confirmarSenha, tipo } = usuarioEditar.value;

  const errors = [];
  if (!usuarioEditar.value.nome || usuarioEditar.value.nome.length < 3) errors.push(t("error.validation.name_size_3_100"));
  if (!usuarioEditar.value.email || !/.+@.+\..+/.test(usuarioEditar.value.email)) errors.push(t("error.validation.email_invalid"));
  if (usuarioEditar.value.senha && usuarioEditar.value.senha.length < 8) errors.push(t("error.validation.password_size_8"));
  if (!usuarioEditar.value.tipo) errors.push(t("error.validation.role_required"));

  if (errors.length > 0) {
    errors.forEach(msg => $q.notify({ type: "negative", message: msg, position: "top", timeout: 4000 }));
    return;
  }

  const success = await formEditarRef.value.validate();
  if (!success) return;

  if (senha && senha !== confirmarSenha) {
    $q.notify({
      type: "warning",
      message: t("UsersPage_validation_password_mismatch"),
      position: "top"
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

    $q.notify({ type: "positive", message: t("UsersPage_success_update"), position: "top" });
    modalEditar.value = false;

    const index = allUsers.value.findIndex((u) => u.id === id);
    if (index !== -1) {
      allUsers.value[index].userName = dadosAtualizados.userName; 
      allUsers.value[index].userEmail = dadosAtualizados.userEmail; 
      allUsers.value[index].role = dadosAtualizados.role;
      allUsers.value = [...allUsers.value];
    }
  } catch (error) {
    console.log("Erro ao atualizar usuário:", error.response?.data);
    let apiMsg = error.response?.data?.message;
    const errorMessage = apiMsg ? t(apiMsg) : t("UsersPage_error_update_default");

    $q.notify({
      type: "negative",
      message: errorMessage,
      position: "top",
      timeout: 5000,
    });
  }
}

function confirmarExcluir(user) {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("UsersPage_error_permission_delete"),
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
      message: t("UsersPage_error_permission_delete"), 
      timeout: 3000
    });
    return;
  }
  
  const user = usuarioParaExcluir.value;

  try {
    await usuarioService.deletarUsuario(user.id);

    $q.notify({ type: "positive", message: t("UsersPage_success_delete") });
    modalExcluir.value = false;
    usuarioParaExcluir.value = null;

    allUsers.value = allUsers.value.filter((u) => u.id !== user.id);
  } catch (error) {
    console.log("Erro ao excluir usuário:", error.response?.data);
    let errorMessage = t("UsersPage_error_delete_default");
    if (error.response?.status === 403) {
      errorMessage = t("UsersPage_error_permission_delete_backend"); 
    } else {
      errorMessage += error.response?.data?.message || error.response?.data?.detail || t("UsersPage_error_check_console");
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
      position: "top",
      timeout: 5000,
    });
  }
}

function abrirModalCadastro() {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("UsersPage_error_permission_register"),
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
  console.log('Role atual (UsuarioPage):', userRole.value);
  fetchUsers();
});

watch(locale, () => {
  fetchUsers();
  $q.notify({
    type: "info",
    message: t("general_language_updated"),
    timeout: 1000,
  });
});
</script>

<style scoped>
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

/* Garante que o input herde a altura correta do container dense */
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