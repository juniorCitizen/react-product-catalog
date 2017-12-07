import React from 'react';
import {shallow, mount, render} from 'enzyme';
import {expect} from 'chai';
import App from '../index';

describe('Enzyme Shallow', function () {
  it('test1', function () {
    let app = shallow(<App/>);
    expect(app.find('Provider').text()).to.equal('Todos');
  });
});
