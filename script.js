var rooms = {};
class Room {
    constructor(options) {
        this.uid = options.id;
        rooms[this.uid] = this;
        this.connections = options.connections;
        this.name = options.name;
        this.des = options.des;
        this.items = options.items || [];
        this.in = options.mobs || [];

    }
    enter(player) {
        Object.keys(this.connections).forEach(dir => {
            if (this.connections[dir] != null) {
                var room = rooms[this.connections[dir]];
                if (!room) {
                    delete this.connections[dir];
                }
            }
        });

        this.print();
        player.activeRoom = this;
        player.getPossibleMoves(this.uid);

    }
    print() {
        var title = this.name;
        var under = this.des;

        var out = `<h2>${title}</h2>
    <p><i>${under}</i></p>`
        var passedItems = [];
        if (this.items.length >= 1) {
            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i]

                if (passedItems.includes(item.ref)) continue;
                var commonItems = this.items.filter(i => i.ref == item.ref);
                if (commonItems.length > 1) {
                    out += `<p class = 'item'><b><i>There are ${commonItems.length} ${commonItems[0].name} here</i></b></p>`
                    passedItems.push(item.ref);
                    continue;
                }
                out += `<p class = 'item'><b><i>There is a ${item.name} here</i></b></p>`
                passedItems.push(item.ref);
            }
        }
        if (this.in.length >= 1) {
            this.in.forEach(item => {
                out += `<p class = 'mob'><b><i>${item.name} (${item.class}) is in here</i></b></p>`
            })
        }
        
        Object.keys(this.connections).forEach(dir => {
            if (this.connections[dir] != null) {
                out += `<p class = 'connection'><b><i>There is a path to the ${dir} (${rooms[this.connections[dir]].name})</i></b></p>`
            }
        });

        log(out);

    }
}
class Player {
    constructor(options) {
        this.inventory = [];
        this.health = 100;
        this.stamina = 100;
        this.dexterity = 100;
        this.perception = Math.floor(Math.random() * 100);
        this.activeItems = [];
        this.activeRoom = options.start;
        this.activeRoom.enter(this);
    }
    move(direction) {
        var newRoomID = this.activeRoom.connections[direction]
        var newRoom = rooms[newRoomID];
        if (!newRoom) return log("This path leads nowhere");
        log("You enter " + newRoom.name);
        newRoom.enter(this);
    }
    speak(npc) {
        var result = npc.talk(this);
        log(`You get ${npc.name}'s attention`)
        log(`${npc.name} says, <span class = "npc-says">${result}</span>`);
    }
    getPossibleMoves() {
        var npcInRoom = this.activeRoom.in.length >= 1;
        var itemsInRoom = this.activeRoom.items.length >= 1;
        var moves = [];
        if (npcInRoom) moves.push("speak");
        if (itemsInRoom) moves.push("take <item name>");
        moves.push("inventory");
        moves.push("look");
        var baseMoves = Object.keys(this.activeRoom.connections);
        baseMoves = baseMoves.filter(m =>{
            return rooms[this.activeRoom.connections[m]] != undefined
        })
        var possibleMoves = [...baseMoves, ...moves]
        document.getElementById("input").placeholder = possibleMoves.map(m => "[" + m + "]").join(" ");
        return possibleMoves.map(m => m.split(" ")[0]);
    }
}
class NPC {
    constructor() {
        var fNames = [
            "John",
            "Mary",
            "Joe",
            "Sally",
            "Bob",
            "Alice",
            "Bill",
            "Jill",
            "Tom",
            "Tim",
            "Tina",
            "Terry",
            "Maggie",
            "Marge",
            "Molly",
            "Mike",
            "Pete",
            "Paul",
            "Pam"
        ]
        var lNames = [
            "Smith",
            "Johnson",
            "Williams",
            "Brown",
            "Jones",
            "Garcia",
            "Miller",
            "Davis",
            "Rodriguez",
            "Martinez",
            "Hernandez",
            "Lopez",
            "Gonzalez",
            "Wilson",
            "Anderson",
            "Thomas",
            "Taylor",
            "Moore",
            "Jackson",
            "Martin"
        ]
        this.name = "<span class = 'npc-name'>" + fNames[Math.floor(Math.random() * fNames.length)] + " " + lNames[Math.floor(Math.random() * lNames.length)] + "</span>";
        // random generic statements
        this.dialogue = [
            "Hello there",
            "The weather is nice today",
            "How about that view!",
            "I'm just going to stay in this room. It is nice",
            "I saw a bear the other day",
            "Guess what.....",
            "I'm hungry",
            "The sun is shining today",
            "Mars is bright tonight",
            "I like the color blue",
            "I like the color red",
            "It's been a long day",
            "I need a break",
            "I'm tired",
            "What a beautiful sunset",
            "I could use a cup of coffee",
            "I hope tomorrow is better",
            "Did you hear about the new restaurant?",
            "I need to relax",
            "I wonder what's on TV tonight",
            "I miss my old friends",
            "Life is too short",
            "I wish I had more free time",
            "Do you believe in ghosts?",
            "I wish I could travel more often",
            "I'm looking forward to the weekend",
            "I wish I could play an instrument",
            "I need to get in shape",
            "I'm feeling a bit under the weather",
            "I love spending time with my family",
            "I'm not a morning person",
            "I'm counting down the days until vacation",
            "I wonder what the future holds",
            "I wish I could turn back time",
            "I'm trying to cut down on caffeine",
            "I've been meaning to read more books",
            "I'm excited for the upcoming holidays",
            "I can't believe how fast time flies",
            "I'm thinking of redecorating my house",
            "I wish I could learn to cook better",
            "I need to find a new hobby",
            "I'm saving up for a big purchase",
            "I love spending time outdoors",
            "I'm not a fan of big crowds",
            "I wish I could sleep in every day",
            "I'm always losing my keys",
            "I wish I could be more organized",
            "I'm not very good at making decisions",
            "I wish I could speak another language",
        ];
        
        this.class = ["DWARF","TALKING DONKEY","ENGLISH TEACHER","HUMAN","TROLL"][Math.floor(Math.random() * 5)];
    }
    talk(player) {
        return `<span class = "npc-says">${this.dialogue[Math.floor(Math.random() * this.dialogue.length)]}</span>`
    }
}
class Gregory extends NPC {
    constructor() {
        super();
        this.name = "<span class = 'npc-name'>Gregory</span>";
        this.dialogue = ["Hello", "I am Gregory", "My it's cold in here"];
        this.timesFinished = 0;
        this.quest = () => {
            var neededBerries = Math.floor(Math.random() * 10) + 2 + this.timesFinished;
            setTimeout(() => {
                log("<p><i>You have been assigned a quest. Find the required items and speak to Gregory when you have them</i><br>Berries can be found in grasslands and forests</p>")
            }, 500);
            var possibleFinishedSayings = [
                "Why thank you! With these berries I can make a lovely pie.",
                "Oh, you found the berries! Thank you so much!",
                "I can't believe you found the berries! Thank you!",
                "You found the berries! Thank you!",
                "Thank you for finding the berries!",
                "Bless your soul, thank you for the berries",
                "I could kiss you! Thank you for the berries!",
                "Thanks much for the berries!",
                "I appreciate it",
                "Thank you!",
                "Cheers!",
                "Thanks!",
                "Thank you so much!",
                "Thank you very much!",
                "I will use these berries to make soup!",
                "I will use these berries to make a pie!",
                "I will use these berries to make a cake!",
                "I will use these berries to make a salad!",
                "I will use these berries to make a smoothie!",
                "I will use these berries to make a jam!",
                "I will use these berries to make a jelly!",
                "I will use these berries to make a sauce!",
                "I will use these berries to make a syrup!",
                "I will use these berries to make a juice of happiness!",
                "Until we meet again",
                "I'm just going to stay in this room. It is nice"
            ]
            return {
                des: "I need some berries. Find me " + neededBerries + " berries, will you?",
                itemRef: "berries",
                quantity: neededBerries,
                finished: possibleFinishedSayings[Math.floor(Math.random() * possibleFinishedSayings.length)],
            }
        }
        this.activeQuest = null;
        this.questActive = false;
        this.class = "HUMAN";
    }
    talk(player) {
        if (this.questActive) {
            var berries = player.inventory.filter(i => i.ref == "berries");
            if (berries && berries.length >= this.activeQuest.quantity) {
                this.timesFinished++;
                player.inventory = player.inventory.filter(i => {
                    if (this.activeQuest.quantity == 0) return true;
                    if (i.ref == "berries") {
                        this.activeQuest.quantity--;
                        return false;
                    }
                    return true
                })
                this.questActive = false;
                var say = this.activeQuest.finished;
                this.activeQuest = null;
                return say;
            } else if (berries) {
                return `${this.activeQuest.des} You have ${berries.length} berries. `;
            } else {
                return this.activeQuest.des;
            }
        } else {
            this.questActive = true;
            this.activeQuest = this.quest();
            return this.activeQuest.des;
        }
    }
}
function log(logged) {
    document.getElementById("out").innerHTML += "<br>" + logged;
    // scroll to bottom
    var objDiv = document.getElementById("out");
    objDiv.scrollTop = objDiv.scrollHeight;

    objDiv.scrollTop = objDiv.scrollHeight;
}

