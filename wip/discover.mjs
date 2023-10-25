const introspect = module => {
    const result = {
        primitives: [],
        objects: [],
        functions: [],
        index: {}
    };
    for (let id in module) {
        const value = module[id];
        const type = (typeof value).toLowerCase();
        switch (type) {
            case 'function':
                result.functions.push(id);
                result.index[id] = {type, value};
                break;
            case 'object':
                if (null !== value) {
                    result.objects.push(id);
                    result.index[id] = {type, value};
                    break;
                }
                // No 'break' here on purpose.
            default:
                result.primitives.push(id);
                result.index[id] = {type: 'primitive', subtype: type, value};
                break;
        }
    };
    return result;
};

const discover = module => new Promise((resolve, reject) => {
    import(module)
        .then(m => {
            resolve(introspect(m));
        })
        .catch(e => {
            reject(e);
        });
});

export default discover;
