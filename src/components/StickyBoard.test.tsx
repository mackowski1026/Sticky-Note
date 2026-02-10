import { render, fireEvent, screen } from '@testing-library/react'
import StickyBoard from './StickyBoard'

test('double-click creates a note', () => {
  render(<StickyBoard />)
  const helper = screen.getByText(/Double-click to create a note/i)
  fireEvent.doubleClick(helper)
  const ta = screen.getByRole('textbox')
  expect((ta as HTMLTextAreaElement).value).toBe('New note')
})