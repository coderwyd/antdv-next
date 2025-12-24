import { describe, it } from 'vitest'
import { replaceSrcPath } from '../plugins/demo.ts'

describe('replaceSrcPath plugin', () => {
  it('should pass', () => {
    const code = `<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/oneWay.vue">One Way</demo>
  <demo src="./demo/search.vue">Search</demo>
  <demo src="./demo/advanced.vue">Advanced</demo>
  <demo src="./demo/custom-item.vue">Custom datasource</demo>
  <demo src="./demo/actions.vue">Custom Actions</demo>
  <demo src="./demo/large-data.vue">Pagination</demo>
  <demo src="./demo/tree-transfer.vue">Tree Transfer</demo>
  <demo src="./demo/status.vue">Status</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
  <demo src="./demo/custom-select-all-labels.vue">Custom Select All Labels</demo>
</demo-group>`
    const str = replaceSrcPath(code, '/Users/yanyu/workspace/gitea/antdv-next/antdv-next/playground/src/pages/components/transfer/index.zh-CN.md', '/Users/yanyu/workspace/gitea/antdv-next/antdv-next/playground', 'demo', {} as any)
    console.log(str)
  })
})
