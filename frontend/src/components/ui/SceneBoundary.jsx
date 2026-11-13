import { Component } from "react";

// WebGL is optional decoration. If a scene fails (no WebGL, lost context, driver issue)
// render nothing and let the CSS backdrop carry the page.
export default class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    if (import.meta.env.DEV) console.warn("3D scene disabled:", error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
