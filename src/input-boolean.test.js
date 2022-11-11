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

        const labelEl = targetEl.querySelector('span')

        return { ...within(targetEl), targetEl, inputEl, labelEl }
    }

    test('rendering with preinitialized properties', () => {
        document.body.innerHTML = '<input-boolean data-testid="input-boolean" value="false"></input-boolean>'
        let targetEl = getByTestId(document.body, 'input-boolean')
        expect(targetEl).toHaveAttribute('value', 'false')

        document.body.innerHTML = '<input-boolean data-testid="input-boolean" value="true"></input-boolean>'
        targetEl = getByTestId(document.body, 'input-boolean')
        expect(targetEl).toHaveAttribute('value', 'true')

        document.body.innerHTML = '<input-boolean data-testid="input-boolean" label="Label1"></input-boolean>'
        targetEl = getByTestId(document.body, 'input-boolean')
        expect(targetEl).toHaveTextContent('Label1')
    })

    test('default state', () => {
        const { targetEl, inputEl, labelEl } = init()

        expect(targetEl).toBeInTheDocument()
        expect(inputEl).toBeInTheDocument()
        expect(labelEl).toBeInTheDocument()

        expect(targetEl).toHaveAttribute('value', 'false')
        expect(inputEl).not.toBeChecked()
        expect(labelEl).toHaveTextContent('')
    })

    test('read value', () => {
        const { targetEl, inputEl } = init()

        targetEl.setAttribute('value', 'true')
        expect(inputEl).toBeChecked()

        targetEl.setAttribute('label', 'Label2')
        expect(targetEl).toHaveTextContent('Label2')
    })

    test('"controlled input" test', () => {
        const { targetEl, inputEl } = init()

        targetEl.setAttribute('value', 'false')
        expect(inputEl).not.toBeChecked()

        fireEvent.click(inputEl)
        fireEvent.blur(inputEl)

        expect(targetEl).toHaveAttribute('value', 'false')
        expect(inputEl).not.toBeChecked()
    })

    test('send events', () => {
        const { targetEl, inputEl } = init()

        const fn = jest.fn()
        targetEl.addEventListener(InputBoolean.EVENT_INPUT, fn)
        expect(fn).toHaveBeenCalledTimes(0)

        fireEvent.click(inputEl)
        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith(new CustomEvent(InputBoolean.EVENT_INPUT, { detail: 'true' }))
    })
})
