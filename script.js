
(function setup(window) {
    var document = window.document;
    Object.prototype.on = function(a, b) {
        this.addEventListener(a, b);
        return this;
    };
    Object.prototype.off = function(a, b) {
        this.removeEventListener(a, b);
        return this;
    };
    Array.prototype.remove = function(x) {
        let a = [];
        for (let i in this)
            if (i != x)
                a.push(this[i]);
        return a;
    };
    window.can = document.querySelector("canvas");
    window.ctx = window.can.getContext("2d");
    window.can.width = window.innerWidth;
    window.can.height = window.innerHeight;
    window.randInt = function(a, b) {
        if (a === void 0) return Math.round(Math.random());
        else if (b === void 0) return Math.floor(Math.random() * a);
        else return Math.floor(Math.random() * (b - a + 1) + a);
    };
    window.randFloat = function(a, b) {
        if (a === void 0) return Math.random();
        else if (b === void 0) return Math.random() * a;
        else return Math.random() * (b - a) + a;
    };
    window.rand = function(a, b) {
        return Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : window.randInt(a, b);
    };
}(window));

(function play(gameover) {
    can.style.cursor = "none";
    var mouse = {
        x: can.width / 2,
        y: -can.height
    };
    var player = {
        x: can.width / 2,
        y: can.height / 2,
        s: 20,
        mx: 0,
        my: 0,
        a: 0,
        d: 1,
        speed: 3,
        lives: 3,
        zombiesKilled: 0
    };
    var wordList =[
        "banana", "orange", "strawberry", "pineapple", "watermelon", "blueberry", "raspberry", "kiwi", "mango", "papaya", // Fruits
        "peach", "plum", "apricot", "nectarine", "guava", "dragonfruit", "passionfruit", "fig", "persimmon", "lychee", // Additional Fruits
        "rose", "lily", "tulip", "daisy", "orchid", "carnation", "sunflower", "peon", "hydrangea", "chrysanthemum", // Flowers
        "camellia", "azalea", "bougainvillea", "daffodil", "hibiscus", "magnolia", "petunia", "wisteria", "zinnia", "freesia", // Additional Flowers
        "dog", "cat", "horse", "elephant", "giraffe", "cheetah", "rhinoceros", "hippopotamus", "kangaroo", "koala", "panda", // Animals
        "actor", "actress", "comedian", "director", "musician", // Performers
        "writer", "painter", "sculptor", "designer", "dancer", "singer", "photographer", "architect","choreographer", // Additional Performers
        "name", "label", "term", "token", "text", "note", "item", "group", "point", "datum", // Labels
        "mark", "role", "part", "mode", "tone", "form", "sign", "rate", "view", "step", // Additional Labels
        "moon", "star", "planet", "galaxy", "asteroid", "comet", "nebula", "quasar", "cosmos", "universe", // Space terms
        "orbit", "gravity", "meteor", "astronaut", "telescope", "constellation", "supernova", "black hole", "eclipse", "celestial", // Additional Space terms
        "code", "algorithm", "database", "interface", "framework", "repository", "encryption", "authentication", "algorithm", "variable", // Tech terms
        "function", "iteration", "syntax", "debugging", "optimization", "backend", "frontend", "server", "client", "endpoint", // Additional Tech terms
        "mountain", "valley", "canyon", "plateau", "glacier", "volcano", "tundra", "savanna", "oasis", "island", // Geography terms
        "peninsula", "archipelago", "isthmus", "delta", "atoll", "fjord", "lagoon", "rift valley", "escarpment", "badlands", // Additional Geography terms
        "philosophy", "psychology", "sociology", "anthropology", "economics", "political science", "biology", "chemistry", "physics", "astronomy", // Academic disciplines
        "geology", "meteorology", "linguistics", "literature", "history", "art history", "archaeology", "computer science", "engineering", "medicine", // Additional Academic disciplines
        "shahrukh khan", "amitabh bachchan", "salman khan", "aamir khan", "priyanka chopra", // Bollywood stars
        "deepika padukone", "ranbir kapoor", "alia bhatt", "varun dhawan", "akshay kumar", // Additional Bollywood stars
        "tom cruise", "angelina jolie", "brad pitt", "leonardo dicaprio", "scarlett johansson", // Hollywood stars
        "johnny depp", "meryl streep", "robert downey jr", "jennifer lawrence", "dwayne johnson", // Additional Hollywood stars
        "saturn", "jupiter", "mars", "venus", "mercury", "neptune", "uranus", "earth", "pluto", "ceres", // Planets and dwarf planets
        "europa", "ganymede", "callisto", "titan", "io", "enceladus", "mimas", "phoebe", "hyperion", "iapetus", // Moons and satellites
        "lionel messi", "cristiano ronaldo", "neymar", "luis suarez", "virat kohli", // Football and cricket players
        "rohit sharma", "ms dhoni", "sachin tendulkar", "abdul kalam", "barack obama", // Famous people
        "snehasish","satyajit","aditya","suraj","rahul","soumya","spandan","surya","satyam","pratik","sankar","shuvendu","priyansu",//friends's name
        "nelson mandela", "marie curie", "albert einstein", "stephen hawking", "mother teresa", // Additional famous people
        "krishna", "goddess durga", "ganesh", "binayak","goddess lakshmi","jagannath", // Hindu gods and goddesses
        "jeff bezos", "elon musk", "warren buffett", "bill gates", "mark zuckerberg", // Richest persons
        "bernard arnault", "mukesh ambani", "steve ballmer", "larry ellison", "larry page" // Additional richest persons
    ];

    var zombies = [];
    var inputText = '';
    var maxZombies = 4;

    var Zombie = function() {
        let s = rand(20, 30);
        let speed = randFloat(0.4,0.5);
        let position = rand(0, 3);
        let x, y;

        if (position === 0) {
            x = -s;
            y = rand(0, can.height);
        } else if (position === 1) {
            x = can.width + s;
            y = rand(0, can.height);
        } else if (position === 2) {
            x = rand(0, can.width);
            y = -s;
        } else {
            x = rand(0, can.width);
            y = can.height + s;
        }

        let word = wordList[rand(0, wordList.length - 1)];
        return {
            x: x,
            y: y,
            s: s,
            word: word,
            color: [rand(50, 100), rand(100, 150), rand(50)],
            speed: speed,
            shot: false,
            shotProgress: 0
        };
    };

    var spawnZombie = function() {
        if (zombies.length < maxZombies) {
            zombies.push(new Zombie());
        }
    };

    var shadow = {
        apply: function() {
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = -10;
            ctx.shadowOffsetY = 10;
        },
        reset: function() {
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
    };
    var frames = 0;
    (function update() {
        ctx.beginPath();
        ctx.clearRect(0, 0, can.width, can.height);
        ctx.shadowColor = "black";
        shadow.reset();

        if (!gameover) {
            ctx.strokeStyle = "black";
            let p = player;
            let a = Math.atan2(mouse.y - p.y, mouse.x - p.x);
            ctx.beginPath();
            ctx.lineWidth = p.s / 10;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "rgb(150, 100, 50)";
            ctx.arc(p.x, p.y, p.s, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            shadow.reset();

            // Update and draw zombies
            for (let i in zombies) {
                let z = zombies[i];
                a = Math.atan2(player.y - z.y, player.x - z.x);
                ctx.beginPath();
                shadow.apply();
                ctx.lineWidth = z.s / 10;
                ctx.fillStyle = "rgb(" + z.color + ")";
                ctx.arc(z.x, z.y, z.s, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = z.s + "px roboto mono";
                ctx.fillText(z.word, z.x, z.y - z.s * 2);
                z.x += Math.cos(a) * z.speed;
                z.y += Math.sin(a) * z.speed;

                // Draw shooting animation
                if (z.shot) {
                    let dx = z.x - player.x;
                    let dy = z.y - player.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let progress = Math.min(1, z.shotProgress / distance);

                    let shotX = player.x + dx * progress;
                    let shotY = player.y + dy * progress;

                    ctx.beginPath();
                    ctx.strokeStyle = "red";
                    ctx.lineWidth = 2;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(shotX, shotY);
                    ctx.stroke();

                    z.shotProgress += 30; // Increase the progress

                    if (progress >= 1) {
                        zombies.splice(i, 1); // Remove the zombie when shot reaches it
                        player.zombiesKilled++;
                    }
                }
            }

            // Spawn new zombies at a controlled interval
            spawnZombie();

            // Check if the player collides with any zombie
            for (let i in zombies) {
                let z = zombies[i];
                if (player.x + player.s > z.x - z.s &&
                    player.x - player.s < z.x + z.s &&
                    player.y + player.s > z.y - z.s &&
                    player.y - player.s < z.y + z.s) {
                    player.lives--;
                    if (player.lives < 0) {
                        gameover = true;
                    } else {
                        zombies[i] = new Zombie();
                    }
                }
            }

            ctx.beginPath();
            for (let i = 0; i < player.lives; i++) {
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.fillStyle = "red";
                ctx.arc(i * 20 + 10, 10, 10, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.font = "20px roboto mono";
            ctx.fillText("Lives: " + player.lives, 0, 20);
            ctx.fillText("Enemy Killed: " + player.zombiesKilled, 0, 40);

            // Display current input
            ctx.beginPath();
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fillRect(0, can.height - 40, can.width, 40); // Clear previous input display
            ctx.fillStyle = "black";
            ctx.font = "20px roboto mono";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText("Input: " + inputText, 10, can.height - 20);

        } else {
            can.style.cursor = "default";
            ctx.beginPath();
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, can.width, can.height);
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.font = "100px creepster";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("YOU DIED ! " + (player.zombiesKilled === 0 ? "No" : player.zombiesKilled.toLocaleString()) + " Enemies" + (player.zombiesKilled === 1 ? " Killed" : " killed "), can.width / 2, can.height / 2);

            ctx.font = "50px creepster";
            ctx.fillText("PRESS ENTER TO RESTART", can.width / 2, 0.75 * can.height);
        }

        frames++;
        requestAnimationFrame(update);
    }());

    window.on("resize", function() {
        can.width = this.innerWidth;
        can.height = this.innerHeight;
    });

    window.on("keydown", function(e) {
        if (gameover) {
            if (e.which === 13) { // Enter key to restart
                play(false);
            }
        } else {
            if (e.key === 'Backspace') {
                inputText = inputText.slice(0, -1); // Allow backspace to correct input
            } else if (e.key.length === 1) {
                inputText += e.key;
            }

            let found = false;
            for (let i = 0; i < zombies.length; i++) {
                let zombie = zombies[i];
                if (inputText.toLowerCase() === zombie.word.toLowerCase()) {
                    zombie.shot = true; // Trigger shooting animation
                    zombie.shotProgress = 0; // Reset shot progress
                    found = true;
                    break;
                }
            }

            if (found || e.key === 'Backspace') {
                inputText = ''; // Clear input after successful shot or backspace
            }
        }
    });

    can.on("mousemove", function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
}(false));
