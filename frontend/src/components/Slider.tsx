import { Slider } from '@mui/material'

interface SliderProps {
  min: number
  max: number
  step: number
  title: string
  value: number | number[]
  onChange: (event: Event, value: number | number[]) => void
}

export default function CustomSlider({ min, max, title, step, value, onChange }: SliderProps): JSX.Element {
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
        onChange={onChange}
      />
      <h2>{title}: {value}</h2>
    </div>
  );
}