document.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
        var input = document.getElementById("input").value;
        var move = input.split(" ")[0];
        if (p.getPossibleMoves().includes(move)) {
            if (Object.keys(p.activeRoom.connections).includes(move)) {
                p.move(move);
            } else if (move == "speak") {
                p.speak(p.activeRoom.in[0]);
            } else if (move == "take") {
                var args = input.split(" ");
                var move = args.shift();
                var item = args.join(" ");
                var item = p.activeRoom.items.find(i => i.name.toLowerCase() == item.toLowerCase());
                if (item) {
                    var itemsTaken = p.activeRoom.items.filter(i => i.name == item.name);
                    var itemsLeft = p.activeRoom.items.filter(i => i.name != item.name);

                    p.inventory = [...p.inventory, ...itemsTaken];
                    p.activeRoom.items = itemsLeft;
                    if (itemsTaken.length > 1) {
                        log(`You take the ${itemsTaken[0].name} (x${itemsTaken.length})`);
                    } else {
                        log(`You take the ${item.name}`);
                    }
                } else {
                    log("That item is not here");
                }
            } else if (move == "inventory") {
                if (p.inventory.length >= 1) {
                    var inv = [];
                    p.inventory.forEach(item=>{
                        var found = inv.find(other=>{
                            return other.ref == item.ref
                        });
                        if(found) return;
                        var common_items = p.inventory.filter(other=>{
                            return other.ref == item.ref
                        });
                        var num = common_items.length;
                        inv.push({ name: item.name, ref: item.ref, quantity: num });
                    });
                    log("You have: " + inv.map(i => {
                        return i.name + "("+i.quantity+")"
                    }).join(", "));
                } else {
                    log("You have no items");
                }
            } else if (move == "look") {
                p.activeRoom.print();
            }
        } else {
            log("That is not a valid move");
        }
        document.getElementById("input").value = "";
        p.getPossibleMoves();
    }
});

