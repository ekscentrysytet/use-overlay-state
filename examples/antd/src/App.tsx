import './App.css'
import ModalWithAsyncLogic from './AsyncModal'
import ControllablePopover from './ControllablePopover'

const App: React.FC = () => {
  return (
    <>
      <ControllablePopover />
      <ModalWithAsyncLogic />
    </>
  )
}

export default App
