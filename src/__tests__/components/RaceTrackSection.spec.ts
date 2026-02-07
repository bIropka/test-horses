import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceTrackSection from '@/components/sections/RaceTrackSection.vue'

function leftPercent(style: string): number {
  const m = style.match(/left:\s*([0-9.]+)%/i)
  if (!m) throw new Error(`left:% not found in style: ${style}`)
  return Number(m[1])
}

describe('RaceTrackSection', () => {
  it('shows empty state when there is no active round', () => {
    const wrapper = mount(RaceTrackSection, {
      props: {
        horseIds: [],
        horsesMap: {},
        progressByHorseId: {},
      },
    })

    expect(wrapper.text()).toContain('No active round')
  })

  it('renders progress tokens only for horses present in horsesMap', () => {
    const wrapper = mount(RaceTrackSection, {
      props: {
        horseIds: [1, 2],
        horsesMap: {
          1: { id: 1, name: 'Alpha', color: '#E6194B', condition: 10 },
          // horse 2 intentionally missing
        },
        progressByHorseId: { 1: 0.5, 2: 0.5 },
      },
    })

    expect(wrapper.findAll('.race-track-progress__token').length).toBe(1)
    expect(wrapper.find('.race-track-progress__token[title="Alpha"]').exists()).toBe(true)
  })

  it('clamps progress to 0.02..0.98 and maps to left:% ( * 97 )', () => {
    const wrapper = mount(RaceTrackSection, {
      props: {
        horseIds: [1, 2],
        horsesMap: {
          1: { id: 1, name: 'Alpha', color: '#E6194B', condition: 10 },
          2: { id: 2, name: 'Beta', color: '#3CB44B', condition: 20 },
        },
        progressByHorseId: { 1: 0, 2: 1 },
      },
    })

    const alpha = wrapper.get('.race-track-progress__token[title="Alpha"]')
    const beta = wrapper.get('.race-track-progress__token[title="Beta"]')

    expect(leftPercent(alpha.attributes('style') ?? '')).toBeCloseTo(1.94, 2) // 0.02*97
    expect(leftPercent(beta.attributes('style') ?? '')).toBeCloseTo(95.06, 2) // 0.98*97
  })
})
