// Plain HTML + the tweak-ui class vocabulary — no Mithril component or UI Builder involved.
export default (element: HTMLElement) => {
  element.classList.add('tweak-ui')
  element.innerHTML = `
    <div class="twk-widget">
      <div class="twk-widget-label">Name</div>
      <div class="twk-input">
        <input type="text" value="Tweak UI" />
      </div>
    </div>

    <div class="twk-widget">
      <div class="twk-widget-label">Quality</div>
      <select>
        <option>Low</option>
        <option selected>Medium</option>
        <option>High</option>
      </select>
    </div>

    <div class="twk-widget">
      <div class="twk-widget-label">Version</div>
      <div class="twk-input twk-input-readonly">
        <div class="twk-input-value">v0.8.0</div>
      </div>
    </div>

    <div class="twk-widget">
      <div class="twk-widget-label">Visible</div>
      <div class="twk-bool-input twk-align-end">
        <input type="checkbox" class="twk-toggle" checked />
      </div>
    </div>

    <div class="twk-widget">
      <div class="twk-widget-label">Locked</div>
      <div class="twk-bool-input twk-align-end">
        <input type="checkbox" class="twk-check" />
      </div>
    </div>

    <div class="twk-widget">
      <div class="twk-widget-label">Preview</div>
      <div class="twk-grid" style="grid-template-columns: repeat(4, 1fr);">
        <div class="twk-bg-checker twk-rounded" style="aspect-ratio: 1;" title="twk-bg-checker"></div>
        <div class="twk-bg-grid twk-rounded" style="aspect-ratio: 1;" title="twk-bg-grid"></div>
        <div class="twk-bg-dots twk-rounded" style="aspect-ratio: 1;" title="twk-bg-dots"></div>
        <div class="twk-bg-stripes twk-rounded" style="aspect-ratio: 1;" title="twk-bg-stripes"></div>
      </div>
    </div>

    <div class="twk-divider">Actions</div>

    <div class="twk-flex-row">
      <button class="twk-btn twk-btn-accent" style="flex: 1;">Save</button>
      <button class="twk-btn" style="flex: 1;">Cancel</button>
      <button class="twk-btn twk-btn-sq" title="More options">&#8942;</button>
    </div>

    <div class="twk-text-sm twk-color-muted">
      Built from plain HTML — no Mithril component involved.
    </div>
  `
}
