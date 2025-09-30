import * as myFunctions from "./js/funcs.mjs";

// import { Hello } from "./js/funcs.mjs"


import { test } from "./js/funcs.mjs";


function Fahrzeug(typ, ps) {

    let gefahren_km = 0;

    function print() {
        console.log("Typ:", typ, " PS:", ps);
    }

    function fahren(km) {
        gefahren_km += km;
    }

    return { print, fahren };
}


function Auto(marke, typ, ps) {
    const fahrzeug = Fahrzeug(typ, ps);
    const fzg_print = fahrzeug.print;

    function print() {
        fzg_print();
        console.log("Marke:", marke);
    }

    return { print, fahren: fahrzeug.fahren };
}

function Fahrrad(marke, typ) {
    const fahrzeug = Fahrzeug(typ, 0);
}



function closure() {
    let count = 0;
    function incFunc() {
        count++;
    }

    function isEven() {
        return count % 2 === 0;
    }

    function print() {
        console.log("count=", count, " isEven=", isEven());
    }
    return { inc: incFunc, print };
}

function testArguments(a, b) {
    console.log("a=", a, " b=", b);
    for (let i = 0; i < arguments.length; ++i) {
        console.log(`arg[${i}]=`, arguments[i]);
    }
}


window.onload = () => {

    myFunctions.test();


    testArguments(1, 2, 3, 4, 5);
    testArguments("Hallo", true, { name: "Max" });
    testArguments();

    const incObj = closure();
    incObj.inc();
    incObj.inc();
    incObj.print();

    var b;

    let a = 10;
    console.log(typeof a); // number
    a = "Hallo";
    console.log(typeof a); // string
    a = true;

    console.log(typeof a); // boolean


    console.log(b);
    // var b = 20;
    b = 20;


    var b = "Hallo";
    console.log(b);

    const c = 30;

    let obj = { name: "Max", age: 30, print: function () { console.log(this.name); } };

    obj.print();

    const uni = "\u00A9 \uD83D\uDE00";
    console.log(uni);

};

