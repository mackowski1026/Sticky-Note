import { render, screen, fireEvent } from '@testing-library/react'
import { Board } from './Board'

test('create note via toolbar and board click', () => {
  render(<Board />)
  const newBtn = screen.getByText(/New note/i)
  fireEvent.click(newBtn)
  const board = document.querySelector('.board') as HTMLElement
  expect(board).toBeInTheDocument()
  fireEvent.pointerDown(board, { clientX: 100, clientY: 100 })
  const ta = screen.getByPlaceholderText(/Type.../i)
  expect(ta).toBeInTheDocument()
})