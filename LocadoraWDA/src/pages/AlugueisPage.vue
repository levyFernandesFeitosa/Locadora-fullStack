<template>
  <q-page class="q-pa-md" style="background-color: #edead0">
    <!-- Top Section (Identical to LivrosPage) -->
    <div
      class="q-pa-md"
      style="background-color: #274e55; margin-bottom: 2%; border-radius: 2vh"
    >
      <div class="row items-center q-col-gutter-sm q-col-gutter-y-sm full-width">
        <!-- Título -->
        <div class="col-6 col-sm-auto">
          <div class="titulo flex items-center">
            <q-icon
              name="event"
              size="32px"
              class="q-mr-sm"
              color="primary"
            />
            <span class="text-white text-weight-bold ellipsis">{{
              $t("RentalsPage_title")
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
            :label="$t('RentalsPage_register_button')"
            color="primary"
            @click="openCreateModal"
            icon="event_available"
            no-caps
            unelevated
          />
        </div>

        <!-- Barra de Pesquisa -->
        <div class="col-12 col-sm-auto">
          <q-input
            class="pesquisaALL rounded-borders q-mt-none"
            outlined
            v-model="searchTerm"
            :label="$t('RentalsPage_search_placeholder')"
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

    <!-- Rentals Table -->
    <q-table
      :rows="alugueis"
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
      :loading="loading"
      :filter="searchTerm"
      :filter-method="customFilter"
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
              color="positive"
              @click="confirmarRecebimento(props.row)"
            />
            <q-btn
              v-if="isRentalActive(props.row)"
              dense
              flat
              icon="edit"
              color="primary"
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
                color="positive"
                @click="confirmarRecebimento(props.row)"
              />
              <q-btn
                v-if="isRentalActive(props.row)"
                dense
                flat
                icon="edit"
                color="primary"
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

    <!-- Modal for Create/Edit (Identical structure to LivrosPage) -->
    <q-dialog v-model="modalAberto">
      <q-card class="modal column no-wrap" style="max-height: 90vh;">
        <q-form ref="aluguelFormRef" @submit.prevent="salvarAluguel" class="column no-wrap" style="width: 100%; height: 100%">
          <q-card-section class="conteudoModal q-gutter-y-md scroll">
            <div class="tituloModal">
              {{
                editando
                  ? $t("RentalsPage_modal_update_title")
                  : $t("RentalsPage_modal_register_title")
              }}
            </div>

            <div class="row q-col-gutter-y-md">
              <!-- Renter Select -->
              <div class="col-12">
                <q-select
                  class="inputModalSelect"
                  outlined
                  v-model="aluguelForm.renterId"
                  use-input
                  fill-input
                  hide-selected
                  input-debounce="300"
                  :options="locatariosOptionsFiltrados"
                  @filter="filterFnRenters"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  :label="$t('RentersPage_input_name_label') + $t('general_min_3_chars')"
                  :rules="[val => !!val || $t('validation_required')]"
                  :disable="editando"
                  hide-bottom-space
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                         {{ $t('general_not_found') }}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Book Select -->
              <div class="col-12">
                <q-select
                  class="inputModalSelect"
                  outlined
                  v-model="aluguelForm.bookId"
                  use-input
                  fill-input
                  hide-selected
                  input-debounce="300"
                  :options="livrosOptionsFiltrados"
                  @filter="filterFnBooks"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  :label="$t('RentalsPage_input_book_label') + $t('general_select')"
                  :rules="[val => !!val || $t('validation_required')]"
                  :disable="editando"
                  hide-bottom-space
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                        <q-item-label caption
                          >{{ $t("RentalsPage_available_caption") }}:
                          {{ scope.opt.totalAvailable ?? 0 }}</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        {{ $t('general_not_found') }}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Deadline Date -->
              <div class="col-12">
                <q-input
                  class="inputModal"
                  outlined
                  v-model="deadLineDisplay"
                  :mask="maskPorIdioma"
                  :label="labelPrazo"
                  :rules="[val => !!val || $t('validation_required'), val => compData(val, aluguelForm.rentDate) || $t('RentalsPage_validation_fill_all')]"
                  hide-bottom-space
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" color="white">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="deadLineDisplay"
                          :mask="formatVisual"
                          color="primary"
                          today-btn
                        >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup :label="$t('RentersPage_close_button')" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
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

    <!-- Return Confirmation Modal (Restored design) -->
    <q-dialog v-model="modalDevolucaoAberto">
      <q-card class="modal column no-wrap" style="max-height: 90vh;">
        <div class="tituloModal">
          {{ $t('RentalsPage_confirm_receive_title') }}
        </div>
        
        <q-card-section class="conteudoModal scroll q-gutter-y-md">
          <div class="text-center">
            <div class="row items-center justify-center q-mb-md">
              <q-icon name="menu_book" size="md" color="primary" class="q-mr-md" />
              <span class="text-h5 text-white text-weight-bold">{{ rentalParaDevolucao?.book?.bookTitle }}</span>
            </div>

            <div class="row items-center justify-center">
              <q-badge 
                :color="isDevolucaoAtrasada ? 'negative' : 'positive'" 
                class="q-pa-md text-subtitle1"
                style="border-radius: 1vh"
              >
                <q-icon :name="isDevolucaoAtrasada ? 'warning' : 'check_circle'" class="q-mr-sm" size="24px" />
                {{ isDevolucaoAtrasada ? $t('RentalsPage_status_delivered_with_delay') : $t('RentalsPage_status_delivered_on_time') }}
              </q-badge>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="botoesModal">
          <q-btn
            class="modalBTN"
            :label="$t('RentalsPage_confirm_button')"
            color="primary"
            @click="executarRecebimento"
            :loading="recebendo"
          />
          <q-btn
            class="modalBTN"
            :label="$t('RentalsPage_cancel_button')"
            @click="modalDevolucaoAberto = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar, date } from "quasar";
import { useI18n } from "vue-i18n";
import AlugueisService from "src/services/alugueisService";

function getCurrentUserRole() {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const role = JSON.parse(userInfo).role;
      return role ? String(role).trim().toUpperCase() : null;
    } catch (e) { return null; }
  }
  return null;
}

