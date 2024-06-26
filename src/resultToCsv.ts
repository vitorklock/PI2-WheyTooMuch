
import result from './result.json';

import fs from 'fs';
import path from 'path';
import jsonToCsv from 'json-2-csv';

type IAnalisis = (typeof result.analyses)[number]

type ICsvTruck = {
    ID: string,
    PBT_ALLOWED: string,
    PBT_READING: string,
    PBT_TOLERANT: string,
    PBT_PASSED: string,
}

type ICsvAxleGroup = {
    TRUCK_ID: string,
    ALLOWED: string,
    READING: string,
    TOLERANT: string,
    PASSED: string,
}

/*
    id: string;
    pbt: {
        allowed: number;
        tolerant: number;
        reading: number;
        passed: boolean;
    };
    axleGroups: {
        allowed: number;
        tolerant: number;
        reading: number;
        passed: boolean;
    }[];
    passed: boolean;
*/

const axleGroups: Array<ICsvAxleGroup> = [];
const trucks: Array<ICsvTruck> = [];

result.analyses.forEach(a => {
    // console.log(a)

    trucks.push({
        ID: a.id,
        PBT_ALLOWED: String(a.pbt.allowed),
        PBT_PASSED: String(a.pbt.passed),
        PBT_READING: String(a.pbt.reading),
        PBT_TOLERANT: String(a.pbt.tolerant),
    });

    a.axleGroups.forEach(ag => axleGroups.push({
        TRUCK_ID: a.id,
        ALLOWED: String(ag.allowed),
        PASSED: String(ag.passed),
        READING: String(ag.reading),
        TOLERANT: String(ag.tolerant),
    }));
});

const csvTrucks = jsonToCsv.json2csv(trucks, { emptyFieldValue: '', });
const csvAxleGroups = jsonToCsv.json2csv(axleGroups, { emptyFieldValue: '', });

fs.writeFileSync(path.resolve('src/resultAnalyses.csv'), csvTrucks, 'utf8');
fs.writeFileSync(path.resolve('src/resultAxleGroups.csv'), csvAxleGroups, 'utf8');
