import {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
  DependencyList,
} from 'react'

type PromiseResolveCallback<T> = (value: T | PromiseLike<T> | null) => void

interface RenderFnParams<T, P> {
  isOpen: boolean
  params: P | null
  close: () => void
  resolve: (v: T) => void
  updateParams: React.Dispatch<React.SetStateAction<P | null>>
}

type OverlayStateManagerProps<T, P> = RenderFnParams<T, P> & {
  open: (p: P) => Promise<T | null>
  overlayNode: ReactNode
}

export const useOverlayState = <T, P>(
  renderFn: (args: RenderFnParams<T, P>) => ReactNode,
  defaultIsOpen: boolean = false,
  deps: DependencyList = [],
): OverlayStateManagerProps<T, P> => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen)
  const [params, setParams] = useState<P | null>(null)
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

  const open = useCallback((p: P) => {
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

  const overlayNode = useMemo(
    () =>
      renderFn({
        isOpen,
        params,
        resolve,
        close,
        updateParams: setParams,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen, params, resolve, close, ...deps],
  )

  return useMemo(
    () => ({
      isOpen,
      params,
      open,
      resolve,
      close,
      overlayNode,
      updateParams: setParams,
    }),
    [isOpen, params, resolve, open, close, overlayNode],
  )
}
