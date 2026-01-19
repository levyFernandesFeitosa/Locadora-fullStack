<template>
  <q-page class="q-pa-md" style="background-color: #edead0">
    <div
      class="q-pa-md example-row-column-width"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm flex-md-row flex-column">
        <div class="col-grow col-md-6 order-xs-2 order-md-1">
          <div class="titulo flex items-center">
            <q-icon name="event" size="32px" class="q-mr-sm" color="primary" />
            <span class="text-white text-weight-bold ellipsis">{{
              $t("RentalsPage_title")
            }}</span>
          </div>
        </div>

        <div
          v-if="userRole === 'ADMIN'"
          class="col-auto col-md-2 order-xs-3 order-md-2 q-ml-auto q-ml-md-none"
        >
          <q-btn
            class="CadastroBTN"
            :label="$t('RentalsPage_register_button')"
            color="primary"
            @click="openCreateModal"
            icon="person_add"
          />
        </div>

        <div class="col-12 col-md-4 order-xs-1 order-md-3">
          <q-input
            class="pesquisaALL"
            standout
            v-model="searchTerm"
            :label="$t('RentalsPage_search_placeholder')"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <q-table
      :rows="alugueis"
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
      :filter="searchTerm"
      :loading="loading"
    >
      <template v-slot:header="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props" class="linha-destacada">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th v-if="userRole === 'ADMIN'">{{ $t("RentalsPage_actions_header") }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props" v-if="!$q.screen.lt.md">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="['rentalRentedDate', 'rentalDeadline', 'rentalReturnDate'].includes(col.name)">
              {{ formatarData(props.row[col.name]) }}
            </template>
            <template v-else-if="col.name === 'status'">
              <q-chip
                :color="getStatusColor(props.row)"
                text-color="white"
                dense
                square
                class="text-weight-bold"
              >
                {{ getStatusLabel(props.row) }}
              </q-chip>
            </template>
            <template v-else>
              {{ col.value }}
            </template>
          </q-td>
          <q-td v-if="userRole === 'ADMIN'">
            <q-btn
              v-if="isRentalActive(props.row)"
              dense
              flat
              icon="library_add_check"
              color="green"
              :tooltip="$t('RentalsPage_tooltip_receive')"
              @click="confirmarRecebimento(props.row)"
            />
            
            <q-btn
              v-if="isRentalActive(props.row)"
              dense
              flat
              icon="edit"
              color="primary"
              :tooltip="$t('RentalsPage_tooltip_edit')"
              @click="openEditModal(props.row)"
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
                  <template v-if="['rentalRentedDate', 'rentalDeadline', 'rentalReturnDate'].includes(col.name)">
                    {{ formatarData(props.row[col.name]) }}
                  </template>
                  <template v-else-if="col.name === 'status'">
                    <q-chip
                      :color="getStatusColor(props.row)"
                      text-color="white"
                      dense
                      square
                      class="text-weight-bold"
                    >
                      {{ getStatusLabel(props.row) }}
                    </q-chip>
                  </template>
                  <template v-else>
                    {{ col.value }}
                  </template>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right" v-if="userRole === 'ADMIN'">
               <q-btn
                 v-if="isRentalActive(props.row)"
                 dense
                 flat
                 icon="library_add_check"
                 color="green"
                 :tooltip="$t('RentalsPage_tooltip_receive')"
                 @click="confirmarRecebimento(props.row)"
               />
               <q-btn
                 v-if="isRentalActive(props.row)"
                 dense
                 flat
                 icon="edit"
                 color="primary"
                 :tooltip="$t('RentalsPage_tooltip_edit')"
                 @click="openEditModal(props.row)"
               />
            </q-card-actions>
          </q-card>
        </div>
      </template>

      <template v-slot:loading>
        <q-inner-loading
          showing
          color="primary"
          :label="$t('RentalsPage_loading_rentals')"
        />
      </template>
    </q-table>

    <q-dialog v-model="modalAberto">
      <q-card class="modal">
        <q-form @submit.prevent="salvarAluguel" style="width: 100%">
          <q-card-section class="conteudoModal">
            <div class="tituloModal">
              {{
                editando
                  ? $t("RentalsPage_modal_update_title")
                  : $t("RentalsPage_modal_register_title")
              }}
            </div>

            <q-select
              class="inputModalSelect"
              outlined
              v-model="aluguelForm.renterId"
              :options="locatariosOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :label="$t('RentalsPage_input_renter_label')"
              :error="errosCadastro.renterId"
              error-color="negative"
              @update:model-value="validarCampo('renterId')"
              :disable="editando"
            />

            <q-select
              class="inputModalSelect"
              outlined
              v-model="aluguelForm.bookId"
              :options="livrosOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :label="$t('RentalsPage_input_book_label')"
              :error="errosCadastro.bookId"
              error-color="negative"
              @update:model-value="validarCampo('bookId')"
              :disable="editando"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption
                      >{{ $t("RentalsPage_available_caption") }}:
                      {{ scope.opt.totalAvailable }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input
              class="inputModal"
              outlined
              :model-value="formattedRentDate"
              readonly
              :label="$t('RentalsPage_input_rent_date_label')"
              :error="errosCadastro.rentDate"
              error-color="negative"
              :disable="editando"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" v-if="!editando">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="aluguelForm.rentDate"
                      mask="YYYY-MM-DD"
                      color="primary"
                      today-btn
                      @update:model-value="validarCampo('rentDate')"
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
              :model-value="formattedDeadLine"
              readonly
              :label="$t('RentalsPage_input_deadline_label')"
              :error="errosCadastro.deadLine"
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
                      v-model="aluguelForm.deadLine"
                      mask="YYYY-MM-DD"
                      color="primary"
                      today-btn
                      @update:model-value="validarCampo('deadLine')"
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup :label="t('RentersPage_close_button')" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-card-section>

          <q-card-actions class="botoesModal">
            <q-btn
              class="modalBTN"
              :label="
                editando
                  ? $t('RentalsPage_update_button')
                  : $t('RentalsPage_register_button')
              "
              color="primary"
              type="submit"
              :loading="salvando"
            />
            <q-btn
              class="modalBTN"
              :label="$t('RentalsPage_cancel_button')"
              @click="fecharModal"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- NOVO MODAL DE DEVOLUÇÃO -->
    <q-dialog v-model="modalDevolucaoAberto" persistent>
      <q-card style="min-width: 350px; border-radius: 15px">
        <q-card-section class="row items-center q-pb-none" style="background-color: #0056b3; color: white">
          <div class="text-h6">{{ $t('RentalsPage_confirm_receive_title') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="row items-center q-mb-md">
            <q-icon name="menu_book" size="md" color="primary" class="q-mr-sm" />
            <div>
              <div class="text-caption text-grey-7">{{ $t('RentalsPage_column_book') }}</div>
              <div class="text-subtitle1 text-weight-bold">{{ rentalParaDevolucao?.book?.bookTitle }}</div>
            </div>
          </div>

          <div class="row items-center q-mb-md">
            <q-icon name="calendar_today" size="md" color="primary" class="q-mr-sm" />
            <div>
              <div class="text-caption text-grey-7">{{ $t('RentalsPage_column_deadline') }}</div>
              <div class="text-subtitle1">{{ formatarData(rentalParaDevolucao?.rentalDeadline) }}</div>
            </div>
          </div>

          <div class="row justify-center q-mt-lg">
            <q-badge 
              :color="isDevolucaoAtrasada ? 'negative' : 'positive'" 
              class="q-pa-sm text-subtitle2"
              rounded
            >
              <q-icon :name="isDevolucaoAtrasada ? 'warning' : 'check_circle'" class="q-mr-xs" />
              {{ isDevolucaoAtrasada ? $t('RentalsPage_status_delivered_with_delay') : $t('RentalsPage_status_delivered_on_time') }}
            </q-badge>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn 
            flat 
            :label="$t('RentalsPage_cancel_button')" 
            color="primary" 
            v-close-popup 
          />
          <q-btn 
            :label="$t('RentalsPage_confirm_button')" 
            color="primary" 
            @click="executarRecebimento" 
            :loading="recebendo"
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
import AlugueisService from "src/services/alugueisService";

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

const statusMap = computed(() => ({
  rented: t("RentalsPage_status_rented"),
  late: t("RentalsPage_status_late"),
  in_time: t("RentalsPage_status_in_time"),
  returned_with_delay: t("RentalsPage_status_delivered_with_delay"), 
}));

const alugueis = ref([]);
const loading = ref(false);
const locatariosOptions = ref([]);
const livrosOptions = ref([]);

const aluguelForm = ref({
  id: null,
  renterId: null,
  bookId: null,
  rentDate: null, 
  deadLine: null, 
});

const modalAberto = ref(false);
const editando = ref(false);
const salvando = ref(false);
const errosCadastro = ref({});
const searchTerm = ref("");

const columns = computed(() => [
  {
    name: "locatario",
    label: t("RentalsPage_column_renter"),
    align: "left",
    field: (row) => row.renter?.renterName || t("RentalsPage_not_applicable_short"),
    sortable: true,
  },
  {
    name: "livro",
    label: t("RentalsPage_column_book"),
    align: "left",
    field: (row) => row.book?.bookTitle || t("RentalsPage_not_applicable_short"), 
    sortable: true,
  },
  {
    name: "rentalRentedDate", 
    label: t("RentalsPage_column_rent_date"),
    align: "left",
    field: "rentalRentedDate", 
    sortable: true,
  },
  {
    name: "rentalDeadline", 
    label: t("RentalsPage_column_deadline"),
    align: "left",
    field: "rentalDeadline", 
    sortable: true,
  },
  {
    name: "rentalReturnDate", 
    label: t("RentalsPage_column_devolution_date"),
    align: "left",
    field: "rentalReturnDate", 
    sortable: true,
  },
  {
    name: "status",
    label: t("RentalsPage_column_status"),
    align: "left",
    field: "status",
    sortable: true,
  },
]);

function formatarData(dataISO) {
  if (!dataISO) return "";
  
  const dateStr = String(dataISO).substring(0, 10);
  if (dateStr === "undefined" || dateStr === "null" || dateStr === "") {
    return "";
  }

  // Divide a string YYYY-MM-DD para evitar que o JS interprete como UTC (o que causaria o off-by-one)
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);

  const format = locale.value.startsWith("en") ? "MM/DD/YYYY" : "DD/MM/YYYY";
  return date.formatDate(dateObj, format);
}

const formattedRentDate = computed(() => {
  return aluguelForm.value.rentDate ? formatarData(aluguelForm.value.rentDate) : "";
});

const formattedDeadLine = computed(() => {
  return aluguelForm.value.deadLine ? formatarData(aluguelForm.value.deadLine) : "";
});

// --- LÓGICA DE STATUS REFINADA ---
const today = new Date().toISOString().substring(0, 10);

function getInternalStatus(row) {
  const status = row.status?.toLowerCase();
  const deadline = row.rentalDeadline?.substring(0, 10);
  const returnDate = row.rentalReturnDate?.substring(0, 10);

  // Se já foi devolvido
  if (status === 'in_time') return 'ON_TIME';
  if (status === 'returned_with_delay') return 'LATE_RETURN';

  // Se ainda está alugado, calculamos o status dinamicamente
  if (status === 'rented' || status === 'late') {
    if (deadline < today) return 'ACTIVE_LATE';
    return 'ACTIVE_ON_TIME';
  }

  return 'UNKNOWN';
}

function getStatusLabel(row) {
  const internalStatus = getInternalStatus(row);
  const labels = {
    'ACTIVE_LATE': t('RentalsPage_status_late'),
    'LATE_RETURN': t('RentalsPage_status_delivered_with_delay'),
    'ACTIVE_ON_TIME': t('RentalsPage_status_in_time'),
    'ON_TIME': t('RentalsPage_status_delivered_on_time')
  };
  return labels[internalStatus] || t('RentalsPage_not_applicable_short');
}

function getStatusColor(row) {
  const internalStatus = getInternalStatus(row);
  const colors = {
    'ACTIVE_LATE': 'negative', // Vermelho
    'LATE_RETURN': 'orange-8', // Amarelo/Laranja (para destaque)
    'ACTIVE_ON_TIME': 'positive', // Verde
    'ON_TIME': 'blue-8' // Azul
  };
  return colors[internalStatus] || 'grey-7';
}

function isRentalActive(row) {
  const status = row.status?.toLowerCase();
  return status === 'rented' || status === 'late';
}

function limparFormulario() {
  aluguelForm.value = {
    id: null, renterId: null, bookId: null, rentDate: null, deadLine: null, 
  };
  errosCadastro.value = {};
}

function fecharModal() { modalAberto.value = false; limparFormulario(); }

function openCreateModal() { 
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general_error_permission_register"), // Assumindo que você tem uma chave de erro geral
      timeout: 3000
    });
    return;
  }
  editando.value = false; 
  limparFormulario(); 
  modalAberto.value = true; 
}

