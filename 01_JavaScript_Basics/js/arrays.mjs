export function arrays() {

    const numbers = [1, 2, 3, 4, 5, 6];

    // jedes Element verdoppeln
    const doubled = numbers.map(n => n * 2);

    console.log(doubled); // [2, 4, 6, 8, 10, 12]


    // nur gerade Zahlen behalten
    const evens = numbers.filter(n => n % 2 === 0);

    function out(n) {
        console.log(n);
    }

    numbers.forEach(out);

    console.log(evens); // [2, 4, 6]

    const students = [
        { name: "Max", points: 10 },
        { name: "Anna", points: 25 },
        { name: "Tom", points: 21 }
    ];

    // Summe berechnen

    function add(acc, n) {
        return acc + n;
    }
    const sum_add = numbers.reduce(add, 0);

    const sum = numbers.reduce((acc, n) => acc + n, 0);
    const points = students.reduce((acc, student) => acc + student.points, 0);

    console.log(sum); // 10


    const a = 3;
    const b = a > 1 ? 0 : a;



    const result = numbers
        .filter(n => n % 2 === 0)     // [2, 4, 6]
        .map(n => n * n)              // [4, 16, 36]
        .reduce((acc, n) => acc + n, 0); // 56

    console.log(result); // 56
}