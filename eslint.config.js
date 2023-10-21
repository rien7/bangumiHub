import antfu from '@antfu/eslint-config'
import unocss from '@unocss/eslint-config/flat'

export default [
  unocss,
  ...antfu({
    stylistic: {
      quotes: 'single',
    },
  }, {
    rules: {
      semi: ['warn', 'never'],
      quotes: ['warn', 'single'],
    },
  }),
]
