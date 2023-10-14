import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    quotes: 'single',
  },
}, {
  rules: {
    semi: ['warn', 'never'],
    quotes: ['warn', 'single'],
  },
})
