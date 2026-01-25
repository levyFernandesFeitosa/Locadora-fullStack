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
            class="CadastroBTN no-wrap q-px-lg"
            :label="$t('RentersPage_register_button')"
            color="primary"
            @click="abrirModalCadastro"
            icon="person_add"
            no-caps
          />
        </div>

        <div class="col-12 col-md-4 order-xs-1 order-md-3">
          <q-input
            class="pesquisaALL"
            standout
            v-model="pesquisa"
            :label="$t('RentersPage_search_placeholder')"
            hide-bottom-space
          >
            <template v-slot:append>
              <q-icon name="search" color="white" />
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
      <q-card class="modal column no-wrap" style="max-height: 90vh;">
        <q-form ref="formCadastro" @submit.prevent="cadastrarLocatario" class="column no-wrap" style="width: 100%; height: 100%">
          <div class="tituloModal">
            {{ $t("RentersPage_modal_register_title") }}
          </div>
          <q-card-section class="conteudoModal scroll">
            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="novoLocatario.nome"
                  :label="$t('RentersPage_input_name_label') + ' (mín. 3 caracteres)'"
                  :rules="[val => !!val || '', val => val.length >= 3 || '']"
                  required
                  hide-bottom-space
                />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="novoLocatario.email"
                  :label="$t('RentersPage_input_email_label') + ' (ex@ex.com)'"
                  type="email"
                  :rules="[val => !!val || '', val => /.+@.+\..+/.test(val) || '']"
                  required
                  hide-bottom-space
                />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="novoLocatario.telefone"
                  :label="$t('RentersPage_input_phone_label') + ' (apenas números)'"
                  mask="(##) #####-####"
                  :rules="[val => !!val || '', val => val.replace(/\D/g, '').length >= 10 || '']"
                  required
                  hide-bottom-space
                />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="novoLocatario.cpf"
                  :label="$t('RentersPage_input_cpf_label') + ' (###.###.###-##)'"
                  mask="###.###.###-##"
                  :rules="[val => !!val || '', val => val.length === 14 || '']"
                  required
                  hide-bottom-space
                />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="novoLocatario.endereco"
                  :label="$t('RentersPage_input_address_label') + ' (mín. 3 caracteres)'"
                  :rules="[val => !!val || '', val => val.length >= 3 || '']"
                  required
                  hide-bottom-space
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="$t('RentersPage_register_button')"
              color="primary"
              type="submit"
              :disable="userRole === 'USER'"
            />
            <q-btn
              class="modalBTN"
              :label="$t('RentersPage_cancel_button')"
              @click="modalCadastro = false"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalEditar">
      <q-card class="modal column no-wrap" style="max-height: 90vh;">
        <q-form ref="formEditar" @submit.prevent="atualizarLocatario" class="column no-wrap" style="width: 100%; height: 100%">
          <div class="tituloModal">
            {{ $t("RentersPage_modal_update_title") }}
          </div>
          <q-card-section class="conteudoModal scroll">
            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <q-input
                  class="inputModal"
                   v-model="locatarioEditar.nome"
                   :label="$t('RentersPage_input_name_label') + ' (mín. 3 caracteres)'"
                   :rules="[val => !!val || '', val => val.length >= 3 || '']"
                   required
                   hide-bottom-space
                 />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                   v-model="locatarioEditar.email"
                   :label="$t('RentersPage_input_email_label') + ' (ex@ex.com)'"
                   type="email"
                   :rules="[val => !!val || '', val => /.+@.+\..+/.test(val) || '']"
                   required
                   hide-bottom-space
                 />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                   v-model="locatarioEditar.telefone"
                   :label="$t('RentersPage_input_phone_label') + ' (apenas números)'"
                   mask="(##) #####-####"
                   :rules="[val => !!val || '', val => val.replace(/\D/g, '').length >= 10 || '']"
                   required
                   hide-bottom-space
                 />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                   v-model="locatarioEditar.cpf"
                   :label="$t('RentersPage_input_cpf_label') + ' (###.###.###-##)'"
                   mask="###.###.###-##"
                   :rules="[val => !!val || '', val => val.length === 14 || '']"
                   required
                   hide-bottom-space
                 />
              </div>
              <div class="col-12">
                <q-input
                  class="inputModal"
                   v-model="locatarioEditar.endereco"
                   :label="$t('RentersPage_input_address_label') + ' (mín. 3 caracteres)'"
                   :rules="[val => !!val || '', val => val.length >= 3 || '']"
                   required
                   hide-bottom-space
                 />
              </div>
            </div>
          </q-card-section>
          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="$t('RentersPage_update_button')"
              color="primary"
              type="submit"
              :disable="userRole === 'USER'"
            />
            <q-btn
              class="modalBTN"
              :label="$t('RentersPage_close_button')"
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
const formCadastro = ref(null);
const formEditar = ref(null);
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

