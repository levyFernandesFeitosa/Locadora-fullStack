import { api } from 'boot/axios'; 

const dashboardService = {
    async loadDashboardData(numberOfMonths = 3) {
        const params = { numberOfMonths };
        
        try {
            const [
                livrosMaisAlugadosRes,
                entreguesNoPrazoRes,
                entreguesAtrasoRes,
                alugueisAtrasadosRes,
                alugueisPorLocatarioRes,
                alugueisRes, 
                locatariosRes 
            ] = await Promise.all([
                api.get('/dashboard/bookMoreRented', { params }),
                api.get('/dashboard/deliveredInTimeQuantity', { params }),
                api.get('/dashboard/deliveredWithDelayQuantity', { params }),
                api.get('/dashboard/rentsLateQuantity', { params }),
                api.get('/dashboard/rentsPerRenter', { params }),
                api.get('/rent'),
                api.get('/renter')
            ]);

            return {
                livrosMaisAlugados: livrosMaisAlugadosRes.data,
                entreguesNoPrazo: entreguesNoPrazoRes.data,
                entreguesAtraso: entreguesAtrasoRes.data,
                alugueisAtrasados: alugueisAtrasadosRes.data,
                alugueis: alugueisRes.data,
                locatarios: locatariosRes.data,
            };

        } catch (error) {
            console.error('Erro ao carregar dashboard:', error.response?.data || error.message);
            throw error;
        }
    },
};

export { dashboardService };