function validarCampo(campo) {
  if (
    !aluguelForm.value[campo] ||
    aluguelForm.value[campo].toString().trim() === ""
  ) {
    errosCadastro.value[campo] = true;
  } else {
    delete errosCadastro.value[campo];
  }
}

function validarFormulario() {
  errosCadastro.value = {};
  let valido = true;
  const camposObrigatorios = ["renterId", "bookId", "deadLine"]; 
  camposObrigatorios.forEach((campo) => {
    if (!aluguelForm.value[campo]) {
      errosCadastro.value[campo] = true;
      valido = false;
    }
  });
  return valido;
}

async function fetchAllData() {
  loading.value = true;
  try {
    alugueis.value = await AlugueisService.getAllAlugueis();

    const dependencies = await AlugueisService.getDependencies();

    locatariosOptions.value = dependencies.locatarios.map((r) => ({
      label: r.renterName,
      value: r.id,
    }));

    livrosOptions.value = dependencies.livros.map((b) => ({
      label: b.bookTitle,
      value: b.id,
      totalAvailable: b.bookTotal - b.bookInUse,
    }));
  } catch (error) {
    $q.notify({ type: "negative", message: t("RentalsPage_error_load_default") });
  } finally {
    loading.value = false;
  }
}


function openEditModal(aluguel) {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: t("general_error_permission_update"), // Assumindo que você tem uma chave de erro geral
      timeout: 3000
    });
    return;
  }

  editando.value = true;
  errosCadastro.value = {};
  aluguelForm.value = {
    id: aluguel.id,
    renterId: aluguel.renter?.id || null, 
    bookId: aluguel.book?.id || null, 
    rentDate: aluguel.rentalRentedDate?.substring(0, 10) || null,
    deadLine: aluguel.rentalDeadline?.substring(0, 10) || null,
  };
  modalAberto.value = true;
}

