export class InputBoolean extends HTMLElement {
  static EVENT_INPUT = 'changed'

  static get observedAttributes() {
    return ['value', 'label']
  }

  constructor() {
    super()
    /** @type {HTMLInputElement} */
    this._inputEl = null
    /** @type {HTMLInputElement} */
    this._labelEl = null

    this._isRendered = false
  }

  connectedCallback() {
    this._render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._render()
    if (oldValue == newValue) return

    if (name === 'value') {
      this._inputEl.checked = newValue === 'true'
    } else if (name === 'label') {
      this._labelEl.innerHTML = newValue
    }
  }

  _render() {
    if (this._isRendered) return
    this._isRendered = true

    const template = document.createElement('template')
    template.innerHTML = /* html */`
        <label>
          <input type="checkbox" checked="checked"/>
          <span></span>
        </label>
      `

    this.append(template.content.cloneNode(true))
    this._inputEl = this.querySelector('input')
    this._labelEl = this.querySelector('span')

    const defaultValue = this.getAttribute('value') === 'true'
    this.setAttribute('value', String(defaultValue))
    this._inputEl.checked = defaultValue

    this._labelEl.innerHTML = this.getAttribute('label') || ''

    this._inputEl.addEventListener('change', () => this._sendEvent(this._inputEl.checked))

    this._inputEl.addEventListener('blur', () => this._setSelfValue())
  }

  _sendEvent(value) {
    this._inputEl.checked = value
    this.dispatchEvent(
      new CustomEvent(InputBoolean.EVENT_INPUT, { detail: value })
    )
  }

  _setSelfValue() {
    const selfValue = this.getAttribute('value')
    this._inputEl.checked = selfValue === 'true'
  }
}
if (!customElements.get('input-boolean')) customElements.define('input-boolean', InputBoolean)
