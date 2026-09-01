import React, { useState, useEffect } from 'react';
import { parseIndianNumber, formatIndianCurrency, formatIndianNumberExact } from '../utils/numberParser';

interface SmartNumberInputProps {
  id?: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  icon?: React.ReactNode;
  isCurrency?: boolean;
  prefix?: string;
  suffix?: string;
  minLabel?: string;
  midLabel?: string;
  maxLabel?: string;
  presets?: { label: string; value: number }[];
  helperText?: string;
  themeColor?: 'blue' | 'green' | 'amber';
}

export const SmartNumberInput: React.FC<SmartNumberInputProps> = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  icon,
  isCurrency = false,
  prefix = isCurrency ? '₹' : '',
  suffix = '',
  minLabel,
  midLabel,
  maxLabel,
  presets,
  helperText,
  themeColor = 'blue'
}) => {
  const [inputValue, setInputValue] = useState<string>(() => {
    return isCurrency ? formatIndianNumberExact(value) : value.toString();
  });
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Sync internal input string when external prop changes while not focused
  useEffect(() => {
    if (!isFocused) {
      setInputValue(isCurrency ? formatIndianNumberExact(value) : value.toString());
    }
  }, [value, isCurrency, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
    
    // Parse value in real time if valid
    const parsed = parseIndianNumber(raw);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseIndianNumber(inputValue);
    if (!isNaN(parsed) && parsed >= 0) {
      // Clamp to min/max if needed or let user exceed slider limits smoothly
      const finalVal = Math.max(0, parsed);
      onChange(finalVal);
      setInputValue(isCurrency ? formatIndianNumberExact(finalVal) : finalVal.toString());
    } else {
      setInputValue(isCurrency ? formatIndianNumberExact(value) : value.toString());
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    onChange(num);
    setInputValue(isCurrency ? formatIndianNumberExact(num) : num.toString());
  };

  const colorClasses = {
    blue: {
      accent: 'accent-[#003461]',
      text: 'text-[#003461]',
      border: 'focus-within:border-[#003461] focus-within:ring-2 focus-within:ring-[#003461]/20',
      activeBtn: 'bg-[#003461] text-white border-[#003461]'
    },
    green: {
      accent: 'accent-[#006d42]',
      text: 'text-[#006d42]',
      border: 'focus-within:border-[#006d42] focus-within:ring-2 focus-within:ring-[#006d42]/20',
      activeBtn: 'bg-[#006d42] text-white border-[#006d42]'
    },
    amber: {
      accent: 'accent-amber-600',
      text: 'text-amber-700',
      border: 'focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-600/20',
      activeBtn: 'bg-amber-600 text-white border-amber-600'
    }
  }[themeColor];

  return (
    <div className="bg-[#f7f9fb] border border-[#c2c6d1] rounded-2xl p-4 sm:p-5 space-y-3">
      {/* Label and Manual Editable Input Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-bold text-[#191c1e] uppercase tracking-wider flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
        </label>

        {/* Dual Input: Clean editable text box supporting manual typing like '3 lakh', '2,50,890', etc. */}
        <div className={`flex items-center bg-white border border-[#c2c6d1] rounded-xl px-2.5 py-1.5 transition-all shadow-2xs ${colorClasses.border}`}>
          {prefix && (
            <span className="text-xs font-bold text-[#727781] mr-1 select-none">
              {prefix}
            </span>
          )}
          <input
            id={id}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder="Type value (e.g. 3 Lakh)"
            className={`font-mono text-sm sm:text-base font-extrabold ${colorClasses.text} bg-transparent outline-hidden w-28 sm:w-36 text-right`}
          />
          {suffix && (
            <span className="text-xs font-bold text-[#727781] ml-1 select-none">
              {suffix}
            </span>
          )}
        </div>
      </div>

      {/* Preset Quick Pills if provided */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {presets.map((p) => {
            const isSelected = Math.abs(value - p.value) < 0.01;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  onChange(p.value);
                  setInputValue(isCurrency ? formatIndianNumberExact(p.value) : p.value.toString());
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer truncate ${
                  isSelected
                    ? colorClasses.activeBtn
                    : 'bg-white text-[#424750] border-[#c2c6d1] hover:bg-[#eceef0]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Synchronized Slider Bar */}
      <div className="space-y-1 pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(Math.max(value, min), max)}
          onChange={handleSliderChange}
          className={`w-full h-2 bg-[#e0e3e5] rounded-lg appearance-none cursor-pointer ${colorClasses.accent}`}
        />
        
        {/* Min/Max indicators and quick words feedback */}
        <div className="flex justify-between items-center text-[10px] text-[#727781] font-mono">
          <span>{minLabel || (isCurrency ? formatIndianCurrency(min) : `${min}${suffix}`)}</span>
          {isCurrency && (
            <span className="font-sans font-semibold text-[#003461] bg-[#d3e4fe]/40 px-2 py-0.5 rounded text-[11px]">
              {formatIndianCurrency(value)}
            </span>
          )}
          {midLabel && <span>{midLabel}</span>}
          <span>{maxLabel || (isCurrency ? formatIndianCurrency(max) : `${max}${suffix}`)}</span>
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-[#727781] italic">
          {helperText}
        </p>
      )}
    </div>
  );
};
