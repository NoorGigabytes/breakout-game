import React, { useEffect, useRef } from "react";
import { BallMovement } from "./BallMovement";
import data from "../data";
import WallCollision from "../utils/WallCollision";
import Paddle from "./Paddle";
import Brick from "./Brick";
import BrickCollision from "../utils/BrickCollision";
import PaddleHit from "../utils/PaddleHit";
import PlayerStats from "./PlayerStats";
import AllBroken from "../utils/AllBroken";
import ResetBall from "../utils/ResetBall";

let { ballObj, paddleProps, brickObj, player } = data;
let bricks = []

export default function Breakout() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      paddleProps.y = canvas.height -30

      let newBrickSet = Brick(player.level, bricks, canvas, brickObj);

      if(newBrickSet && newBrickSet.length > 0) {
        bricks = newBrickSet;
      };

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      PlayerStats(ctx, player, canvas);

      if(player.lives === 0){
        alert('GAME OVER! Press ok to restart')
        player.lives = 5;
        player.level = 1;
        player.score = 0;
        ResetBall(ballObj, canvas, paddleProps)
        bricks.length = 0;
      }
      
      bricks.map((brick) => {
        return brick.draw(ctx);
      });

      BallMovement(ctx, ballObj);

      AllBroken(bricks, player, canvas, ballObj);

      WallCollision(ballObj, canvas, player, paddleProps);

      let brickCollision;
      for(let i=0; i<bricks.length; i++){
        brickCollision = BrickCollision(ballObj, bricks[i]);
        if (brickCollision.hit && !bricks[i].broke) {
            if (brickCollision.axis === 'X'){
                ballObj.dx *= -1;
                bricks[i].broke = true;
            } else if (brickCollision.axis === 'Y'){
                ballObj.dy *= -1;
                bricks[i].broke = true;
            }
            player.score += 10
        }
      }

      Paddle(ctx, canvas, paddleProps);

      PaddleHit(ballObj, paddleProps)

      requestAnimationFrame(render);
    };
    render();
  }, []);

  return (
    <canvas
      id="canvas"
      ref={canvasRef}
      onMouseMove={(event) =>
        (paddleProps.x =
          event.clientX -
          (window.innerWidth < 900 ? 10 : (window.innerWidth * 20) / 200) -
          paddleProps.width / 2 -
          10)
      }
      height="500"
      width={
        window.innerWidth < 900
          ? window.innerWidth - 20
          : window.innerWidth - (window.innerWidth * 20) / 100
      }
    />
  );
}
