const str1 = 'foo bar baz';
const str2 = '';
const bool = false;
const bogus = null;

const obj = {
    yes: 1,
    no: 0,
    fuzzy: [.2, .4, .6, .8]
};

const anotherobj = {
    uh: ['one', 'two', 'three'],
    size: 3
};

const internalFun = (a, b, c) => a + b + c;

const fun1 = (a = 2, b = 2, c = 2) => `The sum is: ${internalFun(a, b, c)}`;

const fun2 = () => fun1(100, 2, 2);

export {
    str1,
    str2,
    bool,
    bogus,
    obj,
    anotherobj,
    fun1,
    fun2
};
