import { Button, Popover, Tag, Typography, Space } from 'antd'

import { useOverlayState } from 'use-overlay-state'

const ControllablePopover: React.FC = () => {
  const { isOpen, open, close } = useOverlayState<undefined, undefined>()

  return (
    <>
      <Typography.Title level={4}>Controllable Popover</Typography.Title>
      <Space>
        <Button type="primary" onClick={() => open()}>
          Open Popover
        </Button>
        <Popover
          content={<a onClick={close}>Close</a>}
          title="Popover title"
          trigger="click"
          open={isOpen}
        >
          <Tag className="tag">Popover will show here</Tag>
        </Popover>
      </Space>
    </>
  )
}

export default ControllablePopover
