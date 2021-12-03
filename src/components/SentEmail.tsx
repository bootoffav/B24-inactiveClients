import { useAuth0 } from "@auth0/auth0-react";

function SentEmail() {
  const { user } = useAuth0();

  return (
    <section className="container">
      <div className="notification is-success is-light">
        <p className="is-size-3">
          <strong>Hooray! &#127881;</strong>
        </p>
        <p className="mt-1 is-size-5">
          The report has begun generating, it will take up to 10 minutes to send
          it to{" "}
          <span className="is-italic has-text-weight-semibold">
            {user?.email ?? "your mailbox"}
          </span>
          , meanwhile you may request another report. &#9989;
        </p>
      </div>
    </section>
  );
}

export default SentEmail;
