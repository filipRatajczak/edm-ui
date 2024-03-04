import React, {Component} from 'react';
import { bindActionCreators } from 'redux';

const navigate = {
    PREVIOUS: 'PREV',
    NEXT: 'NEXT',
    TODAY: 'TODAY',
    DATE: 'DATE',
}

class CustomToolbar extends Component {

    render() {
        let {localizer: {messages}, label} = this.props;
        return (
            <div className="rbc-toolbar">
                <span className="rbc-btn-group">
                    <button type="button" className="btn btn-control" onClick={this.navigate.bind(null, navigate.PREVIOUS)}><i className="fa fa-arrow-left"></i> Prev</button>
                </span>
                <span className="rbc-btn-group">
                    <button type="button" className="btn btn-control" onClick={this.navigate.bind(null, navigate.NEXT)}>Next <i className="fa fa-arrow-right"></i></button>
                </span>
                <span className="rbc-toolbar-label">{label}</span>
            </div>
        )
    }
    navigate = action => {
        this.props.onNavigate(action)
    }
}

export default CustomToolbar;