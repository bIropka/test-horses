import { defineComponent, h } from 'vue'

export const CustomButtonStub = defineComponent({
  name: 'CustomButton',
  inheritAttrs: false,
  props: {
    text: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  emits: ['action'],
  setup(props, { emit, attrs }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          disabled: props.disabled,
          onClick: () => emit('action'),
        },
        props.text,
      )
  },
})
