import discover from './discover.mjs';

const pickRandomItem = arr => {
    const size = arr.length;
    const i = Math.floor(Math.random() * size);
    return arr[i];
};

const traceObject = obj => console.log(JSON.stringify(obj, null, 4) + '\n');

const printRandomPrimitive = obj => {
    console.debug('Picking a random primitive:');
    const id = pickRandomItem(obj.primitives);
    const data = obj.index[id];
    console.debug(`Property "${id}" of type ${data.subtype}, with value "${data.value}"\n`);
};

const printRandomObject = obj => {
    console.debug('Picking a random object:');
    const id = pickRandomItem(obj.objects);
    const data = obj.index[id];
    console.debug(`Object "${id}", with value "${JSON.stringify(data.value)}"\n`);
};

const executeRandomFunction = obj => {
    console.debug('Picking a random function:');
    const id = pickRandomItem(obj.functions);
    const data = obj.index[id];
    console.debug(`Executing function "${id}"...`);
    const result = data.value();
    console.debug(`Function returned "${result}"\n`);
};

discover('./lib.mjs')
    .then(lib => {
        console.log('Library loaded!\n');
        // traceObject(lib);
        printRandomPrimitive(lib);
        printRandomObject(lib);
        executeRandomFunction(lib);
    })
    .catch(e => {
        console.error(`Could not load library :(\n${e}`);
    });
