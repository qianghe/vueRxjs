import Mock, { Random } from 'mockjs'

let count = 0

export const mockOptions = (suffix = '', length = 10) => Mock.mock({
  [`options|${length}`]: [{
    'id|+1': parseInt(`${count++}${Random.integer(10, 80)}`),
    name: () => `${suffix}${Random.cword(4)}`
  }]
})

export const mockContent = () => Mock.mock({
  content: Mock.mock('@paragraph(6, 10)')
})
