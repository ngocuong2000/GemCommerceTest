/// <reference types="vitest" />

import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import App from '../App.vue';

describe('App.vue', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(App);
  });

 it('replaces comma with dot and allows integer and float inputs', async () => {
    const input = wrapper.find('input');

    await input.setValue('12,3');
    await input.trigger('blur');
    expect(input.element.value).toBe('12.3');

    await input.setValue('45.67');
    await input.trigger('blur');
    expect(input.element.value).toBe('45.7'); 
  });

  it('removes non-numeric trailing characters on blur', async () => {
    const input = wrapper.find('input');

    await input.setValue('123a');
    await input.trigger('blur');
    expect(input.element.value).toBe('123.0');

    await input.setValue('12a3');
    await input.trigger('blur');
    expect(input.element.value).toBe('12.0');

    await input.setValue('a123');
    await input.trigger('blur');
    expect(input.element.value).toBe('0.0');

    await input.setValue('12.4.5');
    await input.trigger('blur');
    expect(input.element.value).toBe('12.4');
  });

  it('resets value to 0 if input < 0', async () => {
    const input = wrapper.find('input');

    await input.setValue('-5');
    await input.trigger('blur');
    expect(input.element.value).toBe('0.0');
  });

  it('for % unit, input > 100 resets to previous valid value', async () => {
    const input = wrapper.find('input');

    await wrapper.setProps({ unit: '%' }); 
    wrapper.vm.unit = '%';

    await wrapper.vm.$nextTick();

    await input.setValue('50');
    await input.trigger('blur');
    expect(input.element.value).toBe('50.0');

    await input.setValue('150');
    await input.trigger('blur');
    expect(input.element.value).toBe('50.0');
  });

  it('disables "-" button at 0 and disables "+" button at 100 for %', async () => {
    wrapper.vm.rawValue = '0';
    await wrapper.vm.$nextTick();
    const minusBtn = wrapper.find('button:nth-of-type(1)');
    expect((minusBtn.element as HTMLButtonElement).disabled).toBe(true);

    wrapper.vm.rawValue = '100';
    wrapper.vm.unit = '%';
    await wrapper.vm.$nextTick();
    const plusBtn = wrapper.find('button:nth-of-type(2)');
    expect((plusBtn.element as HTMLButtonElement).disabled).toBe(true);

  });

  it('switching from px to % with value > 100 resets value to 100', async () => {
    wrapper.vm.rawValue = '150';
    wrapper.vm.unit = 'px';
    await wrapper.vm.$nextTick();

    wrapper.vm.switchUnit('%');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.unit).toBe('%');
    expect(wrapper.vm.rawValue).toBe('100');
  });
});
