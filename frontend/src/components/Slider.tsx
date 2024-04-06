import { Slider } from '@mui/material'
import {useState} from 'react'

interface SliderProps {
  min: number
  max: number
  step: number
  title: string
}

export default function SliderCompo({ min, max, title, step }: SliderProps): JSX.Element {
  const [value, setValue] = useState<number>(min)

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setValue(newValue);
    }
  };

  return (
    <div>
      <Slider
        aria-label={title}
        defaultValue={min}
        valueLabelDisplay="auto"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
      />
      <h2>{title}: {value}</h2>
    </div>
  );
}