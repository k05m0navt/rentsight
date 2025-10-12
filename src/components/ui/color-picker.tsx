'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

const PRESET_COLORS = [
  '#DD1202', // Primary red
  '#1DCC5C', // Success green
  '#F59E0B', // Warning amber
  '#3B82F6', // Info blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#A855F7', // Violet
  '#EF4444', // Red
  '#84CC16', // Lime
  '#F43F5E', // Rose
  '#14B8A6', // Teal
  '#8B5CF6', // Purple
];

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  allowCustom?: boolean;
}

export function ColorPicker({
  value = '#DD1202',
  onChange,
  presetColors = PRESET_COLORS,
  allowCustom = true,
}: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(value);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text dark:text-text-dark mb-3">
          Choose a color
        </label>
        <div className="grid grid-cols-8 gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              className={`
                w-10 h-10 rounded-md border-2 transition-[opacity,transform] duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50
                ${
                  value === color
                    ? 'border-primary dark:border-primary'
                    : 'border-border dark:border-border-dark'
                }
              `}
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color);
                setCustomColor(color);
              }}
              aria-label={`Select color ${color}`}
            >
              {value === color && (
                <span className="flex items-center justify-center">
                  <Check className="w-5 h-5 text-white drop-shadow-md" strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {allowCustom && (
        <div>
          <label
            htmlFor="custom-color"
            className="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Or enter a custom color
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="custom-color"
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#DD1202"
                className="w-full px-3 py-3 pl-12 border border-border dark:border-border-dark rounded-md bg-background dark:bg-background-dark text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-[border-color] duration-200"
              />
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded border border-border dark:border-border-dark"
                style={{ backgroundColor: customColor }}
              />
            </div>
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                onChange(e.target.value);
              }}
              className="w-12 h-12 rounded-md border border-border dark:border-border-dark cursor-pointer"
              aria-label="Pick custom color"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const isValidHex = /^#[0-9A-F]{6}$/i.test(customColor);
              if (isValidHex) {
                onChange(customColor);
              }
            }}
            className="mt-2 px-4 py-2 text-sm bg-primary text-white rounded-md hover:brightness-110 transition-[opacity,transform] duration-200 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Apply Custom Color
          </button>
        </div>
      )}
    </div>
  );
}