const userRole = ref(getCurrentUserRole());
const $q = useQuasar();
const { t, locale } = useI18n(); 

const maskPorIdioma = computed(() => '##/##/####');
const formatVisual = computed(() => locale.value === 'pt-BR' ? 'DD/MM/YYYY' : 'MM/DD/YYYY');
const labelPrazo = computed(() => t('RentalsPage_input_deadline_label') + ' (' + formatVisual.value + ')');

function compData(displayVal, isoVal) {
   if (!displayVal || !isoVal) return true;
   const iso1 = converterParaISO(displayVal);
   return iso1 >= isoVal;
}

function converterParaISO(visualVal) {
   if (!visualVal) return null;
   const dateObj = date.extractDate(visualVal, formatVisual.value);
   return date.formatDate(dateObj, 'YYYY-MM-DD');
}

const alugueis = ref([]);
const aluguelFormRef = ref(null);
const loading = ref(false);
const locatariosOptions = ref([]);
const locatariosOptionsFiltrados = ref([]);
const livrosOptions = ref([]);
const livrosOptionsFiltrados = ref([]);

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
const searchTerm = ref("");

function filterFnRenters(val, update) {
  if (val.length < 3) {
    update(() => { locatariosOptionsFiltrados.value = locatariosOptions.value; });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    locatariosOptionsFiltrados.value = locatariosOptions.value.filter(
      v => v.label.toLowerCase().includes(needle)
    );
  });
}

function filterFnBooks(val, update) {
  if (val === '') {
    update(() => { livrosOptionsFiltrados.value = livrosOptions.value; });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    livrosOptionsFiltrados.value = livrosOptions.value.filter(
      v => v.label.toLowerCase().includes(needle)
    );
  });
}

