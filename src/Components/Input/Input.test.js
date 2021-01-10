import Input from './Input';
import { createShallow, createMount } from '@material-ui/core/test-utils'

describe('<Input />', () => {
  let shallow
  let mount

  beforeAll(() => {
    shallow = createShallow()
    mount = createMount()
  })

  it('Basic render', () => {
    shallow(<Input />)
  })

  it('Test text-box and submit', () => {
    const wrapper = mount(<Input />)
    const textBox = wrapper.find('#text-box')

    textBox.at(5).simulate('change', 'test value')

    wrapper.update()

   // expect(textBox.at(5).props().value).toEqual('test value')
  })
});