# useOverlayState React hook

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/ekscentrysytet/use-overlay-state/publish.yml)
![npm](https://img.shields.io/npm/v/use-overlay-state)

## Features

- Promise-based interface
- Two-way communication: you can pass params into overlay and get resolved value

## Motivation

The inspiration came from native `window.prompt` which allows you to get user input result in code that invoked it. However `window.prompt` is a blocking call and does not have any customization to your UI, instead this hook utilizes promises and adds more abilities for great experience.
If don't need async communication - it still exposes you convenient methods to control overlay UI open state.

## Usage

**Async communication (mostly applicable to modals/alerts)**:

```tsx
import { useOverlayState } from 'use-overlay-state'

// App.tsx
const App: React.FC = () => {
  const { isOpen, params, open, close, resolve } = useOverlayState<
    User,
    { user: User }
  >()

  const handleEdit = async (user: User) => {
    // user: User is passed to modal params
    // `open` returns a Promise which resolves either with `null` if `close` was called
    // or User if resolve was called
    const updatedUser = await open({ user })

    if (updatedUser != null) {
      alert(`Updated user is ${updatedUser.firstName} ${updatedUser.lastName}`)
    } else {
      console.log('Modal was closed')
    }
  }

  return (
    <>
      <UsersList onEdit={handleEdit} />
      <UserUpdateModal
        isOpen={isOpen}
        user={params?.user}
        onSubmit={resolve}
        onClose={close}
      />
    </>
  )
}

// UserUpdateModal.tsx
import { Modal } from 'antd'
import userService from 'services/user'

const UserUpdateModal: React.FC<{
  user?: User
  isOpen: boolean
  onSubmit: (u: User) => void
  onClose: () => void
}> = ({ user, isOpen, onSubmit, onClose }) => {
  const handleSubmit = async () => {
    const result = await usersService.update(user!.id, {
      firstName: 'Updated',
      lastName: 'User',
      gender: user!.gender,
    })

    setConfirmLoading(false)

    // call `resolve` with user: User here so it resolves Promise created by `open` in App.tsx
    onSubmit(result)
  }

  return (
    <Modal
      title="Update User"
      open={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
    >
      <p>
        Are you sure you want to update {user?.firstName} {user?.lastName}
      </p>
    </Modal>
  )
}
```

**Simple example - controllable popover (no async communication)**:

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
useOverlayState<T, P>(
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
