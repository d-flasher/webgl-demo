import '@testing-library/jest-dom'

import { fireEvent, getByTestId, within } from '@testing-library/dom'

import { InputBoolean } from './input-boolean'

describe('input-boolean', () => {
    const init = () => {
        document.body.innerHTML = ''

        /** @type {InputBoolean} */
        const targetEl = document.createElement('input-boolean')
        document.body.append(targetEl)

        const { queryByRole } = within(targetEl)

        /** @type {HTMLInputElement} */
        const inputEl = queryByRole('checkbox')

        return { ...within(targetEl), targetEl, inputEl }
    }

    test('rendering with preinitialized properties', () => {
        document.body.innerHTML = '<input-boolean data-testid="input-boolean" value="false"></input-boolean>'
        let targetEl = getByTestId(document.body, 'input-boolean')
        expect(targetEl).toHaveAttribute('value', 'false')

        document.body.innerHTML = '<input-boolean data-testid="input-boolean" value="true"></input-boolean>'
        targetEl = getByTestId(document.body, 'input-boolean')
        expect(targetEl).toHaveAttribute('value', 'true')
    })

    test('default state', () => {
        const { targetEl, inputEl } = init()

        expect(targetEl).toBeInTheDocument()
        expect(inputEl).toBeInTheDocument()

        expect(targetEl).toHaveAttribute('value', 'false')
        expect(inputEl).not.toBeChecked()
    })

    test('read value', () => {
        const { targetEl, inputEl } = init()

        const newValue = 'true'
        targetEl.setAttribute('value', newValue)
        expect(inputEl).toBeChecked()
    })

    test('"controlled input" test', () => {
        const { targetEl, inputEl } = init()

        const modelValue = false
        targetEl.setAttribute('value', modelValue)

        fireEvent.select(inputEl)
        fireEvent.blur(inputEl)
        expect(inputEl).not.toBeChecked()
    })

    test('send events', () => {
        const { targetEl, inputEl } = init()

        const fn = jest.fn()
        targetEl.addEventListener(InputBoolean.EVENT_INPUT, fn)
        expect(fn).toHaveBeenCalledTimes(0)

        fireEvent.select(inputEl)
        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith(new CustomEvent(InputBoolean.EVENT_INPUT, { detail: 'true' }))
    })
})
