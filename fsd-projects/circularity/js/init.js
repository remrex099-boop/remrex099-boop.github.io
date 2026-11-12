var init = function (window) {
    'use strict';
    var 
        draw = window.opspark.draw,
        physikz = window.opspark.racket.physikz,
        
        app = window.opspark.makeApp(),
        canvas = app.canvas, 
        view = app.view,
        fps = draw.fps('#e37f7f');
        
    
    window.opspark.makeGame = function() {
        
        window.opspark.game = {};
        var game = window.opspark.game;
        
        ///////////////////
        // PROGRAM SETUP //
        ///////////////////
        
        // TODO 1 : Declare and initialize our variables

var circles = [];
var mouseForceRadius = 140;
var maxCircleSpeed = 450;

// TODO 2 : Create a function that draws a circle
function drawCircle() {
    var circle = draw.randomCircleInArea(canvas, true, true, "#29284f", 2);
    physikz.addRandomVelocity(circle, canvas, 5, 5);
    view.addChild(circle);
    circles.push(circle);
}


        // TODO 3 : Call the drawCircle() function



        // TODO 7 : Use a loop to create multiple circles
        for (var i = 0; i < 50; i++) {
            drawCircle();
        }



        ///////////////////
        // PROGRAM LOGIC //
        ///////////////////
        
        /* 
        This Function is called 60 times/second, producing 60 frames/second.
        In each frame, for every circle, it should redraw that circle
        and check to see if it has drifted off the screen.         
        */
        function update() {
            // TODO 4 : Update the position of each circle using physikz.updatePosition()
            for (var i = 0; i < circles.length; i++) {
                var circle = circles[i];
                var stage = app.stage;
                if (stage && stage.mouseInBounds) {
                    var dx = circle.x - stage.mouseX;
                    var dy = circle.y - stage.mouseY;
                    var distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseForceRadius) {
                        if (distance === 0) {
                            dx = 1;
                            distance = 1;
                        }

                        var force = (1 - distance / mouseForceRadius) * 0.35;
                        circle.velocityX += dx / distance * force;
                        circle.velocityY += dy / distance * force;

                        var speed = Math.sqrt(circle.velocityX * circle.velocityX + circle.velocityY * circle.velocityY);
                        if (speed > maxCircleSpeed) {
                            circle.velocityX = circle.velocityX / speed * maxCircleSpeed;
                            circle.velocityY = circle.velocityY / speed * maxCircleSpeed;
                        }
                    }
                }

                physikz.updatePosition(circle);
                game.checkCirclePosition(circle);
            }
            
            // TODO 5 : Call game.checkCirclePosition() on your circles
           

            // TODO 8 / TODO 9 : Iterate over the array
           
            
        }
    
        /* 
        This Function should check the position of a circle that is passed to the 
        Function. If that circle drifts off the screen, this Function should move
        it to the opposite side of the screen.
        */
        game.checkCirclePosition = function(circle) {
            var minX = circle.radius;
            var maxX = canvas.width - circle.radius;
            var minY = circle.radius;
            var maxY = canvas.height - circle.radius;

            if (maxX < minX) {
                circle.x = canvas.width / 2;
                circle.velocityX = 0;
            } else {
                while (circle.x > maxX || circle.x < minX) {
                    if (circle.x > maxX) {
                        circle.x = maxX - (circle.x - maxX);
                        circle.velocityX = -Math.abs(circle.velocityX || 0);
                    } else {
                        circle.x = minX + (minX - circle.x);
                        circle.velocityX = Math.abs(circle.velocityX || 0);
                    }
                }
            }

            if (maxY < minY) {
                circle.y = canvas.height / 2;
                circle.velocityY = 0;
            } else {
                while (circle.y > maxY || circle.y < minY) {
                    if (circle.y > maxY) {
                        circle.y = maxY - (circle.y - maxY);
                        circle.velocityY = -Math.abs(circle.velocityY || 0);
                    } else {
                        circle.y = minY + (minY - circle.y);
                        circle.velocityY = Math.abs(circle.velocityY || 0);
                    }
                }
            }
        }
        
        /////////////////////////////////////////////////////////////
        // --- NO CODE BELOW HERE  --- DO NOT REMOVE THIS CODE --- //
        /////////////////////////////////////////////////////////////
        
        view.addChild(fps);
        app.addUpdateable(fps);
        
        game.circles = circles;
        game.drawCircle = drawCircle;
        game.update = update;
        
        app.addUpdateable(window.opspark.game);
    }
};

// DO NOT REMOVE THIS CODE //////////////////////////////////////////////////////
if((typeof process !== 'undefined') &&
    (typeof process.versions.node !== 'undefined')) {
    // here, export any references you need for tests //
    module.exports = init;
}
