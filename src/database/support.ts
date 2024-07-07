const convertToCamelCase = (value) => {
    if (typeof value !== 'object') {
        return value;
    }

    const newObj = {};
    Object.keys(value).forEach((prop) => {
        const name = prop.replace(/_[a-z]/g, (a) => a.replace('_', '').toUpperCase());
        newObj[name] = value[prop];
    });

    return newObj;
};

export const postProcessResponse = (result) => {
    if (Array.isArray(result)) {
        return result.map((row) => convertToCamelCase(row));
    }
    return convertToCamelCase(result);
};
export const wrapIdentifier = (value, origImpl) => {
    return origImpl(value.replace(/[A-Z]/g, (a) => `_${a.toLowerCase()}`));
};