type GetButtonProps = {
  started: boolean;
  setStarted: any;
  abort: () => void;
};

const GetButton = ({ abort, started, setStarted }: GetButtonProps) => {
  return (
    <>
      {!started && (
        <input
          type="submit"
          className="button is-fullwidth is-info"
          value="Get"
          data-destination="web"
        />
      )}
      {started && (
        <div className="buttons has-addons is-flex-grow-1">
          <button className="button is-loading is-info"></button>
          <button
            className="button is-info is-flex-grow-1"
            onClick={() => {
              abort();
              setStarted(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
};

export default GetButton;
