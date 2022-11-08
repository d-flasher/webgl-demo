export class InputRange extends HTMLElement {
    static EVENT_INPUT = 'eventInput'

    static get observedAttributes() {
        return ['value', 'min', 'max', 'step']
    }

    constructor() {
        super()
        /** @type {HTMLInputElement} */
        this._rangeEl = null
        /** @type {HTMLInputElement} */
        this._numberEl = null

        this._isRendered = false
    }

    connectedCallback() {
        this._render()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this._render()
        if (oldValue == newValue) return
        if (name === 'value') {
            this._numberEl.value = newValue
            this._rangeEl.value = newValue
        } else {
            this._numberEl[name] = newValue
            this._rangeEl[name] = newValue
        }
    }

    _render() {
        if (this._isRendered) return
        this._isRendered = true

        const template = document.createElement('template')
        template.innerHTML = /* html */`
            <input type="range" class="form-control">
            <input type="number" class="form-control">
        `

        this.append(template.content.cloneNode(true))
        this._rangeEl = this.querySelector('[type=range]')
        this._numberEl = this.querySelector('[type=number]')

        const setDefaultAttr = (name, value) => {
            value = this.getAttribute(name) || value
            this.setAttribute(name, value)
            this._rangeEl.setAttribute(name, value)
            this._numberEl.setAttribute(name, value)
        }
        setDefaultAttr('min', 0)
        setDefaultAttr('max', 100)
        setDefaultAttr('step', 1)
        setDefaultAttr('value', 0)

        this._rangeEl.addEventListener('input', () => this._sendEvent(this._rangeEl.value))
        this._numberEl.addEventListener('input', () => this._sendEvent(this._numberEl.value))

        this._rangeEl.addEventListener('blur', () => this._setSelfValue())
        this._numberEl.addEventListener('blur', () => this._setSelfValue())
    }

    _sendEvent(value) {
        this._rangeEl.value = value
        this._numberEl.value = value
        this.dispatchEvent(
            new CustomEvent(InputRange.EVENT_INPUT, { detail: value })
        )
    }

    _setSelfValue() {
        const selfValue = this.getAttribute('value')
        this._rangeEl.value = selfValue
        this._numberEl.value = selfValue
    }
}
if (!customElements.get('input-range')) customElements.define('input-range', InputRange)
