import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Spin,
  Typography,
  Popconfirm,
} from 'antd'
import { useTranslation } from 'react-i18next'
import {
  useGuardedNavigate,
  useUnsavedChangesGuard,
  useUnsavedChangesContext,
} from '../lib/unsavedChanges'
import apiClient from '../utils/apiClient'
import message from '../utils/customMessage'
import {
  getApiErrorMessage,
  mapValidationDetailsToFields,
} from '../utils/serverErrors'

const { Title } = Typography
const { TextArea } = Input

function ExampleEditorPage() {
  const { id } = useParams()
  const isNew = !id
  const { t } = useTranslation()
  const navigate = useGuardedNavigate()
  const { setDirty: setGuardDirty } = useUnsavedChangesContext()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  useUnsavedChangesGuard(dirty)

  useEffect(() => {
    if (isNew) return undefined

    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      try {
        const response = await apiClient.get(`/api/v1/examples/${id}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}))
          message.error(getApiErrorMessage(t, errBody, 'examples.loadFailed'))
          navigate('/examples')
          return
        }
        const body = await response.json()
        const example = body.data
        form.setFieldsValue({
          title: example.title,
          description: example.description || '',
        })
        setDirty(false)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error)
          message.error(t('examples.loadFailed'))
        }
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [id, isNew, form, navigate, t])

  const pageTitle = useMemo(
    () => (isNew ? t('examples.create') : t('examples.edit')),
    [isNew, t]
  )

  const onFinish = async (values) => {
    setSaving(true)
    try {
      const payload = {
        title: values.title,
        description: values.description || '',
      }
      const response = isNew
        ? await apiClient.post('/api/v1/examples', payload)
        : await apiClient.put(`/api/v1/examples/${id}`, payload)

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        if (errBody.details) {
          form.setFields(mapValidationDetailsToFields(t, errBody.details))
        }
        message.error(getApiErrorMessage(t, errBody, 'examples.saveFailed'))
        return
      }

      setDirty(false)
      setGuardDirty(false)
      message.success(t('examples.saved'))
      navigate('/examples')
    } catch (error) {
      console.error(error)
      message.error(t('examples.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await apiClient.delete(`/api/v1/examples/${id}`)
      if (response.ok) {
        setDirty(false)
        setGuardDirty(false)
        message.success(t('examples.deleted'))
        navigate('/examples')
      } else {
        const errBody = await response.json().catch(() => ({}))
        message.error(getApiErrorMessage(t, errBody, 'examples.deleteFailed'))
      }
    } catch (error) {
      console.error(error)
      message.error(t('examples.deleteFailed'))
    }
  }

  return (
    <Card data-testid="example-editor-page">
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          {pageTitle}
        </Title>
        <Button data-testid="example-editor-back-button" onClick={() => navigate('/examples')}>
          {t('common.back')}
        </Button>
      </Space>

      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={() => setDirty(true)}
          data-testid="example-editor-form"
        >
          <Form.Item
            name="title"
            label={t('examples.titleField')}
            rules={[{ required: true, message: t('examples.titleRequired') }]}
          >
            <Input data-testid="example-title-input" />
          </Form.Item>

          <Form.Item name="description" label={t('examples.descriptionField')}>
            <TextArea data-testid="example-description-input" rows={4} />
          </Form.Item>

          <Space>
            <Button
              data-testid="example-save-button"
              type="primary"
              htmlType="submit"
              loading={saving}
            >
              {t('common.save')}
            </Button>
            {!isNew && (
              <Popconfirm
                title={t('examples.deleteConfirm')}
                onConfirm={handleDelete}
                okText={t('common.delete')}
                cancelText={t('common.cancel')}
                okButtonProps={{ 'data-testid': 'example-editor-delete-confirm' }}
              >
                <Button data-testid="example-editor-delete-button" danger>
                  {t('common.delete')}
                </Button>
              </Popconfirm>
            )}
          </Space>
        </Form>
      </Spin>
    </Card>
  )
}

export default ExampleEditorPage
