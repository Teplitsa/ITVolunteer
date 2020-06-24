export function UserSmallView({user}) {
    if(!user) {
        return null
    }

    return (
        <div className="itv-user-small-view">
            <span className="avatar-wrapper" style={{
                backgroundImage: user.itvAvatar ? `url(${user.itvAvatar})` : "none",
            }}/>

            <span className="name">
                <span>{user.fullName}</span>/{user.memberRole}
            </span>
        </div>
    )
}

export function UserSmallPicView({user}) {
    if(!user) {
        return null
    }

    return (
        <div className="itv-user-small-view">
            <span className="avatar-wrapper" style={{
                backgroundImage: user.itvAvatar ? `url(${user.itvAvatar})` : "none",
            }}/>
        </div>
    )
}
