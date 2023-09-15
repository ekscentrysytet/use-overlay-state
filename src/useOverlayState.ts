import { useMemo, useState, useCallback, useRef, useEffect } from 'react'

type PromiseResolveCallback<T> = (value: T | PromiseLike<T> | null) => void

interface OverlayStateManagerProps<T, P> {
  isOpen: boolean
  params?: P
  open: (p?: P) => Promise<T | null>
  close: () => void
  resolve: (v: T) => void
  updateParams: React.Dispatch<React.SetStateAction<P | undefined>>
}

export const useOverlayState = <T, P>(
  defaultIsOpen: boolean = false,
): OverlayStateManagerProps<T, P> => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen)
  const [params, setParams] = useState<P>()
  const promiseRef = useRef<{
    resolve: PromiseResolveCallback<T>
  } | null>(null)

  useEffect(() => {
    if (defaultIsOpen) {
      new Promise((resolve) => {
        promiseRef.current = { resolve }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const open = useCallback((p?: P) => {
    setIsOpen(true)
    setParams(p)

    return new Promise<T | null>((resolve) => {
      promiseRef.current = {
        resolve,
      }
    })
  }, [])

  const resolve = useCallback((val: T) => {
    if (!promiseRef.current)
      throw new Error('"resolve" cannot be used when "isOpen" is false.')

    setIsOpen(false)

    promiseRef.current.resolve(val)

    promiseRef.current = null
  }, [])

  const close = useCallback(() => {
    if (!promiseRef.current)
      throw new Error('"close" cannot be used when "isOpen" is false.')

    setIsOpen(false)

    promiseRef.current.resolve(null)

    promiseRef.current = null
  }, [])

  return useMemo(
    () => ({
      isOpen,
      params,
      open,
      resolve,
      close,
      updateParams: setParams,
    }),
    [isOpen, params, resolve, open, close],
  )
}
