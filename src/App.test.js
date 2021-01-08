import App from './App';
import Input from './Components/Input'
import Results from './Components/Results'

Describe('App', () => {
    let shallow;

    beforeAll(() => {
      shallow = createShallow();
    });

    test('Basic render', () => {
        shallow(<App />)
    })

    test('Render children', () => {
        const app = shallow(<App />)
        expect(app.containsMatchingElement(<Input />)).toEqual(true)
        expect(app.containsMatchingElement(<Results />)).toEqual(true)
    })
});
