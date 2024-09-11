class RecintosZoo {

    constructor() {
        this.recintos = [
            { numero: 1, bioma: "savana", tamanhoTotal: 10, animais: [{ especie: "MACACO", quantidade: 3, espaco: 1 }] },
            { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animais: [{ especie: "GAZELA", quantidade: 1, espaco: 2 }] },
            { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: [{ especie: "LEAO", quantidade: 1, espaco: 3 }] }
        ];
        
        this.animaisPermitidos = {
            "LEAO": { espaco: 3, bioma: ["savana"], carnivoro: true },
            "LEOPARDO": { espaco: 2, bioma: ["savana"], carnivoro: true },
            "CROCODILO": { espaco: 3, bioma: ["rio"], carnivoro: true },
            "MACACO": { espaco: 1, bioma: ["savana", "floresta"], carnivoro: false },
            "GAZELA": { espaco: 2, bioma: ["savana"], carnivoro: false },
            "HIPOPOTAMO": { espaco: 4, bioma: ["savana", "rio"], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido" };
        }
    
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }
    
        // Calculo do espaço necessário
        const especieInfo = this.animaisPermitidos[animal];
        let espacoNecessario = especieInfo.espaco * quantidade;

        // Calcular o espaço já ocupado no recinto
        const calcularEspacoOcupado = (recinto) => {
            return recinto.animais.reduce((total, a) => total + (a.espaco * a.quantidade), 0);
        };

        // Filtra os recintos viáveis com base nas regras
        const recintosViaveis = this.recintos.filter(recinto => {
            const espacoOcupado = calcularEspacoOcupado(recinto);
            const espacoLivre = recinto.tamanhoTotal - espacoOcupado;
    
            // Verifica se o bioma do recinto é compatível
            if (!especieInfo.bioma.includes(recinto.bioma) && recinto.bioma !== "savana e rio") {
                return false;
            }
    
            // Verifica se há carnívoros no recinto (só podem estar com sua própria espécie)
            const carnivoroExistente = recinto.animais.some(a => this.animaisPermitidos[a.especie].carnivoro);
            const outraEspecieCarnivora = carnivoroExistente && this.animaisPermitidos[recinto.animais[0].especie].carnivoro && recinto.animais[0].especie !== animal;
            if (outraEspecieCarnivora || (especieInfo.carnivoro && recinto.animais.length > 0)) {
                return false;
            }
    
            // Se houver mais de uma espécie no recinto, adiciona 1 de espaço extra
            const maisDeUmaEspecie = recinto.animais.length > 0 && recinto.animais[0].especie !== animal;
            const espacoNecessarioTotal = espacoNecessario + (maisDeUmaEspecie ? 1 : 0); // Aqui o ajuste da espécie extra
    
            // Verifica se há espaço suficiente após o cálculo do espaço adicional
            return espacoLivre >= espacoNecessarioTotal;
        }).map(recinto => {
            const espacoOcupado = calcularEspacoOcupado(recinto);
            const maisDeUmaEspecie = recinto.animais.length > 0 && recinto.animais[0].especie !== animal;
            const espacoNecessarioTotal = espacoNecessario + (maisDeUmaEspecie ? 1 : 0); // Aqui o ajuste da espécie extra
            const espacoLivreAposInclusao = recinto.tamanhoTotal - espacoOcupado - espacoNecessarioTotal;
            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivreAposInclusao} total: ${recinto.tamanhoTotal})`;
        });
    
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }
    
        return { recintosViaveis };
    }
}

export { RecintosZoo as RecintosZoo };
