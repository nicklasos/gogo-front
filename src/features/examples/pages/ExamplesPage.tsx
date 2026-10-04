import { Button, Card } from 'antd'
import { AppstoreOutlined, PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/shared/components/PageHeader'
import { PageStack } from '@/shared/components/PageStack'
import { ResponsiveTable } from '@/shared/components/ResponsiveTable'
import { RowActions } from '@/shared/components/RowActions'
import { usePageParams, useTablePagination } from '@/shared/hooks/usePageParams'
import { formatDateTime } from '@/shared/utils/format'
import message from '@/shared/utils/message'
import { useDeleteExample, useExamples } from '../hooks'
import type { Example } from '../types'

export default function ExamplesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const paging = usePageParams()
  const examples = useExamples(paging.params)
  const remove = useDeleteExample()
  const pagination = useTablePagination(paging, examples.data)

  const onDelete = (example: Example) => remove.mutate(example.id, { onSuccess: () => message.success(t('examples.deleted')) })

  const actions = (example: Example) => (
    <RowActions
      entity="example"
      id={example.id}
      onEdit={() => navigate(`/examples/${example.id}/edit`)}
      onDelete={() => onDelete(example)}
      deleteTitle={t('examples.deleteConfirm')}
    />
  )

  const columns: ColumnsType<Example> = [
    { title: t('examples.titleField'), dataIndex: 'title', key: 'title', ellipsis: true },
    { title: t('examples.descriptionField'), dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: t('common.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (value: string) => formatDateTime(value),
    },
    { title: t('common.actions'), key: 'actions', width: 110, fixed: 'right', render: (_, example) => actions(example) },
  ]

  return (
    <PageStack testId="examples-page">
      <Card>
        <PageHeader
          icon={<AppstoreOutlined />}
          title={t('examples.title')}
          mainAction={
            <Button data-testid="examples-add-button" type="primary" icon={<PlusOutlined />} onClick={() => navigate('/examples/new')}>
              {t('examples.add')}
            </Button>
          }
        />
        <ResponsiveTable
          testId="examples-table"
          items={examples.data?.data}
          loading={examples.isFetching || remove.isPending}
          columns={columns}
          emptyText={t('examples.empty')}
          pagination={pagination}
          cardTitle={(example) => example.title}
          cardTestId={(example) => `example-card-${example.id}`}
          renderCard={(example) => (
            <>
              <div>{example.description}</div>
              <div>
                {t('common.createdAt')}: {formatDateTime(example.created_at)}
              </div>
            </>
          )}
          cardActions={actions}
        />
      </Card>
    </PageStack>
  )
}
