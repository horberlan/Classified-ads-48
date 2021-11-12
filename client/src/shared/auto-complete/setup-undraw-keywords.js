import { undrawGallery } from '../../data/undraw'
import { autoComplete } from './vendors/auto-complete.min'

export const setupUndrawKeywords = async () => {
  return new Promise(function (resolve, reject) {
    if (!document.getElementsByName('illu_q').length) {
      return resolve('rolling well')
    }
    const corpus = undrawGallery.map((a) => a.tags.split(', '))
    const keywords = [...new Set(corpus.flat())]
    const illuAutoComplete = new autoComplete({
      selector: 'input[name="illu_q"]',
      minChars: 1,
      source: function (term, suggest) {
        term = term.toLowerCase()
        const choices = keywords
        const matches = []
        for (let i = 0; i < choices.length; i++) {
          if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i])
        }
        suggest(matches)
      }
    })
    return resolve('### function "setupUndrawKeywords" run successfully')
  })
}
