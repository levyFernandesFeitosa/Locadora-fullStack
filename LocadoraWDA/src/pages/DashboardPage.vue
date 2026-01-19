<template>
  <q-page class="dashboard-page q-pa-md bg-grey-1" style="background-color: #edead0;">
    <div class="dashboard">
      <div class="dashboard-grid">
        <q-card class="card">
          <q-card-section>
            <div class="text-h6 q-mb-md">{{ $t('DashboardPage_Rental_Distribution') }}</div>
            <canvas id="graficoDistribuicaoAlugueis"></canvas>
          </q-card-section>
        </q-card>

        <q-card class="card">
          <q-card-section>
            <div class="text-h6 q-mb-md">{{ $t('DashboardPage_Most_Rented_Books') }}</div>
            <canvas id="graficoLivrosMaisAlugados"></canvas>
          </q-card-section>
        </q-card>

        <div class="cards-coluna">
          <q-card class="card-total">
            <q-card-section>
              <div class="text-h6">{{ $t('DashboardPage_Total_Rentals') }}</div>
              <span class="text-h5">{{ totalAlugueis }}</span>
            </q-card-section>
          </q-card>
          <q-card class="card-total">
            <q-card-section>
              <div class="text-h6">{{ $t('DashboardPage_Total_Renters') }}</div>
              <span class="text-h5">{{ totalLocatarios }}</span>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="dashboard-extra">
        <q-table
          :rows="rows"
          :columns="columns"
          row-key="nome"
          class="minha-tabela-moderna"
          :grid="$q.screen.lt.md"
          :hide-header="$q.screen.lt.md"
          :pagination="$q.screen.lt.md ? { rowsPerPage: 0 } : {
              page: 1,
              rowsPerPage: 
                $q.screen.md ? 3 : 
                $q.screen.lg ? 5 : 
                5
          }"
          :rows-per-page-options="[0]"
          :hide-pagination="$q.screen.lt.md"
        >
          
          <template v-slot:header="props">
            <q-tr :props="props" class="linha-destacada">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <div v-if="col.name === 'actions'">
                    <q-btn
                        color="primary"
                        icon="edit"
                        flat
                        dense
                        size="sm"
                        @click="editRenter(props.row.id)"
                    />
                    <q-btn
                        color="negative"
                        icon="delete"
                        flat
                        dense
                        size="sm"
                        class="q-ml-sm"
                        @click="deleteRenter(props.row.id)"
                    />
                </div>
                <div v-else>
                    {{ col.value }}
                </div>
              </q-td>
            </q-tr>
          </template>
          
          <template v-slot:item="props">
            <div
              class="q-pa-xs col-xs-12 col-sm-6" 
            >
              <q-card flat bordered class="q-ma-sm">
                <q-card-section>
                  <div
                    v-for="col in props.cols.filter(c => c.name !== 'actions')"
                    :key="col.name"
                    class="row q-mb-sm"
                  >
                    <div class="col-6 text-weight-bold text-grey-7">
                      {{ col.label }}:
                    </div>
                    <div class="col-6 text-right text-black">
                      {{ col.value }}
                    </div>
                  </div>
                  
                </q-card-section>
              </q-card>
            </div>
          </template>
          </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n'; 
import { dashboardService } from 'src/services/dashboardService';
import Chart from 'chart.js/auto';

const $q = useQuasar();
const { t, locale } = useI18n(); 

const loading = ref(true);
const locatarios = ref([]);
const alugueis = ref([]);
const livrosMaisAlugados = ref([]);
const entreguesNoPrazo = ref(0);
const entreguesAtraso = ref(0);
const alugueisAtrasados = ref(0);

const totalAlugueis = computed(() => Array.isArray(alugueis.value) ? alugueis.value.length : 0);
const totalLocatarios = computed(() => Array.isArray(locatarios.value) ? locatarios.value.length : 0);

