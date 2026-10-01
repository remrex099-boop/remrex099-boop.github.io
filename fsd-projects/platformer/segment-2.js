window.platformerSegment2 = {
  spawnColor: "white",
  checkpointColor: "blue",
  platforms: [
    { x: 70, y: 270, width: 60, height: 20, color: "red", kill: true },
     { x: 170, y: 290, width: 55, height: 20, color: "white" },
  ],
  collectables: [
    { type: "database", x: 700, y: 430 },
    { type: "diamond", x: 1290, y: 690, gravity: 0, bounce: 1 },
    { type: "grace", x: 260, y: 420 },
  ],
};
