import { renderHook, act } from '@testing-library/react'
import { useOverlayState } from './useOverlayState'

describe('useOverlayState', () => {
  test('changes "isOpen" & "params"', () => {
    const { result } = renderHook(() =>
      useOverlayState<string, { firstName: string; lastName: string }>(),
    )

    expect(result.current.isOpen).toBe(false)
    const params = { firstName: 'John', lastName: 'Doe' }

    act(() => {
      result.current.open(params)
      result.current.updateParams({ ...params, firstName: 'Mary' })
    })

    expect(result.current.isOpen).toBe(true)
    expect(result.current.params).toStrictEqual({
      ...params,
      firstName: 'Mary',
    })

    act(() => {
      result.current.close()
    })

    expect(result.current.isOpen).toBe(false)
  })

  test('resolves with value when using "resolve"', async () => {
    const { result } = renderHook(() => useOverlayState<string, string>())

    expect(result.current.isOpen).toBe(false)

    let resolvedValue

    await act(async () => {
      setTimeout(() => {
        result.current.resolve('Bye!')
      }, 1000)

      resolvedValue = await result.current.open('Hello')
    })

    expect(result.current.isOpen).toBe(false)
    expect(resolvedValue).toBe('Bye!')
  })

  test('resolves with null when using "close"', async () => {
    const { result } = renderHook(() => useOverlayState<string, string>())

    expect(result.current.isOpen).toBe(false)

    let resolvedValue

    await act(async () => {
      setTimeout(() => {
        result.current.close()
      }, 1000)

      resolvedValue = await result.current.open('Hello')
    })

    expect(result.current.isOpen).toBe(false)
    expect(resolvedValue).toBe(null)
  })

  test('respects "defaultIsOpen"', () => {
    const { result } = renderHook(() => useOverlayState<string, string>(true))

    expect(result.current.isOpen).toBe(true)
  })
})
