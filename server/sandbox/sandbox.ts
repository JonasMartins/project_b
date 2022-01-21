interface emotion {
    [key: string]: Set<string>;
}

let map: emotion = {};

map["ANGRY"] = new Set(["1", "2", "3", "4"]);
map["VOMIT"] = new Set(["2"]);
map["SMILE"] = new Set(["1", "3"]);
map["HEART"] = new Set(["2", "3", "4"]);

map["HEART"].delete("4");
map["HEART"].add("1");

console.log(map["HEART"]);
