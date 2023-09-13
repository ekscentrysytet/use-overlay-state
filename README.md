# useOverlayState React hook

## Motivation

You usually have cases when you need to open overlay from a parent component, pass some init values and somehow to get notified about what happened in the modal.
The inspiration came from native `window.prompt` which allows you to get user input result in code that invoked `window.prompt`. However `window.prompt` is a blocking call and does not have any customization to your UI, instead this hook utilizes promises and adds more abilities for great experience.

If don't need async communication - it still exposes you open state management wih convenient methods.

## Features

- Promise-based interface
- Two-way communication: you can pass params into overlay and get resolved value

## Usage

1. Simple example:

```jsx
import Popover from '@material-ui/core/Popover'

const App = () => {
  const [achorEl, setAnchorEl] = useState()
  const { open, overlayNode } = useOverlayState(
    ({ isOpen, close }) => (
      <Popover anchorEl={anchorEl} open={isOpen} onClose={close}>
        Some content
      </Popover>
    ),
    false,
    [anchorEl],
  )

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
    open()
  }

  return (
    <>
      {/* need to render `overlayNode` */}
      {overlayNode}
      <button onClick={handleClick}>Open popover</button>
    </>
  )
}
```

2. Advanced example:

```jsx
// UserUpdateDialog.js
import Modal from 'react-modal'
import {userService} from '@app/services'

const UserUpdateModal = ({ userId, isOpen, onClose, onConfirm }) => {
  const handleConfirm = async () => {
    const result = await userService.updateUser(user.id, {
      firstName: 'Mary',
      lastName: 'Jane'
    })

    onConfirm(result)
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h4>Are you sure you want to update user {userId}?</h4>

      <button onClick={close}>Cancel</button>
      <button onClick={() => handleConfirm()}>Confirm</button>
    </Modal>
  )
}

// UsersList.js
const UsersList = ({ onUpdate }) => {
  const [users, setUsers] = useState([])

  // fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      const result = await userService.getUsers();

      setUsers(users)
    }

    fetchUsers()
  }, [])

  return (
    <ul>
      {users.map(u => (
        <li key={u.id} onClick={() => onUpdate(u)}>{u.firstName} {u.lastName}</li>
      ))}
    </ul>
  )
}

// App.js
const App = () => {
  const { open, overlayNode } = useOverlayState(({ isOpen, close, resolve, params }) => (
    <UserUpdateModal
      isOpen={isOpen}
      onConfirm={resolve}
      onClose={close}
      userId={params?.user.id}
    />
  ))

  const handleUpdateUser = (user) => {
    // updatedUser object from userService.updateUser call in `UserUpdateDialog`
    // will resolve with null if modal modal was closed or updated user object if `resolve` was called
    const updatedUser = await open({ user })

    if (updatedUser != null) {
      // do any logic here with `updatedUser`
    }
  }


  return (
    <>
      {overlayNode}
      <UsersList onUpdate={handleUpdateUser}>
    </>
  )
}
```

## API

```ts
export const useOverlayState = <T, P>(
  renderFn: (args: RenderFnParams<T, P>) => ReactNode,
  defaultIsOpen: boolean = false,
  deps: DependencyList = [],
): OverlayStateManagerProps<T, P>

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
```

**Params:**

- `renderFn: (args: OverlayStateManagerProps<T, P>) => ReactNode` - render function that returns overlay node that needs to be rendered.
- `defaultIsOpen: boolean` (optional) - default open state (like in `useState`). Defaults to `false`.
- `deps: any[]` (optional) - default open state (like in `useState`). Defaults to `[]`.

**Returns object with following props:**

- `overlayNode: ReactNode` - React node of the overlay that needs to be rendered.
- `isOpen: boolean` - open state indicator.
- `params: P | null` - params that has been passed when invoked `open`.
- `open: (p: P) => Promise<T | null>` - function that opens overlay. Returns a promise which resolves to either `null` if `close` was called or `result: T` if `resolve` was called
- `close: () => void` - function that closes overlay. Will resolve returned promise from `open` with null (similar to `window.prompt`)
- `resolve: (v: T) => void` - function that resolves returned promise from `open` with custom value.
- `updateParams: React.Dispatch<React.SetStateAction<P | null>>` - `params` updater function
