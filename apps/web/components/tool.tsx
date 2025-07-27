'use client'
import React from 'react'

interface ShapeSelectorProps {
  selectedShape: string;
  onShapeChange: (shape: string) => void;
}

export default function ShapeSelector({ selectedShape, onShapeChange }: ShapeSelectorProps) {
  return (
    <div className="absolute top-4 left-4 z-50 bg-white p-2 rounded-xl shadow-md flex gap-4">
      <button
        onClick={() => onShapeChange("rectangle")}
        className={`w-10 h-10 border-2 ${selectedShape === "rectangle" ? "border-blue-500" : "border-gray-300"} rounded flex items-center justify-center`}
        title="Rectangle"
      >
        <p>R</p>
      </button>

      <button
        onClick={() => onShapeChange("circle")}
        className={`w-10 h-10 border-2 ${selectedShape === "circle" ? "border-blue-500" : "border-gray-300"} rounded-full flex items-center justify-center`}
        title="Circle"
      >
        <p>C</p>
      </button>

      <button
        onClick={() => onShapeChange("line")}
        className={`w-10 h-10 border-2 ${selectedShape === "line" ? "border-blue-500" : "border-gray-300"} flex items-center justify-center`}
        title="Line"
      >
        <div className="w-6 h-0.5 bg-black" />
      </button>

      <button
        onClick={() => onShapeChange("eraser")}
        className={`w-10 h-10 border-2 ${selectedShape === "eraser" ? "border-blue-500" : "border-gray-300"} rounded flex items-center justify-center`}
        title="Eraser"
      >
        <p>E</p>
      </button>
    </div>
  );
}
