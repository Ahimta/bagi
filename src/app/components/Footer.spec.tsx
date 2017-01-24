import * as React from 'react';
import * as TestUtils from 'react-addons-test-utils';
import Footer from './Footer';

function setup(propOverrides: any) {
  const renderer = TestUtils.createRenderer();
  renderer.render(<Footer />);
  const output = renderer.getRenderOutput();

  return {
    output
  };
}

describe('components', () => {
  describe('Footer', () => {
    it('should render container', () => {
      const {output} = setup({});
      expect(output.type).toBe('footer');
    });
  });
});
