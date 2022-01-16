var conn, Qkey, Wkey, Ekey, Rkey, SPACEkey, music, button_blue, button_red, button_yellow, button_green, screenCenterX, screenCenterY, player1_label, player2_label, config, game, player1_name, player2_name, toastmessage, Relec, Yelec, Gelec, Belec, player1_power_button, player2_power_button, sleigh, sleigh_flame, sleigh_group, shadow, sleigh_hover_animate, gameobj, progressBar, progressBox, percentText, progressTarget, roomId, intro_scroll, intro_scroll_header, scroll_bg, intro_scroll_text, intro_scroll_button, single_player_mode = !1, username = "", music_start_time = 0, music_notes_tween_time = 1950, music_notes = [], musical_notes = [], redx_offset = 65, yellowx_offset = 168, greenx_offset = 728, bluex_offset = 835, xoffsets = [redx_offset, yellowx_offset, greenx_offset, bluex_offset], xtrans = {
    rd: 0,
    yd: 1,
    gd: 2,
    bd: 3
}, player1_power_button_on = !1, player2_power_button_on = !1, game_done = !1, game_being_destroyed = !1, dont_change_me_for_real = !1, last_update_time = 0, resourceId = "";
const average = e=>e.reduce((e,t)=>e + t) / e.length;
var spi;
function SetProgressBar(e) {
    progressBox.clear(),
    progressBox.fillStyle(6656, .8),
    progressBox.fillRect(240, 270, 320, 50),
    percentText.setText("Fuel: " + Math.min(100, Math.max(0, parseInt(100 * e))) + "% Jolly"),
    progressTarget.clear(),
    progressTarget.fillStyle(10092441, .2),
    progressTarget.fillRect(250, 280, 240, 30),
    progressBar.clear(),
    progressBar.fillStyle(10092441, 1),
    progressBar.fillRect(250, 280, Math.min(300, Math.max(1, 300 * e)), 30)
}
spi = setInterval(function() {
    single_player_mode && (clearInterval(spi),
    player2_label.showMessage("P2: COMPUTER (On)"),
    player2_power_button.anims.play("power_on"),
    toastmessage.showMessage("Player 2 (COMPUTER) has joined!"),
    player2_power_button.anims.pause())
}, 100);
class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: "examples"
        })
    }
    preload() {
        this.load.scenePlugin({
            key: "rexuiplugin",
            url: "../assets/js/rexuiplugin.min.js",
            sceneKey: "rexUI"
        }),
        this.load.plugin("rexbbcodetextplugin", "../assets/js/rexbbcodetextplugin.min.js", !0),
        this.load.plugin("rextexteditplugin", "../assets/js/rextexteditplugin.min.js", !0),
        this.load.spritesheet("buttons", "../assets/imgs/buttons_spritesheet_lettered.png", {
            frameWidth: 142,
            frameHeight: 110
        }),
        this.load.audio("8bitjinglebells", ["../assets/audio/song.ogg"]),
        this.load.image("console", "../assets/imgs/tubes/console.png"),
        this.load.image("rtube1", "../assets/imgs/tubes/rtube1.png"),
        this.load.image("ytube1", "../assets/imgs/tubes/ytube1.png"),
        this.load.image("gtube1", "../assets/imgs/tubes/gtube1.png"),
        this.load.image("btube1", "../assets/imgs/tubes/btube1.png"),
        this.load.spritesheet("electricity", "../assets/imgs/elect/elec_spritesheet_small_alt.png", {
            frameWidth: 597,
            frameHeight: 137
        }),
        this.load.spritesheet("power_button", "../assets/imgs/toggle.png", {
            frameWidth: 632,
            frameHeight: 276
        }),
        this.load.spritesheet("music_note", "../assets/imgs/musical_note.png", {
            frameWidth: 652,
            frameHeight: 652
        }),
        this.load.spritesheet("sleigh", "../assets/imgs/sleigh/sleigh_sprite.png", {
            frameWidth: 397,
            frameHeight: 174
        }),
        this.load.spritesheet("sleigh_flame", "../assets/imgs/sleigh/flame_spritesheet.png", {
            frameWidth: 432,
            frameHeight: 144
        }),
        this.load.image("roof_top", "../assets/imgs/roof_top.jpg"),
        this.load.image("shadow", "../assets/imgs/sleigh/shadow.png"),
        this.load.image("note_off", "../assets/imgs/note/orb_off.png"),
        this.load.spritesheet("note_on", "../assets/imgs/note/electrical_ball.png", {
            frameWidth: 512,
            frameHeight: 512
        }),
        this.load.image("intro_scroll", "../assets/imgs/scroll.png")
    }
    create() {
        gameobj = this,
        screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2,
        screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2,
        this.add.image(0, 0, "roof_top").setOrigin(0, 0),
        sleigh_group = this.add.group(),
        (shadow = this.add.image(screenCenterX, screenCenterY + 50, "shadow")).setOrigin(.5, .5),
        (sleigh = this.physics.add.staticSprite(screenCenterX, screenCenterY, "sleigh")).setOrigin(.5, .5),
        this.anims.create({
            key: "sleigh_full",
            frames: this.anims.generateFrameNumbers("sleigh", {
                frames: [0, 1, 2, 3, 3, 2, 1, 0]
            }),
            frameRate: 8,
            repeat: -1
        }),
        this.anims.create({
            key: "sleigh_small",
            frames: this.anims.generateFrameNumbers("sleigh", {
                frames: [0, 1]
            }),
            frameRate: 2,
            repeat: -1
        }),
        this.anims.create({
            key: "sleigh_mid",
            frames: this.anims.generateFrameNumbers("sleigh", {
                frames: [0, 1, 2, 2, 1, 0]
            }),
            frameRate: 4,
            repeat: -1
        });
        let e = sleigh.getCenter();
        (sleigh_flame = this.physics.add.staticSprite(e.x + sleigh.displayWidth / 2 - 13, e.y - sleigh.displayHeight / 2 + 27, "sleigh_flame")).setOrigin(0, .5),
        sleigh_flame.scale = .3,
        sleigh_flame.setFrame(24),
        this.anims.create({
            key: "sleigh_flame_full",
            frames: this.anims.generateFrameNumbers("sleigh_flame", {
                start: 0,
                end: 24
            }),
            frameRate: 8,
            repeat: -1
        }),
        this.anims.create({
            key: "sleigh_flame_small",
            frames: this.anims.generateFrameNumbers("sleigh_flame", {
                frames: [24, 0, 1, 1, 0, 24, 24, 24, 24, 24, 24, 0, 1, 1, 1, 0, 24, 24, 0, 1, 1, 1, 24, 24, 24, 24]
            }),
            frameRate: 12,
            repeat: -1
        }),
        this.anims.create({
            key: "sleigh_flame_mid",
            frames: this.anims.generateFrameNumbers("sleigh_flame", {
                frames: [24, 0, 1, 2, 3, 4, 5, 6, 7, 0, 24, 24, 24, 24, 24, 24]
            }),
            frameRate: 12,
            repeat: -1
        }),
        sleigh_group.add(sleigh),
        sleigh_group.add(sleigh_flame),
        sleigh_hover_animate = (()=>{
            var e, t, s, a, n, r;
            sleigh_flame.anims.play("sleigh_flame_full"),
            sleigh.anims.play("sleigh_full"),
            e = this.tweens.create({
                targets: sleigh_group.getChildren(),
                y: "-=100",
                x: "-=0",
                duration: 1e3,
                onComplete: function() {
                    s.play()
                }
            }),
            s = this.tweens.create({
                targets: [shadow, ...sleigh_group.getChildren()],
                y: "-=3",
                x: "+=3",
                duration: 400,
                onComplete: function() {
                    a.play()
                }
            }),
            a = this.tweens.create({
                targets: [shadow, ...sleigh_group.getChildren()],
                y: "-=3",
                x: "-=3",
                duration: 400,
                onComplete: function() {
                    n.play()
                }
            }),
            n = this.tweens.create({
                targets: [shadow, ...sleigh_group.getChildren()],
                y: "+=3",
                x: "-=3",
                duration: 400,
                onComplete: function() {
                    r.play()
                }
            }),
            r = this.tweens.create({
                targets: [shadow, ...sleigh_group.getChildren()],
                y: "+=3",
                x: "+=3",
                duration: 400,
                onComplete: function() {
                    s.play()
                }
            }),
            t = this.tweens.create({
                targets: [shadow],
                scale: .7,
                duration: 1e3,
                onComplete: function() {}
            }),
            e.play(),
            t.play()
        }
        ),
        this.anims.create({
            key: "note_on",
            frames: this.anims.generateFrameNumbers("note_on", {
                frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            }),
            frameRate: 12,
            repeat: -1
        });
        for (var t = 0; t < music_notes.length; t++)
            musical_notes.push({
                sprite: this.physics.add.sprite(xoffsets[xtrans[music_notes[t].k]], -36, "note_off"),
                started: !1,
                play_time: 0,
                tween: null,
                rtween: null,
                hit: !1
            }),
            musical_notes[t].play_time = music_notes[t].t / 2 * 1e3 - music_notes_tween_time,
            musical_notes[t].tween = this.tweens.create({
                targets: musical_notes[t].sprite,
                y: 550,
                x: "-=0",
                duration: music_notes_tween_time + music_notes_tween_time * (130 / 456),
                onComplete: function(e) {
                    e.targets[0].destroy()
                }
            }),
            musical_notes[t].rtween = this.tweens.create({
                targets: musical_notes[t].sprite,
                angle: 360,
                duration: 1500,
                loop: -1,
                onComplete: function() {}
            }),
            musical_notes[t].sprite.setOrigin(.5, .5),
            musical_notes[t].sprite.scale = .24;
        var s, a;
        this.add.image(20, -47, "rtube1").setOrigin(0, 0).scale = .75,
        this.add.image(123, -47, "ytube1").setOrigin(0, 0).scale = .75,
        this.add.image(683, -47, "gtube1").setOrigin(0, 0).scale = .75,
        this.add.image(790, -47, "btube1").setOrigin(0, 0).scale = .75,
        this.add.image(0, 500, "console").setOrigin(0, 0).scale = 1.2,
        this.add.image(2 * screenCenterX, 500, "console").setOrigin(1, 0).scale = 1.2,
        (player1_power_button = this.physics.add.staticSprite(118, 653, "power_button")).setInteractive(),
        player1_power_button.scale = .095,
        player1_power_button.on("pointerup", function(e) {
            !player1_power_button_on && conn && username == player1_name && (conn.send(JSON.stringify({
                u: username,
                d: {
                    r: !0
                }
            })),
            player1_power_button_on = !0,
            player1_label.setText("P1: " + player1_name + (player1_power_button_on ? " (On)" : " (Off)")),
            player1_power_button.anims.play("power_on"),
            player1_power_button.anims.pause())
        }),
        (player2_power_button = this.physics.add.staticSprite(783, 653, "power_button")).setInteractive(),
        player2_power_button.scale = .095,
        player2_power_button.on("pointerup", function(e) {
            !player2_power_button_on && conn && username == player2_name && (conn.send(JSON.stringify({
                u: username,
                d: {
                    r: !0
                }
            })),
            player2_power_button_on = !0,
            player2_label.setText("P2: " + player2_name + (player2_power_button_on ? " (On)" : " (Off)")),
            player2_power_button.anims.play("power_on"),
            player2_power_button.anims.pause())
        }),
        this.anims.create({
            key: "power_on",
            frames: this.anims.generateFrameNumbers("power_button", {
                frames: [1]
            }),
            frameRate: 1,
            repeat: -1
        }),
        this.anims.create({
            key: "power_off",
            frames: this.anims.generateFrameNumbers("power_button", {
                frames: [0]
            }),
            frameRate: 1,
            repeat: -1
        }),
        (Relec = this.physics.add.staticSprite(65, 420, "electricity")).setOrigin(.5, .5),
        Relec.displayHeight = 50,
        Relec.displayWidth = 120,
        this.anims.create({
            key: "electricity",
            frames: this.anims.generateFrameNumbers("electricity", {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 12,
            repeat: 0
        }),
        Relec.on("animationcomplete", function() {
            Relec.setFrame(0)
        }),
        (Yelec = this.physics.add.staticSprite(168, 420, "electricity")).setOrigin(.5, .5),
        Yelec.displayHeight = 50,
        Yelec.displayWidth = 120,
        this.anims.create({
            key: "electricity",
            frames: this.anims.generateFrameNumbers("electricity", {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 12,
            repeat: 0
        }),
        Yelec.on("animationcomplete", function() {
            Yelec.setFrame(0)
        }),
        (Gelec = this.physics.add.staticSprite(728, 420, "electricity")).setOrigin(.5, .5),
        Gelec.displayHeight = 50,
        Gelec.displayWidth = 120,
        this.anims.create({
            key: "electricity",
            frames: this.anims.generateFrameNumbers("electricity", {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 12,
            repeat: 0
        }),
        Gelec.on("animationcomplete", function() {
            Gelec.setFrame(0)
        }),
        (Belec = this.physics.add.staticSprite(836, 420, "electricity")).setOrigin(.5, .5),
        Belec.displayHeight = 50,
        Belec.displayWidth = 120,
        this.anims.create({
            key: "electricity",
            frames: this.anims.generateFrameNumbers("electricity", {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 12,
            repeat: 0
        }),
        Belec.on("animationcomplete", function() {
            Belec.setFrame(0)
        }),
        (button_red = this.physics.add.staticSprite(80, 550, "buttons")).scale = .5,
        this.anims.create({
            key: "button_red_down",
            frames: this.anims.generateFrameNumbers("buttons", {
                frames: [4]
            }),
            frameRate: 1,
            repeat: -1
        }),
        this.anims.create({
            key: "button_red_up",
            frames: this.anims.generateFrameNumbers("buttons", {
                frames: [0]
            }),
            frameRate: 1,
            repeat: -1
        }),
        (Qkey = this.input.keyboard.addKey("q")).on("down", function(e) {
            username == player1_name && (conn && conn.send(JSON.stringify({
                u: username,
                d: {
                    k: "rd"
                }
            })),
            CheckIfNoteHit("rd"),
            Relec.anims.play("electricity"),
            button_red.anims.play("button_red_down"),
            button_red.anims.pause())
        }),
        Qkey.on("up", function(e) {
            username == player1_name && (conn && conn.send(JSON.stringify({
                u: username,
                d: {
                    k: "ru"
                }
            })),
            button_red.anims.play("button_red_up"),
            button_red.anims.pause())
        }),
        button_yellow = this.physics.add.staticSprite(160, 550, "buttons"),
        this.anims.create({
            key: "button_yellow_down",
            frames: this.anims.generateFrameNumbers("buttons", {
                frames: [5]
            }),
            frameRate: 1,
            repeat: -1
        }),
        button_yellow.scale = .5,
        this.anims.create({
            key: "button_yellow_up",
            frames: this.anims.generateFrameNumbers("buttons", {
                frames: [1]
            }),
            frameRate: 1,
            repeat: -1
        }),
        (Wkey = this.input.keyboard.addKey("w")).on("down", function(e) {
            username == player1_name && (conn && conn.send(JSON.stringify({
                u: username,
                d: {
                    k: "yd"
                }
            })),
            CheckIfNoteHit("yd"),
            Yelec.anims.play("electricity"),
            button_yellow.anims.play("button_yellow_down"),
            button_yellow.anims.pause())
        }),
        Wkey.on("up", function(e) {
            username == player1_name && (conn && conn.send(JSON.stringify({
                u: username,
                d: {
                    k: "yu"
                }
            })),
            button_yellow.anims.play("button_yellow_up"),
            button_yellow.anims.pause())
        }),
        button_yellow.anims.play("button_yellow_up"),
        button_yellow.anims.pause(),
        button_green = this.physics.add.staticSprite(740, 550, "buttons"),
        this.anims.create({
            key: "button_green_down",
            frames: this.anims.generateFrameNumbers("buttons", {
                frames: [6]
            }),
            frameRate: 1,
            repeat: -1
        }),
        button_green.scale = .5,
        this.anims.create({
            key: "button_green_up",
            frames: this.anims.generateFrameNumbers("buttons", {
                frames: [2]
            }),
            frameRate: 1,
            repeat: -1
        }),
        (Ekey = this.input.keyboard.addKey("e")).on("down", function(e) {
            username == player2_name && (conn && conn.send(JSON.stringify({
                u: username,
                d: {
                    k: "gd"
                }
            })),
            CheckIfNoteHit("gd"),
            Gelec.anims.play("electricity"),
            button_green.anims.play("button_green_down"),
            button_green.anims.pause())
        }),
        Ekey.on("up", function(e) {
            username == player2_name && (conn && conn.send(JSON.stringify({
                u: username,
                d: {
                    k: "gu"
                }
            })),
            button_green.anims.play("button_green_up"),
            button_green.anims.pause())
        }),
        button_green.anims.play("button_green_up"),
        button_green.anims.pause(),
        (button_blue = this.physics.add.staticSprite(820, 550, "buttons")).scale = .5,
        this.anims.create({
            key: "button_blue_down",
            frames: this.anims.generateFrameNumbers("buttons", {
                frames: [7]
            }),
            frameRate: 1,
            repeat: -1
        }),
        this.anims.create({
            key: "button_blue_up",
            frames: this.anims.generateFrameNumbers("buttons", {
                frames: [3]
            }),
            frameRate: 1,
            repeat: -1
        }),
        (Rkey = this.input.keyboard.addKey("r")).on("down", function(e) {
            username == player2_name && (conn && conn.send(JSON.stringify({
                u: username,
                d: {
                    k: "bd"
                }
            })),
            CheckIfNoteHit("bd"),
            Belec.anims.play("electricity"),
            button_blue.anims.play("button_blue_down"),
            button_blue.anims.pause())
        }),
        Rkey.on("up", function(e) {
            username == player2_name && (conn && conn.send(JSON.stringify({
                u: username,
                d: {
                    k: "bu"
                }
            })),
            button_blue.anims.play("button_blue_up"),
            button_blue.anims.pause())
        }),
        button_blue.anims.play("button_blue_up"),
        button_blue.anims.pause(),
        (music = this.sound.add("8bitjinglebells", {
            mute: !1,
            volume: .1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: !1,
            delay: 0
        })).once("play", function(e) {}),
        this.sound.pauseOnBlur = !1,
        (SPACEkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)).on("up", function(e) {}),
        player1_label = this.rexUI.add.toast({
            x: 0,
            y: 0,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, "#404040"),
            text: this.add.text(0, 0, "", {
                fontSize: "20px"
            }),
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            },
            duration: {
                in: 200,
                hold: 99999e3,
                out: 200
            }
        }).setTransitOutCallback(function(e, t) {}).setOrigin(0, 0),
        player2_label = this.rexUI.add.toast({
            x: 2 * screenCenterX,
            y: 0,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, "#404040"),
            text: this.add.text(0, 0, "", {
                fontSize: "20px"
            }),
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            },
            duration: {
                in: 200,
                hold: 99999e3,
                out: 200
            }
        }).setTransitOutCallback(function(e, t) {}).setOrigin(1, 0),
        s = setInterval(function() {
            player1_name && (clearInterval(s),
            player1_label.showMessage("P1: " + player1_name + (player1_power_button_on ? " (On)" : " (Off)")))
        }, 100),
        a = setInterval(function() {
            player2_name && (clearInterval(a),
            player2_label.showMessage("P2: " + player2_name + (player2_power_button_on ? " (On)" : " (Off)")),
            single_player_mode || username === player2_name || (toastmessage.displayTime = 2e3,
            toastmessage.showMessage(`Player 2 (${player2_name}) has joined!`)))
        }, 100),
        progressBox = this.add.graphics(),
        progressBar = this.add.graphics(),
        (progressTarget = this.add.graphics()).setPosition(50, 350),
        progressBar.setPosition(50, 350),
        progressBox.setPosition(50, 350),
        percentText = this.make.text({
            x: screenCenterX,
            y: 645,
            text: "0%",
            style: {
                font: "22px monospace",
                fill: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6
            }
        }),
        this.make.text({
            x: screenCenterX + 85,
            y: 660,
            text: "^",
            style: {
                font: "18px monospace",
                fill: "#ffffff"
            }
        }),
        percentText.setOrigin(.5, .5),
        SetProgressBar(0),
        roomId && roomId.startsWith("c_") && this.make.text({
            x: screenCenterX,
            y: 10,
            text: "Join Code: " + roomId,
            style: {
                font: "20px monospace",
                fill: "#ffffff",
                stroke: "#4396a7",
                strokeThickness: 4
            }
        }).setOrigin(.5, .5),
        (scroll_bg = this.add.graphics()).setPosition(0, 0),
        scroll_bg.clear(),
        scroll_bg.fillStyle(16777215, .6),
        scroll_bg.fillRect(0, 0, 900, 700),
        (intro_scroll = this.add.image(screenCenterX, screenCenterY, "intro_scroll")).setOrigin(.5, .5);
        (intro_scroll_text = this.add.text(screenCenterX, screenCenterY, ["We upgraded Santa's sleigh and need you to fuel it with ", "jolly-charged musical notes.", "", "Two players are required to electrically charge musical", "notes using the two refuel consoles.", "", "Player 1 can charge red and yellow musical notes using", "the Q and W keys.", "Player 2 can charge green and blue musical notes using", "the E and R keys.", "", "Pressing any key at the wrong time depletes fuel.", "", "Santa's sleigh requires at least an 80% fuel level.", "", "Close this scroll and then click the ON/OFF button on ", "your console when you're ready.", "", "", "Thanks,", "Alabaster Snowball"], {
            font: "20px monospace",
            color: "#000000"
        })).setOrigin(.5, .5),
        (intro_scroll_header = this.make.text({
            x: screenCenterX,
            y: 50,
            text: "",
            style: {
                font: "20px monospace",
                fill: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6
            }
        })).setOrigin(.5, .5),
        (intro_scroll_button = this.add.text(screenCenterX, 590, "CLOSE", {
            fontSize: "30px",
            fill: "#0f0",
            fontFamily: "monospace",
            stroke: "#000000",
            strokeThickness: 6
        }).setOrigin(.5)).setInteractive(),
        intro_scroll_button.on("pointerover", ()=>{
            intro_scroll_button.setStyle({
                fill: "#ff0"
            })
        }
        ),
        intro_scroll_button.on("pointerout", ()=>{
            intro_scroll_button.setStyle({
                fill: "#0f0"
            })
        }
        ),
        intro_scroll_button.on("pointerup", ()=>{
            intro_scroll_button.destroy(),
            intro_scroll.destroy(),
            intro_scroll_text.destroy(),
            intro_scroll_header.destroy(),
            scroll_bg.destroy(),
            player1_name != username || player2_name || single_player_mode || (toastmessage.displayTime = 3e3,
            toastmessage.showMessage("Waiting for a second player"))
        }
        ),
        toastmessage = this.rexUI.add.toast({
            x: screenCenterX,
            y: 1.5 * screenCenterY,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, "#404040"),
            text: this.add.text(0, 0, "", {
                fontSize: "32px"
            }),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20
            },
            duration: {
                in: 200,
                hold: 1700,
                out: 200
            }
        }).setTransitOutCallback(function(e, t) {}).setOrigin(.5, .5)
    }
    update(e) {
        var t = e - last_update_time;
        if (last_update_time = e,
        0 != music_start_time && !game_done) {
            let e = 1e3 * music.seek + Math.ceil(t) + 1;
            for (var s = 0; s < musical_notes.length; s++)
                single_player_mode && musical_notes[s].started && !musical_notes[s].hit && musical_notes[s].sprite.getCenter().y >= 415 && ["gd", "bd"].includes(music_notes[s].k) && (musical_notes[s].hit = !0,
                conn.send(JSON.stringify({
                    u: username,
                    d: {
                        k: music_notes[s].k
                    }
                })),
                "gd" == music_notes[s].k ? (Gelec.anims.play("electricity"),
                button_green.anims.play("button_green_down"),
                button_green.anims.pause(),
                setTimeout(function() {
                    button_green.anims.play("button_green_up"),
                    button_green.anims.pause()
                }, 200)) : (Belec.anims.play("electricity"),
                button_blue.anims.play("button_blue_down"),
                button_blue.anims.pause(),
                setTimeout(function() {
                    button_blue.anims.play("button_blue_up"),
                    button_blue.anims.pause()
                }, 200)),
                musical_notes[s].rtween.play(),
                musical_notes[s].sprite.anims.play("note_on")),
                !musical_notes[s].started && e > musical_notes[s].play_time && (musical_notes[s].started = !0,
                musical_notes[s].tween.play())
        }
    }
}
function CheckIfNoteHit(e, t=1) {
    for (var s = 0; s < musical_notes.length; s++)
        if (music_notes[s].k == e && musical_notes[s].sprite.active && !musical_notes[s].hit) {
            let e = musical_notes[s].sprite.getCenter()
              , a = 58.461538 * t;
            if (e.y < 420 + a && e.y > 420 - a) {
                musical_notes[s].hit = !0,
                musical_notes[s].rtween.play(),
                musical_notes[s].sprite.anims.play("note_on");
                break
            }
        }
}
function escapeHTML(e) {
    return e.replace(/[\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u00FF]/g, e=>"&#" + ("000" + e.charCodeAt(0)).substr(-4, 4) + ";")
}
$(document).ready(function() {
    document.addEventListener("visibilitychange", ()=>{
        dont_change_me_for_real || (document.hidden && !game_done ? (game_done = !0,
        music && music.isPlaying && music.stop(),
        toastmessage.displayTime = 99999e3,
        toastmessage.showMessage("Game Over - Window Lost Focus!"),
        conn && (conn.onclose = function() {}
        ,
        conn.close(),
        conn = null)) : game && !game_being_destroyed && (game_being_destroyed = !0,
        setTimeout(function() {
            game.destroy(),
            game = null
        }, 400)))
    }
    );
    var e = new URL(window.location.href)
      , t = e.searchParams.get("username")
      , s = e.searchParams.get("id");
    if (s && s.length && (resourceId = s),
    t && t.length)
        username = t;
    else {
        let e = ["aboard", "above", "acres", "act", "active", "actual", "add", "adult", "advice", "afraid", "ago", "ahead", "air", "alike", "all", "almost", "along", "also", "am", "amount", "angle", "animal", "ants", "apple", "area", "army", "arrive", "art", "as", "ask", "at", "atomic", "attack", "author", "avoid", "away", "back", "badly", "bank", "bare", "barn", "basis", "bat", "be", "bear", "became", "become", "bee", "before", "being", "bell", "below", "bend", "bent", "best", "better", "beyond", "bigger", "bill", "birth", "bit", "black", "blind", "blood", "blue", "boat", "bone", "border", "both", "bottom", "bow", "box", "brain", "brass", "bread", "breeze", "bridge", "bright", "broad", "broken", "brush", "build", "built", "burn", "bus", "but", "buy", "cabin", "cake", "calm", "camera", "can", "cannot", "carbon", "care", "carry", "cast", "cat", "cattle", "cause", "cell", "center", "chair", "chance", "charge", "check", "child", "choice", "chose", "church", "circus", "city", "clay", "clear", "clock", "cloth", "club", "coal", "coat", "cold", "color", "come", "coming", "common", "cook", "cool", "copy", "corner", "cotton", "count", "couple", "course", "cover", "cowboy", "cream", "crop", "crowd", "cup", "damage", "danger", "dark", "date", "dawn", "dead", "dear", "decide", "deep", "deer", "degree", "depth", "desert", "desk", "die", "dig", "direct", "dirty", "divide", "do", "does", "doing", "dollar", "donkey", "dot", "doubt", "dozen", "drawn", "dress", "dried", "drive", "driver", "drop", "drove", "duck", "dug", "during", "duty", "eager", "earn", "easier", "east", "eat", "edge", "effect", "egg", "either", "else", "end", "energy", "enough", "entire", "every", "exact", "exist", "eye", "facing", "factor", "failed", "fairly", "fallen", "family", "far", "farmer", "fast", "faster", "father", "fear", "feed", "feet", "fellow", "fence", "fewer", "fierce", "fifth", "fight", "figure", "film", "fine", "finger", "fire", "firm", "fish", "fix", "flame", "flew", "flight", "floor", "flower", "fog", "follow", "foot", "for", "forget", "former", "forth", "found", "fourth", "frame", "fresh", "frog", "front", "fruit", "full", "fun", "funny", "future", "game", "garden", "gather", "gentle", "get", "giant", "girl", "given", "glad", "globe", "goes", "golden", "good", "got", "graph", "great", "green", "ground", "grow", "growth", "guess", "gulf", "habit", "hair", "hand", "happen", "harbor", "harder", "has", "have", "hay", "headed", "health", "heat", "height", "hello", "herd", "hide", "higher", "him", "his", "hit", "hole", "home", "hope", "horse", "hot", "house", "human", "hung", "hunt", "hurt", "ice", "ill", "in", "income", "indeed", "inside", "is", "it", "itself", "jar", "job", "joined", "joy", "jump", "just", "kept", "kids", "kind", "knew", "know", "known", "labor", "lady", "lake", "land", "large", "late", "laugh", "lay", "lead", "leaf", "least", "leave", "led", "leg", "lesson", "letter", "life", "light", "likely", "line", "lips", "list", "little", "living", "local", "lonely", "longer", "loose", "loss", "lot", "love", "low", "luck", "lunch", "lying", "made", "magnet", "main", "major", "making", "map", "market", "mass", "master", "may", "me", "mean", "meant", "meat", "meet", "member", "men", "merely", "metal", "mice", "might", "mile", "milk", "mind", "mirror", "mix", "model", "money", "month", "moon", "mostly", "motion", "mouth", "moving", "muscle", "my", "name", "nature", "nearby", "needed", "needs", "never", "news", "next", "night", "no", "nodded", "none", "nor", "nose", "note", "noun", "number", "nuts", "ocean", "off", "office", "old", "oldest", "once", "only", "open", "orange", "order", "origin", "other", "our", "out", "over", "owner", "pack", "page", "pain", "pair", "pale", "paper", "park", "parts", "pass", "past", "peace", "pencil", "per", "person", "pet", "pick", "piece", "pile", "pine", "pipe", "place", "plan", "planet", "plates", "plural", "pocket", "poet", "point", "police", "pony", "poor", "port", "pot", "pound", "powder", "press", "pretty", "pride", "prize", "proper", "proud", "pull", "pure", "put", "rabbit", "radio", "rain", "ran", "range", "rate", "raw", "reach", "reader", "real", "rear", "recall", "recent", "red", "remain", "repeat", "rest", "return", "rhyme", "rice", "ride", "right", "rise", "river", "roar", "rocket", "rod", "roof", "root", "rose", "round", "row", "rubber", "ruler", "sad", "safe", "said", "sale", "salt", "sand", "sat", "saved", "say", "scared", "school", "score", "sea", "season", "second", "seed", "seems", "seldom", "send", "sent", "shadow", "share", "she", "sheet", "shells", "shine", "ship", "shoe", "shop", "short", "shot", "show", "shut", "sides", "sign", "silk", "silver", "simple", "simply", "sing", "sink", "sit", "size", "skin", "slabs", "sleep", "slide", "slow", "small", "smile", "smooth", "snow", "soap", "softly", "solar", "some", "song", "sort", "source", "speak", "speech", "spell", "spent", "spin", "spite", "spoken", "spread", "square", "stairs", "stared", "state", "steady", "steel", "stems", "stiff", "stock", "stone", "stop", "store", "story", "stream", "strike", "strip", "stuck", "such", "sum", "sun", "supper", "sure", "swam", "swept", "swung", "symbol", "table", "take", "tales", "tall", "tape", "taste", "tax", "teach", "team", "teeth", "tent", "than", "that", "them", "then", "there", "these", "thick", "thing", "third", "this", "thou", "thread", "threw", "throw", "thumb", "thy", "tie", "time", "tiny", "tired", "to", "today", "told", "tone", "took", "top", "torn", "touch", "tower", "toy", "track", "train", "trap", "trick", "trip", "truck", "truth", "tube", "turn", "twenty", "two", "under", "union", "unless", "upon", "upward", "use", "using", "vapor", "view", "visit", "voice", "vote", "voyage", "wait", "wall", "war", "warn", "wash", "watch", "wave", "we", "wealth", "weigh", "went", "west", "wet", "what", "wheat", "when", "where", "while", "who", "whom", "why", "widely", "wild", "wind", "wing", "wire", "wish", "within", "wolf", "won", "wooden", "word", "work", "world", "worry", "worth", "writer", "wrote", "year", "yes", "yet", "young", "your", "youth", "zoo"];
        username = e[Math.floor(Math.random() * e.length)] + (Math.random() + 1).toString(36).substring(10)
    }
    if (window.WebSocket) {
        const e = window.location.href.split("/");
        roomId = e[e.length - 1].split("?")[0];
        let t = "ws://";
        "http:" !== window.location.protocol && (t = "wss://"),
        (conn = new WebSocket(t + window.location.href.split("/").slice(2, 3).join("/") + "/ws/" + roomId + "?username=" + username + "&id=" + resourceId)).onerror = function(e) {
            document.write("<h1 style='color: white; text-align: center; text-shadow: 3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; -webkit-text-stroke: 1px black; '>Websocket error likely caused by invalid cookie or being in incognito mode.</h1>")
        }
        ,
        conn.onclose = function(e) {
            game_done = !0,
            music && music.isPlaying && music.stop(),
            toastmessage.displayTime = 99999e3,
            toastmessage.showMessage("Game Over - Server/Player Disconnect!"),
            conn = null,
            dont_change_me_for_real = !1
        }
        ,
        conn.onmessage = function(e) {
            if (e && e.data) {
                var t;
                try {
                    t = JSON.parse(e.data)
                } catch (e) {
                    console.log(e)
                }
                if (t && t.u && t.d)
                    if ("_server" === t.u) {
                        if (t.d.users && t.d.keys) {
                            var s = ()=>{
                                t.d.users.p1 && t.d.users.p1.length && (player1_name = t.d.users.p1),
                                t.d.users.p2 && t.d.users.p2.length && (player2_name = t.d.users.p2),
                                intro_scroll_header.active && intro_scroll_header.setText("Welcome, Player " + (username == player1_name ? "1" : "2") + " ( " + username + " )"),
                                t.d.users.p2r && (player2_power_button_on = !0,
                                player2_power_button.anims.play("power_on"),
                                player2_power_button.anims.pause(),
                                player2_label.setText("P2: " + player2_name + (player2_power_button_on ? " (On)" : " (Off)"))),
                                t.d.users.p1r && (player1_power_button_on = !0,
                                player1_power_button.anims.play("power_on"),
                                player1_power_button.anims.pause(),
                                player1_label.setText("P1: " + player1_name + (player1_power_button_on ? " (On)" : " (Off)")))
                            }
                            ;
                            game ? s() : (music_notes = t.d.keys,
                            config = {
                                type: Phaser.AUTO,
                                parent: "phaser-example",
                                width: 900,
                                height: 700,
                                backgroundColor: "#ccefff",
                                scale: {
                                    mode: Phaser.Scale.FIT,
                                    autoCenter: Phaser.Scale.CENTER_BOTH
                                },
                                physics: {
                                    default: "arcade",
                                    arcade: {
                                        gravity: {
                                            y: 0,
                                            x: 0
                                        },
                                        debug: !1
                                    }
                                },
                                dom: {
                                    createContainer: !0
                                },
                                scene: Demo
                            },
                            (game = new Phaser.Game(config)).scene.loadComplete = function(e) {
                                this.create(e.scene),
                                s()
                            }
                            )
                        } else if (t.d.s && 1 == t.d.s)
                            music_start_time = Date.now(),
                            music.play();
                        else if (t.d.ping && "number" == typeof t.d.pct) {
                            SetProgressBar(t.d.pct);
                            var a = sleigh.anims.getName();
                            t.d.pct > .8 ? "sleigh_full" !== a && (sleigh.anims.play("sleigh_full"),
                            sleigh_flame.anims.play("sleigh_flame_full")) : t.d.pct > .4 ? "sleigh_mid" !== a && (sleigh.anims.play("sleigh_mid"),
                            sleigh_flame.anims.play("sleigh_flame_mid")) : t.d.pct > .2 && "sleigh_small" !== a && (sleigh.anims.play("sleigh_small"),
                            sleigh_flame.anims.play("sleigh_flame_small")),
                            conn.send(JSON.stringify({
                                u: username,
                                d: {
                                    pong: t.d.ping
                                }
                            }))
                        } else if ((0 == t.d.e || 1 == t.d.e) && "number" == typeof t.d.pct) {
                            if (game_done = !0,
                            -1 === t.d.pct)
                                return toastmessage.displayTime = 99999e3,
                                toastmessage.showMessage("5-Min Timeout to Start Reached!"),
                                void (dont_change_me_for_real = !1);
                            t.d.hhc && t.d.hhc.hash && t.d.hhc.resourceId && __POST_RESULTS__(t.d.hhc),
                            music && music.isPlaying && music.stop(),
                            SetProgressBar(t.d.pct);
                            let e = Math.min(100, Math.max(0, parseInt(100 * t.d.pct)))
                              , s = `Sleigh Refuel Failure! (${e}%)`;
                            e >= 80 ? (sleigh_hover_animate(),
                            s = `Sleigh Refuel Success! (${e}%)`) : (sleigh_flame.setFrame(24),
                            sleigh.setFrame(0)),
                            toastmessage.displayTime = 99999e3,
                            toastmessage.showMessage(s),
                            dont_change_me_for_real = !1
                        }
                    } else if (t.d.k && ["rd", "yd", "gd", "bd", "ru", "yu", "gu", "bu"].includes(t.d.k))
                        switch (t.d.k) {
                        case "rd":
                            t.u == player1_name && (CheckIfNoteHit(t.d.k, delay_modifier = 1.2),
                            Relec.anims.play("electricity"),
                            button_red.anims.play("button_red_down"),
                            button_red.anims.pause());
                            break;
                        case "yd":
                            t.u == player1_name && (CheckIfNoteHit(t.d.k, delay_modifier = 1.2),
                            Yelec.anims.play("electricity"),
                            button_yellow.anims.play("button_yellow_down"),
                            button_yellow.anims.pause());
                            break;
                        case "gd":
                            t.u == player2_name && (CheckIfNoteHit(t.d.k, delay_modifier = 1.2),
                            Gelec.anims.play("electricity"),
                            button_green.anims.play("button_green_down"),
                            button_green.anims.pause());
                            break;
                        case "bd":
                            t.u == player2_name && (CheckIfNoteHit(t.d.k, delay_modifier = 1.2),
                            Belec.anims.play("electricity"),
                            button_blue.anims.play("button_blue_down"),
                            button_blue.anims.pause());
                            break;
                        case "ru":
                            t.u == player1_name && (button_red.anims.play("button_red_up"),
                            button_red.anims.pause());
                            break;
                        case "yu":
                            t.u == player1_name && (button_yellow.anims.play("button_yellow_up"),
                            button_yellow.anims.pause());
                            break;
                        case "gu":
                            t.u == player2_name && (button_green.anims.play("button_green_up"),
                            button_green.anims.pause());
                            break;
                        case "bu":
                            t.u == player2_name && (button_blue.anims.play("button_blue_up"),
                            button_blue.anims.pause())
                        }
                    else
                        t.d.r && (t.u == player2_name ? (player2_power_button_on = !0,
                        player2_power_button.anims.play("power_on"),
                        player2_power_button.anims.pause(),
                        player2_label.setText("P2: " + player2_name + (player2_power_button_on ? " (On)" : " (Off)"))) : (player1_power_button_on = !0,
                        player1_power_button.anims.play("power_on"),
                        player1_power_button.anims.pause(),
                        player1_label.setText("P1: " + player1_name + (player1_power_button_on ? " (On)" : " (Off)"))))
            }
        }
    } else
        document.write("<h1 style='color: white; text-align: center; text-shadow: 3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; -webkit-text-stroke: 1px black; '>You're browser doesn't support websockets!.</h1>")
});