function customFilter(rows, terms, cols, getCellValue) {
   if (!terms) return rows;
   const lowerTerms = terms.toLowerCase();
   
   return rows.filter(row => {
     const name = row.renter?.renterName?.toLowerCase() || "";
     if (name.includes(lowerTerms)) return true;

     const book = row.book?.bookTitle?.toLowerCase() || "";
     if (book.includes(lowerTerms)) return true;

     const phone = row.renter?.renterTelephone || "";
     const phoneClean = phone.replace(/\D/g, "");
     const termClean = lowerTerms.replace(/\D/g, "");
     if (phoneClean.includes(termClean) && termClean.length > 0) return true;

     const rentDateFormatted = formatarData(row.rentalRentedDate).toLowerCase();
     const deadlineFormatted = formatarData(row.rentalDeadline).toLowerCase();
     const returnDateFormatted = formatarData(row.rentalReturnDate).toLowerCase();
     if (rentDateFormatted.includes(lowerTerms)) return true;
     if (deadlineFormatted.includes(lowerTerms)) return true;
     if (returnDateFormatted.includes(lowerTerms)) return true;

     const email = row.renter?.renterEmail?.toLowerCase() || "";
     if (email.includes(lowerTerms)) return true;

     const statusLabel = getStatusLabel(row).toLowerCase();
     if (statusLabel.includes(lowerTerms)) return true;

     return false;
   });
}

const columns = computed(() => [
  { name: "locatario", label: t("RentalsPage_column_renter"), align: "left", field: (row) => row.renter?.renterName || "-", sortable: true },
  { name: "livro", label: t("RentalsPage_column_book"), align: "left", field: (row) => row.book?.bookTitle || "-", sortable: true },
  { name: "rentalRentedDate", label: t("RentalsPage_column_rent_date"), align: "center", field: "rentalRentedDate", sortable: true },
  { name: "rentalDeadline", label: t("RentalsPage_column_deadline"), align: "center", field: "rentalDeadline", sortable: true },
  { name: "rentalReturnDate", label: t("RentalsPage_column_devolution_date"), align: "center", field: "rentalReturnDate", sortable: true },
  { name: "status", label: t("RentalsPage_column_status"), align: "left", field: "status", sortable: true }
]);

const deadLineDisplay = computed({
  get() {
    if (!aluguelForm.value.deadLine) return "";
    if (aluguelForm.value.deadLine.includes('/') && locale.value === 'pt-BR') return aluguelForm.value.deadLine;
    const dateObj = date.extractDate(aluguelForm.value.deadLine, 'YYYY-MM-DD');
    return date.formatDate(dateObj, formatVisual.value);
  },
  set(val) {
    if (val && (val.length === formatVisual.value.length || val.includes('-'))) {
       if (val.includes('-') && val.length === 10) { aluguelForm.value.deadLine = val; }
       else {
          const dateObj = date.extractDate(val, formatVisual.value);
          aluguelForm.value.deadLine = date.formatDate(dateObj, 'YYYY-MM-DD');
       }
    } else if (!val) { aluguelForm.value.deadLine = null; }
  }
});

function formatarData(dataISO) {
  if (!dataISO) return "";
  const dateStr = String(dataISO).substring(0, 10);
  if (dateStr === "undefined" || dateStr === "null" || dateStr === "") return "";
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return isNaN(dateObj.getTime()) ? "" : date.formatDate(dateObj, formatVisual.value);
}

const today = new Date().toISOString().substring(0, 10);

function getStatusLabel(row) {
  const status = row.status?.toLowerCase();
  const deadline = row.rentalDeadline?.substring(0, 10);
  if (status === 'in_time') return t('RentalsPage_status_delivered_on_time');
  if (status === 'returned_with_delay') return t('RentalsPage_status_delivered_with_delay');
  if (status === 'rented' || status === 'late') {
    return deadline < today ? t('RentalsPage_status_late') : t('RentalsPage_status_in_time');
  }
  return "-";
}

function getStatusColor(row) {
  const status = row.status?.toLowerCase();
  const deadline = row.rentalDeadline?.substring(0, 10);
  if (status === 'in_time') return 'blue-8';
  if (status === 'returned_with_delay') return 'orange-8';
  if (status === 'rented' || status === 'late') {
    return deadline < today ? 'negative' : 'positive';
  }
  return 'grey-7';
}

function isRentalActive(row) {
  const status = row.status?.toLowerCase();
  return status === 'rented' || status === 'late';
}

