import { Typography, Modal, List, Avatar } from 'antd'
import { useOverlayState } from 'use-overlay-state'
import usersService, { User } from './users.service'
import { useState } from 'react'

const UserUpdateModal: React.FC<{
  user?: User
  isOpen: boolean
  onSubmit: (u: User) => void
  onClose: () => void
}> = ({ user, isOpen, onSubmit, onClose }) => {
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleSubmit = async () => {
    setConfirmLoading(true)

    const result = await usersService.update(user!.id, {
      firstName: 'Updated',
      lastName: 'User',
      gender: user!.gender,
    })

    setConfirmLoading(false)

    onSubmit(result)
  }

  return (
    <Modal
      title="Update User"
      open={isOpen}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      onCancel={onClose}
    >
      <p>
        Are you sure you want to update {user?.firstName} {user?.lastName}
      </p>
    </Modal>
  )
}

const users = [
  { id: 1, gender: 'male', firstName: 'John', lastName: 'Doe' },
  { id: 2, gender: 'female', firstName: 'Jane', lastName: 'White' },
  { id: 3, gender: 'male', firstName: 'Tom', lastName: 'Boss' },
]

const UsersList: React.FC<{ onEdit: (u: User) => Promise<void> }> = ({
  onEdit,
}) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={users}
      renderItem={(user: User, index) => (
        <List.Item
          actions={[
            <a key="list-loadmore-edit" onClick={() => onEdit(user)}>
              edit
            </a>,
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar
                src={`https://xsgames.co/randomusers/avatar.php?g=${user.gender}&key=${index}`}
              />
            }
            title={`${user.firstName} ${user.lastName}`}
          />
        </List.Item>
      )}
    />
  )
}

const ModalWithAsyncLogic: React.FC = () => {
  const { isOpen, params, open, close, resolve } = useOverlayState<
    User,
    { user: User }
  >()

  const handleEdit = async (user: User) => {
    const updatedUser = await open({ user })

    if (updatedUser != null) {
      alert(`Updated user is ${updatedUser.firstName} ${updatedUser.lastName}`)
    } else {
      console.log('Modal was closed')
    }
  }

  return (
    <>
      <Typography.Title level={4}>Modal with async logic</Typography.Title>
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

export default ModalWithAsyncLogic
