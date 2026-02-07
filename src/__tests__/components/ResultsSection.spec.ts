import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultsSection from '@/components/sections/ResultsSection.vue'

describe('ResultsSection', () => {
  it('shows empty state when results are empty', () => {
    const wrapper = mount(ResultsSection, {
      props: {
        results: [],
        horsesMap: {},
      },
    })

    expect(wrapper.text()).toContain('No results yet')
  })

  it('renders placements in the same order as provided', () => {
    const wrapper = mount(ResultsSection, {
      props: {
        results: [
          {
            roundIndex: 0,
            distance: 1200,
            placements: [2, 1, 3],
          },
        ],
        horsesMap: {
          1: { id: 1, name: 'Horse A', color: '#E6194B', condition: 10 },
          2: { id: 2, name: 'Horse B', color: '#3CB44B', condition: 20 },
          3: { id: 3, name: 'Horse C', color: '#FFE119', condition: 30 },
        },
      },
    })

    const round = wrapper.get('[data-testid="result-round-0"]')
    const items = round.findAll('ol > li').map((li) => li.text().trim())

    expect(items[0]).toContain('Horse B')
    expect(items[1]).toContain('Horse A')
    expect(items[2]).toContain('Horse C')
  })
})
