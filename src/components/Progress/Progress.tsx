function Progress() {
  return (
    <section className="container">
      <div className="is-flex is-flex-direction-column">
        <div>
          <progress
            className="mt-2 progress is-success"
            value="35"
            max="100"
          ></progress>
        </div>
        <div>Getting data in CRM Companies</div>
      </div>
    </section>
  );
}

export { Progress };