class Item {
    constructor(options) {
        this.name = options.name;
        this.ref = options.ref;
    }
}
// Existing rooms
let map = [

    new Room({
     connections: {
         "north": null,
         "south": 38,
         "east": 1,
         "west": -1
     },
     name: "A Prairie",
     des: "The wind blows through stalks of grass. Animals prance at your feet. The ground is teeming with life.",
     items: [],
     mobs: [],
     id: 0
 })
    ,

    new Room({
     connections: {
         "north": null,
         "south": 39,
         "east": 2,
         "west": 0
     },
     name: "A forest",
     des: "A forest, birds bustling in the trees. You hear the caw of multiple birds. The ground is warm and the sun is shining.",
     items: [],
     mobs: [],
     id: 1
 })
    ,

    new Room({
     connections: {
         "north": null,
         "south": 40,
         "east": 3,
         "west": 1
     },
     name: "A forest",
     des: "The forest is teeming with life. You can hear the burble of a nearby river.",
     items: [],
     mobs: [],
     id: 2
 })
    ,

    new Room({
     connections: {
         "north": null,
         "south": 41,
         "east": 4,
         "west": 2
     },
     name: "A river",
     des: "You stand in the river, the water gushing between your legs. A small fish nibbles at your toes",
     items: [],
     mobs: [],
     id: 3
 })
    ,

    new Room({
     connections: {
         "north": null,
         "south": 42,
         "east": 5,
         "west": 3
     },
     name: "A river",
     des: "The river flows to the east. Sharp rocks hurt your feet. There are several small pools where crabs and other small creatures mingle.",
     items: [],
     mobs: [],
     id: 4
 })
    ,

    new Room({
     connections: {
         "north": null,
         "south": 43,
         "east": 6,
         "west": 4
     },
     name: "A river",
     des: "The river continues to the east, flowing down from the west. It is colder here, in the shade of the nearby mountains.m",
     items: [],
     mobs: [],
     id: 5
 })
    ,

    new Room({
     connections: {
         "north": null,
         "south": 44,
         "east": 7,
         "west": 5
     },
     name: "A river",
     des: "The river is speeding up here, cutting a deep swath through the land. You wade around, nearly losing your grip. The rushing noise drowns out everything else.",
     items: [],
     mobs: [],
     id: 6
 })
    ,

    new Room({
     connections: {
         "north": null,
         "south": 45,
         "east": 8,
         "west": 6
     },
     name: "A river",
     des: "The river meanders along, centuries of erosion evident along its banks.",
     items: [],
     mobs: [],
     id: 7
 })
    ,

    new Room({
     connections: {
         "north": null,
         "south": 46,
         "east": 9,
         "west": 7
     },
     name: "A rocky shore",
     des: "Small pebbles and rocks poke at your feet. Old shells of past crustaceans linger on the beach. Water from the river to the west rushes around the rocks, creating a tumbling, crashing sound that you can feel and hear, even when you plug your ears.",
     items: [],
     mobs: [],
     id: 8
 })
    ,

    new Room({
     connections: {
         "north": null,
         "south": 47,
         "east": 10,
         "west": 8
     },
     name: "A grassland",
     des: "The grass gives way to the west to some pebbles. The air is moist here, and it is harder to breathe.",
     items: [],
     mobs: [],
     id: 9
 })
    ,

    new Room({
     connections: {
         "north": null,
         "south": 48,
         "east": 11,
         "west": 9
     },
     name: "A grassland",
     des: "Flowers.",
     items: [],
     mobs: [],
     id: 10
 })
    ,

    new Room({
     connections: {
         "north": null,
         "south": 49,
         "east": 12,
         "west": 10
     },
     name: "A path",
     des: "The path ends abruptly here. The sun beats on your back, and the warm gravel you can feel through you moccasins.",
     items: [],
     mobs: [],
     id: 11
 })
    ,

    new Room({
     connections: {
         "north": 5,
         "south": 81,
         "east": 44,
         "west": 42
     },
     name: "A mountain",
     des: "The sheer faces of this mountain make it difficult to climb. The air is thinner here, but crisp and fresh. Your nose burns slightly with the biting wind.",
     items: [],
     mobs: [],
     id: 43
 })
    ,

    new Room({
     connections: {
         "north": 6,
         "south": 82,
         "east": 45,
         "west": 43
     },
     name: "A gorge",
     des: "A deep gorge has been cut away by the river. You stand on the top, with a watchful eye over the surroundings. To the north and west lies the river, cutting through the land. Somewhere, a wolf howls. The winds is biting at your skin.",
     items: [],
     mobs: [],
     id: 44
 })
    ,

    new Room({
     connections: {
         "north": 7,
         "south": 83,
         "east": 46,
         "west": 44
     },
     name: "A river",
     des: "The river is cutting through the mountains on either side, and has gained some speed. It nearly knocks you off your feet. It is cold. The sun is overhead.",
     items: [],
     mobs: [],
     id: 45
 })
    ,

    new Room({
     connections: {
         "north": 8,
         "south": 84,
         "east": 47,
         "west": 45
     },
     name: "A prairie",
     des: "The ever-present mosquito has found you again. You swipe at it. The sun beats down. The mosquito whines. The grass is very green here, testament to the river to the west.",
     items: [],
     mobs: [],
     id: 46
 })
    ,

    new Room({
     connections: {
         "north": 9,
         "south": 85,
         "east": 48,
         "west": 46
     },
     name: "An empty desert",
     des: "Sand stretches unimaginably far. In the distant south you can see some mist rising, and to the east, west, and north, some green grass.",
     items: [],
     mobs: [],
     id: 47
 })
    ,

    new Room({
     connections: {
         "north": 10,
         "south": 86,
         "east": 49,
         "west": 47
     },
     name: "A grassland",
     des: "The grass under your feet is soft and springy. Bees buzz around, pollinating flower after flower.",
     items: [],
     mobs: [],
     id: 48
 })
    ,

    new Room({
     connections: {
         "north": 11,
         "south": 87,
         "east": 50,
         "west": 48
     },
     name: "A path",
     des: "You are on a path. You crest a small hill and look in the distance, where the path seems to stretch forever north and south.",
     items: [],
     mobs: [],
     id: 49
 })
    ,

    new Room({
     connections: {
         "north": 43,
         "south": 119,
         "east": 82,
         "west": 80
     },
     name: "A grassland",
     des: "You are in a large swath of dirt, brought about by the frequent digging of moles. Around you there is grass, and you see some rabbits digging. A mole peeks its head up from a hole.",
     items: [],
     mobs: [],
     id: 81
 })
    ,

    new Room({
     connections: {
         "north": 44,
         "south": 120,
         "east": 83,
         "west": 81
     },
     name: "A prairie",
     des: "In the distance, a herd of buffalo can be seen. The land falls away in rolling hills, and a soft dew covers the whole scene with a vibrant color. The whistling of the wind is heard.",
     items: [],
     mobs: [],
     id: 82
 })
    ,

    new Room({
     connections: {
         "north": 45,
         "south": 121,
         "east": 84,
         "west": 82
     },
     name: "A river",
     des: "The river is running slowly. The mountains to the north give way to open prairie to the east and west.",
     items: [],
     mobs: [],
     id: 83
 })
    ,

    new Room({
     connections: {
         "north": 46,
         "south": 122,
         "east": 85,
         "west": 83
     },
     name: "A prairie",
     des: "The river to the west has made the ground here wet. The rich, moist earth bears much fruit: flowers of all kinds sprout ceaselessly from the ground. ",
     items: [],
     mobs: [],
     id: 84
 })
    ,

    new Room({
     connections: {
         "north": 47,
         "south": 123,
         "east": 86,
         "west": 84
     },
     name: "A spring",
     des: "A spring flowing from the east stop here, and seeps slowly into the group. Bugs a flitting across the surface of the pool.",
     items: [],
     mobs: [],
     id: 85
 })
    ,

    new Room({
     connections: {
         "north": 48,
         "south": 124,
         "east": 87,
         "west": 85
     },
     name: "A spring",
     des: "A spring of water bubbles gently from the ground. You take a sip of the refreshingly cool and crisp water.",
     items: [],
     mobs: [],
     id: 86
 })
    ,

    new Room({
     connections: {
         "north": 49,
         "south": 125,
         "east": 88,
         "west": 86
     },
     name: "A path",
     des: "This path seems to lead somewhere. The gravel is thin here, giving way to a dark red dirt.",
     items: [],
     mobs: [],
     id: 87
 })
    ,

    new Room({
     connections: {
         "north": 81,
         "south": 157,
         "east": 120,
         "west": 118
     },
     name: "A grassland",
     des: "The green from this grassland hurts your eyes it is so vibrant. Some rabbits hope over one another. A fox pops up in the distance, quietly observing you.",
     items: [],
     mobs: [],
     id: 119
 })
    ,

    new Room({
     connections: {
         "north": 82,
         "south": 158,
         "east": 121,
         "west": 119
     },
     name: "A lake",
     des: "You are in a lake. Treading water slowly, you notice that the lake is quite deep here. The water is a very deep blue.",
     items: [],
     mobs: [],
     id: 120
 })
    ,

    new Room({
     connections: {
         "north": 83,
         "south": 159,
         "east": 122,
         "west": 120
     },
     name: "A lake",
     des: "The river from the north flows into this deep reservoir of water. You are treading water. It is slightly cold, but refreshing. You feel kelp tickling your toes. A fish leaps at arms reach. ",
     items: [],
     mobs: [],
     id: 121
 })
    ,

    new Room({
     connections: {
         "north": 84,
         "south": 160,
         "east": 123,
         "west": 121
     },
     name: "A lake",
     des: "The lake is shallow here. You can feel the soft sand bottom. Something swims in between your legs. A bird is chirping, and to the east you can see some elks drinking the cool water.",
     items: [],
     mobs: [],
     id: 122
 })
    ,

    new Room({
     connections: {
         "north": 85,
         "south": 161,
         "east": 124,
         "west": 122
     },
     name: "A sandy shore",
     des: "You quietly watch some elks drink the water from the lake to the west. A mosquito is buzzing around, and the whine is ever-present.",
     items: [],
     mobs: [],
     id: 123
 })
    ,

    new Room({
     connections: {
         "north": 86,
         "south": 162,
         "east": 125,
         "west": 123
     },
     name: "A grassland",
     des: "A mosquito buzzes around your head. It is very distracting.",
     items: [],
     mobs: [],
     id: 124
 })
    ,

    new Room({
     connections: {
         "north": 87,
         "south": 163,
         "east": 126,
         "west": 124
     },
     name: "A path",
     des: "You are on a small path made of gravel. You can feel the rocks underneath your feet. ",
     items: [],
     mobs: [],
     id: 125
 })
    ,

    new Room({
     connections: {
         "north": 120,
         "south": 196,
         "east": 159,
         "west": 157
     },
     name: "A mountain",
     des: "This mountain has snow, and tracks can be seen in it, evidence of long past animals. You notice 4 different sets. A small trail of blood follows the tracks. Perhaps one of the animals was injured.",
     items: [],
     mobs: [],
     id: 158
 })
    ,

    new Room({
     connections: {
         "north": 121,
         "south": 197,
         "east": 160,
         "west": 158
     },
     name: "A sandy shore",
     des: "The mountains to the south and west loom ominously over this beach.",
     items: [],
     mobs: [],
     id: 159
 })
    ,

    new Room({
     connections: {
         "north": 122,
         "south": 198,
         "east": 161,
         "west": 159
     },
     name: "A shallow cave",
     des: "Centuries of erosion have built a shallow hollow in the mountains to the south. Inside, it is quiet and dark. You are shades from the bright sun, and take a small rest.",
     items: [],
     mobs: [],
     id: 160
 })
    ,

    new Room({
     connections: {
         "north": 123,
         "south": 199,
         "east": 162,
         "west": 160
     },
     name: "A sandy shore",
     des: "Small plants and grasses hold the sand in place here. The water from the northwest laps softly at the sand. A quiet melancholy permeates the scene.",
     items: [],
     mobs: [],
     id: 161
 })
    ,

    new Room({
     connections: {
         "north": 124,
         "south": 200,
         "east": 163,
         "west": 161
     },
     name: "A forest",
     des: "The forest is thinning here, giving way to the sandy shores to the west and the path to the east.",
     items: [],
     mobs: [],
     id: 162
 })
    ,

    new Room({
     connections: {
         "north": 158,
         "south": 234,
         "east": 197,
         "west": 195
     },
     name: "A mountain",
     des: "There is snow on this mountain. A large area of disturbed snow is present. 5 sets of tracks enter it from the east, and 4 exit to the north.",
     items: [],
     mobs: [],
     id: 196
 })
    ,

    new Room({
     connections: {
         "north": 159,
         "south": 235,
         "east": 198,
         "west": 196
     },
     name: "A mountain",
     des: "A small coat of snow covers this mountain. You can faintly make out some tracks heading west. A scraggly tree lords over an even more scraggly bush.",
     items: [],
     mobs: [],
     id: 197
 })
    ,

    new Room({
     connections: {
         "north": 160,
         "south": 236,
         "east": 199,
         "west": 197
     },
     name: "A mountain",
     des: "This mountain overlooks the lake. The beauty is breathtaking. A herd of elks drink on the east side of the lake. A couple buffalo can be faintly made out to the west of the river that feeds the lake. The mountain is steep and sheer. To the north it falls away into a small shallow.",
     items: [],
     mobs: [],
     id: 198
 })
    ,

    new Room({
     connections: {
         "north": 161,
         "south": 237,
         "east": 200,
         "west": 198
     },
     name: "A forest",
     des: "The gentle sounds of the forest can be heard. Birds chirp and flutter between the trees.",
     items: [],
     mobs: [],
     id: 199
 })
    ,

    new Room({
     connections: {
         "north": 162,
         "south": 238,
         "east": 201,
         "west": 199
     },
     name: "A forest",
     des: "You are in a small clearing of birch trees. The light diffuses through the leafs and dapples the ground. A bird perches on your head, then flies off quickly.",
     items: [],
     mobs: [],
     id: 200
 })
    ,
];
map[0].in.push(new Gregory());

