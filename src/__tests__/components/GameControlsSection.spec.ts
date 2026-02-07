import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import GameControlsSection from '@/components/sections/GameControlsSection.vue'
import CustomButton from '@/components/ui/CustomButton.vue'
import type { RaceStatus } from '@/app/store/types'

function mountControls(status: RaceStatus = 'idle') {
  return mount(GameControlsSection, {
    props: { status },
  })
}

function btnEl(wrapper: ReturnType<typeof mountControls>, testId: string) {
  return wrapper.get(`[data-testid="${testId}"]`).element as HTMLButtonElement
}

function btnCmp(wrapper: ReturnType<typeof mountControls>, testId: string) {
  const cmp = wrapper
    .findAllComponents(CustomButton)
    .find((c) => c.attributes('data-testid') === testId)

  if (!cmp) throw new Error(`CustomButton not found: ${testId}`)
  return cmp
}

describe('GameControlsSection', () => {
  it('sets correct disabled states for each status', () => {
    const cases: Array<{
      status: RaceStatus
      disabled: Record<string, boolean>
    }> = [
      {
        status: 'idle',
        disabled: {
          'btn-generate': false,
          'btn-start': true,
          'btn-pause': true,
          'btn-resume': true,
          'btn-reset': true,
        },
      },
      {
        status: 'ready',
        disabled: {
          'btn-generate': true,
          'btn-start': false,
          'btn-pause': true,
          'btn-resume': true,
          'btn-reset': false,
        },
      },
      {
        status: 'running',
        disabled: {
          'btn-generate': true,
          'btn-start': true,
          'btn-pause': false,
          'btn-resume': true,
          'btn-reset': true,
        },
      },
      {
        status: 'paused',
        disabled: {
          'btn-generate': true,
          'btn-start': true,
          'btn-pause': true,
          'btn-resume': false,
          'btn-reset': false,
        },
      },
      {
        status: 'finished',
        disabled: {
          'btn-generate': true,
          'btn-start': true,
          'btn-pause': true,
          'btn-resume': true,
          'btn-reset': false,
        },
      },
    ]

    for (const c of cases) {
      const wrapper = mountControls(c.status)
      for (const [id, expected] of Object.entries(c.disabled)) {
        expect(btnEl(wrapper, id).disabled).toBe(expected)
      }
    }
  })

  it('wires @action for Start (emitting action triggers start)', async () => {
    const wrapper = mountControls('ready')

    btnCmp(wrapper, 'btn-start').vm.$emit('action')

    expect(wrapper.emitted('start')).toBeTruthy()
    expect(wrapper.emitted('start')?.length).toBe(1)
  })
})