// --- 3. Funções de UI (Modais) ---

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
    const errorMsg = error.response?.data?.message || error.message || t("RentersPage_error_load_default");
    $q.notify({
      type: "negative",
      message: errorMsg,
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

  const errors = [];
  if (!novoLocatario.value.nome || novoLocatario.value.nome.length < 3) errors.push(t("error.validation.renter_name_required"));
  if (!novoLocatario.value.email || !/.+@.+\..+/.test(novoLocatario.value.email)) errors.push(t("error.validation.email_invalid"));
  if (!novoLocatario.value.telefone || novoLocatario.value.telefone.replace(/\D/g, '').length < 10) errors.push(t("error.validation.phone_invalid"));
  if (!novoLocatario.value.cpf || novoLocatario.value.cpf.replace(/\D/g, '').length < 11) errors.push(t("error.validation.cpf_size"));
  if (!novoLocatario.value.endereco || novoLocatario.value.endereco.length < 3) errors.push(t("error.validation.address_required"));

  if (errors.length > 0) {
    errors.forEach(msg => $q.notify({ type: "negative", message: msg, position: "top", timeout: 4000 }));
    return;
  }

  const success = await formCadastro.value.validate();
  if (!success) return;

  const dataAPI = {
    renterName: novoLocatario.value.nome,
    renterEmail: novoLocatario.value.email,
    renterTelephone: novoLocatario.value.telefone,
    renterCpf: novoLocatario.value.cpf.replace(/\D/g, ''),
    renterAddress: novoLocatario.value.endereco,
  };

  try {
    await locatarioService.create(dataAPI);
    $q.notify({ type: "positive", message: t("RentersPage_success_register"), position: "top" });
    modalCadastro.value = false;
    fetchLocatarios();
  } catch (error) {
    console.log("Erro no cadastro de locatário:", error.response?.data);
    const apiMsg = error.response?.data?.message;
    const errorMessage = apiMsg ? t(apiMsg) : t("RentersPage_error_load_default");
    
    $q.notify({
      type: "negative",
      message: errorMessage,
      position: "top",
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

  const errors = [];
  if (!locatarioEditar.value.nome || locatarioEditar.value.nome.length < 3) errors.push(t("error.validation.renter_name_required"));
  if (!locatarioEditar.value.email || !/.+@.+\..+/.test(locatarioEditar.value.email)) errors.push(t("error.validation.email_invalid"));
  if (!locatarioEditar.value.telefone || locatarioEditar.value.telefone.replace(/\D/g, '').length < 10) errors.push(t("error.validation.phone_invalid"));
  if (!locatarioEditar.value.cpf || locatarioEditar.value.cpf.replace(/\D/g, '').length < 11) errors.push(t("error.validation.cpf_size"));
  if (!locatarioEditar.value.endereco || locatarioEditar.value.endereco.length < 3) errors.push(t("error.validation.address_required"));

  if (errors.length > 0) {
    errors.forEach(msg => $q.notify({ type: "negative", message: msg, position: "top", timeout: 4000 }));
    return;
  }

  const success = await formEditar.value.validate();
  if (!success) return;

  const dataAPI = {
    renterName: locatarioEditar.value.nome,
    renterEmail: locatarioEditar.value.email,
    renterTelephone: locatarioEditar.value.telefone,
    renterCpf: locatarioEditar.value.cpf.replace(/\D/g, ''),
    renterAddress: locatarioEditar.value.endereco,
  };

  try {
    await locatarioService.update(locatarioEditar.value.id, dataAPI);
    $q.notify({ type: "positive", message: t("RentersPage_success_update"), position: "top" });
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
    console.log("Erro ao atualizar locatário:", error.response?.data);
    const errorMessage = error.response?.data?.message || error.response?.data?.detail || error.message || t("RentersPage_error_update_default");

    $q.notify({
      type: "negative",
      message: errorMessage,
      position: "top",
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
    console.log("Erro ao excluir locatário:", error.response?.data);
    let apiMsg = error.response?.data?.message;
    let errorMessage = apiMsg ? t(apiMsg) : t("RentersPage_error_delete_default");

    if (error.response?.status === 409 || (apiMsg && apiMsg.includes("linked"))) {
      errorMessage = t("error.resource_linked");
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
      position: "top",
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