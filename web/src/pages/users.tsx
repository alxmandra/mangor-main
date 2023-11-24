import React, { Suspense } from "react";
import "./users.scss"

export const Users = () => {
  const UsersNG = React.lazy(() =>
    import('../components/foreign_modules/users_from_angular')
      .then(({ UsersTableFormNg }) => ({ default: UsersTableFormNg })))
  return (
    <div className="container pt-5 users_wrapper">
      <div className="row">
        <Suspense fallback={<div>{"loading"}</div>}>
          <UsersNG />
        </Suspense>
      </div>
    </div>
  );
}
