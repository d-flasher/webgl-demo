import '@testing-library/jest-dom'

import { fireEvent, getByTestId, within } from '@testing-library/dom'

import { InputRange } from './input-range'

describe('input-range', () => {
    const init = () => {
        document.body.innerHTML = ''

        /** @type {InputRange} */
        const targetEl = document.createElement('input-range')
        document.body.append(targetEl)

        const { queryByRole } = within(targetEl)

        /** @type {HTMLInputElement} */
        const sliderEl = queryByRole('slider')

        /** @type {HTMLInputElement} */
        const inputEl = queryByRole('spinbutton')

        return { ...within(targetEl), targetEl, sliderEl, inputEl }
    }

    test('rendering with preinitialized properties', () => {
        document.body.innerHTML = '<input-range data-testid="input-range" step="0.1" min="-1" max="1" value="0.3"></input-range>'
        const targetEl = getByTestId(document.body, 'input-range')
        expect(targetEl).toHaveAttribute('step', '0.1')
        expect(targetEl).toHaveAttribute('min', '-1')
        expect(targetEl).toHaveAttribute('max', '1')
        expect(targetEl).toHaveAttribute('value', '0.3')
    })

    test('default state', () => {
        const { targetEl, sliderEl, inputEl } = init()

        expect(targetEl).toBeInTheDocument()
        expect(sliderEl).toBeInTheDocument()
        expect(inputEl).toBeInTheDocument()

        const defaultValue = '0'
        expect(targetEl.getAttribute('value')).toEqual(defaultValue)
        expect(sliderEl.getAttribute('value')).toEqual(defaultValue)
        expect(inputEl.getAttribute('value')).toEqual(defaultValue)
    })

    test('read value', () => {
        const { targetEl, sliderEl, inputEl } = init()

        const newValue = 1
        targetEl.setAttribute('value', newValue)
        expect(inputEl).toHaveValue(newValue)
        expect(sliderEl).toHaveValue(String(newValue))
    })

    test('"controlled input" test', () => {
        const { targetEl, sliderEl, inputEl } = init()

        const modelValue = 10
        const interactionValue = 11

        targetEl.setAttribute('value', modelValue)

        fireEvent.change(sliderEl, { target: { value: interactionValue } })
        fireEvent.blur(sliderEl)
        expect(sliderEl).toHaveValue(String(modelValue))

        fireEvent.change(inputEl, { target: { value: interactionValue } })
        fireEvent.blur(inputEl)
        expect(inputEl).toHaveValue(modelValue)
    })

    test('send events', () => {
        const { targetEl, sliderEl, inputEl } = init()

        const fn = jest.fn()
        targetEl.addEventListener(InputRange.EVENT_INPUT, fn)
        expect(fn).toHaveBeenCalledTimes(0)

        const value1 = 10
        fireEvent.input(sliderEl, { target: { value: value1 } })
        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith(new CustomEvent(InputRange.EVENT_INPUT, { detail: value1 }))

        const value2 = 11
        fireEvent.input(inputEl, { target: { value: value2 } })
        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenCalledWith(new CustomEvent(InputRange.EVENT_INPUT, { detail: value2 }))
    })

    test('min, max, step', () => {
        const { targetEl, sliderEl, inputEl } = init()

        const DEFAULT_MIN = '0'
        const DEFAULT_MAX = '100'
        const DEFAULT_STEP = '1'
        expect(targetEl.getAttribute('min')).toEqual(DEFAULT_MIN)
        expect(targetEl.getAttribute('max')).toEqual(DEFAULT_MAX)
        expect(targetEl.getAttribute('step')).toEqual(DEFAULT_STEP)

        expect(sliderEl.min).toEqual(DEFAULT_MIN)
        expect(sliderEl.max).toEqual(DEFAULT_MAX)
        expect(sliderEl.step).toEqual(DEFAULT_STEP)

        expect(inputEl.min).toEqual(DEFAULT_MIN)
        expect(inputEl.max).toEqual(DEFAULT_MAX)
        expect(inputEl.step).toEqual(DEFAULT_STEP)

        const MIN = -100
        targetEl.setAttribute('min', MIN)
        expect(sliderEl.min).toEqual(String(MIN))
        expect(inputEl.min).toEqual(String(MIN))

        const MAX = 100
        targetEl.setAttribute('max', MAX)
        expect(sliderEl.max).toEqual(String(MAX))
        expect(inputEl.max).toEqual(String(MAX))

        const STEP = 0.01
        targetEl.setAttribute('step', STEP)
        expect(sliderEl.step).toEqual(String(STEP))
        expect(inputEl.step).toEqual(String(STEP))
    })
})
