'use client'
import { useRef, useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

export default function ColoringApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        ctxRef.current = ctx;

        // Load predefined image
        const image = new Image();
        image.src = "/1.png"; // Replace with actual image path
        image.onload = () => {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          setImageLoaded(true);
        };
      }
    }
  }, [color]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !ctxRef.current || !imageLoaded) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current || !imageLoaded) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (ctxRef.current) {
      ctxRef.current.closePath();
    }
    setIsDrawing(false);
  };

  const floodFill = (x: number, y: number, fillColor: string) => {
    if (!canvasRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const stack = [[x, y]];
    const targetColor = getPixelColor(x, y, data, canvas.width);
    if (targetColor === fillColor) return;

    while (stack.length) {
      const [px, py] = stack.pop()!;
      const currentColor = getPixelColor(px, py, data, canvas.width);
      if (currentColor !== targetColor) continue;
      setPixelColor(px, py, fillColor, data, canvas.width);
      stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const getPixelColor = (x: number, y: number, data: Uint8ClampedArray, width: number) => {
    const index = (y * width + x) * 4;
    return `rgb(${data[index]}, ${data[index + 1]}, ${data[index + 2]})`;
  };

  const setPixelColor = (x: number, y: number, fillColor: string, data: Uint8ClampedArray, width: number) => {
    const index = (y * width + x) * 4;
    const [r, g, b] = fillColor.match(/\d+/g)!.map(Number);
    data[index] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = 255;
  };

  const handleFill = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = Math.floor(e.nativeEvent.offsetX);
    const y = Math.floor(e.nativeEvent.offsetY);
    floodFill(x, y, color);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <HexColorPicker color={color} onChange={setColor} />
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="border-2 border-black mt-4"
        onMouseDown={handleFill}
      />
      <button className="mt-4 p-2 bg-red-500 text-white rounded" onClick={() => setIsDrawing(false)}>Use Fill Tool</button>
    </div>
  );
}

