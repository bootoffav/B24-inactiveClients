import { SyntheticEvent } from "react";
import { InActiveData } from "../../types";
import { inActivityDataTypes } from "../../helpers";

type EntityCheckingProps = {
  entityToCheck: keyof InActiveData;
  setEntityToCheck: any;
};

const EntityChecking = (props: EntityCheckingProps) => {
  const onClick = (e: SyntheticEvent) => {
    e.preventDefault();
    props.setEntityToCheck((e.currentTarget as HTMLButtonElement).value);
  };

  const icons = {
    company: "building",
    contact: "address-card",
    lead: "handshake",
  };

  return (
    <label>
      CRM entity type to check:
      <div className="field has-addons has-addons-fullwidth">
        {inActivityDataTypes.map((type) => (
          <p className="control" key={type}>
            <button
              className={`button is-info is-fullwidth is-light ${
                type === props.entityToCheck ? "is-active" : ""
              }`}
              onClick={onClick}
              value={type}
            >
              <span className="icon is-small">
                <i className={`far fa-${icons[type]}`} />
              </span>
              <span className="is-capitalized">{type}</span>
            </button>
          </p>
        ))}
      </div>
    </label>
  );
};

export default EntityChecking;
