# useOverlayState React hook

## Motivation

You usually have cases when you need to open overlay from a parent component, pass some init values and somehow to get notified about what happened in the modal.
The inspiration came from native `window.prompt` which allows you to get user input result in code that invoked `window.prompt`. However `window.prompt` is a blocking call and does not have any customization to your UI, instead this hook utilizes promises and adds more abilities for great experience.

If don't need async communication - it still exposes you open state management wih convenient methods.

## Features

- Promise-based interface
- Two-way communication: you can pass params into overlay and get resolved value

## Usage

**Simple example**:

```jsx
import { useOverlayState } from 'use-overlay-state'
import Popover from '@material-ui/core/Popover'

const App = () => {
  const [achorEl, setAnchorEl] = useState()
  const { isOpen, open, close } = useOverlayState()

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
    open()
  }

  return (
    <>
      <Popover anchorEl={anchorEl} open={isOpen} onClose={close}>
        Some content
      </Popover>
      <button onClick={handleClick}>Open popover</button>
    </>
  )
}
```

See more [examples](https://github.com/ekscentrysytet/use-overlay-state/tree/main/examples)

## API

```ts
useOverlayState = <T, P>(
  defaultIsOpen: boolean = false,
): OverlayStateManagerProps<T, P>

interface OverlayStateManagerProps<T, P> {
  isOpen: boolean
  params?: P
  open: (p?: P) => Promise<T | null>
  close: () => void
  resolve: (v: T) => void
  updateParams: React.Dispatch<React.SetStateAction<P | undefined>>
}
```

**Params:**

- `defaultIsOpen: boolean` (optional) - default open state (like in `useState`). Defaults to `false`.

**Returns object with following props:**

- `isOpen: boolean` - open state indicator.
- `params?: P` - params that has been passed when invoked `open`.
- `open: (p?: P) => Promise<T | null>` - function that opens overlay. Returns a promise which resolves to either `null` if `close` was called or `result: T` if `resolve` was called
- `close: () => void` - function that closes overlay. Will resolve returned promise from `open` with null (similar to `window.prompt`)
- `resolve: (v: T) => void` - function that resolves returned promise from `open` with custom value.
- `updateParams: React.Dispatch<React.SetStateAction<P | undefined>>` - `params` updater function
