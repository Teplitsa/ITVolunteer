import React, {Component} from 'react'

export class UserSmallView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: props.user,
        }
    }

    render() {
        return <div className="itv-user-small-view">
            <span className="avatar-wrapper" style={{
                backgroundImage: this.state.user.avatar_url ? `url(${this.state.user.avatar_url})` : "none",
            }}/>

            <span className="name">
                <span>Александр Гусев</span>/Волонтер
            </span>
        </div>
    }
}
