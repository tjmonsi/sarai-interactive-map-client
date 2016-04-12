import React from 'react';

class Landing extends React.Component {
  componentDidMount() {
    if (componentHandler) {
      componentHandler.upgradeDom();
    }
  }
  componentDidUpdate() {
    console.log('update landing');
    if (componentHandler) {
      componentHandler.upgradeDom();
    }
  }
  renderSection(section, key) {
    return (
      <div
        className="mdl-cell mdl-cell--12-col sarai-map-section"
        key={key}
      >
        {section()}
      </div>
    );
  }
  renderSections() {
    const {sections} = this.props;
    if (typeof sections === 'function') {
      return this.renderSection([ sections ]);
    }
    return sections.map((section, key) => {
      return this.renderSection(section, key);
    });
  }
  render() {
    return (
      <div className="sarai-map-core-root">
        <div className="mdl-layout mdl-js-layout sarai-map-landing">
          <main
            className="sarai-map-main-content mdl-layout__content"
            id="sarai-map-main-content"
          >
            <div className="mdl-grid mdl-grid--no-spacing">
              {this.renderSections()}
            </div>
          </main>
        </div>
      </div>
    );
  }
}


Landing.propTypes = {
  sections: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.func),
    React.PropTypes.func
  ])
};

Landing.defaultProps = {
  sections: () => null,
};

export default Landing;


