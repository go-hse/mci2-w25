export function maps() {
    const capitals = new Map(); // leere Map

    capitals.set("Germany", "Berlin");
    capitals.set("France", "Paris");
    capitals.set("Italy", "Rome");

    console.log(capitals.get("Germany")); // "Berlin"

    for (const [country, city] of capitals) {
        console.log(`${country}: ${city}`);
    }

    capitals.delete("France");
    console.log(capitals.has("France")); // false   
    console.log(capitals.size); // 2
    capitals.clear();
    console.log(capitals.size); // 0

    // Beispiel
    const bus = createEventBus();

    bus.subscribe("chat", msg => console.log("Chat:", msg));
    bus.subscribe("news", news => console.log("News:", news));
    bus.subscribe("chat", msg => console.log("Logger:", msg));

    bus.publish("chat", "Hallo zusammen!");
    bus.publish("news", { headline: "Breaking!", body: "JS ist super." });

}


const createEventBus = () => {
    const subs = new Map();

    function subscribe(topic, fn) {
        if (!subs.has(topic)) subs.set(topic, []);
        subs.get(topic).push(fn);
    }

    return {
        subscribe,
        publish: (topic, data) => {
            if (!subs.has(topic)) return;
            subs.get(topic).forEach(fn => fn(data));
        }
    };
};

