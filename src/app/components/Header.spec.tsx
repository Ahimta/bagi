import * as React from 'react';
import * as TestUtils from 'react-addons-test-utils';
import Header from './Header';

function setup() {
  const renderer = TestUtils.createRenderer();
  renderer.render(<Header />);
  const output = renderer.getRenderOutput();

  return {
    output
  };
}

describe('components', () => {
  describe('Header', () => {
    it('should render correctly', () => {
      const {output} = setup();
      expect(output.type).toBe('header');
    });
  });
});
