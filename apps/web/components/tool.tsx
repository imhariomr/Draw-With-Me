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
        className={`w-10 h-10 border-2 ${selectedShape === 'rectangle' ? 'border-blue-500' : 'border-gray-300'} rounded flex items-center justify-center`}
        title="Rectangle"
      >
        <div className="w-5 h-3 bg-black" />
      </button>

      <button
        onClick={() => onShapeChange("circle")}
        className={`w-10 h-10 border-2 ${selectedShape === 'circle' ? 'border-blue-500' : 'border-gray-300'} rounded-full flex items-center justify-center`}
        title="Circle"
      >
        <div className="w-4 h-4 bg-black rounded-full" />
      </button>

      <button
        onClick={() => onShapeChange("eraser")}
        className={`w-10 h-10 border-2 ${selectedShape === 'eraser' ? 'border-blue-500' : 'border-gray-300'} rounded flex items-center justify-center`}
        title="Eraser"
      >
        <div className="w-4 h-4 bg-red-500 rotate-45" />
      </button>
    </div>
  );
}
