

import data from './data.json';

/*
    Acima de 50 ton verifica eixo (eixo tem 12,5% de tolerância)
    Cada grupo de eixo aumenta um peso 
    PBT tem 5% de tolerância ao somatório de pesos dos eixos
    Diferenciar diantêiro de traseiro
*/

const PER_AXLE_ALLOWANCE = 0.125;

const FRONT_AXLE_GROUP_DATA = [
    { allowedWeight: 6000 },    //DS
    { allowedWeight: 12000 },   //TD (direcional)
];

const REAR_AXLE_GROUP_DATA = [
    { allowedWeight: 10000 },   //TS  
    { allowedWeight: 17000 },   //TD 
    { allowedWeight: 25000 },   //TT
];

const results = data.map(truck => {

    console.log(truck)

    const maxAllowedWeight = truck.axleGroups.map((g, i) => ((i === 0 ? FRONT_AXLE_GROUP_DATA : REAR_AXLE_GROUP_DATA)[g.length - 1].allowedWeight));

    console.log(maxAllowedWeight)

});




console.log(data)
