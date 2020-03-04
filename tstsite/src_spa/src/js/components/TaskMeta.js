import React, {Component} from 'react'

export class TaskMetaTerms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            icon: props.icon,
            tags: props.tags,
        }
    }

    render() {
        return <div className="terms">
            { this.state.icon &&
                <img src={this.state.icon} />
            }
            {this.state.tags.map((item, key) =>
                <span key={key}>{item.name}</span>
            )}
        </div>
    }
}

export class TaskMetaInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            icon: props.icon,
            title: props.title,
        }
    }

    render() {
        return <span className="meta-info">
            { this.state.icon &&
                <img src={this.state.icon} />
            }
            { this.state.title &&
                <span>{this.state.title}</span>
            }
        </span>
    }
}