async function carregarAlugueis() {
  loading.value = true;
  try {
    const data = await AlugueisService.getAllAlugueis();
    alugueis.value = data;
  } catch (error) {
    const msg = error.response?.data?.message || t("RentalsPage_error_load_default");
    $q.notify({ type: "negative", message: msg });
  } finally { loading.value = false; }
}

async function carregarAuxiliares() {
  try {
    const deps = await AlugueisService.getDependencies();
    locatariosOptions.value = deps.locatarios.map(l => ({ label: l.renterName, value: l.id }));
    livrosOptions.value = deps.livros.map(b => ({ 
      label: b.bookTitle, 
      value: b.id,
      totalAvailable: (Number(b.bookTotal) || 0) - (Number(b.bookInUse) || 0)
    }));
    locatariosOptionsFiltrados.value = locatariosOptions.value;
    livrosOptionsFiltrados.value = livrosOptions.value;
  } catch (error) { console.error("Erro ao carregar dependências", error); }
}

function openCreateModal() { 
  editando.value = false; 
  aluguelForm.value = { id: null, renterId: null, bookId: null, rentDate: today, deadLine: null };
  modalAberto.value = true;
}

function openEditModal(row) {
  editando.value = true;
  aluguelForm.value = {
    id: row.id,
    renterId: row.renter?.id,
    bookId: row.book?.id,
    rentDate: row.rentalRentedDate?.substring(0, 10),
    deadLine: row.rentalDeadline?.substring(0, 10),
  };
  modalAberto.value = true;
}

function fecharModal() { modalAberto.value = false; }

async function salvarAluguel() {
  const success = await aluguelFormRef.value.validate();
  if (!success) return;
  salvando.value = true;
  
  let payload;
  if (editando.value) {
    payload = {
      id: aluguelForm.value.id,
      renterId: aluguelForm.value.renterId,
      bookId: aluguelForm.value.bookId,
      rentalDeadline: aluguelForm.value.deadLine
    };
  } else {
    payload = {
      renterId: aluguelForm.value.renterId,
      bookId: aluguelForm.value.bookId,
      rentalRentedDate: today, // Garante data de hoje no formato YYYY-MM-DD
      rentalDeadline: aluguelForm.value.deadLine
    };
  }

  console.log('Dados enviados:', payload);

  try {
    if (editando.value) {
      await AlugueisService.updateAluguel(aluguelForm.value.id, payload);
      $q.notify({ type: "positive", message: t("RentalsPage_success_update") });
    } else {
      await AlugueisService.createAluguel(payload);
      $q.notify({ type: "positive", message: t("RentalsPage_success_register") });
    }
    fecharModal();
    carregarAlugueis();
  } catch (error) {
    console.error('Erro ao salvar aluguel:', error.response?.data || error);
    let msg = t("RentalsPage_error_save_default");
    const apiMsg = error.response?.data?.message;
    
    // Trata erro de duplicidade com chave de tradução conforme solicitado
    if (error.response?.status === 409 || (apiMsg && apiMsg.includes("possu"))) {
      msg = t('alerts.rental_already_exists');
    } else if (apiMsg) {
      msg = t(apiMsg);
    }
    
    $q.notify({ type: "negative", message: msg });
  } finally { salvando.value = false; }
}

const modalDevolucaoAberto = ref(false);
const rentalParaDevolucao = ref(null);
const recebendo = ref(false);
const isDevolucaoAtrasada = computed(() => {
  if (!rentalParaDevolucao.value) return false;
  return (rentalParaDevolucao.value.rentalDeadline?.substring(0, 10)) < today;
});

function confirmarRecebimento(row) {
  rentalParaDevolucao.value = row;
  modalDevolucaoAberto.value = true;
}

async function executarRecebimento() {
  recebendo.value = true;
  try {
    await AlugueisService.returnBook(rentalParaDevolucao.value.id);
    $q.notify({ type: "positive", message: t("RentalsPage_success_receive") });
    modalDevolucaoAberto.value = false;
    carregarAlugueis();
  } catch (error) {
    const msg = error.response?.data?.message || t("RentalsPage_error_receive_default");
    $q.notify({ type: "negative", message: msg });
  } finally { recebendo.value = false; }
}

onMounted(() => {
  carregarAlugueis();
  carregarAuxiliares();
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