const columns = computed(() => [
  { 
    name: 'nome', 
    label: t('DashboardPage_Renter'), 
    field: 'nome', 
    align: 'left', 
    sortable: true,
    classes: $q.screen.lt.md ? 'hidden' : '', 
    headerClasses: $q.screen.lt.md ? 'hidden' : '',
  },
  { 
    name: 'totalAlugueis', 
    label: t('DashboardPage_Total_Loans'), 
    field: 'totalAlugueis', 
    align: 'center', 
    sortable: true 
  },
  { 
    name: 'livrosDevolvidos', 
    label: t('DashboardPage_Rentals_Returned'), 
    field: 'livrosDevolvidos', 
    align: 'center', 
    sortable: true 
  },
]);

const rows = computed(() => {
  const allAlugueis = alugueis.value;
  return locatarios.value.map(loc => {
    const alugueisDoLoc = allAlugueis.filter(r => r.renter?.id === loc.id);

    const totalAlugueis = alugueisDoLoc.length;
    
    const livrosDevolvidos = alugueisDoLoc.filter(r =>
      r.status === "in_time" || r.status === "returned_with_delay" 
    ).length; 

    return {
      id: loc.id, 
      nome: loc.renterName || loc.name,
      totalAlugueis,
      livrosDevolvidos
    };
  });
});


let chartLivros = null;
let chartPizza = null;

function renderCharts() {
  if (chartLivros) chartLivros.destroy();
  if (chartPizza) chartPizza.destroy();

  const livrosLabels = livrosMaisAlugados.value.map(item => item.name);
  const livrosData = livrosMaisAlugados.value.map(item => item.totalRents);
  
  const ctxLivros = document.getElementById('graficoLivrosMaisAlugados');
  if (ctxLivros) {
    chartLivros = new Chart(ctxLivros.getContext('2d'), {
      type: 'bar',
      data: {
        labels: livrosLabels,
        datasets: [{
          label: t('DashboardPage_Most_Rented_Books'), 
          data: livrosData,
          backgroundColor: 'rgba(75, 192, 192, 1)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: { 
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        if (value % 1 === 0) {
                            return value;
                        }
                    }
                }
            }
        }
    }
    });
  }

  const ctxPizza = document.getElementById('graficoDistribuicaoAlugueis');
  if (ctxPizza) {
    chartPizza = new Chart(ctxPizza.getContext('2d'), {
      type: 'pie',
      data: {
        labels: [
          t('DashboardPage_Returned'),
          t('DashboardPage_Pending'), 
          t('DashboardPage_Late')
        ],
        datasets: [{
          label: t('DashboardPage_Rental_Distribution'), 
          data: [
            entreguesNoPrazo.value,
            entreguesAtraso.value,
            alugueisAtrasados.value
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 183, 0, 0.6)',
            'rgba(255, 0, 55, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: $q.screen.lt.md ? 'bottom' : 'bottom' 
          }
        }
      }
    });
  }
}

async function loadData() {
  loading.value = true;
  try {
    const data = await dashboardService.loadDashboardData(1);

    locatarios.value = data.locatarios;
    alugueis.value = data.alugueis;
    
    livrosMaisAlugados.value = data.livrosMaisAlugados.map(item => ({
        name: item.bookTitle, 
        totalRents: item.rentalCount
    }));
    
    entreguesNoPrazo.value = data.entreguesNoPrazo;
    entreguesAtraso.value = data.entreguesAtraso;
    alugueisAtrasados.value = data.alugueisAtrasados;
    
    await nextTick();
    renderCharts();

  } catch (error) {
    console.error('Erro no loadData:', error);
    $q.notify({
      type: 'negative',
      message: t('general_data_load_error') || 'Erro ao carregar dados', 
      caption: error.response?.data?.message || 'Verifique sua conexão ou a API.',
    });
  } finally {
    loading.value = false;
  }
}

function editRenter(id) {
    console.log('Editar locatário:', id);
    // Lógica de edição
}

function deleteRenter(id) {
    console.log('Excluir locatário:', id);
    // Lógica de exclusão
}

onMounted(() => {
  loadData();
});

watch(() => $q.screen.width, () => {
    setTimeout(renderCharts, 100); 
});

watch(locale, () => {
    setTimeout(renderCharts, 100); 
});

</script>