async function salvarAluguel() {
  if (userRole.value === 'USER') {
    $q.notify({
      type: "negative",
      message: editando.value ? t("general_error_permission_update") : t("general_error_permission_register"),
      timeout: 3000
    });
    return;
  }

  if (!validarFormulario()) {
    $q.notify({ type: "warning", message: t("RentalsPage_validation_fill_all") });
    return;
  }

  salvando.value = true;
  
  const dataToSend = {
    id: aluguelForm.value.id, 
    renterId: aluguelForm.value.renterId,
    bookId: aluguelForm.value.bookId,
    rentalRentedDate: aluguelForm.value.rentDate, 
    rentalDeadline: aluguelForm.value.deadLine, 
  };

  try {
    if (editando.value) {
      await AlugueisService.updateAluguel(aluguelForm.value.id, dataToSend);
      $q.notify({ type: "positive", message: t("RentalsPage_success_update") });
    } else {
      await AlugueisService.createAluguel(dataToSend);
      $q.notify({ type: "positive", message: t("RentalsPage_success_register") });
    }

    await fetchAllData();
    fecharModal();
  } catch (error) {
    let errorMessage = t("RentalsPage_error_save_default");
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    $q.notify({ type: "negative", message: errorMessage });
  } finally {
    salvando.value = false;
  }
}

