

import csvtojson from 'csvtojson';
import path from 'path';
import fs from 'fs';

(async () => {
    const json = await csvtojson().fromFile(path.resolve('src/data.csv'));

    const trucks = json.map(o => {
        o = Object.fromEntries(Object.entries(o).map(([key, value]) => ([key.replace('Vehicle', ''), value])));

        const truck = {
            id: o.VBVID,
            length: o.Lenght,
            speed: o.Speed,
            weight: o.Weight,
            axles: o.Axles,
        };

        truck.axleWeights = Object.entries(o)
            .map(([k, v]) => {
                if (!k.includes('AxleWeight')) return;
                return Number(v);
            })
            .filter(Boolean);

        truck.axleDistances = Object.entries(o)
            .map(([k, v]) => {
                if (!k.includes('AxelDistance')) return;
                return Number(v);
            })
            .filter(Boolean);

        return truck;
    });

    fs.writeFileSync(path.resolve('src/data.json'), JSON.stringify(trucks), 'utf8');
})();

