$(function () {
  let topCannonStarted = false;
  let cannonBeam = null;
  let blueCheckpointPlatform = null;
  let restartingLevel = false;
  // initialize canvas and context when able to
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  window.addEventListener("load", loadJson);

  function setup() {
    const segment = Number(
      new URL(window.location.href).searchParams.get("segment") || 1,
    );
    const segment2Layout = segment === 2 ? window.platformerSegment2 : null;
    if (firstTimeSetup) {
      if (segment2Layout) {
        gravity = -Math.abs(gravity);
        playerJumpStrength = -Math.abs(playerJumpStrength);

        const resolveCollisionWithNormalGravity = resolveCollision;
        resolveCollision = function (x, y, width, height) {
          const collisionDirection = resolveCollisionWithNormalGravity(
            x,
            y,
            width,
            height,
          );
          if (collisionDirection === "bottom") {
            player.onGround = true;
          } else if (collisionDirection === "top") {
            player.onGround = false;
          }
          return collisionDirection;
        };

        const drawRobotWithNormalOrientation = drawRobot;
        drawRobot = function () {
          const spriteTop = player.y - hitDy;
          ctx.save();
          ctx.translate(0, spriteTop * 2 + player.height);
          ctx.scale(1, -1);
          drawRobotWithNormalOrientation();
          ctx.restore();
        };
      }

      if (segment > 1) {
        document.body.style.filter = "invert(1)";
      }

      halleImage = document.getElementById("player");
      projectileImage = document.getElementById("projectile");
      cannonImage = document.getElementById("cannon");
      const platformImage = document.getElementById("blue-platform-image");
      function positionPlatformImage() {
        const canvasRect = canvas.getBoundingClientRect();
        const platformX = 220;
        const platformY = 490;
        const imageHeight = 52;

        platformImage.style.left = `${canvasRect.left + platformX + 32}px`;
        platformImage.style.top = `${canvasRect.top + platformY - imageHeight + 10}px`;
      }

      if (platformImage) {
        platformImage.addEventListener("click", function () {
          alert("WHY ARE YOU TRYING TO RUIN EVERYTHING I'VE WORKED FOR");
          if (!topCannonStarted) {
            createCannon("top", 100, 1000, 24, 24, 100, 1300, 5);
            const beamWidth = 8;
            const movingCannon = cannons[cannons.length - 1];
            createBadPlatform(
              movingCannon.x - cannonWidth / 2 - beamWidth / 2,
              cannonHeight,
              beamWidth,
              canvas.height - cannonHeight,
              "#ff3333",
            );
            cannonBeam = badPlatforms[badPlatforms.length - 1];
            setInterval(function () {
              cannonBeam.x = movingCannon.x - cannonWidth / 2 - beamWidth / 2;
            }, 1000 / frameRate);
            topCannonStarted = true;
          }
          canvas.style.setProperty(
            "background-color",
            "rgb(102, 27, 27)",
            "important",
          );
          platforms = platforms.filter(function (platform) {
            return platform.color !== "green" && platform.color !== "orange";
          });
          platforms.forEach(function (platform) {
            platform.color = "black";
          });
          canvas.style.backgroundImage =
            'url("https://www.image2url.com/r2/default/images/1790709659315-99be84db-09d0-46ea-99bb-228303808e22.webp")';
          canvas.style.backgroundRepeat = "no-repeat";
          canvas.style.backgroundSize = "cover";
          canvas.style.backgroundPosition = "center 120%";
          canvas.style.transition = "background-position 5s ease-out";
          requestAnimationFrame(function () {
            canvas.style.backgroundPosition = "center 50%";
          });
        });

        window.addEventListener("resize", positionPlatformImage);
        positionPlatformImage();

        setInterval(function () {
          if (
            blueCheckpointPlatform &&
            player.onGround &&
            player.x + hitBoxWidth > blueCheckpointPlatform.x &&
            player.x <
              blueCheckpointPlatform.x + blueCheckpointPlatform.width &&
            Math.abs(
              gravity < 0
                ? player.y -
                    (blueCheckpointPlatform.y + blueCheckpointPlatform.height)
                : player.y + hitBoxHeight - blueCheckpointPlatform.y,
            ) <= 2
          ) {
            sessionStorage.setItem(
              "checkpointX",
              String(
                blueCheckpointPlatform.x +
                  (blueCheckpointPlatform.width - hitBoxWidth) / 2,
              ),
            );
            sessionStorage.setItem(
              "checkpointY",
              String(
                gravity < 0
                  ? blueCheckpointPlatform.y + blueCheckpointPlatform.height
                  : blueCheckpointPlatform.y - hitBoxHeight,
              ),
            );
          }
          if (
            currentAnimationType === animationTypes.frontDeath &&
            cannonBeam &&
            player.x + hitBoxWidth > cannonBeam.x &&
            player.x < cannonBeam.x + cannonBeam.width &&
            player.y < cannonBeam.y + cannonBeam.height &&
            player.y + hitBoxHeight > cannonBeam.y
          ) {
            sessionStorage.setItem("respawnOnCheckpoint", "true");
          }
          if (player.y > canvas.height + 50) {
            if (segment === 1) {
              if (!restartingLevel) {
                restartingLevel = true;
                sessionStorage.removeItem("checkpointX");
                sessionStorage.removeItem("checkpointY");
                sessionStorage.removeItem("respawnOnCheckpoint");
                window.location.reload();
              }
              return;
            }
            player.x = 50;
            player.y = 100;
            player.speedX = 0;
            player.speedY = 0;
            player.onGround = false;
          }
        }, 1000 / frameRate);
      }

      $(document).on("keydown", handleKeyDown);
      $(document).on("keyup", handleKeyUp);
      firstTimeSetup = false;
      //start game
      setInterval(main, 1000 / frameRate);
    }

    // Create walls - do not delete or modify this code
    createPlatform(-50, -50, canvas.width + 100, 50); // top wall

    createPlatform(-50, canvas.height - 10, 280, 200, "rgb(255, 0, 0)"); // bottom wall

    //////////////////////////////////
    // ONLY CHANGE BELOW THIS POINT //
    //////////////////////////////////

    toggleGrid();

    if (segment2Layout) {
      segment2Layout.platforms.forEach(function (platform) {
        if (platform.kill) {
          createBadPlatform(
            platform.x,
            platform.y,
            platform.width,
            platform.height,
            platform.color || "red",
          );
        } else {
          createPlatform(
            platform.x,
            platform.y,
            platform.width,
            platform.height,
            platform.color,
            platform.minX,
            platform.maxX,
            platform.speedX,
            platform.minY,
            platform.maxY,
            platform.speedY,
          );
        }
      });
    } else {
      // Example platforms
      createPlatform(150, 700, 120, 20, "red");
      createPlatform(250, 700, 120, 20, "green");
      createPlatform(420, 670, 120, 20, "orange");
      createPlatform(620, 560, 105, 20, "purple");
      createPlatform(220, 490, 140, 20, "blue");
      createPlatform(420, 520, 110, 20, "grey");
      createPlatform(820, 500, 70, 20, "grey");
      createPlatform(979, 510, 50, 20, "grey");
      createPlatform(1200, 630, 50, 20, "grey");
      createPlatform(1120, 540, 50, 20, "green");
      createPlatform(1200, 740, 250, 20, "grey");
    }

    blueCheckpointPlatform = [...platforms].reverse().find(function (platform) {
      return (
        platform.color ===
        (segment2Layout ? segment2Layout.checkpointColor : "blue")
      );
    });
    const spawnPlatform = [...platforms].reverse().find(function (platform) {
      return (
        platform.color === (segment2Layout ? segment2Layout.spawnColor : "red")
      );
    });
    const purpleSpawnX =
      spawnPlatform.x + (spawnPlatform.width - hitBoxWidth) / 2;
    const purpleSpawnY = segment2Layout
      ? spawnPlatform.y + spawnPlatform.height
      : spawnPlatform.y - hitBoxHeight;

    if (sessionStorage.getItem("respawnOnCheckpoint") === "true") {
      const savedCheckpointX = sessionStorage.getItem("checkpointX");
      const savedCheckpointY = sessionStorage.getItem("checkpointY");
      player.x =
        savedCheckpointX === null ? purpleSpawnX : Number(savedCheckpointX);
      player.y =
        savedCheckpointY === null ? purpleSpawnY : Number(savedCheckpointY);
      sessionStorage.removeItem("respawnOnCheckpoint");
    } else {
      player.x = purpleSpawnX;
      player.y = purpleSpawnY;
      sessionStorage.setItem("checkpointX", String(purpleSpawnX));
      sessionStorage.setItem("checkpointY", String(purpleSpawnY));
    }
    player.speedX = 0;
    player.speedY = 0;
    player.onGround = false;

    // TODO 3 - Create Collectables
    if (segment2Layout) {
      segment2Layout.collectables.forEach(function (collectable) {
        createCollectable(
          collectable.type,
          collectable.x,
          collectable.y,
          collectable.gravity,
          collectable.bounce,
          collectable.minX,
          collectable.maxX,
          collectable.speed,
        );
      });
    } else {
      //createCollectable("Name", xPos, yPos, GravitNumber, BounceNumber, minX, maxX, speed)
      //createCollectable("Name", xPos, yPos, GravitNumber, BounceNumber)
      //createCollectable("Name", xPos, yPos)
      createCollectable("database", 700, 430);
      createCollectable("diamond", 1290, 690, 0, 1);
      createCollectable("grace", 260, 420);
    }
    // TODO 4 - Create Cannons
    //createCannon("top bottom left right", position, timeBetweenShots, BulletWidth, BulletHeight, minCannonPos, maxCannonPos, cannonSpeed)
    //createCannon("top bottom left right", position, timeBetweenShots, BulletWidth, BulletHeight)
    //createCannon("top bottom left right", position, timeBetweenShots)

    //////////////////////////////////
    // ONLY CHANGE ABOVE THIS POINT //
    //////////////////////////////////
  }

  registerSetup(setup);
});