const modalDevolucaoAberto = ref(false);
const rentalParaDevolucao = ref(null);
const recebendo = ref(false);

const isDevolucaoAtrasada = computed(() => {
  if (!rentalParaDevolucao.value) return false;
  const deadline = rentalParaDevolucao.value.rentalDeadline?.substring(0, 10);
  return today > deadline;
});

function confirmarRecebimento(aluguel) {
  if (userRole.value === 'USER') {
    $q.notify({ type: "negative", message: t("general_error_permission_update") });
    return;
  }
  rentalParaDevolucao.value = aluguel;
  modalDevolucaoAberto.value = true;
}

async function executarRecebimento() {
  if (!rentalParaDevolucao.value) return;
  
  recebendo.value = true;
  try {
    await AlugueisService.returnBook(rentalParaDevolucao.value.id);
    $q.notify({ type: "positive", message: t("RentalsPage_success_receive") });
    await fetchAllData();
    modalDevolucaoAberto.value = false;
  } catch (error) {
    let errorMessage = t("RentalsPage_error_receive_default");
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    $q.notify({ type: "negative", message: errorMessage });
  } finally {
    recebendo.value = false;
  }
}

onMounted(() => {
  console.log('Role atual (AlugueisPage):', userRole.value);
  fetchAllData();
});

watch(locale, () => {
  fetchAllData(); 
  $q.notify({ type: "info", message: t("general_language_updated"), timeout: 1000 });
});
</script>