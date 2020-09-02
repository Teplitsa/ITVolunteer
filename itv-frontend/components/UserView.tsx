export function UserSmallView({ user }) {
  if (!user) {
    return null;
  }

  return (
    <div className="itv-user-small-view">
      <span
        className="avatar-wrapper"
        style={{
          backgroundImage:
            user.itvAvatar && user.itvAvatar.search(/temp-avatar\.png/) === -1
              ? `url(${user.itvAvatar})`
              : "none",
        }}
      />

      <span className="name">
        <span dangerouslySetInnerHTML={{ __html: user.fullName }} />
        &nbsp;/&nbsp;{user.memberRole}
      </span>
    </div>
  );
}

export function UserSmallPicView({ user }) {
  if (!user) {
    return null;
  }

  return (
    <div className="itv-user-small-view">
      <span
        className="avatar-wrapper"
        style={{
          backgroundImage:
            user.itvAvatar && user.itvAvatar.search(/temp-avatar\.png/) === -1
              ? `url(${user.itvAvatar})`
              : "none",
        }}
      />
    </div>
  );
}
