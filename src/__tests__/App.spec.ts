import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { store } from '@/app/store'

describe('App', () => {
  it('renders game shell', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.get('[data-testid="app-title"]').text()).toContain('Horse Racing Game')
    expect(wrapper.get('[data-testid="btn-generate"]')).toBeTruthy()
    expect(wrapper.get('[data-testid="btn-start"]')).toBeTruthy()
  })
})