map.forEach(r =>{
    if(Math.random() > 0.8){
        r.in.push(new NPC());
    }
    var spawn_items = Math.random();
    console.log(spawn_items, r.name.toLowerCase());
    if(r.name.toLowerCase().includes("forest") && spawn_items > 0.5){
        r.items.push(new Item({name: "berry", ref: "berries"}));
    }
    if(r.name.toLowerCase().includes("river") && spawn_items > 0.5){
        r.items.push(new Item({name: "fish", ref: "fish"}));
    }
    console.log(r.name.toLowerCase().includes("prairie"))
    if(r.name.toLowerCase().includes("prairie") && spawn_items > 0.5){
        var x = Math.random();
        if (x < 0.1) r.items.push(new Item({name: "flower", ref: "flowers"}));
        if (x >= 0.1 < 0.9) r.items.push(new Item({name: "berry", ref: "berries"}));
        if (x >= 0.98) r.items.push(new Item({name: "Sword Of Doom", ref: "sword_of_doom"}));
    }
    if(r.name.toLowerCase().includes("path") && spawn_items > 0.5){
        var x = Math.random();
        if (x < 0.5) r.items.push(new Item({name: "rock", ref: "rocks"}));
        if (x >= 0.5) r.items.push(new Item({name: "A satchel", ref: "trav_satchel"}));
    }
    if(r.name.toLowerCase().includes("shore") && spawn_items > 0.5){
        r.items.push(new Item({name: "shells", ref: "shell"}));
    }
    if(r.name.toLowerCase().includes("desert") && spawn_items > 0.5){
        r.items.push(new Item({name: "cactus", ref: "cactus"}));
    }
    if(r.name.toLowerCase().includes("grassland") && spawn_items > 0.5){
        r.items.push(new Item({name: "flower", ref: "flower"}));
        var int = Math.floor(Math.random() * 3);
        if(int == 0) r.items.push(new Item({name: "berry", ref: "berries"}));
        if(int == 1) r.items.push(new Item({name: "rocks", ref: "rocks"}));
        if(int == 2) {
            for(var i = 0; i < 3; i++){
                r.items.push(new Item({name: "berry", ref: "berries"}));
            }
        }
    }

});
setInterval(()=>{
    var room = map[Math.floor(Math.random() * map.length)];
    var action = Math.floor(Math.random() * 3);
    if(action == 0){
        room.in.push(new NPC());
    }
    if(action == 1){
        if(room.in[0] instanceof Gregory) return;
        var mobLeft = room.in.shift();
        if(p.activeRoom.uid == room.uid){
            log(`${mobLeft.name} has left`);
        }
    }
    if(action == 2){
        if(room.name.toLowerCase().includes("forest") || room.name.toLowerCase().includes("prairie") || room.name.toLowerCase().includes("grassland") || room.name.toLowerCase().includes("path")){
            room.items.push(new Item({name: "berry", ref: "berries"}));
        }
        var generics = ["rock", "fish", "bone", "strip of leather","stick","sword","shield","helmet","cast iron pan","whistle","coca-cola","toothpaste","pile of sand","juice","skull","leaf","flower"];
        var generic = generics[Math.floor(Math.random() * generics.length)];
        room.items.push(new Item({name: generic, ref: generic}));
    }
},1000);

log("<h1>Welcome to the game</h1>");
log("Remember to talk to the locals");
log("Available commands listed in the input");
var p = new Player({ start: map[0] });
