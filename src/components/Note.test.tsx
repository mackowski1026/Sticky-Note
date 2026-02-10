import { render, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Note from './Note'

test('renders note and can remove', () => {
  const n = { id: '1', x: 10, y: 10, width: 200, height: 100, text: 't' }
  const onRemove = vi.fn()
  const { getByText } = render(<Note data={n} onRemove={onRemove} />)
  expect(getByText('t')).toBeInTheDocument()
  fireEvent.click(getByText('Remove'))
  expect(onRemove).toHaveBeenCalled()
})