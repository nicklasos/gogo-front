import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Button,
  Card,
  Space,
  Typography,
  Popconfirm,
  Spin,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useGuardedNavigate } from '../lib/unsavedChanges'
import apiClient from '../utils/apiClient'
import message from '../utils/customMessage'
import { formatDateTime, paginationFromMeta } from '../utils/formatters'
import { getApiErrorMessage } from '../utils/serverErrors'

const { Title } = Typography

function ExamplesPage() {
  const { t } = useTranslation()
  const navigate = useGuardedNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  })

  const fetchExamples = useCallback(
    async (page = 1, pageSize = 20, signal = null) => {
      setLoading(true)
      try {
        const options = signal ? { signal } : {}
        const response = await apiClient.get(
          `/api/v1/examples?page=${page}&page_size=${pageSize}`,
          options
        )

        if (response.ok) {
          const body = await response.json()
          setItems(body.data || [])
          setPagination(paginationFromMeta(body.pagination, { current: page, pageSize }))
        } else {
          const errBody = await response.json().catch(() => ({}))
          message.error(getApiErrorMessage(t, errBody, 'examples.loadFailed'))
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error)
          message.error(t('examples.loadFailed'))
        }
      } finally {
        setLoading(false)
      }
    },
    [t]
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchExamples(1, pagination.pageSize, controller.signal)
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id) => {
    try {
      const response = await apiClient.delete(`/api/v1/examples/${id}`)
      if (response.ok) {
        message.success(t('examples.deleted'))
        fetchExamples(pagination.current, pagination.pageSize)
      } else {
        const errBody = await response.json().catch(() => ({}))
        message.error(getApiErrorMessage(t, errBody, 'examples.deleteFailed'))
      }
    } catch (error) {
      console.error(error)
      message.error(t('examples.deleteFailed'))
    }
  }

  const columns = [
    {
      title: t('examples.titleField'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('examples.descriptionField'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: t('examples.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v) => formatDateTime(v),
      width: 180,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            data-testid={`example-edit-button-${record.id}`}
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/examples/${record.id}/edit`)}
          >
            {t('common.edit')}
          </Button>
          <Popconfirm
            title={t('examples.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.delete')}
            cancelText={t('common.cancel')}
            okButtonProps={{ 'data-testid': `example-delete-confirm-${record.id}` }}
          >
            <Button
              data-testid={`example-delete-button-${record.id}`}
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card data-testid="examples-page">
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          {t('examples.title')}
        </Title>
        <Button
          data-testid="examples-add-button"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/examples/new')}
        >
          {t('examples.add')}
        </Button>
      </Space>

      <Spin spinning={loading}>
        <Table
          data-testid="examples-table"
          rowKey="id"
          columns={columns}
          dataSource={items || []}
          locale={{ emptyText: t('examples.empty') }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (page, pageSize) => fetchExamples(page, pageSize),
          }}
        />
      </Spin>
    </Card>
  )
}

export default ExamplesPage
