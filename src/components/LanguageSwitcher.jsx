import { Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { GlobalOutlined } from '@ant-design/icons'
import message from '../utils/customMessage'

const { Option } = Select

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation()

  const handleLanguageChange = async (lng) => {
    try {
      await i18n.changeLanguage(lng)
      localStorage.setItem('i18nextLng', lng)
      message.success(t('common.languageChanged'))
    } catch (error) {
      console.error('Error changing language:', error)
      message.error(t('errors.fallback'))
    }
  }

  return (
    <Select
      data-testid="language-switcher"
      value={i18n.language?.startsWith('uk') ? 'uk' : i18n.language?.startsWith('en') ? 'en' : i18n.language}
      onChange={handleLanguageChange}
      style={{ width: 120 }}
      suffixIcon={<GlobalOutlined />}
    >
      <Option value="en" data-testid="language-option-en">{t('common.english')}</Option>
      <Option value="uk" data-testid="language-option-uk">{t('common.ukrainian')}</Option>
    </Select>
  )
}

export default LanguageSwitcher
