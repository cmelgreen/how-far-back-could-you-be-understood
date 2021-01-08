import Input from './Input'
import { createShallow } from '@material-ui/core/test-utils'

describe('<Input />', () => {
  let shallow;

  beforeAll(() => {
    shallow = createShallow();
  });

  it('should work', () => {
    const wrapper = shallow(<Input />);
  });
});