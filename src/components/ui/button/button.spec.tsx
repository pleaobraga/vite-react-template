/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/button/button.spec.tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// --- Mocks ---
// Deterministic classes so we can assert easily
vi.mock('./button.styles', () => ({
  buttonVariants: ({ variant, size, className }: any) =>
    ['btn', variant && `v-${variant}`, size && `s-${size}`, className]
      .filter(Boolean)
      .join(' '),
}))

// Keep cn as a simple join passthrough (adjust if your real cn differs)
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}))

// Import after mocks so they take effect
import { Button } from './button'

describe('<Button />', () => {
  it('renders a native button by default with base classes', () => {
    render(<Button>Click</Button>)
    const el = screen.getByRole('button', { name: 'Click' })
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute('data-slot', 'button')
    // From our mocked buttonVariants
    expect(el.className).toContain('btn')
  })

  it('applies variant and size classes', () => {
    render(
      <Button variant="secondary" size="lg">
        Save
      </Button>
    )
    const el = screen.getByRole('button', { name: 'Save' })
    expect(el.className).toContain('v-secondary')
    expect(el.className).toContain('s-lg')
  })

  it('merges custom className', () => {
    render(<Button className="extra-class">Merge</Button>)
    const el = screen.getByRole('button', { name: 'Merge' })
    expect(el.className).toContain('btn')
    expect(el.className).toContain('extra-class')
  })

  it('forwards props to the underlying element (e.g., type, onClick)', () => {
    const onClick = vi.fn()
    render(
      <Button type="submit" onClick={onClick}>
        Send
      </Button>
    )
    const el = screen.getByRole('button', { name: 'Send' }) as HTMLButtonElement
    expect(el.type).toBe('submit')
    fireEvent.click(el)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders as child when asChild is true (e.g., anchor)', () => {
    render(
      <Button asChild className="linkish">
        <a href="#go">Go</a>
      </Button>
    )
    const link = screen.getByRole('link', { name: 'Go' }) as HTMLAnchorElement
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('#go')
    // classes from buttonVariants + custom class
    expect(link.className).toContain('btn')
    expect(link.className).toContain('linkish')
    // still carries the data attribute
    expect(link).toHaveAttribute('data-slot', 'button')
  })
})
