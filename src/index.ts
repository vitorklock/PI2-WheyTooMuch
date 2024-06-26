

import data from './data.json';

import fs from 'fs';
import path from 'path';

/*
    Acima de 50 ton verifica eixo (eixo tem 12,5% de tolerância)
    Cada grupo de eixo aumenta um peso 
    PBT tem 5% de tolerância ao somatório de pesos dos eixos
    Diferenciar diantêiro de traseiro
*/

interface IRegularityAnalysis {
    allowed: number,
    tolerant: number,
    reading: number,
    passed: boolean,
};

interface IAnalysisResult {
    id: string,
    pbt: IRegularityAnalysis,
    axleGroups?: Array<IRegularityAnalysis>,
    passed: boolean,
};

const PER_AXLE_TOLERANCE = 0.125;
const PBT_TOLERANCE = 0.05;

const FRONT_AXLE_GROUP_DATA = [
    { allowedWeight: 6000 },    //DS
    { allowedWeight: 12000 },   //TD (direcional)
];

const REAR_AXLE_GROUP_DATA = [
    { allowedWeight: 10000 },   //TS  
    { allowedWeight: 17000 },   //TD 
    { allowedWeight: 25000 },   //TT
];

const invalids: typeof data = [];

const analyses: Array<IAnalysisResult> = data
    .map(truck => {

        // console.log(truck)

        // Regra de cacaca 1
        // if (truck.axleGroups[0].length >= 3 || truck.axleGroups[1].length >= 4) {
        //     invalids.push(truck);
        //     return;
        // }

        if (truck.axleGroups.length <= 1 || truck.axleGroups.map((g, i) => (i === 0 ? g.length >= 3 : g.length >= 4)).some(Boolean)) {
            invalids.push(truck);
            return;
        }


        const maxAllowedWeights = truck.axleGroups.map((g, i) => ((i === 0 ? FRONT_AXLE_GROUP_DATA : REAR_AXLE_GROUP_DATA)[g.length - 1].allowedWeight));
        const tolerantMaxAllowedWeights = maxAllowedWeights.map(w => w * (1 + PER_AXLE_TOLERANCE));

        const maxAllowedPBT = maxAllowedWeights.reduce((partialSum, a) => partialSum + a, 0);
        const tollerantMaxAllowedPBT = maxAllowedPBT * (1 + PBT_TOLERANCE);

        // console.log('maxAllowedWeights', maxAllowedWeights)
        // console.log('tollerantMaxAllowedWeights', tolerantMaxAllowedWeights)
        // console.log('maxAllowedPBT', maxAllowedPBT)
        // console.log('tollerantMaxAllowedWeight', tollerantMaxAllowedPBT)

        const pbtAnalysis: IRegularityAnalysis = {
            allowed: maxAllowedPBT,
            tolerant: tollerantMaxAllowedPBT,
            reading: truck.weight,
            passed: truck.weight <= tollerantMaxAllowedPBT,
        };

        // console.log('pbtAnalysis', pbtAnalysis);

        const axleGroupsAnalysis: Array<IRegularityAnalysis> = truck.axleGroups.map((ag, i) => {
            const axleWeightSum = ag.reduce((partialSum, a) => partialSum + a, 0);
            const tolerantMaxAllowed = tolerantMaxAllowedWeights[i];

            return {
                allowed: maxAllowedWeights[i],
                tolerant: tolerantMaxAllowed,
                reading: axleWeightSum,
                passed: axleWeightSum <= tolerantMaxAllowed,
            };
        });

        // console.log('axleGroupsAnalysis', axleGroupsAnalysis);

        const analysis: IAnalysisResult = {
            id: truck.id,
            pbt: pbtAnalysis,
            axleGroups: axleGroupsAnalysis,
            passed: pbtAnalysis.passed && (pbtAnalysis.reading < 50000 || axleGroupsAnalysis.every(a => a.passed)),
        };

        return analysis;
    })
    .filter(Boolean);


const result = {
    trucks: data,
    invalids,
    analyses,
    tolerances: {
        perAxle: PER_AXLE_TOLERANCE,
        pbt: PBT_TOLERANCE,
    }
};

// console.log(result)


// console.log('invalid', result.invalids.length)
// console.log('total', result.analyses.length)
// console.log('passou', result.analyses.filter(a => a.passed).length)
// console.log('n passou', result.analyses.filter(a => !a.passed).length)

// console.log(invalids.filter(inv => inv.axleGroups.length != 1))

// console.log('n passou', JSON.stringify(result.analyses.filter(a => !a.passed), null, 4));
// console.log('n passou', JSON.stringify(data.filter(d=> result.analyses.filter(a => !a.passed).map(a => a.id).includes(d.id)), null, 4));

fs.writeFileSync(path.resolve('src/result.json'), JSON.stringify(result), 'utf8');

// console.log('RESULT JSON FILE WRITTEN');











