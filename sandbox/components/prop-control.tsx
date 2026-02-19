interface SelectControlProps<T extends string> {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}

export function SelectControl<T extends string>({ label, value, options, onChange }: SelectControlProps<T>) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-[var(--color-text-secondary)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm text-[var(--color-text)] cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  )
}

interface ToggleControlProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleControl({ label, checked, onChange }: ToggleControlProps) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-[var(--color-border)] accent-[var(--color-primary)]"
      />
      <span className="font-medium text-[var(--color-text-secondary)]">{label}</span>
    </label>
  )
}

interface TextControlProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function TextControl({ label, value, onChange }: TextControlProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-[var(--color-text-secondary)]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm text-[var(--color-text)]"
      />
    </label>
  )
}
